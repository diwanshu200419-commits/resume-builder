// app/api/ai/interview-tts/route.ts
//
// Vaylo AI — Multi-Tier Text-to-Speech Engine
// Tier 1: Self-Hosted Neural Piper TTS (Zero API Cost, Low-Latency CPU ONNX)
// Tier 2: ElevenLabs Commercial Stock Voice API
// Tier 3: Client Browser SpeechSynthesis Fallback

import { NextRequest, NextResponse } from "next/server";
import { getPersona, INTERVIEWER_PERSONAS } from "@/lib/interview/voice-personas";
import crypto from "node:crypto";

// In-memory LRU-style cache for generated audio buffers to eliminate duplicate compute/API cost
const audioCache = new Map<string, { buffer: Buffer; contentType: string; timestamp: number }>();
const MAX_CACHE_ITEMS = 200;

function getCacheKey(text: string, voiceIdOrModel: string): string {
  return crypto.createHash("sha256").update(`${voiceIdOrModel}:${text.trim().toLowerCase()}`).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, personaId } = body;

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json({ error: "Text is required for speech synthesis." }, { status: 400 });
    }

    const persona = getPersona(personaId);
    const cleanText = text.trim();
    const cacheKey = getCacheKey(cleanText, `${persona.piperVoiceModel}_${persona.elevenLabsVoiceId}`);

    // ----------------------------------------------------
    // STEP 1: In-Memory SHA256 Audio Cache (0ms response)
    // ----------------------------------------------------
    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      return new NextResponse(new Uint8Array(cached.buffer), {
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          "X-Vaylo-TTS-Source": "cache-hit",
        },
      });
    }

    // ----------------------------------------------------
    // STEP 2 (TIER 1): Self-Hosted Neural Piper TTS Service
    // ----------------------------------------------------
    const piperServiceUrl =
      process.env.PIPER_TTS_SERVICE_URL ||
      process.env.TTS_SERVICE_URL ||
      process.env.NEXT_PUBLIC_PIPER_TTS_SERVICE_URL;

    if (piperServiceUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout threshold

        const piperResponse = await fetch(`${piperServiceUrl.replace(/\/$/, "")}/synthesize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: cleanText,
            voiceModel: persona.piperVoiceModel,
            personaId: persona.id,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (piperResponse.ok) {
          const arrayBuffer = await piperResponse.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const contentType = piperResponse.headers.get("content-type") || "audio/wav";

          if (audioCache.size >= MAX_CACHE_ITEMS) {
            const oldestKey = audioCache.keys().next().value;
            if (oldestKey) audioCache.delete(oldestKey);
          }
          audioCache.set(cacheKey, {
            buffer,
            contentType,
            timestamp: Date.now(),
          });

          return new NextResponse(new Uint8Array(buffer), {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=86400",
              "X-Vaylo-TTS-Source": "self-hosted-piper",
              "X-Vaylo-Voice-Model": persona.piperVoiceModel,
            },
          });
        }
      } catch (piperErr) {
        console.warn("[Piper TTS Service Notice]: Unreachable or timed out, evaluating next tier:", piperErr);
      }
    }

    // ----------------------------------------------------
    // STEP 3 (TIER 2): ElevenLabs Commercial Stock Voice API
    // ----------------------------------------------------
    const elevenLabsApiKey =
      process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    if (elevenLabsApiKey) {
      try {
        const response = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${persona.elevenLabsVoiceId}?output_format=mp3_44100_128`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "xi-api-key": elevenLabsApiKey,
            },
            body: JSON.stringify({
              text: cleanText,
              model_id: "eleven_turbo_v2_5",
              voice_settings: {
                stability: persona.style === "formal" ? 0.75 : 0.55,
                similarity_boost: 0.8,
                style: persona.style === "warm" ? 0.4 : 0.15,
                use_speaker_boost: true,
              },
            }),
          }
        );

        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          if (audioCache.size >= MAX_CACHE_ITEMS) {
            const oldestKey = audioCache.keys().next().value;
            if (oldestKey) audioCache.delete(oldestKey);
          }
          audioCache.set(cacheKey, {
            buffer,
            contentType: "audio/mpeg",
            timestamp: Date.now(),
          });

          return new NextResponse(new Uint8Array(buffer), {
            headers: {
              "Content-Type": "audio/mpeg",
              "Cache-Control": "public, max-age=86400",
              "X-Vaylo-TTS-Source": "elevenlabs-live",
            },
          });
        }
      } catch (elevenLabsErr) {
        console.warn("[ElevenLabs TTS Notice]:", elevenLabsErr);
      }
    }

    // ----------------------------------------------------
    // STEP 4 (TIER 3): Safe Client Browser Fallback
    // ----------------------------------------------------
    return NextResponse.json({
      fallback: true,
      text: cleanText,
      persona: {
        id: persona.id,
        name: persona.name,
        gender: persona.gender,
        style: persona.style,
        piperVoiceModel: persona.piperVoiceModel,
      },
      message: "Using browser Web Speech engine for real-time persona synthesis.",
    });
  } catch (error: any) {
    console.error("[interview-tts API Error]:", error);
    return NextResponse.json(
      {
        fallback: true,
        error: error.message || "Failed to process TTS",
      },
      { status: 200 }
    );
  }
}
