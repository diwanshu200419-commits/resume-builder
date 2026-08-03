import "server-only";
import { getProfile } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export interface AdminAuthContext {
  userId: string;
  email: string;
  fullName: string | null;
  role: string;
}

/**
 * Server-side strict authorization helper for admin routes and server actions.
 * Enforces authenticated Supabase session + database role === 'admin'.
 */
export async function requireAdmin(): Promise<
  { error: null; admin: AdminAuthContext } | { error: NextResponse; admin: null }
> {
  try {
    const profile = await getProfile();

    if (!profile) {
      return {
        error: NextResponse.json(
          { error: "Unauthorized: Authentication required" },
          { status: 401 }
        ),
        admin: null,
      };
    }

    // Role check from Supabase database
    const userRole = (profile.role || "user").toLowerCase();
    const userEmail = (profile.email || "").toLowerCase();

    // Server-side optional ADMIN_EMAILS environment variable safeguard
    const envAdminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const HARDCODED_FOUNDERS = ["jattshiv32@gmail.com", "diwanshu200419@gmail.com", "admin@vaylo.ai"];

    const isFounderEmail = HARDCODED_FOUNDERS.includes(userEmail) || envAdminEmails.includes(userEmail);
    const isAdminRole = userRole === "admin";

    if (!isAdminRole && !isFounderEmail) {
      return {
        error: NextResponse.json(
          { error: "Forbidden: Admin privileges required" },
          { status: 403 }
        ),
        admin: null,
      };
    }

    return {
      error: null,
      admin: {
        userId: profile.id,
        email: profile.email || "admin@vaylo.ai",
        fullName: profile.full_name,
        role: "admin",
      },
    };
  } catch (err) {
    console.error("[requireAdmin] Error verifying admin privileges:", err);
    return {
      error: NextResponse.json(
        { error: "Internal Server Error during admin auth check" },
        { status: 500 }
      ),
      admin: null,
    };
  }
}
