import { NextResponse } from "next/server";
import { auth } from "@/auth";

export const proxy = auth((request) => {
  const { pathname } = request.nextUrl;
  const isLogin = pathname === "/admin/login";
  const isAdmin = Boolean(request.auth?.user);

  if (pathname === "/admin") {
    return NextResponse.redirect(
      new URL(isAdmin ? "/admin/dashboard" : "/admin/login", request.url),
    );
  }

  if (isLogin && isAdmin) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (!isLogin && !isAdmin) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
