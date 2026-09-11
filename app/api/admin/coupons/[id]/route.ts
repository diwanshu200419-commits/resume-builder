import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/server";

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

    const supabase = await createServiceClient();
    const { data, error } = await supabase
      .from("coupons")
      .update(updatePayload)
      .eq("id", couponId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      coupon: data,
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

    const supabase = await createServiceClient();

    const { error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", couponId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error: any) {
    console.error("[Admin Coupon DELETE Error]:", error);
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
