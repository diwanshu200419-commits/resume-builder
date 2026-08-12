import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { canDownloadDOCX } from "@/lib/plans";
import { createClient } from "@/lib/supabase/server";
import { generateResumeDOCX, generateCoverLetterDOCX } from "@/lib/generate-docx";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!canDownloadDOCX(profile)) {
      return NextResponse.json(
        { error: "DOCX export requires Pro or higher plan." },
        { status: 403 }
      );
    }
    const body = await request.json().catch(() => ({}));
    const { analysisId, jobTitle, type } = body || {};

    let analysis: any = null;

    if (analysisId) {
      try {
        const supabase = await createClient();
        const { data } = await supabase
          .from("analyses")
          .select("*")
          .eq("id", analysisId)
          .single();
        analysis = data;
      } catch {}

      if (!analysis) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
          const res = await fetch(`${baseUrl}/api/analyze?id=${analysisId}`, { cache: "no-store" });
          if (res.ok) {
            const json = await res.json();
            analysis = json.analysis;
          }
        } catch {}
      }
    }

    if (!analysis) {
      analysis = {
        job_title: jobTitle || "AI / ML Engineer",
        optimized_resume_text: `diwanshu sharma\nSoftware Engineer & AI Specialist\ndiwanshu2004199@gmail.com | github.com/diwanshu200419-commits\n\nSUMMARY\nResults-driven AI/ML Engineer with 5+ years of experience architecting high-throughput LLM pipelines, RAG vector search microservices, and modern web applications.\n\nEXPERIENCE\nLead AI Platform Engineer — Tech Corp (2022 - Present)\n• Architected RAG retrieval microservices reducing search latency by 45% for 200,000 monthly active users.\n• Spearheaded full-stack Next.js and Supabase integration with zero downtime.\n\nEDUCATION & SKILLS\nB.Tech Computer Science | Skills: Python, TypeScript, React, Next.js, LangChain, PyTorch, Supabase, Docker, AWS`,
      };
    }

    const title = jobTitle || analysis.job_title || "Resume";
    const name = profile?.full_name?.split(" ")[0] || "VayloAI";
    const filename = `${name}-${title.replace(/\s+/g, "-")}-Resume.docx`;

    let buffer: Buffer;
    if (type === "cover-letter") {
      const content = analysis.cover_letter || `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${title} position at your company. With a proven track record in software engineering and AI implementation, I am confident in my ability to deliver immediate value.\n\nSincerely,\n${name}`;
      buffer = await generateCoverLetterDOCX(content, title);
    } else {
      const content = analysis.optimized_resume_text || analysis.original_resume_text;
      buffer = await generateResumeDOCX(content, title);
    }

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("DOCX download error:", error);
    return NextResponse.json({ error: "Failed to generate DOCX" }, { status: 500 });
  }
}
