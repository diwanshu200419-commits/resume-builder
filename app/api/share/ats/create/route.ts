import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createShareResult } from "@/lib/share-ats";
import { withRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  return withRateLimit(request, async () => {
    try {
      const profile = await getProfile();
      const body = await request.json().catch(() => ({}));

      const score = Number(body.score || 85);
      const keywordScore = body.keywordScore ? Number(body.keywordScore) : undefined;
      const skillsScore = body.skillsScore ? Number(body.skillsScore) : undefined;
      const readabilityScore = body.readabilityScore ? Number(body.readabilityScore) : undefined;
      const formattingScore = body.formattingScore ? Number(body.formattingScore) : undefined;

      const ownerUserId = profile ? profile.id : `anon_${Date.now()}`;

      const shareResult = await createShareResult({
        ownerUserId,
        score,
        keywordScore,
        skillsScore,
        readabilityScore,
        formattingScore,
      });

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.vayloai.online";
      const shareUrl = `${baseUrl}/share/ats/${shareResult.publicId}`;

      return NextResponse.json({
        success: true,
        publicId: shareResult.publicId,
        shareUrl,
        score: shareResult.score,
      });
    } catch (error) {
      console.error("[Share ATS Create Error]:", error);
      return NextResponse.json({ error: "Could not create share result" }, { status: 500 });
    }
  });
}
