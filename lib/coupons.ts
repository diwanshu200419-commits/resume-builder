// lib/coupons.ts — Centralized Discount & Secret Access Coupon Registry

export interface Coupon {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number; // Percentage (e.g., 20 = 20% off) or Fixed INR (e.g., 50 = ₹50 off)
  applicablePlans?: string[]; // All plans if undefined
  description: string;
}

export const AUTHORIZED_COUPONS: Record<string, Coupon> = {
  // Real Candidate Discount Coupons
  SAVE20: {
    code: "SAVE20",
    discountType: "percent",
    discountValue: 20,
    description: "20% OFF Special Discount",
  },
  SAVE50: {
    code: "SAVE50",
    discountType: "percent",
    discountValue: 50,
    description: "50% OFF Early Bird Discount",
  },
  VAYLO50: {
    code: "VAYLO50",
    discountType: "fixed",
    discountValue: 50,
    description: "Flat ₹50 OFF Discount",
  },
  OFF10: {
    code: "OFF10",
    discountType: "percent",
    discountValue: 10,
    description: "10% OFF Welcome Discount",
  },

  // Secret Owner / Testing Full Access Pass (100% OFF)
  ADMIN100: {
    code: "ADMIN100",
    discountType: "percent",
    discountValue: 100,
    description: "Owner Full Access Pass",
  },
  VAYLOVIP: {
    code: "VAYLOVIP",
    discountType: "percent",
    discountValue: 100,
    description: "VIP Candidate Access Pass",
  },
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
