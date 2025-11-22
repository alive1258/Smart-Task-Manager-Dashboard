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

  // Skip Next.js static files and API routes
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    pathname === "/favicon.ico"
  ) {
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

// Add this config to specify which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
