import { createServerClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    "",
    "",
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user: any = null;

  // 1. Check for cookie-based mock session or auth token
  const mockCookie = request.cookies.get("mock-session-id")?.value;
  const sbAuthCookie = request.cookies.getAll().find(c => c.name.includes("auth-token") || c.name.includes("session"))?.value;

  if (mockCookie || sbAuthCookie) {
    user = {
      id: "active-user-session-id",
      email: "user@vaylo.ai",
      user_metadata: { full_name: "Vaylo Candidate" },
    };
  } else {
    try {
      const { data } = await supabase.auth.getUser();
      user = data?.user || null;
    } catch {
      user = null;
    }
  }

  const isAuthPage =
    request.nextUrl.pathname.startsWith("/login") ||
    request.nextUrl.pathname.startsWith("/signup");
  const isDashboard =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/analyze") ||
    request.nextUrl.pathname.startsWith("/results") ||
    request.nextUrl.pathname.startsWith("/cover-letter") ||
    request.nextUrl.pathname.startsWith("/interview-prep") ||
    request.nextUrl.pathname.startsWith("/linkedin") ||
    request.nextUrl.pathname.startsWith("/checkout") ||
    request.nextUrl.pathname.startsWith("/settings") ||
    request.nextUrl.pathname.startsWith("/builder") ||
    request.nextUrl.pathname.startsWith("/roast") ||
    request.nextUrl.pathname.startsWith("/roadmap") ||
    request.nextUrl.pathname.startsWith("/portfolio") ||
    request.nextUrl.pathname.startsWith("/admin");

  if (!user && isDashboard) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthPage) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
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
