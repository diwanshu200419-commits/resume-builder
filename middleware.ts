import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PROTECTED_ROUTES = [
  "/dashboard",
  "/profile",
  "/analyze",
  "/results",
  "/branding-studio",
  "/interview-prep",
  "/portfolio",
  "/account",
  "/builder",
  "/job-match",
  "/hiring-probability",
  "/recruiter-simulation",
  "/applications",
  "/networking",
  "/github-sync",
  "/roadmap",
  "/roast",
  "/salary-calculator",
  "/translate",
  "/linkedin",
  "/cover-letter",
  "/career-coach",
  "/settings",
  "/checkout",
];

const ADMIN_ROUTE = "/admin";

const AUTH_ROUTES = ["/login", "/signup"];

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
}

function isAdminRoute(pathname: string): boolean {
  return pathname === ADMIN_ROUTE || pathname.startsWith(`${ADMIN_ROUTE}/`);
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.includes(pathname);
}

function getSafeRedirectPath(rawNext: string | null): string {
  if (!rawNext) return "/dashboard";
  try {
    const decoded = decodeURIComponent(rawNext);
    if (
      decoded.startsWith("/") &&
      !decoded.startsWith("//") &&
      !decoded.startsWith("/http")
    ) {
      return decoded;
    }
  } catch {
    // ignore decode errors
  }
  return "/dashboard";
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll().map((c) => ({
          name: c.name,
          value: c.value,
        }));
      },
      setAll(cs: { name: string; value: string; options?: any }[]) {
        cs.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options as any);
        });
      },
    },
  });

  const { data, error } = await supabase.auth.getUser();
  const user = data?.user ?? null;

  if (isAuthRoute(pathname)) {
    if (user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  const isAdm = isAdminRoute(pathname);
  const isAdmApi = pathname === "/api/admin" || pathname.startsWith("/api/admin/");

  // 1. Edge Layer: Protect Admin API Routes
  if (isAdmApi) {
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Authentication required" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || profile.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin privileges required" }, { status: 403 });
    }

    return response;
  }

  // 2. Edge Layer: Protect Admin UI Console
  if (isAdm) {
    if (!user) {
      // Cloaked redirect: Never reveal ?next=/admin in URL query parameters
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (profileError || !profile) {
      // Non-admin user attempting to access /admin -> silently redirect to user dashboard
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/dashboard";
      redirectUrl.search = "";
      return NextResponse.redirect(redirectUrl);
    }

    // 3. Admin MFA Enforcement (AAL2 Check)
    const isMfaPath = pathname.startsWith("/admin/mfa");
    if (!isMfaPath && process.env.ENABLE_ADMIN_MFA !== "false") {
      try {
        const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
        if (aalData && aalData.currentLevel === "aal1" && aalData.nextLevel === "aal2") {
          const redirectUrl = request.nextUrl.clone();
          redirectUrl.pathname = "/admin/mfa-verify";
          redirectUrl.search = "";
          return NextResponse.redirect(redirectUrl);
        }
      } catch {
        // Continue if MFA endpoint is unavailable
      }
    }

    return response;
  }

  const needsProtection = isProtectedRoute(pathname);

  if (needsProtection) {
    if (!user) {
      const fullPath = pathname + request.nextUrl.search;
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.search = "";
      redirectUrl.searchParams.set("next", encodeURIComponent(fullPath));
      return NextResponse.redirect(redirectUrl);
    }

    try {
      await supabase
        .from("profiles")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", user.id);
    } catch {
      // ignore
    }

    return response;
  }

  if (user) {
    try {
      await supabase
        .from("profiles")
        .update({ last_seen_at: new Date().toISOString() })
        .eq("id", user.id);
    } catch {
      // ignore
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/admin/:path*",
    "/api/admin/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
    "/analyze/:path*",
    "/results/:path*",
    "/branding-studio/:path*",
    "/interview-prep/:path*",
    "/portfolio/:path*",
    "/account/:path*",
    "/builder/:path*",
    "/job-match/:path*",
    "/hiring-probability/:path*",
    "/recruiter-simulation/:path*",
    "/applications/:path*",
    "/networking/:path*",
    "/github-sync/:path*",
    "/roadmap/:path*",
    "/roast/:path*",
    "/salary-calculator/:path*",
    "/translate/:path*",
    "/linkedin/:path*",
    "/cover-letter/:path*",
    "/career-coach/:path*",
    "/settings/:path*",
    "/checkout/:path*",
  ],
};
