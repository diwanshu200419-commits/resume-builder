import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ADMIN_EMAILS = [
  "admin@vaylo.ai",
  "jattshiv32@gmail.com",
  "paid_tester_123@example.com"
];

export async function GET(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile || !profile.email || !ADMIN_EMAILS.includes(profile.email)) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 403 });
    }

    const supabase = await createServiceClient();

    const { data: users, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, plan, subscription_status, total_resume_downloads")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin user list error:", error);
    return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
  }
}
