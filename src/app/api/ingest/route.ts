import { NextResponse } from "next/server";
import Supermemory from "supermemory";
import { slugify } from "@/lib/freshness";

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
    
    let videoSourceName = "Tutorial Video";
    let videoSourceDate = new Date().toISOString().split("T")[0];
    let docSourceName = "Official Docs";
    let docSourceDate = new Date().toISOString().split("T")[0];

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      videoUrl = (formData.get("videoUrl") as string) || "";
      docText = (formData.get("docText") as string) || "";
      topicName = (formData.get("topicName") as string) || "";
      videoFile = formData.get("videoFile") as File;
      videoSourceName = (formData.get("videoSourceName") as string) || videoSourceName;
      videoSourceDate = (formData.get("videoSourceDate") as string) || videoSourceDate;
      docSourceName = (formData.get("docSourceName") as string) || docSourceName;
      docSourceDate = (formData.get("docSourceDate") as string) || docSourceDate;
    } else {
      const body = await request.json();
      videoUrl = body.videoUrl || "";
      docText = body.docText || "";
      topicName = body.topicName || "";
      videoSourceName = body.videoSourceName || videoSourceName;
      videoSourceDate = body.videoSourceDate || videoSourceDate;
      docSourceName = body.docSourceName || docSourceName;
      docSourceDate = body.docSourceDate || docSourceDate;
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

    // Generate a slugified topic ID to allow grouping multiple versions
    const name = topicName || `Topic ${new Date().toLocaleDateString()}`;
    const topicId = slugify(name);

    console.log(`Ingesting content for topic [${name}] with ID (tag): ${topicId}`);

    // 1. Ingest the documentation text
    const docResponse = await client.add({
      content: docText,
      containerTag: topicId,
      metadata: {
        source: "documentation",
        sourceName: docSourceName,
        sourceUrl: "",
        date: docSourceDate,
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
      
      // Add a text metadata entry since uploaded file metadata is limited
      await client.add({
        content: `Uploaded video file "${videoFile.name}" containing tutorial facts.`,
        containerTag: topicId,
        metadata: {
          source: "video",
          sourceName: videoSourceName,
          sourceUrl: videoFile.name,
          date: videoSourceDate,
          topicName: name,
        },
      });
    } else {
      console.log(`Ingesting video URL: ${videoUrl}`);
      videoResponse = await client.add({
        content: videoUrl,
        containerTag: topicId,
        metadata: {
          source: "video",
          sourceName: videoSourceName,
          sourceUrl: videoUrl,
          date: videoSourceDate,
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
