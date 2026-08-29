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
  htmlCode: z.string().min(100),
  subdomain: z.string().optional(),
  customDomain: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Tier-Gating Check
    if (!canDeployPortfolio(profile)) {
      return NextResponse.json(
        {
          error: "upgrade_required",
          message: "Live subdomain deployment requires Premium or Career Pack plan. Free/Pro tiers support preview-only mode.",
        },
        { status: 403 }
      );
    }

    const body = await req.json().catch(() => ({}));
    const parse = DeploySchema.safeParse(body);
    if (!parse.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { htmlCode, customDomain } = parse.data;

    // Derived unique subdomain slug from email or name
    const emailPrefix = (profile.email || profile.id).split("@")[0];
    const subdomainSlug = (parse.data.subdomain || emailPrefix)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-");

    // Career Pack Custom Domain Verification
    const plan = getEffectivePlan(profile);
    const isCareerPack = plan === "career_pack";
    let customDomainStatus: string | null = null;
    let customDomainUrl: string | null = null;

    if (customDomain && customDomain.trim()) {
      if (!isCareerPack) {
        return NextResponse.json(
          {
            error: "career_pack_required",
            message: "Custom domain connection (e.g. yourname.dev) requires the Career Pack tier.",
          },
          { status: 403 }
        );
      }
      const cleanCustomDomain = customDomain.toLowerCase().trim().replace(/^https?:\/\//, "");
      customDomainUrl = `https://${cleanCustomDomain}`;
      customDomainStatus = "pending_cname_configuration";
    }

    return NextResponse.json({
      success: true,
      subdomain: subdomainSlug,
      customDomainUrl,
      customDomainStatus,
      deployMethod: "netlify_drop_or_self_host",
      instructions: "Deploy in 10 seconds via Netlify Drop or your preferred hosting provider.",
      dnsDocumentation: {
        customDomainCname: "Point your custom domain DNS CNAME to your hosting provider endpoint (e.g. Netlify/Vercel/Cloudflare).",
      },
    });
  } catch (error: any) {
    console.error("[/api/portfolio/deploy] error:", error);
    return NextResponse.json({ error: error.message || "Failed to process deployment request" }, { status: 500 });
  }
}
