import { createServiceClient } from "@/lib/supabase/server";

export interface SupportTicket {
  id: string;
  ticket_ref: string;
  user_id: string;
  user_email: string;
  subject: string;
  category: "payment_issue" | "account_issue" | "ats_resume" | "feature_problem" | "refund_request" | "bug_report" | "other";
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  priority: "low" | "normal" | "high" | "urgent";
  plan: string;
  payment_reference?: string | null;
  admin_notes?: string | null;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  messages?: SupportMessage[];
}

export interface SupportMessage {
  id: string;
  ticket_id: string;
  sender_user_id: string | null;
  sender_type: "user" | "admin";
  sender_name: string;
  message: string;
  created_at: string;
}

/**
 * Generates a non-sequential, secure public ticket reference string.
 * Example: VAY-10482
 */
export function generateTicketRef(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `VAY-${num}`;
}

/**
 * Normalizes input string to prevent XSS / script injection attacks.
 */
export function sanitizeInput(input: string, maxLen = 2000): string {
  return String(input || "")
    .trim()
    .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, "")
    .slice(0, maxLen);
}
