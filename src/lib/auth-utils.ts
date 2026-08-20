import type { Session } from "next-auth";

export function isAdminSession(
  session: Session | null | undefined,
): session is Session & { user: { id: string; role: "admin"; email: string } } {
  const email = session?.user?.email?.trim();
  return (
    session?.user?.role === "admin" &&
    Boolean(session.user.id) &&
    Boolean(email && email.includes("@"))
  );
}
