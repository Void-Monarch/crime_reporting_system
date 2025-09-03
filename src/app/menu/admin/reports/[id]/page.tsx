import { getReportById } from "@/lib/data_queries";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UpUser } from "../../../../account/profile/ProfileForm";
import ReportDetailView from "./ReportDetailView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/account/login");

  const currentUser: UpUser = session.user!;
  if (
    currentUser.role !== "ADMIN" &&
    currentUser.role !== "POLICE_OFFICER" &&
    currentUser.role !== "INVESTIGATOR"
  ) {
    redirect("/menu");
  }

  const { id } = await params;
  const report = await getReportById(id);

  if (!report) {
    notFound();
  }

  return <ReportDetailView report={report} currentUserId={currentUser.id!} />;
}
