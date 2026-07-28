import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";

const AI_TRAINING_SYSTEM_PROMPT = `You are Vaylo AI's Master AI Career Coach and Platform Assistant.
You have expert knowledge in:
1. ATS Optimization: Increasing score from 50% to 90%+ using exact job description keywords and metric bullet points (e.g. 'Increased speed by 40%').
2. STAR Interview Prep: Coaching users to structure behavioral answers using Situation, Task, Action, Result with speech practice.
3. Salary Negotiation: Benchmarking pay in India (Tier-1 tech hubs BLR, NCR, HYD in ₹ LPA) and US/EU Remote ($ USD) and crafting word-for-word counter offer emails.
4. AI Portfolio Generator: Converting resume details into single-page Tailwind CSS dark mode HTML websites.
5. Vaylo AI Pricing Tiers:
   - Free Plan (₹0): 2 ATS scans/mo, basic score.
   - Pro Plan (₹99/mo): Unlimited PDF/DOCX downloads, Cover Letter Generator, LinkedIn Optimizer.
   - Premium Plan (₹299/mo): Portfolio Generator, Voice Interview Simulator, AI Job Matcher, AI Roast, AI Roadmap.
   - Career Pack (₹499 one-time): Lifetime access, guaranteed recruiter formats, priority channel.

Instructions:
- Provide an energetic, helpful, and highly concise (2-3 sentences max) response.
- If asked about how to improve ATS score, recommend uploading resume at /analyze and using the 1-click Auto-Fix button.
- If asked about pricing or plans, explain the exact plan amounts (₹0, ₹99, ₹299, ₹499).`;

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
        const prompt = `${AI_TRAINING_SYSTEM_PROMPT}\n\nUser Question: "${message}"`;
        const res = await model.generateContent(prompt);
        reply = res.response.text().trim();
      } catch {
        reply = getTrainedFallbackAnswer(message);
      }
    } else {
      reply = getTrainedFallbackAnswer(message);
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

function getTrainedFallbackAnswer(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("ats") || m.includes("score") || m.includes("resume")) {
    return "To boost your ATS score above 85%, upload your resume at /analyze and use our 1-Click 'Auto-Fix All ATS Errors' button to inject missing keywords and upgrade action verbs!";
  }
  if (m.includes("price") || m.includes("plan") || m.includes("cost") || m.includes("free") || m.includes("pro") || m.includes("premium")) {
    return "Vaylo AI offers 4 clear plans: Free (₹0 for 2 scans/mo), Pro (₹99/mo for unlimited downloads & cover letters), Premium (₹299/mo for Portfolio & Interview practice), and Career Pack (₹499 one-time lifetime access)!";
  }
  if (m.includes("interview") || m.includes("star") || m.includes("voice")) {
    return "Master behavioral interviews using our STAR Voice Practice Sandbox on /interview-prep! Speak your answers out loud into your mic and receive instant 1-10 AI scoring.";
  }
  if (m.includes("salary") || m.includes("pay") || m.includes("negotiate") || m.includes("ctc")) {
    return "Benchmark your market pay band in ₹ LPA or $ USD with our AI Salary Negotiator on /salary-calculator and copy word-for-word counter offer scripts!";
  }
  return "Vaylo AI is your complete career copilot! We optimize your resume for ATS filters, generate single-page HTML portfolio websites, and prepare you for STAR interviews.";
}
