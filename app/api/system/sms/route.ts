import { NextRequest, NextResponse } from "next/server";
import { sendSmsOtp } from "@/lib/sms";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "online",
    service: "Vaylo AI Mobile SMS Gateway API",
    method: "POST",
    endpoint: "/api/system/sms",
    description: "Send HTTP POST with JSON body { phone: '9876543210' } to dispatch 6-digit OTP SMS.",
  });
}

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();
    if (!phone || phone.length < 10) {
      return NextResponse.json({ error: "Invalid mobile phone number" }, { status: 400 });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const result = await sendSmsOtp(phone, otpCode);

    return NextResponse.json({
      success: true,
      otp: otpCode,
      message: result.message,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to send SMS" }, { status: 500 });
  }
}
