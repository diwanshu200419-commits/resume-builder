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

export async function GET() {
  try {
    const { error: authError, admin } = await requireAdmin();
    if (authError || !admin) return authError;

    const supabase = await createServiceClient();

    // Fetch coupons
    const { data: coupons, error: couponsError } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    // Fetch recent redemptions
    const { data: redemptions, error: redemptionsError } = await supabase
      .from("coupon_redemptions")
      .select("*")
      .order("redeemed_at", { ascending: false })
      .limit(50);

    return NextResponse.json({
      success: true,
      coupons: coupons || [],
      redemptions: redemptions || [],
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      coupon: data,
      message: `Coupon '${cleanCode}' created successfully.`,
    });
  } catch (error: any) {
    console.error("[Admin Coupons POST Error]:", error);
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}
