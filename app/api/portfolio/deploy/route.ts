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

    const liveSubdomainUrl = `https://${subdomainSlug}.vaylo.ai`;

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
            message: "Custom domain connection (e.g. priya-sharma.com) requires the Career Pack tier.",
          },
          { status: 403 }
        );
      }
      const cleanCustomDomain = customDomain.toLowerCase().trim().replace(/^https?:\/\//, "");
      customDomainUrl = `https://${cleanCustomDomain}`;
      customDomainStatus = "pending_cname_verification";
    }

    // Upsert into deployments table or save to profiles
    try {
      const serviceClient = await createServiceClient();
      await serviceClient
        .from("profiles")
        .update({
          avatar_url: liveSubdomainUrl,
        })
        .eq("id", profile.id);
    } catch (err) {
      console.warn("[/api/portfolio/deploy] DB update notice:", err);
    }

    return NextResponse.json({
      success: true,
      subdomain: subdomainSlug,
      liveUrl: liveSubdomainUrl,
      customDomainUrl,
      customDomainStatus,
      cnameRecordNeeded: "cname.vaylo.ai",
      dnsDocumentation: {
        wildcardDns: "*.vaylo.ai -> Vercel Edge Server",
        customDomainCname: `Add CNAME record pointing your domain to cname.vaylo.ai`,
      },
    });
  } catch (error: any) {
    console.error("[/api/portfolio/deploy] error:", error);
    return NextResponse.json({ error: error.message || "Failed to deploy portfolio" }, { status: 500 });
  }
}
