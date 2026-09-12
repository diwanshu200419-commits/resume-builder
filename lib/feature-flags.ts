// lib/feature-flags.ts
//
// Centralized feature flags for VayloAI modules
// Allows independent runtime toggling of new experimental capabilities.

export const FEATURE_FLAGS = {
  // Enables the Multiple-Choice Question (MCQ) role-specific practice mode
  ENABLE_MCQ_MODE: process.env.NEXT_PUBLIC_ENABLE_MCQ_MODE !== "false",

  // Enables MediaPipe WASM facial landmark and pose eye-contact/posture tracker
  ENABLE_MEDIAPIPE_VISION: process.env.NEXT_PUBLIC_ENABLE_MEDIAPIPE_VISION !== "false",

  // Enables English Delivery & Virtual Interview Setup checklist module
  ENABLE_VIRTUAL_COACHING: process.env.NEXT_PUBLIC_ENABLE_VIRTUAL_COACHING !== "false",
};
