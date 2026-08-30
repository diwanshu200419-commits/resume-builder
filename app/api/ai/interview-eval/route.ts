import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canAccessSTARVoice } from "@/lib/auth";
import { matchEvidence } from "@/lib/evidence-matching";
import { logAIUsage } from "@/lib/logging/ai-usage";

export const dynamic = "force-dynamic";

const FILLER_WORDS = [
  "um", "uh", "like", "you know", "basically", "literally", "sort of", "kind of", "actually", "honestly", "i mean"
];

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let user: any = null;
  let plan = "free";

  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    user = authUser;

    if (!user) {
      await logAIUsage({
        userId: null,
        route: "/api/ai/interview-eval",
        requestType: "interview_eval",
        planAtTime: "unauthenticated",
        status: "blocked_auth",
        httpStatus: 401,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    plan = profile?.plan || "free";

    const body = await request.json().catch(() => ({}));
    const { questionId, questionText, transcript, modelAnswerKeywords = [], questionCount = 1 } = body;

    // Server-side Plan Entitlement Gating Check
    if (plan === "free" && questionCount > 1) {
      await logAIUsage({
        userId: user.id,
        route: "/api/ai/interview-eval",
        requestType: "interview_eval",
        planAtTime: plan,
        status: "blocked_plan",
        httpStatus: 403,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({
        error: "Free tier users are limited to 1 question per mock session. Upgrade to Premium for full FAANG question bank & STAR voice feedback.",
        limitReached: true,
      }, { status: 403 });
    }

    if (plan === "pro" && questionCount > 3) {
      await logAIUsage({
        userId: user.id,
        route: "/api/ai/interview-eval",
        requestType: "interview_eval",
        planAtTime: plan,
        status: "blocked_plan",
        httpStatus: 403,
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({
        error: "Pro plan allows up to 3 questions per session. Upgrade to Premium for unlimited questions & AI follow-up drills.",
        limitReached: true,
      }, { status: 403 });
    }

    if (!transcript || transcript.trim().length < 10) {
      await logAIUsage({
        userId: user.id,
        route: "/api/ai/interview-eval",
        requestType: "interview_eval",
        planAtTime: plan,
        status: "error",
        httpStatus: 400,
        errorMessage: "Transcript too brief",
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({
        error: "Transcript is too brief. Please speak your answer clearly for at least 15 seconds.",
      }, { status: 400 });
    }

    const cleanTranscript = transcript.trim();
    const lowerTranscript = cleanTranscript.toLowerCase();

    // 1. Calculate Filler Word Density
    let fillerCount = 0;
    const words = lowerTranscript.match(/\b[a-z']+\b/g) || [];
    const totalWords = Math.max(1, words.length);

    FILLER_WORDS.forEach((filler) => {
      const regex = new RegExp(`\\b${filler}\\b`, "g");
      const matches = lowerTranscript.match(regex);
      if (matches) fillerCount += matches.length;
    });

    const fillerDensityPct = Number(((fillerCount / totalWords) * 100).toFixed(1));

    // 2. Perform Evidence-Based Keyword Matching
    const evidenceResult = matchEvidence(cleanTranscript, modelAnswerKeywords);

    // 3. Analyze STAR Components Heuristically
    const hasSituation = /(situation|when|context|background|project was|company was|team needed|problem was|at my previous)/i.test(lowerTranscript);
    const hasTask = /(task|goal|objective|responsible for|needed to|had to|assigned|my role)/i.test(lowerTranscript);
    const hasAction = /(action|built|designed|implemented|coded|architected|led|developed|created|executed|spearheaded|refactored|deployed)/i.test(lowerTranscript);
    const hasResult = /(result|outcome|impact|increased|reduced|improved|boosted|saved|by \d+%|latency|revenue|metric)/i.test(lowerTranscript);

    const starComponents = {
      situation: hasSituation,
      task: hasTask,
      action: hasAction,
      result: hasResult,
    };

    // Calculate STAR Score (out of 40)
    let starScore = 0;
    if (hasSituation) starScore += 10;
    if (hasTask) starScore += 10;
    if (hasAction) starScore += 10;
    if (hasResult) starScore += 10;

    // Calculate Specificity Score from Evidence Keyword Matching (out of 30)
    const specificityScore = Math.round((evidenceResult.score / 100) * 30);

    // Calculate Pacing Score (out of 15)
    const pacingScore = totalWords >= 40 && totalWords <= 200 ? 15 : totalWords < 20 ? 5 : 10;

    // Calculate Clarity Score (out of 15, penalizing fillers)
    const clarityScore = Math.max(0, 15 - fillerCount * 2);

    const overallScore = Math.min(100, Math.max(20, starScore + specificityScore + pacingScore + clarityScore));

    // Construct Actionable Feedback
    const feedbackPoints: string[] = [];
    if (!hasSituation) feedbackPoints.push("Set clear context early: explicitly mention the company or project situation.");
    if (!hasAction) feedbackPoints.push("Highlight your individual contribution: focus on what YOU specifically built or led.");
    if (!hasResult) feedbackPoints.push("Quantify your impact: end with measurable outcomes (e.g. '% metric gain' or 'latency reduction').");
    if (evidenceResult.missingKeywords.length > 0) {
      feedbackPoints.push(`Include domain keywords: Incorporate key terms like '${evidenceResult.missingKeywords.slice(0, 3).join("', '")}' to boost specificity.`);
    }
    if (fillerCount > 3) feedbackPoints.push(`Reduce vocal fillers: ${fillerCount} filler word(s) detected (${fillerDensityPct}% density). Pause silently instead of using 'um' or 'like'.`);

    if (feedbackPoints.length === 0) {
      feedbackPoints.push("Strong answer structure! Clear STAR progression and measurable results delivered.");
    }

    // Generate Dynamic Follow-Up Question
    const aiFollowUp = `Follow-up Drill: Based on your experience with ${cleanTranscript.slice(0, 40)}..., how would you scale this solution if team size doubled?`;

    await logAIUsage({
      userId: user.id,
      route: "/api/ai/interview-eval",
      requestType: "interview_eval",
      planAtTime: plan,
      status: "success",
      httpStatus: 200,
      geminiModel: "star-rubric-engine",
      estimatedTokens: 0,
      latencyMs: Date.now() - startTime,
    });

    return NextResponse.json({
      success: true,
      score: overallScore,
      totalWords,
      fillerCount,
      fillerDensityPct,
      evidenceResult,
      starComponents,
      feedbackPoints,
      aiFollowUp,
      canAccessFullAnalytics: canAccessSTARVoice(plan),
    });
  } catch (error: any) {
    console.error("[Interview Eval Error]:", error);
    await logAIUsage({
      userId: user?.id || null,
      route: "/api/ai/interview-eval",
      requestType: "interview_eval",
      planAtTime: plan || "unknown",
      status: "error",
      httpStatus: 500,
      errorMessage: error?.message || "Internal error",
      latencyMs: Date.now() - startTime,
    });
    return NextResponse.json({ error: "Failed to evaluate spoken answer" }, { status: 500 });
  }
}
