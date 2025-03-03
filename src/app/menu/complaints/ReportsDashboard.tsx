"use client";

import { useEffect, useState } from "react";

import {
  Search,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Report } from "@prisma/client";
import reportSVG from "../../../../public/report.svg";
import Link from "next/link";

export default function ReportsDashboard({
  fetchedReports,
}: {
  fetchedReports: Report[];
}) {
  const [reports, setReports] = useState<Report[]>(fetchedReports);

  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");

  async function fetchReports() {
    setReports(fetchedReports);
  }

  useEffect(() => {
    fetchReports();
  }, []);

  // Filter reports based on search query and status filter
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.id.toLowerCase().includes(searchQuery.toLowerCase());

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
      case "critical":
        return <Badge className="bg-red-500">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-500">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case "low":
        return <Badge className="bg-green-500">Low</Badge>;
      default:
        return <Badge>{priority}</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <h1 className="text-xl font-bold">My Reports</h1>
          <div className="flex items-center gap-4">
            <Link href="/menu/complaints/new">
              <Button size="sm" className="hidden md:flex">
                <Plus className="mr-2 h-4 w-4" />
                New Report
              </Button>
              <Button size="icon" variant="ghost" className="md:hidden">
                <Plus className="h-5 w-5" />
                <span className="sr-only">New Report</span>
              </Button>
            </Link>
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
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
              <span className="sr-only">More filters</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="board" className="mb-8">
          <TabsList>
            <TabsTrigger value="board">Board View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
          <TabsContent value="board" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Submitted Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    Submitted
                    <Badge variant="secondary" className="ml-1">
                      {
                        filteredReports.filter((r) => r.status === "SUBMITTED")
                          .length
                      }
                    </Badge>
                  </h3>
                </div>
                {filteredReports
                  .filter((report) => report.status === "SUBMITTED")
                  .map((report) => (
                    <Card
                      key={report.id}
                      className="border-l-4 border-l-blue-500"
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {report.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 mt-1">
                          {report.description.slice(0, 40)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                      <div className="flex flex-col  items-start justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div>{report.id}</div>
                          <div>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        {getPriorityBadge(report.priority)}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {report.reportType}
                          </span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={reportSVG} alt="" />
                            <AvatarFallback></AvatarFallback>
                          </Avatar>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>

              {/* Under Review Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-500" />
                    Under Review
                    <Badge variant="secondary" className="ml-1">
                      {
                        filteredReports.filter(
                          (r) => r.status === "UNDER_REVIEW"
                        ).length
                      }
                    </Badge>
                  </h3>
                </div>
                {filteredReports
                  .filter((report) => report.status === "UNDER_REVIEW")
                  .map((report) => (
                    <Card
                      key={report.id}
                      className="border-l-4 border-l-purple-500"
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {report.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 mt-1">
                          {report.description.slice(0, 40)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex flex-col  items-start justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div>{report.id}</div>
                          <div>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        {getPriorityBadge(report.priority)}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {report.reportType}
                          </span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={reportSVG} alt="" />
                            <AvatarFallback></AvatarFallback>
                          </Avatar>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>

              {/* Investigating Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                    Investigating
                    <Badge variant="secondary" className="ml-1">
                      {
                        filteredReports.filter(
                          (r) => r.status === "INVESTIGATING"
                        ).length
                      }
                    </Badge>
                  </h3>
                </div>
                {filteredReports
                  .filter((report) => report.status === "INVESTIGATING")
                  .map((report) => (
                    <Card
                      key={report.id}
                      className="border-l-4 border-l-amber-500"
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {report.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 mt-1">
                          {report.description.slice(0, 40)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="flex  items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div>{report.id}</div>
                          <br />
                          <div>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        {getPriorityBadge(report.priority)}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {report.reportType}
                          </span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={reportSVG} alt="" />
                            <AvatarFallback></AvatarFallback>
                          </Avatar>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>

              {/* Resolved Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    Resolved
                    <Badge variant="secondary" className="ml-1">
                      {
                        filteredReports.filter((r) => r.status === "RESOLVED")
                          .length
                      }
                    </Badge>
                  </h3>
                </div>
                {filteredReports
                  .filter((report) => report.status === "RESOLVED")
                  .map((report) => (
                    <Card
                      key={report.id}
                      className="border-l-4 border-l-green-500"
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {report.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 mt-1">
                          {report.description.slice(0, 40)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                      <div className="flex flex-col  items-start justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div>{report.id}</div>
                          <div>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        {getPriorityBadge(report.priority)}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {report.reportType}
                          </span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={reportSVG} alt="" />
                            <AvatarFallback></AvatarFallback>
                          </Avatar>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>

              {/* Closed Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-gray-500" />
                    Closed
                    <Badge variant="secondary" className="ml-1">
                      {
                        filteredReports.filter((r) => r.status === "CLOSED")
                          .length
                      }
                    </Badge>
                  </h3>
                </div>
                {filteredReports
                  .filter((report) => report.status === "CLOSED")
                  .map((report) => (
                    <Card
                      key={report.id}
                      className="border-l-4 border-l-gray-500"
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {report.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 mt-1">
                          {report.description.slice(0, 40)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                      <div className="flex flex-col  items-start justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div>{report.id}</div>
                          <div>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        {getPriorityBadge(report.priority)}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {report.reportType}
                          </span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={reportSVG} alt="" />
                            <AvatarFallback></AvatarFallback>
                          </Avatar>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>

              {/* Rejected Column */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Rejected
                    <Badge variant="secondary" className="ml-1">
                      {
                        filteredReports.filter((r) => r.status === "REJECTED")
                          .length
                      }
                    </Badge>
                  </h3>
                </div>
                {filteredReports
                  .filter((report) => report.status === "REJECTED")
                  .map((report) => (
                    <Card
                      key={report.id}
                      className="border-l-4 border-l-red-500"
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-base">
                            {report.title}
                          </CardTitle>
                        </div>
                        <CardDescription className="line-clamp-2 mt-1">
                          {report.description.slice(0, 40)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                      <div className="flex flex-col  items-start justify-between text-sm text-gray-500 dark:text-gray-400">
                          <div>{report.id}</div>
                          <div>
                            {new Date(report.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        {getPriorityBadge(report.priority)}
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {report.reportType}
                          </span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={reportSVG} alt="" />
                            <AvatarFallback></AvatarFallback>
                          </Avatar>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </div>
          </TabsContent>
          <TabsContent value="list" className="mt-4">
            <div className="rounded-lg border bg-card">
              <div className="grid grid-cols-12 p-4 border-b font-medium text-sm">
                <div className="col-span-4 md:col-span-3">Report</div>
                <div className="col-span-3 md:col-span-2">Status</div>
                <div className="col-span-2 hidden md:block">Priority</div>
                <div className="col-span-2 hidden md:block">Category</div>
                <div className="col-span-3 md:col-span-2">Date</div>
                <div className="col-span-2 md:col-span-1 text-right">
                  Actions
                </div>
              </div>
              {filteredReports.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No reports found matching your criteria
                </div>
              ) : (
                filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="grid grid-cols-12 p-4 border-b items-center text-sm"
                  >
                    <div className="col-span-4 md:col-span-3">
                      <div className="font-medium">{report.title}</div>
                      <div className="text-xs text-muted-foreground">
                        {report.id}
                      </div>
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      {getStatusBadge(report.status)}
                    </div>
                    <div className="col-span-2 hidden md:block">
                      {getPriorityBadge(report.priority)}
                    </div>
                    <div className="col-span-2 hidden md:block">
                      {report.reportType}
                    </div>
                    <div className="col-span-3 md:col-span-2">
                      {new Date(report.createdAt).toLocaleDateString()}
                    </div>
                    <div className="col-span-2 md:col-span-1 text-right"></div>
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
