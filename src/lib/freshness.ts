import Supermemory from "supermemory";
import dotenv from "dotenv";
import path from "path";

// Load environment variables for standalone execution
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const client = new Supermemory({
  apiKey: process.env.SUPERMEMORY_API_KEY!,
  baseURL: process.env.SUPERMEMORY_BASE_URL || "http://localhost:6767",
});

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^--/, "")
    .replace(/-+$/, "");
}

export interface FactMetadata {
  source?: string;      // e.g. "video", "documentation"
  sourceName?: string;  // e.g. "Tutorial Video A", "Official Docs v6"
  sourceUrl?: string;   // URL or file path
  date?: string;        // YYYY-MM-DD
  topicName?: string;   // e.g. "React Router v6 Redirects"
}

export async function checkFreshness(topicName: string, queryClaim?: string) {
  const containerTag = slugify(topicName);
  console.log(`Checking freshness for topic [${topicName}] (tag: ${containerTag})`);

  // 1. Fetch user profile (synthesized facts)
  const profileRes = await client.profile({
    containerTag,
  });

  // 2. Fetch all memories for the container Tag
  const searchRes = await client.search.memories({
    q: queryClaim || "features api usage guide installation code tutorial difference update deprecated",
    containerTag,
    searchMode: "hybrid",
  });

  const memories = searchRes.results || [];
  const parsedFacts: Array<{
    text: string;
    source: string;
    sourceName: string;
    sourceUrl: string;
    date: string;
  }> = [];

  memories.forEach((item: any) => {
    const text = item.memory || item.chunk || "";
    if (!text) return;

    // Retrieve metadata directly or from documents array
    let metadata: FactMetadata = item.metadata || {};
    if (item.documents && item.documents.length > 0) {
      metadata = { ...item.documents[0].metadata, ...metadata };
    }

    const source = metadata.source || "documentation";
    const sourceName = metadata.sourceName || (source === "video" ? "Tutorial Video" : "Official Docs");
    const sourceUrl = metadata.sourceUrl || "";
    const date = metadata.date || new Date().toISOString().split("T")[0];

    parsedFacts.push({
      text,
      source,
      sourceName,
      sourceUrl,
      date,
    });
  });

  // Fallback to profile memories if parsedFacts is empty
  if (parsedFacts.length === 0) {
    const dynamicMemories = profileRes.profile?.dynamic || [];
    dynamicMemories.forEach((mem: string) => {
      parsedFacts.push({
        text: mem,
        source: "documentation",
        sourceName: "Profile Fact",
        sourceUrl: "",
        date: new Date().toISOString().split("T")[0],
      });
    });
  }

  if (parsedFacts.length === 0) {
    return {
      success: true,
      summary: `No facts found in Supermemory for the topic "${topicName}". Please ingest some facts first.`,
      compatibilityScore: 100,
      comparisons: [],
      graph: { nodes: [], edges: [] },
    };
  }

  // 3. Send to Gemini for timeline construction and comparison
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }

  const prompt = `
You are an expert technical documentation compiler and software archaeologist.
Your job is to analyze facts extracted from different sources over time regarding the topic: "${topicName}".
${queryClaim ? `Specifically investigate the freshness of this claim/query: "${queryClaim}"` : ""}

Here are the facts retrieved from Supermemory (chronological order is determined by their 'date' field):
${parsedFacts.map((f, i) => `[Fact ${i + 1}]
- Date: ${f.date}
- Source Name: ${f.sourceName}
- Source Type: ${f.source}
- Source URL: ${f.sourceUrl}
- Content: ${f.text}`).join("\n\n")}

Perform a rigorous comparison. Group the facts into distinct claims/features. For each feature, construct a historical timeline (chronology) of how the API/method changed over time across the versions.

Format your output as a JSON object matching this structure EXACTLY:
{
  "summary": "Provide a high-level summary of the freshness of claims and a recap of changes.",
  "compatibilityScore": 85, // integer 0-100 indicating general safety/freshness (100 = completely up to date, 0 = completely broken)
  "comparisons": [
    {
      "claim": "The feature or API name",
      "history": [
        {
          "date": "YYYY-MM-DD",
          "source": "Name of the source",
          "statement": "What was claimed in this version",
          "code": "Code snippet if applicable, otherwise empty string"
        }
      ],
      "truth": "The current correct usage according to the latest documentation/source",
      "isOutdated": true, // true if older claims are now wrong
      "severity": "high", // "high" (breaking change), "medium" (deprecation/warning), or "low" (minor info)
      "explanation": "Detailed explanation of what changed, why, and how to migrate.",
      "oldCode": "Code snippet showing the outdated way (if applicable, else empty string)",
      "newCode": "Code snippet showing the current correct way (if applicable, else empty string)"
    }
  ],
  "graph": {
    "nodes": [
      { "id": "node_id", "label": "Short descriptive label", "type": "topic|source|claim|truth" }
    ],
    "edges": [
      { "from": "source_node_id", "to": "target_node_id", "label": "relationship label (e.g. part_of, supersedes, verifies, related_to)" }
    ]
  }
}

Guidelines for the Graph:
- Add a central "topic" node for the overall topic: "${topicName}".
- Add "source" nodes for each unique source name in the facts. Connect them to the topic node with "part_of".
- Add "claim" nodes for outdated/old versions of APIs, and "truth" nodes for the current correct APIs.
- Connect claims/truths to the source they came from with "verifies" or "claims".
- Connect "truth" nodes to the "claim" nodes they replace/update using "supersedes".
- Connect related claims/truths together with "related_to" if they are linked.

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

  try {
    return JSON.parse(resultText.trim());
  } catch (err) {
    console.error("JSON parsing error for response:", resultText);
    throw new Error("Failed to parse freshness comparison JSON from Gemini.");
  }
}
