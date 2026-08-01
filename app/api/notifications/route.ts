import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";
import { getProfile } from "@/lib/auth";
import { getCareerProfile } from "@/lib/ai-engine/career-memory";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(request: NextRequest) {
  try {
    const profile = await getProfile();
    const targetRole = "Software Engineer";

    const defaultNotifications = [
      {
        id: "trend-1",
        type: "trend",
        message: `New trending skills for ${targetRole}: AI Agents, System Architecture, Next.js`,
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
    ];

    try {
      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_KEY;
      if (!apiKey) return NextResponse.json({ notifications: defaultNotifications });

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Act as a tech market trend analyst. For the role of "${targetRole}", identify 3 trending skills that are becoming popular. Return as JSON array of strings.`;
      
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      const trends = jsonMatch ? JSON.parse(jsonMatch[0]) : ["AI Agents", "System Architecture", "Next.js"];

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
    } catch {
      return NextResponse.json({ notifications: defaultNotifications });
    }
  } catch (error) {
    return NextResponse.json({
      notifications: [
        {
          id: "trend-1",
          type: "trend",
          message: "New trending skills for Software Engineer: AI Agents, System Architecture, Next.js",
          cta: "Update Resume",
          link: "/analyze"
        }
      ]
    });
  }
}
