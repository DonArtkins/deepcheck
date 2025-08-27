"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Shield,
  ArrowRight,
  Loader2,
  Mail,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import type { FormErrors } from "@/types/types";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { forgotPassword, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);

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
  }, [email]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await forgotPassword(email.trim());
      setIsSubmitted(true);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to send reset email";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (isAuthenticated) {
    return null; // Prevent flash while redirecting
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/6 w-32 h-32 border border-primary/10 rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/6 w-24 h-24 border border-secondary/10 rounded-full animate-pulse delay-1000" />
          <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-accent/10 rounded-full animate-pulse delay-2000" />
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
            <h1 className="text-3xl font-mono font-bold mb-2">CHECK EMAIL</h1>
            <p className="text-muted-foreground">
              Reset instructions have been dispatched
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
                    INSTRUCTIONS SENT
                  </h2>
                  <p className="text-muted-foreground font-mono text-sm">
                    If an account exists for{" "}
                    <span className="text-foreground font-semibold">
                      {email}
                    </span>
                    , you will receive password reset instructions within a few
                    minutes.
                  </p>
                </div>

                <div className="bg-muted/50 border border-border/50 rounded p-4">
                  <p className="text-xs font-mono text-muted-foreground">
                    • Check your spam folder if you don't see the email
                    <br />
                    • The reset link expires in 1 hour
                    <br />• Contact support if you need assistance
                  </p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                      setErrors({});
                      setError(null);
                    }}
                    variant="outline"
                    className="w-full font-mono"
                  >
                    SEND TO DIFFERENT EMAIL
                  </Button>

                  <Link href="/auth/login">
                    <Button
                      variant="default"
                      className="w-full font-mono group pulse-glow"
                    >
                      <ArrowLeft className="mr-2 w-4 h-4 group-hover:-translate-x-1 transition-transform" />
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
          <h1 className="text-3xl font-mono font-bold mb-2">RESET REQUEST</h1>
          <p className="text-muted-foreground">
            Enter your email to receive password reset instructions
          </p>
        </div>

        {/* Forgot Password Form */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <h2 className="text-xl font-mono font-semibold">
              PASSWORD RECOVERY
            </h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono text-sm">
                  EMAIL ADDRESS
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`font-mono bg-background/50 border-border focus:border-primary transition-all duration-300 pl-10 ${
                      errors.email ? "border-destructive" : ""
                    }`}
                    placeholder="user@example.com"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-destructive font-mono animate-pulse">
                    {errors.email}
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
                    SENDING INSTRUCTIONS...
                  </>
                ) : (
                  <>
                    SEND RESET LINK
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Info Box */}
            <div className="mt-6 bg-muted/50 border border-border/50 rounded p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-xs font-mono font-semibold">
                    SECURITY NOTICE
                  </p>
                  <p className="text-xs font-mono text-muted-foreground leading-relaxed">
                    For security reasons, we'll send reset instructions to any
                    valid email address in our system. If you don't receive an
                    email, the address may not be registered.
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center justify-between text-sm mt-6 pt-6 border-t border-border">
              <Link
                href="/auth/login"
                className="font-mono text-primary hover:text-primary/80 transition-colors flex items-center gap-1 group"
              >
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
                Back to login
              </Link>
              <Link
                href="/auth/register"
                className="font-mono text-primary hover:text-primary/80 transition-colors"
              >
                Create account
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            Protected communication • All password resets are encrypted
          </p>
        </div>
      </div>
    </div>
  );
}
