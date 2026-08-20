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
      if (user?.id) {
        token.id = user.id;
        token.role = user.role ?? "admin";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        if (token.role === "admin" && typeof token.id === "string" && token.id) {
          session.user.id = token.id;
          session.user.role = "admin";
        } else {
          session.user.id = "";
          session.user.role = undefined;
        }
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
