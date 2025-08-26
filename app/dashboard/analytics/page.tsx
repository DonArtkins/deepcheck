"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Shield,
  AlertTriangle,
  FileVideo,
  FileImage,
  Clock,
  Download,
  BarChart3,
  LineChart,
} from "lucide-react"

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalAnalyses: 1247,
    deepfakesDetected: 312,
    accuracyRate: 96.8,
    avgProcessingTime: 2.4,
    trendsVsPrevious: {
      totalAnalyses: 12.5,
      deepfakesDetected: -8.3,
      accuracyRate: 2.1,
      avgProcessingTime: -15.2,
    },
  },
  timeSeriesData: [
    { date: "2024-01-01", analyses: 45, deepfakes: 12, accuracy: 94.2 },
    { date: "2024-01-02", analyses: 52, deepfakes: 15, accuracy: 95.1 },
    { date: "2024-01-03", analyses: 38, deepfakes: 8, accuracy: 97.3 },
    { date: "2024-01-04", analyses: 61, deepfakes: 18, accuracy: 96.8 },
    { date: "2024-01-05", analyses: 47, deepfakes: 11, accuracy: 95.9 },
    { date: "2024-01-06", analyses: 55, deepfakes: 14, accuracy: 96.4 },
    { date: "2024-01-07", analyses: 43, deepfakes: 9, accuracy: 97.1 },
  ],
  fileTypeBreakdown: [
    { type: "Video", count: 847, percentage: 67.9, deepfakes: 245 },
    { type: "Image", count: 400, percentage: 32.1, deepfakes: 67 },
  ],
  confidenceDistribution: [
    { range: "90-100%", count: 892, percentage: 71.5 },
    { range: "80-89%", count: 201, percentage: 16.1 },
    { range: "70-79%", count: 98, percentage: 7.9 },
    { range: "60-69%", count: 42, percentage: 3.4 },
    { range: "0-59%", count: 14, percentage: 1.1 },
  ],
  detectionMethods: [
    { method: "Multi-layer CNN", usage: 45.2, accuracy: 97.1 },
    { method: "Temporal Analysis", usage: 28.7, accuracy: 94.8 },
    { method: "Facial Landmark", usage: 16.3, accuracy: 92.4 },
    { method: "Frequency Domain", usage: 9.8, accuracy: 89.6 },
  ],
  recentActivity: [
    { id: 1, type: "analysis", file: "interview_clip.mp4", result: "deepfake", confidence: 94.2, time: "2 min ago" },
    { id: 2, type: "analysis", file: "profile_photo.jpg", result: "authentic", confidence: 12.3, time: "5 min ago" },
    { id: 3, type: "analysis", file: "news_segment.mp4", result: "deepfake", confidence: 87.6, time: "8 min ago" },
    { id: 4, type: "analysis", file: "social_post.jpg", result: "authentic", confidence: 8.9, time: "12 min ago" },
  ],
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d")
  const [chartType, setChartType] = useState("line")

  const { overview, fileTypeBreakdown, confidenceDistribution, detectionMethods, recentActivity } = mockAnalytics

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold">ANALYTICS & REPORTS</h1>
          <p className="text-muted-foreground mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 font-mono bg-transparent">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button className="font-mono pulse-glow">
            <Download className="w-4 h-4 mr-2" />
            EXPORT REPORT
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-primary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-muted-foreground">TOTAL ANALYSES</p>
                <p className="text-2xl font-mono font-bold">{overview.totalAnalyses.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Activity className="w-6 h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              {overview.trendsVsPrevious.totalAnalyses > 0 ? (
                <TrendingUp className="w-4 h-4 text-secondary mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive mr-1" />
              )}
              <span
                className={`font-mono ${overview.trendsVsPrevious.totalAnalyses > 0 ? "text-secondary" : "text-destructive"}`}
              >
                {Math.abs(overview.trendsVsPrevious.totalAnalyses)}%
              </span>
              <span className="text-muted-foreground ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-muted-foreground">DEEPFAKES DETECTED</p>
                <p className="text-2xl font-mono font-bold">{overview.deepfakesDetected}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              {overview.trendsVsPrevious.deepfakesDetected > 0 ? (
                <TrendingUp className="w-4 h-4 text-destructive mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-secondary mr-1" />
              )}
              <span
                className={`font-mono ${overview.trendsVsPrevious.deepfakesDetected > 0 ? "text-destructive" : "text-secondary"}`}
              >
                {Math.abs(overview.trendsVsPrevious.deepfakesDetected)}%
              </span>
              <span className="text-muted-foreground ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-muted-foreground">ACCURACY RATE</p>
                <p className="text-2xl font-mono font-bold">{overview.accuracyRate}%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-secondary" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              {overview.trendsVsPrevious.accuracyRate > 0 ? (
                <TrendingUp className="w-4 h-4 text-secondary mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-destructive mr-1" />
              )}
              <span
                className={`font-mono ${overview.trendsVsPrevious.accuracyRate > 0 ? "text-secondary" : "text-destructive"}`}
              >
                {Math.abs(overview.trendsVsPrevious.accuracyRate)}%
              </span>
              <span className="text-muted-foreground ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-muted-foreground">AVG PROCESSING TIME</p>
                <p className="text-2xl font-mono font-bold">{overview.avgProcessingTime}s</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              {overview.trendsVsPrevious.avgProcessingTime > 0 ? (
                <TrendingUp className="w-4 h-4 text-destructive mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-secondary mr-1" />
              )}
              <span
                className={`font-mono ${overview.trendsVsPrevious.avgProcessingTime > 0 ? "text-destructive" : "text-secondary"}`}
              >
                {Math.abs(overview.trendsVsPrevious.avgProcessingTime)}%
              </span>
              <span className="text-muted-foreground ml-1">vs previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Detection Trends */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="font-mono">DETECTION TRENDS</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant={chartType === "line" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartType("line")}
                  className="font-mono"
                >
                  <LineChart className="w-4 h-4" />
                </Button>
                <Button
                  variant={chartType === "bar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setChartType("bar")}
                  className="font-mono"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center">
                <LineChart className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-mono text-muted-foreground">Detection Trends Chart</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File Type Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono">FILE TYPE BREAKDOWN</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fileTypeBreakdown.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.type === "Video" ? (
                        <FileVideo className="w-4 h-4 text-primary" />
                      ) : (
                        <FileImage className="w-4 h-4 text-secondary" />
                      )}
                      <span className="font-mono text-sm">{item.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm">{item.count}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.type === "Video" ? "bg-primary" : "bg-secondary"}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    {item.deepfakes} deepfakes detected ({((item.deepfakes / item.count) * 100).toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Confidence Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono">CONFIDENCE DISTRIBUTION</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {confidenceDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span className="font-mono text-sm">{item.range}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{item.count}</div>
                    <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detection Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono">DETECTION METHODS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {detectionMethods.map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono">{method.method}</span>
                    <span className="text-muted-foreground">{method.usage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="h-2 bg-primary rounded-full" style={{ width: `${method.usage}%` }} />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">Accuracy: {method.accuracy}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="font-mono">RECENT ACTIVITY</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.result === "deepfake" ? "bg-destructive" : "bg-secondary"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-sm truncate">{activity.file}</div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                  <Badge
                    variant={activity.result === "deepfake" ? "destructive" : "secondary"}
                    className="font-mono text-xs"
                  >
                    {activity.confidence}%
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
