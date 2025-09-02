import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UpUser } from "../../../../account/profile/ProfileForm";

export default async function ReportDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/account/login");
  const user: UpUser = session.user!;
  if (user.role !== "ADMIN") redirect("/dashboard");

  return <>{children}</>;
}
