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
      error: errorMessage, // In case the AI processing failed
      status: resultStatus, // Allow overriding status (e.g., "failed")
    } = body;

    if (!analysis_id) {
      return NextResponse.json(
        { error: "Analysis ID is required" },
        { status: 400 }
      );
    }

    // Check if analysis exists first
    const existingAnalysis = await analysisRepository.findById(analysis_id);
    if (!existingAnalysis) {
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    // Build update data based on whether processing succeeded or failed
    const updateData: any = {
      status: resultStatus || (errorMessage ? "failed" : "completed"),
      updatedAt: new Date(),
    };

    // Add completion timestamp if successful
    if (updateData.status === "completed") {
      updateData.completedAt = new Date();
    }

    // Add error message if processing failed
    if (errorMessage) {
      updateData.error = errorMessage;
    }

    // Only add successful processing results if no error
    if (!errorMessage && updateData.status === "completed") {
      updateData.isDeepfake = isDeepfake;
      updateData.confidence = confidence;
      updateData.processingTime = processingTime;
      updateData.detectionMethod = modelUsed;

      // Process anomalies with proper typing
      if (anomalies && Array.isArray(anomalies)) {
        updateData.anomalies = anomalies.map((anomaly: any) => ({
          type: anomaly.type || "unknown",
          severity: ["low", "medium", "high"].includes(anomaly.severity)
            ? anomaly.severity
            : "medium",
          description: anomaly.description || "",
        }));
      } else {
        updateData.anomalies = [];
      }

      // Process analysis metadata
      updateData.analysis = {
        faceRegions: metadata?.faceRegions || 0,
        anomalies: anomalies && Array.isArray(anomalies) ? anomalies.length : 0,
        neuralNetworkScores: {
          faceSwapDetection: metadata?.faceSwapDetection || 0,
          faceReenactmentDetection: metadata?.faceReenactmentDetection || 0,
          speechSynthesisDetection: metadata?.speechSynthesisDetection || 0,
          overallManipulation: confidence || 0,
        },
        frameAnalysis: Array.isArray(metadata?.frameAnalysis)
          ? metadata.frameAnalysis
          : [],
      };

      // Process media metadata if provided
      if (metadata) {
        updateData.metadata = {
          codec: metadata.codec,
          framerate: metadata.framerate,
          bitrate: metadata.bitrate,
          colorSpace: metadata.colorSpace,
          duration: metadata.duration,
          dimensions: metadata.dimensions
            ? {
                width: metadata.dimensions.width || 0,
                height: metadata.dimensions.height || 0,
              }
            : undefined,
        };
      }
    }

    const updatedAnalysis = await analysisRepository.updateWithResults(
      analysis_id,
      updateData
    );

    if (!updatedAnalysis) {
      return NextResponse.json(
        { error: "Failed to update analysis" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        updateData.status === "failed"
          ? "Analysis marked as failed"
          : "Analysis results updated successfully",
      data: {
        id: updatedAnalysis.id,
        status: updatedAnalysis.status,
        isDeepfake: updatedAnalysis.isDeepfake,
        confidence: updatedAnalysis.confidence,
        completedAt: updatedAnalysis.completedAt,
        error: updatedAnalysis.error,
      },
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
