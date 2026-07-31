import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public pages that should NEVER be blocked or redirected into loops
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/career-coach") ||
    pathname.startsWith("/pricing") ||
    pathname.startsWith("/free-ats-checker") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms") ||
    pathname.startsWith("/refund") ||
    pathname.startsWith("/api/");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check session cookie for protected dashboard routes
  const mockCookie = request.cookies.get("mock-session-id")?.value;
  const sbAuthCookie = request.cookies.getAll().find(c => c.name.includes("auth-token") || c.name.includes("session"))?.value;

  const isAuthenticated = Boolean(mockCookie || sbAuthCookie);

  if (!isAuthenticated) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/analyze/:path*",
    "/results/:path*",
    "/cover-letter/:path*",
    "/interview-prep/:path*",
    "/linkedin/:path*",
    "/career-coach/:path*",
    "/settings/:path*",
    "/checkout/:path*",
    "/builder/:path*",
    "/roast/:path*",
    "/roadmap/:path*",
    "/portfolio/:path*",
    "/admin/:path*",
    "/login",
    "/signup",
  ],
};
