import { NextResponse } from "next/server";

const publicPaths = [
  "/login",
  "/forget-password",
  "/otp",
  "/reset-password",
  "/sign-up",
  "/verify-otp",
];

export function middleware(request) {
  const pathname = request.nextUrl.pathname;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Skip Next.js static files
  if (pathname.startsWith("/_next/") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const isPublic = publicPaths.some((route) => pathname.startsWith(route));

  if (isPublic) {
    if (pathname === "/login" && refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (!refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
