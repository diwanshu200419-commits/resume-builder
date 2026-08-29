// lib/interview/conversation-engine.ts
//
// Vaylo AI — Conversational Interview Engine
// Manages stateful turns, STAR evaluation, and real-time follow-up probing (max 1 follow-up per question)

import { getModel, withRetryAndTimeout } from "@/lib/gemini";

export interface STAREvaluation {
  score: number; // 0-100
  situation_context_score: number; // 0-25
  task_action_score: number; // 0-50
  result_metrics_score: number; // 0-25
  feedback: string;
  strengths: string[];
  missing_elements: string[];
  filler_words_detected?: string[];
  is_vague_or_incomplete: boolean;
}

export interface InterviewTurn {
  questionId: string;
  questionType: "behavioral" | "technical" | "culture" | "curveball";
  question: string;
  candidateAnswer: string;
  evaluation?: STAREvaluation;
  followUpTriggered: boolean;
  followUpQuestion?: string;
  followUpAnswer?: string;
  followUpEvaluation?: STAREvaluation;
  turnDurationSeconds?: number;
}

export interface NextTurnDecision {
  action: "follow_up" | "next_question" | "complete";
  question?: string;
  questionId?: string;
  questionType?: string;
  reason?: string;
}

/**
 * Fast LLM call to generate ONE targeted, conversational follow-up probing a gap in candidate's answer
 */
export async function generateTargetedFollowUp(
  question: string,
  candidateAnswer: string,
  missingElements: string[],
  personaName: string = "Josh"
): Promise<string> {
  const missingText = missingElements.join(", ") || "specific metrics or concrete actions";

  try {
    const aiResult = await withRetryAndTimeout(async () => {
      const prompt = `You are ${personaName}, an interviewer conducting a realistic professional interview.
The candidate just responded to this interview question:
Question: "${question}"
Candidate's Answer: "${candidateAnswer}"

Identified Gap in Answer: ${missingText}

YOUR TASK:
Ask exactly ONE concise, natural follow-up question (1 to 2 sentences max) probing this specific gap.
Rules:
- Be professional, conversational, and direct.
- Do NOT sound like an automated robotic quiz. Sound like a real interviewer asking for clarification or deeper context.
- Keep it under 30 words.
- Return ONLY the follow-up question text, no quotes, no markdown, no preamble.`;

      const result = await getModel().generateContent(prompt);
      const text = result.response.text().trim().replace(/^["']|["']$/g, "");
      return text || `Could you give me a specific example with numbers or outcomes from that experience?`;
    });

    return aiResult;
  } catch (err) {
    console.warn("[generateTargetedFollowUp Warning]:", err);
    if (missingElements.some((m) => m.toLowerCase().includes("metric") || m.toLowerCase().includes("result"))) {
      return `Can you share a specific quantifiable outcome or metric that resulted from that initiative?`;
    }
    return `Could you elaborate on the exact steps you personally took to resolve that situation?`;
  }
}

/**
 * Decides whether to trigger a follow-up probe or advance to the next scripted question
 */
export async function decideNextTurn(
  currentTurn: InterviewTurn,
  remainingQuestions: Array<{ id: string; type: string; question: string; rubric?: any }>,
  personaName: string = "Josh"
): Promise<NextTurnDecision> {
  const evalData = currentTurn.evaluation;

  // Rule 1: If follow-up was already triggered for this question, ALWAYS advance to next question (cap = 1 per question)
  if (currentTurn.followUpTriggered) {
    if (remainingQuestions.length > 0) {
      const next = remainingQuestions[0];
      return {
        action: "next_question",
        question: next.question,
        questionId: next.id,
        questionType: next.type,
        reason: "Follow-up completed. Advancing to next structured question.",
      };
    }
    return { action: "complete", reason: "Interview questions completed." };
  }

  // Rule 2: Evaluate if candidate answer is vague, missing concrete metrics or actions
  const needsFollowUp =
    evalData &&
    (evalData.is_vague_or_incomplete ||
      evalData.result_metrics_score < 12 ||
      evalData.task_action_score < 20 ||
      (evalData.missing_elements && evalData.missing_elements.length >= 2));

  if (needsFollowUp) {
    const followUp = await generateTargetedFollowUp(
      currentTurn.question,
      currentTurn.candidateAnswer,
      evalData?.missing_elements || ["quantifiable metrics", "action details"],
      personaName
    );

    return {
      action: "follow_up",
      question: followUp,
      questionId: `${currentTurn.questionId}_followup`,
      questionType: currentTurn.questionType,
      reason: `Probing gap: ${evalData?.missing_elements?.join(", ") || "insufficient specificity"}`,
    };
  }

  // Rule 3: Answer was solid or completed -> move to next question
  if (remainingQuestions.length > 0) {
    const next = remainingQuestions[0];
    return {
      action: "next_question",
      question: next.question,
      questionId: next.id,
      questionType: next.type,
      reason: "Answer evaluated. Advancing to next question.",
    };
  }

  return { action: "complete", reason: "All questions finished." };
}
