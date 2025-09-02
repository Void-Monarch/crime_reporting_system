import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UpUser } from "../../../../account/profile/ProfileForm";
import { getUserById, getReportByUserId } from "@/lib/data_queries";
import UserDetailView from "./UserDetailView";
import { Suspense } from "react";

export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session) redirect("/account/login");

  const currentUser: UpUser = session.user!;
  if (currentUser.role !== "ADMIN") redirect("/menu");

  const user = await getUserById(params.id);

  if (!user) {
    redirect("/menu/admin");
  }

  // Fetch user's reports
  const userReports = await getReportByUserId(params.id);

  return (
    <Suspense>
      <UserDetailView
        user={user}
        currentUser={currentUser}
        reports={userReports}
      />
    </Suspense>
  );
}
