import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth"; // Import your JWT verification function
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
      user = verifyToken(token); // This returns the decoded token payload
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

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Invalid file type" },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResponse = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: "image",
            folder: "deepcheck/uploads",
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
      userId: user.id, // Use the user ID from the decoded token
      filename: name || file.name,
      mediaType: "image" as const,
      mediaUrl: uploadResponse.secure_url,
      cloudinaryId: uploadResponse.public_id,
      fileSize: file.size,
      uploadDate: new Date(),
      status: "pending" as const,
    };

    const analysis = await analysisRepository.create(analysisData);

    return NextResponse.json({
      success: true,
      data: {
        id: analysis._id?.toString(),
        name: analysis.filename,
        imageUrl: analysis.mediaUrl,
        status: analysis.status,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { success: false, message: "Upload failed" },
      { status: 500 }
    );
  }
}
