import { Metadata } from "next";
import React from "react";
import { UpUser } from "./account/profile/ProfileForm";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
import { CircleUser, Fingerprint } from "lucide-react";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import Link from "next/link";

import { auth, signOut } from "../lib/auth";

export const metadata: Metadata = {
  title: "CRS",
  description: "CRS : Crime Reporting System",
  keywords: [
    "Crime",
    "Reporting",
    "CRS",
    "Management",
    "System",
    "Crime Reporting System",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <body className="bg-neutral-100 text-black">
        <header className="sticky top-0 z-50  bg-neutral-100 flex h-16 items-center gap-4 border-b px-4 md:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Fingerprint className="h-6 w-6" />
            <span className="sr-only">CRS</span>
          </Link>

          <NavMenu user={session?.user} />

          {/* <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Acme Inc</span>
                </Link>
                <Link href="#" className="hover:text-foreground">
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Orders
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Products
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Customers
                </Link>
                <Link
                  href="#"
                  className="text-muted-foreground hover:text-foreground"
                >
                  Analytics
                </Link>
              </nav>
            </SheetContent> 
           </Sheet> */}

          {/* Search bar */}

          <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
            <form className="ml-auto flex-1 sm:flex-initial">
              {/* <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
                />
              </div> */}
            </form>

            {/* Profile icon and account menu */}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full ring-black ring-1"
                >
                  {session?.user ? (
                    <Avatar className="ring-1 ring-black">
                      <AvatarImage src={session?.user?.image ?? ""} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  ) : (
                    <>
                      <CircleUser className="h-5 w-5" />
                      <span className="sr-only">Toggle user menu</span>
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-amber-300">
                {session?.user ? (
                  <>
                    <DropdownMenuLabel>{session?.user.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                  </>
                ) : null}
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/account/profile" passHref>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                {session?.user ? (
                  <form
                    action={async () => {
                      "use server";
                      await signOut();
                    }}
                  >
                    <button type="submit" className="w-full">
                      <DropdownMenuItem>SignOut</DropdownMenuItem>
                    </button>
                  </form>
                ) : (
                  <Link href="/account/login" passHref>
                    <DropdownMenuItem>Login</DropdownMenuItem>
                  </Link>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="">{children}</main>
        <Toaster richColors />
      </body>
    </html>
  );
}

function NavMenu({ user }: { user: UpUser | undefined }) {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {/* Item one */}

        <NavigationMenuItem>
          <NavigationMenuTrigger className="hover:underline hover:underline-offset-4">
            Getting Started
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-amber-300">
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
                    <Fingerprint className="h-6 w-6" />
                    <div className="mb-2 mt-4 text-lg font-medium">CRS</div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      CRS - Crime Reporting System. A secure platform for
                      citizens to report crimes, track case progress, and
                      collaborate with law enforcement for safer communities.
                    </p>
                  </div>
                </NavigationMenuLink>
              </li>
              <ListItem href="/" title="Introduction">
                Get to know more about the platform and its features.
              </ListItem>
              <ListItem href="/dashboard" title="Dashboard">
                Go to Dashboard.
              </ListItem>
              <ListItem href="/account/profile" title="Manage your Account">
                Manage your account settings and preferences.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Item two */}

        <NavigationMenuItem>
          <NavigationMenuTrigger className="hover:underline hover:underline-offset-4">
            Menu
          </NavigationMenuTrigger>
          <NavigationMenuContent className="bg-amber-300">
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Item three */}

        {user?.role === "ADMIN" && (
          <NavigationMenuItem>
            <NavigationMenuTrigger className="hover:underline hover:underline-offset-4">
              Admin Menu
            </NavigationMenuTrigger>
            <NavigationMenuContent className="bg-amber-300">
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {components2.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  >
                    {component.description}
                  </ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        )}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const components: { title: string; href: string; description: string }[] = [
  {
    title: "File Complaints",
    href: "/menu/complaints/new",
    description: "Add new complaints and manage reports",
  },
  {
    title: "View All Complaints",
    href: "/menu/complaints",
    description: "Review and manage all submitted complaints",
  },
];

const components2: { title: string; href: string; description: string }[] = [
  {
    title: "All Users",
    href: "/menu/admin/users",
    description: "Manage all users in the system",
  },
  {
    title: "View All Complaints",
    href: "/menu/admin/reports",
    description: "Review and manage all submitted complaints",
  },
];
