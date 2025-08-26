"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Scan, Zap } from "lucide-react"

export function HeroSection() {
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setScanProgress((prev) => (prev >= 100 ? 0 : prev + 1))
    }, 50)
    return () => clearInterval(interval)
  }, [])

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-card"
    >
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-secondary rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-3 h-3 bg-accent rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-primary rounded-full animate-pulse delay-3000"></div>
        {/* Additional floating elements */}
        <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-secondary rounded-full animate-pulse delay-4000"></div>
        <div className="absolute top-3/4 right-1/6 w-2 h-2 bg-primary rounded-full animate-pulse delay-5000"></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 pulse-glow">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-mono text-primary">AI-POWERED DETECTION</span>
              </div>

              <h1 className="text-5xl lg:text-7xl font-mono font-bold leading-tight">
                <span className="text-foreground">DEEP</span>
                <span className="text-primary">CHECK</span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                Advanced deepfake detection system powered by cutting-edge AI. Verify media authenticity with
                military-grade precision and real-time analysis.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="group font-mono pulse-glow">
                START ANALYSIS
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg" className="font-mono bg-transparent hover:bg-primary/5">
                VIEW DEMO
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-primary">99.7%</div>
                <div className="text-sm text-muted-foreground">ACCURACY</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-secondary">2.3s</div>
                <div className="text-sm text-muted-foreground">AVG SCAN</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-mono font-bold text-accent">1M+</div>
                <div className="text-sm text-muted-foreground">ANALYZED</div>
              </div>
            </div>
          </div>

          {/* Right Column - Enhanced 3D Scanner Visualization */}
          <div className="relative">
            <div className="relative w-80 h-80 mx-auto">
              {/* Outer Scanner Ring */}
              <div className="absolute inset-0 border-2 border-primary/30 rounded-full animate-spin-slow">
                <div className="absolute top-0 left-1/2 w-4 h-4 -translate-x-1/2 -translate-y-2">
                  <Scan className="w-4 h-4 text-primary animate-pulse" />
                </div>
              </div>

              {/* Middle Ring */}
              <div className="absolute inset-8 border border-secondary/50 rounded-full animate-pulse">
                <div className="absolute inset-4 border border-accent/30 rounded-full">
                  {/* Center Detection Core */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 border-2 border-primary rounded-lg flex items-center justify-center pulse-glow bg-primary/10">
                      <Zap className="w-8 h-8 text-primary" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Scan Lines */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent scan-line"></div>
              </div>

              {/* Enhanced Scan Progress */}
              <div className="absolute -bottom-8 left-0 right-0">
                <div className="bg-card/90 backdrop-blur-sm border border-border rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm font-mono mb-2">
                    <span className="text-primary">SCANNING...</span>
                    <span className="text-primary">{scanProgress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1">
                    <div
                      className="bg-gradient-to-r from-primary to-secondary h-1 rounded-full transition-all duration-100"
                      style={{ width: `${scanProgress}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Neural network analysis in progress...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
