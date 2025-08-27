"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Cpu, Database, Network } from "lucide-react";

const techStats = [
  { label: "Neural Networks", value: "12", icon: Network },
  { label: "Training Hours", value: "50K+", icon: Activity },
  { label: "Processing Cores", value: "256", icon: Cpu },
  { label: "Dataset Size", value: "10M+", icon: Database },
];

export function TechnologyShowcase() {
  const [activeNode, setActiveNode] = useState(0);

  return (
    <section
      id="technology"
      className="py-12 sm:py-16 lg:py-24 bg-background px-4 sm:px-6 lg:px-8 pt-20 md:pt-0"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold mb-4">
            NEURAL <span className="text-secondary">ARCHITECTURE</span>
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Our AI system processes media through multiple detection layers with
            advanced neural networks
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Enhanced Neural Network Visualization */}
          <div className="relative order-2 lg:order-1">
            <div className="aspect-square max-w-sm sm:max-w-md mx-auto relative">
              {/* Network Nodes */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 transition-all duration-500 cursor-pointer ${
                      activeNode === i
                        ? "bg-primary border-primary shadow-lg shadow-primary/50 pulse-glow"
                        : "bg-background border-border hover:border-primary/50"
                    }`}
                    style={{
                      top: `${20 + Math.sin((i * Math.PI) / 4) * 30}%`,
                      left: `${50 + Math.cos((i * Math.PI) / 4) * 30}%`,
                      transform: "translate(-50%, -50%)",
                    }}
                    onClick={() => setActiveNode(i)}
                  />
                ))}

                {/* Connection Lines */}
                <svg className="absolute inset-0 w-full h-full">
                  {[...Array(8)].map((_, i) => (
                    <line
                      key={i}
                      x1="50%"
                      y1="50%"
                      x2={`${50 + Math.cos((i * Math.PI) / 4) * 30}%`}
                      y2={`${20 + Math.sin((i * Math.PI) / 4) * 30}%`}
                      stroke={
                        activeNode === i ? "var(--primary)" : "var(--border)"
                      }
                      strokeWidth="1"
                      className="transition-colors duration-500"
                    />
                  ))}
                </svg>

                {/* Center Node */}
                <div className="absolute top-1/2 left-1/2 w-6 h-6 sm:w-8 sm:h-8 -translate-x-1/2 -translate-y-1/2 bg-secondary border-2 border-secondary rounded-full pulse-glow" />
              </div>
            </div>
          </div>

          {/* Technology Stats */}
          <div className="space-y-6 order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {techStats.map((stat, index) => (
                <Card
                  key={index}
                  className="border-border/50 hover:border-primary/30 transition-colors"
                >
                  <CardContent className="p-3 sm:p-4 text-center">
                    <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary mx-auto mb-2" />
                    <div className="text-lg sm:text-xl lg:text-2xl font-mono font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-mono font-semibold mb-3 text-primary">
                  Detection Process
                </h3>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0" />
                    <span>Facial landmark extraction and mapping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-500 flex-shrink-0" />
                    <span>Temporal consistency analysis across frames</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-1000 flex-shrink-0" />
                    <span>Artifact pattern recognition and classification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-1500 flex-shrink-0" />
                    <span>Confidence score calculation and validation</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
