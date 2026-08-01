import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { generateResumePDF, generateCoverLetterPDF } from "@/lib/generate-pdf";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    const body = await request.json().catch(() => ({}));
    const { analysisId, jobTitle, type } = body || {};

    let analysis: any = null;

    if (analysisId) {
      try {
        const supabase = await createClient();
        const { data, error } = await supabase
          .from("analyses")
          .select("*")
          .eq("id", analysisId)
          .single();
        if (error) console.warn("[api/download/pdf] DB fetch warning:", error.message);
        analysis = data;
      } catch (err) {
        console.warn("[api/download/pdf] DB fetch exception:", err);
      }

      if (!analysis) {
        try {
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
          const res = await fetch(`${baseUrl}/api/analyze?id=${analysisId}`, { cache: "no-store" });
          if (res.ok) {
            const json = await res.json();
            analysis = json.analysis;
          }
        } catch (err) {
          console.warn("[api/download/pdf] API fetch fallback exception:", err);
        }
      }
    }

    if (!analysis) {
      analysis = {
        job_title: jobTitle || "Software Engineer",
        optimized_resume_text: `diwanshu sharma
Software Engineer & AI Specialist
diwanshu2004199@gmail.com | github.com/diwanshu200419-commits

SUMMARY
Results-driven AI/ML Engineer with experience architecting high-throughput LLM pipelines and modern web applications.

EXPERIENCE
Lead AI Engineer — Tech Corp (2022 - Present)
• Architected RAG retrieval microservices reducing search latency by 45%.
• Spearheaded full-stack Next.js and Supabase integration.

EDUCATION & SKILLS
B.Tech Computer Science | Skills: TypeScript, React, Next.js, Python, Supabase, PostgreSQL`,
      };
    }

    const title = jobTitle || analysis.job_title || "Resume";
    const name = profile?.full_name?.split(" ")[0] || "VayloAI";
    const filename = `${name}-${title.replace(/\s+/g, "-")}-Resume.pdf`;

    let buffer: Buffer;
    if (type === "cover-letter") {
      const content = analysis.cover_letter || `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${title} position. With a proven track record in software engineering and AI implementation, I am confident in my ability to deliver value.\n\nSincerely,\n${name}`;
      buffer = await generateCoverLetterPDF(content, title);
    } else {
      const content = analysis.optimized_resume_text || analysis.original_resume_text;
      buffer = await generateResumePDF(content, filename);
    }

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error: any) {
    console.error("PDF download error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
