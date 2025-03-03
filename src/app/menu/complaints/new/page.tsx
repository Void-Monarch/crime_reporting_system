import CrimeReportForm from "./CrimeReportForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UpUser } from "../../../account/profile/ProfileForm";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/account/login");

  const user: UpUser = session.user!;

  return <CrimeReportForm user={user} />;
}
