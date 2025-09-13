import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { analysisRepository } from "@/lib/models/Analysis";

export async function POST(request: NextRequest) {
  try {
    // Check authentication using your custom JWT system
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, message: "Authorization header required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let user;

    try {
      user = verifyToken(token);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const name = formData.get("name") as string | null;
    const description = formData.get("description") as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Determine media type based on file type
    let mediaType: "image" | "video" | "audio";
    if (file.type.startsWith("image/")) {
      mediaType = "image";
    } else if (file.type.startsWith("video/")) {
      mediaType = "video";
    } else if (file.type.startsWith("audio/")) {
      mediaType = "audio";
    } else {
      return NextResponse.json(
        { success: false, message: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Validate file type more specifically
    const allowedTypes = [
      // Images
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/bmp",
      "image/tiff",
      // Videos
      "video/mp4",
      "video/mov",
      "video/avi",
      "video/mkv",
      "video/webm",
      "video/flv",
      // Audio
      "audio/wav",
      "audio/mp3",
      "audio/flac",
      "audio/aac",
      "audio/ogg",
      "audio/m4a",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type" },
        { status: 400 }
      );
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: "File too large. Maximum size is 100MB" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResponse = await new Promise<any>((resolve, reject) => {
      const resourceType =
        mediaType === "image"
          ? "image"
          : mediaType === "video"
          ? "video"
          : "raw";

      cloudinary.uploader
        .upload_stream(
          {
            resource_type: resourceType,
            folder: "deepcheck/uploads",
            // For audio files, we might want to use 'raw' resource type
            ...(mediaType === "audio" && { resource_type: "raw" }),
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    // Save analysis record to database
    const analysisData = {
      userId: user.id,
      filename: name || file.name,
      mediaType: mediaType,
      mediaUrl: uploadResponse.secure_url,
      cloudinaryId: uploadResponse.public_id,
      fileSize: file.size,
      uploadDate: new Date(),
      status: "pending" as const,
    };

    const analysis = await analysisRepository.create(analysisData);

    // Send to Python backend for analysis
    try {
      const backendUrl =
        process.env.PYTHON_SERVICE_URL || "http://localhost:8080";
      const backendApiKey = process.env.PYTHON_SERVICE_API_KEY;

      if (!backendApiKey) {
        throw new Error("Python service API key not configured");
      }

      const analysisRequest = {
        media_url: uploadResponse.secure_url,
        media_type: mediaType,
        analysis_id: analysis._id?.toString(),
        webhook_url: `${process.env.NEXTAUTH_URL}/api/dashboard/webhook/ai-results`,
      };

      console.log("Sending to Python backend:", analysisRequest);

      const backendResponse = await fetch(`${backendUrl}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": backendApiKey,
        },
        body: JSON.stringify(analysisRequest),
      });

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        console.error("Backend analysis request failed:", errorText);

        // Update analysis status to failed
        await analysisRepository.updateWithResults(
          analysis._id?.toString() || "",
          {
            status: "failed",
            error: `Backend analysis failed: ${backendResponse.status}`,
          }
        );

        return NextResponse.json(
          { success: false, message: "Analysis request failed" },
          { status: 500 }
        );
      }

      const backendResult = await backendResponse.json();
      console.log("Backend response:", backendResult);

      // Check if backend returned immediate results (synchronous) or will send webhook (asynchronous)
      if (backendResult.isDeepfake !== undefined) {
        // Synchronous response - update database immediately
        const updateData = {
          status: "completed" as const,
          isDeepfake: backendResult.isDeepfake,
          confidence: backendResult.confidence,
          processingTime: backendResult.processingTime,
          detectionMethod: backendResult.modelUsed,
          anomalies: backendResult.anomalies || [],
          completedAt: new Date(),
        };

        await analysisRepository.updateWithResults(
          analysis._id?.toString() || "",
          updateData
        );
      } else {
        // Asynchronous response - backend will send webhook later
        await analysisRepository.updateWithResults(
          analysis._id?.toString() || "",
          {
            status: "processing",
          }
        );
      }
    } catch (backendError) {
      console.error("Backend communication error:", backendError);

      // Update analysis status to failed
      await analysisRepository.updateWithResults(
        analysis._id?.toString() || "",
        {
          status: "failed",
          error: `Backend communication failed: ${
            backendError instanceof Error
              ? backendError.message
              : "Unknown error"
          }`,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: analysis._id?.toString(),
        name: analysis.filename,
        imageUrl: analysis.mediaUrl,
        mediaType: analysis.mediaType,
        status: analysis.status,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      {
        success: false,
        message: `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      },
      { status: 500 }
    );
  }
}
