"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  FileText,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Report, User as PrismaUser } from "@prisma/client";
import { Report } from "@prisma/client";
import Link from "next/link";
type ReportWithReporter = Report & {
  reporter?: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
};

export default function ReportsList({
  reports,
}: {
  reports: ReportWithReporter[];
}) {
  const [reportsList, setReportsList] = useState<ReportWithReporter[]>(reports);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");

  useEffect(() => {
    setReportsList(reports);
  }, [reports]);

  // Filter reports based on search query and status filter
  const filteredReports = reportsList.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reporter?.name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      report.reporter?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      currentFilter === "all" || report.status === currentFilter;

    return matchesSearch && matchesFilter;
  });

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
          >
            <AlertCircle className="w-3 h-3" /> Submitted
          </Badge>
        );
      case "UNDER_REVIEW":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1"
          >
            <Clock className="w-3 h-3" /> Under Review
          </Badge>
        );
      case "INVESTIGATING":
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1"
          >
            <Clock className="w-3 h-3" /> Investigating
          </Badge>
        );
      case "RESOLVED":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </Badge>
        );
      case "CLOSED":
        return (
          <Badge
            variant="outline"
            className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1"
          >
            <XCircle className="w-3 h-3" /> Closed
          </Badge>
        );
      case "REJECTED":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
          >
            <XCircle className="w-3 h-3" /> Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return <Badge className="bg-red-500">Critical</Badge>;
      case "HIGH":
        return <Badge className="bg-orange-500">High</Badge>;
      case "NORMAL":
        return <Badge className="bg-yellow-500">Normal</Badge>;
      case "LOW":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <h1 className="text-xl font-bold">Reports Management</h1>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="hidden md:flex">
              <FileText className="w-4 h-4 mr-1" />
              {filteredReports.length} Reports
            </Badge>
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 md:px-6 md:py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search reports..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={currentFilter} onValueChange={setCurrentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reports</SelectItem>
                <SelectItem value="SUBMITTED">Submitted</SelectItem>
                <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                <SelectItem value="INVESTIGATING">Investigating</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
                <SelectItem value="CLOSED">Closed</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select defaultValue="newest">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="status">Status</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
              <span className="sr-only">More filters</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="cards" className="mb-8">
          <TabsList>
            <TabsTrigger value="cards">Card View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>

          <TabsContent value="cards" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredReports.length === 0 ? (
                <div className="col-span-full p-8 text-center text-muted-foreground">
                  No reports found matching your criteria
                </div>
              ) : (
                filteredReports.map((report) => (
                  <Card
                    key={report.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          {getStatusBadge(report.status)}
                          {getPriorityBadge(report.priority)}
                        </div>
                        <CardTitle className="text-sm font-medium line-clamp-2">
                          {report.title}
                        </CardTitle>
                        <CardDescription className="text-xs line-clamp-2">
                          {report.description}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2 space-y-2">
                      {report.reporter && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={report.reporter.image || ""}
                              alt={report.reporter.name || "Reporter"}
                            />
                            <AvatarFallback className="text-[8px]">
                              {report.reporter.name?.charAt(0)?.toUpperCase() ||
                                "A"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate">
                            {report.reporter.name || "Anonymous"}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">
                          {report.location.city}, {report.location.state}
                          {report.location.coordinates && (
                            <span className="ml-1 px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px]">
                              GPS
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(report.createdAt).toLocaleDateString(
                            "en-GB"
                          )}
                        </span>
                      </div>

                      <Badge variant="outline" className="text-xs">
                        {report.reportType.replace("_", " ")}
                      </Badge>

                      <div className="pt-2">
                        <Link href={`/menu/admin/reports/${report.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="list" className="mt-4">
            <div className="rounded-lg border bg-card">
              <div className="grid grid-cols-12 p-4 border-b font-medium text-sm">
                <div className="col-span-3">Report</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 hidden md:block">Priority</div>
                <div className="col-span-2 hidden md:block">Reporter</div>
                <div className="col-span-2 hidden md:block">Location</div>
                <div className="col-span-1">Date</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              {filteredReports.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No reports found matching your criteria
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="grid grid-cols-12 p-4 border-b items-center text-sm hover:bg-muted/50"
                  >
                    <div className="col-span-3">
                      <div className="space-y-1">
                        <div className="font-medium truncate">
                          {report.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {report.description}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {report.reportType.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                    <div className="col-span-2">
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="col-span-1 hidden md:block">
                      {getPriorityBadge(report.priority)}
                    </div>
                    <div className="col-span-2 hidden md:block">
                      {report.reporter ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage
                              src={report.reporter.image || ""}
                              alt={report.reporter.name || "Reporter"}
                            />
                            <AvatarFallback className="text-[8px]">
                              {report.reporter.name?.charAt(0)?.toUpperCase() ||
                                "A"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="truncate text-xs">
                            {report.reporter.name || "Anonymous"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Anonymous
                        </span>
                      )}
                    </div>
                    <div className="col-span-2 hidden md:block">
                      <div className="text-xs text-muted-foreground">
                        {report.location.city}, {report.location.state}
                        {report.location.coordinates && (
                          <span className="ml-2 px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px]">
                            GPS
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString("en-GB")}
                      </div>
                    </div>
                    <div className="col-span-1 text-right">
                      <Link href={`/menu/admin/reports/${report.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
