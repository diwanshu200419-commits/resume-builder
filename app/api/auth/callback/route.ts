import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const type = searchParams.get("type");
  const next = searchParams.get("next");

  let validatedNext = "/dashboard";

  if (
    next &&
    typeof next === "string" &&
    next.startsWith("/") &&
    !next.startsWith("//") &&
    !next.startsWith("/http")
  ) {
    validatedNext = next;
  }

  if (type === "recovery") {
    const recoveryPath = next && next.startsWith("/") && !next.startsWith("//") && !next.startsWith("/http") ? next : "/settings";
    validatedNext = recoveryPath;
  }

  if (code) {
    try {
      const supabase = await createClient();
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error("Auth callback: error exchanging code for session:", error);
    }
  }

  try {
    const supabase = await createClient();
    const { data, error: userError } = await supabase.auth.getUser();

    if (!userError && data?.user) {
      try {
        await supabase
          .from("profiles")
          .update({ last_seen_at: new Date().toISOString() })
          .eq("id", data.user.id);
      } catch (profileError) {
        console.error("Auth callback: error updating last_seen_at:", profileError);
      }
    }
  } catch (getUserError) {
    console.error("Auth callback: error getting user:", getUserError);
  }

  return NextResponse.redirect(new URL(validatedNext, request.url));
}
