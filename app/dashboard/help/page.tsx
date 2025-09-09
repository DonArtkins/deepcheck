"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Book,
  MessageCircle,
  Mail,
  Phone,
  ExternalLink,
  FileText,
  Video,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Clock,
  Zap,
  Shield,
  Users,
  Headphones,
} from "lucide-react";

const faqItems = [
  {
    question: "How accurate is the deepfake detection?",
    answer:
      "Our AI system achieves 99.7% accuracy using advanced neural networks, temporal analysis, and multi-modal detection algorithms. The system continuously learns from new data to maintain military-grade precision.",
    category: "Detection",
    priority: "high",
  },
  {
    question: "What file formats are supported?",
    answer:
      "We support MP4, AVI, MOV, MKV for videos and JPG, PNG, WebP, HEIC for images. Maximum file size is 2GB for videos and 50MB for images.",
    category: "Upload",
    priority: "medium",
  },
  {
    question: "How long does analysis take?",
    answer:
      "Processing time varies by file size and complexity. Images: 2-5 seconds, Short videos (< 1 min): 30-60 seconds, Longer videos: 2-5 minutes. Our lightning-fast AI ensures minimal wait times.",
    category: "Processing",
    priority: "medium",
  },
  {
    question: "Can I export detection reports?",
    answer:
      "Yes, you can export comprehensive PDF reports with confidence scores, technical analysis breakdowns, metadata information, and visual evidence markers. Enterprise users also get CSV exports for batch analysis.",
    category: "Reports",
    priority: "medium",
  },
  {
    question: "Is my data secure and private?",
    answer:
      "Absolutely. All uploads are encrypted in transit and at rest using AES-256 encryption. Files are automatically deleted after 30 days unless you choose to keep them. We never share your data with third parties.",
    category: "Security",
    priority: "high",
  },
  {
    question: "What is the difference between confidence levels?",
    answer:
      "90-100%: Extremely high confidence, 80-89%: High confidence, 70-79%: Moderate confidence, Below 70%: Low confidence (manual review recommended). Our neural networks provide detailed explanations for each score.",
    category: "Detection",
    priority: "medium",
  },
];

const resources = [
  {
    title: "Getting Started Guide",
    description: "Complete walkthrough for new users",
    type: "PDF",
    icon: FileText,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  {
    title: "API Documentation",
    description: "Technical documentation for developers",
    type: "Web",
    icon: Book,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video walkthroughs",
    type: "Video",
    icon: Video,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  {
    title: "Best Practices",
    description: "Optimization tips and techniques",
    type: "PDF",
    icon: Shield,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
];

const supportStats = [
  {
    label: "RESPONSE TIME",
    value: "< 2 hrs",
    icon: Clock,
    color: "text-green-500",
  },
  {
    label: "RESOLUTION RATE",
    value: "98.5%",
    icon: Shield,
    color: "text-blue-500",
  },
  {
    label: "SUPPORT AGENTS",
    value: "24/7",
    icon: Headphones,
    color: "text-purple-500",
  },
  {
    label: "SATISFACTION",
    value: "4.9/5",
    icon: Users,
    color: "text-orange-500",
  },
];

export default function HelpPage() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  return (
    <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold">
          HELP & SUPPORT
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Documentation, tutorials, and support resources
        </p>
      </div>

      {/* Support Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {supportStats.map((stat, index) => (
          <Card
            key={index}
            className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors duration-200"
          >
            <CardContent className="p-3 sm:p-4 lg:p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-mono text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-lg sm:text-xl lg:text-2xl font-mono font-bold text-primary">
                    {stat.value}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                  <stat.icon
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Resources and Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Resources */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="font-mono text-base sm:text-lg flex items-center gap-2">
              <Book className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              RESOURCES & GUIDES
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            {resources.map((resource, index) => (
              <div
                key={index}
                className={`group flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border ${resource.borderColor} ${resource.bgColor} hover:bg-opacity-80 transition-all duration-200 cursor-pointer`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 ${resource.bgColor} rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 border ${resource.borderColor}`}
                  >
                    <resource.icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 ${resource.color}`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm sm:text-base font-medium group-hover:text-primary transition-colors">
                      {resource.title}
                    </div>
                    <div className="text-xs sm:text-sm text-muted-foreground">
                      {resource.description}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="font-mono text-xs">
                    {resource.type}
                  </Badge>
                  <Button variant="ghost" size="sm" className="w-8 h-8 p-0">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="font-mono text-base sm:text-lg flex items-center gap-2">
              <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              CONTACT INFORMATION
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <div className="font-mono text-sm font-medium">
                    SUPPORT EMAIL
                  </div>
                  <div className="text-sm text-muted-foreground">
                    support@deepcheck.ai
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <div className="font-mono text-sm font-medium">
                    PHONE SUPPORT
                  </div>
                  <div className="text-sm text-muted-foreground">
                    +1 (555) 123-4567
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Clock className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <div className="font-mono text-sm font-medium">
                    AVAILABILITY
                  </div>
                  <div className="text-sm text-muted-foreground">
                    24/7 Support Available
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Zap className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <div className="font-mono text-sm font-medium">
                    RESPONSE TIME
                  </div>
                  <div className="text-sm text-muted-foreground">
                    &lt; 2 hours average
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="font-mono text-base sm:text-lg flex items-center gap-2">
            <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            FREQUENTLY ASKED QUESTIONS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="border border-border rounded-lg sm:rounded-xl hover:border-primary/30 transition-all duration-200"
              >
                <div
                  className="flex items-center justify-between p-4 sm:p-5 cursor-pointer"
                  onClick={() => toggleFaq(index)}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center gap-2 flex-1">
                      <h3 className="font-mono font-medium text-sm sm:text-base pr-2">
                        {item.question}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge
                        variant="outline"
                        className={`font-mono text-xs ${
                          item.priority === "high"
                            ? "border-red-500/20 text-red-500 bg-red-500/10"
                            : "border-primary/20"
                        }`}
                      >
                        {item.category}
                      </Badge>
                      {expandedFaq === index ? (
                        <ChevronDown className="w-4 h-4 text-primary" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                {expandedFaq === index && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-border">
                    <div className="pt-4">
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
