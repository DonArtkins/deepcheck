import { NextRequest, NextResponse } from "next/server";
import { analysisRepository } from "@/lib/models/Analysis";

export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.headers.get("X-API-Key");
    if (apiKey !== process.env.PYTHON_SERVICE_API_KEY) {
      console.error("Webhook unauthorized - invalid API key");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Webhook received:", body);

    const {
      analysis_id,
      isDeepfake,
      confidence,
      processingTime,
      modelUsed,
      anomalies,
      metadata,
      features,
      timestamp,
      mediaType,
      error: errorMessage,
      status: resultStatus,
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
      console.error("Analysis not found:", analysis_id);
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
      updateData.detectionMethod = modelUsed || "AI Analysis";

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

      // Process analysis metadata - match your Python backend structure
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
        features: features
          ? {
              edge_density: features.edge_density || 0,
              texture_variance: features.texture_variance || 0,
              suspicious_score: features.suspicious_score || 0,
              ...features, // Include any other features from your backend
            }
          : undefined,
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

    console.log("Updating analysis with:", updateData);

    const updatedAnalysis = await analysisRepository.updateWithResults(
      analysis_id,
      updateData
    );

    if (!updatedAnalysis) {
      console.error("Failed to update analysis:", analysis_id);
      return NextResponse.json(
        { error: "Failed to update analysis" },
        { status: 500 }
      );
    }

    console.log("Analysis updated successfully:", updatedAnalysis._id);

    return NextResponse.json({
      success: true,
      message:
        updateData.status === "failed"
          ? "Analysis marked as failed"
          : "Analysis results updated successfully",
      data: {
        id: updatedAnalysis._id?.toString(),
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
      {
        error: "Failed to process webhook",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
