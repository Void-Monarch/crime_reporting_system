import Link from "next/link";
import { ArrowUpRight, FilePlus2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { auth } from "@/lib/auth";
// import { redirect } from "next/navigation";
import StatusIndicators from "@/components/custom/elements/StatusIndicators";
import TableAlert from "@/components/custom/elements/TableAlert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function Dashboard() {
  // *****************************************************
  // const session = await auth();
  // if (!session) redirect("/account/login");
  // *****************************************************

  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>DashBoard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
            <CardHeader className="flex flex-row items-center">
              <div className="grid gap-2">
                <CardTitle>Alerts</CardTitle>
                <CardDescription>
                  Recent alerts for you and in your surrounding.
                </CardDescription>
              </div>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="">Type</TableHead>
                    <TableHead className="">Severity</TableHead>
                    <TableHead className="text-right hidden lg:table-cell">
                      Option
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableAlert
                    title="Theft"
                    description="Cash was stolen from the register."
                    type="Local"
                    severity="low"
                    option="Read More"
                  />
                  <TableAlert
                    title="Theft"
                    description="Cash was stolen from the register."
                    type="Local"
                    severity="normal"
                    option="Read More"
                  />
                  <TableAlert
                    title="Theft"
                    description="Cash was stolen from the register."
                    type="Local"
                    severity="high"
                    option="Read More"
                  />
                  <TableAlert
                    title="Theft"
                    description="Cash was stolen from the register."
                    type="National"
                    severity="critical"
                    option="Read More"
                  />
                </TableBody>
              </Table>
            </CardContent>

            {/* Next card */}
          </Card>
          <Card x-chunk="dashboard-01-chunk-5" className="flex flex-col">
            <CardHeader className="flex flex-row items-center">
              <CardTitle>Your Recent Reports</CardTitle>
              <Button asChild size="sm" className="ml-auto gap-1">
                <Link href="#">
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-8 h-full content-start">
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  <StatusIndicators
                    text="In Progress"
                    variant="default"
                    type="open"
                  />
                </div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8 h-full content-start">
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  <StatusIndicators
                    text="Rejected"
                    variant="default"
                    type="rejected"
                  />
                </div>
              </div>
            </CardContent>
            <CardContent className="grid gap-8 h-full content-start">
              <div className="flex items-center gap-4">
                <Avatar className="hidden h-9 w-9 sm:flex">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>OM</AvatarFallback>
                </Avatar>
                <div className="grid gap-1">
                  <p className="text-sm font-medium leading-none">
                    Olivia Martin
                  </p>
                  <p className="text-sm text-muted-foreground">
                    olivia.martin@email.com
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  <StatusIndicators
                    text="Closed"
                    variant="default"
                    type="closed"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-end place-self-end">
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href="/menu/complaints/new" passHref>
                      <Button variant="outline" size="icon">
                        <FilePlus2 className="h-4 w-4" />
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>create new complaint</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="flex flex-col gap-y-1 absolute bottom-0 justify-center items-center w-full h-16 content-end bg-gray-100">
        <Separator className="w-[90%]" />
        <p className="text-sm text-gray-500">© 2025 All rights reserved.</p>
      </footer>
    </div>
  );
}
