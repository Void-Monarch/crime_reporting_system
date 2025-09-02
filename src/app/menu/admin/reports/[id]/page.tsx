import { getReportById } from "@/lib/data_queries";
import { notFound } from "next/navigation";
import ReportDetailView from "./ReportDetailView";

export default async function ReportDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const report = await getReportById(params.id);

  if (!report) {
    notFound();
  }

  return <ReportDetailView report={report} />;
}
