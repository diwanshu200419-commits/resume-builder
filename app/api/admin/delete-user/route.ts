import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { logAdminAudit } from "@/lib/admin/logger";

export const dynamic = "force-dynamic";

/**
 * Full Account Deletion Endpoint
 * Permanently removes candidate profile, analyses, feedback, and auth credentials.
 * Anonymizes payment_requests to comply with financial GST/tax audit retention rules.
 */
export async function POST(request: NextRequest) {
  try {
    const { error: authError, admin } = await requireAdmin();
    if (authError) return authError;

    const body = await request.json().catch(() => ({}));
    const { userId, confirmEmail, reason = "Admin full user deletion" } = body;

    if (!userId || !confirmEmail) {
      return NextResponse.json(
        { error: "Missing required parameters: userId and confirmEmail" },
        { status: 400 }
      );
    }

    const supabase = await createServiceClient();

    // Step 1: Fetch target user profile
    const { data: targetProfile, error: fetchError } = await supabase
      .from("profiles")
      .select("id, email, full_name, plan, role")
      .eq("id", userId)
      .single();

    if (fetchError || !targetProfile) {
      return NextResponse.json({ error: "Target user profile not found" }, { status: 404 });
    }

    // Step 2: Validate 2-Step Confirmation Email Match
    const targetEmail = (targetProfile.email || "").trim().toLowerCase();
    const inputConfirmEmail = confirmEmail.trim().toLowerCase();

    if (targetEmail !== inputConfirmEmail) {
      return NextResponse.json(
        {
          error: `Confirmation email mismatch. Typed '${inputConfirmEmail}' does not match target candidate email '${targetEmail}'.`,
        },
        { status: 400 }
      );
    }

    // Prevent deleting admin accounts via this endpoint
    if (targetProfile.role === "admin") {
      return NextResponse.json(
        { error: "Administrative accounts cannot be deleted via the automated user deletion endpoint." },
        { status: 403 }
      );
    }

    // Step 3: Anonymize payment_requests for accounting retention compliance
    // Financial transaction history (utr_number, amount_claimed, created_at) is retained for GST/tax audit,
    // but user_id is set to null and user_email is stripped of PII.
    await supabase
      .from("payment_requests")
      .update({
        user_id: null,
        user_email: "anonymized_deleted_user@vaylo.invalid",
      })
      .eq("user_id", userId);

    // Step 4: Delete candidate resume analysis records
    await supabase.from("analyses").delete().eq("user_id", userId);

    // Step 5: Delete candidate user feedback entries
    await supabase.from("user_feedback").delete().eq("user_id", userId);

    // Step 6: Delete candidate profile row
    const { error: deleteProfileError } = await supabase.from("profiles").delete().eq("id", userId);
    if (deleteProfileError) {
      console.error("[Delete User] Profile deletion error:", deleteProfileError.message);
    }

    // Step 7: Delete Supabase Auth User Credentials
    const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteAuthError) {
      console.error("[Delete User] Auth deletion error:", deleteAuthError.message);
    }

    // Step 8: Log Audit Event before completing
    await logAdminAudit({
      adminUserId: admin.userId,
      adminEmail: admin.email,
      action: "USER_DELETED",
      targetUserId: userId,
      targetEmail: targetEmail,
      previousState: { plan: targetProfile.plan, role: targetProfile.role },
      newState: { deleted: true, paymentRecordsAnonymized: true },
      reason: reason || `2-Step Confirmed deletion by admin ${admin.email}`,
      metadata: { deletedAt: new Date().toISOString() },
    });

    return NextResponse.json({
      success: true,
      message: `Account for ${targetEmail} has been permanently deleted. Financial records anonymized for tax compliance.`,
    });
  } catch (error: any) {
    console.error("[Delete User POST Exception]:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to complete account deletion" },
      { status: 500 }
    );
  }
}
