import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function GET() {
  const startTime = Date.now();
  let latency: number;
  let status: "working" | "degraded" | "failed" = "failed";
  let modelName: string = "";
  let success = false;

  // Try models in order
  const models = ["gemini-2.0-flash", "gemini-1.5-flash", "gemini-1.0-pro"];

  for (const model of models) {
    try {
      const geminiModel = genAI.getGenerativeModel({ model });
      const result = await geminiModel.generateContent("Reply with 'OK'");
      const text = result.response.text();
      if (text.trim().includes("OK")) {
        modelName = model;
        status = "working";
        success = true;
        break;
      }
    } catch (e) {
      console.warn(`Model ${model} failed:`, e);
    }
  }

  latency = Date.now() - startTime;
  if (!success && latency > 10000) status = "failed";
  else if (!success) status = "degraded";

  return NextResponse.json({
    status,
    model: modelName,
    latency: `${latency}ms`,
    timestamp: new Date().toISOString(),
  });
}
