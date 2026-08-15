import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

export const dynamic = "force-dynamic";

// SECURITY: This test endpoint is disabled in production.
// Only available for local development environment verification.
if (process.env.NODE_ENV === "production") {
  // This module-level check is a soft guard; the route handler below enforces it.
}

const ResponseSchema = z.object({
  message: z.string(),
});

export async function GET() {
  // SECURITY: Block this endpoint in production — unauthenticated Gemini API calls
  // allow quota drain, billing inflation, and API key reconnaissance.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available" }, { status: 403 });
  }

  const startTime = Date.now();

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { status: "error", error: "GEMINI_API_KEY is missing" },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a test assistant. Return valid JSON with a single field "message" that says "Vaylo AI is working perfectly!"`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let jsonStr = text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonStr = jsonMatch[0];
    const parsed = ResponseSchema.parse(JSON.parse(jsonStr));

    const latency = `${Date.now() - startTime}ms`;

    return NextResponse.json({
      status: "success",
      model: "gemini",
      latency: latency,
      test_message: parsed.message,
    });
  } catch (error) {
    console.error("Gemini Test Failed:", error);

    let errorMessage = "Unknown error";
    if (error instanceof Error) {
      errorMessage = error.message;
      if (errorMessage.toLowerCase().includes("quota")) {
        errorMessage = "quota issue";
      } else if (errorMessage.toLowerCase().includes("authentication")) {
        errorMessage = "authentication error - invalid API key";
      } else if (errorMessage.toLowerCase().includes("404")) {
        errorMessage = "wrong configuration - model not found";
      }
    }

    return NextResponse.json({
      status: "failed",
      error: errorMessage,
      latency: `${Date.now() - startTime}ms`,
    }, { status: 500 });
  }
}
