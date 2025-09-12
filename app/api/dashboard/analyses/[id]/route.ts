import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth"; // Import your JWT verification function
import { analysisRepository } from "@/lib/models/Analysis";
import cloudinary from "@/lib/cloudinary"; // Import cloudinary for file cleanup

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication using your custom JWT system
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Authorization header required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let user;

    try {
      user = verifyToken(token); // This returns the decoded token payload
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!user.id) {
      return NextResponse.json(
        { success: false, error: "User ID not found in token" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const analysis = await analysisRepository.findById(id);

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: "Analysis not found" },
        { status: 404 }
      );
    }

    // Check if user owns this analysis
    if (analysis.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied. You can only view your own analyses.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      analysis,
    });
  } catch (error) {
    console.error("Get analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analysis" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication using your custom JWT system
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Authorization header required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let user;

    try {
      user = verifyToken(token); // This returns the decoded token payload
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!user.id) {
      return NextResponse.json(
        { success: false, error: "User ID not found in token" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const analysis = await analysisRepository.findById(id);

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: "Analysis not found" },
        { status: 404 }
      );
    }

    // Check if user owns this analysis
    if (analysis.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied. You can only delete your own analyses.",
        },
        { status: 403 }
      );
    }

    // Delete the file from Cloudinary if it exists
    if (analysis.cloudinaryId) {
      try {
        await cloudinary.uploader.destroy(analysis.cloudinaryId);
        console.log(`Deleted file from Cloudinary: ${analysis.cloudinaryId}`);
      } catch (cloudinaryError) {
        console.warn("Failed to delete file from Cloudinary:", cloudinaryError);
        // Continue with database deletion even if Cloudinary deletion fails
      }
    }

    // Delete the analysis record from database
    await analysisRepository.delete(id);

    return NextResponse.json({
      success: true,
      message: "Analysis and associated files deleted successfully",
    });
  } catch (error) {
    console.error("Delete analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete analysis" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication using your custom JWT system
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { success: false, error: "Authorization header required" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    let user;

    try {
      user = verifyToken(token); // This returns the decoded token payload
    } catch (error) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!user.id) {
      return NextResponse.json(
        { success: false, error: "User ID not found in token" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const analysis = await analysisRepository.findById(id);

    if (!analysis) {
      return NextResponse.json(
        { success: false, error: "Analysis not found" },
        { status: 404 }
      );
    }

    // Check if user owns this analysis
    if (analysis.userId !== user.id) {
      return NextResponse.json(
        {
          success: false,
          error: "Access denied. You can only update your own analyses.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    // Only allow updating certain fields for security
    const allowedUpdates = [
      "status",
      "isDeepfake",
      "confidence",
      "processingTime",
      "anomalies",
      "error",
      "completedAt",
    ];

    const updateData: any = {};
    for (const field of allowedUpdates) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Add timestamp for completion
    if (updateData.status === "completed" && !updateData.completedAt) {
      updateData.completedAt = new Date();
    }

    // Fixed: Use updateWithResults method that exists in the repository
    const updatedAnalysis = await analysisRepository.updateWithResults(
      id,
      updateData
    );

    return NextResponse.json({
      success: true,
      analysis: updatedAnalysis,
      message: "Analysis updated successfully",
    });
  } catch (error) {
    console.error("Update analysis error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update analysis" },
      { status: 500 }
    );
  }
}
