"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Filter,
  Clock,
  HardDrive,
  Loader2,
} from "lucide-react";
import Link from "next/link";

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
];

export default function DetectionHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = item.filename
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "deepfake" && item.isDeepfake) ||
      (filterStatus === "authentic" && !item.isDeepfake) ||
      (filterStatus === "processing" && item.status === "processing");
    const matchesType = filterType === "all" || item.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold">
            DETECTION HISTORY
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            View and manage your analysis results
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-primary/20 bg-card/50 hover:shadow-lg transition-all duration-200">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 font-mono bg-background/50 border-border focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            {/* Mobile filter button */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                className="w-full font-mono bg-transparent border-border hover:bg-accent"
              >
                <Filter className="w-4 h-4 mr-2" />
                FILTERS
              </Button>
            </div>

            {/* Desktop filters */}
            <div className="hidden lg:flex gap-3">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 font-mono bg-background/50 border-border">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all" className="focus:bg-accent">
                    All Status
                  </SelectItem>
                  <SelectItem value="deepfake" className="focus:bg-accent">
                    Deepfake
                  </SelectItem>
                  <SelectItem value="authentic" className="focus:bg-accent">
                    Authentic
                  </SelectItem>
                  <SelectItem value="processing" className="focus:bg-accent">
                    Processing
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32 font-mono bg-background/50 border-border">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all" className="focus:bg-accent">
                    All Types
                  </SelectItem>
                  <SelectItem value="video" className="focus:bg-accent">
                    Video
                  </SelectItem>
                  <SelectItem value="image" className="focus:bg-accent">
                    Image
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32 font-mono bg-background/50 border-border">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="date" className="focus:bg-accent">
                    Date
                  </SelectItem>
                  <SelectItem value="confidence" className="focus:bg-accent">
                    Confidence
                  </SelectItem>
                  <SelectItem value="filename" className="focus:bg-accent">
                    Filename
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Mobile filters expanded */}
          <div className="lg:hidden mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="font-mono bg-background/50 border-border">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all" className="focus:bg-accent">
                  All Status
                </SelectItem>
                <SelectItem value="deepfake" className="focus:bg-accent">
                  Deepfake
                </SelectItem>
                <SelectItem value="authentic" className="focus:bg-accent">
                  Authentic
                </SelectItem>
                <SelectItem value="processing" className="focus:bg-accent">
                  Processing
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="font-mono bg-background/50 border-border">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="all" className="focus:bg-accent">
                  All Types
                </SelectItem>
                <SelectItem value="video" className="focus:bg-accent">
                  Video
                </SelectItem>
                <SelectItem value="image" className="focus:bg-accent">
                  Image
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="font-mono bg-background/50 border-border">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="date" className="focus:bg-accent">
                  Date
                </SelectItem>
                <SelectItem value="confidence" className="focus:bg-accent">
                  Confidence
                </SelectItem>
                <SelectItem value="filename" className="focus:bg-accent">
                  Filename
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <Card
            key={item.id}
            className="border-primary/20 bg-card/50 hover:bg-card/80 hover:shadow-lg transition-all duration-200 group"
          >
            <CardContent className="p-4 sm:p-6">
              {/* Mobile Layout */}
              <div className="sm:hidden">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-background/50 border border-border flex items-center justify-center flex-shrink-0">
                    {item.type === "video" ? (
                      <FileVideo className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <FileImage className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-mono font-semibold text-sm leading-tight break-all group-hover:text-primary transition-colors">
                      {item.filename}
                    </h3>
                    <div className="mt-1 space-y-1">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">
                          {formatDate(item.uploadDate)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3 flex-shrink-0" />
                          <span>{item.fileSize}</span>
                        </div>
                        {item.duration && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>{item.duration}s</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:bg-accent hover:text-foreground p-1 flex-shrink-0"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  {item.status === "processing" ? (
                    <Badge
                      variant="secondary"
                      className="font-mono bg-yellow-500/10 text-yellow-500 border-yellow-500/20 text-xs"
                    >
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      PROCESSING
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="text-center">
                        <div className="text-base font-mono font-bold">
                          {item.confidence}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          CONF
                        </div>
                      </div>
                      <Badge
                        variant={item.isDeepfake ? "destructive" : "secondary"}
                        className={`font-mono text-xs px-2 ${
                          item.isDeepfake
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                        }`}
                      >
                        {item.isDeepfake ? (
                          <>
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            DEEPFAKE
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            AUTHENTIC
                          </>
                        )}
                      </Badge>
                    </div>
                  )}

                  <Link href={`/dashboard/results/${item.id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-mono hover:bg-primary/10 hover:text-primary text-xs px-2 py-1 transition-colors"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      VIEW
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Desktop Layout */}
              <div className="hidden sm:flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-background/50 border border-border flex items-center justify-center">
                    {item.type === "video" ? (
                      <FileVideo className="w-6 h-6 text-muted-foreground" />
                    ) : (
                      <FileImage className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-mono font-semibold group-hover:text-primary transition-colors">
                      {item.filename}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(item.uploadDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <HardDrive className="w-3 h-3" />
                        {item.fileSize}
                      </div>
                      {item.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.duration}s
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {item.status === "processing" ? (
                    <Badge
                      variant="secondary"
                      className="font-mono bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    >
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                      PROCESSING
                    </Badge>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-mono font-bold text-lg">
                          {item.confidence}%
                        </div>
                        <div className="text-xs text-muted-foreground">
                          CONFIDENCE
                        </div>
                      </div>

                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.isDeepfake
                            ? "bg-destructive/10 text-destructive"
                            : "bg-green-500/10 text-green-600 dark:text-green-400"
                        }`}
                      >
                        {item.isDeepfake ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )}
                      </div>

                      <Badge
                        variant={item.isDeepfake ? "destructive" : "secondary"}
                        className={`font-mono ${
                          item.isDeepfake
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                        }`}
                      >
                        {item.isDeepfake ? "DEEPFAKE" : "AUTHENTIC"}
                      </Badge>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Link href={`/dashboard/results/${item.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="font-mono hover:bg-primary/10 hover:text-primary transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        VIEW
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:bg-accent hover:text-foreground"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredHistory.length === 0 && (
        <Card className="border-primary/20 bg-card/50">
          <CardContent className="p-8 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-background/50 border border-border flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-mono font-bold mb-2 text-lg">
              NO RESULTS FOUND
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Try adjusting your search or filter criteria
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
