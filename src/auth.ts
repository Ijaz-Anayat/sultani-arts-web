import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      id: "credentials",
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
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

        const admin = await Admin.findOne({ email }).lean();
        if (!admin?.password) {
          return null;
        }

        const matches = await compare(password, admin.password);
        if (!matches) {
          return null;
        }

        return {
          id: String(admin._id),
          email: admin.email,
          name: "Admin",
          role: "admin" as const,
        };
      },
    }),
  ],
});
