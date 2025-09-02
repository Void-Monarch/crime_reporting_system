import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UpUser } from "../../../account/profile/ProfileForm";
import { getAllReports } from "@/lib/data_queries";
import ReportsList from "./ReportsList";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/account/login");
  const user: UpUser = session.user!;
  if (user.role !== "ADMIN") redirect("/menu");
  const allReports = await getAllReports();
  return <ReportsList reports={allReports} />;
}
