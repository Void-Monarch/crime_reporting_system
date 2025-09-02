"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function BreadcrumbClient() {
  const pathname = usePathname();

  // Split the pathname and filter out empty strings
  const pathSegments = pathname.split("/").filter(Boolean);

  // Helper function to format segment names
  const formatSegmentName = (segment: string) => {
    return segment
      .replace(/-/g, " ")
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Build breadcrumb path
  const buildPath = (index: number) => {
    return "/" + pathSegments.slice(0, index + 1).join("/");
  };

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const isLast = index === pathSegments.length - 1;
          const segmentPath = buildPath(index);
          const segmentName = formatSegmentName(segment);

          return (
            <div key={segmentPath} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{segmentName}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={segmentPath}>&nbsp;{segmentName}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
