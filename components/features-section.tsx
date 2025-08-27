"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Shield, Zap, Eye, Brain, Lock, BarChart3 } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI Neural Analysis",
    description:
      "Advanced deep learning models trained on millions of samples for precise detection.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description:
      "Lightning-fast analysis with results delivered in under 3 seconds.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/20",
  },
  {
    icon: Eye,
    title: "Visual Anomaly Detection",
    description:
      "Identifies subtle inconsistencies invisible to the human eye.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
  },
  {
    icon: Shield,
    title: "Military-grade Security",
    description:
      "Enterprise-level security protocols protect your sensitive data.",
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/20",
  },
  {
    icon: Lock,
    title: "Privacy First",
    description:
      "All processing happens locally. Your media never leaves your device.",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/20",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description:
      "Comprehensive reports with confidence scores and detection insights.",
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/20",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="py-12 sm:py-16 lg:py-24 bg-card/50 px-4 sm:px-6 lg:px-8 pt-20 md:pt-0"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold mb-4">
            ADVANCED <span className="text-primary">DETECTION</span>{" "}
            CAPABILITIES
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Powered by state-of-the-art artificial intelligence and machine
            learning algorithms
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`group hover:${feature.borderColor} transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 ${feature.bgColor} ${feature.borderColor} border-border/50 h-full`}
            >
              <CardContent className="p-4 sm:p-6 h-full flex flex-col">
                <div className="mb-4">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${feature.bgColor} border ${feature.borderColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${feature.color}`}
                    />
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-mono font-semibold mb-2 flex-shrink-0">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-grow">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
