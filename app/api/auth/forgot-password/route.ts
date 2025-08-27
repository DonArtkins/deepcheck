import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/lib/models/User";
import { validateEmail, generateResetToken } from "@/lib/auth";
import type { ApiResponse } from "@/types/types";

export async function POST(request: NextRequest) {
  try {
    const body: { email: string } = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required",
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (!validateEmail(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address",
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Find user by email
    const user = await userRepository.findByEmail(email.trim().toLowerCase());
    
    // Always return success message for security (don't reveal if email exists)
    const successResponse = {
      success: true,
      message: "If an account with this email exists, you will receive password reset instructions.",
    } as ApiResponse;

    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return NextResponse.json(successResponse, { status: 200 });
    }

    // Check if user is active
    if (!user.isActive) {
      // Return success even if user is inactive (security best practice)
      return NextResponse.json(successResponse, { status: 200 });
    }

    // Generate reset token and set expiration (1 hour)
    const resetToken = generateResetToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to database
    await userRepository.setPasswordResetToken(
      email.trim().toLowerCase(),
      resetToken,
      resetExpires
    );

    // TODO: Send email with reset link
    // For now, we'll log it (remove in production)
    console.log(`Password reset token for ${email}: ${resetToken}`);
    console.log(`Reset URL: ${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password?token=${resetToken}`);

    // In production, you would send an email here:
    // await sendPasswordResetEmail(user.email, resetToken);

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to process password reset request. Please try again.",
      } as ApiResponse,
      { status: 500 }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    {
      success: false,
      message: "Method not allowed",
    } as ApiResponse,
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    {
      success: false,
      message: "Method not allowed",
    } as ApiResponse,
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    {
      success: false,
      message: "Method not allowed",
    } as ApiResponse,
    { status: 405 }
  );
}