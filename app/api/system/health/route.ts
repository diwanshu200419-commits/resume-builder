import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const dynamic = "force-dynamic";

export async function GET() {
  let dbStatus = "failed";
  let geminiStatus = "failed";
  let upiStatus = "not configured";

  try {
    const supabase = await createSupabaseClient();
    const { error } = await supabase.from("profiles").select("id").limit(1);
    if (!error) {
      dbStatus = "connected";
    }
  } catch (e) {
    console.error("DB Health check failed:", e);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    await model.generateContent("Respond with only OK");
    geminiStatus = "connected";
  } catch (e) {
    console.error("Gemini Health check failed:", e);
  }

  if (process.env.NEXT_PUBLIC_UPI_ID) {
    upiStatus = "configured";
  }

  return NextResponse.json({
    database: dbStatus,
    gemini: geminiStatus,
    upi: upiStatus,
    environment: "production-ready",
  });
}
