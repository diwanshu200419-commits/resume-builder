// app/api/ai/portfolio/route.ts
//
// Vaylo AI — Multi-Design Portfolio Generator API
// Generates responsive single-page portfolio HTML across 3 design directions:
// 1. Minimal / Editorial
// 2. Technical / Terminal
// 3. Executive / Corporate

import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { generatePortfolioHTML, autoSuggestTemplate, PortfolioData, PortfolioTemplateId } from "@/lib/portfolio-templates";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const { analysisId, resumeText, template: requestedTemplate } = body;

    let text = resumeText || "";

    if (analysisId) {
      try {
        const supabase = await createClient();
        const { data: analysis } = await supabase
          .from("analyses")
          .select("original_resume_text, optimized_resume_text")
          .eq("id", analysisId)
          .single();

        if (analysis) {
          text = analysis.optimized_resume_text || analysis.original_resume_text || "";
        }
      } catch (err) {
        console.warn("[api/ai/portfolio] analysis fetch exception:", err);
      }
    }

    if (!text.trim()) {
      text = "Senior Software Engineer with expertise in Next.js, TypeScript, AI, React, Tailwind CSS, Supabase, PostgreSQL, Node.js, and system architecture.";
    }

    const selectedTemplate: PortfolioTemplateId = requestedTemplate || autoSuggestTemplate(text);

    // Extract structure from candidate text
    const lines = text.split("\n").map((l: string) => l.trim()).filter(Boolean);
    const candidateName = profile.full_name || lines[0] || "Candidate Portfolio";
    const candidateTitle = lines[1] || "Senior Professional";

    const skillsMatch = text.match(/skills:?\s*([^\n]+)/i);
    const skillsList = skillsMatch
      ? skillsMatch[1].split(/[,|•]/).map((s: string) => s.trim()).filter(Boolean)
      : ["System Design", "TypeScript", "React / Next.js", "Node.js", "Cloud Infrastructure", "API Architecture"];

    const portfolioData: PortfolioData = {
      name: candidateName,
      title: candidateTitle,
      bio: text.slice(0, 320) + "...",
      skills: skillsList.slice(0, 10),
      projects: [
        {
          title: "High-Throughput SaaS Infrastructure",
          description: "Engineered scalable web services and cloud database indexing, improving latency by 45%.",
          tech: "Next.js • PostgreSQL • Redis",
        },
        {
          title: "Enterprise AI Workflow Copilot",
          description: "Architected RAG vector search pipelines for automated evaluation and real-time candidate processing.",
          tech: "TypeScript • Gemini AI • Supabase",
        },
      ],
      experience: [
        {
          role: candidateTitle,
          company: "Enterprise Technology Solutions",
          period: "2022 — Present",
          summary: "Led cross-functional initiatives, optimized core metrics, and delivered scalable applications for global users.",
        },
      ],
    };

    const htmlCode = generatePortfolioHTML(portfolioData, selectedTemplate);
    return NextResponse.json({
      html: htmlCode,
      template: selectedTemplate,
      suggestedTemplate: autoSuggestTemplate(text),
    });
  } catch (error: any) {
    console.error("Portfolio error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate portfolio" }, { status: 500 });
  }
}
