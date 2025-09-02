"use client";

import { Suspense, useState } from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  MessageSquareIcon,
  ImageIcon,
  AlertTriangleIcon,
  ArrowLeft,
} from "lucide-react";
import { withdrawReport } from "@/server_action/complaints/actions";
import { toast } from "sonner";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import dynamic from "next/dynamic";

// Dynamically import MiniMap to avoid SSR issues
const MiniMap = dynamic(() => import("@/components/custom/MiniMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-32 bg-gray-100 rounded animate-pulse" />
  ),
});

type Report = {
  id: string;
  title: string;
  description: string;
  reportType:
    | "THEFT"
    | "ASSAULT"
    | "VANDALISM"
    | "FRAUD"
    | "MISSING_PERSON"
    | "DOMESTIC_VIOLENCE"
    | "BURGLARY"
    | "ACCIDENT"
    | "DRUG_RELATED"
    | "OTHER";
  status:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "INVESTIGATING"
    | "RESOLVED"
    | "CLOSED"
    | "REJECTED";
  priority: "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
  location: {
    address?: string | null;
    city: string;
    state: string;
    country: string;
    postalCode?: string | null;
    landmark?: string | null;
    coordinates?: {
      type: string;
      coordinates: number[]; // [longitude, latitude]
    } | null;
  };
  incidentDate: Date;
  createdAt: Date;
  updatedAt: Date;
  reporter: {
    id: string;
    name: string | null;
    email: string | null;
    phone?: string | null;
  } | null;
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      name: string | null;
      email: string | null;
    };
  }[];
  mediaAttachments: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadDate: Date;
  }[];
};

interface UserReportDetailViewProps {
  report: Report;
}

export default function UserReportDetailView({
  report: initialReport,
}: UserReportDetailViewProps) {
  const [report, setReport] = useState(initialReport);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUBMITTED: {
        label: "Submitted",
        variant: "secondary" as const,
        color: "blue",
      },
      UNDER_REVIEW: {
        label: "Under Review",
        variant: "default" as const,
        color: "purple",
      },
      INVESTIGATING: {
        label: "Investigating",
        variant: "default" as const,
        color: "amber",
      },
      RESOLVED: {
        label: "Resolved",
        variant: "outline" as const,
        color: "green",
      },
      CLOSED: { label: "Closed", variant: "outline" as const, color: "gray" },
      REJECTED: {
        label: "Rejected/Withdrawn",
        variant: "destructive" as const,
        color: "red",
      },
    };
    return (
      statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        variant: "secondary" as const,
        color: "gray",
      }
    );
  };

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      LOW: { label: "Low", variant: "secondary" as const },
      NORMAL: { label: "Normal", variant: "default" as const },
      HIGH: { label: "High", variant: "destructive" as const },
      CRITICAL: { label: "Critical", variant: "destructive" as const },
    };
    return (
      priorityConfig[priority as keyof typeof priorityConfig] || {
        label: priority,
        variant: "secondary" as const,
      }
    );
  };

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      const result = await withdrawReport(report.id, report.reporter?.id || "");
      if (result.success) {
        setReport((prev) => ({
          ...prev,
          status: "REJECTED" as const,
          updatedAt: new Date(),
        }));
        toast.success("Report withdrawn successfully");
      } else {
        toast.error(result.error || "Failed to withdraw report");
      }
    } catch {
      toast.error("Failed to withdraw report");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const statusBadge = getStatusBadge(report.status);
  const priorityBadge = getPriorityBadge(report.priority);

  const formatLocation = (location: Report["location"]) => {
    const parts = [
      location.address,
      location.city,
      location.state,
      location.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  const canWithdraw = !["RESOLVED", "CLOSED", "REJECTED"].includes(
    report.status
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Suspense
              fallback={
                <Button variant="outline" size="sm" disabled>
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse mr-2"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                </Button>
              }
            >
              <Link href="/menu/complaints">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Reports
                </Button>
              </Link>
            </Suspense>
            <div>
              <h1 className="text-xl font-bold">My Report Details</h1>
              <p className="text-sm text-gray-500">Report ID: {report.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {canWithdraw && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={isWithdrawing}
                  >
                    <AlertTriangleIcon className="h-4 w-4 mr-2" />
                    Withdraw Report
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Withdraw Report</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to withdraw this report? This action
                      cannot be undone. The report status will be changed to
                      &quot;Rejected&quot; and it will no longer be processed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleWithdraw}
                      disabled={isWithdrawing}
                    >
                      {isWithdrawing ? "Withdrawing..." : "Withdraw Report"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container px-4 py-6 md:px-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Report Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Report Information</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={statusBadge.variant}>
                      {statusBadge.label}
                    </Badge>
                    <Badge variant={priorityBadge.variant}>
                      {priorityBadge.label}
                    </Badge>
                  </div>
                </div>
                <CardDescription>
                  Reported on {format(new Date(report.createdAt), "PPP")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Title</Label>
                  <p className="mt-1 font-medium">{report.title}</p>
                </div>
                <hr className="my-2" />
                <div>
                  <Label>Description</Label>
                  <p className="mt-1 text-gray-700">{report.description}</p>
                </div>
                <hr className="my-3" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Crime Type</Label>
                    <p className="mt-1">
                      {report.reportType.replace("_", " ")}
                    </p>
                  </div>

                  <div>
                    <Label>Location</Label>
                    <div className="mt-1">
                      <p className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        {formatLocation(report.location)}
                      </p>
                      {report.location.landmark && (
                        <p className="text-sm text-gray-600 mt-1">
                          Landmark: {report.location.landmark}
                        </p>
                      )}
                      {report.location.coordinates && (
                        <>
                          <p className="text-sm text-gray-600 mt-1">
                            Coordinates:{" "}
                            {report.location.coordinates.coordinates[1].toFixed(
                              6
                            )}
                            ,{" "}
                            {report.location.coordinates.coordinates[0].toFixed(
                              6
                            )}
                          </p>
                          <div className="mt-2">
                            <Label className="text-sm">Location on Map</Label>
                            <div className="mt-1">
                              <MiniMap
                                latitude={
                                  report.location.coordinates.coordinates[1]
                                }
                                longitude={
                                  report.location.coordinates.coordinates[0]
                                }
                                title={report.title}
                                size="medium"
                                showControls={false}
                                interactive={false}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      Incident Date:{" "}
                      {format(new Date(report.incidentDate), "PPP")}
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      Last Updated: {format(new Date(report.updatedAt), "PPP")}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Media Attachments */}
            {report.mediaAttachments.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    Media Attachments ({report.mediaAttachments.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {report.mediaAttachments.map(
                      (attachment: Report["mediaAttachments"][0]) => (
                        <div
                          key={attachment.id}
                          className="border rounded-lg p-3"
                        >
                          <div className="text-sm font-medium truncate">
                            {attachment.fileName}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {attachment.fileType} •{" "}
                            {format(new Date(attachment.uploadDate), "PPP")}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2 w-full"
                            asChild
                          >
                            <a
                              href={attachment.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View File
                            </a>
                          </Button>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reporter Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {report.reporter ? (
                  <>
                    <div>
                      <Label className="text-sm font-medium">Name</Label>
                      <p className="text-sm">
                        {report.reporter.name || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">
                        {report.reporter.email || "Not provided"}
                      </p>
                    </div>
                    {report.reporter.phone && (
                      <div>
                        <Label className="text-sm font-medium">Phone</Label>
                        <p className="text-sm">{report.reporter.phone}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">Anonymous report</p>
                )}
              </CardContent>
            </Card>

            {/* Status Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClockIcon className="h-5 w-5" />
                  Status Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Current Status</Label>
                  <div className="mt-1">
                    <Badge variant={statusBadge.variant}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Priority Level</Label>
                  <div className="mt-1">
                    <Badge variant={priorityBadge.variant}>
                      {priorityBadge.label}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">Submitted</Label>
                  <p className="text-sm text-gray-600">
                    {format(new Date(report.createdAt), "PPP 'at' p")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Last Updated</Label>
                  <p className="text-sm text-gray-600">
                    {format(new Date(report.updatedAt), "PPP 'at' p")}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquareIcon className="h-5 w-5" />
                  Updates & Comments ({report.comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {report.comments.length === 0 ? (
                  <p className="text-sm text-gray-500">No updates yet</p>
                ) : (
                  <div className="space-y-4">
                    {report.comments.map((comment: Report["comments"][0]) => (
                      <div
                        key={comment.id}
                        className="border-l-2 border-gray-200 pl-3"
                      >
                        <div className="text-sm font-medium">
                          {comment.user.name || "System"}
                        </div>
                        <div className="text-xs text-gray-500 mb-1">
                          {format(new Date(comment.createdAt), "PPp")}
                        </div>
                        <div className="text-sm text-gray-700">
                          {comment.content}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
