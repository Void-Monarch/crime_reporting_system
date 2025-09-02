import { getReportById } from "@/lib/data_queries";
import { notFound } from "next/navigation";
import ReportDetailView from "./ReportDetailView";

interface Props {
  params: { id: string };
}

export default async function ReportDetailPage({ params }: Props) {
  const report = await getReportById(params.id);

  if (!report) {
    notFound();
  }

  return <ReportDetailView report={report} />;
}
