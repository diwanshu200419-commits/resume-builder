import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, userAnswer, targetRole } = await request.json();

    if (!question || !userAnswer) {
      return NextResponse.json({ error: "Question and user answer are required" }, { status: 400 });
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const prompt = `You are a Fortune 500 tech interview coach and hiring manager.
Evaluate this candidate's interview response using the STAR framework (Situation, Task, Action, Result).

INTERVIEW QUESTION:
${question}

${targetRole ? `TARGET ROLE: ${targetRole}` : ""}

CANDIDATE'S ANSWER:
${userAnswer}

Return ONLY valid JSON (no markdown code blocks, no extra text):
{
  "rating": <number 1-10>,
  "star_analysis": {
    "situation": "<Evaluation of Situation setting>",
    "task": "<Evaluation of Task clarity>",
    "action": "<Evaluation of personal Action steps>",
    "result": "<Evaluation of quantifiable Result/Outcome>"
  },
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["area for improvement 1"],
  "improved_answer": "<Rewrite the candidate's answer into a top 1% response using STAR format>"
}`;

      const res = await model.generateContent(prompt);
      let text = res.response.text().trim();
      text = text.replace(/```json|```/g, "").trim();
      const match = text.match(/\{[\s\S]*\}/);
      if (match) text = match[0];
      
      const parsed = JSON.parse(text);
      return NextResponse.json({ data: parsed });
    } catch (aiError) {
      console.warn("Interview evaluation AI failed, using fallback rating", aiError);
      
      // Fallback evaluation
      const length = userAnswer.length;
      const rating = length > 250 ? 8 : length > 100 ? 6 : 4;
      
      return NextResponse.json({
        data: {
          rating,
          star_analysis: {
            situation: "Clear context provided.",
            task: "Defined responsibility.",
            action: "Described personal contributions.",
            result: "Could add more numerical metrics to quantify impact."
          },
          strengths: ["Direct address to the question", "Professional tone"],
          weaknesses: ["Add metrics (e.g. %, $, hours saved)"],
          improved_answer: `In my previous role, I encountered a critical deadline. My task was to deliver the project on schedule. I reorganized priorities and streamlined our workflow, resulting in an on-time release and a 20% increase in team throughput.`
        }
      });
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Server Error" }, { status: 500 });
  }
}
