"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Shield,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Upload,
  Eye,
  Clock,
  Activity,
  BarChart3,
  Zap,
} from "lucide-react"

// Mock data for dashboard
const mockStats = {
  totalAnalyses: 1247,
  accuracyRate: 99.7,
  deepfakesDetected: 89,
  authenticMedia: 1158,
  avgProcessingTime: 2.3,
  systemUptime: 99.9,
}

const recentActivity = [
  {
    id: 1,
    type: "analysis",
    filename: "video_sample_001.mp4",
    result: "authentic",
    confidence: 97.8,
    timestamp: "2 minutes ago",
  },
  {
    id: 2,
    type: "analysis",
    filename: "image_portrait.jpg",
    result: "deepfake",
    confidence: 94.2,
    timestamp: "5 minutes ago",
  },
  {
    id: 3,
    type: "analysis",
    filename: "news_clip.mp4",
    result: "authentic",
    confidence: 99.1,
    timestamp: "12 minutes ago",
  },
  {
    id: 4,
    type: "analysis",
    filename: "social_media_post.jpg",
    result: "deepfake",
    confidence: 87.6,
    timestamp: "18 minutes ago",
  },
]

export default function DashboardPage() {
  const [liveStats, setLiveStats] = useState(mockStats)
  const [isScanning, setIsScanning] = useState(false)

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        ...prev,
        totalAnalyses: prev.totalAnalyses + Math.floor(Math.random() * 3),
        accuracyRate: 99.7 + (Math.random() - 0.5) * 0.2,
        avgProcessingTime: 2.3 + (Math.random() - 0.5) * 0.4,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold">SYSTEM OVERVIEW</h1>
          <p className="text-muted-foreground mt-1">Real-time detection system status and analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full">
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-sm font-mono text-secondary">SYSTEM ONLINE</span>
          </div>
          <Button className="font-mono pulse-glow">
            <Upload className="w-4 h-4 mr-2" />
            NEW ANALYSIS
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-muted-foreground">TOTAL ANALYSES</p>
                <p className="text-2xl font-mono font-bold text-primary">{liveStats.totalAnalyses.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-mono">
              <TrendingUp className="w-3 h-3 text-secondary" />
              <span className="text-secondary">+12.5% from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary/20 bg-secondary/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-muted-foreground">ACCURACY RATE</p>
                <p className="text-2xl font-mono font-bold text-secondary">{liveStats.accuracyRate.toFixed(1)}%</p>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-mono">
              <CheckCircle className="w-3 h-3 text-secondary" />
              <span className="text-secondary">Military-grade precision</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-muted-foreground">DEEPFAKES DETECTED</p>
                <p className="text-2xl font-mono font-bold text-destructive">{liveStats.deepfakesDetected}</p>
              </div>
              <div className="w-12 h-12 bg-destructive/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-mono">
              <Eye className="w-3 h-3 text-destructive" />
              <span className="text-destructive">7.1% detection rate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-muted-foreground">AVG PROCESSING</p>
                <p className="text-2xl font-mono font-bold text-accent">{liveStats.avgProcessingTime.toFixed(1)}s</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs font-mono">
              <Clock className="w-3 h-3 text-accent" />
              <span className="text-accent">Lightning fast analysis</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status and Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* System Status */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              SYSTEM STATUS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono">AI Engine</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-secondary">ONLINE</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono">Neural Networks</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-secondary">ACTIVE</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono">Processing Queue</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-primary">3 PENDING</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono">System Uptime</span>
                <span className="text-sm font-mono text-secondary">{liveStats.systemUptime}%</span>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm font-mono">
                  <span>CPU Usage</span>
                  <span>23%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full w-[23%] transition-all duration-500" />
                </div>
              </div>
              <div className="space-y-2 mt-3">
                <div className="flex items-center justify-between text-sm font-mono">
                  <span>Memory Usage</span>
                  <span>67%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full w-[67%] transition-all duration-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-mono flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              RECENT ACTIVITY
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-card/50 border border-border rounded-lg hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.result === "authentic"
                          ? "bg-secondary/10 text-secondary"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {activity.result === "authentic" ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <p className="font-mono text-sm font-medium">{activity.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.result === "authentic" ? "Authentic Media" : "Deepfake Detected"} •{" "}
                        {activity.confidence}% confidence
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-muted-foreground">{activity.timestamp}</p>
                    <Button variant="ghost" size="sm" className="text-xs font-mono">
                      VIEW DETAILS
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <Button variant="outline" className="font-mono bg-transparent">
                VIEW ALL ACTIVITY
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="font-mono">QUICK ACTIONS</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-20 flex-col gap-2 font-mono pulse-glow">
              <Upload className="w-6 h-6" />
              UPLOAD MEDIA
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 font-mono bg-transparent">
              <BarChart3 className="w-6 h-6" />
              VIEW ANALYTICS
            </Button>
            <Button variant="outline" className="h-20 flex-col gap-2 font-mono bg-transparent">
              <Shield className="w-6 h-6" />
              SYSTEM SETTINGS
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
