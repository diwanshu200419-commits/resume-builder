// app/api/ai/interview-followup/route.ts
//
// Vaylo AI — Conversational Follow-Up Decision API
// Evaluates candidate turns and triggers targeted probing questions when answers lack depth

import { NextRequest, NextResponse } from "next/server";
import { decideNextTurn, InterviewTurn } from "@/lib/interview/conversation-engine";
import { getPersona } from "@/lib/interview/voice-personas";
import { getProfile } from "@/lib/auth";
import { logAIUsage } from "@/lib/logging/ai-usage";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let profile: any = null;

  try {
    profile = await getProfile();
    const planAtTime = profile?.plan || (profile ? "free" : "unauthenticated");

    const body = await req.json().catch(() => ({}));
    const { currentTurn, remainingQuestions, personaId } = body as {
      currentTurn: InterviewTurn;
      remainingQuestions: Array<{ id: string; type: string; question: string; rubric?: any }>;
      personaId?: string;
    };

    if (!currentTurn || !currentTurn.question) {
      await logAIUsage({
        userId: profile?.id || null,
        route: "/api/ai/interview-followup",
        requestType: "interview_followup",
        planAtTime,
        status: "error",
        httpStatus: 400,
        errorMessage: "currentTurn with question is required",
        latencyMs: Date.now() - startTime,
      });
      return NextResponse.json({ error: "currentTurn with question is required." }, { status: 400 });
    }

    const persona = getPersona(personaId);
    const decision = await decideNextTurn(currentTurn, remainingQuestions || [], persona.name);

    await logAIUsage({
      userId: profile?.id || null,
      route: "/api/ai/interview-followup",
      requestType: "interview_followup",
      planAtTime,
      status: "success",
      httpStatus: 200,
      geminiModel: "gemini-2.0-flash",
      estimatedTokens: 300,
      latencyMs: Date.now() - startTime,
    });

    return NextResponse.json(decision);
  } catch (error: any) {
    console.error("[interview-followup API Error]:", error);
    await logAIUsage({
      userId: profile?.id || null,
      route: "/api/ai/interview-followup",
      requestType: "interview_followup",
      planAtTime: profile?.plan || "unknown",
      status: "error",
      httpStatus: 500,
      errorMessage: error?.message || "Internal error",
      latencyMs: Date.now() - startTime,
    });
    // Fallback: gracefully advance to next question
    return NextResponse.json({
      action: "next_question",
      reason: "Error deciding follow-up, advancing to next question.",
    });
  }
}
