"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

// Mock data for dashboard
const mockStats = {
  totalAnalyses: 1247,
  accuracyRate: 99.7,
  deepfakesDetected: 89,
  authenticMedia: 1158,
  avgProcessingTime: 2.3,
  systemUptime: 99.9,
};

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
];

export default function DashboardPage() {
  const [liveStats, setLiveStats] = useState(mockStats);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats((prev) => ({
        ...prev,
        totalAnalyses: prev.totalAnalyses + Math.floor(Math.random() * 3),
        accuracyRate: 99.7 + (Math.random() - 0.5) * 0.2,
        avgProcessingTime: 2.3 + (Math.random() - 0.5) * 0.4,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold">
          SYSTEM OVERVIEW
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Real-time detection system status and analytics
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {/* Total Analyses */}
        <Card className="border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors duration-200">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-mono text-muted-foreground">
                  TOTAL ANALYSES
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-primary">
                  {liveStats.totalAnalyses.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-mono">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                +12.5% from last week
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Accuracy Rate */}
        <Card className="border-green-500/20 bg-green-500/5 hover:bg-green-500/10 transition-colors duration-200">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-mono text-muted-foreground">
                  ACCURACY RATE
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-green-600 dark:text-green-400">
                  {liveStats.accuracyRate.toFixed(1)}%
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-mono">
              <CheckCircle className="w-3 h-3 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                Military-grade precision
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Deepfakes Detected */}
        <Card className="border-destructive/20 bg-destructive/5 hover:bg-destructive/10 transition-colors duration-200">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-mono text-muted-foreground">
                  DEEPFAKES DETECTED
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-destructive">
                  {liveStats.deepfakesDetected}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-destructive/10 rounded-lg flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-mono">
              <Eye className="w-3 h-3 text-destructive" />
              <span className="text-destructive">7.1% detection rate</span>
            </div>
          </CardContent>
        </Card>

        {/* Average Processing Time */}
        <Card className="border-blue-500/20 bg-blue-500/5 hover:bg-blue-500/10 transition-colors duration-200">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs sm:text-sm font-mono text-muted-foreground">
                  AVG PROCESSING
                </p>
                <p className="text-xl sm:text-2xl lg:text-3xl font-mono font-bold text-blue-600 dark:text-blue-400">
                  {liveStats.avgProcessingTime.toFixed(1)}s
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-mono">
              <Clock className="w-3 h-3 text-blue-500" />
              <span className="text-blue-600 dark:text-blue-400">
                Lightning fast analysis
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status and Recent Activity */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* System Status */}
        <Card className="lg:col-span-1 hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="font-mono flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-primary" />
              SYSTEM STATUS
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Status Indicators */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-mono">AI Engine</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-green-600 dark:text-green-400">
                    ONLINE
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-mono">Neural Networks</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-green-600 dark:text-green-400">
                    ACTIVE
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-mono">Processing Queue</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-primary">
                    3 PENDING
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-mono">System Uptime</span>
                <span className="text-sm font-mono text-green-600 dark:text-green-400">
                  {liveStats.systemUptime}%
                </span>
              </div>
            </div>

            {/* Resource Usage */}
            <div className="pt-4 border-t border-border space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-mono">
                  <span>CPU Usage</span>
                  <span className="text-primary">23%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-primary to-primary/80 h-2.5 rounded-full w-[23%] transition-all duration-500" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm font-mono">
                  <span>Memory Usage</span>
                  <span className="text-green-600 dark:text-green-400">
                    67%
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div className="bg-gradient-to-r from-green-500 to-green-500/80 h-2.5 rounded-full w-[67%] transition-all duration-500" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-4">
            <CardTitle className="font-mono flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5 text-primary" />
              RECENT ACTIVITY
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 bg-card/50 border border-border rounded-xl hover:border-primary/30 hover:bg-card/80 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        activity.result === "authentic"
                          ? "bg-green-500/10 text-green-500 border border-green-500/20"
                          : "bg-destructive/10 text-destructive border border-destructive/20"
                      }`}
                    >
                      {activity.result === "authentic" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertTriangle className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-sm font-medium truncate group-hover:text-primary transition-colors">
                        {activity.filename}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-xs font-mono px-2 py-1 rounded-md ${
                            activity.result === "authentic"
                              ? "bg-green-500/10 text-green-600 dark:text-green-400"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {activity.result === "authentic"
                            ? "AUTHENTIC"
                            : "DEEPFAKE"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {activity.confidence}% confidence
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2 shrink-0 ml-4">
                    <p className="text-xs font-mono text-muted-foreground">
                      {activity.timestamp}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs font-mono h-7 px-3 hover:bg-primary/10 hover:text-primary transition-colors"
                    >
                      VIEW
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-border">
              <Button
                variant="outline"
                className="w-full font-mono bg-transparent hover:bg-accent/50 transition-colors duration-200"
              >
                VIEW ALL ACTIVITY
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
