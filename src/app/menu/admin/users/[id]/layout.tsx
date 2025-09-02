import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Details - Crime Reporting System",
  description: "View detailed information about a specific user",
};

export default function UserDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
