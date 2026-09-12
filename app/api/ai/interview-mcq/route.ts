// app/api/ai/interview-mcq/route.ts
//
// VayloAI — MCQ Practice Engine API
// Serves curated technical & situational multiple-choice drills and evaluates performance.

import { NextRequest, NextResponse } from "next/server";
import { getMCQQuestions, MCQ_QUESTION_BANK } from "@/lib/interview/mcq-bank";
import { FEATURE_FLAGS } from "@/lib/feature-flags";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!FEATURE_FLAGS.ENABLE_MCQ_MODE) {
    return NextResponse.json({ error: "MCQ practice mode is currently disabled." }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { action = "get_questions", roleCategory = "software_engineering", difficulty = "medium", answers = {} } = body;

    // ACTION 1: Get Questions
    if (action === "get_questions") {
      const questions = getMCQQuestions({
        roleCategory,
        difficulty,
        limit: body.limit || 5,
        excludeIds: body.excludeIds || [],
      });

      // Strip correctIndex from client payload during quiz session to prevent cheating
      const sanitized = questions.map((q) => ({
        id: q.id,
        roleCategory: q.roleCategory,
        subRole: q.subRole,
        difficulty: q.difficulty,
        category: q.category,
        scenario: q.scenario,
        options: q.options,
        tags: q.tags,
      }));

      return NextResponse.json({ success: true, questions: sanitized });
    }

    // ACTION 2: Evaluate Answers
    if (action === "evaluate_batch") {
      const submittedAnswers: Record<string, number> = answers;
      const questionIds = Object.keys(submittedAnswers);

      let correctCount = 0;
      const results = [];
      const categoryStats: Record<string, { total: number; correct: number }> = {};

      for (const qId of questionIds) {
        const fullQ = MCQ_QUESTION_BANK.find((q) => q.id === qId);
        if (!fullQ) continue;

        const candidateChoice = submittedAnswers[qId];
        const isCorrect = candidateChoice === fullQ.correctIndex;

        if (isCorrect) correctCount++;

        // Category stats
        if (!categoryStats[fullQ.category]) {
          categoryStats[fullQ.category] = { total: 0, correct: 0 };
        }
        categoryStats[fullQ.category].total++;
        if (isCorrect) categoryStats[fullQ.category].correct++;

        results.push({
          id: fullQ.id,
          scenario: fullQ.scenario,
          options: fullQ.options,
          candidateChoice,
          correctIndex: fullQ.correctIndex,
          isCorrect,
          explanation: fullQ.explanation,
          category: fullQ.category,
        });
      }

      const totalQuestions = results.length;
      const scorePercent = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

      // Identify Weak Areas
      const weakAreas: string[] = [];
      for (const [cat, stat] of Object.entries(categoryStats)) {
        const catPct = (stat.correct / stat.total) * 100;
        if (catPct < 70) {
          weakAreas.push(
            `${cat.toUpperCase().replace("_", " ")}: ${stat.correct}/${stat.total} correct (${Math.round(catPct)}%). Review core concepts and trade-offs.`
          );
        }
      }

      return NextResponse.json({
        success: true,
        correctCount,
        totalQuestions,
        scorePercent,
        results,
        categoryStats,
        weakAreas,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("[MCQ Route Error]:", error);
    return NextResponse.json({ error: error?.message || "Internal MCQ processing error" }, { status: 500 });
  }
}
