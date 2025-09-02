"use client";

import type React from "react";
import { useState } from "react";
import { User as PrismaUser, Report } from "@prisma/client";
import { UpUser } from "../../../../account/profile/ProfileForm";
import {
  updateUserByAdmin,
  UpdateUserByAdminType,
} from "@/server_action/admin/actions";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  UserCheck,
  Edit,
  Save,
  X,
  CreditCard,
  FileText,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserDetailView({
  user,
  reports,
}: {
  user: PrismaUser;
  currentUser: UpUser;
  reports: Report[];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<PrismaUser>(user);
  const [isLoading, setIsLoading] = useState(false);

  // Get role badge
  const getRoleBadge = (role: string) => {
    switch (role) {
      case "ADMIN":
        return (
          <Badge
            variant="outline"
            className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1"
          >
            <Shield className="w-3 h-3" /> Admin
          </Badge>
        );
      case "POLICE_OFFICER":
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1"
          >
            <Shield className="w-3 h-3" /> Police Officer
          </Badge>
        );
      case "INVESTIGATOR":
        return (
          <Badge
            variant="outline"
            className="bg-purple-50 text-purple-700 border-purple-200 flex items-center gap-1"
          >
            <UserCheck className="w-3 h-3" /> Investigator
          </Badge>
        );
      case "CITIZEN":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1"
          >
            <User className="w-3 h-3" /> Citizen
          </Badge>
        );
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  // Get verification status badge
  const getVerificationBadge = (userToCheck: PrismaUser) => {
    if (userToCheck.aadhaarNumber && userToCheck.profileCompleted) {
      return (
        <Badge className="bg-green-500 text-white">
          <UserCheck className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    } else if (userToCheck.aadhaarNumber) {
      return (
        <Badge className="bg-yellow-500 text-white">
          <UserCheck className="w-3 h-3 mr-1" />
          Partial
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700">
          <User className="w-3 h-3 mr-1" />
          Unverified
        </Badge>
      );
    }
  };

  // Get status badge for reports
  const getReportStatusBadge = (status: string) => {
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

  const handleSave = async () => {
    setIsLoading(true);

    try {
      // Prepare data for server action
      const updateData: UpdateUserByAdminType = {
        id: editedUser.id,
        name: editedUser.name || "",
        phone: editedUser.phone || undefined,
        state: editedUser.state || undefined,
        city: editedUser.city || undefined,
        postalCode: editedUser.postalCode || undefined,
        role: editedUser.role as
          | "ADMIN"
          | "POLICE_OFFICER"
          | "INVESTIGATOR"
          | "CITIZEN",
      };

      const result = await updateUserByAdmin(updateData);

      if (result.success && result.user) {
        toast.success("User updated successfully!");
        setIsEditing(false);
        // Update the local user state with the returned data
        setEditedUser(result.user as PrismaUser);
      } else {
        toast.error("Failed to update user. Please try again.");
        console.error("Update error:", result.error);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating the user.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/menu/admin/users">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Back to users</span>
              </Button>
            </Link>
            <h1 className="text-xl font-bold">User Details</h1>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1" />
                      Save Changes
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-1" />
                Edit User
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container px-4 py-6 md:px-6 md:py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Profile Header Card */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user.image || ""}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback className="text-xl">
                    {user.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <h2 className="text-2xl font-bold">
                      {user.name || "Unknown User"}
                    </h2>
                    <div className="flex gap-2">
                      {getRoleBadge(user.role)}
                      {getVerificationBadge(user)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(user.createdAt).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                  {user.updatedAt && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <span>
                        Last updated{" "}
                        {new Date(user.updatedAt).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Personal Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={editedUser.name || ""}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, name: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{user.name || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{user.email || "Not provided"}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedUser.phone || ""}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, phone: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{user.phone || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span>{user.aadhaarNumber || "Not provided"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Address Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  {isEditing ? (
                    <Input
                      id="city"
                      value={editedUser.city || ""}
                      onChange={(e) =>
                        setEditedUser({ ...editedUser, city: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{user.city || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  {isEditing ? (
                    <Select
                      value={editedUser.state || ""}
                      onValueChange={(value) =>
                        setEditedUser({ ...editedUser, state: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="andhra_pradesh">
                          Andhra Pradesh
                        </SelectItem>
                        <SelectItem value="arunachal_pradesh">
                          Arunachal Pradesh
                        </SelectItem>
                        <SelectItem value="assam">Assam</SelectItem>
                        <SelectItem value="bihar">Bihar</SelectItem>
                        <SelectItem value="chhattisgarh">
                          Chhattisgarh
                        </SelectItem>
                        <SelectItem value="goa">Goa</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                        <SelectItem value="haryana">Haryana</SelectItem>
                        <SelectItem value="himachal_pradesh">
                          Himachal Pradesh
                        </SelectItem>
                        <SelectItem value="jharkhand">Jharkhand</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="kerala">Kerala</SelectItem>
                        <SelectItem value="madhya_pradesh">
                          Madhya Pradesh
                        </SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="manipur">Manipur</SelectItem>
                        <SelectItem value="meghalaya">Meghalaya</SelectItem>
                        <SelectItem value="mizoram">Mizoram</SelectItem>
                        <SelectItem value="nagaland">Nagaland</SelectItem>
                        <SelectItem value="odisha">Odisha</SelectItem>
                        <SelectItem value="punjab">Punjab</SelectItem>
                        <SelectItem value="rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="sikkim">Sikkim</SelectItem>
                        <SelectItem value="tamil_nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="telangana">Telangana</SelectItem>
                        <SelectItem value="tripura">Tripura</SelectItem>
                        <SelectItem value="uttar_pradesh">
                          Uttar Pradesh
                        </SelectItem>
                        <SelectItem value="uttarakhand">Uttarakhand</SelectItem>
                        <SelectItem value="west_bengal">West Bengal</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="jammu_kashmir">
                          Jammu and Kashmir
                        </SelectItem>
                        <SelectItem value="ladakh">Ladakh</SelectItem>
                        <SelectItem value="puducherry">Puducherry</SelectItem>
                        <SelectItem value="andaman_nicobar">
                          Andaman and Nicobar Islands
                        </SelectItem>
                        <SelectItem value="chandigarh">Chandigarh</SelectItem>
                        <SelectItem value="dadra_nagar_haveli">
                          Dadra and Nagar Haveli and Daman and Diu
                        </SelectItem>
                        <SelectItem value="lakshadweep">Lakshadweep</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{user.state || "Not provided"}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Postal Code</Label>
                  {isEditing ? (
                    <Input
                      id="postalCode"
                      value={editedUser.postalCode || ""}
                      onChange={(e) =>
                        setEditedUser({
                          ...editedUser,
                          postalCode: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 bg-muted rounded">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{user.postalCode || "Not provided"}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Management Card */}
          <Card>
            <CardHeader>
              <CardTitle>Role Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">User Role</Label>
                {isEditing ? (
                  <Select
                    value={editedUser.role}
                    onValueChange={(value) =>
                      setEditedUser({ ...editedUser, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CITIZEN">Citizen</SelectItem>
                      <SelectItem value="POLICE_OFFICER">
                        Police Officer
                      </SelectItem>
                      <SelectItem value="INVESTIGATOR">Investigator</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    {getRoleBadge(user.role)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recently Submitted Reports Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recently Submitted Reports
                </CardTitle>
                <Badge variant="secondary" className="flex items-center gap-1">
                  {reports.length} Total Reports
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {reports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No reports submitted yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.slice(0, 5).map((report) => (
                    <div
                      key={report.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm truncate">
                              {report.title}
                            </h4>
                            {getReportStatusBadge(report.status)}
                          </div>
                          <p className="text-sm text-muted-foreground truncate">
                            {report.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(
                                  report.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              <span>
                                {report.location.city}, {report.location.state}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {report.reportType.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/menu/complaints`}>
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                  {reports.length > 5 && (
                    <div className="text-center pt-4">
                      <Button variant="outline" asChild>
                        <Link href={`/menu/complaints`}>
                          View All {reports.length} Reports
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
