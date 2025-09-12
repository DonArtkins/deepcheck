import { NextRequest, NextResponse } from "next/server";
import { analysisRepository } from "@/lib/models/Analysis";

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.headers.get("X-API-Key");
    if (apiKey !== process.env.PYTHON_SERVICE_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      analysis_id,
      isDeepfake,
      confidence,
      processingTime,
      modelUsed,
      anomalies,
      metadata,
    } = body;

    if (!analysis_id) {
      return NextResponse.json(
        { error: "Analysis ID is required" },
        { status: 400 }
      );
    }

    // Update analysis with AI results
    const updateData = {
      status: "completed" as const,
      isDeepfake,
      confidence,
      processingTime,
      detectionMethod: modelUsed,
      anomalies:
        anomalies?.map((anomaly: any) => ({
          type: anomaly.type,
          severity: anomaly.severity,
          description: anomaly.description,
        })) || [],
      analysis: {
        faceRegions: metadata?.faceRegions || 0,
        anomalies: anomalies?.length || 0,
        neuralNetworkScores: {
          faceSwapDetection: metadata?.faceSwapDetection || 0,
          faceReenactmentDetection: metadata?.faceReenactmentDetection || 0,
          speechSynthesisDetection: metadata?.speechSynthesisDetection || 0,
          overallManipulation: confidence || 0,
        },
        frameAnalysis: metadata?.frameAnalysis || [],
      },
    };

    const updatedAnalysis = await analysisRepository.updateWithResults(
      analysis_id,
      updateData
    );

    if (!updatedAnalysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Analysis results updated successfully",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
