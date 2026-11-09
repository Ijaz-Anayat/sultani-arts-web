"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

function logSignInFailure(error: unknown) {
  const authError = error instanceof AuthError ? error : null;
  const causes: { name: string; code?: string | number }[] = [];
  let current: unknown = authError?.cause ?? error;

  for (let depth = 0; depth < 5 && current; depth += 1) {
    const record = typeof current === "object" ? current as Record<string, unknown> : null;
    const name =
      current instanceof Error
        ? current.name
        : typeof record?.name === "string"
          ? record.name
          : typeof current;
    const code =
      typeof record?.code === "string" || typeof record?.code === "number"
        ? record.code
        : undefined;
    causes.push({ name, ...(code === undefined ? {} : { code }) });
    current = record?.err ?? record?.cause;
  }

  console.error("Admin sign-in failed", {
    type: authError?.type ?? "UnexpectedError",
    causes,
  });
}

export async function loginAdmin(email: string, password: string) {
  if (typeof email !== "string" || typeof password !== "string") {
    return { error: "Enter a valid email address and password." };
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail.includes("@") || !password) {
    return { error: "Enter a valid email address and password." };
  }

  try {
    await signIn("credentials", {
      email: normalizedEmail,
      password,
      redirectTo: "/admin/dashboard",
      redirect: false,
    });
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid email or password." };
      }

      logSignInFailure(error);
      return { error: "Sign-in is temporarily unavailable. Please try again." };
    }

    logSignInFailure(error);
    return { error: "Could not complete sign-in. Please try again." };
  }
}
