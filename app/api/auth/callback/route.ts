import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/dashboard";

  if (code) {
    try {
      const supabase = await createClient();
      await supabase.auth.exchangeCodeForSession(code);
    } catch {}
  }

  // Target redirect URL
  const targetUrl = redirect.includes("?") ? `${origin}${redirect}&authed=true` : `${origin}${redirect}?authed=true`;

  const response = NextResponse.redirect(targetUrl);
  response.cookies.set("mock-session-id", `google-user-${Date.now()}`, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  return response;
}
