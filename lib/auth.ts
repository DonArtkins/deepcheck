import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import type { User } from "@/types/types";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

interface TokenPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organization: string;
  role: string;
}

export function generateToken(
  payload: TokenPayload,
  expiresIn: string | number = "7d"
): string {
  const options: SignOptions = {
    expiresIn: expiresIn as number | `${number}${"s" | "m" | "h" | "d"}`,
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & TokenPayload;
    return decoded;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export function generateResetToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

export function sanitizeUser(
  user: any
): Omit<User, "password" | "passwordResetToken" | "passwordResetExpires"> {
  const { password, passwordResetToken, passwordResetExpires, ...sanitized } =
    user;

  // Convert ObjectId to string if it exists
  if (
    sanitized._id &&
    typeof sanitized._id === "object" &&
    sanitized._id.toString
  ) {
    sanitized._id = sanitized._id.toString();
  }

  return sanitized;
}

export function createSession(user: any) {
  // Convert ObjectId to string for token payload
  const userId =
    user._id && typeof user._id === "object" ? user._id.toString() : user._id;

  const tokenPayload: TokenPayload = {
    id: userId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    organization: user.organization,
    role: user.role,
  };

  const token = generateToken(tokenPayload);

  return {
    token,
    user: sanitizeUser(user),
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  };
}

// Extend NextApiRequest to include user
interface AuthenticatedRequest extends NextApiRequest {
  user: TokenPayload;
}

type AuthenticatedHandler = (
  req: AuthenticatedRequest,
  res: NextApiResponse
) => Promise<void> | void;

// Middleware to protect API routes
export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          message: "Access token required",
        });
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      (req as AuthenticatedRequest).user = decoded;
      return handler(req as AuthenticatedRequest, res);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  };
}
