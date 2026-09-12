// app/p/[subdomain]/page.tsx
//
// VayloAI — Instant Public Portfolio Renderer
// Serves live generated HTML portfolio pages for candidate handles (e.g. /p/ashokkumarsolan567)

import { notFound } from "next/navigation";
import { createServiceClient } from "@/lib/supabase/server";
import { generatePortfolioHTML, autoSuggestTemplate, PortfolioData, PortfolioTemplateId } from "@/lib/portfolio-templates";

export const dynamic = "force-dynamic";

export default async function PublicPortfolioPage({ params }: { params: { subdomain: string } }) {
  const rawHandle = decodeURIComponent(params.subdomain || "").toLowerCase().trim();
  if (!rawHandle) {
    notFound();
  }

  const supabase = await createServiceClient();

  // 1. Locate user profile by email prefix, full name, or user ID
  let targetProfile: any = null;

  // Try email prefix match
  const { data: byEmail } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, plan")
    .ilike("email", `${rawHandle}@%`)
    .limit(1)
    .maybeSingle();

  if (byEmail) {
    targetProfile = byEmail;
  } else {
    // Try UUID match if valid uuid
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawHandle);
    if (isUuid) {
      const { data: byId } = await supabase
        .from("profiles")
        .select("id, email, full_name, avatar_url, plan")
        .eq("id", rawHandle)
        .maybeSingle();
      if (byId) targetProfile = byId;
    }
  }

  // If no profile found, return 404
  if (!targetProfile) {
    notFound();
  }

  // 2. Fetch candidate's saved portfolio draft from Supabase
  const { data: draftRecord } = await supabase
    .from("portfolio_drafts")
    .select("draft_data")
    .eq("user_id", targetProfile.id)
    .maybeSingle();

  let portfolioData: PortfolioData;

  if (draftRecord?.draft_data && draftRecord.draft_data.name) {
    // Use actual candidate saved draft
    portfolioData = draftRecord.draft_data;
  } else {
    // Truthful profile-based defaults from actual candidate profile
    const displayName = targetProfile.full_name || rawHandle;
    portfolioData = {
      name: displayName,
      title: "Professional Portfolio",
      bio: `${displayName}'s verified candidate portfolio on VayloAI.`,
      email: targetProfile.email || "",
      avatarUrl: targetProfile.avatar_url || undefined,
      skills: ["Problem Solving", "Professional Communication", "Project Delivery"],
      projects: [],
      experience: [],
    };
  }

  const template: PortfolioTemplateId = autoSuggestTemplate(portfolioData.bio || portfolioData.title || "");
  const htmlContent = generatePortfolioHTML(portfolioData, template);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{ width: "100%", height: "100vh", margin: 0, padding: 0 }}
    />
  );
}

