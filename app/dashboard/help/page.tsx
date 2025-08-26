"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Book, MessageCircle, Mail, Phone, ExternalLink, Search, FileText, Video } from "lucide-react"

const faqItems = [
  {
    question: "How accurate is the deepfake detection?",
    answer: "Our AI system achieves 96.8% accuracy using advanced neural networks and temporal analysis.",
    category: "Detection",
  },
  {
    question: "What file formats are supported?",
    answer: "We support MP4, AVI, MOV for videos and JPG, PNG, WebP for images.",
    category: "Upload",
  },
  {
    question: "How long does analysis take?",
    answer: "Processing time varies by file size, typically 2-5 seconds for images and 30-120 seconds for videos.",
    category: "Processing",
  },
  {
    question: "Can I export detection reports?",
    answer: "Yes, you can export detailed PDF reports with confidence scores and analysis breakdowns.",
    category: "Reports",
  },
]

const resources = [
  {
    title: "User Guide",
    description: "Complete guide to using the DeepCheck system",
    type: "PDF",
    icon: FileText,
  },
  {
    title: "API Documentation",
    description: "Technical documentation for developers",
    type: "Web",
    icon: Book,
  },
  {
    title: "Video Tutorials",
    description: "Step-by-step video walkthroughs",
    type: "Video",
    icon: Video,
  },
]

export default function HelpPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-mono font-bold">HELP & SUPPORT</h1>
        <p className="text-muted-foreground mt-1">Documentation, tutorials, and support resources</p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search help articles..." className="pl-10 font-mono bg-transparent" />
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono">QUICK ACTIONS</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full font-mono justify-start">
              <MessageCircle className="w-4 h-4 mr-2" />
              START LIVE CHAT
            </Button>
            <Button variant="outline" className="w-full font-mono justify-start bg-transparent">
              <Mail className="w-4 h-4 mr-2" />
              EMAIL SUPPORT
            </Button>
            <Button variant="outline" className="w-full font-mono justify-start bg-transparent">
              <Phone className="w-4 h-4 mr-2" />
              SCHEDULE CALL
            </Button>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono">RESOURCES</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {resources.map((resource, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <resource.icon className="w-4 h-4 text-primary" />
                  <div>
                    <div className="font-mono text-sm font-medium">{resource.title}</div>
                    <div className="text-xs text-muted-foreground">{resource.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono text-xs">
                    {resource.type}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono">CONTACT INFO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="font-mono text-sm font-medium">SUPPORT EMAIL</div>
              <div className="text-sm text-muted-foreground">support@deepcheck.ai</div>
            </div>
            <div>
              <div className="font-mono text-sm font-medium">PHONE</div>
              <div className="text-sm text-muted-foreground">+1 (555) 123-4567</div>
            </div>
            <div>
              <div className="font-mono text-sm font-medium">HOURS</div>
              <div className="text-sm text-muted-foreground">24/7 Support Available</div>
            </div>
            <div>
              <div className="font-mono text-sm font-medium">RESPONSE TIME</div>
              <div className="text-sm text-muted-foreground">&lt; 2 hours average</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle className="font-mono">FREQUENTLY ASKED QUESTIONS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-mono font-medium">{item.question}</h3>
                  <Badge variant="outline" className="font-mono text-xs">
                    {item.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{item.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
