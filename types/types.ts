import { ObjectId } from "mongodb";

// User and Authentication Types
export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: string;
  password?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}

export interface CreateUserData {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: string;
  password: string;
  confirmPassword?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthSession {
  token: string;
  user: Omit<User, "password" | "passwordResetToken" | "passwordResetExpires">;
  expiresAt: Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface AuthResponse extends ApiResponse {
  data: AuthSession;
}

// Form Types
export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  organization: string;
  role: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface FormErrors {
  [key: string]: string;
}

// Role Options
export const ROLE_OPTIONS = [
  { value: "security-analyst", label: "Security Analyst" },
  { value: "forensic-investigator", label: "Forensic Investigator" },
  { value: "content-moderator", label: "Content Moderator" },
  { value: "researcher", label: "Researcher" },
  { value: "developer", label: "Developer" },
  { value: "other", label: "Other" },
] as const;

export type UserRole = (typeof ROLE_OPTIONS)[number]["value"];

// Auth Context Actions
export const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  SET_LOADING: "SET_LOADING",
  CLEAR_ERROR: "CLEAR_ERROR",
  UPDATE_USER: "UPDATE_USER",
} as const;

export type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_ERROR" }
  | { type: "UPDATE_USER"; payload: Partial<User> };

// Database Types - Separate interface for MongoDB documents
export interface MongoUser extends Omit<User, "_id"> {
  _id?: ObjectId;
}

// JWT Token Payload
export interface TokenPayload {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  organization: string;
  role: string;
  iat?: number;
  exp?: number;
}
