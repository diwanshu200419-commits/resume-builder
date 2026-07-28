import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { getModel } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const message = body.message || body.query || "";

    if (!message.trim()) {
      return NextResponse.json({ error: "Empty message" }, { status: 400 });
    }

    const model = getModel();
    let reply = "";

    if (model) {
      try {
        const prompt = `You are Vaylo AI's expert AI Career Copilot. Give a concise, friendly, and highly actionable 2-sentence response to this job seeker question:\n\nQuestion: "${message}"`;
        const res = await model.generateContent(prompt);
        reply = res.response.text().trim();
      } catch {
        reply = getFallbackAnswer(message);
      }
    } else {
      reply = getFallbackAnswer(message);
    }

    return NextResponse.json({ reply, advice: reply });
  } catch (error) {
    console.error("Error in career coach route:", error);
    return NextResponse.json({
      reply: "To boost your ATS score above 85%, use high-impact action verbs like 'Architected' or 'Spearheaded', and make sure your tech stack matches the target job description keywords!",
      advice: "To boost your ATS score above 85%, use high-impact action verbs like 'Architected' or 'Spearheaded', and make sure your tech stack matches the target job description keywords!"
    });
  }
}

function getFallbackAnswer(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("ats") || m.includes("score")) {
    return "To boost your ATS score above 85%, include exact keywords from the job description and quantify your achievements with metric bullet points (e.g. 'Increased speed by 40%').";
  }
  if (m.includes("price") || m.includes("plan") || m.includes("cost") || m.includes("free")) {
    return "Vaylo AI offers a Free Plan (₹0 for 2 ATS checks/mo), Pro (₹99/mo), Premium (₹299/mo), and a 1-time Career Pack (₹499) with lifetime access!";
  }
  if (m.includes("interview") || m.includes("star")) {
    return "Use the STAR method (Situation, Task, Action, Result) for behavioral questions. Practice out loud using our Voice Microphone Sandbox on Vaylo AI!";
  }
  return "Vaylo AI is your complete career copilot! We optimize your resume for ATS filters, generate single-page HTML portfolio websites, and prepare you for STAR interviews.";
}
