import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { analysisRepository } from "@/lib/models/Analysis";

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status"); // Optional status filter
    const mediaType = searchParams.get("mediaType"); // Optional media type filter
    const skip = (page - 1) * limit;

    // Build query options - Fixed: removed userId duplication and made it properly typed
    const queryOptions: any = {};
    if (status) queryOptions.status = status;
    if (mediaType) queryOptions.mediaType = mediaType;

    // Fixed: Updated method call to match the actual repository implementation
    const analyses = await analysisRepository.findByUserId(
      user.id,
      limit,
      skip
    );

    // Fixed: Added count method implementation
    const totalCount = await analysisRepository.countByUserId(user.id);

    return NextResponse.json({
      success: true,
      analyses,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + analyses.length < totalCount,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Get analyses error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch analyses" },
      { status: 500 }
    );
  }
}
