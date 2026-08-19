"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function loginAdmin(email: string, password: string) {
  const formData = new FormData();
  formData.set("email", email);
  formData.set("password", password);
  formData.set("redirectTo", "/admin/dashboard");

  try {
    await signIn("credentials", formData);
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.type === "CredentialsSignin") {
        return { error: "Invalid email or password. Include the # in the password." };
      }
      return { error: `Sign-in failed (${error.type}). Check Vercel MongoDB URI and AUTH_SECRET.` };
    }
    throw error;
  }
}
