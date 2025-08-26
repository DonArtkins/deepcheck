"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Shield, Zap, Eye, Brain, Lock, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Neural Analysis",
    description: "Advanced deep learning models trained on millions of samples for precise detection.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description: "Lightning-fast analysis with results delivered in under 3 seconds.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/20",
  },
  {
    icon: Eye,
    title: "Visual Anomaly Detection",
    description: "Identifies subtle inconsistencies invisible to the human eye.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
  },
  {
    icon: Shield,
    title: "Military-grade Security",
    description: "Enterprise-level security protocols protect your sensitive data.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description: "All processing happens locally. Your media never leaves your device.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/20",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Comprehensive reports with confidence scores and detection insights.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-mono font-bold mb-4">
            ADVANCED <span className="text-primary">DETECTION</span> CAPABILITIES
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powered by state-of-the-art artificial intelligence and machine learning algorithms
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`group hover:${feature.borderColor} transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 ${feature.bgColor} ${feature.borderColor}`}
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg ${feature.bgColor} border ${feature.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                </div>
                <h3 className="text-lg font-mono font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
