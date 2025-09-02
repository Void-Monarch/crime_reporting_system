import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UpUser } from "../../../../account/profile/ProfileForm";
import { getUserById, getReportByUserId } from "@/lib/data_queries";
import UserDetailView from "./UserDetailView";
import { Suspense } from "react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function UserDetailPage({ params }: Props) {
  const session = await auth();
  if (!session) redirect("/account/login");

  const currentUser: UpUser = session.user!;
  if (currentUser.role !== "ADMIN") redirect("/menu");

  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    redirect("/menu/admin");
  }

  // Fetch user's reports
  const userReports = await getReportByUserId(id);

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
