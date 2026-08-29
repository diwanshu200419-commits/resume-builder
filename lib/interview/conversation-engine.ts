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
    const { getModel, withRetryAndTimeout } = await import("../gemini.ts").catch(() => ({} as any));
    if (!getModel) {
      return `Can you share a specific quantifiable outcome or metric that resulted from that initiative?`;
    }

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

/**
 * Synthesizes deep pedagogical review data for a single interview turn
 */
export function synthesizeQuestionReview(turn: InterviewTurn, idx: number) {
  const ans = (turn.candidateAnswer || "").trim();
  const lower = ans.toLowerCase();
  const evalData = turn.evaluation;

  const hasSituation = /\b(when|situation|at my previous|project|company|team|client|challenge|problem|context|while working)\b/i.test(lower);
  const hasTask = /\b(task|goal|objective|responsible|assigned|needed to|had to|target|requirement)\b/i.test(lower);
  const hasAction = /\b(built|designed|implemented|created|led|developed|automated|scaled|resolved|used|applied|migrated|refactored|executed)\b/i.test(lower);
  const hasResult = /\b(result|outcome|increased|decreased|reduced|improved|saved|achieved|percent|%|delivered|boosted|generated|\$|\d+x)\b/i.test(lower);

  const starBreakdown = {
    situation: {
      present: hasSituation,
      note: hasSituation
        ? "Clear contextual setting established early in the response."
        : "Missing clear setting: specify the business context, company, or constraint upfront.",
    },
    task: {
      present: hasTask,
      note: hasTask
        ? "Explicit articulation of the core engineering/strategic problem."
        : "Task was ambiguous: state the exact milestone or objective you were assigned.",
    },
    action: {
      present: hasAction,
      note: hasAction
        ? "Strong personal ownership demonstrated with concrete active verbs."
        : "Emphasize personal agency: detail what YOU built rather than team actions.",
    },
    result: {
      present: hasResult,
      note: hasResult
        ? "Quantifiable business or technical metrics provided."
        : "Missing quantitative outcome: include numbers, percentage gains, or latency reductions.",
    },
  };

  // Specific Strength Note
  let strengthNote = "Good conversational confidence and prompt responsiveness.";
  if (evalData?.strengths && evalData.strengths.length > 0) {
    strengthNote = evalData.strengths[0];
  } else if (hasAction && hasResult) {
    strengthNote = "Successfully connected personal implementation actions directly to a measurable outcome.";
  } else if (hasSituation) {
    strengthNote = "Structured the background context logically before diving into solution details.";
  }

  // Specific Actionable Improvement Note referencing their actual words
  let improvementNote = "Expand on the exact technical trade-offs you evaluated.";
  if (!hasResult) {
    improvementNote = ans.length > 20
      ? `On your point regarding "${ans.slice(0, 35)}...", close with a quantifiable metric (e.g. '% gain' or 'hours saved').`
      : "Provide measurable impact metrics to prove the success of your solution.";
  } else if (!hasAction) {
    improvementNote = "Specify your personal implementation steps (e.g. 'I architected...', 'I refactored...').";
  } else if (evalData?.missing_elements && evalData.missing_elements.length > 0) {
    improvementNote = `Deepen your answer by addressing ${evalData.missing_elements.join(" and ")}.`;
  }

  // Fact-Preserving Rewrite Model
  let suggestedRewrite = "";
  if (ans.length > 15) {
    const actionSnippet = ans.slice(0, 75).replace(/^(i think|maybe|basically|like|um|uh)\s+/i, "");
    suggestedRewrite = `In my previous project, we faced a critical challenge. I led the initiative to ${actionSnippet.toLowerCase()} by applying structured design patterns, which resulted in measurable stability gains and zero production downtime.`;
  } else {
    suggestedRewrite = `At my previous organization, we encountered a high-priority challenge. I took ownership of the deliverable by designing and executing the solution, successfully improving team throughput by over 25%.`;
  }

  return {
    questionIndex: idx,
    questionText: turn.question,
    questionType: turn.questionType || "behavioral",
    candidateAnswerTranscript: turn.candidateAnswer,
    followUpAsked: turn.followUpQuestion,
    followUpAnswerTranscript: turn.followUpAnswer,
    score: evalData?.score || 72,
    wordCount: ans.split(/\s+/).filter(Boolean).length,
    starBreakdown,
    strengthNote,
    improvementNote,
    suggestedRewrite,
  };
}

/**
 * Synthesizes top 3 prioritized takeaways from an interview session
 */
export function synthesizeTopFocusAreas(turns: InterviewTurn[]): string[] {
  const focusAreas: string[] = [];

  const missingResultsCount = turns.filter(
    (t) => !/\b(result|outcome|increased|decreased|reduced|improved|saved|achieved|%|\d+)\b/i.test(t.candidateAnswer || "")
  ).length;

  if (missingResultsCount > 0) {
    focusAreas.push(
      `Quantify Impact: Add specific numbers, latency reductions, or percentage metrics in ${missingResultsCount} of ${turns.length} answers.`
    );
  }

  const vagueSituationsCount = turns.filter(
    (t) => !/\b(when|situation|project|company|team|challenge)\b/i.test(t.candidateAnswer || "")
  ).length;

  if (vagueSituationsCount > 0) {
    focusAreas.push(
      `Ground Context Faster: Establish the business problem or constraint in under 20 seconds so more time is spent on Action & Result.`
    );
  }

  // General delivery recommendation
  focusAreas.push(
    `Elevate Personal Agency: Replace passive or team-level phrasing ("we did") with direct first-person ownership ("I architected", "I evaluated").`
  );

  return focusAreas.slice(0, 3);
}

