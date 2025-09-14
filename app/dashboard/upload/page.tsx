"use client";

import type React from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileVideo,
  FileImage,
  X,
  RotateCcw,
  Download,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Scan,
  Brain,
  Eye,
  Shield,
  Clock,
  HardDrive,
  Volume2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

interface UploadedFile {
  id: string;
  file: File;
  preview?: string;
  status: "uploading" | "processing" | "completed" | "error";
  progress: number;
  analysisStage: string;
  analysisId?: string;
  uploadStartTime?: number;
  result?: {
    isDeepfake: boolean;
    confidence: number;
    processingTime: number;
    anomalies: Array<{
      type: string;
      severity: "low" | "medium" | "high";
      description: string;
    }>;
  };
}

const analysisStages = [
  { name: "Uploading to cloud...", icon: Upload, duration: 1000 },
  { name: "Preprocessing media...", icon: Scan, duration: 1500 },
  { name: "Extracting features...", icon: Eye, duration: 2000 },
  { name: "Running AI analysis...", icon: Brain, duration: 3000 },
  { name: "Detecting anomalies...", icon: AlertTriangle, duration: 2000 },
  { name: "Calculating confidence...", icon: Shield, duration: 1000 },
];

// Comprehensive file type validation
const SUPPORTED_TYPES = {
  // Images
  "image/jpeg": { category: "image", maxSize: 50 },
  "image/jpg": { category: "image", maxSize: 50 },
  "image/png": { category: "image", maxSize: 50 },
  "image/gif": { category: "image", maxSize: 50 },
  "image/bmp": { category: "image", maxSize: 50 },
  "image/tiff": { category: "image", maxSize: 50 },
  "image/webp": { category: "image", maxSize: 50 },
  "image/svg+xml": { category: "image", maxSize: 50 },
  "image/x-icon": { category: "image", maxSize: 50 },
  "image/heif": { category: "image", maxSize: 50 },
  "image/heic": { category: "image", maxSize: 50 },
  "image/avif": { category: "image", maxSize: 50 },

  // Videos
  "video/mp4": { category: "video", maxSize: 2048 },
  "video/x-m4v": { category: "video", maxSize: 2048 },
  "video/quicktime": { category: "video", maxSize: 2048 },
  "video/x-msvideo": { category: "video", maxSize: 2048 },
  "video/x-ms-wmv": { category: "video", maxSize: 2048 },
  "video/x-flv": { category: "video", maxSize: 2048 },
  "video/x-matroska": { category: "video", maxSize: 2048 },
  "video/webm": { category: "video", maxSize: 2048 },
  "video/3gpp": { category: "video", maxSize: 2048 },
  "video/3gpp2": { category: "video", maxSize: 2048 },
  "video/mpeg": { category: "video", maxSize: 2048 },
  "video/ogg": { category: "video", maxSize: 2048 },
  "video/mp2t": { category: "video", maxSize: 2048 },
  "video/mov": { category: "video", maxSize: 2048 },
  "video/avi": { category: "video", maxSize: 2048 },
  "video/mkv": { category: "video", maxSize: 2048 },
  "video/flv": { category: "video", maxSize: 2048 },

  // Audio
  "audio/mpeg": { category: "audio", maxSize: 500 },
  "audio/wav": { category: "audio", maxSize: 500 },
  "audio/aac": { category: "audio", maxSize: 500 },
  "audio/ogg": { category: "audio", maxSize: 500 },
  "audio/mp4": { category: "audio", maxSize: 500 },
  "audio/flac": { category: "audio", maxSize: 500 },
  "audio/opus": { category: "audio", maxSize: 500 },
  "audio/webm": { category: "audio", maxSize: 500 },
  "audio/midi": { category: "audio", maxSize: 500 },
  "audio/aiff": { category: "audio", maxSize: 500 },
  "audio/amr": { category: "audio", maxSize: 500 },
  "audio/mp3": { category: "audio", maxSize: 500 },
  "audio/m4a": { category: "audio", maxSize: 500 },
  "audio/weba": { category: "audio", maxSize: 500 },
  "audio/x-wav": { category: "audio", maxSize: 500 },
  "audio/x-aac": { category: "audio", maxSize: 500 },
  "audio/x-flac": { category: "audio", maxSize: 500 },
};

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, isAuthenticated, isLoading, token, apiCall } = useAuth();

  // Show loading state while auth is initializing
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log("User not authenticated");
    }
  }, [isLoading, isAuthenticated]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files);
        handleFiles(selectedFiles);
      }
    },
    []
  );

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    const fileType = SUPPORTED_TYPES[file.type as keyof typeof SUPPORTED_TYPES];

    if (!fileType) {
      return {
        isValid: false,
        error: `Unsupported file type: ${file.type}. Please use supported image, video, or audio formats.`,
      };
    }

    const maxSizeBytes = fileType.maxSize * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSizeBytes) {
      return {
        isValid: false,
        error: `File too large. Maximum size for ${
          fileType.category
        } files is ${fileType.maxSize}MB. Your file is ${(
          file.size /
          (1024 * 1024)
        ).toFixed(1)}MB.`,
      };
    }

    return { isValid: true };
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    if (bytes < 1024 * 1024 * 1024)
      return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + " GB";
  };

  const estimateUploadTime = (fileSize: number): string => {
    // Rough estimation based on typical internet speeds
    const avgSpeedMbps = 10; // 10 Mbps average
    const avgSpeedBps = (avgSpeedMbps * 1024 * 1024) / 8; // Convert to bytes per second
    const estimatedSeconds = fileSize / avgSpeedBps;

    if (estimatedSeconds < 60) return `~${Math.ceil(estimatedSeconds)}s`;
    if (estimatedSeconds < 3600) return `~${Math.ceil(estimatedSeconds / 60)}m`;
    return `~${Math.ceil(estimatedSeconds / 3600)}h`;
  };

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      if (!isAuthenticated) {
        console.error("User not authenticated");
        return;
      }

      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      newFiles.forEach((file) => {
        const validation = validateFile(file);
        if (validation.isValid) {
          validFiles.push(file);
        } else {
          invalidFiles.push(`${file.name}: ${validation.error}`);
        }
      });

      // Show errors for invalid files
      if (invalidFiles.length > 0) {
        console.error("Invalid files:", invalidFiles);
        // You might want to show these errors in a toast or alert
      }

      if (validFiles.length === 0) {
        console.error("No valid files selected");
        return;
      }

      const uploadedFiles: UploadedFile[] = validFiles.map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        status: "uploading",
        progress: 0,
        analysisStage: "Preparing upload...",
        uploadStartTime: Date.now(),
        preview:
          file.type.startsWith("image/") && file.size < 10 * 1024 * 1024 // Only create preview for images < 10MB
            ? URL.createObjectURL(file)
            : undefined,
      }));

      setFiles((prev) => [...prev, ...uploadedFiles]);

      // Upload each file
      uploadedFiles.forEach((uploadedFile) => {
        uploadFile(uploadedFile);
      });
    },
    [isAuthenticated]
  );

  const uploadFile = async (uploadedFile: UploadedFile) => {
    try {
      if (!isAuthenticated || !token) {
        setFiles((prev) =>
          prev.map((file) =>
            file.id === uploadedFile.id
              ? {
                  ...file,
                  status: "error",
                  analysisStage: "Authentication required",
                }
              : file
          )
        );
        return;
      }

      const fileSize = uploadedFile.file.size;
      const estimatedTime = estimateUploadTime(fileSize);

      // Update status to uploading with file size info
      setFiles((prev) =>
        prev.map((file) =>
          file.id === uploadedFile.id
            ? {
                ...file,
                analysisStage: `Uploading ${formatFileSize(
                  fileSize
                )} (${estimatedTime})...`,
                progress: 5,
              }
            : file
        )
      );

      // Create FormData
      const formData = new FormData();
      formData.append("file", uploadedFile.file);
      formData.append("name", uploadedFile.file.name);

      // Simulate upload progress for large files
      let uploadProgress = 5;
      const progressInterval = setInterval(() => {
        uploadProgress = Math.min(uploadProgress + Math.random() * 10, 85);
        setFiles((prev) =>
          prev.map((file) =>
            file.id === uploadedFile.id && file.status === "uploading"
              ? { ...file, progress: uploadProgress }
              : file
          )
        );
      }, 1000);

      try {
        // Use the apiCall method from AuthContext which handles JWT authentication
        const result = await apiCall("/api/dashboard/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressInterval);

        if (result.success) {
          const uploadTime = uploadedFile.uploadStartTime
            ? ((Date.now() - uploadedFile.uploadStartTime) / 1000).toFixed(1)
            : "0";

          setFiles((prev) =>
            prev.map((file) =>
              file.id === uploadedFile.id
                ? {
                    ...file,
                    status: "processing",
                    progress: 90,
                    analysisStage: `Upload complete (${uploadTime}s) - Starting analysis...`,
                    analysisId: result.data.id,
                  }
                : file
            )
          );

          // Start polling for analysis results
          pollAnalysisResults(uploadedFile.id, result.data.id);
        } else {
          throw new Error(result.message || "Upload failed");
        }
      } catch (error) {
        clearInterval(progressInterval);
        throw error;
      }
    } catch (error) {
      console.error("Upload error:", error);
      setFiles((prev) =>
        prev.map((file) =>
          file.id === uploadedFile.id
            ? {
                ...file,
                status: "error",
                analysisStage: `Error: ${
                  error instanceof Error ? error.message : "Upload failed"
                }`,
              }
            : file
        )
      );
    }
  };

  const pollAnalysisResults = async (fileId: string, analysisId: string) => {
    let attempts = 0;
    const maxAttempts = 120; // 10 minutes max (5 seconds * 120)
    let stageIndex = 0;

    const poll = async () => {
      try {
        // Use apiCall for authenticated requests
        const data = await apiCall(`/api/dashboard/analyses/${analysisId}`);
        const analysis = data.analysis;

        // Update progress based on status
        if (analysis.status === "processing" || analysis.status === "pending") {
          // Simulate progress through stages
          const progressPerStage = 10 / analysisStages.length; // Reserve 10% for completion
          const currentProgress = Math.min(
            99,
            90 + (stageIndex + 1) * progressPerStage
          );

          setFiles((prev) =>
            prev.map((file) =>
              file.id === fileId
                ? {
                    ...file,
                    progress: currentProgress,
                    analysisStage:
                      analysisStages[stageIndex]?.name || "Processing...",
                  }
                : file
            )
          );

          // Move to next stage occasionally
          if (Math.random() > 0.6 && stageIndex < analysisStages.length - 1) {
            stageIndex++;
          }

          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 5000); // Poll every 5 seconds
          } else {
            // Timeout
            setFiles((prev) =>
              prev.map((file) =>
                file.id === fileId
                  ? {
                      ...file,
                      status: "error",
                      analysisStage:
                        "Analysis timed out - file may be too large or complex",
                    }
                  : file
              )
            );
          }
        } else if (analysis.status === "completed") {
          setFiles((prev) =>
            prev.map((file) =>
              file.id === fileId
                ? {
                    ...file,
                    status: "completed",
                    progress: 100,
                    analysisStage: "Analysis complete",
                    result: {
                      isDeepfake: analysis.isDeepfake || false,
                      confidence: analysis.confidence || 0,
                      processingTime: analysis.processingTime || 0,
                      anomalies: analysis.anomalies || [],
                    },
                  }
                : file
            )
          );
        } else if (
          analysis.status === "failed" ||
          analysis.status === "error"
        ) {
          setFiles((prev) =>
            prev.map((file) =>
              file.id === fileId
                ? {
                    ...file,
                    status: "error",
                    analysisStage: analysis.error || "Analysis failed",
                  }
                : file
            )
          );
        } else {
          // Still pending, continue polling
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(poll, 5000);
          } else {
            setFiles((prev) =>
              prev.map((file) =>
                file.id === fileId
                  ? {
                      ...file,
                      status: "error",
                      analysisStage: "Analysis timed out",
                    }
                  : file
              )
            );
          }
        }
      } catch (error) {
        console.error("Polling error:", error);
        setFiles((prev) =>
          prev.map((file) =>
            file.id === fileId
              ? {
                  ...file,
                  status: "error",
                  analysisStage: "Failed to get results",
                }
              : file
          )
        );
      }
    };

    // Start polling after a short delay
    setTimeout(poll, 2000);
  };

  const removeFile = (fileId: string) => {
    setFiles((prev) => {
      const fileToRemove = prev.find((file) => file.id === fileId);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return prev.filter((file) => file.id !== fileId);
    });
  };

  const retryAnalysis = (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    if (file) {
      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "uploading",
                progress: 0,
                analysisStage: "Retrying upload...",
                result: undefined,
                analysisId: undefined,
                uploadStartTime: Date.now(),
              }
            : f
        )
      );
      uploadFile(file);
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/"))
      return <FileImage className="w-8 h-8 text-muted-foreground" />;
    if (file.type.startsWith("video/"))
      return <FileVideo className="w-8 h-8 text-muted-foreground" />;
    if (file.type.startsWith("audio/"))
      return <Volume2 className="w-8 h-8 text-muted-foreground" />;
    return <FileImage className="w-8 h-8 text-muted-foreground" />;
  };

  const downloadReport = async (file: UploadedFile) => {
    if (!file.analysisId) return;

    try {
      // This would generate and download a PDF report
      const reportData = {
        filename: file.file.name,
        fileSize: formatFileSize(file.file.size),
        fileType: file.file.type,
        result: file.result,
        analysisId: file.analysisId,
        timestamp: new Date().toISOString(),
      };

      const blob = new Blob([JSON.stringify(reportData, null, 2)], {
        type: "application/json",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `deepcheck-report-${file.file.name}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold">
            UPLOAD & ANALYZE
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Upload media files for deepfake detection analysis
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs sm:text-sm font-mono text-muted-foreground bg-muted/50 rounded-lg px-3 py-2 border">
          <HardDrive className="w-4 h-4 text-primary" />
          Images: 50MB • Videos: 2GB • Audio: 500MB
        </div>
      </div>

      {/* Authentication Warning */}
      {!isAuthenticated && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                Please log in to upload and analyze files.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Zone */}
      <Card
        className={`border-2 border-dashed transition-all duration-300 hover:shadow-lg ${
          isDragging
            ? "border-primary bg-primary/5 shadow-lg"
            : "border-border hover:border-primary/50"
        } ${!isAuthenticated ? "opacity-50" : ""}`}
      >
        <CardContent className="p-8 sm:p-12">
          <div
            className="relative transition-all duration-300"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center space-y-6">
              <div
                className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isDragging
                    ? "bg-primary/20 border-primary text-primary scale-110"
                    : "bg-primary/10 border-primary/20 text-primary"
                }`}
              >
                <Upload className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-mono font-bold">
                  DROP FILES HERE
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Drag and drop your media files or click to browse
                </p>
                <p className="text-muted-foreground text-xs">
                  Supports all major image, video, and audio formats • Up to 3
                  hours of content
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="font-mono px-6 py-3"
                  size="lg"
                  disabled={!isAuthenticated}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isAuthenticated ? "SELECT FILES" : "LOGIN TO UPLOAD"}
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={!isAuthenticated}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-mono font-bold">
            ANALYSIS QUEUE
          </h2>
          <div className="grid gap-4">
            {files.map((file) => (
              <Card
                key={file.id}
                className="hover:shadow-lg transition-shadow duration-200"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {/* File Preview */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-muted border rounded-lg flex items-center justify-center overflow-hidden">
                        {file.preview ? (
                          <img
                            src={file.preview}
                            alt={file.file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          getFileIcon(file.file)
                        )}
                      </div>
                    </div>

                    {/* File Info and Progress */}
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-mono font-semibold truncate text-sm sm:text-base">
                            {file.file.name}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            {formatFileSize(file.file.size)} •{" "}
                            {file.file.type.split("/")[1].toUpperCase()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="hover:bg-destructive/10 hover:text-destructive self-start"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
                          <span className="flex items-center gap-2">
                            {file.status === "processing" && (
                              <Loader2 className="w-3 h-3 animate-spin text-primary" />
                            )}
                            {file.status === "uploading" && (
                              <Upload className="w-3 h-3 text-primary" />
                            )}
                            <span className="truncate">
                              {file.analysisStage}
                            </span>
                          </span>
                          <span className="text-primary font-bold">
                            {Math.round(file.progress)}%
                          </span>
                        </div>
                        <Progress value={file.progress} className="h-2" />
                      </div>

                      {/* Results */}
                      {file.status === "completed" && file.result && (
                        <div className="p-4 bg-muted/50 border rounded-lg">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                            <div className="flex items-center gap-2">
                              {file.result.isDeepfake ? (
                                <AlertTriangle className="w-5 h-5 text-destructive" />
                              ) : (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              )}
                              <span className="font-mono font-bold text-sm sm:text-base">
                                {file.result.isDeepfake
                                  ? "DEEPFAKE DETECTED"
                                  : "AUTHENTIC MEDIA"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {file.result.processingTime.toFixed(1)}s
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="bg-card rounded-lg p-3 border">
                              <div className="text-xs font-mono text-muted-foreground mb-1">
                                CONFIDENCE
                              </div>
                              <div className="text-lg sm:text-xl font-mono font-bold">
                                {file.result.confidence.toFixed(1)}%
                              </div>
                            </div>
                            <div className="bg-card rounded-lg p-3 border">
                              <div className="text-xs font-mono text-muted-foreground mb-1">
                                ANOMALIES
                              </div>
                              <div className="text-lg sm:text-xl font-mono font-bold">
                                {file.result.anomalies.length}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              className="font-mono text-xs"
                              onClick={() =>
                                router.push(
                                  `/dashboard/results/${file.analysisId}`
                                )
                              }
                            >
                              VIEW DETAILS
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="font-mono text-xs hover:bg-accent/50"
                              onClick={() => downloadReport(file)}
                            >
                              <Download className="w-3 h-3 mr-1" />
                              REPORT
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="font-mono text-xs hover:bg-accent/50"
                              onClick={() => retryAnalysis(file.id)}
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              RETRY
                            </Button>
                          </div>
                        </div>
                      )}

                      {file.status === "error" && (
                        <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                            <span className="font-mono font-bold text-destructive text-sm">
                              ANALYSIS FAILED
                            </span>
                          </div>
                          <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                            {file.analysisStage}
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="font-mono text-xs hover:bg-accent/50"
                            onClick={() => retryAnalysis(file.id)}
                          >
                            <RotateCcw className="w-3 h-3 mr-1" />
                            RETRY ANALYSIS
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Guidelines */}
      <Card className="hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <CardTitle className="font-mono text-lg sm:text-xl">
            ANALYSIS GUIDELINES
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="font-mono font-bold text-primary flex items-center gap-2">
                <Shield className="w-4 h-4" />
                BEST PRACTICES
              </h3>
              <div className="space-y-3">
                {[
                  "Use high-resolution media for better accuracy",
                  "Ensure clear visibility of faces in videos/images",
                  "Audio files should be clear with minimal background noise",
                  "Videos work best with at least 3 seconds of content",
                  "Avoid heavily compressed or low-quality files",
                  "Large files may take longer to process (up to 10 minutes)",
                ].map((practice, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 text-sm text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span>{practice}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-mono font-bold text-green-500 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                SUPPORTED FORMATS
              </h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <FileImage className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="font-semibold">Images (up to 50MB):</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-7">
                    JPG, PNG, GIF, BMP, TIFF, WEBP, SVG, ICO, HEIF, HEIC, AVIF
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <FileVideo className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="font-semibold">Videos (up to 2GB):</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-7">
                    MP4, MOV, AVI, MKV, WEBM, FLV, WMV, MPEG, OGV, 3GP, 3G2, TS
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Volume2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span className="font-semibold">Audio (up to 500MB):</span>
                  </div>
                  <p className="text-xs text-muted-foreground ml-7">
                    MP3, WAV, AAC, OGG, M4A, FLAC, OPUS, WEBM, MIDI, AIFF, AMR
                  </p>
                </div>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>
                    Processing time: 30s - 10min depending on file size
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
