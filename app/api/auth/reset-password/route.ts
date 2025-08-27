import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/lib/models/User";
import { validatePassword } from "@/lib/auth";
import type { ApiResponse } from "@/types/types";

interface ResetPasswordBody {
  token: string;
  password: string;
  confirmPassword: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ResetPasswordBody = await request.json();
    const { token, password, confirmPassword } = body;

    // Validation
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Reset token is required",
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (!password) {
      return NextResponse.json(
        {
          success: false,
          message: "New password is required",
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (!confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Password confirmation is required",
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match",
        } as ApiResponse,
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        {
          success: false,
          message: "Password must be at least 8 characters with uppercase, lowercase, and number",
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Find user by reset token
    const user = await userRepository.findByResetToken(token);
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token",
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Account is inactive. Please contact support.",
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Reset password
    const resetSuccess = await userRepository.resetPassword(token, password);
    if (!resetSuccess) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to reset password. Please try again.",
        } as ApiResponse,
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Password has been reset successfully. You can now sign in with your new password.",
      } as ApiResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    
    if (error instanceof Error && error.message === "Invalid or expired reset token") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token",
        } as ApiResponse,
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to reset password. Please try again.",
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