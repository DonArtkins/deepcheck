"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileVideo,
  FileImage,
  MoreVertical,
} from "lucide-react"
import Link from "next/link"

// Mock detection history data
const mockHistory = [
  {
    id: "analysis_001",
    filename: "suspicious_video.mp4",
    type: "video",
    uploadDate: "2024-01-15T10:30:00Z",
    isDeepfake: true,
    confidence: 94.2,
    status: "completed",
    fileSize: "15.2 MB",
    duration: 45,
  },
  {
    id: "analysis_002",
    filename: "profile_image.jpg",
    type: "image",
    uploadDate: "2024-01-14T16:45:00Z",
    isDeepfake: false,
    confidence: 12.3,
    status: "completed",
    fileSize: "2.8 MB",
    duration: null,
  },
  {
    id: "analysis_003",
    filename: "interview_clip.mp4",
    type: "video",
    uploadDate: "2024-01-14T09:15:00Z",
    isDeepfake: true,
    confidence: 87.6,
    status: "completed",
    fileSize: "28.4 MB",
    duration: 120,
  },
  {
    id: "analysis_004",
    filename: "social_media_post.jpg",
    type: "image",
    uploadDate: "2024-01-13T14:20:00Z",
    isDeepfake: false,
    confidence: 8.9,
    status: "completed",
    fileSize: "1.2 MB",
    duration: null,
  },
  {
    id: "analysis_005",
    filename: "news_segment.mp4",
    type: "video",
    uploadDate: "2024-01-13T11:30:00Z",
    isDeepfake: true,
    confidence: 91.8,
    status: "processing",
    fileSize: "45.7 MB",
    duration: 180,
  },
]

export default function DetectionHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterType, setFilterType] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = item.filename.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "deepfake" && item.isDeepfake) ||
      (filterStatus === "authentic" && !item.isDeepfake) ||
      (filterStatus === "processing" && item.status === "processing")
    const matchesType = filterType === "all" || item.type === filterType

    return matchesSearch && matchesStatus && matchesType
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-mono font-bold">DETECTION HISTORY</h1>
          <p className="text-muted-foreground mt-1">View and manage your analysis results</p>
        </div>
        <Button className="font-mono pulse-glow">
          <Download className="w-4 h-4 mr-2" />
          EXPORT ALL
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-mono bg-transparent"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 font-mono bg-transparent">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="deepfake">Deepfake</SelectItem>
                  <SelectItem value="authentic">Authentic</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32 font-mono bg-transparent">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="image">Image</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 font-mono bg-transparent">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="confidence">Confidence</SelectItem>
                  <SelectItem value="filename">Filename</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <Card key={item.id} className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                    {item.type === "video" ? (
                      <FileVideo className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <FileImage className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-mono font-semibold">{item.filename}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.uploadDate)}
                      </div>
                      <span>{item.fileSize}</span>
                      {item.duration && <span>{item.duration}s</span>}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {item.status === "processing" ? (
                    <Badge variant="secondary" className="font-mono">
                      PROCESSING
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-mono font-semibold">{item.confidence}%</div>
                        <div className="text-xs text-muted-foreground">CONFIDENCE</div>
                      </div>

                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.isDeepfake ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary"
                        }`}
                      >
                        {item.isDeepfake ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                      </div>

                      <Badge variant={item.isDeepfake ? "destructive" : "secondary"} className="font-mono">
                        {item.isDeepfake ? "DEEPFAKE" : "AUTHENTIC"}
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/results/${item.id}`}>
                      <Button variant="ghost" size="sm" className="font-mono">
                        <Eye className="w-4 h-4 mr-2" />
                        VIEW
                      </Button>
                    </Link>

                    <Button variant="ghost" size="sm">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredHistory.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-mono font-semibold mb-2">NO RESULTS FOUND</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
