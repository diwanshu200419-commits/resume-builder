// app/api/ai/interview-followup/route.ts
//
// Vaylo AI — Conversational Follow-Up Decision API
// Evaluates candidate turns and triggers targeted probing questions when answers lack depth

import { NextRequest, NextResponse } from "next/server";
import { decideNextTurn, InterviewTurn } from "@/lib/interview/conversation-engine";
import { getPersona } from "@/lib/interview/voice-personas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { currentTurn, remainingQuestions, personaId } = body as {
      currentTurn: InterviewTurn;
      remainingQuestions: Array<{ id: string; type: string; question: string; rubric?: any }>;
      personaId?: string;
    };

    if (!currentTurn || !currentTurn.question) {
      return NextResponse.json({ error: "currentTurn with question is required." }, { status: 400 });
    }

    const persona = getPersona(personaId);
    const decision = await decideNextTurn(currentTurn, remainingQuestions || [], persona.name);

    return NextResponse.json(decision);
  } catch (error: any) {
    console.error("[interview-followup API Error]:", error);
    // Fallback: gracefully advance to next question
    return NextResponse.json({
      action: "next_question",
      reason: "Error deciding follow-up, advancing to next question.",
    });
  }
}
