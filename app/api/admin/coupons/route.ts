import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { checkAdminRateLimit } from "@/lib/admin/rate-limit";
import { z } from "zod";

const CreateCouponSchema = z.object({
  code: z.string().trim().min(3).max(30).regex(/^[A-Za-z0-9_-]+$/),
  plan: z.enum(["all", "pro", "premium", "career_pack", "career"]).default("all"),
  discount_type: z.enum(["percent", "fixed", "free_months"]),
  discount_value: z.number().positive(),
  duration_months: z.number().int().min(1).default(1),
  max_redemptions: z.number().int().min(1).default(100),
  expires_at: z.string().nullable().optional(),
  description: z.string().max(200).optional(),
});

import { getAllFallbackCoupons, addFallbackCoupon, FALLBACK_REDEMPTIONS, DBCoupon } from "@/lib/coupons";

export async function GET() {
  try {
    const { error: authError, admin } = await requireAdmin();
    if (authError || !admin) return authError;

    let coupons: any[] = [];
    let redemptions: any[] = [];

    try {
      const supabase = await createServiceClient();

      // Fetch coupons
      const { data: dbCoupons, error: couponsError } = await supabase
        .from("coupons")
        .select("*")
        .order("created_at", { ascending: false });

      if (!couponsError && dbCoupons) {
        coupons = dbCoupons;
      }

      // Fetch recent redemptions
      const { data: dbRedemptions, error: redemptionsError } = await supabase
        .from("coupon_redemptions")
        .select("*")
        .order("redeemed_at", { ascending: false })
        .limit(50);

      if (!redemptionsError && dbRedemptions) {
        redemptions = dbRedemptions;
      }
    } catch (dbErr) {
      console.warn("[Admin Coupons GET] DB query failed, using fallback coupons:", dbErr);
    }

    // If database table is empty or pending migration, supplement with fallback registry
    if (coupons.length === 0) {
      coupons = getAllFallbackCoupons();
    }
    if (redemptions.length === 0) {
      redemptions = FALLBACK_REDEMPTIONS;
    }

    return NextResponse.json({
      success: true,
      coupons,
      redemptions,
    });
  } catch (error: any) {
    console.error("[Admin Coupons GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { error: authError, admin } = await requireAdmin();
    if (authError || !admin) return authError;

    const clientIp = request.headers.get("x-forwarded-for") || admin.userId;
    const rateCheck = checkAdminRateLimit(clientIp);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: "Too many admin requests. Please wait a moment before creating more coupons." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = CreateCouponSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid coupon data: " + parsed.error.issues.map((i) => i.message).join(", ") },
        { status: 400 }
      );
    }

    const { code, plan, discount_type, discount_value, duration_months, max_redemptions, expires_at } = parsed.data;
    const cleanCode = code.toUpperCase();
    const normalizedPlan = plan === "career" ? "career_pack" : plan;

    if (discount_type === "percent" && discount_value > 100) {
      return NextResponse.json({ error: "Percentage discount cannot exceed 100%" }, { status: 400 });
    }

    let couponRecord: DBCoupon | null = null;

    try {
      const supabase = await createServiceClient();

      const { data, error } = await supabase
        .from("coupons")
        .insert({
          code: cleanCode,
          plan: normalizedPlan,
          discount_type,
          discount_value,
          duration_months,
          max_redemptions,
          expires_at: expires_at ? new Date(expires_at).toISOString() : null,
          created_by: admin.userId,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          return NextResponse.json({ error: `Coupon code '${cleanCode}' already exists.` }, { status: 409 });
        }
        console.warn("[Admin Coupons POST] DB insert failed, falling back to memory:", error.message);
      } else {
        couponRecord = data;
      }
    } catch (err: any) {
      console.warn("[Admin Coupons POST] DB exception, falling back:", err);
    }

    // Resilient fallback storage
    if (!couponRecord) {
      couponRecord = {
        id: `coupon-${Date.now()}`,
        code: cleanCode,
        plan: normalizedPlan,
        discount_type,
        discount_value,
        duration_months,
        max_redemptions,
        times_redeemed: 0,
        expires_at: expires_at ? new Date(expires_at).toISOString() : null,
        is_active: true,
        created_by: admin.userId,
        created_at: new Date().toISOString(),
      };
      addFallbackCoupon(couponRecord);
    }

    return NextResponse.json({
      success: true,
      coupon: couponRecord,
      message: `Coupon '${cleanCode}' created successfully.`,
    });
  } catch (error: any) {
    console.error("[Admin Coupons POST Error]:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
