import { NextRequest, NextResponse } from "next/server";
import { analysisRepository } from "@/lib/models/Analysis";

// Enhanced webhook route with better error handling and logging
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let requestBody: any = {};

  try {
    // Enhanced API key verification with logging
    const apiKey = request.headers.get("X-API-Key");
    const expectedApiKey = process.env.PYTHON_SERVICE_API_KEY;

    if (!expectedApiKey) {
      console.error("PYTHON_SERVICE_API_KEY environment variable not set");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    if (apiKey !== expectedApiKey) {
      console.error("Webhook unauthorized - invalid API key:", {
        receivedKey: apiKey ? `${apiKey.substring(0, 8)}...` : "null",
        expectedKeySet: !!expectedApiKey,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body with error handling
    try {
      requestBody = await request.json();
    } catch (parseError) {
      console.error("Failed to parse webhook request body:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    console.log("Webhook received:", {
      analysis_id: requestBody.analysis_id,
      status: requestBody.status || requestBody.resultStatus,
      hasError: !!requestBody.error,
      timestamp: new Date().toISOString(),
      processingTime: requestBody.processingTime,
    });

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
      // Additional fields for better handling
      fileSize,
      originalFilename,
      processingStage,
      progressPercentage,
    } = requestBody;

    // Validate required fields
    if (!analysis_id) {
      console.error("Webhook missing analysis_id");
      return NextResponse.json(
        { error: "Analysis ID is required" },
        { status: 400 }
      );
    }

    // Check if analysis exists first with better error handling
    let existingAnalysis;
    try {
      existingAnalysis = await analysisRepository.findById(analysis_id);
    } catch (dbError) {
      console.error("Database error when finding analysis:", dbError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (!existingAnalysis) {
      console.error("Analysis not found:", analysis_id);
      return NextResponse.json(
        { error: "Analysis not found" },
        { status: 404 }
      );
    }

    // Determine the final status
    let finalStatus = resultStatus;
    if (!finalStatus) {
      if (errorMessage) {
        finalStatus = "failed";
      } else if (isDeepfake !== undefined || confidence !== undefined) {
        finalStatus = "completed";
      } else {
        finalStatus = "processing";
      }
    }

    // Build update data with comprehensive error handling
    const updateData: any = {
      status: finalStatus,
      updatedAt: new Date(),
    };

    // Add completion timestamp if successful
    if (finalStatus === "completed") {
      updateData.completedAt = new Date();
    }

    // Add error message with enhanced logging
    if (errorMessage) {
      updateData.error = errorMessage;
      console.error("Analysis failed:", {
        analysis_id,
        error: errorMessage,
        originalFilename: existingAnalysis.filename,
        fileSize: existingAnalysis.fileSize,
      });
    }

    // Add progress information for ongoing processing
    if (finalStatus === "processing" && progressPercentage !== undefined) {
      updateData.processingProgress = progressPercentage;
      updateData.processingStage = processingStage || "Processing...";
    }

    // Only add successful processing results if no error and completed
    if (!errorMessage && finalStatus === "completed") {
      updateData.isDeepfake = isDeepfake;
      updateData.confidence = confidence;
      updateData.processingTime = processingTime;
      updateData.detectionMethod = modelUsed || "AI Analysis";

      // Enhanced anomalies processing with validation
      if (anomalies && Array.isArray(anomalies)) {
        updateData.anomalies = anomalies.map((anomaly: any) => {
          // Validate anomaly structure
          const validSeverities = ["low", "medium", "high"];
          return {
            type: anomaly.type || "unknown",
            severity: validSeverities.includes(anomaly.severity)
              ? anomaly.severity
              : "medium",
            description: anomaly.description || "No description provided",
            confidence: anomaly.confidence || 0,
            timestamp: anomaly.timestamp || new Date().toISOString(),
          };
        });
      } else {
        updateData.anomalies = [];
      }

      // Enhanced analysis metadata processing
      updateData.analysis = {
        faceRegions: metadata?.faceRegions || 0,
        anomalies: anomalies && Array.isArray(anomalies) ? anomalies.length : 0,
        neuralNetworkScores: {
          faceSwapDetection: metadata?.faceSwapDetection || 0,
          faceReenactmentDetection: metadata?.faceReenactmentDetection || 0,
          speechSynthesisDetection: metadata?.speechSynthesisDetection || 0,
          overallManipulation: confidence || 0,
          // Additional scores
          temporalConsistency: metadata?.temporalConsistency || 0,
          spatialConsistency: metadata?.spatialConsistency || 0,
        },
        frameAnalysis: Array.isArray(metadata?.frameAnalysis)
          ? metadata.frameAnalysis.map((frame: any) => ({
              frame: frame.frame || 0,
              confidence: frame.confidence || 0,
              anomaly: frame.anomaly || "none",
              timestamp: frame.timestamp || 0,
              suspicious_regions: frame.suspicious_regions || [],
            }))
          : [],
        features: features
          ? {
              edge_density: features.edge_density || 0,
              texture_variance: features.texture_variance || 0,
              suspicious_score: features.suspicious_score || 0,
              color_consistency: features.color_consistency || 0,
              motion_consistency: features.motion_consistency || 0,
              frequency_domain_analysis:
                features.frequency_domain_analysis || {},
              ...features, // Include any other features from your backend
            }
          : undefined,
      };

      // Enhanced media metadata processing
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
          // Additional metadata
          audioCodec: metadata.audioCodec,
          audioSampleRate: metadata.audioSampleRate,
          audioBitrate: metadata.audioBitrate,
          fileFormat: metadata.fileFormat,
          creationTime: metadata.creationTime,
          modificationTime: metadata.modificationTime,
        };
      }

      console.log("Analysis completed successfully:", {
        analysis_id,
        isDeepfake,
        confidence,
        processingTime,
        anomaliesCount: updateData.anomalies.length,
        filename: existingAnalysis.filename,
      });
    }

    // Update database with comprehensive error handling
    let updatedAnalysis;
    try {
      console.log("Updating analysis with data:", {
        analysis_id,
        status: updateData.status,
        hasResults: !!updateData.isDeepfake !== undefined,
        anomaliesCount: updateData.anomalies?.length || 0,
      });

      updatedAnalysis = await analysisRepository.updateWithResults(
        analysis_id,
        updateData
      );
    } catch (updateError) {
      console.error("Database update error:", {
        analysis_id,
        error: updateError,
        updateDataKeys: Object.keys(updateData),
      });
      return NextResponse.json(
        {
          error: "Failed to update analysis",
          details:
            updateError instanceof Error
              ? updateError.message
              : "Unknown error",
        },
        { status: 500 }
      );
    }

    if (!updatedAnalysis) {
      console.error(
        "Failed to update analysis - no result returned:",
        analysis_id
      );
      return NextResponse.json(
        { error: "Failed to update analysis - database operation failed" },
        { status: 500 }
      );
    }

    const processingDuration = Date.now() - startTime;
    console.log("Webhook processed successfully:", {
      analysis_id: updatedAnalysis._id?.toString(),
      status: updatedAnalysis.status,
      isDeepfake: updatedAnalysis.isDeepfake,
      confidence: updatedAnalysis.confidence,
      completedAt: updatedAnalysis.completedAt,
      error: updatedAnalysis.error,
      webhookProcessingTime: `${processingDuration}ms`,
    });

    return NextResponse.json({
      success: true,
      message:
        finalStatus === "failed"
          ? "Analysis marked as failed"
          : finalStatus === "completed"
          ? "Analysis results updated successfully"
          : "Analysis progress updated",
      data: {
        id: updatedAnalysis._id?.toString(),
        status: updatedAnalysis.status,
        isDeepfake: updatedAnalysis.isDeepfake,
        confidence: updatedAnalysis.confidence,
        completedAt: updatedAnalysis.completedAt,
        error: updatedAnalysis.error,
        processingTime: updatedAnalysis.processingTime,
        anomaliesCount: updatedAnalysis.anomalies?.length || 0,
      },
      meta: {
        webhookProcessingTime: processingDuration,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    const processingDuration = Date.now() - startTime;
    console.error("Webhook error:", {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      requestBody: JSON.stringify(requestBody, null, 2),
      processingDuration: `${processingDuration}ms`,
    });

    return NextResponse.json(
      {
        error: "Failed to process webhook",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-API-Key, Authorization",
    },
  });
}
