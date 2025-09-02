import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getReportByIdForUser } from "@/server_action/complaints/actions";
import UserReportDetailView from "./UserReportDetailView";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

export default async function ReportPage({ params }: ReportPageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user?.id) {
    redirect("/account/login");
  }

  const report = await getReportByIdForUser(id, session.user.id);

  if (!report) {
    redirect("/menu/complaints");
  }

  return <UserReportDetailView report={report} />;
}
