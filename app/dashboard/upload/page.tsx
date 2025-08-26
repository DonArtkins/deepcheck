"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
} from "lucide-react"
import { useRouter } from "next/navigation"

interface UploadedFile {
  id: string
  file: File
  preview?: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  analysisStage: string
  result?: {
    isDeepfake: boolean
    confidence: number
    processingTime: number
    anomalies: Array<{
      type: string
      severity: "low" | "medium" | "high"
      description: string
    }>
  }
}

const analysisStages = [
  { name: "Preprocessing media...", icon: Upload, duration: 1000 },
  { name: "Extracting facial features...", icon: Scan, duration: 2000 },
  { name: "Running AI analysis...", icon: Brain, duration: 3000 },
  { name: "Detecting anomalies...", icon: Eye, duration: 2000 },
  { name: "Calculating confidence...", icon: Shield, duration: 1000 },
]

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files)
    handleFiles(droppedFiles)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      handleFiles(selectedFiles)
    }
  }, [])

  const handleFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      const isValidType = file.type.startsWith("image/") || file.type.startsWith("video/")
      const isValidSize = file.size <= 100 * 1024 * 1024 // 100MB limit
      return isValidType && isValidSize
    })

    const uploadedFiles: UploadedFile[] = validFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: "uploading",
      progress: 0,
      analysisStage: "Uploading file...",
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }))

    setFiles((prev) => [...prev, ...uploadedFiles])

    // Simulate upload and analysis process
    uploadedFiles.forEach((uploadedFile) => {
      simulateAnalysis(uploadedFile.id)
    })
  }, [])

  const simulateAnalysis = async (fileId: string) => {
    // Upload simulation
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setFiles((prev) =>
        prev.map((file) =>
          file.id === fileId
            ? {
                ...file,
                progress: i,
                analysisStage: i === 100 ? "Upload complete" : "Uploading file...",
              }
            : file,
        ),
      )
    }

    // Analysis simulation
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              status: "processing",
              progress: 0,
            }
          : file,
      ),
    )

    let totalProgress = 0
    for (const stage of analysisStages) {
      setFiles((prev) =>
        prev.map((file) =>
          file.id === fileId
            ? {
                ...file,
                analysisStage: stage.name,
              }
            : file,
        ),
      )

      const stageProgress = 100 / analysisStages.length
      for (let i = 0; i <= stageProgress; i += 2) {
        await new Promise((resolve) => setTimeout(resolve, stage.duration / (stageProgress / 2)))
        totalProgress = Math.min(100, totalProgress + 2)
        setFiles((prev) =>
          prev.map((file) =>
            file.id === fileId
              ? {
                  ...file,
                  progress: totalProgress,
                }
              : file,
          ),
        )
      }
    }

    // Generate mock result
    const isDeepfake = Math.random() > 0.7
    const confidence = Math.random() * 20 + (isDeepfake ? 75 : 80)

    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              status: "completed",
              progress: 100,
              analysisStage: "Analysis complete",
              result: {
                isDeepfake,
                confidence,
                processingTime: Math.random() * 2 + 1.5,
                anomalies: isDeepfake
                  ? [
                      {
                        type: "Facial inconsistency",
                        severity: "high" as const,
                        description: "Detected unnatural facial feature transitions",
                      },
                      {
                        type: "Temporal artifacts",
                        severity: "medium" as const,
                        description: "Inconsistent lighting patterns across frames",
                      },
                    ]
                  : [],
              },
            }
          : file,
      ),
    )
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const retryAnalysis = (fileId: string) => {
    setFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              status: "uploading",
              progress: 0,
              analysisStage: "Retrying analysis...",
              result: undefined,
            }
          : file,
      ),
    )
    simulateAnalysis(fileId)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold">UPLOAD & ANALYZE</h1>
          <p className="text-muted-foreground mt-1">Upload media files for deepfake detection analysis</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-sm font-mono text-muted-foreground">Supported: JPG, PNG, MP4, MOV • Max: 100MB</div>
        </div>
      </div>

      {/* Upload Zone */}
      <Card className="border-dashed border-2 border-border hover:border-primary/50 transition-colors">
        <CardContent className="p-12">
          <div
            className={`relative transition-all duration-300 ${
              isDragging ? "scale-105 border-primary bg-primary/5" : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center pulse-glow">
                <Upload className="w-10 h-10 text-primary" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-mono font-semibold">DROP FILES HERE</h3>
                <p className="text-muted-foreground">Drag and drop your media files or click to browse</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => fileInputRef.current?.click()} className="font-mono pulse-glow" size="lg">
                  <Upload className="w-4 h-4 mr-2" />
                  SELECT FILES
                </Button>
                <Button variant="outline" className="font-mono bg-transparent" size="lg">
                  <FileVideo className="w-4 h-4 mr-2" />
                  SAMPLE FILES
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-mono font-semibold">ANALYSIS QUEUE</h2>
          <div className="space-y-4">
            {files.map((file) => (
              <Card key={file.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* File Preview */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-card border border-border rounded-lg flex items-center justify-center overflow-hidden">
                        {file.preview ? (
                          <img
                            src={file.preview || "/placeholder.svg"}
                            alt={file.file.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FileVideo className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                    </div>

                    {/* File Info and Progress */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-mono font-medium truncate">{file.file.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {(file.file.size / (1024 * 1024)).toFixed(2)} MB •{" "}
                            {file.file.type.split("/")[1].toUpperCase()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(file.id)}
                          className="hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm font-mono">
                          <span className="flex items-center gap-2">
                            {file.status === "processing" && <Loader2 className="w-3 h-3 animate-spin text-primary" />}
                            {file.analysisStage}
                          </span>
                          <span className="text-primary">{Math.round(file.progress)}%</span>
                        </div>
                        <Progress value={file.progress} className="h-2" />
                      </div>

                      {/* Results */}
                      {file.status === "completed" && file.result && (
                        <div className="mt-4 p-4 bg-card/50 border border-border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {file.result.isDeepfake ? (
                                <AlertTriangle className="w-5 h-5 text-destructive" />
                              ) : (
                                <CheckCircle className="w-5 h-5 text-secondary" />
                              )}
                              <span className="font-mono font-semibold">
                                {file.result.isDeepfake ? "DEEPFAKE DETECTED" : "AUTHENTIC MEDIA"}
                              </span>
                            </div>
                            <div className="text-sm font-mono text-muted-foreground">
                              {file.result.processingTime.toFixed(1)}s
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <div className="text-sm font-mono text-muted-foreground">CONFIDENCE</div>
                              <div className="text-lg font-mono font-bold">{file.result.confidence.toFixed(1)}%</div>
                            </div>
                            <div>
                              <div className="text-sm font-mono text-muted-foreground">ANOMALIES</div>
                              <div className="text-lg font-mono font-bold">{file.result.anomalies.length}</div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="font-mono"
                              onClick={() => router.push(`/dashboard/results/${file.id}`)}
                            >
                              VIEW DETAILS
                            </Button>
                            <Button variant="outline" size="sm" className="font-mono bg-transparent">
                              <Download className="w-3 h-3 mr-1" />
                              REPORT
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="font-mono bg-transparent"
                              onClick={() => retryAnalysis(file.id)}
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              RETRY
                            </Button>
                          </div>
                        </div>
                      )}

                      {file.status === "error" && (
                        <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-destructive" />
                            <span className="font-mono font-semibold text-destructive">ANALYSIS FAILED</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Unable to process this file. Please try again or contact support.
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            className="font-mono bg-transparent"
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

      {/* Tips and Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="font-mono">ANALYSIS GUIDELINES</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-mono font-semibold text-primary">BEST PRACTICES</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full mt-2" />
                  <span>Use high-resolution images (minimum 512x512 pixels)</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full mt-2" />
                  <span>Ensure clear facial visibility in the media</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full mt-2" />
                  <span>Videos should be at least 3 seconds long</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1 h-1 bg-primary rounded-full mt-2" />
                  <span>Avoid heavily compressed or low-quality files</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-mono font-semibold text-secondary">SUPPORTED FORMATS</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <FileImage className="w-4 h-4 text-secondary" />
                  <span>Images: JPG, PNG, WEBP, BMP</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileVideo className="w-4 h-4 text-secondary" />
                  <span>Videos: MP4, MOV, AVI, MKV</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-secondary" />
                  <span>Maximum file size: 100MB</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-secondary" />
                  <span>Processing time: 2-5 seconds per file</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
