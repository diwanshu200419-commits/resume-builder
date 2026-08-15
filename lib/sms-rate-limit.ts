// lib/sms-rate-limit.ts
// Phone-number-based rate limiter for OTP endpoints.
// Prevents SMS bombing and SMS toll fraud (each phone: max 3 OTPs per 10 minutes).

const SMS_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const SMS_MAX_PER_WINDOW = 3;

const smsRateMap = new Map<string, { count: number; windowStart: number }>();

export function checkSmsRateLimit(phone: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const key = String(phone).replace(/\D/g, '').slice(-10); // normalize to last 10 digits

  const entry = smsRateMap.get(key);

  if (!entry || now - entry.windowStart > SMS_WINDOW_MS) {
    // New window
    smsRateMap.set(key, { count: 1, windowStart: now });
    return { allowed: true };
  }

  if (entry.count >= SMS_MAX_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((SMS_WINDOW_MS - (now - entry.windowStart)) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  entry.count += 1;
  return { allowed: true };
}
