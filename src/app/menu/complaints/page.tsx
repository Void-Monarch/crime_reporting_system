import ReportsDashboard from "./ReportsDashboard";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UpUser } from "../../account/profile/ProfileForm";
import { getReportByUserId } from "@/lib/data_queries";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/account/login");
  const user: UpUser = session.user!;
  const fetchedReports = await getReportByUserId(user.id!);
  return <ReportsDashboard fetchedReports={fetchedReports} />;
}
