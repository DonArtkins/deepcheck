import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/lib/models/User";
import { validateEmail, validatePassword, createSession } from "@/lib/auth";
import type { CreateUserData, ApiResponse, AuthResponse } from "@/types/types";

export async function POST(request: NextRequest) {
  try {
    const body: CreateUserData & { confirmPassword: string } =
      await request.json();

    const {
      firstName,
      lastName,
      email,
      organization,
      role,
      password,
      confirmPassword,
    } = body;

    // Validation
    if (
      !firstName ||
      !lastName ||
      !email ||
      !organization ||
      !role ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "All fields are required",
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
          message:
            "Password must be at least 8 characters with uppercase, lowercase, and number",
        } as ApiResponse,
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await userRepository.findByEmail(
      email.trim().toLowerCase()
    );
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists",
        } as ApiResponse,
        { status: 409 }
      );
    }

    // Create user
    const userData: CreateUserData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      organization: organization.trim(),
      role,
      password,
    };

    const user = await userRepository.create(userData);

    // Create session - user will have ObjectId _id which gets converted to string in createSession
    const session = createSession(user);

    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully",
        data: session,
      } as AuthResponse,
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);

    if (
      error instanceof Error &&
      (error.message === "User already exists with this email" ||
        error.message.includes("duplicate key error"))
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists",
        } as ApiResponse,
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Registration failed. Please try again.",
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
