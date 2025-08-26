"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Share2, AlertTriangle, CheckCircle, Eye, Brain, FileText, Play } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock detailed result data
const mockDetailedResult = {
  id: "analysis_001",
  filename: "suspicious_video.mp4",
  uploadDate: "2024-01-15T10:30:00Z",
  fileSize: "15.2 MB",
  dimensions: { width: 1920, height: 1080 },
  duration: 45,
  isDeepfake: true,
  confidence: 94.2,
  processingTime: 3.7,
  detectionMethod: "Multi-layer CNN + Temporal Analysis",
  metadata: {
    codec: "H.264",
    framerate: 30,
    bitrate: "2.8 Mbps",
    colorSpace: "YUV420P",
  },
  analysis: {
    faceRegions: [
      { x: 450, y: 200, width: 320, height: 380, confidence: 96.8 },
      { x: 890, y: 150, width: 280, height: 340, confidence: 91.5 },
    ],
    anomalies: [
      {
        type: "Facial Inconsistency",
        severity: "high" as const,
        description: "Detected unnatural facial feature transitions around the mouth and eye regions",
        confidence: 97.3,
        frames: [12, 18, 24, 31],
      },
      {
        type: "Temporal Artifacts",
        severity: "medium" as const,
        description: "Inconsistent lighting patterns and shadow directions across consecutive frames",
        confidence: 89.1,
        frames: [8, 15, 22, 29, 36],
      },
      {
        type: "Compression Artifacts",
        severity: "low" as const,
        description: "Unusual compression patterns that may indicate post-processing manipulation",
        confidence: 76.4,
        frames: [5, 11, 17, 25, 33, 41],
      },
    ],
    neuralNetworkScores: {
      faceSwapDetection: 94.2,
      faceReenactmentDetection: 87.6,
      speechSynthesisDetection: 91.8,
      overallManipulation: 94.2,
    },
  },
}

export default function ResultsDetailPage() {
  const params = useParams()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedFrame, setSelectedFrame] = useState(0)
  const [comparisonMode, setComparisonMode] = useState(false)

  const result = mockDetailedResult

  const tabs = [
    { id: "overview", label: "OVERVIEW", icon: Eye },
    { id: "analysis", label: "DETAILED ANALYSIS", icon: Brain },
    { id: "anomalies", label: "ANOMALIES", icon: AlertTriangle },
    { id: "metadata", label: "METADATA", icon: FileText },
    { id: "heatmap", label: "HEATMAP", icon: Eye },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/history">
            <Button variant="ghost" size="sm" className="font-mono">
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO HISTORY
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-mono font-bold">ANALYSIS RESULTS</h1>
            <p className="text-muted-foreground mt-1">{result.filename}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="font-mono bg-transparent">
            <Share2 className="w-4 h-4 mr-2" />
            SHARE
          </Button>
          <Button className="font-mono pulse-glow">
            <Download className="w-4 h-4 mr-2" />
            DOWNLOAD REPORT
          </Button>
        </div>
      </div>

      {/* Status Banner */}
      <Card
        className={`border-2 ${
          result.isDeepfake ? "border-destructive/50 bg-destructive/5" : "border-secondary/50 bg-secondary/5"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                  result.isDeepfake ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary"
                }`}
              >
                {result.isDeepfake ? <AlertTriangle className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
              </div>
              <div>
                <h2 className="text-2xl font-mono font-bold">
                  {result.isDeepfake ? "DEEPFAKE DETECTED" : "AUTHENTIC MEDIA"}
                </h2>
                <p className="text-muted-foreground">
                  Confidence: {result.confidence}% • Processing time: {result.processingTime}s
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-mono font-bold">{result.confidence}%</div>
              <div className="text-sm text-muted-foreground">CONFIDENCE</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-1 py-4 border-b-2 font-mono text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Key Metrics */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono">KEY METRICS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-mono text-muted-foreground">DETECTION METHOD</div>
                        <div className="font-mono">{result.detectionMethod}</div>
                      </div>
                      <div>
                        <div className="text-sm font-mono text-muted-foreground">PROCESSING TIME</div>
                        <div className="font-mono">{result.processingTime}s</div>
                      </div>
                      <div>
                        <div className="text-sm font-mono text-muted-foreground">FACE REGIONS</div>
                        <div className="font-mono">{result.analysis.faceRegions.length} detected</div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-mono text-muted-foreground">ANOMALIES FOUND</div>
                        <div className="font-mono">{result.analysis.anomalies.length} issues</div>
                      </div>
                      <div>
                        <div className="text-sm font-mono text-muted-foreground">FILE SIZE</div>
                        <div className="font-mono">{result.fileSize}</div>
                      </div>
                      <div>
                        <div className="text-sm font-mono text-muted-foreground">RESOLUTION</div>
                        <div className="font-mono">
                          {result.dimensions.width}x{result.dimensions.height}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Neural Network Scores */}
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono">NEURAL NETWORK ANALYSIS</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(result.analysis.neuralNetworkScores).map(([key, score]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-mono">
                          <span className="capitalize">
                            {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                          </span>
                          <span className="text-primary">{score}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              score > 90 ? "bg-destructive" : score > 70 ? "bg-yellow-500" : "bg-secondary"
                            }`}
                            style={{ width: `${score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* File Preview */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="font-mono">FILE PREVIEW</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Play className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-mono text-muted-foreground">Video Preview</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm font-mono">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span>{result.duration}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span>{result.metadata.codec}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Frame Rate:</span>
                      <span>{result.metadata.framerate} fps</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="font-mono">QUICK ACTIONS</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full font-mono">
                    <Download className="w-4 h-4 mr-2" />
                    DOWNLOAD REPORT
                  </Button>
                  <Button variant="outline" className="w-full font-mono bg-transparent">
                    <Share2 className="w-4 h-4 mr-2" />
                    SHARE RESULTS
                  </Button>
                  <Button variant="outline" className="w-full font-mono bg-transparent">
                    <Eye className="w-4 h-4 mr-2" />
                    VIEW HEATMAP
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-mono">FRAME-BY-FRAME ANALYSIS</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm font-mono text-muted-foreground">
                        Frame {selectedFrame + 1} of {result.duration * result.metadata.framerate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFrame(Math.max(0, selectedFrame - 1))}
                      className="font-mono bg-transparent"
                    >
                      PREV
                    </Button>
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="h-2 bg-primary rounded-full transition-all duration-300"
                        style={{ width: `${(selectedFrame / (result.duration * result.metadata.framerate)) * 100}%` }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSelectedFrame(Math.min(result.duration * result.metadata.framerate - 1, selectedFrame + 1))
                      }
                      className="font-mono bg-transparent"
                    >
                      NEXT
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-mono">DETECTION CONFIDENCE TIMELINE</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-mono text-muted-foreground">Confidence Timeline Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "heatmap" && (
          <Card>
            <CardHeader>
              <CardTitle className="font-mono">DETECTION HEATMAP</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                  <div className="text-center">
                    <Eye className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm font-mono text-muted-foreground">Heatmap Visualization</p>
                  </div>

                  {/* Mock heatmap overlay */}
                  <div className="absolute inset-0 opacity-30">
                    {result.analysis.faceRegions.map((region, index) => (
                      <div
                        key={index}
                        className="absolute border-2 border-destructive bg-destructive/20"
                        style={{
                          left: `${(region.x / 1920) * 100}%`,
                          top: `${(region.y / 1080) * 100}%`,
                          width: `${(region.width / 1920) * 100}%`,
                          height: `${(region.height / 1080) * 100}%`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm font-mono">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-destructive rounded" />
                      <span>High Risk (90-100%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded" />
                      <span>Medium Risk (70-89%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-secondary rounded" />
                      <span>Low Risk (0-69%)</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "anomalies" && (
          <div className="space-y-4">
            {result.analysis.anomalies.map((anomaly, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          anomaly.severity === "high"
                            ? "bg-destructive/10 text-destructive"
                            : anomaly.severity === "medium"
                              ? "bg-yellow-500/10 text-yellow-600"
                              : "bg-blue-500/10 text-blue-600"
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-mono font-semibold">{anomaly.type}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{anomaly.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          anomaly.severity === "high"
                            ? "destructive"
                            : anomaly.severity === "medium"
                              ? "secondary"
                              : "outline"
                        }
                        className="font-mono"
                      >
                        {anomaly.severity.toUpperCase()}
                      </Badge>
                      <div className="text-sm font-mono text-muted-foreground mt-1">
                        {anomaly.confidence}% confidence
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-mono text-muted-foreground">
                    Detected in frames: {anomaly.frames.join(", ")}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "metadata" && (
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-mono">FILE INFORMATION</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Filename:</span>
                    <span>{result.filename}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">File Size:</span>
                    <span>{result.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span>{result.duration}s</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resolution:</span>
                    <span>
                      {result.dimensions.width}x{result.dimensions.height}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Upload Date:</span>
                    <span>{new Date(result.uploadDate).toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-mono">TECHNICAL METADATA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Codec:</span>
                    <span>{result.metadata.codec}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Frame Rate:</span>
                    <span>{result.metadata.framerate} fps</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Bitrate:</span>
                    <span>{result.metadata.bitrate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Color Space:</span>
                    <span>{result.metadata.colorSpace}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
