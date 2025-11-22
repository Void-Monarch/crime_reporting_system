import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UpUser } from "../../../account/profile/ProfileForm";
import { getAllReports } from "@/lib/data_queries";
import AnalyticsDashboard from "./AnalyticsDashboard";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session) redirect("/account/login");
  const user: UpUser = session.user!;
  if (user.role !== "ADMIN") redirect("/menu");

  const reports = await getAllReports();

  return <AnalyticsDashboard reports={reports} />;
}
