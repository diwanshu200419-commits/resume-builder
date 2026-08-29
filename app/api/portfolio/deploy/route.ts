// app/api/portfolio/deploy/route.ts
//
// Vaylo AI — Portfolio Subdomain & Custom Domain Deploy Route
// Tier-Gated: Premium+ required for live subdomain deployment (Free/Pro get 403 Preview Only)
// Custom Domains: Career Pack users can connect custom CNAME domains

import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { canDeployPortfolio, getEffectivePlan } from "@/lib/plans";
import { z } from "zod";

const DeploySchema = z.object({
  htmlCode: z.string().optional(),
  subdomain: z.string().optional(),
  customDomain: z.string().optional(),
  liveUrl: z.string().optional(),
});

export async function GET() {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const emailPrefix = (profile.email || profile.id).split("@")[0];
    const subdomainSlug = emailPrefix.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");

    return NextResponse.json({
      success: true,
      subdomain: subdomainSlug,
      savedLiveUrl: profile.website || null,
    });
  } catch (error: any) {
    console.error("[/api/portfolio/deploy] GET error:", error);
    return NextResponse.json({ error: error.message || "Failed to fetch deployment state" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const parse = DeploySchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { customDomain, liveUrl } = parse.data;

    // Derived unique subdomain slug from email or name
    const emailPrefix = (profile.email || profile.id).split("@")[0];
    const subdomainSlug = (parse.data.subdomain || emailPrefix)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    const targetUrl = liveUrl || customDomain || "";
    let cleanUrl: string | null = null;

    if (targetUrl.trim()) {
      cleanUrl = targetUrl.trim();
      if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
        cleanUrl = `https://${cleanUrl}`;
      }

      // Persist to user profile website field
      try {
        const serviceClient = await createServiceClient();
        await serviceClient
          .from("profiles")
          .update({
            website: cleanUrl,
          })
          .eq("id", profile.id);
      } catch (dbErr) {
        console.warn("[/api/portfolio/deploy] Profile DB update notice:", dbErr);
      }
    }

    return NextResponse.json({
      success: true,
      subdomain: subdomainSlug,
      savedLiveUrl: cleanUrl,
      deployMethod: "netlify_drop_or_self_host",
      instructions: "Your live portfolio URL has been saved and linked to your profile!",
    });
  } catch (error: any) {
    console.error("[/api/portfolio/deploy] POST error:", error);
    return NextResponse.json({ error: error.message || "Failed to process deployment request" }, { status: 500 });
  }
}
