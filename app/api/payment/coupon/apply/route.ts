import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { validateCouponForUser, calculateCouponDiscount, redeemCouponAtomic } from "@/lib/coupons";
import { getPlanAmount } from "@/lib/upi";
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
      return NextResponse.json({ error: "Please enter a coupon code." }, { status: 400 });
    }

    // Server-side validation against database
    const validation = await validateCouponForUser(cleanCode, profile.id, plan);
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const coupon = validation.coupon;
    const originalPrice = getPlanAmount(plan as Exclude<Plan, "free">);
    const { discountAmount, finalPrice, isFreeUpgrade } = calculateCouponDiscount(originalPrice, coupon);

    // 100% Free Upgrade or Free Trial Months (No Razorpay call needed)
    if (isFreeUpgrade) {
      const redeemResult = await redeemCouponAtomic(
        cleanCode,
        profile.id,
        profile.email || "",
        plan,
        discountAmount
      );

      if (!redeemResult.success) {
        return NextResponse.json({ error: redeemResult.error || "Could not redeem coupon." }, { status: 400 });
      }

      await upgradeUserPlan(profile.id, plan, "coupon", `COUPON_${cleanCode}`);

      await createNotification({
        userId: profile.id,
        type: "payment_approved",
        title: `Coupon Applied — ${plan.toUpperCase()} Unlocked! 🎉`,
        body: `Coupon '${cleanCode}' was successfully redeemed. All features of the ${plan.toUpperCase()} plan are active!`,
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
        message: `Coupon '${cleanCode}' verified! Your ${plan.toUpperCase()} plan has been activated.`,
      });
    }

    // Partial Discount — Validated for checkout
    return NextResponse.json({
      success: true,
      isFullAccess: false,
      coupon: cleanCode,
      discountType: coupon.discount_type,
      discountValue: coupon.discount_value,
      originalPrice,
      discountAmount,
      finalPrice,
      description: coupon.description || `Special discount on ${plan.toUpperCase()}`,
      message: `Coupon '${cleanCode}' applied! You saved ₹${discountAmount}. Final payable: ₹${finalPrice}.`,
    });
  } catch (error: any) {
    console.error("[Coupon Apply Error]:", error);
    return NextResponse.json({ error: "Failed to apply coupon code" }, { status: 500 });
  }
}
