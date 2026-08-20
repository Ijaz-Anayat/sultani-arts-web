import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { isAdminSession } from "@/lib/auth-utils";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const session = await auth();
  if (!isAdminSession(session)) {
    redirect("/admin/login");
  }

  return <AdminShell email={session.user.email}>{children}</AdminShell>;
}
