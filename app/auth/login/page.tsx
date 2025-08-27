"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Mock validation
      if (!formData.email.includes("@")) {
        setErrors({ email: "Please enter a valid email address" });
      } else if (formData.password.length < 6) {
        setErrors({ password: "Password must be at least 6 characters" });
      } else {
        // Success - redirect to dashboard
        window.location.href = "/dashboard";
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 border border-primary/10 rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/6 w-24 h-24 border border-secondary/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/4 w-16 h-16 border border-accent/10 rounded-full animate-pulse delay-2000" />

        {/* Geometric patterns */}
        <div className="absolute top-1/3 left-1/3 w-1 h-20 bg-gradient-to-b from-primary/20 to-transparent rotate-45" />
        <div className="absolute bottom-1/3 right-1/3 w-1 h-16 bg-gradient-to-b from-secondary/20 to-transparent -rotate-45" />
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
          <h1 className="text-3xl font-mono font-bold mb-2">SECURE ACCESS</h1>
          <p className="text-muted-foreground">
            Enter your credentials to access the detection system
          </p>
        </div>

        {/* Login Form */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <h2 className="text-xl font-mono font-semibold">SYSTEM LOGIN</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="font-mono text-sm">
                  EMAIL ADDRESS
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`font-mono bg-background/50 border-border focus:border-primary transition-all duration-300 ${
                      errors.email ? "border-destructive" : ""
                    }`}
                    placeholder="user@example.com"
                    required
                  />
                  {errors.email && (
                    <div className="absolute -bottom-5 left-0 text-xs text-destructive font-mono animate-pulse">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="font-mono text-sm">
                  PASSWORD
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
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
                  {errors.password && (
                    <div className="absolute -bottom-5 left-0 text-xs text-destructive font-mono animate-pulse">
                      {errors.password}
                    </div>
                  )}
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded border-border" />
                  <span className="font-mono">Remember me</span>
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="font-mono text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

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
                    AUTHENTICATING...
                  </>
                ) : (
                  <>
                    ACCESS SYSTEM
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground font-mono">
                  OR
                </span>
              </div>
            </div>

            {/* Register Link */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground font-mono">
                Need access?{" "}
                <Link
                  href="/auth/register"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Request account
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            Protected by military-grade encryption • All sessions are monitored
          </p>
        </div>
      </div>
    </div>
  );
}
