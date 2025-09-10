"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle,
  Brain,
  Play,
  Pause,
  Activity,
  Zap,
  Shield,
  FileText,
  Eye,
  Image,
  Volume2,
  Film,
  SkipBack,
  SkipForward,
  Maximize2,
} from "lucide-react";

// Define types for our data
interface AnalysisResult {
  id: string;
  filename: string;
  mediaType: string;
  mediaUrl: string;
  uploadDate: string;
  fileSize: string;
  dimensions: { width: number; height: number };
  duration: number;
  isDeepfake: boolean;
  confidence: number;
  processingTime: number;
  detectionMethod: string;
  metadata: {
    codec: string;
    framerate: number;
    bitrate: string;
    colorSpace: string;
  };
  analysis: {
    faceRegions: number;
    anomalies: number;
    neuralNetworkScores: {
      faceSwapDetection: number;
      faceReenactmentDetection: number;
      speechSynthesisDetection: number;
      overallManipulation: number;
    };
    frameAnalysis: Array<{
      frame: number;
      confidence: number;
      anomaly: string;
    }>;
    heatmapData: Array<{
      x: number;
      y: number;
      intensity: number;
    }>;
  };
}

interface MediaPreviewProps {
  result: AnalysisResult;
  className?: string;
}

interface FrameAnalysisProps {
  frameData: Array<{
    frame: number;
    confidence: number;
    anomaly: string;
  }>;
}

interface HeatmapVisualizationProps {
  heatmapData: Array<{
    x: number;
    y: number;
    intensity: number;
  }>;
  mediaType: string;
}

// Mock detailed result data with actual media URLs
const mockDetailedResult: AnalysisResult = {
  id: "analysis_001",
  filename: "suspicious_video.mp4",
  mediaType: "video", // "video", "image", or "audio"
  mediaUrl:
    "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Sample video for demo
  uploadDate: "2024-01-15T10:30:00Z",
  fileSize: "15.2 MB",
  dimensions: { width: 1920, height: 1080 },
  duration: 45,
  isDeepfake: true,
  confidence: 94.2,
  processingTime: 3.7,
  detectionMethod: "Multi-layer CNN + Temporal",
  metadata: {
    codec: "H.264",
    framerate: 30,
    bitrate: "2.8 Mbps",
    colorSpace: "YUV420P",
  },
  analysis: {
    faceRegions: 2,
    anomalies: 3,
    neuralNetworkScores: {
      faceSwapDetection: 94.2,
      faceReenactmentDetection: 87.6,
      speechSynthesisDetection: 91.8,
      overallManipulation: 94.2,
    },
    frameAnalysis: [
      { frame: 12, confidence: 92, anomaly: "Facial landmark mismatch" },
      { frame: 18, confidence: 89, anomaly: "Texture inconsistency" },
      { frame: 24, confidence: 95, anomaly: "Lighting discontinuity" },
      { frame: 31, confidence: 91, anomaly: "Temporal flickering" },
    ],
    heatmapData: Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      intensity: Math.random() * 100,
    })),
  },
};

// Media Preview Component
const MediaPreview = ({ result, className = "" }: MediaPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlayPause = () => {
    if (result.mediaType === "video" && videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    } else if (result.mediaType === "audio" && audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    } else if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  if (result.mediaType === "video") {
    return (
      <div className={`relative group ${className}`}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover rounded-lg"
          src={result.mediaUrl}
          onTimeUpdate={handleTimeUpdate}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={togglePlayPause}
                className="w-10 h-10 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>
              <div className="flex-1 bg-white/20 backdrop-blur rounded-full h-1">
                <div
                  className="bg-blue-500 h-full rounded-full transition-all"
                  style={{ width: `${(currentTime / result.duration) * 100}%` }}
                />
              </div>
              <span className="text-xs text-white font-mono">
                {Math.floor(currentTime)}s / {result.duration}s
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result.mediaType === "image") {
    return (
      <div className={`relative ${className}`}>
        <img
          src="https://picsum.photos/1920/1080"
          alt="Analyzed media"
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
    );
  }

  if (result.mediaType === "audio") {
    return (
      <div className={`relative bg-zinc-900 rounded-lg p-8 ${className}`}>
        <audio
          ref={audioRef}
          src={result.mediaUrl}
          onTimeUpdate={handleTimeUpdate}
        />
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-20 h-20 rounded-full bg-blue-500/10 flex items-center justify-center mb-4">
            <Volume2 className="w-10 h-10 text-blue-500" />
          </div>
          <div className="w-full max-w-md">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayPause}
                className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" />
                ) : (
                  <Play className="w-6 h-6 text-white ml-0.5" />
                )}
              </button>
              <div className="flex-1">
                <div className="bg-zinc-800 rounded-full h-2 mb-1">
                  <div
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{
                      width: `${(currentTime / result.duration) * 100}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-xs font-mono text-muted-foreground">
                  <span>{Math.floor(currentTime)}s</span>
                  <span>{result.duration}s</span>
                </div>
              </div>
            </div>
          </div>
          {/* Audio waveform visualization */}
          <div className="flex items-end justify-center gap-1 mt-6 h-16">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="w-1 bg-blue-500/30 rounded-full animate-pulse"
                style={{
                  height: `${20 + Math.random() * 60}%`,
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Frame Analysis Component
const FrameAnalysis = ({ frameData }: FrameAnalysisProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {frameData.map((frame, index) => (
        <Card key={index} className="border-zinc-800 overflow-hidden">
          <div className="aspect-video bg-zinc-900 relative">
            <img
              src={`https://picsum.photos/320/180?random=${index}`}
              alt={`Frame ${frame.frame}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge
                variant={frame.confidence > 90 ? "destructive" : "default"}
                className="font-mono text-xs"
              >
                {frame.confidence}%
              </Badge>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
              <p className="text-xs font-mono text-white">
                Frame #{frame.frame}
              </p>
            </div>
          </div>
          <CardContent className="p-3">
            <p className="text-xs font-mono text-muted-foreground">
              {frame.anomaly}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Heatmap Visualization Component
const HeatmapVisualization = ({
  heatmapData,
  mediaType,
}: HeatmapVisualizationProps) => {
  const [hoveredRegion, setHoveredRegion] = useState<number | null>(null);

  return (
    <div className="relative">
      <div className="aspect-video bg-zinc-900 rounded-lg overflow-hidden relative">
        {/* Base image/video frame */}
        <img
          src="https://picsum.photos/1920/1080"
          alt="Base frame"
          className="w-full h-full object-cover opacity-50"
        />

        {/* Heatmap overlay */}
        <div className="absolute inset-0">
          {heatmapData.map((point, index) => {
            const color =
              point.intensity > 90
                ? "red"
                : point.intensity > 70
                ? "yellow"
                : "green";
            const opacity = (point.intensity / 100) * 0.5;

            return (
              <div
                key={index}
                className="absolute rounded-full blur-xl transition-all duration-300 cursor-pointer"
                style={{
                  left: `${point.x}%`,
                  top: `${point.y}%`,
                  width: "80px",
                  height: "80px",
                  transform: "translate(-50%, -50%)",
                  backgroundColor: color,
                  opacity: hoveredRegion === index ? opacity + 0.2 : opacity,
                }}
                onMouseEnter={() => setHoveredRegion(index)}
                onMouseLeave={() => setHoveredRegion(null)}
              />
            );
          })}
        </div>

        {/* Overlay info */}
        {hoveredRegion !== null && (
          <div className="absolute top-4 left-4 bg-black/80 backdrop-blur rounded-lg p-3">
            <p className="text-xs font-mono text-white">
              Region Risk: {heatmapData[hoveredRegion].intensity.toFixed(1)}%
            </p>
            <p className="text-xs font-mono text-muted-foreground mt-1">
              Position: ({heatmapData[hoveredRegion].x.toFixed(0)},{" "}
              {heatmapData[hoveredRegion].y.toFixed(0)})
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs font-mono">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded" />
          <span className="text-muted-foreground">High Risk (90-100%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500 rounded" />
          <span className="text-muted-foreground">Medium Risk (70-89%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded" />
          <span className="text-muted-foreground">Low Risk (0-69%)</span>
        </div>
      </div>
    </div>
  );
};

export default function ResultsDetailPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const result = mockDetailedResult;

  const tabs = [
    { id: "overview", label: "OVERVIEW", icon: Eye },
    { id: "analysis", label: "DETAILED ANALYSIS", icon: Brain },
    { id: "anomalies", label: "ANOMALIES", icon: AlertTriangle },
    { id: "metadata", label: "METADATA", icon: FileText },
    { id: "heatmap", label: "HEATMAP", icon: Activity },
  ];

  const getMediaIcon = () => {
    switch (result.mediaType) {
      case "video":
        return <Film className="w-4 h-4" />;
      case "image":
        return <Image className="w-4 h-4" />;
      case "audio":
        return <Volume2 className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold text-white">
            ANALYSIS RESULTS
          </h1>
          <div className="flex items-center gap-2 mt-1">
            {getMediaIcon()}
            <p className="text-sm font-mono text-muted-foreground">
              {result.filename}
            </p>
          </div>
        </div>

        {/* Main Status Card */}
        <Card
          className={`border ${
            result.isDeepfake
              ? "border-red-500/20 bg-red-500/5"
              : "border-green-500/20 bg-green-500/5"
          } mb-6`}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center ${
                    result.isDeepfake ? "bg-red-500/10" : "bg-green-500/10"
                  }`}
                >
                  {result.isDeepfake ? (
                    <AlertTriangle className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
                  ) : (
                    <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7 text-green-500" />
                  )}
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-mono font-bold text-white">
                    {result.isDeepfake
                      ? "DEEPFAKE DETECTED"
                      : "AUTHENTIC MEDIA"}
                  </h2>
                  <p className="text-xs sm:text-sm font-mono text-muted-foreground">
                    Confidence: {result.confidence}% • Processing time:{" "}
                    {result.processingTime}s
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl sm:text-3xl font-mono font-bold text-white">
                  {result.confidence}%
                </div>
                <div className="text-xs font-mono text-muted-foreground uppercase">
                  Confidence
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="border-b border-zinc-800 mb-6">
          <div className="flex gap-1 overflow-x-auto pb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-3 border-b-2 font-mono text-xs transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-muted-foreground hover:text-white"
                }`}
              >
                <tab.icon className="w-3 h-3" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-blue-500/20 bg-blue-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">
                        METHOD
                      </p>
                      <p className="text-lg font-mono font-bold text-white mt-1">
                        Multi-layer
                      </p>
                    </div>
                    <Brain className="w-5 h-5 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-green-500/20 bg-green-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">
                        SPEED
                      </p>
                      <p className="text-lg font-mono font-bold text-white mt-1">
                        {result.processingTime}s
                      </p>
                    </div>
                    <Zap className="w-5 h-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-purple-500/20 bg-purple-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">
                        FACES
                      </p>
                      <p className="text-lg font-mono font-bold text-white mt-1">
                        {result.analysis.faceRegions}
                      </p>
                    </div>
                    <Eye className="w-5 h-5 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-red-500/20 bg-red-500/5">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-mono text-muted-foreground">
                        ISSUES
                      </p>
                      <p className="text-lg font-mono font-bold text-white mt-1">
                        {result.analysis.anomalies}
                      </p>
                    </div>
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Neural Network Analysis */}
            <Card className="border-zinc-800">
              <CardHeader className="pb-4">
                <CardTitle className="font-mono text-sm flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-500" />
                  NEURAL NETWORK ANALYSIS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(result.analysis.neuralNetworkScores).map(
                  ([key, score]) => (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-muted-foreground">
                          {key.replace(/([A-Z])/g, " $1").toUpperCase()}
                        </span>
                        <span className="text-xs font-mono text-white">
                          {score}%
                        </span>
                      </div>
                      <div className="w-full bg-zinc-800 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all duration-500 ${
                            score > 90
                              ? "bg-red-500"
                              : score > 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>

            {/* File Preview and Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-zinc-800">
                <CardHeader className="pb-4">
                  <CardTitle className="font-mono text-sm flex items-center gap-2">
                    {getMediaIcon()}
                    FILE PREVIEW
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video mb-4">
                    <MediaPreview result={result} />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="text-white">{result.duration}s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Format:</span>
                      <span className="text-white">
                        {result.metadata.codec}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">FPS:</span>
                      <span className="text-white">
                        {result.metadata.framerate}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Size:</span>
                      <span className="text-white">{result.fileSize}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "analysis" && (
          <div className="space-y-6">
            <Card className="border-zinc-800">
              <CardHeader>
                <CardTitle className="font-mono text-sm">
                  FRAME-BY-FRAME ANALYSIS
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FrameAnalysis frameData={result.analysis.frameAnalysis} />
              </CardContent>
            </Card>

            <Card className="border-zinc-800">
              <CardHeader>
                <CardTitle className="font-mono text-sm">
                  TEMPORAL CONSISTENCY
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-32 flex items-end justify-between gap-1">
                  {Array.from({ length: 50 }).map((_, i) => {
                    const height = 30 + Math.random() * 70;
                    const color =
                      height > 80
                        ? "bg-red-500"
                        : height > 60
                        ? "bg-yellow-500"
                        : "bg-green-500";
                    return (
                      <div
                        key={i}
                        className={`flex-1 ${color} rounded-t transition-all hover:opacity-80`}
                        style={{ height: `${height}%` }}
                      />
                    );
                  })}
                </div>
                <p className="text-xs font-mono text-muted-foreground mt-2 text-center">
                  Consistency score across frames
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "anomalies" && (
          <div className="space-y-4">
            {result.analysis.frameAnalysis.map((anomaly, i) => (
              <Card key={i} className="border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      </div>
                      <div>
                        <h3 className="font-mono text-sm font-semibold text-white">
                          {anomaly.anomaly}
                        </h3>
                        <p className="text-xs font-mono text-muted-foreground mt-1">
                          Detected at frame {anomaly.frame} with{" "}
                          {anomaly.confidence}% confidence
                        </p>
                      </div>
                    </div>
                    <Badge variant="destructive" className="font-mono text-xs">
                      {anomaly.confidence > 90 ? "HIGH" : "MEDIUM"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === "metadata" && (
          <Card className="border-zinc-800">
            <CardHeader>
              <CardTitle className="font-mono text-sm">METADATA</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-muted-foreground">Filename:</span>
                    <span className="text-white">{result.filename}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-muted-foreground">File Size:</span>
                    <span className="text-white">{result.fileSize}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="text-white">{result.duration}s</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-muted-foreground">Media Type:</span>
                    <span className="text-white uppercase">
                      {result.mediaType}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-muted-foreground">Resolution:</span>
                    <span className="text-white">
                      {result.dimensions.width}x{result.dimensions.height}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-muted-foreground">Codec:</span>
                    <span className="text-white">{result.metadata.codec}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-muted-foreground">Framerate:</span>
                    <span className="text-white">
                      {result.metadata.framerate} fps
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-zinc-800">
                    <span className="text-muted-foreground">Bitrate:</span>
                    <span className="text-white">
                      {result.metadata.bitrate}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === "heatmap" && (
          <Card className="border-zinc-800">
            <CardHeader>
              <CardTitle className="font-mono text-sm">
                DETECTION HEATMAP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <HeatmapVisualization
                heatmapData={result.analysis.heatmapData}
                mediaType={result.mediaType}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
