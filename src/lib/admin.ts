import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isAdminSession } from "@/lib/auth-utils";

export async function requireAdmin() {
  const session = await auth();
  if (!isAdminSession(session)) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { session, error: null };
}
