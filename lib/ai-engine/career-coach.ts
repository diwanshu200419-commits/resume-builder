import { getCareerProfile, createOrUpdateCareerProfile } from "./career-memory";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildPromptWithContext } from "./prompt-manager";

export async function getCareerAdvice(userId: string, userMessage: string): Promise<string> {
  const profile = await getCareerProfile(userId);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return "API Key not set";

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const prompt = buildPromptWithContext(profile, userMessage);

  const result = await model.generateContent(prompt);
  return result.response.text();
}

export async function updateMemoryFromInteraction(userId: string, data: any) {
  await createOrUpdateCareerProfile(userId, {
    updated_at: new Date(),
    last_ai_summary: data.summary || data.message || "Interaction complete",
  });
}
