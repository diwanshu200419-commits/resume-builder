import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts/system";

const AI_TRAINING_SYSTEM_PROMPT = `${SYSTEM_PROMPT}

You are Vaylo AI's Master AI Career Copilot.
You have expert knowledge across all Vaylo AI features:
1. ATS Optimizer & Scanner (/analyze): Upload PDF/DOCX or text, get 0-100% score, and 1-Click Auto-Fix missing keywords.
2. Interactive Resume Builder (/builder): Real-time sheet preview with 4 recruiter templates and AI bullet refiner.
3. AI Recruiter 10-Second Eye Screen (/recruiter-simulation): Eye-tracking scan simulation showing why recruiters shortlist or reject.
4. AI Hiring Probability Predictor (/hiring-probability): Statistical callback odds and recruiter confidence breakdown.
5. AI Personal Branding Studio (/branding-studio): Generate GitHub profile README.md, SVG LinkedIn banners, and About bio summaries.
6. Job Application Kanban Tracker (/applications): Track Saved, Applied, Interviewing, Offer, and Rejected stages.
7. AI Networking & Referral Generator (/networking): Cold outreach messages, referral requests, and recruiter InMails.
8. One-Click Portfolio Deployment (/portfolio/deploy): Deploy dark mode HTML site to username.vaylo.ai or custom domains with SSL.
9. GitHub Auto-Sync (/github-sync): Auto-import repositories, stars, forks, and AI code architecture highlights.
10. Real-Time STAR Voice Interview Simulator (/interview-prep/[id]): Web Speech API microphone practice with 1-10 STAR scoring.
11. AI Salary Negotiator (/salary-calculator): Pay bands for India (₹ LPA) & Global Remote ($ USD) with word-for-word counter offer scripts.
12. Multi-Language Resume Translator (/translate): Translate into German, French, Spanish, Japanese, Hindi, and English.
13. Pricing: Free Plan (₹0), Pro Plan (₹99/mo), Premium Plan (₹299/mo), Career Pack (₹499 one-time). UPI ID: jattshiv32@okaxis.

Instructions:
- Give a direct, actionable, 2-3 sentence response guiding the user to the exact Vaylo AI tool route.`;

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
      reply: "To boost your ATS score above 85%, use high-impact action verbs like 'Architected' or 'Spearheaded' and optimize keywords at /analyze!",
      advice: "To boost your ATS score above 85%, use high-impact action verbs like 'Architected' or 'Spearheaded' and optimize keywords at /analyze!"
    });
  }
}

function getTrainedFallbackAnswer(msg: string): string {
  const m = msg.toLowerCase();

  if (m.includes("create") || m.includes("build") || m.includes("make") || m.includes("generator") || m.includes("new")) {
    return "To create a new resume or portfolio, go to /builder to build a resume with real-time sheet preview, /portfolio to generate a dark mode HTML site, or /portfolio/deploy to publish directly to username.vaylo.ai!";
  }
  if (m.includes("github") || m.includes("repo") || m.includes("code")) {
    return "Connect your GitHub on /github-sync to auto-import repositories, generate AI project summaries, and sync your live developer portfolio!";
  }
  if (m.includes("recruiter") || m.includes("scan") || m.includes("10s") || m.includes("eye")) {
    return "Simulate a 10-second recruiter eye-tracking scan on /recruiter-simulation to see what attracts attention and why your resume gets shortlisted or rejected!";
  }
  if (m.includes("hiring") || m.includes("odds") || m.includes("chance") || m.includes("probability")) {
    return "Calculate your statistical interview callback probability on /hiring-probability to see your odds for target roles at Google, Stripe, or Amazon!";
  }
  if (m.includes("branding") || m.includes("linkedin") || m.includes("readme") || m.includes("bio")) {
    return "Generate developer GitHub README profiles, custom SVG LinkedIn cover banners, and optimized bio summaries on /branding-studio!";
  }
  if (m.includes("jobs") || m.includes("track") || m.includes("kanban") || m.includes("apply") || m.includes("application")) {
    return "Track your applications, interviews, offers, and rejections in a Linear-style Kanban board on /applications!";
  }
  if (m.includes("referral") || m.includes("network") || m.includes("outreach") || m.includes("inmail")) {
    return "Generate personalized LinkedIn referral requests and recruiter InMails on /networking that get 4x higher response rates!";
  }
  if (m.includes("ats") || m.includes("score") || m.includes("resume") || m.includes("fix") || m.includes("optimize")) {
    return "To boost your ATS score above 85%, upload your resume at /analyze and use our 1-Click 'Auto-Fix All ATS Errors' button to inject missing keywords and upgrade action verbs!";
  }
  if (m.includes("price") || m.includes("plan") || m.includes("cost") || m.includes("free") || m.includes("pro") || m.includes("premium") || m.includes("upi")) {
    return "Vaylo AI offers 4 clear plans: Free (₹0 for 2 scans/mo), Pro (₹99/mo for unlimited downloads), Premium (₹299/mo for Portfolio & Interview practice), and Career Pack (₹499 one-time lifetime access)! UPI ID: jattshiv32@okaxis.";
  }
  if (m.includes("interview") || m.includes("star") || m.includes("voice") || m.includes("speak")) {
    return "Master behavioral interviews using our STAR Voice Practice Sandbox on /interview-prep! Speak your answers out loud into your mic and receive instant 1-10 AI scoring.";
  }
  if (m.includes("salary") || m.includes("pay") || m.includes("negotiate") || m.includes("ctc")) {
    return "Benchmark your market pay band in ₹ LPA or $ USD with our AI Salary Negotiator on /salary-calculator and copy word-for-word counter offer scripts!";
  }
  if (m.includes("translate") || m.includes("language")) {
    return "Translate your resume into German, French, Spanish, Japanese, Hindi, or English on /translate for international job applications!";
  }

  return "I am Vaylo AI, your AI Career Copilot! I can help you optimize your resume for ATS filters (/analyze), build resumes (/builder), deploy portfolios (/portfolio/deploy), calculate hiring odds (/hiring-probability), and practice STAR voice interviews (/interview-prep)! How can I help you today?";
}
