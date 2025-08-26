"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Activity, Cpu, Database, Network } from "lucide-react"

const techStats = [
  { label: "Neural Networks", value: "12", icon: Network },
  { label: "Training Hours", value: "50K+", icon: Activity },
  { label: "Processing Cores", value: "256", icon: Cpu },
  { label: "Dataset Size", value: "10M+", icon: Database },
]

export function TechnologyShowcase() {
  const [activeNode, setActiveNode] = useState(0)

  return (
    <section id="technology" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-mono font-bold mb-4">
            NEURAL <span className="text-secondary">ARCHITECTURE</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our AI system processes media through multiple detection layers with advanced neural networks
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Enhanced Neural Network Visualization */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto relative">
              {/* Network Nodes */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`absolute w-4 h-4 rounded-full border-2 transition-all duration-500 cursor-pointer ${
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
                      stroke={activeNode === i ? "var(--primary)" : "var(--border)"}
                      strokeWidth="1"
                      className="transition-colors duration-500"
                    />
                  ))}
                </svg>

                {/* Center Node */}
                <div className="absolute top-1/2 left-1/2 w-8 h-8 -translate-x-1/2 -translate-y-1/2 bg-secondary border-2 border-secondary rounded-full pulse-glow" />
              </div>
            </div>
          </div>

          {/* Technology Stats */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {techStats.map((stat, index) => (
                <Card key={index} className="border-border/50 hover:border-primary/30 transition-colors">
                  <CardContent className="p-4 text-center">
                    <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                    <div className="text-2xl font-mono font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <h3 className="text-lg font-mono font-semibold mb-3 text-primary">Detection Process</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span>Facial landmark extraction and mapping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-500" />
                    <span>Temporal consistency analysis across frames</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-1000" />
                    <span>Artifact pattern recognition and classification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse delay-1500" />
                    <span>Confidence score calculation and validation</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full font-mono pulse-glow" size="lg">
              EXPLORE TECHNOLOGY
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
