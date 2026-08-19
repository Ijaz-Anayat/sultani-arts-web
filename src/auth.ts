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
        const rawEmail = credentials?.email;
        const rawPassword = credentials?.password;
        const email = (Array.isArray(rawEmail) ? rawEmail[0] : rawEmail)
          ?.toString()
          .trim()
          .toLowerCase();
        const password = (Array.isArray(rawPassword) ? rawPassword[0] : rawPassword)?.toString();

        if (!email || !password) {
          console.error("Admin login missing credentials");
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
