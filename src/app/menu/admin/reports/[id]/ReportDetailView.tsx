"use client";

import { Suspense, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  ClockIcon,
  MessageSquareIcon,
  ImageIcon,
  SendIcon,
  LoaderIcon,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  updateReportByAdmin,
  addCommentToReport,
} from "@/server_action/admin/actions";
import MiniMap from "@/components/custom/MiniMap";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";

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
    isInternal: boolean;
    user: {
      name: string | null;
      email: string | null;
      role: string;
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

interface ReportDetailViewProps {
  report: Report;
  currentUserId: string;
}

export default function ReportDetailView({
  report: initialReport,
  currentUserId,
}: ReportDetailViewProps) {
  const [report, setReport] = useState(initialReport);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commentContent, setCommentContent] = useState("");
  const [isInternalComment, setIsInternalComment] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [formData, setFormData] = useState({
    title: report.title,
    description: report.description,
    reportType: report.reportType,
    status: report.status,
    priority: report.priority,
    location: {
      address: report.location.address || "",
      city: report.location.city,
      state: report.location.state,
      country: report.location.country,
      postalCode: report.location.postalCode || "",
      landmark: report.location.landmark || "",
      coordinates: report.location.coordinates || null,
    },
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      SUBMITTED: { label: "Submitted", variant: "secondary" as const },
      UNDER_REVIEW: { label: "Under Review", variant: "default" as const },
      INVESTIGATING: { label: "Investigating", variant: "default" as const },
      RESOLVED: { label: "Resolved", variant: "outline" as const },
      CLOSED: { label: "Closed", variant: "outline" as const },
      REJECTED: { label: "Rejected", variant: "destructive" as const },
    };
    return (
      statusConfig[status as keyof typeof statusConfig] || {
        label: status,
        variant: "secondary" as const,
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

  const handleInputChange = (field: string, value: string | object) => {
    if (field.startsWith("location.")) {
      const locationField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updateReportByAdmin(report.id, formData);
      if (result.success) {
        setReport((prev) => ({
          ...prev,
          ...formData,
          updatedAt: new Date(),
        }));
        setIsEditing(false);
        toast.success("Report updated successfully");
      } else {
        const errorMessage = Array.isArray(result.error)
          ? result.error.map((e) => e.message).join(", ")
          : result.error || "Failed to update report";
        toast.error(errorMessage);
      }
    } catch {
      toast.error("Failed to update report");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      title: report.title,
      description: report.description,
      reportType: report.reportType,
      status: report.status,
      priority: report.priority,
      location: {
        address: report.location.address || "",
        city: report.location.city,
        state: report.location.state,
        country: report.location.country,
        postalCode: report.location.postalCode || "",
        landmark: report.location.landmark || "",
        coordinates: report.location.coordinates || null,
      },
    });
    setIsEditing(false);
  };

  const handleAddComment = async () => {
    if (!commentContent.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setIsAddingComment(true);
    try {
      const result = await addCommentToReport(currentUserId, {
        reportId: report.id,
        content: commentContent,
        isInternal: isInternalComment,
      });

      if (result.success && result.comment) {
        // Add the new comment to the report state
        setReport((prev) => ({
          ...prev,
          comments: [result.comment, ...prev.comments],
        }));
        setCommentContent("");
        setIsInternalComment(false);
        toast.success("Comment added successfully");
      } else {
        const errorMessage = Array.isArray(result.error)
          ? result.error.map((e) => e.message).join(", ")
          : result.error || "Failed to add comment";
        toast.error(errorMessage);
      }
    } catch {
      toast.error("Failed to add comment");
    } finally {
      setIsAddingComment(false);
    }
  };

  const statusBadge = getStatusBadge(
    isEditing ? formData.status : report.status
  );
  const priorityBadge = getPriorityBadge(
    isEditing ? formData.priority : report.priority
  );

  const formatLocation = (location: Report["location"]) => {
    const parts = [
      location.address,
      location.city,
      location.state,
      location.country,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Report Details</h1>
          <p className="text-gray-500">Report ID: {report.id}</p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Report</Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          )}
        </div>
      </div>

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
                <Label htmlFor="title">Title</Label>
                {isEditing ? (
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                  />
                ) : (
                  <p className="mt-1 font-medium">{report.title}</p>
                )}
              </div>
              <hr className="my-2" />
              <div>
                <Label htmlFor="description">Description</Label>
                {isEditing ? (
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                  />
                ) : (
                  <p className="mt-1 text-gray-700">{report.description}</p>
                )}
              </div>
              <hr className="my-3" />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="reportType">Crime Type</Label>
                  {isEditing ? (
                    <Select
                      value={formData.reportType}
                      onValueChange={(value) =>
                        handleInputChange("reportType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="THEFT">Theft</SelectItem>
                        <SelectItem value="ASSAULT">Assault</SelectItem>
                        <SelectItem value="VANDALISM">Vandalism</SelectItem>
                        <SelectItem value="FRAUD">Fraud</SelectItem>
                        <SelectItem value="BURGLARY">Burglary</SelectItem>
                        <SelectItem value="MISSING_PERSON">
                          Missing Person
                        </SelectItem>
                        <SelectItem value="DOMESTIC_VIOLENCE">
                          Domestic Violence
                        </SelectItem>
                        <SelectItem value="ACCIDENT">Accident</SelectItem>
                        <SelectItem value="DRUG_RELATED">
                          Drug Related
                        </SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="mt-1">{report.reportType}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="location">Location</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        placeholder="Address"
                        value={formData.location.address}
                        onChange={(e) =>
                          handleInputChange("location.address", e.target.value)
                        }
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="City"
                          value={formData.location.city}
                          onChange={(e) =>
                            handleInputChange("location.city", e.target.value)
                          }
                        />
                        <Input
                          placeholder="State"
                          value={formData.location.state}
                          onChange={(e) =>
                            handleInputChange("location.state", e.target.value)
                          }
                        />
                      </div>
                      <Input
                        placeholder="Landmark (optional)"
                        value={formData.location.landmark}
                        onChange={(e) =>
                          handleInputChange("location.landmark", e.target.value)
                        }
                      />
                      <div className="border-t pt-2">
                        <div className="flex items-center justify-between mb-1">
                          <Label className="text-sm font-medium">
                            Coordinates (optional)
                          </Label>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (navigator.geolocation) {
                                navigator.geolocation.getCurrentPosition(
                                  (position) => {
                                    handleInputChange("location.coordinates", {
                                      type: "Point",
                                      coordinates: [
                                        position.coords.longitude,
                                        position.coords.latitude,
                                      ],
                                    });
                                    toast.success(
                                      "Location coordinates captured"
                                    );
                                  },
                                  (error) => {
                                    toast.error(
                                      "Failed to get location: " + error.message
                                    );
                                  }
                                );
                              } else {
                                toast.error(
                                  "Geolocation is not supported by this browser"
                                );
                              }
                            }}
                          >
                            <MapPinIcon className="h-3 w-3 mr-1" />
                            Get Current Location
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <Input
                            placeholder="Longitude"
                            type="number"
                            step="any"
                            value={
                              formData.location.coordinates?.coordinates[0] ||
                              ""
                            }
                            onChange={(e) => {
                              const longitude = parseFloat(e.target.value) || 0;
                              const latitude =
                                formData.location.coordinates?.coordinates[1] ||
                                0;
                              handleInputChange("location.coordinates", {
                                type: "Point",
                                coordinates: [longitude, latitude],
                              });
                            }}
                          />
                          <Input
                            placeholder="Latitude"
                            type="number"
                            step="any"
                            value={
                              formData.location.coordinates?.coordinates[1] ||
                              ""
                            }
                            onChange={(e) => {
                              const latitude = parseFloat(e.target.value) || 0;
                              const longitude =
                                formData.location.coordinates?.coordinates[0] ||
                                0;
                              handleInputChange("location.coordinates", {
                                type: "Point",
                                coordinates: [longitude, latitude],
                              });
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Enter longitude and latitude coordinates for precise
                          location
                        </p>
                        {formData.location.coordinates?.coordinates[0] &&
                          formData.location.coordinates?.coordinates[1] && (
                            <div className="mt-2">
                              <p className="text-xs text-gray-600 mb-1">
                                Preview Location:
                              </p>
                              <MiniMap
                                latitude={
                                  formData.location.coordinates.coordinates[1]
                                }
                                longitude={
                                  formData.location.coordinates.coordinates[0]
                                }
                                title="Report Location"
                                size="medium"
                                zoom={16}
                              />
                            </div>
                          )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-1">
                      <p className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        {formatLocation(report.location)}
                      </p>
                      {report.location.coordinates && (
                        <>
                          <p className="text-sm text-gray-500 mt-1">
                            Coordinates:{" "}
                            {report.location.coordinates.coordinates[1]},{" "}
                            {report.location.coordinates.coordinates[0]}
                          </p>
                          <div className="mt-2">
                            <p className="text-xs text-gray-600 mb-1">
                              Location on Map:
                            </p>
                            <div className="border rounded-md overflow-hidden">
                              <MiniMap
                                latitude={
                                  report.location.coordinates.coordinates[1]
                                }
                                longitude={
                                  report.location.coordinates.coordinates[0]
                                }
                                title={report.title}
                                size="medium"
                                zoom={16}
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SUBMITTED">Submitted</SelectItem>
                        <SelectItem value="UNDER_REVIEW">
                          Under Review
                        </SelectItem>
                        <SelectItem value="INVESTIGATING">
                          Investigating
                        </SelectItem>
                        <SelectItem value="RESOLVED">Resolved</SelectItem>
                        <SelectItem value="CLOSED">Closed</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        handleInputChange("priority", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="NORMAL">Normal</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

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
                Reporter
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {report.reporter ? (
                <>
                  <div>
                    <Label className="text-sm font-medium">Name</Label>
                    <div className="mt-1">
                      <Suspense
                        fallback={
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-sm"
                            disabled
                          >
                            <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                          </Button>
                        }
                      >
                        <Link href={`/menu/admin/users/${report.reporter.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-sm bg-green-300"
                          >
                            {report.reporter.name || "Unknown"}
                          </Button>
                        </Link>
                      </Suspense>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Email</Label>
                    <p className="text-sm">
                      {report.reporter.email || "Unknown"}
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

          {/* Comments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareIcon className="h-5 w-5" />
                Comments ({report.comments.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Comment Form */}
              <div className="border-b pb-4">
                <div className="space-y-3">
                  <Label htmlFor="comment">Add Comment</Label>
                  <Textarea
                    id="comment"
                    placeholder="Write your comment here..."
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    rows={3}
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="internal"
                        checked={isInternalComment}
                        onCheckedChange={(checked) =>
                          setIsInternalComment(!!checked)
                        }
                      />
                      <Label htmlFor="internal" className="text-sm">
                        Internal comment (only visible to staff)
                      </Label>
                    </div>
                    <Button
                      onClick={handleAddComment}
                      disabled={isAddingComment || !commentContent.trim()}
                      size="sm"
                    >
                      {isAddingComment ? (
                        <>
                          <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <SendIcon className="w-4 h-4 mr-2" />
                          Add Comment
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              {report.comments.length === 0 ? (
                <p className="text-sm text-gray-500">No comments yet</p>
              ) : (
                <div className="space-y-4">
                  {report.comments.map((comment: Report["comments"][0]) => (
                    <div
                      key={comment.id}
                      className={`border-l-2 pl-3 ${
                        comment.isInternal
                          ? "border-orange-300 bg-orange-50 p-3 rounded-r"
                          : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium flex items-center gap-2">
                          {comment.user.name || "Unknown User"}
                          <Badge variant="outline" className="text-xs">
                            {comment.user.role.replace("_", " ")}
                          </Badge>
                          {comment.isInternal && (
                            <Badge variant="secondary" className="text-xs">
                              Internal
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(new Date(comment.createdAt), "PPp")}
                        </div>
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
    </div>
  );
}
