import { NextRequest, NextResponse } from "next/server";
import { getProfile } from "@/lib/auth";
import { getCareerProfile } from "@/lib/ai-engine/career-memory";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(request: NextRequest) {
  try {
    const profile = await getProfile();
    if (!profile) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const careerProfile = await getCareerProfile(profile.id);
    const targetRole = careerProfile?.target_role || "Software Engineer";

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `Act as a tech market trend analyst. For the role of "${targetRole}", identify 3 trending skills or certifications that are becoming popular in June 2026. Return as JSON array of strings.`;
    
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    const trends = jsonMatch ? JSON.parse(jsonMatch[0]) : ["AI Integration", "Cloud Architecture", "System Design"];

    return NextResponse.json({
      notifications: [
        {
          id: "trend-1",
          type: "trend",
          message: `New trending skills for ${targetRole}: ${trends.join(", ")}`,
          cta: "Update Resume",
          link: "/analyze"
        },
        {
          id: "score-1",
          type: "info",
          message: "Your monthly Career Growth Report is ready!",
          cta: "View Report",
          link: "/dashboard"
        }
      ]
    });
  } catch (error) {
    console.error("Error in notifications:", error);
    return NextResponse.json({ notifications: [] });
  }
}
