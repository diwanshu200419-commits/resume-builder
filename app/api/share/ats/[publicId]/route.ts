import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { getPublicShareResult, revokeShareResult } from "@/lib/share-ats";

export async function GET(
  request: NextRequest,
  { params }: { params: { publicId: string } }
) {
  try {
    const publicId = params.publicId;
    if (!publicId || !publicId.startsWith("ats_")) {
      return NextResponse.json({ error: "Invalid share ID" }, { status: 400 });
    }

    const shareData = await getPublicShareResult(publicId);
    if (!shareData || !shareData.isPublic) {
      return NextResponse.json({ error: "Share result not found or has been revoked" }, { status: 404 });
    }

    return NextResponse.json({ success: true, share: shareData });
  } catch (error) {
    console.error("[Share ATS GET Error]:", error);
    return NextResponse.json({ error: "Failed to fetch share result" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { publicId: string } }
) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const publicId = params.publicId;
    if (!publicId) {
      return NextResponse.json({ error: "Missing publicId" }, { status: 400 });
    }

    await revokeShareResult(publicId, profile.id);
    return NextResponse.json({ success: true, message: "Sharing revoked successfully" });
  } catch (error) {
    console.error("[Share ATS DELETE Error]:", error);
    return NextResponse.json({ error: "Could not revoke sharing" }, { status: 500 });
  }
}
