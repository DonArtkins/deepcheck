"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import type { FormErrors } from "@/types/types";

interface ResetFormData {
  password: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword, isAuthenticated } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<ResetFormData>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);

  // Get token from URL parameters
  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Clear errors when user types
  useEffect(() => {
    if (error || Object.keys(errors).length > 0) {
      setErrors({});
      setError(null);
    }
  }, [formData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.password) {
      newErrors.password = "New password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/.test(
        formData.password
      )
    ) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setError("Invalid reset token");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await resetPassword(token, formData.password, formData.confirmPassword);
      setIsSuccess(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to reset password";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof ResetFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isAuthenticated) {
    return null; // Prevent flash while redirecting
  }

  // Show error state for invalid token
  if (!token && error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-32 h-32 border border-primary/10 rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/6 w-24 h-24 border border-secondary/10 rounded-full animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-accent/10 rounded-full animate-pulse delay-2000" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="DeepCheck Icon"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
              <span className="text-2xl font-mono font-bold">
                DEEP<span className="text-primary">CHECK</span>
              </span>
            </div>
            <h1 className="text-3xl font-mono font-bold mb-2">INVALID LINK</h1>
            <p className="text-muted-foreground">
              The reset link is invalid or has expired
            </p>
          </div>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-8 h-8 text-destructive" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-mono font-semibold">
                    LINK EXPIRED
                  </h2>
                  <p className="text-muted-foreground font-mono text-sm">
                    This password reset link is invalid or has expired. Please
                    request a new password reset.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link href="/auth/forgot-password">
                    <Button
                      variant="default"
                      className="w-full font-mono pulse-glow"
                    >
                      REQUEST NEW RESET LINK
                    </Button>
                  </Link>

                  <Link href="/auth/login">
                    <Button variant="outline" className="w-full font-mono">
                      BACK TO LOGIN
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground font-mono">
              Secure password reset • All requests are logged and monitored
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-32 h-32 border border-primary/10 rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/6 w-24 h-24 border border-secondary/10 rounded-full animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-accent/10 rounded-full animate-pulse delay-2000" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="DeepCheck Icon"
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12"
              />
              <span className="text-2xl font-mono font-bold">
                DEEP<span className="text-primary">CHECK</span>
              </span>
            </div>
            <h1 className="text-3xl font-mono font-bold mb-2">SUCCESS</h1>
            <p className="text-muted-foreground">
              Password updated successfully
            </p>
          </div>

          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center space-y-6">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-xl font-mono font-semibold">
                    PASSWORD UPDATED
                  </h2>
                  <p className="text-muted-foreground font-mono text-sm">
                    Your password has been successfully reset. You can now sign
                    in with your new password.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border/50 rounded p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <div className="space-y-1">
                      <p className="text-xs font-mono font-semibold">
                        SECURITY NOTICE
                      </p>
                      <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                        Your password has been updated and all active sessions
                        have been terminated for security. Please sign in with
                        your new credentials.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/auth/login">
                    <Button
                      variant="default"
                      className="w-full font-mono group pulse-glow"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                      CONTINUE TO LOGIN
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground font-mono">
              Secure password reset • All sessions have been terminated
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main reset password form
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 border border-primary/10 rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-24 h-24 border border-secondary/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-accent/10 rounded-full animate-pulse delay-2000" />

        {/* Matrix-style elements */}
        <div className="absolute top-1/3 left-1/3 w-1 h-20 bg-gradient-to-b from-primary/20 to-transparent rotate-45 matrix-rain" />
        <div className="absolute bottom-1/3 right-1/3 w-1 h-16 bg-gradient-to-b from-secondary/20 to-transparent -rotate-45 matrix-rain delay-1000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image
              src="/logo.png"
              alt="DeepCheck Icon"
              width={48}
              height={48}
              className="w-10 h-10 sm:w-12 sm:h-12"
            />
            <span className="text-2xl font-mono font-bold">
              DEEP<span className="text-primary">CHECK</span>
            </span>
          </div>
          <h1 className="text-3xl font-mono font-bold mb-2">NEW PASSWORD</h1>
          <p className="text-muted-foreground">
            Enter your new password to complete the reset
          </p>
        </div>

        {/* Reset Password Form */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <h2 className="text-xl font-mono font-semibold">
              SET NEW PASSWORD
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="font-mono text-sm">
                  NEW PASSWORD
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      handleInputChange("password", e.target.value)
                    }
                    className={`font-mono bg-background/50 border-border focus:border-primary transition-all duration-300 pr-10 ${
                      errors.password ? "border-destructive" : ""
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-destructive font-mono animate-pulse">
                    {errors.password}
                  </p>
                )}
                <div className="text-xs text-muted-foreground font-mono">
                  Must contain: uppercase, lowercase, number (min 8 chars)
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="font-mono text-sm">
                  CONFIRM PASSWORD
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      handleInputChange("confirmPassword", e.target.value)
                    }
                    className={`font-mono bg-background/50 border-border focus:border-primary transition-all duration-300 pr-10 ${
                      errors.confirmPassword ? "border-destructive" : ""
                    }`}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs text-destructive font-mono animate-pulse">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Global Error Message */}
              {error && (
                <div className="text-sm text-destructive font-mono text-center animate-pulse bg-destructive/10 border border-destructive/20 rounded p-3">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full font-mono group pulse-glow"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    UPDATING PASSWORD...
                  </>
                ) : (
                  <>
                    UPDATE PASSWORD
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Security Info Box */}
            <div className="mt-6 bg-muted/50 border border-border/50 rounded p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-mono font-semibold">
                    PASSWORD REQUIREMENTS
                  </p>
                  <ul className="text-xs font-mono text-muted-foreground leading-relaxed space-y-1">
                    <li>• At least 8 characters long</li>
                    <li>• Contains uppercase letter (A-Z)</li>
                    <li>• Contains lowercase letter (a-z)</li>
                    <li>• Contains at least one number (0-9)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Navigation Link */}
            <div className="flex items-center justify-center text-sm mt-6 pt-6 border-t border-border">
              <Link
                href="/auth/login"
                className="font-mono text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
              >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            Encrypted connection • Your new password will be securely stored
          </p>
        </div>
      </div>
    </div>
  );
}
