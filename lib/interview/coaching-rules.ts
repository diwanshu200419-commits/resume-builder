// lib/interview/coaching-rules.ts
//
// VayloAI — English Delivery & Virtual Interview Coaching Engine
// Implements neutral, evidence-based pacing feedback without unsupported behavioral assumptions.

export interface VirtualSetupChecklistItem {
  id: string;
  category: "camera" | "audio" | "lighting" | "delivery";
  title: string;
  recommendation: string;
  proTip: string;
}

export const VIRTUAL_INTERVIEW_SETUP_RULES: VirtualSetupChecklistItem[] = [
  {
    id: "setup-camera-01",
    category: "camera",
    title: "Camera Eye-Level Alignment",
    recommendation: "Elevate your laptop or external webcam so the lens is directly level with your eyes.",
    proTip: "Looking down at a low laptop creates an unintentional slouch and makes direct eye contact with the interviewer difficult."
  },
  {
    id: "setup-lighting-01",
    category: "lighting",
    title: "Frontal Balanced Lighting",
    recommendation: "Position your primary light source (window or soft desk lamp) in front of your face, never directly behind you.",
    proTip: "Backlighting turns your video into a silhouette, obscuring facial expressions and engagement cues."
  },
  {
    id: "setup-audio-01",
    category: "audio",
    title: "Microphone Proximity & Echo Reduction",
    recommendation: "Use a dedicated headset or directional microphone positioned 4–6 inches from your mouth.",
    proTip: "Built-in laptop microphones pick up keyboard taps and fan acoustics, reducing speech clarity in automated evaluation."
  },
  {
    id: "setup-delivery-01",
    category: "delivery",
    title: "Structured Framing Anchors",
    recommendation: "Begin complex answers with a 5-second structural preview (e.g. 'I approached this in three phases: diagnosis, mitigation, and long-term automation').",
    proTip: "A clear structural signpost gives you mental breathing room to organize technical details without relying on vocal fillers."
  }
];

export interface DeliveryPacingObservation {
  pauseLengthSeconds: number;
  isProlongedPause: boolean;
  neutralFeedbackTip: string;
}

/**
 * Evaluates answer initiation latency neutrally without diagnosing personal language background.
 * Follows Fix 1: Strictly observable pacing metrics without psycholinguistic inferences.
 */
export function evaluateAnswerPacing(pauseLengthSeconds: number): DeliveryPacingObservation {
  const isProlonged = pauseLengthSeconds > 3.5;

  let tip = "Smooth response initiation. You transitioned into your answer with good conversational rhythm.";
  
  if (isProlonged) {
    tip = "Longer pause detected before this answer (> 3.5s). Consider using an immediate conversational anchor ('That is a critical system trade-off; let me break down how I approached it...') to maintain momentum while framing your solution.";
  } else if (pauseLengthSeconds < 0.5) {
    tip = "Immediate response detected (< 0.5s). Taking a brief 1-to-2 second pause before answering demonstrates thoughtful composure and avoids talking over the interviewer.";
  }

  return {
    pauseLengthSeconds,
    isProlongedPause: isProlonged,
    neutralFeedbackTip: tip,
  };
}
