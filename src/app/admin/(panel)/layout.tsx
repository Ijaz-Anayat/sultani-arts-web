import type { ReactNode } from "react";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: ReactNode }) {
  const session = await auth();

  return <AdminShell email={session?.user?.email}>{children}</AdminShell>;
}
