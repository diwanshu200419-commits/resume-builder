import { createClient } from "@/lib/supabase/server";

export interface StepUpVerificationResult {
  verified: boolean;
  error?: string;
}

/**
 * Validates step-up password confirmation for sensitive/destructive admin actions.
 * A stolen session cookie alone will fail this check.
 */
export async function verifyAdminStepUp(
  adminEmail: string,
  confirmPassword?: string
): Promise<StepUpVerificationResult> {
  if (!confirmPassword || confirmPassword.trim().length === 0) {
    return {
      verified: false,
      error: "Step-up authentication required: Please enter your admin password to confirm this action.",
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: confirmPassword,
    });

    if (error || !data.user) {
      return {
        verified: false,
        error: "Invalid administrator password. Step-up authentication failed.",
      };
    }

    return { verified: true };
  } catch (err: any) {
    console.error("[verifyAdminStepUp] Error during step-up password check:", err);
    return {
      verified: false,
      error: "Failed to verify admin password due to a server error.",
    };
  }
}
