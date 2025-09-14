import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import { analysisRepository } from "@/lib/models/Analysis";

// Comprehensive MIME type mappings
const ALLOWED_MIME_TYPES = {
  // Images
  "image/jpeg": "image",
  "image/jpg": "image",
  "image/png": "image",
  "image/gif": "image",
  "image/bmp": "image",
  "image/tiff": "image",
  "image/webp": "image",
  "image/svg+xml": "image",
  "image/x-icon": "image",
  "image/heif": "image",
  "image/heic": "image",
  "image/avif": "image",

  // Videos
  "video/mp4": "video",
  "video/x-m4v": "video",
  "video/quicktime": "video",
  "video/x-msvideo": "video",
  "video/x-ms-wmv": "video",
  "video/x-flv": "video",
  "video/x-matroska": "video",
  "video/webm": "video",
  "video/3gpp": "video",
  "video/3gpp2": "video",
  "video/mpeg": "video",
  "video/ogg": "video",
  "video/mp2t": "video",
  "video/mov": "video",
  "video/avi": "video",
  "video/mkv": "video",
  "video/flv": "video",

  // Audio
  "audio/mpeg": "audio",
  "audio/wav": "audio",
  "audio/aac": "audio",
  "audio/ogg": "audio",
  "audio/mp4": "audio",
  "audio/flac": "audio",
  "audio/opus": "audio",
  "audio/webm": "audio",
  "audio/midi": "audio",
  "audio/aiff": "audio",
  "audio/amr": "audio",
  "audio/mp3": "audio",
  "audio/m4a": "audio",
  "audio/weba": "audio",
  "audio/x-wav": "audio",
  "audio/x-aac": "audio",
  "audio/x-flac": "audio",
};

// Helper function to determine media type from MIME type
function getMediaTypeFromMime(
  mimeType: string
): "image" | "video" | "audio" | null {
  const normalizedMime = mimeType.toLowerCase();
  return (
    (ALLOWED_MIME_TYPES[normalizedMime as keyof typeof ALLOWED_MIME_TYPES] as
      | "image"
      | "video"
      | "audio") || null
  );
}

// Helper function to get Cloudinary resource type
function getCloudinaryResourceType(
  mediaType: "image" | "video" | "audio"
): string {
  switch (mediaType) {
    case "image":
      return "image";
    case "video":
      return "video";
    case "audio":
      return "raw"; // Cloudinary handles audio as raw files
    default:
      return "raw";
  }
}

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

    console.log(
      `Processing file: ${file.name}, Type: ${file.type}, Size: ${file.size} bytes`
    );

    // Determine media type based on file MIME type
    const mediaType = getMediaTypeFromMime(file.type);

    if (!mediaType) {
      const supportedTypes = Object.keys(ALLOWED_MIME_TYPES).join(", ");
      return NextResponse.json(
        {
          success: false,
          message: `Unsupported file type: ${file.type}. Supported types: ${supportedTypes}`,
        },
        { status: 400 }
      );
    }

    // Validate file size - Set generous limits but still reasonable
    const maxSizes = {
      image: 50 * 1024 * 1024, // 50MB for images
      video: 2 * 1024 * 1024 * 1024, // 2GB for videos
      audio: 500 * 1024 * 1024, // 500MB for audio
    };

    const maxSize = maxSizes[mediaType];
    if (file.size > maxSize) {
      const maxSizeMB = maxSize / (1024 * 1024);
      return NextResponse.json(
        {
          success: false,
          message: `File too large. Maximum size for ${mediaType} files is ${maxSizeMB}MB`,
        },
        { status: 400 }
      );
    }

    // Convert file to buffer
    console.log("Converting file to buffer...");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    console.log(`Buffer created, size: ${buffer.length} bytes`);

    // Get Cloudinary resource type
    const resourceType = getCloudinaryResourceType(mediaType);
    console.log(`Using Cloudinary resource type: ${resourceType}`);

    // Upload to Cloudinary with optimized settings for large files
    console.log("Starting Cloudinary upload...");
    const uploadResponse = await new Promise<any>((resolve, reject) => {
      const uploadOptions: any = {
        resource_type: resourceType,
        folder: "deepcheck/uploads",
        // Increased timeout for large files
        timeout: 300000, // 5 minutes
        // Add chunk size for large files
        chunk_size: 6000000, // 6MB chunks
        // Quality settings based on media type
        ...(mediaType === "video" && {
          quality: "auto:good",
          fetch_format: "auto",
          // Allow longer videos
          eager_async: true,
        }),
        ...(mediaType === "image" && {
          quality: "auto:good",
          fetch_format: "auto",
        }),
        ...(mediaType === "audio" && {
          // For audio files as raw
          resource_type: "raw",
        }),
      };

      cloudinary.uploader
        .upload_stream(uploadOptions, (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log("Cloudinary upload successful:", result?.public_id);
            resolve(result);
          }
        })
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

    console.log("Saving analysis to database...");
    const analysis = await analysisRepository.create(analysisData);
    console.log(`Analysis saved with ID: ${analysis._id}`);

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
        file_size: file.size,
        original_filename: file.name,
      };

      console.log("Sending to Python backend:", {
        ...analysisRequest,
        media_url: "[URL_HIDDEN]",
      });

      const backendResponse = await fetch(`${backendUrl}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": backendApiKey,
        },
        body: JSON.stringify(analysisRequest),
        // Increased timeout for backend communication
        signal: AbortSignal.timeout(30000), // 30 seconds
      });

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        console.error("Backend analysis request failed:", errorText);

        // Update analysis status to failed
        await analysisRepository.updateWithResults(
          analysis._id?.toString() || "",
          {
            status: "failed",
            error: `Backend analysis failed: ${backendResponse.status} - ${errorText}`,
          }
        );

        return NextResponse.json(
          {
            success: false,
            message: `Analysis request failed: ${backendResponse.statusText}`,
          },
          { status: 500 }
        );
      }

      const backendResult = await backendResponse.json();
      console.log(
        "Backend response received:",
        backendResult.message || "Success"
      );

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
        fileSize: analysis.fileSize,
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
