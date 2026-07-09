import { NextResponse } from "next/server";
import Supermemory from "supermemory";

// Initialize Supermemory client
const client = new Supermemory({
  apiKey: process.env.SUPERMEMORY_API_KEY!,
  baseURL: process.env.SUPERMEMORY_BASE_URL || "http://localhost:6767",
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { videoUrl, docText, topicName } = body;

    if (!videoUrl || !docText) {
      return NextResponse.json(
        { error: "Both videoUrl and docText are required." },
        { status: 400 }
      ) as any;
    }

    // Generate a unique topic ID
    const topicId = `topic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const name = topicName || `Topic ${new Date().toLocaleDateString()}`;

    console.log(`Ingesting content for topic [${name}] with ID: ${topicId}`);

    // Ingest the documentation text
    const docResponse = await client.add({
      content: docText,
      containerTag: topicId,
      metadata: {
        source: "documentation",
        topicName: name,
      },
    });

    // Ingest the YouTube video URL
    const videoResponse = await client.add({
      content: videoUrl,
      containerTag: topicId,
      metadata: {
        source: "video",
        topicName: name,
      },
    });

    return NextResponse.json({
      success: true,
      topicId,
      topicName: name,
      documents: {
        doc: { id: docResponse.id, status: docResponse.status },
        video: { id: videoResponse.id, status: videoResponse.status },
      },
    });
  } catch (error: any) {
    console.error("Ingestion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to start ingestion process." },
      { status: 500 }
    ) as any;
  }
}
