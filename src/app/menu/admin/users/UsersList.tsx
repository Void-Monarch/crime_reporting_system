"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  User,
  Phone,
  MapPin,
  Calendar,
  Shield,
  UserCheck,
  Users,
  Eye,
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
import { User as PrismaUser } from "@prisma/client";
import Link from "next/link";

export default function UsersList({ users }: { users: PrismaUser[] }) {
  const [usersList, setUsersList] = useState<PrismaUser[]>(users);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("all");

  useEffect(() => {
    setUsersList(users);
  }, [users]);

  // Filter users based on search query and role filter
  const filteredUsers = usersList.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      currentFilter === "all" || user.role === currentFilter;

    return matchesSearch && matchesFilter;
  });

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
  const getVerificationBadge = (user: PrismaUser) => {
    if (user.aadhaarNumber && user.profileCompleted) {
      return (
        <Badge className="bg-green-500 text-white">
          <UserCheck className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    } else if (user.aadhaarNumber) {
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="container flex items-center justify-between h-16 px-4 md:px-6">
          <h1 className="text-xl font-bold">Users Management</h1>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="hidden md:flex">
              <Users className="w-4 h-4 mr-1" />
              {filteredUsers.length} Users
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
                placeholder="Search users..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={currentFilter} onValueChange={setCurrentFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="POLICE_OFFICER">Police Officer</SelectItem>
                <SelectItem value="INVESTIGATOR">Investigator</SelectItem>
                <SelectItem value="CITIZEN">Citizen</SelectItem>
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
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="role">Role</SelectItem>
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
              {filteredUsers.length === 0 ? (
                <div className="col-span-full p-8 text-center text-muted-foreground">
                  No users found matching your criteria
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <Card
                    key={user.id}
                    className="hover:shadow-md transition-shadow"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage
                            src={user.image || ""}
                            alt={user.name || "User"}
                          />
                          <AvatarFallback>
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-sm font-medium truncate">
                            {user.name || "Unknown User"}
                          </CardTitle>
                          <CardDescription className="text-xs truncate">
                            {user.email}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        {getRoleBadge(user.role)}
                        {getVerificationBadge(user)}
                      </div>

                      {user.phone && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="w-3 h-3" />
                          <span className="truncate">{user.phone}</span>
                        </div>
                      )}

                      {user.city && user.state && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">
                            {user.city}, {user.state}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(user.createdAt).toLocaleDateString("en-GB")}
                        </span>
                      </div>

                      <div className="pt-2">
                        <Link href={`/menu/admin/users/${user.id}`}>
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
                <div className="col-span-3">User</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2 hidden md:block">Verification</div>
                <div className="col-span-2 hidden md:block">Location</div>
                <div className="col-span-2">Joined</div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
              {filteredUsers.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  No users found matching your criteria
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="grid grid-cols-12 p-4 border-b items-center text-sm hover:bg-muted/50"
                  >
                    <div className="col-span-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.image || ""}
                            alt={user.name || "User"}
                          />
                          <AvatarFallback className="text-xs">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate">
                            {user.name || "Unknown User"}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-2">{getRoleBadge(user.role)}</div>
                    <div className="col-span-2 hidden md:block">
                      {getVerificationBadge(user)}
                    </div>
                    <div className="col-span-2 hidden md:block">
                      <div className="text-xs text-muted-foreground">
                        {user.city && user.state
                          ? `${user.city}, ${user.state}`
                          : "Not provided"}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString("en-GB")}
                      </div>
                    </div>
                    <div className="col-span-1 text-right">
                      <Link href={`/menu/admin/users/${user.id}`}>
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
