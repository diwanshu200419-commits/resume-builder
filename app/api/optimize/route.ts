import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { canAccessCoverLetter, canAccessBrandingStudio, canAutoFix } from "@/lib/plans";
import {
  generateCoverLetter,
  generateInterviewPrep,
  generateLinkedInSuggestions,
  optimizeBulletPoints,
} from "@/lib/gemini";
import { scoreCoverLetter } from "@/lib/ai/cover-letter/cover-letter-score";
import { logAIUsage } from "@/lib/logging/ai-usage";

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let profile: any = null;
  let requestType = "unknown";

  try {
    profile = await getProfile();
    const body = await request.json().catch(() => ({}));
    const { analysisId, type, text } = body;
    requestType = type || "unknown";

    const planAtTime = profile?.plan || (profile ? "free" : "unauthenticated");

    // type=improve — AI Bullet Rewriter — Pro+ (canAutoFix)
    if (type === "improve" && text) {
      if (!profile || !canAutoFix(profile)) {
        const httpStatus = profile ? 403 : 401;
        await logAIUsage({
          userId: profile?.id || null,
          route: "/api/optimize",
          requestType: "improve",
          planAtTime,
          status: profile ? "blocked_plan" : "blocked_auth",
          httpStatus,
          latencyMs: Date.now() - startTime,
        });
        return NextResponse.json(
          { error: "Auto-Fix Bullet Rewriter requires a Pro or higher plan." },
          { status: httpStatus }
        );
      }
      try {
        const optimizedText = await optimizeBulletPoints(text);
        await logAIUsage({
          userId: profile.id,
          route: "/api/optimize",
          requestType: "improve",
          planAtTime,
          status: "success",
          httpStatus: 200,
          geminiModel: "gemini-2.0-flash",
          estimatedTokens: 250,
          latencyMs: Date.now() - startTime,
        });
        return NextResponse.json({ optimizedText });
      } catch {
        const fallbackText = text
          .replace(/worked on/gi, "Spearheaded development of")
          .replace(/helped with/gi, "Architected and optimized")
          .replace(/responsible for/gi, "Delivered scalable solution for");
        await logAIUsage({
          userId: profile.id,
          route: "/api/optimize",
          requestType: "improve",
          planAtTime,
          status: "success",
          httpStatus: 200,
          geminiModel: "rule-based-fallback",
          estimatedTokens: 50,
          latencyMs: Date.now() - startTime,
        });
        return NextResponse.json({ optimizedText: fallbackText });
      }
    }

    // All other types require authentication
    if (!profile) {
      await logAIUsage({
        userId: null,
        route: "/api/optimize",
        requestType,
        planAtTime: "unauthenticated",
        status: "blocked_auth",
        httpStatus: 401,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json(
        { error: "Authentication required. Please log in to use this feature." },
        { status: 401 }
      );
    }

    // type=cover-letter — Plan Gated: Pro+
    if (type === "cover-letter" && !canAccessCoverLetter(profile)) {
      await logAIUsage({
        userId: profile.id,
        route: "/api/optimize",
        requestType: "cover-letter",
        planAtTime,
        status: "blocked_plan",
        httpStatus: 403,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json(
        {
          error: "Upgrade required",
          requiredPlan: "pro",
          message: "AI Cover Letter Generator requires a Pro or Premium plan. Free tier: 0 cover letters.",
        },
        { status: 403 }
      );
    }

    // type=linkedin — Plan Gated: Pro+
    if (type === "linkedin" && !canAccessBrandingStudio(profile)) {
      await logAIUsage({
        userId: profile.id,
        route: "/api/optimize",
        requestType: "linkedin",
        planAtTime,
        status: "blocked_plan",
        httpStatus: 403,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json(
        {
          error: "Upgrade required",
          requiredPlan: "pro",
          message: "LinkedIn Profile Optimizer requires a Pro or Premium plan.",
        },
        { status: 403 }
      );
    }

    // type=interview — Plan Gated: Premium+
    if (type === "interview") {
      const plan = (profile.plan || "free").toLowerCase();
      const isPremiumPlus = plan === "premium" || plan === "career_pack";
      if (!isPremiumPlus) {
        await logAIUsage({
          userId: profile.id,
          route: "/api/optimize",
          requestType: "interview",
          planAtTime,
          status: "blocked_plan",
          httpStatus: 403,
          latencyMs: Date.now() - startTime,
        });
        return NextResponse.json(
          {
            error: "Upgrade required",
            requiredPlan: "premium",
            message: "AI Interview Prep requires a Premium or Career Pack plan.",
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
          .eq("user_id", profile.id)
          .single();
        analysis = data;
      } catch {}

      if (!analysis) {
        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_APP_URL ||
            (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");
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
        optimized_resume_text:
          "Results-driven AI/ML Engineer with experience architecting high-throughput LLM pipelines and RAG vector search microservices.",
        job_description:
          "Senior AI/ML Engineer responsible for LLM optimization, PyTorch, and FastAPI microservices.",
      };
    }

    const resumeText =
      analysis.optimized_resume_text || analysis.original_resume_text || "Experienced Developer";
    const jobDescription = analysis.job_description || "Software Engineer role";

    if (type === "cover-letter") {
      let coverLetter: string;
      let usedModel = "gemini-2.0-flash";
      try {
        coverLetter = await generateCoverLetter(resumeText, jobDescription);
      } catch {
        usedModel = "rule-based-fallback";
        coverLetter = `Dear Hiring Manager,\n\nI am writing to express my strong interest in the ${
          analysis.job_title || "Engineering"
        } position at your organization. With a solid foundation in software development and AI engineering, I am confident in my ability to contribute immediately.\n\nSincerely,\nCandidate`;
      }

      const qualityScore = scoreCoverLetter({
        coverLetterText: coverLetter,
        jobTitle: analysis.job_title,
        candidateSkills: Array.isArray(analysis.found_keywords) ? analysis.found_keywords : [],
        resumeText,
      });

      await logAIUsage({
        userId: profile.id,
        route: "/api/optimize",
        requestType: "cover-letter",
        planAtTime,
        status: "success",
        httpStatus: 200,
        geminiModel: usedModel,
        estimatedTokens: 650,
        latencyMs: Date.now() - startTime,
      });

      return NextResponse.json({ coverLetter, qualityScore });
    }

    if (type === "interview") {
      let interviewQuestions: any;
      let usedModel = "gemini-2.0-flash";
      try {
        interviewQuestions = await generateInterviewPrep(resumeText, jobDescription);
      } catch {
        usedModel = "rule-based-fallback";
        interviewQuestions = {
          hr_questions: [
            {
              question: "Tell me about yourself and your experience in tech.",
              suggested_answer:
                "Highlight your background in software engineering, core accomplishments, and why you are excited about this role.",
              tip: "Keep your response focused on recent achievements within 2 minutes.",
            },
            {
              question: "Why do you want to join our engineering team?",
              suggested_answer:
                "Connect your career goals with the company's product vision and technical scale.",
              tip: "Mention specific products or features built by the company.",
            },
          ],
          technical_questions: [
            {
              question: "How do you optimize API latency and database queries in modern web apps?",
              suggested_answer:
                "Discuss Redis caching, database indexing, async non-blocking execution, and CDN edge caching.",
              tip: "Use concrete metrics from past projects.",
            },
            {
              question: "Describe your experience with system architecture and microservices.",
              suggested_answer:
                "Detail how you decoupled monolithic services into scalable APIs using Docker and CI/CD pipelines.",
              tip: "Emphasize fault tolerance and monitoring.",
            },
          ],
          behavioral_questions: [
            {
              question:
                "Describe a high-pressure situation where a production deployment encountered a critical issue. How did you resolve it?",
              suggested_answer:
                "SITUATION: Major traffic spike led to database timeouts.\nTASK: Restore system availability within 15 minutes.\nACTION: Rolled back release, applied index optimization, and scaled read replicas.\nRESULT: Restored 100% uptime with sub-50ms query speeds.",
              tip: "Use the STAR method clearly: Situation, Task, Action, Result.",
            },
          ],
        };
      }

      await logAIUsage({
        userId: profile.id,
        route: "/api/optimize",
        requestType: "interview",
        planAtTime,
        status: "success",
        httpStatus: 200,
        geminiModel: usedModel,
        estimatedTokens: 800,
        latencyMs: Date.now() - startTime,
      });

      return NextResponse.json({ interviewQuestions });
    }

    if (type === "linkedin") {
      let linkedinSuggestions: any;
      let usedModel = "gemini-2.0-flash";
      try {
        linkedinSuggestions = await generateLinkedInSuggestions(
          resumeText,
          analysis.job_title || "Target Role"
        );
      } catch {
        usedModel = "rule-based-fallback";
        linkedinSuggestions = {
          headline: "AI & Full-Stack Software Engineer | Building High-Scale Systems",
          about: "Passionate software engineer building resilient web applications and AI tools.",
          skills: ["React", "TypeScript", "Next.js", "Python", "Supabase"],
        };
      }

      await logAIUsage({
        userId: profile.id,
        route: "/api/optimize",
        requestType: "linkedin",
        planAtTime,
        status: "success",
        httpStatus: 200,
        geminiModel: usedModel,
        estimatedTokens: 400,
        latencyMs: Date.now() - startTime,
      });

      return NextResponse.json({ linkedinSuggestions });
    }

    await logAIUsage({
      userId: profile.id,
      route: "/api/optimize",
      requestType,
      planAtTime,
      status: "error",
      httpStatus: 400,
      errorMessage: "Invalid type",
      latencyMs: Date.now() - startTime,
    });

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    console.error("Error in optimize route:", error);
    await logAIUsage({
      userId: profile?.id || null,
      route: "/api/optimize",
      requestType,
      planAtTime: profile?.plan || "unknown",
      status: "error",
      httpStatus: 500,
      errorMessage: error?.message || "Internal error",
      latencyMs: Date.now() - startTime,
    });
    return NextResponse.json({ error: error?.message || "Something went wrong" }, { status: 500 });
  }
}
