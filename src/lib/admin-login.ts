"use server";

import { AuthError } from "next-auth";
import { compare } from "bcryptjs";
import { signIn } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";

export async function loginAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    await connectDB();
    const admin = await Admin.findOne({ email: normalizedEmail }).lean();
    if (!admin?.password) {
      return { error: "No admin account exists for this email." };
    }

    const matches = await compare(password, admin.password);
    if (!matches) {
      return {
        error: `Password does not match. You typed ${password.length} character(s); the admin password is 16 characters and includes #.`,
      };
    }
  } catch (error) {
    console.error("Admin pre-check failed", error);
    return {
      error: "Could not reach the database. Check MONGODB_URI and Atlas IP access.",
    };
  }

  const formData = new FormData();
  formData.set("email", normalizedEmail);
  formData.set("password", password);
  formData.set("redirectTo", "/admin/dashboard");

  try {
    await signIn("credentials", formData);
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: `Password is correct, but session failed (${error.type}).` };
    }
    throw error;
  }
}
