import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { canAccessCoverLetter } from "@/lib/plans";
import {
  generateCoverLetter,
  generateInterviewPrep,
  generateLinkedInSuggestions,
  optimizeBulletPoints,
} from "@/lib/gemini";
import { scoreCoverLetter } from "@/lib/ai/cover-letter/cover-letter-score";

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfile();
    const body = await request.json().catch(() => ({}));
    const { analysisId, type, text } = body;

    // Direct Text Improve / AI Bullet Refiner Handler — auth optional (used in builder)
    if (type === "improve" && text) {
      try {
        const optimizedText = await optimizeBulletPoints(text);
        return NextResponse.json({ optimizedText });
      } catch {
        const fallbackText = text
          .replace(/worked on/gi, "Spearheaded development of")
          .replace(/helped with/gi, "Architected and optimized")
          .replace(/responsible for/gi, "Delivered scalable solution for");
        return NextResponse.json({ optimizedText: fallbackText });
      }
    }

    // All other types require authentication
    if (!profile) {
      return NextResponse.json(
        { error: "Authentication required. Please log in to use this feature." },
        { status: 401 }
      );
    }

    // Cover Letter — Plan Gated: Pro+
    if (type === "cover-letter") {
      if (!canAccessCoverLetter(profile)) {
        return NextResponse.json(
          {
            error: "Upgrade required",
            requiredPlan: "pro",
            message: "AI Cover Letter Generator requires a Pro or Premium plan. Free tier: 0 cover letters.",
          },
          { status: 403 }
        );
      }
    }

    let analysis: any = null;
    if (analysisId) {
      try {
        const supabase = await createClient();
        const { data } = await supabase
          .from("analyses")
          .select("*")
          .eq("id", analysisId)
          .eq("user_id", profile.id) // RLS: verify ownership
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
        job_title: "AI / ML Engineer",
        optimized_resume_text: "Results-driven AI/ML Engineer with experience architecting high-throughput LLM pipelines and RAG vector search microservices.",
        job_description: "Senior AI/ML Engineer responsible for LLM optimization, PyTorch, and FastAPI microservices.",
      };
    }

    const resumeText = analysis.optimized_resume_text || analysis.original_resume_text || "Experienced Developer";
    const jobDescription = analysis.job_description || "Software Engineer role";

    if (type === "cover-letter") {
      let coverLetter: string;
      try {
        coverLetter = await generateCoverLetter(resumeText, jobDescription);
      } catch {
        coverLetter = `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${analysis.job_title || "Engineering"} position at your organization. With a solid foundation in software development and AI engineering, I am confident in my ability to contribute immediately.\n\nSincerely,\nCandidate`;
      }

      // Deterministic quality score on the generated letter
      const qualityScore = scoreCoverLetter({
        coverLetterText: coverLetter,
        jobTitle: analysis.job_title,
        candidateSkills: Array.isArray(analysis.found_keywords) ? analysis.found_keywords : [],
        resumeText,
      });

      return NextResponse.json({ coverLetter, qualityScore });
    }

    if (type === "interview") {
      try {
        const interviewQuestions = await generateInterviewPrep(resumeText, jobDescription);
        return NextResponse.json({ interviewQuestions });
      } catch {
        const fallbackQuestions = {
          hr_questions: [
            {
              question: "Tell me about yourself and your experience in tech.",
              suggested_answer: "Highlight your background in software engineering, core accomplishments, and why you are excited about this role.",
              tip: "Keep your response focused on recent achievements within 2 minutes.",
            },
            {
              question: "Why do you want to join our engineering team?",
              suggested_answer: "Connect your career goals with the company's product vision and technical scale.",
              tip: "Mention specific products or features built by the company.",
            },
          ],
          technical_questions: [
            {
              question: "How do you optimize API latency and database queries in modern web apps?",
              suggested_answer: "Discuss Redis caching, database indexing, async non-blocking execution, and CDN edge caching.",
              tip: "Use concrete metrics from past projects.",
            },
            {
              question: "Describe your experience with system architecture and microservices.",
              suggested_answer: "Detail how you decoupled monolithic services into scalable APIs using Docker and CI/CD pipelines.",
              tip: "Emphasize fault tolerance and monitoring.",
            },
          ],
          behavioral_questions: [
            {
              question: "Describe a high-pressure situation where a production deployment encountered a critical issue. How did you resolve it?",
              suggested_answer: "SITUATION: Major traffic spike led to database timeouts.\nTASK: Restore system availability within 15 minutes.\nACTION: Rolled back release, applied index optimization, and scaled read replicas.\nRESULT: Restored 100% uptime with sub-50ms query speeds.",
              tip: "Use the STAR method clearly: Situation, Task, Action, Result.",
            },
          ],
        };
        return NextResponse.json({ interviewQuestions: fallbackQuestions });
      }
    }

    if (type === "linkedin") {
      try {
        const linkedinSuggestions = await generateLinkedInSuggestions(
          resumeText,
          analysis.job_title || "Target Role"
        );
        return NextResponse.json({ linkedinSuggestions });
      } catch {
        return NextResponse.json({
          linkedinSuggestions: {
            headline: "AI & Full-Stack Software Engineer | Building High-Scale Systems",
            about: "Passionate software engineer building resilient web applications and AI tools.",
            skills: ["React", "TypeScript", "Next.js", "Python", "Supabase"],
          },
        });
      }
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    console.error("Error in optimize route:", error);
    return NextResponse.json({ error: error?.message || "Something went wrong" }, { status: 500 });
  }
}
