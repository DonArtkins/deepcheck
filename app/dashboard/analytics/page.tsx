"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  PieChart,
  Zap,
} from "lucide-react";
import {
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  Bar,
  Area,
  Pie,
  Cell,
} from "recharts";

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalAnalyses: 1247,
    deepfakesDetected: 89,
    accuracyRate: 99.7,
    avgProcessingTime: 2.3,
    trendsVsPrevious: {
      totalAnalyses: 12.5,
      deepfakesDetected: -8.3,
      accuracyRate: 2.1,
      avgProcessingTime: -15.2,
    },
  },
  timeSeriesData: [
    { date: "Jan 1", analyses: 45, deepfakes: 12, accuracy: 94.2 },
    { date: "Jan 2", analyses: 52, deepfakes: 15, accuracy: 95.1 },
    { date: "Jan 3", analyses: 38, deepfakes: 8, accuracy: 97.3 },
    { date: "Jan 4", analyses: 61, deepfakes: 18, accuracy: 96.8 },
    { date: "Jan 5", analyses: 47, deepfakes: 11, accuracy: 95.9 },
    { date: "Jan 6", analyses: 55, deepfakes: 14, accuracy: 96.4 },
    { date: "Jan 7", analyses: 43, deepfakes: 9, accuracy: 97.1 },
  ],
  fileTypeData: [
    { type: "Video", count: 847, percentage: 67.9, deepfakes: 245 },
    { type: "Image", count: 400, percentage: 32.1, deepfakes: 67 },
  ],
  confidenceData: [
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
  accuracyTrend: [
    { period: "Week 1", accuracy: 94.2 },
    { period: "Week 2", accuracy: 95.8 },
    { period: "Week 3", accuracy: 97.1 },
    { period: "Week 4", accuracy: 98.4 },
    { period: "Week 5", accuracy: 99.7 },
  ],
};

const COLORS = {
  primary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  muted: "#64748b",
};

const PIE_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [trendsChartType, setTrendsChartType] = useState("line");
  const [accuracyChartType, setAccuracyChartType] = useState("area");

  const {
    overview,
    timeSeriesData,
    fileTypeData,
    confidenceData,
    detectionMethods,
    accuracyTrend,
  } = mockAnalytics;

  const renderTrendsChart = () => {
    const commonProps = {
      data: timeSeriesData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    if (trendsChartType === "line") {
      return (
        <RechartsLineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="analyses"
            stroke={COLORS.primary}
            strokeWidth={2}
            name="Analyses"
          />
          <Line
            type="monotone"
            dataKey="deepfakes"
            stroke={COLORS.danger}
            strokeWidth={2}
            name="Deepfakes"
          />
        </RechartsLineChart>
      );
    }

    return (
      <RechartsBarChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
        <YAxis stroke="#9ca3af" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
          }}
        />
        <Legend />
        <Bar dataKey="analyses" fill={COLORS.primary} name="Analyses" />
        <Bar dataKey="deepfakes" fill={COLORS.danger} name="Deepfakes" />
      </RechartsBarChart>
    );
  };

  const renderAccuracyChart = () => {
    const commonProps = {
      data: accuracyTrend,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    if (accuracyChartType === "area") {
      return (
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis dataKey="period" stroke="#9ca3af" fontSize={12} />
          <YAxis stroke="#9ca3af" fontSize={12} domain={[90, 100]} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1f2937",
              border: "1px solid #374151",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Area
            type="monotone"
            dataKey="accuracy"
            stroke={COLORS.success}
            fill={COLORS.success}
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </AreaChart>
      );
    }

    return (
      <RechartsLineChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="period" stroke="#9ca3af" fontSize={12} />
        <YAxis stroke="#9ca3af" fontSize={12} domain={[90, 100]} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "8px",
            color: "#fff",
          }}
        />
        <Line
          type="monotone"
          dataKey="accuracy"
          stroke={COLORS.success}
          strokeWidth={3}
          dot={{ fill: COLORS.success, strokeWidth: 2, r: 4 }}
        />
      </RechartsLineChart>
    );
  };

  return (
    <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-mono font-bold">
            ANALYTICS & REPORTS
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32 font-mono">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h" className="font-mono">
                Last 24h
              </SelectItem>
              <SelectItem value="7d" className="font-mono">
                Last 7d
              </SelectItem>
              <SelectItem value="30d" className="font-mono">
                Last 30d
              </SelectItem>
              <SelectItem value="90d" className="font-mono">
                Last 90d
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                  {overview.totalAnalyses.toLocaleString()}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-mono">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                +{Math.abs(overview.trendsVsPrevious.totalAnalyses)}% from last
                week
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
                  {overview.deepfakesDetected}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-destructive/10 rounded-lg flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-mono">
              <TrendingDown className="w-3 h-3 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                {overview.trendsVsPrevious.deepfakesDetected}% detection rate
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
                  {overview.accuracyRate}%
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-mono">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                +{Math.abs(overview.trendsVsPrevious.accuracyRate)}%
                Military-grade precision
              </span>
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
                  {overview.avgProcessingTime}s
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-500/10 rounded-lg flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3 text-xs font-mono">
              <TrendingDown className="w-3 h-3 text-green-500" />
              <span className="text-green-600 dark:text-green-400">
                {overview.trendsVsPrevious.avgProcessingTime}% Lightning fast
                analysis
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Detection Trends */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-mono flex items-center gap-2 text-base sm:text-lg">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                DETECTION TRENDS
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant={trendsChartType === "line" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTrendsChartType("line")}
                  className="font-mono h-8 px-2"
                >
                  <LineChart className="w-4 h-4" />
                </Button>
                <Button
                  variant={trendsChartType === "bar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTrendsChartType("bar")}
                  className="font-mono h-8 px-2"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {renderTrendsChart()}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Accuracy Trends */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="font-mono flex items-center gap-2 text-base sm:text-lg">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                ACCURACY TRENDS
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant={accuracyChartType === "area" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setAccuracyChartType("area")}
                  className="font-mono h-8 px-2"
                >
                  <Activity className="w-4 h-4" />
                </Button>
                <Button
                  variant={accuracyChartType === "line" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setAccuracyChartType("line")}
                  className="font-mono h-8 px-2"
                >
                  <LineChart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                {renderAccuracyChart()}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Analytics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* File Type Breakdown */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="font-mono flex items-center gap-2 text-base sm:text-lg">
              <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              FILE TYPE BREAKDOWN
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {fileTypeData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {item.type === "Video" ? (
                        <FileVideo className="w-4 h-4 text-primary" />
                      ) : (
                        <FileImage className="w-4 h-4 text-green-500" />
                      )}
                      <span className="font-mono text-sm">{item.type}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm font-bold">
                        {item.count}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.percentage}%
                      </div>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        item.type === "Video" ? "bg-primary" : "bg-green-500"
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    {item.deepfakes} deepfakes detected (
                    {((item.deepfakes / item.count) * 100).toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Confidence Distribution */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="font-mono flex items-center gap-2 text-base sm:text-lg">
              <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              CONFIDENCE DISTRIBUTION
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={confidenceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="count"
                    nameKey="range"
                  >
                    {confidenceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={PIE_COLORS[index % PIE_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {confidenceData.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: PIE_COLORS[index] }}
                    />
                    <span className="font-mono">{item.range}</span>
                  </div>
                  <span className="font-mono">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detection Methods Performance */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="font-mono flex items-center gap-2 text-base sm:text-lg">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              DETECTION METHODS
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {detectionMethods.map((method, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-mono font-medium truncate">
                      {method.method}
                    </span>
                    <span className="font-mono text-muted-foreground text-xs">
                      {method.usage}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="h-2 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                      style={{ width: `${method.usage}%` }}
                    />
                  </div>
                  <div className="text-xs font-mono text-muted-foreground">
                    Accuracy: {method.accuracy}%
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
