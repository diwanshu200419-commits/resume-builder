import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { AUTHORIZED_COUPONS, calculateDiscount } from "@/lib/coupons";
import { getPlanAmount, buildUpiLink, buildUpiQrUrl } from "@/lib/upi";
import { upgradeUserPlan } from "@/lib/upgrade-user-plan";
import { createNotification } from "@/lib/notifications";
import type { Plan } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, plan = "pro" } = await request.json();
    const cleanCode = String(code || "").trim().toUpperCase();

    if (!cleanCode) {
      return NextResponse.json({ error: "Please enter a coupon code" }, { status: 400 });
    }

    const coupon = AUTHORIZED_COUPONS[cleanCode];

    if (!coupon) {
      return NextResponse.json(
        { error: "Invalid coupon code. Please check and try again." },
        { status: 400 }
      );
    }

    const originalPrice = getPlanAmount(plan as Exclude<Plan, "free">);
    const { discountAmount, finalPrice } = calculateDiscount(originalPrice, coupon);

    // If 100% OFF Full Access Pass (e.g. ADMIN100 or VAYLOVIP)
    if (finalPrice === 0 || coupon.discountValue === 100) {
      await upgradeUserPlan(profile.id, plan, "manual_upi", `COUPON_${cleanCode}`);

      await createNotification({
        userId: profile.id,
        type: "payment_approved",
        title: `Full Access Coupon Applied — ${plan.toUpperCase()} Unlocked! 🎉`,
        body: `Coupon '${cleanCode}' was applied. All features of the ${plan.toUpperCase()} plan are active!`,
        link: "/dashboard",
      });

      return NextResponse.json({
        success: true,
        isFullAccess: true,
        status: "approved",
        plan,
        coupon: cleanCode,
        discountAmount,
        finalPrice: 0,
        message: `Success! Full access pass '${cleanCode}' applied. Your account is upgraded! 🎉`,
      });
    }

    // Otherwise return discount details & updated UPI payment links for reduced payable amount
    const upiLink = buildUpiLink({ amount: finalPrice });
    const qrUrl = buildUpiQrUrl(upiLink, finalPrice);

    return NextResponse.json({
      success: true,
      isFullAccess: false,
      coupon: cleanCode,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      originalPrice,
      discountAmount,
      finalPrice,
      description: coupon.description,
      upiLink,
      qrUrl,
      message: `Coupon '${cleanCode}' applied! You saved ₹${discountAmount}. New payable price: ₹${finalPrice}.`,
    });
  } catch (error: any) {
    console.error("[Coupon API Error]:", error);
    return NextResponse.json({ error: "Failed to apply coupon code" }, { status: 500 });
  }
}
