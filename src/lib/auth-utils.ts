import type { Session } from "next-auth";

export function isAdminSession(
  session: Session | null | undefined,
): session is Session & { user: { id: string; role: "admin"; email?: string | null } } {
  return session?.user?.role === "admin" && Boolean(session.user.id);
}
