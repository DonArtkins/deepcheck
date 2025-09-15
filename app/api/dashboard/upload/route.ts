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

// Helper function to sanitize filename for Cloudinary
function sanitizeFilename(filename: string): string {
  const nameWithoutExt = filename.replace(/\.[^/.]+$/, "");
  return (
    nameWithoutExt
      .replace(/[\s\(\)\[\]{}'"`,;!@#$%^&*+=<>?/\\|:]/g, "_")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "")
      .substring(0, 100) || `file_${Date.now()}`
  );
}

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
      return "raw";
    default:
      return "raw";
  }
}

// Helper function to get optimal upload settings based on file size
function getOptimalUploadSettings(fileSize: number, mediaType: string) {
  const sizeMB = fileSize / (1024 * 1024);

  // Base settings
  let settings = {
    timeout: 300000, // 5 minutes default
    chunk_size: 6000000, // 6MB chunks default
    eager_async: false,
    use_chunked_encoding: true,
  };

  // Adjust based on file size
  if (sizeMB > 500) {
    // Files larger than 500MB
    settings = {
      ...settings,
      timeout: 1800000, // 30 minutes
      chunk_size: 20000000, // 20MB chunks for very large files
      eager_async: true, // Process transformations asynchronously
    };
  } else if (sizeMB > 100) {
    // Files larger than 100MB
    settings = {
      ...settings,
      timeout: 900000, // 15 minutes
      chunk_size: 10000000, // 10MB chunks
      eager_async: true,
    };
  } else if (sizeMB > 50) {
    // Files larger than 50MB
    settings = {
      ...settings,
      timeout: 600000, // 10 minutes
      chunk_size: 8000000, // 8MB chunks
      eager_async: mediaType === "video", // Only videos async for medium files
    };
  }

  return settings;
}

// Asynchronous function to send to backend (non-blocking)
async function sendToBackendAsync(analysisData: any, analysisId: string) {
  try {
    const backendUrl =
      process.env.PYTHON_SERVICE_URL || "http://localhost:8080";
    const backendApiKey = process.env.PYTHON_SERVICE_API_KEY;

    if (!backendApiKey) {
      throw new Error("Python service API key not configured");
    }

    console.log("Sending to Python backend asynchronously:", {
      ...analysisData,
      media_url: "[URL_HIDDEN]",
    });

    // Use a much longer timeout for backend processing
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minutes for backend request

    try {
      const backendResponse = await fetch(`${backendUrl}/api/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": backendApiKey,
        },
        body: JSON.stringify(analysisData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!backendResponse.ok) {
        const errorText = await backendResponse.text();
        console.error("Backend analysis request failed:", errorText);

        // Update analysis status to failed
        await analysisRepository.updateWithResults(analysisId, {
          status: "failed",
          error: `Backend analysis failed: ${backendResponse.status} - ${errorText}`,
        });

        return false;
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

        await analysisRepository.updateWithResults(analysisId, updateData);
      } else {
        // Asynchronous response - backend will send webhook later
        await analysisRepository.updateWithResults(analysisId, {
          status: "processing",
        });
      }

      return true;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);

      if (fetchError.name === "AbortError") {
        console.error("Backend request timed out");
        await analysisRepository.updateWithResults(analysisId, {
          status: "failed",
          error: "Backend analysis request timed out after 5 minutes",
        });
      } else {
        throw fetchError;
      }

      return false;
    }
  } catch (error) {
    console.error("Backend communication error:", error);

    // Update analysis status to failed
    await analysisRepository.updateWithResults(analysisId, {
      status: "failed",
      error: `Backend communication failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    });

    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify Cloudinary configuration
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error("Cloudinary environment variables missing:", {
        CLOUDINARY_CLOUD_NAME: !!process.env.CLOUDINARY_CLOUD_NAME,
        CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
        CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
      });
      return NextResponse.json(
        { success: false, message: "Cloudinary configuration error" },
        { status: 500 }
      );
    }

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

    // Use the original filename with better sanitization
    const originalFilename = name || file.name;
    const sanitizedFilename = sanitizeFilename(originalFilename);

    console.log(
      `Processing file: ${originalFilename}, Sanitized: ${sanitizedFilename}, Type: ${file.type}, Size: ${file.size} bytes`
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
      video: 5 * 1024 * 1024 * 1024, // 5GB for videos (increased)
      audio: 1024 * 1024 * 1024, // 1GB for audio (increased)
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

    // Get Cloudinary resource type and optimal settings
    const resourceType = getCloudinaryResourceType(mediaType);
    const uploadSettings = getOptimalUploadSettings(file.size, mediaType);

    console.log(`Using Cloudinary resource type: ${resourceType}`);
    console.log("Upload settings:", uploadSettings);

    // Create a unique public_id with timestamp to avoid conflicts
    const timestamp = Date.now();
    const publicId = `${sanitizedFilename}_${timestamp}`;

    // Upload to Cloudinary with optimized settings for large files
    console.log("Starting Cloudinary upload...");
    const uploadResponse = await new Promise<any>((resolve, reject) => {
      const uploadOptions: any = {
        resource_type: resourceType,
        folder: "deepcheck/uploads",
        public_id: publicId,
        ...uploadSettings, // Apply optimal settings
        // Preserve original filename in metadata
        context: `original_filename=${originalFilename}`,
        // Quality settings based on media type
        ...(mediaType === "video" && {
          quality: "auto:good",
          fetch_format: "auto",
          // Allow longer videos with better settings
          eager_async: uploadSettings.eager_async,
          // Add video-specific optimizations
          video_codec: "auto",
          audio_codec: "auto",
        }),
        ...(mediaType === "image" && {
          quality: "auto:good",
          fetch_format: "auto",
          // Image-specific optimizations
          flags: "progressive",
        }),
        ...(mediaType === "audio" && {
          // For audio files as raw with better handling
          resource_type: "raw",
          // Audio-specific metadata preservation
          format: "auto",
        }),
      };

      console.log("Upload options:", {
        resource_type: uploadOptions.resource_type,
        folder: uploadOptions.folder,
        public_id: uploadOptions.public_id,
        timeout: uploadOptions.timeout,
        chunk_size: uploadOptions.chunk_size,
        eager_async: uploadOptions.eager_async,
      });

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
      filename: originalFilename, // Store original filename
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

    // Prepare backend request data
    const backendRequestData = {
      media_url: uploadResponse.secure_url,
      media_type: mediaType,
      analysis_id: analysis._id?.toString(),
      webhook_url: `${process.env.NEXTAUTH_URL}/api/dashboard/webhook/ai-results`,
      file_size: file.size,
      original_filename: originalFilename,
    };

    // Send to backend asynchronously without blocking the response
    // Don't await this - let it run in the background
    sendToBackendAsync(backendRequestData, analysis._id?.toString() || "")
      .then((success) => {
        if (success) {
          console.log("Backend request initiated successfully");
        } else {
          console.log("Backend request failed, but upload completed");
        }
      })
      .catch((error) => {
        console.error("Background backend request error:", error);
      });

    // Return success immediately after Cloudinary upload and DB save
    // Don't wait for backend processing
    return NextResponse.json({
      success: true,
      data: {
        id: analysis._id?.toString(),
        name: analysis.filename,
        imageUrl: analysis.mediaUrl,
        mediaType: analysis.mediaType,
        status: "processing", // Set to processing since backend will handle it
        fileSize: analysis.fileSize,
      },
      message: "File uploaded successfully and analysis started",
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
