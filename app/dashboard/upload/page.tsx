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

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { user, isAuthenticated, isLoading, token, apiCall } = useAuth();

  // Show loading state while auth is initializing
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Could redirect to login or show appropriate message
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

  const handleFiles = useCallback(
    (newFiles: File[]) => {
      if (!isAuthenticated) {
        console.error("User not authenticated");
        return;
      }

      const validFiles = newFiles.filter((file) => {
        const isValidType =
          file.type.startsWith("image/") ||
          file.type.startsWith("video/") ||
          file.type.startsWith("audio/");
        const isValidSize = file.size <= 100 * 1024 * 1024; // 100MB limit
        return isValidType && isValidSize;
      });

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
        preview: file.type.startsWith("image/")
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

      // Update status to uploading
      setFiles((prev) =>
        prev.map((file) =>
          file.id === uploadedFile.id
            ? { ...file, analysisStage: "Uploading file...", progress: 10 }
            : file
        )
      );

      // Create FormData
      const formData = new FormData();
      formData.append("file", uploadedFile.file);
      formData.append("name", uploadedFile.file.name);

      // Use the apiCall method from AuthContext which handles JWT authentication
      const result = await apiCall("/api/dashboard/upload", {
        method: "POST",
        body: formData, // apiCall will handle FormData and not set Content-Type
      });

      if (result.success) {
        setFiles((prev) =>
          prev.map((file) =>
            file.id === uploadedFile.id
              ? {
                  ...file,
                  status: "processing",
                  progress: 20,
                  analysisStage: "Analysis started...",
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
    const maxAttempts = 60; // 5 minutes max (5 seconds * 60)
    let stageIndex = 0;

    const poll = async () => {
      try {
        // Use apiCall for authenticated requests
        const data = await apiCall(`/api/dashboard/analyses/${analysisId}`);
        const analysis = data.analysis;

        // Update progress based on status
        if (analysis.status === "processing" || analysis.status === "pending") {
          // Simulate progress through stages
          const progressPerStage = 80 / analysisStages.length; // Reserve 20% for completion
          const currentProgress = Math.min(
            95,
            20 + (stageIndex + 1) * progressPerStage
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
          if (Math.random() > 0.7 && stageIndex < analysisStages.length - 1) {
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
                      analysisStage: "Analysis timed out",
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
          Supported: JPG, PNG, MP4, MOV, WAV, MP3 • Max: 100MB
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
                            {(file.file.size / (1024 * 1024)).toFixed(2)} MB •{" "}
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

      {/* Guidelines */}
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
                  "Use high-resolution images (minimum 512x512 pixels)",
                  "Ensure clear facial visibility in the media",
                  "Videos should be at least 3 seconds long",
                  "Audio files should be clear with minimal background noise",
                  "Avoid heavily compressed or low-quality files",
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
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <FileImage className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Images: JPG, PNG, WEBP, BMP, GIF</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <FileVideo className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Videos: MP4, MOV, AVI, MKV, WEBM</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Volume2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Audio: WAV, MP3, FLAC, AAC, OGG</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <HardDrive className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Maximum file size: 100MB</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>Processing time: 10-60 seconds per file</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
