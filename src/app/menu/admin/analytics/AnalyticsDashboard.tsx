"use client";

import { useMemo, useState } from "react";
import { Report } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  Calendar,
  AlertTriangle,
  FileText,
  MapPin,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  AreaChart,
  Tooltip,
} from "recharts";

type ReportWithReporter = Report & {
  reporter?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
};

const COLORS = {
  THEFT: "#0EA5E9", // Ocean Blue
  ASSAULT: "#EF4444", // Red
  VANDALISM: "#F59E0B", // Amber
  FRAUD: "#8B5CF6", // Violet
  MISSING_PERSON: "#EC4899", // Pink
  DOMESTIC_VIOLENCE: "#DC2626", // Dark Red
  BURGLARY: "#D946EF", // Fuchsia
  ACCIDENT: "#06B6D4", // Cyan
  DRUG_RELATED: "#84CC16", // Lime
  OTHER: "#6B7280", // Gray
  // Keep legacy mappings just in case
  CYBER_CRIME: "#6366F1", // Indigo
  DRUG_OFFENSE: "#84CC16", // Lime
  HOMICIDE: "#9F1239", // Rose
  KIDNAPPING: "#BE123C", // Dark Pink
  ROBBERY: "#F97316", // Orange
  SEXUAL_ASSAULT: "#A855F7", // Purple
  TRAFFIC_VIOLATION: "#14B8A6", // Teal
};

const STATUS_COLORS = {
  SUBMITTED: "#3B82F6", // Blue
  UNDER_REVIEW: "#8B5CF6", // Violet
  INVESTIGATING: "#F59E0B", // Amber
  RESOLVED: "#10B981", // Emerald
  CLOSED: "#6B7280", // Gray
  REJECTED: "#EF4444", // Red
};

const PRIORITY_COLORS = {
  CRITICAL: "#DC2626", // Red 600
  HIGH: "#EA580C", // Orange 600
  NORMAL: "#EAB308", // Yellow 500
  LOW: "#22C55E", // Green 500
};

export default function AnalyticsDashboard({
  reports,
}: {
  reports: ReportWithReporter[];
}) {
  const [timeRange, setTimeRange] = useState<
    "7d" | "30d" | "90d" | "1y" | "all"
  >("30d");

  // Filter reports by time range
  const filteredReports = useMemo(() => {
    if (timeRange === "all") return reports;

    const now = new Date();
    const ranges = {
      "7d": 7,
      "30d": 30,
      "90d": 90,
      "1y": 365,
    };

    const days = ranges[timeRange];
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    return reports.filter((report) => new Date(report.createdAt) >= cutoffDate);
  }, [reports, timeRange]);

  // Crime type statistics
  const crimeTypeData = useMemo(() => {
    const typeCounts: Record<string, number> = {};

    filteredReports.forEach((report) => {
      const type = report.reportType;
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    return Object.entries(typeCounts)
      .map(([name, value]) => ({
        name: name.replace(/_/g, " "),
        value,
        color: COLORS[name as keyof typeof COLORS] || COLORS.OTHER,
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredReports]);

  // Timeline data (by month or day depending on range)
  const timelineData = useMemo(() => {
    const timeMap: Record<
      string,
      { date: string; count: number; types: Record<string, number> }
    > = {};

    filteredReports.forEach((report) => {
      const date = new Date(report.createdAt);
      let key: string;

      if (timeRange === "7d") {
        key = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else if (timeRange === "30d") {
        key = date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
      } else {
        key = date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });
      }

      if (!timeMap[key]) {
        timeMap[key] = { date: key, count: 0, types: {} };
      }

      timeMap[key].count++;
      const type = report.reportType;
      timeMap[key].types[type] = (timeMap[key].types[type] || 0) + 1;
    });

    return Object.values(timeMap).sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  }, [filteredReports, timeRange]);

  // Status distribution
  const statusData = useMemo(() => {
    const statusCounts: Record<string, number> = {};

    filteredReports.forEach((report) => {
      const status = report.status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });

    return Object.entries(statusCounts).map(([name, value]) => ({
      name: name.replace(/_/g, " "),
      value,
      color: STATUS_COLORS[name as keyof typeof STATUS_COLORS] || "#6b7280",
    }));
  }, [filteredReports]);

  // Priority distribution
  const priorityData = useMemo(() => {
    const priorityCounts: Record<string, number> = {};

    filteredReports.forEach((report) => {
      const priority = report.priority;
      priorityCounts[priority] = (priorityCounts[priority] || 0) + 1;
    });

    return Object.entries(priorityCounts).map(([name, value]) => ({
      name: name.charAt(0) + name.slice(1).toLowerCase(),
      value,
      color: PRIORITY_COLORS[name as keyof typeof PRIORITY_COLORS] || "#6b7280",
    }));
  }, [filteredReports]);

  // Location statistics
  const locationData = useMemo(() => {
    const locationCounts: Record<string, number> = {};

    filteredReports.forEach((report) => {
      const location = `${report.location.city}, ${report.location.state}`;
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    return Object.entries(locationCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  }, [filteredReports]);

  // Statistics cards
  const stats = useMemo(() => {
    const total = filteredReports.length;
    const critical = filteredReports.filter(
      (r) => r.priority === "CRITICAL"
    ).length;
    const resolved = filteredReports.filter(
      (r) => r.status === "RESOLVED"
    ).length;
    const pending = filteredReports.filter(
      (r) =>
        r.status === "SUBMITTED" ||
        r.status === "UNDER_REVIEW" ||
        r.status === "INVESTIGATING"
    ).length;

    return { total, critical, resolved, pending };
  }, [filteredReports]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Crime Analytics Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <Select
              value={timeRange}
              onValueChange={(value) =>
                setTimeRange(value as "7d" | "30d" | "90d" | "1y" | "all")
              }
            >
              <SelectTrigger className="w-[180px] transition-all duration-200">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 md:px-6 md:py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8 animate-in fade-in duration-500 delay-150">
          <Card className="transition-all duration-200 hover:shadow-lg hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Total Reports
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {timeRange === "all" ? "All time" : `Last ${timeRange}`}
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-lg hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Critical Cases
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.critical}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0
                  ? `${((stats.critical / stats.total) * 100).toFixed(
                      1
                    )}% of total`
                  : "0%"}
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-lg hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <Activity className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.resolved}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.total > 0
                  ? `${((stats.resolved / stats.total) * 100).toFixed(
                      1
                    )}% resolution rate`
                  : "0%"}
              </p>
            </CardContent>
          </Card>

          <Card className="transition-all duration-200 hover:shadow-lg hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.pending}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Active investigations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          {/* Crime Timeline Chart */}
          <Card className="col-span-2 animate-in fade-in duration-500 delay-300">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Crime Reports Timeline
                  </CardTitle>
                  <CardDescription>Number of reports over time</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={timelineData}>
                    <defs>
                      <linearGradient
                        id="colorCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8B5CF6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3B82F6"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis
                      dataKey="date"
                      className="text-xs"
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#8B5CF6"
                      fillOpacity={1}
                      fill="url(#colorCount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Crime Type Distribution */}
          <Card className="animate-in fade-in duration-500 delay-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Crime Types Distribution
              </CardTitle>
              <CardDescription>Reports by crime category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={crimeTypeData} layout="vertical">
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis type="number" tick={{ fontSize: 12 }} />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={120}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {crimeTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Status Distribution Pie Chart */}
          <Card className="animate-in fade-in duration-500 delay-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Status Distribution
              </CardTitle>
              <CardDescription>Current status of all reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Priority Distribution */}
          <Card className="animate-in fade-in duration-500 delay-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Priority Levels
              </CardTitle>
              <CardDescription>Distribution by priority</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-muted"
                    />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Top Locations */}
          <Card className="animate-in fade-in duration-500 delay-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Top 10 Locations
              </CardTitle>
              <CardDescription>Cities with most reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {locationData.map((location, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="outline"
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                      >
                        {index + 1}
                      </Badge>
                      <span className="text-sm font-medium">
                        {location.name}
                      </span>
                    </div>
                    <Badge>{location.value} reports</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Crime Type Details Table */}
        <Card className="animate-in fade-in duration-500 delay-800">
          <CardHeader>
            <CardTitle>Detailed Crime Statistics</CardTitle>
            <CardDescription>
              Comprehensive breakdown of all crime types
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border">
              <div className="grid grid-cols-12 p-4 border-b font-medium text-sm bg-muted/50">
                <div className="col-span-1">#</div>
                <div className="col-span-5">Crime Type</div>
                <div className="col-span-2 text-center">Count</div>
                <div className="col-span-2 text-center">Percentage</div>
                <div className="col-span-2 text-right">Status</div>
              </div>
              {crimeTypeData.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-12 p-4 border-b items-center text-sm hover:bg-muted/50 transition-colors duration-200"
                >
                  <div className="col-span-1 text-muted-foreground">
                    {index + 1}
                  </div>
                  <div className="col-span-5 flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="font-medium">{item.name}</span>
                  </div>
                  <div className="col-span-2 text-center font-semibold">
                    {item.value}
                  </div>
                  <div className="col-span-2 text-center">
                    <Badge variant="secondary">
                      {((item.value / filteredReports.length) * 100).toFixed(1)}
                      %
                    </Badge>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${
                            (item.value / filteredReports.length) * 100
                          }%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
