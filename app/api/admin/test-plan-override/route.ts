import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { isAdmin } from "@/lib/plans";

export const dynamic = "force-dynamic";

// POST /api/admin/test-plan-override
// Body: { plan: "free" | "pro" | "premium" | "career_pack" | "real" }
// Sets a session cookie TEST_PLAN_OVERRIDE — only works if caller is admin.
export async function POST(request: NextRequest) {
  const profile = await getProfile();

  // Only admins can set this — server-side role check
  if (!isAdmin(profile)) {
    return NextResponse.json(
      { error: "Unauthorized: admin role required to set test plan override" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const plan = String(body.plan || "real").toLowerCase();

  const validPlans = ["free", "pro", "premium", "career_pack", "career-pack", "real"];
  if (!validPlans.includes(plan)) {
    return NextResponse.json({ error: "Invalid plan value" }, { status: 400 });
  }

  const res = NextResponse.json({ success: true, override: plan === "real" ? null : plan });

  if (plan === "real") {
    // Clear the override cookie
    res.cookies.delete("test_plan_override");
  } else {
    // Set session-scoped override cookie (expires when browser closes)
    res.cookies.set("test_plan_override", plan, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      // No maxAge = session cookie only
    });
  }

  return res;
}

// GET — return current override value for the admin's session
export async function GET(request: NextRequest) {
  const profile = await getProfile();
  if (!isAdmin(profile)) {
    return NextResponse.json({ override: null });
  }
  const override = request.cookies.get("test_plan_override")?.value || null;
  return NextResponse.json({ override });
}
