import { NextResponse } from "next/server";
import { checkFreshness } from "@/lib/freshness";

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
    const result = await checkFreshness(topicId);

    return NextResponse.json({
      success: true,
      topicId,
      ...result,
    });
  } catch (error: any) {
    console.error("Comparison error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to perform comparison." },
      { status: 500 }
    ) as any;
  }
}
