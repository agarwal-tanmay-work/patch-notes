import { NextResponse } from "next/server";
import Supermemory from "supermemory";

const client = new Supermemory({
  apiKey: process.env.SUPERMEMORY_API_KEY!,
  baseURL: process.env.SUPERMEMORY_BASE_URL || "http://localhost:6767",
});

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    let videoUrl = "";
    let docText = "";
    let topicName = "";
    let videoFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      videoUrl = (formData.get("videoUrl") as string) || "";
      docText = (formData.get("docText") as string) || "";
      topicName = (formData.get("topicName") as string) || "";
      videoFile = formData.get("videoFile") as File;
    } else {
      const body = await request.json();
      videoUrl = body.videoUrl || "";
      docText = body.docText || "";
      topicName = body.topicName || "";
    }

    if (!docText) {
      return NextResponse.json(
        { error: "Documentation text is required." },
        { status: 400 }
      ) as any;
    }

    if (!videoUrl && (!videoFile || videoFile.size === 0)) {
      return NextResponse.json(
        { error: "Either a video URL or video file is required." },
        { status: 400 }
      ) as any;
    }

    // Generate a unique topic ID
    const topicId = `topic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const name = topicName || `Topic ${new Date().toLocaleDateString()}`;

    console.log(`Ingesting content for topic [${name}] with ID: ${topicId}`);

    // 1. Ingest the documentation text
    const docResponse = await client.add({
      content: docText,
      containerTag: topicId,
      metadata: {
        source: "documentation",
        topicName: name,
      },
    });

    // 2. Ingest the YouTube video URL or upload the video file
    let videoResponse;
    if (videoFile && videoFile.size > 0) {
      console.log(`Uploading video file: ${videoFile.name} (${videoFile.size} bytes)`);
      videoResponse = await client.documents.uploadFile({
        file: videoFile,
        containerTag: topicId,
      });
      
      // Let's set a custom type/metadata so that our comparison route matches it as a video
      // Wait, client.documents.uploadFile does not support direct metadata updates on creation,
      // but it will automatically detect the mime type or file extension.
    } else {
      console.log(`Ingesting video URL: ${videoUrl}`);
      videoResponse = await client.add({
        content: videoUrl,
        containerTag: topicId,
        metadata: {
          source: "video",
          topicName: name,
        },
      });
    }

    return NextResponse.json({
      success: true,
      topicId,
      topicName: name,
      documents: {
        doc: { id: docResponse.id, status: docResponse.status },
        video: { id: videoResponse.id, status: videoResponse.status || "queued" },
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
