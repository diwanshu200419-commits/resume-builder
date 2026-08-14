import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { upgradeUserPlan } from "@/lib/upgrade-user-plan";
import { createNotification } from "@/lib/notifications";

const VALID_COUPONS: Record<string, { discountPercent: number; description: string }> = {
  VAYLO100: { discountPercent: 100, description: "100% Off Special Access Pass" },
  PROMO2026: { discountPercent: 100, description: "2026 Launch Promo Pass" },
  VIP2026: { discountPercent: 100, description: "VIP Lifetime Candidate Pass" },
  LAUNCH2026: { discountPercent: 100, description: "Official Launch Code" },
  VAYLOFREE: { discountPercent: 100, description: "Free All-Access Pass" },
  OFF100: { discountPercent: 100, description: "100% Off Discount Code" },
};

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, plan = "pro" } = await request.json();
    const cleanCode = String(code || "").trim().toUpperCase();

    if (!cleanCode) {
      return NextResponse.json({ error: "Please enter a valid coupon code" }, { status: 400 });
    }

    const couponInfo = VALID_COUPONS[cleanCode];

    // Accept any code starting with VAYLO, PROMO, VIP, TEST, or listed in VALID_COUPONS
    const isValid =
      couponInfo ||
      cleanCode.startsWith("VAYLO") ||
      cleanCode.startsWith("PROMO") ||
      cleanCode.startsWith("VIP") ||
      cleanCode.startsWith("TEST");

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired coupon code. Try VAYLO100 or PROMO2026." },
        { status: 400 }
      );
    }

    // Perform Instant Plan Upgrade Allotment
    await upgradeUserPlan(profile.id, plan, "manual_upi", `COUPON_${cleanCode}`);

    // Create In-App Notification
    await createNotification({
      userId: profile.id,
      type: "payment_approved",
      title: `Coupon Applied — ${plan.toUpperCase()} Unlocked! 🎉`,
      body: `Coupon code '${cleanCode}' was applied successfully. All features of the ${plan.toUpperCase()} plan are active!`,
      link: "/dashboard",
    });

    return NextResponse.json({
      success: true,
      status: "approved",
      plan,
      coupon: cleanCode,
      message: `Coupon '${cleanCode}' applied! Your account has been upgraded to ${plan.toUpperCase()}. 🎉`,
    });
  } catch (error: any) {
    console.error("[Coupon Apply Error]:", error);
    return NextResponse.json({ error: "Failed to apply coupon code" }, { status: 500 });
  }
}
