import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UpUser } from "../../../account/profile/ProfileForm";
import { getAllUsers } from "@/lib/data_queries";
import UsersList from "./UsersList";
import { Suspense } from "react";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/account/login");
  const user: UpUser = session.user!;
  if (user.role !== "ADMIN") redirect("/menu");
  const allUsers = await getAllUsers();
  return (
    <Suspense>
      <UsersList users={allUsers} />
    </Suspense>
  );
}
