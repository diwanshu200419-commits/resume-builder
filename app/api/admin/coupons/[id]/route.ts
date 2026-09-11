import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { updateFallbackCoupon, deleteFallbackCoupon } from "@/lib/coupons";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error: authError, admin } = await requireAdmin();
    if (authError || !admin) return authError;

    const couponId = params.id;
    if (!couponId) {
      return NextResponse.json({ error: "Missing coupon ID" }, { status: 400 });
    }

    const body = await request.json();
    const updatePayload: Record<string, any> = {};

    if (typeof body.is_active === "boolean") {
      updatePayload.is_active = body.is_active;
    }
    if (typeof body.max_redemptions === "number" && body.max_redemptions >= 1) {
      updatePayload.max_redemptions = body.max_redemptions;
    }
    if (body.expires_at !== undefined) {
      updatePayload.expires_at = body.expires_at ? new Date(body.expires_at).toISOString() : null;
    }
    if (body.discount_value !== undefined && typeof body.discount_value === "number") {
      updatePayload.discount_value = body.discount_value;
    }
    if (body.discount_type !== undefined) {
      updatePayload.discount_type = body.discount_type;
    }
    if (body.plan !== undefined) {
      updatePayload.plan = body.plan;
    }
    if (body.duration_months !== undefined) {
      updatePayload.duration_months = body.duration_months;
    }

    let updatedRecord: any = null;

    try {
      const supabase = await createServiceClient();
      const { data, error } = await supabase
        .from("coupons")
        .update(updatePayload)
        .eq("id", couponId)
        .select()
        .single();

      if (!error && data) {
        updatedRecord = data;
      }
    } catch (dbErr) {
      console.warn("[Admin Coupon PATCH] DB update error, using fallback:", dbErr);
    }

    if (!updatedRecord) {
      updatedRecord = updateFallbackCoupon(couponId, updatePayload);
    }

    if (!updatedRecord) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      coupon: updatedRecord,
      message: `Coupon updated successfully.`,
    });
  } catch (error: any) {
    console.error("[Admin Coupon PATCH Error]:", error);
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { error: authError, admin } = await requireAdmin();
    if (authError || !admin) return authError;

    const couponId = params.id;
    if (!couponId) {
      return NextResponse.json({ error: "Missing coupon ID" }, { status: 400 });
    }

    let deletedFromDb = false;

    try {
      const supabase = await createServiceClient();
      const { error } = await supabase
        .from("coupons")
        .delete()
        .eq("id", couponId);

      if (!error) {
        deletedFromDb = true;
      }
    } catch (dbErr) {
      console.warn("[Admin Coupon DELETE] DB delete error, trying fallback:", dbErr);
    }

    const deletedFromFallback = deleteFallbackCoupon(couponId);

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error: any) {
    console.error("[Admin Coupon DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
