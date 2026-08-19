import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const email =
            typeof credentials?.email === "string"
              ? credentials.email.trim().toLowerCase()
              : "";
          const password =
            typeof credentials?.password === "string" ? credentials.password : "";

          if (!email || !password) {
            return null;
          }

          const { connectDB } = await import("@/lib/mongodb");
          const { Admin } = await import("@/models/Admin");
          await connectDB();

          const admin = await Admin.findOne({ email });
          if (!admin) {
            return null;
          }

          const matches = await bcrypt.compare(password, admin.password);
          if (!matches) {
            return null;
          }

          return {
            id: String(admin._id),
            email: admin.email,
            role: "admin" as const,
          };
        } catch (error) {
          console.error("Admin login failed", error);
          return null;
        }
      },
    }),
  ],
});
