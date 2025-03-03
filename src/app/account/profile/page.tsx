import ProfileForm from "./ProfileForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UpUser } from "./ProfileForm";

export default async function Page() {
  const session = await auth();
  if (!session) redirect("/account/login");

  const user: UpUser = session.user!;
  return <ProfileForm user={user} />;
}
