import { getReportById } from "@/lib/data_queries";
import { notFound } from "next/navigation";
import ReportDetailView from "./ReportDetailView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReportDetailPage({ params }: Props) {
  const { id } = await params;
  const report = await getReportById(id);

  if (!report) {
    notFound();
  }

  return <ReportDetailView report={report} />;
}
