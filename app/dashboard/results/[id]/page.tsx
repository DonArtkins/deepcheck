"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  Eye,
  Brain,
  FileText,
  Play,
  Activity,
  BarChart3,
  Clock,
  Zap,
} from "lucide-react";

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
        description:
          "Detected unnatural facial feature transitions around the mouth and eye regions",
        confidence: 97.3,
        frames: [12, 18, 24, 31],
      },
      {
        type: "Temporal Artifacts",
        severity: "medium" as const,
        description:
          "Inconsistent lighting patterns and shadow directions across consecutive frames",
        confidence: 89.1,
        frames: [8, 15, 22, 29, 36],
      },
      {
        type: "Compression Artifacts",
        severity: "low" as const,
        description:
          "Unusual compression patterns that may indicate post-processing manipulation",
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
};

export default function ResultsDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFrame, setSelectedFrame] = useState(0);

  const result = mockDetailedResult;

  const tabs = [
    { id: "overview", label: "OVERVIEW", icon: Eye },
    { id: "analysis", label: "DETAILED ANALYSIS", icon: Brain },
    { id: "anomalies", label: "ANOMALIES", icon: AlertTriangle },
    { id: "metadata", label: "METADATA", icon: FileText },
    { id: "heatmap", label: "HEATMAP", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="font-mono text-slate-300 hover:text-white hover:bg-slate-800/50 border border-slate-700/50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              BACK TO HISTORY
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white">
                ANALYSIS RESULTS
              </h1>
              <p className="text-slate-400 mt-1 font-mono text-sm">
                {result.filename}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="font-mono bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              SHARE
            </Button>
            <Button className="font-mono bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              DOWNLOAD REPORT
            </Button>
          </div>
        </div>

        {/* Status Banner */}
        <Card
          className={`border-2 ${
            result.isDeepfake
              ? "border-red-500/30 bg-red-500/5"
              : "border-green-500/30 bg-green-500/5"
          } backdrop-blur-sm`}
        >
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                    result.isDeepfake
                      ? "bg-red-500/10 text-red-500 border border-red-500/20"
                      : "bg-green-500/10 text-green-500 border border-green-500/20"
                  }`}
                >
                  {result.isDeepfake ? (
                    <AlertTriangle className="w-8 h-8" />
                  ) : (
                    <CheckCircle className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-mono font-bold text-white">
                    {result.isDeepfake
                      ? "DEEPFAKE DETECTED"
                      : "AUTHENTIC MEDIA"}
                  </h2>
                  <p className="text-slate-400 font-mono text-sm">
                    Confidence: {result.confidence}% • Processing time:{" "}
                    {result.processingTime}s
                  </p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
                  {result.confidence}%
                </div>
                <div className="text-xs font-mono text-slate-400">
                  CONFIDENCE
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="border-b border-slate-700">
          <div className="flex flex-wrap gap-2 sm:gap-4 lg:gap-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-3 sm:px-4 sm:py-4 border-b-2 font-mono text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-400"
                    : "border-transparent text-slate-400 hover:text-slate-200"
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Main Content - Left Side */}
              <div className="lg:col-span-8 space-y-6">
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto">
                          <Brain className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="text-xl font-mono font-bold text-white">
                          {result.detectionMethod.split(" ")[0]}
                        </div>
                        <div className="text-xs font-mono text-slate-400">
                          METHOD
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto">
                          <Zap className="w-4 h-4 text-green-400" />
                        </div>
                        <div className="text-xl font-mono font-bold text-white">
                          {result.processingTime}s
                        </div>
                        <div className="text-xs font-mono text-slate-400">
                          SPEED
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto">
                          <Eye className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="text-xl font-mono font-bold text-white">
                          {result.analysis.faceRegions.length}
                        </div>
                        <div className="text-xs font-mono text-slate-400">
                          FACES
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800/50 border-slate-700/50">
                    <CardContent className="p-4">
                      <div className="text-center space-y-2">
                        <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center mx-auto">
                          <AlertTriangle className="w-4 h-4 text-red-400" />
                        </div>
                        <div className="text-xl font-mono font-bold text-white">
                          {result.analysis.anomalies.length}
                        </div>
                        <div className="text-xs font-mono text-slate-400">
                          ISSUES
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Neural Network Analysis */}
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="font-mono text-white flex items-center gap-2">
                      <Brain className="w-5 h-5 text-blue-400" />
                      NEURAL NETWORK ANALYSIS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(result.analysis.neuralNetworkScores).map(
                        ([key, score]) => (
                          <div key={key} className="space-y-2">
                            <div className="flex items-center justify-between text-sm font-mono">
                              <span className="text-slate-300">
                                {key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())}
                              </span>
                              <span className="text-blue-400 font-bold">
                                {score}%
                              </span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  score > 90
                                    ? "bg-gradient-to-r from-red-500 to-red-400"
                                    : score > 70
                                    ? "bg-gradient-to-r from-yellow-500 to-yellow-400"
                                    : "bg-gradient-to-r from-green-500 to-green-400"
                                }`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Key Metrics Details */}
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="font-mono text-white flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-400" />
                      DETAILED METRICS
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs font-mono text-slate-400 mb-1">
                            DETECTION METHOD
                          </div>
                          <div className="font-mono text-sm text-white">
                            {result.detectionMethod}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-mono text-slate-400 mb-1">
                            PROCESSING TIME
                          </div>
                          <div className="font-mono text-sm text-white">
                            {result.processingTime}s
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs font-mono text-slate-400 mb-1">
                            FILE SIZE
                          </div>
                          <div className="font-mono text-sm text-white">
                            {result.fileSize}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-mono text-slate-400 mb-1">
                            RESOLUTION
                          </div>
                          <div className="font-mono text-sm text-white">
                            {result.dimensions.width}x{result.dimensions.height}
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <div className="text-xs font-mono text-slate-400 mb-1">
                            DURATION
                          </div>
                          <div className="font-mono text-sm text-white">
                            {result.duration}s
                          </div>
                        </div>
                        <div>
                          <div className="text-xs font-mono text-slate-400 mb-1">
                            FORMAT
                          </div>
                          <div className="font-mono text-sm text-white">
                            {result.metadata.codec}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar - Right Side */}
              <div className="lg:col-span-4 space-y-6">
                {/* File Preview */}
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="font-mono text-white text-sm">
                      FILE PREVIEW
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-slate-900/50 rounded-lg flex items-center justify-center mb-4 border border-slate-700/50">
                      <div className="text-center">
                        <Play className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                        <p className="text-xs font-mono text-slate-400">
                          Video Preview
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Duration:</span>
                        <span className="text-white">{result.duration}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Format:</span>
                        <span className="text-white">
                          {result.metadata.codec}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Frame Rate:</span>
                        <span className="text-white">
                          {result.metadata.framerate} fps
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="font-mono text-white text-sm">
                      QUICK ACTIONS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full font-mono bg-blue-600 hover:bg-blue-700 text-white text-sm">
                      <Download className="w-4 h-4 mr-2" />
                      DOWNLOAD REPORT
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full font-mono bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white text-sm"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      SHARE RESULTS
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full font-mono bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white text-sm"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      VIEW HEATMAP
                    </Button>
                  </CardContent>
                </Card>

                {/* Analysis Summary */}
                <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="font-mono text-white text-sm">
                      ANALYSIS SUMMARY
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center py-4">
                      <div className="text-2xl font-mono font-bold text-white mb-2">
                        {result.confidence}%
                      </div>
                      <div className="text-xs font-mono text-slate-400 mb-4">
                        OVERALL CONFIDENCE
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-red-500 to-red-400"
                          style={{ width: `${result.confidence}%` }}
                        />
                      </div>
                      <Badge
                        variant="destructive"
                        className="font-mono text-xs"
                      >
                        HIGH RISK DETECTED
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "analysis" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-mono text-white">
                    FRAME-BY-FRAME ANALYSIS
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="aspect-video bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700/50">
                      <div className="text-center">
                        <Play className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                        <p className="text-sm font-mono text-slate-400">
                          Frame {selectedFrame + 1} of{" "}
                          {result.duration * result.metadata.framerate}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedFrame(Math.max(0, selectedFrame - 1))
                        }
                        className="font-mono bg-transparent border-slate-600 text-slate-300"
                      >
                        PREV
                      </Button>
                      <div className="flex-1 bg-slate-700 rounded-full h-2">
                        <div
                          className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              (selectedFrame /
                                (result.duration * result.metadata.framerate)) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedFrame(
                            Math.min(
                              result.duration * result.metadata.framerate - 1,
                              selectedFrame + 1
                            )
                          )
                        }
                        className="font-mono bg-transparent border-slate-600 text-slate-300"
                      >
                        NEXT
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-mono text-white">
                    DETECTION CONFIDENCE TIMELINE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700/50">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm font-mono text-slate-400">
                        Confidence Timeline Chart
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "heatmap" && (
            <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="font-mono text-white">
                  DETECTION HEATMAP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="aspect-video bg-slate-900/50 rounded-lg flex items-center justify-center relative overflow-hidden border border-slate-700/50">
                    <div className="text-center">
                      <Eye className="w-12 h-12 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm font-mono text-slate-400">
                        Heatmap Visualization
                      </p>
                    </div>

                    {/* Mock heatmap overlay */}
                    <div className="absolute inset-0 opacity-30">
                      {result.analysis.faceRegions.map((region, index) => (
                        <div
                          key={index}
                          className="absolute border-2 border-red-500 bg-red-500/20"
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

                  <div className="flex flex-wrap items-center justify-center gap-4 text-sm font-mono">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded" />
                      <span className="text-slate-300">
                        High Risk (90-100%)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 rounded" />
                      <span className="text-slate-300">
                        Medium Risk (70-89%)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded" />
                      <span className="text-slate-300">Low Risk (0-69%)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "anomalies" && (
            <div className="space-y-4">
              {result.analysis.anomalies.map((anomaly, index) => (
                <Card
                  key={index}
                  className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            anomaly.severity === "high"
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : anomaly.severity === "medium"
                              ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"
                              : "bg-blue-500/10 text-blue-500 border border-blue-500/20"
                          }`}
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-mono font-semibold text-white">
                            {anomaly.type}
                          </h3>
                          <p className="text-sm text-slate-400 mt-1 font-mono">
                            {anomaly.description}
                          </p>
                          <div className="text-xs font-mono text-slate-500 mt-2">
                            Detected in frames: {anomaly.frames.join(", ")}
                          </div>
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
                        <div className="text-sm font-mono text-slate-400 mt-1">
                          {anomaly.confidence}% confidence
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === "metadata" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-mono text-white">
                    FILE INFORMATION
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-700/30">
                      <span className="text-slate-400">Filename:</span>
                      <span className="text-white">{result.filename}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-700/30">
                      <span className="text-slate-400">File Size:</span>
                      <span className="text-white">{result.fileSize}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-700/30">
                      <span className="text-slate-400">Duration:</span>
                      <span className="text-white">{result.duration}s</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-700/30">
                      <span className="text-slate-400">Resolution:</span>
                      <span className="text-white">
                        {result.dimensions.width}x{result.dimensions.height}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-400">Upload Date:</span>
                      <span className="text-white">
                        {new Date(result.uploadDate).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800/50 border-slate-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="font-mono text-white">
                    TECHNICAL METADATA
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 font-mono text-sm">
                    <div className="flex justify-between py-2 border-b border-slate-700/30">
                      <span className="text-slate-400">Codec:</span>
                      <span className="text-white">
                        {result.metadata.codec}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-700/30">
                      <span className="text-slate-400">Frame Rate:</span>
                      <span className="text-white">
                        {result.metadata.framerate} fps
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-slate-700/30">
                      <span className="text-slate-400">Bitrate:</span>
                      <span className="text-white">
                        {result.metadata.bitrate}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-slate-400">Color Space:</span>
                      <span className="text-white">
                        {result.metadata.colorSpace}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
