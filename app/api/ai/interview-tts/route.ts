// app/api/ai/interview-tts/route.ts
//
// Vaylo AI — Persona Text-to-Speech Engine
// Serves licensed stock voices with audio caching and graceful client synthesis fallback

import { NextRequest, NextResponse } from "next/server";
import { getPersona, INTERVIEWER_PERSONAS } from "@/lib/interview/voice-personas";
import crypto from "node:crypto";

// In-memory LRU-style cache for generated audio buffers to avoid duplicate TTS API costs
const audioCache = new Map<string, { buffer: Buffer; contentType: string; timestamp: number }>();
const MAX_CACHE_ITEMS = 150;

function getCacheKey(text: string, voiceId: string): string {
  return crypto.createHash("sha256").update(`${voiceId}:${text.trim().toLowerCase()}`).digest("hex");
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
    const cacheKey = getCacheKey(cleanText, persona.elevenLabsVoiceId);

    // 1. Check in-memory audio cache
    if (audioCache.has(cacheKey)) {
      const cached = audioCache.get(cacheKey)!;
      return new NextResponse(new Uint8Array(cached.buffer), {
        headers: {
          "Content-Type": cached.contentType,
          "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
          "X-Vaylo-TTS-Source": "cache",
        },
      });
    }

    // 2. Check ElevenLabs API Key
    const apiKey = process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    if (!apiKey) {
      // Graceful fallback response: signal client to use browser Web Speech API
      return NextResponse.json({
        fallback: true,
        text: cleanText,
        persona: {
          id: persona.id,
          name: persona.name,
          gender: persona.gender,
          style: persona.style,
        },
        message: "Using browser Web Speech engine for real-time persona synthesis.",
      });
    }

    // 3. Call ElevenLabs TTS with licensed stock voice ID
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${persona.elevenLabsVoiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
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

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[ElevenLabs TTS Warning] ${response.status}: ${errorText}`);
      // Fallback to client synthesis if quota exceeded or error
      return NextResponse.json({
        fallback: true,
        text: cleanText,
        persona: {
          id: persona.id,
          name: persona.name,
          gender: persona.gender,
          style: persona.style,
        },
        message: "ElevenLabs unavailable, fallback to browser synthesis.",
      });
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save to cache
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
  } catch (error: any) {
    console.error("[interview-tts API Error]:", error);
    return NextResponse.json(
      {
        fallback: true,
        error: error.message || "Failed to process TTS",
      },
      { status: 200 } // Return 200 with fallback flag to prevent client session crash
    );
  }
}
