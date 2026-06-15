import type { Plan } from "@/types";

// Amounts are in paise-equivalent rupees (whole rupees here, unlike Razorpay's paise)
const PLAN_AMOUNTS: Record<Exclude<Plan, "free">, number> = {
  pro: 199,
  premium: 399,
};

export function getPlanAmount(plan: Exclude<Plan, "free">): number {
  return PLAN_AMOUNTS[plan];
}

/**
 * Your UPI ID (VPA) and display name.
 * Set these in .env.local:
 *   NEXT_PUBLIC_UPI_ID=yourname@upi
 *   NEXT_PUBLIC_UPI_NAME=Vaylo AI
 */
export function getUpiConfig() {
  return {
    upiId: process.env.NEXT_PUBLIC_UPI_ID || "",
    name: process.env.NEXT_PUBLIC_UPI_NAME || "Vaylo AI",
  };
}

/**
 * Generates a unique transaction reference for a payment.
 * This is embedded in the UPI link (tr param) so you can match
 * incoming payments in your bank/UPI app to the order in your DB.
 */
export function generateUpiRef(userId: string): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `VAYLO${Date.now().toString(36).toUpperCase()}${rand}`;
}

/**
 * Builds a UPI deep link (upi://pay...) that opens any UPI app
 * (Google Pay, PhonePe, Paytm, etc.) with the amount pre-filled.
 */
export function buildUpiLink({
  amount,
  ref,
  note,
}: {
  amount: number;
  ref: string;
  note: string;
}): string {
  const { upiId, name } = getUpiConfig();
  const params = new URLSearchParams({
    pa: upiId, // payee VPA
    pn: name, // payee name
    tr: ref, // transaction reference
    tn: note, // transaction note
    am: amount.toFixed(2), // amount
    cu: "INR",
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * Returns a URL to a QR code image (via a free QR-code rendering API)
 * that encodes the given UPI link. Scanning it with any UPI app
 * (Google Pay, PhonePe, etc.) pre-fills the payment.
 */
export function buildUpiQrUrl(upiLink: string): string {
  const encoded = encodeURIComponent(upiLink);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;
}
