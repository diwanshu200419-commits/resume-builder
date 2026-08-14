import type { Plan } from "@/types";

// Amounts are in paise-equivalent rupees (whole rupees here)
const PLAN_AMOUNTS: Record<string, number> = {
  pro: 99,
  premium: 299,
  career: 499,
  "career-pack": 499,
  career_pack: 499,
};

export function getPlanAmount(plan: Exclude<Plan, "free">): number {
  return PLAN_AMOUNTS[plan] || 99;
}

/**
 * Your UPI ID (VPA) and display name.
 * Set these in .env.local:
 *   NEXT_PUBLIC_UPI_ID=jattshiv32@okaxis
 *   NEXT_PUBLIC_UPI_NAME=DIWANSHU
 */
export function getUpiConfig() {
  return {
    upiId: process.env.NEXT_PUBLIC_UPI_ID || "jattshiv32@okaxis",
    name: process.env.NEXT_PUBLIC_UPI_NAME || "DIWANSHU",
  };
}

/**
 * Generates a unique transaction reference for a payment.
 */
export function generateUpiRef(userId: string): string {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `VAYLO${Date.now().toString(36).toUpperCase()}${rand}`;
}

/**
 * Builds a clean, NPCI-compliant UPI deep link (upi://pay...) that opens
 * any UPI app (Google Pay, PhonePe, Paytm, BHIM) cleanly without triggering
 * P2P bank limit or special-character errors.
 */
export function buildUpiLink({
  amount,
  ref,
  note,
}: {
  amount: number;
  ref?: string;
  note?: string;
}): string {
  const { upiId, name } = getUpiConfig();
  const targetUpi = upiId || "jattshiv32@okaxis";

  // Clean note string to prevent PNB/GPay bank rejection of email special characters like '+' or '@'
  const cleanNote = (note || `Vaylo AI ${amount}`)
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .trim()
    .slice(0, 20);

  const params = new URLSearchParams({
    pa: targetUpi,
    pn: name || "DIWANSHU",
    am: amount.toString(),
    cu: "INR",
    tn: cleanNote || `Vaylo AI ${amount}`,
  });

  const queryString = params.toString().replace(/\+/g, "%20");
  return `upi://pay?${queryString}`;
}

/**
 * Returns a URL to a QR code image encoding the clean UPI link.
 */
export function buildUpiQrUrl(upiLink: string): string {
  const encoded = encodeURIComponent(upiLink);
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encoded}`;
}
