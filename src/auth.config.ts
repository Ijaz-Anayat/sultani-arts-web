import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id && user.email) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role ?? "admin";
      }

      if (token.role !== "admin" || typeof token.id !== "string" || !token.id) {
        delete token.id;
        delete token.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const email = typeof token.email === "string" ? token.email.trim() : "";
        if (token.role === "admin" && typeof token.id === "string" && token.id && email.includes("@")) {
          session.user.id = token.id;
          session.user.email = email;
          session.user.role = "admin";
        } else {
          session.user.id = "";
          session.user.email = "";
          session.user.role = undefined;
        }
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
