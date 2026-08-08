import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { canAccessSTARVoice } from "@/lib/auth";
import { matchEvidence } from "@/lib/evidence-matching";

export const dynamic = "force-dynamic";

const FILLER_WORDS = [
  "um", "uh", "like", "you know", "basically", "literally", "sort of", "kind of", "actually", "honestly", "i mean"
];

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    const plan = profile?.plan || "free";

    const body = await request.json().catch(() => ({}));
    const { questionId, questionText, transcript, modelAnswerKeywords = [], questionCount = 1 } = body;

    // Server-side Plan Entitlement Gating Check
    if (plan === "free" && questionCount > 1) {
      return NextResponse.json({
        error: "Free tier users are limited to 1 question per mock session. Upgrade to Premium for full FAANG question bank & STAR voice feedback.",
        limitReached: true,
      }, { status: 403 });
    }

    if (plan === "pro" && questionCount > 3) {
      return NextResponse.json({
        error: "Pro plan allows up to 3 questions per session. Upgrade to Premium for unlimited questions & AI follow-up drills.",
        limitReached: true,
      }, { status: 403 });
    }

    if (!transcript || transcript.trim().length < 10) {
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

    for (const filler of FILLER_WORDS) {
      const regex = new RegExp(`\\b${filler}\\b`, "gi");
      const matches = lowerTranscript.match(regex);
      if (matches) fillerCount += matches.length;
    }

    const fillerDensityPct = Math.round((fillerCount / totalWords) * 100);

    // 2. STAR Framework Analysis Engine
    const hasSituation = /\b(when|situation|at my previous|project|company|team|client|challenge|problem)\b/i.test(lowerTranscript);
    const hasTask = /\b(task|goal|objective|responsible|assigned|needed to|had to)\b/i.test(lowerTranscript);
    const hasAction = /\b(built|designed|implemented|created|led|developed|automated|scaled|resolved|used|applied)\b/i.test(lowerTranscript);
    const hasResult = /\b(result|outcome|increased|decreased|reduced|improved|saved|achieved|percent|%|delivered)\b/i.test(lowerTranscript);

    const starComponents = {
      situation: hasSituation,
      task: hasTask,
      action: hasAction,
      result: hasResult,
    };

    const starPresentCount = Object.values(starComponents).filter(Boolean).length;
    const starScore = Math.round((starPresentCount / 4) * 35); // 35 pts max for STAR structure

    // 3. Reuse ATS Evidence-Matching for Model Answer Keywords (30 pts max)
    const keywordsToTest = Array.isArray(modelAnswerKeywords) && modelAnswerKeywords.length > 0
      ? modelAnswerKeywords
      : ["impact", "leadership", "results", "solution"];
    
    const evidenceResult = matchEvidence(cleanTranscript, keywordsToTest);
    const specificityScore = Math.round(evidenceResult.matchPercentage * 30);

    // 4. Pacing & Length Score (20 pts max)
    let pacingScore = 20;
    if (totalWords < 40) pacingScore = 8;
    else if (totalWords < 80) pacingScore = 14;
    else if (totalWords > 400) pacingScore = 14; // Too rambling

    // 5. Clarity & Filler Penalty (15 pts max)
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
    return NextResponse.json({ error: "Failed to evaluate spoken answer" }, { status: 500 });
  }
}
