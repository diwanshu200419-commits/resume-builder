import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const ADMIN_EMAILS = [
  "admin@vaylo.ai",
  "jattshiv32@gmail.com",
  "paid_tester_123@example.com",
  "diwanshu200419@gmail.com"
];

export async function GET(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile || !profile.email || !ADMIN_EMAILS.includes(profile.email)) {
      return NextResponse.json({ error: "Unauthorized admin access" }, { status: 403 });
    }

    const supabase = await createServiceClient();

    const { data: users } = await supabase
      .from("profiles")
      .select("id, email, full_name, plan, subscription_status, total_resume_downloads, expires_at")
      .order("created_at", { ascending: false });

    let paymentRequests: any[] = [];
    try {
      const { data: reqs } = await supabase
        .from("payment_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (reqs) paymentRequests = reqs;
    } catch {}

    // Mock DB Fallback Fetch for full offline/mock resilience
    if (!users || users.length === 0) {
      try {
        const mockRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/mock-db`);
        if (mockRes.ok) {
          const mockData = await mockRes.json();
          return NextResponse.json({
            users: [mockData?.data?.profile || { id: profile.id, email: profile.email, full_name: profile.full_name || "Demo Candidate", plan: profile.plan || "free" }],
            paymentRequests: mockData?.data?.payment_requests || paymentRequests,
          });
        }
      } catch {}
    }

    return NextResponse.json({
      users: users || [],
      paymentRequests: paymentRequests,
    });
  } catch (error) {
    console.error("Admin user list error:", error);
    return NextResponse.json({ error: "Failed to list users" }, { status: 500 });
  }
}
