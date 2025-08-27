"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import type {
  AuthState,
  AuthAction,
  LoginCredentials,
  CreateUserData,
  AuthResponse,
  ApiResponse,
  User,
} from "@/types/types";

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...initialState,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    default:
      return state;
  }
}

// Auth Context Interface
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (
    userData: CreateUserData & { confirmPassword: string }
  ) => Promise<AuthResponse>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<ApiResponse>;
  resetPassword: (
    token: string,
    password: string,
    confirmPassword: string
  ) => Promise<ApiResponse>;
  clearError: () => void;
  updateUser: (userData: Partial<User>) => void;
  apiCall: (url: string, options?: RequestInit) => Promise<any>;
}

// Create context
const AuthContext = createContext<AuthContextType | null>(null);

// Storage keys
const STORAGE_KEYS = {
  TOKEN: "deepcheck_token",
  USER: "deepcheck_user",
};

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
          const userStr = localStorage.getItem(STORAGE_KEYS.USER);

          if (token && userStr) {
            const user = JSON.parse(userStr);
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: { token, user },
            });
          } else {
            dispatch({ type: "SET_LOADING", payload: false });
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        logout();
      }
    };

    initializeAuth();
  }, []);

  // API call helper with auth
  const apiCall = async (
    url: string,
    options: RequestInit = {}
  ): Promise<any> => {
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(state.token && { Authorization: `Bearer ${state.token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  };

  // Login function
  const login = async (
    credentials: LoginCredentials
  ): Promise<AuthResponse> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response: AuthResponse = await apiCall("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      const { token, user } = response.data;

      // Store in localStorage only if window is available
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token, user },
      });

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Login failed";
      dispatch({
        type: "LOGIN_FAILURE",
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Register function
  const register = async (
    userData: CreateUserData & { confirmPassword: string }
  ): Promise<AuthResponse> => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response: AuthResponse = await apiCall("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(userData),
      });

      const { token, user } = response.data;

      // Store in localStorage only if window is available
      if (typeof window !== "undefined") {
        localStorage.setItem(STORAGE_KEYS.TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token, user },
      });

      return response;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      dispatch({
        type: "LOGIN_FAILURE",
        payload: errorMessage,
      });
      throw error;
    }
  };

  // Logout function
  const logout = (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    dispatch({ type: "LOGOUT" });
  };

  // Forgot password function
  const forgotPassword = async (email: string): Promise<ApiResponse> => {
    try {
      const response: ApiResponse = await apiCall("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Reset password function
  const resetPassword = async (
    token: string,
    password: string,
    confirmPassword: string
  ): Promise<ApiResponse> => {
    try {
      const response: ApiResponse = await apiCall("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Clear error function
  const clearError = (): void => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  // Update user function
  const updateUser = (userData: Partial<User>): void => {
    if (state.user && typeof window !== "undefined") {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
      dispatch({
        type: "UPDATE_USER",
        payload: userData,
      });
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    clearError,
    updateUser,
    apiCall,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
