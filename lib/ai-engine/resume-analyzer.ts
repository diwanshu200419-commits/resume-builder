// Wrapper for existing gemini functions that uses the AI engine pattern
import { analyzeATS, optimizeResume } from "@/lib/gemini";

export async function analyzeResume(resumeText: string, jobDescription: string) {
  const atsResult = await analyzeATS(resumeText, jobDescription);
  const optimizedResult = await optimizeResume(
    resumeText,
    jobDescription,
    atsResult.missing_keywords as string[]
  );
  return { atsResult, optimizedResult };
}
