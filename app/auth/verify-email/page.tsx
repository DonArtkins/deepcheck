"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Mail, CheckCircle, Clock, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function VerifyEmailPage() {
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleResend = async () => {
    setIsResending(true)
    // Simulate API call
    setTimeout(() => {
      setIsResending(false)
      setResendCooldown(60) // 60 second cooldown
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-secondary/10 rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 border border-primary/10 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 right-1/6 w-16 h-16 border border-accent/10 rounded-full animate-pulse delay-2000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center pulse-glow">
              <Mail className="w-7 h-7 text-secondary-foreground" />
            </div>
            <span className="text-2xl font-mono font-bold">DEEPCHECK</span>
          </div>
          <h1 className="text-3xl font-mono font-bold mb-2">VERIFY EMAIL</h1>
          <p className="text-muted-foreground">Check your inbox to complete account setup</p>
        </div>

        {/* Verification Card */}
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-secondary" />
            </div>
            <h2 className="text-xl font-mono font-semibold">EMAIL SENT</h2>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                We've sent a verification link to your email address. Click the link to activate your account and gain
                access to the DeepCheck detection system.
              </p>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                <div className="flex items-center gap-3 text-sm font-mono">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>The verification link expires in 24 hours</span>
                </div>
              </div>
            </div>

            {/* Resend Button */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground font-mono mb-4">Didn't receive the email?</p>
              <Button
                onClick={handleResend}
                variant="outline"
                className="font-mono bg-transparent"
                disabled={isResending || resendCooldown > 0}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    SENDING...
                  </>
                ) : resendCooldown > 0 ? (
                  <>
                    <Clock className="w-4 h-4 mr-2" />
                    RESEND IN {resendCooldown}s
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    RESEND EMAIL
                  </>
                )}
              </Button>
            </div>

            {/* Help Section */}
            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="font-mono font-semibold text-center">NEED HELP?</h3>
              <div className="space-y-2 text-sm font-mono">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full mt-2" />
                  <span>Check your spam/junk folder</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full mt-2" />
                  <span>Ensure your email address is correct</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full mt-2" />
                  <span>Contact support if issues persist</span>
                </div>
              </div>
            </div>

            {/* Back to Login */}
            <div className="text-center pt-4">
              <Link
                href="/auth/login"
                className="text-sm font-mono text-primary hover:text-primary/80 transition-colors"
              >
                ← Back to login
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground font-mono">
            Secure verification process • Your data is protected
          </p>
        </div>
      </div>
    </div>
  )
}
