import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/lib/models/User";
import { validateEmail, createSession } from "@/lib/auth";
import type {
  LoginCredentials,
  ApiResponse,
  AuthResponse,
} from "@/types/types";

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required",
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

    // Find user
    const user = await userRepository.findByEmail(email.trim().toLowerCase());
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        } as ApiResponse,
        { status: 401 }
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

    // Verify password - assuming your user model has a comparePassword method
    let isValidPassword = false;
    if (typeof user.comparePassword === "function") {
      isValidPassword = await user.comparePassword(password);
    } else {
      // Fallback if comparePassword method doesn't exist
      // You'll need to implement password comparison logic here
      // This is a simplified example - DO NOT use in production
      const bcrypt = require("bcryptjs");
      isValidPassword = await bcrypt.compare(password, user.password);
    }

    if (!isValidPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password",
        } as ApiResponse,
        { status: 401 }
      );
    }

    // Update last login - Fix the type issue here
    try {
      if (user._id) {
        const userIdString = user._id.toString();
        await userRepository.updateLastLogin(userIdString);
      }
    } catch (error) {
      console.warn("Failed to update last login:", error);
      // Don't fail the login for this
    }

    // Create session - user will have ObjectId _id which gets converted to string in createSession
    const session = createSession(user);

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        data: session,
      } as AuthResponse,
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Login failed. Please try again.",
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
