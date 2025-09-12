import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import cloudinary from "@/lib/cloudinary";
import { analysisRepository } from "@/lib/models/Analysis";

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
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

    // Save analysis record to database - Fix property names to match AnalysisResult interface
    const analysisData = {
      userId: (session.user as any).id,
      filename: name || file.name, // Changed from 'name' to 'filename'
      mediaType: "image" as const, // Added required mediaType
      mediaUrl: uploadResponse.secure_url, // Changed from 'imageUrl' to 'mediaUrl'
      cloudinaryId: uploadResponse.public_id, // Changed from 'cloudinaryPublicId' to 'cloudinaryId'
      fileSize: file.size, // Added required fileSize
      uploadDate: new Date(), // Changed from 'uploadedAt' to 'uploadDate'
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
