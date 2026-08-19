"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function loginAdmin(email: string, password: string) {
  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/admin/dashboard",
    });
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid email or password." };
    }
    throw error;
  }
}
