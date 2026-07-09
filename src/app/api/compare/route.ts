import { NextResponse } from "next/server";
import Supermemory from "supermemory";

const client = new Supermemory({
  apiKey: process.env.SUPERMEMORY_API_KEY!,
  baseURL: process.env.SUPERMEMORY_BASE_URL || "http://localhost:6767",
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get("topicId");

    if (!topicId) {
      return NextResponse.json(
        { error: "topicId query parameter is required." },
        { status: 400 }
      ) as any;
    }

    console.log(`Comparing documents for topicId: ${topicId}`);

    // 1. Fetch the user profile (synthesized facts)
    const profileRes = await client.profile({
      containerTag: topicId,
    });

    // 2. Fetch all memories via a broad search to capture specific detail chunks
    const searchRes = await client.search.memories({
      q: "features api usage guide installation code tutorial difference update deprecated",
      containerTag: topicId,
      searchMode: "hybrid",
    });

    // 3. Process and group facts from profile and search results
    const docFacts: string[] = [];
    const videoFacts: string[] = [];

    // Process profile dynamic memories (usually facts extracted by the engine)
    const dynamicMemories = profileRes.profile?.dynamic || [];
    // Note: profile memories do not always have source metadata attached directly,
    // so we will prioritize search results which do have metadata.

    const results = searchRes.results || [];
    results.forEach((item: any) => {
      // It can be a fact (memory) or a raw chunk (chunk)
      const text = item.memory || item.chunk || "";
      if (!text) return;

      // Extract source from item metadata or nested document metadata
      let source = item.metadata?.source;
      let type = item.type;
      let mimeType = item.metadata?.mimeType;

      if (item.documents && item.documents.length > 0) {
        if (!source) source = item.documents[0].metadata?.source;
        if (!type) type = item.documents[0].type;
        if (!mimeType) mimeType = item.documents[0].metadata?.mimeType;
      }

      if (source === "documentation") {
        docFacts.push(text);
      } else if (source === "video" || type === "video" || (mimeType && mimeType.startsWith("video/"))) {
        videoFacts.push(text);
      } else {
        // Fallback: search if text mentions video or doc, or add to both as context
        if (text.toLowerCase().includes("video") || text.toLowerCase().includes("tutorial")) {
          videoFacts.push(text);
        } else {
          docFacts.push(text);
        }
      }
    });

    // If search results were sparse, append dynamic memories to documentation as fallback
    if (docFacts.length === 0) {
      dynamicMemories.forEach((mem: string) => docFacts.push(mem));
    }

    console.log(`Extracted ${docFacts.length} doc facts and ${videoFacts.length} video facts.`);

    // 4. Send facts to Gemini to perform the comparison
    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
      return NextResponse.json({
        success: true,
        summary: "Supermemory facts retrieved, but Gemini API key is missing. Cannot perform comparison.",
        compatibilityScore: 100,
        comparisons: [],
        rawFacts: { docFacts, videoFacts }
      });
    }

    const prompt = `
You are an expert technical documentation compiler. Your job is to compare a tutorial video's claims with the current official documentation to highlight outdated claims, deprecated functions, and code changes.

Here are the facts extracted from the TUTORIAL VIDEO:
${videoFacts.map((f, i) => `- ${f}`).join("\n") || "No specific video facts extracted."}

Here are the facts extracted from the CURRENT DOCUMENTATION:
${docFacts.map((f, i) => `- ${f}`).join("\n") || "No specific documentation facts extracted."}

Perform a rigorous comparison. Identify discrepancies, outdated practices in the video, and the current truth in the documentation.
Format your output as a JSON object matching this structure EXACTLY:
{
  "summary": "Provide a high-level summary of how outdated the video is compared to the documentation.",
  "compatibilityScore": 85, // an integer from 0 to 100 representing how compatible the video's claims are with current documentation
  "comparisons": [
    {
      "claim": "Outdated claim made in the video",
      "truth": "Current truth in the documentation",
      "isOutdated": true, // false if the video claim is still correct and matches the documentation
      "severity": "high", // "high" (breaking changes/errors), "medium" (deprecation warnings/suboptimal patterns), or "low" (minor naming/aesthetic changes)
      "explanation": "Detailed explanation of what changed, why it changed, and what the developer needs to do.",
      "oldCode": "Code snippet showing the outdated way (if applicable, else empty string)",
      "newCode": "Code snippet showing the current correct way (if applicable, else empty string)"
    }
  ]
}

Ensure the output is valid JSON. Do not include markdown code block formatting (like \`\`\`json) in the response. Return ONLY the raw JSON string.
`;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`;
    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${errorText}`);
    }

    const geminiData = await response.json();
    const resultText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error("Empty response from Gemini.");
    }

    const parsedResult = JSON.parse(resultText.trim());

    return NextResponse.json({
      success: true,
      topicId,
      summary: parsedResult.summary,
      compatibilityScore: parsedResult.compatibilityScore,
      comparisons: parsedResult.comparisons || [],
    });

  } catch (error: any) {
    console.error("Comparison error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to perform comparison." },
      { status: 500 }
    ) as any;
  }
}
