// lib/interview/voice-personas.ts
//
// Vaylo AI — Voice Interviewer Personas
// Uses licensed stock synthetic voices from official provider libraries (ElevenLabs / Azure / Web Speech)
// No impersonation or cloning of private identifiable individuals.

export interface VoicePersona {
  id: "adam_formal" | "josh_neutral" | "rachel_warm" | "bella_neutral";
  name: string;
  label: string;
  gender: "male" | "female";
  style: "formal" | "neutral" | "warm";
  elevenLabsVoiceId: string;
  azureVoiceName?: string;
  piperVoiceModel: string; // Open-Source self-hosted Piper TTS model identifier
  tagline: string;
  description: string;
  bestFor: string;
  greeting: string;
  avatarColor: string;
}

export const INTERVIEWER_PERSONAS: Record<string, VoicePersona> = {
  adam_formal: {
    id: "adam_formal",
    name: "Adam",
    label: "Adam — Direct & Formal",
    gender: "male",
    style: "formal",
    elevenLabsVoiceId: "pNInz6obpgDQGcFmaJgB", // ElevenLabs official stock voice: Adam
    azureVoiceName: "en-US-GuyNeural",
    piperVoiceModel: "en_US-ryan-high", // Piper neural open-source voice
    tagline: "Direct, authoritative, structured evaluation",
    description: "Deep, rigorous executive interviewer tone. Evaluates architectural depth, leadership decisions, and high-impact metrics.",
    bestFor: "Executive & Staff roles, Leadership rounds, Bar-raiser evaluations",
    greeting: "Welcome. Let's begin your evaluation. I'll ask direct scenario and domain questions — be concise and support your answers with specific metrics.",
    avatarColor: "#3b82f6",
  },
  josh_neutral: {
    id: "josh_neutral",
    name: "Josh",
    label: "Josh — Neutral Professional",
    gender: "male",
    style: "neutral",
    elevenLabsVoiceId: "TxGEqnHWrfWFTfGW9XjX", // ElevenLabs official stock voice: Josh
    azureVoiceName: "en-US-DavisNeural",
    piperVoiceModel: "en_US-lessac-medium", // Piper neural open-source voice
    tagline: "Calm, objective, technical peer interviewer",
    description: "Clear, conversational professional cadence. Focuses on practical problem-solving and domain knowledge.",
    bestFor: "Standard technical loops, Engineering, Product & Strategy rounds",
    greeting: "Hi there. Thanks for joining today's session. We'll go through a few core technical and behavioral scenarios to explore your background.",
    avatarColor: "#10b981",
  },
  rachel_warm: {
    id: "rachel_warm",
    name: "Rachel",
    label: "Rachel — Warm & Encouraging",
    gender: "female",
    style: "warm",
    elevenLabsVoiceId: "21m00Tcm4TlvDq8ikWAM", // ElevenLabs official stock voice: Rachel
    azureVoiceName: "en-US-JennyNeural",
    piperVoiceModel: "en_US-amy-medium", // Piper neural open-source voice
    tagline: "Supportive, friendly, confidence-building mentor",
    description: "Friendly, low-intimidation interviewer. Helps candidates overcome interview anxiety and articulate their best experiences.",
    bestFor: "Entry-level roles, Campus placements, First-time practice sessions",
    greeting: "Hello! Don't worry about being nervous today — treat this as a collaborative conversation to highlight your strengths and projects.",
    avatarColor: "#ec4899",
  },
  bella_neutral: {
    id: "bella_neutral",
    name: "Bella",
    label: "Bella — Neutral Professional",
    gender: "female",
    style: "neutral",
    elevenLabsVoiceId: "EXAVITQu4vr4xnSDxMaL", // ElevenLabs official stock voice: Bella
    azureVoiceName: "en-US-AriaNeural",
    piperVoiceModel: "en_US-libritts-high", // Piper neural open-source voice
    tagline: "Crisp, balanced, culture & situational evaluator",
    description: "Balanced, articulate female interviewer. Great for behavioral scenarios, cross-functional collaboration, and values alignment.",
    bestFor: "Behavioral rounds, Culture fit, Cross-functional & Consulting interviews",
    greeting: "Welcome. Today we will explore your approach to teamwork, situational conflict resolution, and key career achievements.",
    avatarColor: "#8b5cf6",
  },
};

export const DEFAULT_PERSONA_ID = "josh_neutral";

export function getPersona(id?: string): VoicePersona {
  if (id && id in INTERVIEWER_PERSONAS) {
    return INTERVIEWER_PERSONAS[id as keyof typeof INTERVIEWER_PERSONAS];
  }
  return INTERVIEWER_PERSONAS[DEFAULT_PERSONA_ID];
}
