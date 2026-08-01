import { NextRequest, NextResponse } from "next/server";

// Safety rate limiter for Gemini AI routes to prevent runaway API billing abuse
const DAILY_MAX_AI_CALLS = 50;

// In-memory fallback map for offline / fast rate-limiting
const memoryRateMap = new Map<string, { count: number; resetAt: number }>();

export async function checkDailyRateLimit(userId: string): Promise<{ success: boolean; message?: string }> {
  if (!userId) return { success: true };

  const todayWindow = new Date().setHours(0, 0, 0, 0);

  const userMem = memoryRateMap.get(userId);
  if (userMem) {
    if (userMem.resetAt < todayWindow) {
      memoryRateMap.set(userId, { count: 1, resetAt: todayWindow });
    } else if (userMem.count >= DAILY_MAX_AI_CALLS) {
      return {
        success: false,
        message: `Daily AI usage limit reached (${DAILY_MAX_AI_CALLS} calls/day). Please try again tomorrow to protect platform resources.`,
      };
    } else {
      userMem.count += 1;
    }
  } else {
    memoryRateMap.set(userId, { count: 1, resetAt: todayWindow });
  }

  return { success: true };
}

// Next.js Route Handler wrapper used by analyze and public routes: withRateLimit(req, handler)
export async function withRateLimit(
  req: NextRequest,
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
  const rateCheck = await checkDailyRateLimit(ip);
  if (!rateCheck.success) {
    return NextResponse.json({ error: rateCheck.message }, { status: 429 });
  }
  return handler();
}
