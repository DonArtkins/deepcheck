"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { useAuth } from "@/contexts/AuthContext";
import type { RegisterFormData, FormErrors } from "@/types/types";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading, error, isAuthenticated, clearError } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    email: "",
    organization: "",
    role: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});

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
      clearError();
    }
  }, [formData, error, clearError]);

  const steps = [
    { number: 1, title: "Personal Info", icon: User },
    { number: 2, title: "Organization", icon: Building },
    { number: 3, title: "Security", icon: Shield },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      }
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    } else if (step === 2) {
      if (!formData.organization.trim()) {
        newErrors.organization = "Organization is required";
      }
      if (!formData.role) {
        newErrors.role = "Role is required";
      }
    } else if (step === 3) {
      if (!formData.password) {
        newErrors.password = "Password is required";
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

      if (!formData.agreeToTerms) {
        newErrors.terms = "You must agree to the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) {
      return;
    }

    try {
      await register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        organization: formData.organization.trim(),
        role: formData.role,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      // Registration successful - redirect will happen via useEffect
      router.push("/dashboard");
    } catch (err) {
      // Error is handled by AuthContext
      console.error("Registration failed:", err);
    }
  };

  const handleInputChange = (
    field: keyof RegisterFormData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isAuthenticated) {
    return null; // Prevent flash while redirecting
  }

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
                          handleInputChange("firstName", e.target.value)
                        }
                        className={`font-mono bg-background/50 border-border focus:border-primary transition-all duration-300 ${
                          errors.firstName ? "border-destructive" : ""
                        }`}
                        placeholder="John"
                        required
                      />
                      {errors.firstName && (
                        <p className="text-xs text-destructive font-mono">
                          {errors.firstName}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="font-mono text-sm">
                        LAST NAME
                      </Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        className={`font-mono bg-background/50 border-border focus:border-primary transition-all duration-300 ${
                          errors.lastName ? "border-destructive" : ""
                        }`}
                        placeholder="Doe"
                        required
                      />
                      {errors.lastName && (
                        <p className="text-xs text-destructive font-mono">
                          {errors.lastName}
                        </p>
                      )}
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
                          handleInputChange("email", e.target.value)
                        }
                        className={`font-mono bg-background/50 border-border focus:border-primary transition-all duration-300 pl-10 ${
                          errors.email ? "border-destructive" : ""
                        }`}
                        placeholder="john.doe@company.com"
                        required
                      />
                    </div>
                    {errors.email && (
                      <p className="text-xs text-destructive font-mono">
                        {errors.email}
                      </p>
                    )}
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
                        handleInputChange("organization", e.target.value)
                      }
                      className={`font-mono bg-background/50 border-border focus:border-primary transition-all duration-300 ${
                        errors.organization ? "border-destructive" : ""
                      }`}
                      placeholder="Acme Corporation"
                      required
                    />
                    {errors.organization && (
                      <p className="text-xs text-destructive font-mono">
                        {errors.organization}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role" className="font-mono text-sm">
                      ROLE
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        handleInputChange("role", value)
                      }
                    >
                      <SelectTrigger
                        className={`font-mono bg-background/50 border-border focus:border-primary ${
                          errors.role ? "border-destructive" : ""
                        }`}
                      >
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
                    {errors.role && (
                      <p className="text-xs text-destructive font-mono">
                        {errors.role}
                      </p>
                    )}
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
                      <p className="text-xs text-destructive font-mono">
                        {errors.password}
                      </p>
                    )}
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
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-xs text-destructive font-mono">
                        {errors.confirmPassword}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.agreeToTerms}
                        onChange={(e) =>
                          handleInputChange("agreeToTerms", e.target.checked)
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
                      <p className="text-xs text-destructive font-mono">
                        {errors.terms}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Global Error Message */}
              {error && (
                <div className="text-sm text-destructive font-mono text-center animate-pulse bg-destructive/10 border border-destructive/20 rounded p-3">
                  {error}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleBack}
                    className="flex-1 font-mono"
                    disabled={isLoading}
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
                      {currentStep === 3
                        ? "CREATING ACCOUNT..."
                        : "PROCESSING..."}
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
