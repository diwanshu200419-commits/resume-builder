import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

export const dynamic = "force-dynamic";

const ResponseSchema = z.object({
  message: z.string(),
});

export async function GET() {
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
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `You are a test assistant. Return valid JSON with a single field "message" that says "ResumeAI is working perfectly!"`;
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
