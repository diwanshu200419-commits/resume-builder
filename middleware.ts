import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseUrl } from "@/lib/supabase/url";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    getSupabaseUrl(),
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase.from("profiles").select("plan").eq("id", user.id).single()
    : { data: null };

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
    request.nextUrl.pathname.startsWith("/settings");

  const isPremiumRoute =
    request.nextUrl.pathname.startsWith("/cover-letter") ||
    request.nextUrl.pathname.startsWith("/interview-prep") ||
    request.nextUrl.pathname.startsWith("/linkedin");

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

  if (user && profile?.plan === "free" && isPremiumRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.searchParams.set("upgrade", "true");
    url.searchParams.set("feature", request.nextUrl.pathname.split("/")[1]);
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
    "/login",
    "/signup",
  ],
};
