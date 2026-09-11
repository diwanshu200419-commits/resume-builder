// lib/coupons.ts — Database-Backed & Resilient Coupon Engine
import { createServiceClient } from "@/lib/supabase/server";

export type DiscountType = "percent" | "fixed" | "free_months";

export interface DBCoupon {
  id: string;
  code: string;
  plan: string; // 'all' | 'pro' | 'premium' | 'career_pack'
  discount_type: DiscountType;
  discount_value: number;
  duration_months: number;
  max_redemptions: number;
  times_redeemed: number;
  expires_at: string | null;
  is_active: boolean;
  created_by?: string | null;
  created_at: string;
  description?: string;
}

export interface CouponRedemptionRecord {
  id: string;
  coupon_id: string;
  user_id: string;
  user_email?: string | null;
  plan: string;
  discount_applied: number;
  redeemed_at: string;
}

// In-memory fallback registry for development, testing, and migration bootstrapping
export const FALLBACK_COUPONS: Map<string, DBCoupon> = new Map([
  [
    "SAVE20",
    {
      id: "fallback-save20",
      code: "SAVE20",
      plan: "all",
      discount_type: "percent",
      discount_value: 20,
      duration_months: 1,
      max_redemptions: 1000,
      times_redeemed: 0,
      expires_at: null,
      is_active: true,
      created_at: new Date().toISOString(),
      description: "20% OFF Special Discount",
    },
  ],
  [
    "SAVE50",
    {
      id: "fallback-save50",
      code: "SAVE50",
      plan: "all",
      discount_type: "percent",
      discount_value: 50,
      duration_months: 1,
      max_redemptions: 500,
      times_redeemed: 0,
      expires_at: null,
      is_active: true,
      created_at: new Date().toISOString(),
      description: "50% OFF Early Bird Discount",
    },
  ],
  [
    "VAYLO50",
    {
      id: "fallback-vaylo50",
      code: "VAYLO50",
      plan: "all",
      discount_type: "fixed",
      discount_value: 50,
      duration_months: 1,
      max_redemptions: 500,
      times_redeemed: 0,
      expires_at: null,
      is_active: true,
      created_at: new Date().toISOString(),
      description: "Flat ₹50 OFF Discount",
    },
  ],
  [
    "PROFREE",
    {
      id: "fallback-profree",
      code: "PROFREE",
      plan: "pro",
      discount_type: "free_months",
      discount_value: 1,
      duration_months: 1,
      max_redemptions: 50,
      times_redeemed: 0,
      expires_at: null,
      is_active: true,
      created_at: new Date().toISOString(),
      description: "1 Month Free Pro Plan",
    },
  ],
]);

export const FALLBACK_REDEMPTIONS: CouponRedemptionRecord[] = [];

export function addFallbackCoupon(coupon: DBCoupon): void {
  FALLBACK_COUPONS.set(coupon.code.toUpperCase(), coupon);
}

export function getAllFallbackCoupons(): DBCoupon[] {
  return Array.from(FALLBACK_COUPONS.values());
}

/**
 * Fetch a coupon by its unique code from Supabase DB, with graceful fallback.
 */
export async function getCouponByCode(code: string): Promise<DBCoupon | null> {
  const normalized = (code || "").trim().toUpperCase();
  if (!normalized) return null;

  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("coupons")
      .select("*")
      .ilike("code", normalized)
      .maybeSingle();

    if (!error && data) {
      return data as DBCoupon;
    }
  } catch (err) {
    console.warn("[getCouponByCode] Supabase coupons table query error, checking fallback:", err);
  }

  return FALLBACK_COUPONS.get(normalized) || null;
}

/**
 * Calculates discount and final payable price server-side.
 */
export function calculateCouponDiscount(
  originalPrice: number,
  coupon: DBCoupon
): {
  discountAmount: number;
  finalPrice: number;
  isFreeUpgrade: boolean;
} {
  let discountAmount = 0;

  if (coupon.discount_type === "percent") {
    discountAmount = Math.round((originalPrice * Number(coupon.discount_value)) / 100);
  } else if (coupon.discount_type === "fixed") {
    discountAmount = Math.min(originalPrice, Number(coupon.discount_value));
  } else if (coupon.discount_type === "free_months") {
    discountAmount = originalPrice;
  }

  const finalPrice = Math.max(0, originalPrice - discountAmount);
  const isFreeUpgrade = finalPrice === 0 || coupon.discount_type === "free_months";

  return { discountAmount, finalPrice, isFreeUpgrade };
}

/**
 * Validates whether a coupon can be redeemed by a user for a given plan.
 */
export async function validateCouponForUser(
  code: string,
  userId: string,
  plan: string
): Promise<
  | { valid: true; coupon: DBCoupon }
  | { valid: false; error: string }
> {
  const coupon = await getCouponByCode(code);
  if (!coupon) {
    return { valid: false, error: "Invalid coupon code. Please verify and try again." };
  }

  if (!coupon.is_active) {
    return { valid: false, error: "This coupon is no longer active." };
  }

  if (coupon.expires_at && new Date(coupon.expires_at).getTime() < Date.now()) {
    return { valid: false, error: "This coupon has expired." };
  }

  if (coupon.times_redeemed >= coupon.max_redemptions) {
    return { valid: false, error: "This coupon has reached its maximum redemption limit." };
  }

  const normalizedTargetPlan = plan.toLowerCase().replace("-", "_");
  const couponPlan = coupon.plan.toLowerCase().replace("-", "_");

  if (couponPlan !== "all" && couponPlan !== normalizedTargetPlan) {
    return {
      valid: false,
      error: `This coupon is only valid for the ${coupon.plan.toUpperCase()} plan.`,
    };
  }

  // Check if user has already redeemed this coupon
  try {
    const supabase = await createServiceClient();
    const { data: redemption, error } = await supabase
      .from("coupon_redemptions")
      .select("id")
      .eq("coupon_id", coupon.id)
      .eq("user_id", userId)
      .maybeSingle();

    if (!error && redemption) {
      return { valid: false, error: "You have already redeemed this coupon." };
    }
  } catch (err) {
    // Check fallback redemptions
    const exists = FALLBACK_REDEMPTIONS.some(
      (r) => r.coupon_id === coupon.id && r.user_id === userId
    );
    if (exists) {
      return { valid: false, error: "You have already redeemed this coupon." };
    }
  }

  return { valid: true, coupon };
}

/**
 * Atomically marks a coupon as redeemed by the user.
 */
export async function redeemCouponAtomic(
  code: string,
  userId: string,
  userEmail: string,
  plan: string,
  discountApplied: number
): Promise<{ success: boolean; error?: string }> {
  const normalized = code.trim().toUpperCase();

  try {
    const supabase = await createServiceClient();
    const { data, error } = await supabase.rpc("redeem_coupon_atomic", {
      p_code: normalized,
      p_user_id: userId,
      p_user_email: userEmail,
      p_plan: plan,
      p_discount_applied: discountApplied,
    });

    if (!error && data) {
      if (data.success) {
        return { success: true };
      }
      return { success: false, error: data.error || "Redemption failed." };
    }
  } catch (rpcErr) {
    console.warn("[redeemCouponAtomic] RPC error, using fallback transaction:", rpcErr);
  }

  // Resilient fallback logic
  const coupon = FALLBACK_COUPONS.get(normalized);
  if (!coupon) {
    return { success: false, error: "Coupon not found." };
  }

  if (coupon.times_redeemed >= coupon.max_redemptions) {
    return { success: false, error: "Redemption limit exceeded." };
  }

  const alreadyUsed = FALLBACK_REDEMPTIONS.some(
    (r) => r.coupon_id === coupon.id && r.user_id === userId
  );
  if (alreadyUsed) {
    return { success: false, error: "You have already redeemed this coupon." };
  }

  coupon.times_redeemed += 1;
  FALLBACK_REDEMPTIONS.push({
    id: `redemption-${Date.now()}`,
    coupon_id: coupon.id,
    user_id: userId,
    user_email: userEmail,
    plan,
    discount_applied: discountApplied,
    redeemed_at: new Date().toISOString(),
  });

  return { success: true };
}

// ----------------------------------------------------
// Backward Compatibility layer for existing code
// ----------------------------------------------------
export interface Coupon {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  applicablePlans?: string[];
  description: string;
}

export const AUTHORIZED_COUPONS: Record<string, Coupon> = {
  SAVE20: { code: "SAVE20", discountType: "percent", discountValue: 20, description: "20% OFF Special Discount" },
  SAVE50: { code: "SAVE50", discountType: "percent", discountValue: 50, description: "50% OFF Early Bird Discount" },
  VAYLO50: { code: "VAYLO50", discountType: "fixed", discountValue: 50, description: "Flat ₹50 OFF Discount" },
  OFF10: { code: "OFF10", discountType: "percent", discountValue: 10, description: "10% OFF Welcome Discount" },
};

export function calculateDiscount(originalPrice: number, coupon: Coupon): {
  discountAmount: number;
  finalPrice: number;
} {
  let discountAmount = 0;
  if (coupon.discountType === "percent") {
    discountAmount = Math.round((originalPrice * coupon.discountValue) / 100);
  } else if (coupon.discountType === "fixed") {
    discountAmount = Math.min(originalPrice, coupon.discountValue);
  }
  const finalPrice = Math.max(0, originalPrice - discountAmount);
  return { discountAmount, finalPrice };
}

