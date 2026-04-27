import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");

    // Jika user sudah login dan mencoba akses halaman login/register, redirect ke dashboard
    if (isAuthPage && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isAuthPage = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
        const isLandingPage = req.nextUrl.pathname === "/";
        
        // Halaman yang bisa diakses publik
        if (isAuthPage || isLandingPage) return true;

        // Selain itu (dashboard, tasks, dll) butuh token
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/tasks/:path*",
    "/login",
    "/register",
  ],
};
