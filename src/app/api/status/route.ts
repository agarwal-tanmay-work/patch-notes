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

    // List documents for this topic
    const docList = await client.documents.list({
      containerTags: [topicId],
    });

    return NextResponse.json({
      success: true,
      topicId,
      memories: docList.memories || [],
      pagination: docList.pagination || {},
    });
  } catch (error: any) {
    console.error("Status check error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to retrieve status." },
      { status: 500 }
    ) as any;
  }
}
