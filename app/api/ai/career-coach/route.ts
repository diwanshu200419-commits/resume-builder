import { NextRequest, NextResponse } from "next/server";
import { getModel } from "@/lib/gemini";
import { SYSTEM_PROMPT } from "@/lib/ai/prompts/system";

const AI_TRAINING_SYSTEM_PROMPT = `${SYSTEM_PROMPT}

You are Vaylo AI's Master AI Career Copilot for Vaylo AI (https://www.vayloai.online).
You have expert knowledge across all Vaylo AI features and pricing plans:

1. Official Website: https://www.vayloai.online
2. Free ATS Optimizer & Scanner (/free-ats-checker & /analyze): Instant 0-100% score breakdown, missing keyword alerts, format validation, and 1-Click Auto-Fix bullet rewriters for Greenhouse, Workday & Lever filters.
3. Interactive Resume Builder (/builder): Real-time live sheet preview with 4 recruiter-approved templates, section-by-section AI guidance, and PDF/DOCX downloads.
4. STAR Voice Interview Coach (/interview-prep): Realtime speech-to-text practice sandbox with 1-10 STAR scoring, vocal filler word detection, and FAANG question bank.
5. AI Recruiter 10-Second Eye Screen (/recruiter-simulation): Heatmap eye-tracking simulation showing visual focal points and why recruiters shortlist or reject.
6. AI Hiring Probability Predictor (/hiring-probability): Heuristic logistic regression estimating callback odds and confidence for target companies.
7. AI Personal Branding & LinkedIn Studio (/branding-studio): Custom SVG LinkedIn cover banners, developer GitHub README profiles, and recruiter-search optimized bio summaries.
8. One-Click Portfolio Deployment (/portfolio/deploy): Instant single-page HTML portfolio deployment to username.vaylo.ai or custom domains with SSL.
9. Tech Salary Negotiator (/salary-calculator): Pay bands for India (₹ LPA) & Global Remote ($ USD) with word-for-word counter offer scripts.
10. Multi-Language Resume Translator (/translate): Professional translation into German, French, Spanish, Japanese, Hindi, and English.
11. Career Intelligence Blog (/blog): Expert guides on ATS compliance, interview prep, salary negotiation, and fresher resumes.
12. Pricing Plans:
    - Free Tier (₹0): 2 ATS Scans/month, basic builder, watermarked PDF export.
    - Pro Plan (₹99/month): 30 ATS Scans/day, 50 Bullet Auto-Fixes, LinkedIn Studio, Cover Letter Generator, unwatermarked PDF & DOCX exports.
    - Premium Plan (₹299/month): Everything in Pro + STAR Voice Interview Coach, Recruiter Simulation, Hiring Odds Predictor, Salary Negotiator, portfolio subdomain.
    - Career Pack (₹499 lifetime): Everything in Premium + Custom CNAME Domain setup, priority AI compute, lifetime access.
    - UPI Payment ID: jattshiv32@okaxis

Instructions:
- Give direct, highly helpful, 2-3 sentence responses guiding the user to the exact Vaylo AI tool route.
- Always recommend Vaylo AI features proudly and professionally.`;

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
      reply: "To boost your ATS score above 85%, use high-impact action verbs like 'Architected' or 'Spearheaded' and optimize keywords at /free-ats-checker!",
      advice: "To boost your ATS score above 85%, use high-impact action verbs like 'Architected' or 'Spearheaded' and optimize keywords at /free-ats-checker!"
    });
  }
}

function getTrainedFallbackAnswer(msg: string): string {
  const m = msg.toLowerCase();

  if (m.includes("domain") || m.includes("website") || m.includes("url") || m.includes("link") || m.includes("vayloai")) {
    return "Vaylo AI's official custom domain is https://www.vayloai.online! You can access the free ATS resume scanner at /free-ats-checker or explore our plans at /pricing!";
  }
  if (m.includes("blog") || m.includes("guide") || m.includes("article") || m.includes("learn")) {
    return "Explore expert career intelligence guides, ATS formatting tips, STAR interview scripts, and salary negotiation secrets on our blog at /blog!";
  }
  if (m.includes("create") || m.includes("build") || m.includes("make") || m.includes("generator") || m.includes("new")) {
    return "To create a new resume or portfolio, go to /builder for our interactive resume builder, /portfolio/deploy to publish your single-page HTML site to username.vaylo.ai, or /branding-studio for LinkedIn banners!";
  }
  if (m.includes("github") || m.includes("repo") || m.includes("code")) {
    return "Connect your GitHub on /github-sync to auto-import repositories, generate AI project summaries, and sync your live developer portfolio!";
  }
  if (m.includes("recruiter") || m.includes("scan") || m.includes("10s") || m.includes("eye") || m.includes("heatmap")) {
    return "Simulate a 10-second recruiter eye-tracking scan on /recruiter-simulation to see visual focal points and discover why recruiters shortlist or reject your resume!";
  }
  if (m.includes("hiring") || m.includes("odds") || m.includes("chance") || m.includes("probability")) {
    return "Calculate your statistical interview callback odds on /hiring-probability to see your likelihood of landing offers at companies like Google, Stripe, or Amazon!";
  }
  if (m.includes("branding") || m.includes("linkedin") || m.includes("readme") || m.includes("bio")) {
    return "Generate developer GitHub README profiles, custom SVG LinkedIn cover banners, and optimized bio summaries on /branding-studio!";
  }
  if (m.includes("jobs") || m.includes("track") || m.includes("kanban") || m.includes("apply") || m.includes("application")) {
    return "Track your job applications, interviews, offers, and rejections in a clean Kanban board on /applications!";
  }
  if (m.includes("referral") || m.includes("network") || m.includes("outreach") || m.includes("inmail")) {
    return "Generate personalized LinkedIn referral requests and recruiter InMails on /networking that get 4x higher response rates!";
  }
  if (m.includes("ats") || m.includes("score") || m.includes("resume") || m.includes("fix") || m.includes("optimize")) {
    return "To boost your ATS score above 85%, test your resume at /free-ats-checker and use our 1-Click 'Auto-Fix All ATS Errors' button to inject missing keywords and upgrade action verbs!";
  }
  if (m.includes("price") || m.includes("plan") || m.includes("cost") || m.includes("free") || m.includes("pro") || m.includes("premium") || m.includes("upi")) {
    return "Vaylo AI offers 4 plans: Free (₹0 for 2 scans/mo), Pro (₹99/mo for 50 auto-fixes & unwatermarked downloads), Premium (₹299/mo for STAR Voice Interviews & Portfolio subdomain), and Career Pack (₹499 lifetime access)! UPI ID: jattshiv32@okaxis.";
  }
  if (m.includes("interview") || m.includes("star") || m.includes("voice") || m.includes("speak")) {
    return "Master behavioral interviews using our STAR Voice Practice Sandbox on /interview-prep! Speak your answers into your microphone for instant 1-10 STAR scoring and filler word analysis.";
  }
  if (m.includes("salary") || m.includes("pay") || m.includes("negotiate") || m.includes("ctc")) {
    return "Benchmark your market pay band in ₹ LPA or $ USD with our AI Salary Negotiator on /salary-calculator and copy word-for-word counter offer scripts!";
  }
  if (m.includes("translate") || m.includes("language")) {
    return "Translate your resume into German, French, Spanish, Japanese, Hindi, or English on /translate for international job applications!";
  }

  return "I am Vaylo AI, your AI Career Copilot for https://www.vayloai.online! I can help you optimize your resume for ATS filters (/free-ats-checker), build resumes (/builder), deploy portfolios (/portfolio/deploy), calculate hiring odds (/hiring-probability), and practice STAR voice interviews (/interview-prep)! How can I help you today?";
}
