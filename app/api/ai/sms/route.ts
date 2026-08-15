import { NextRequest, NextResponse } from "next/server";
import { sendSmsOtp } from "@/lib/sms";
import { checkSmsRateLimit } from "@/lib/sms-rate-limit";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "Vaylo AI Mobile SMS Gateway API",
    method: "POST",
    endpoint: "/api/ai/sms",
    description: "Send HTTP POST with JSON body { phone: '9876543210' } to dispatch 6-digit OTP SMS.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: "Invalid mobile phone number" }, { status: 400 });
    }

    // SECURITY: Rate limit OTP requests per phone number to prevent SMS bombing
    const rateCheck = checkSmsRateLimit(phone);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: `Too many OTP requests. Please wait ${rateCheck.retryAfterSeconds} seconds before retrying.` },
        { status: 429, headers: { "Retry-After": String(rateCheck.retryAfterSeconds) } }
      );
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const result = await sendSmsOtp(phone, otpCode);

    return NextResponse.json({
      success: true,
      // SECURITY: OTP is delivered via SMS only. Never return it in the HTTP response.
      message: result.message,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to send SMS" }, { status: 500 });
  }
}
