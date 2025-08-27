"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Check,
  Building,
  User,
  Mail,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    role: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Organization", icon: Building },
    { number: 3, title: "Security", icon: Shield },
  ];

  const handleNext = () => {
    setErrors({});

    if (currentStep === 1) {
      if (!formData.firstName || !formData.lastName || !formData.email) {
        setErrors({ general: "Please fill in all required fields" });
        return;
      }
      if (!formData.email.includes("@")) {
        setErrors({ email: "Please enter a valid email address" });
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.organization || !formData.role) {
        setErrors({ general: "Please fill in all required fields" });
        return;
      }
    }

    setCurrentStep(currentStep + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    if (formData.password !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrors({ password: "Password must be at least 8 characters" });
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setErrors({ terms: "You must agree to the terms and conditions" });
      setIsLoading(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Success - redirect to verification or dashboard
      window.location.href = "/auth/verify-email";
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/6 right-1/6 w-40 h-40 border border-primary/10 rounded-full animate-pulse" />
        <div className="absolute bottom-1/6 left-1/6 w-28 h-28 border border-secondary/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 border border-accent/10 rounded-full animate-pulse delay-2000" />

        {/* Matrix-style elements */}
        <div className="absolute top-1/4 right-1/3 w-1 h-24 bg-gradient-to-b from-primary/20 to-transparent matrix-rain" />
        <div className="absolute bottom-1/4 left-1/3 w-1 h-20 bg-gradient-to-b from-secondary/20 to-transparent matrix-rain delay-1000" />
      </div>

      <div className="w-full max-w-lg relative z-10">
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
          <h1 className="text-3xl font-mono font-bold mb-2">ACCESS REQUEST</h1>
          <p className="text-muted-foreground">
            Create your account to access the detection system
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-mono text-sm transition-all duration-300 ${
                  currentStep >= step.number
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                }`}
              >
                {currentStep > step.number ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 h-0.5 mx-2 transition-colors duration-300 ${
                    currentStep > step.number ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Registration Form */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <h2 className="text-xl font-mono font-semibold">
              STEP {currentStep}: {steps[currentStep - 1].title.toUpperCase()}
            </h2>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={
                currentStep === 3
                  ? handleSubmit
                  : (e) => {
                      e.preventDefault();
                      handleNext();
                    }
              }
            >
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="font-mono text-sm">
                        FIRST NAME
                      </Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="font-mono bg-background/50 border-border focus:border-primary transition-all duration-300"
                        placeholder="John"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-mono text-sm">
                        LAST NAME
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="font-mono bg-background/50 border-border focus:border-primary transition-all duration-300"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-mono text-sm">
                      EMAIL ADDRESS
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={`font-mono bg-background/50 border-border focus:border-primary transition-all duration-300 pl-10 ${
                          errors.email ? "border-destructive" : ""
                        }`}
                        placeholder="john.doe@company.com"
                        required
                      />
                      {errors.email && (
                        <div className="absolute -bottom-5 left-0 text-xs text-destructive font-mono animate-pulse">
                          {errors.email}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Organization */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="organization" className="font-mono text-sm">
                      ORGANIZATION
                    </Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organization: e.target.value,
                        })
                      }
                      className="font-mono bg-background/50 border-border focus:border-primary transition-all duration-300"
                      placeholder="Acme Corporation"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="font-mono text-sm">
                      ROLE
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value })
                      }
                    >
                      <SelectTrigger className="font-mono bg-background/50 border-border focus:border-primary">
                        <SelectValue placeholder="Select your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="security-analyst">
                          Security Analyst
                        </SelectItem>
                        <SelectItem value="forensic-investigator">
                          Forensic Investigator
                        </SelectItem>
                        <SelectItem value="content-moderator">
                          Content Moderator
                        </SelectItem>
                        <SelectItem value="researcher">Researcher</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 3: Security */}
              {currentStep === 3 && (
                <div className="space-y-6">
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="font-mono text-sm"
                    >
                      CONFIRM PASSWORD
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                        className={`font-mono bg-background/50 border-border focus:border-primary transition-all duration-300 pr-10 ${
                          errors.confirmPassword ? "border-destructive" : ""
                        }`}
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                      {errors.confirmPassword && (
                        <div className="absolute -bottom-5 left-0 text-xs text-destructive font-mono animate-pulse">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            agreeToTerms: e.target.checked,
                          })
                        }
                        className="mt-1 rounded border-border"
                      />
                      <span className="text-sm font-mono leading-relaxed">
                        I agree to the{" "}
                        <Link
                          href="/terms"
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/privacy"
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          Privacy Policy
                        </Link>
                      </span>
                    </label>
                    {errors.terms && (
                      <div className="text-xs text-destructive font-mono animate-pulse">
                        {errors.terms}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errors.general && (
                <div className="text-sm text-destructive font-mono text-center animate-pulse bg-destructive/10 border border-destructive/20 rounded p-3">
                  {errors.general}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex-1 font-mono"
                  >
                    BACK
                  </Button>
                )}
                <Button
                  type="submit"
                  className="flex-1 font-mono group pulse-glow"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      CREATING ACCOUNT...
                    </>
                  ) : currentStep === 3 ? (
                    <>
                      CREATE ACCOUNT
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  ) : (
                    <>
                      CONTINUE
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </div>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground font-mono">
                Already have access?{" "}
                <Link
                  href="/auth/login"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            All accounts require verification • Enterprise-grade security
            protocols
          </p>
        </div>
      </div>
    </div>
  );
}
