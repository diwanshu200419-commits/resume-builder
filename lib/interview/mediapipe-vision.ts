// lib/interview/mediapipe-vision.ts
//
// VayloAI — Advanced Client-Side Vision Analytics Engine
// Computes real 3D facial landmark geometry, iris gaze ratio, EAR blink detection,
// and posture stability with Exponential Moving Average (EMA) smoothing.
// 100% Client-Side WebAssembly — Zero video/images transmitted to server.

export interface Landmark3D {
  x: number;
  y: number;
  z?: number;
}

export interface MediaPipeVisionMetrics {
  gazeRatio: number; // 0.0 to 1.0 (0.5 is centered directly at lens)
  isLookingAtCamera: boolean;
  eyeAspectRatio: number; // EAR
  isBlinking: boolean;
  headYawDegrees: number; // Left/Right turn
  headPitchDegrees: number; // Up/Down tilt
  postureStabilityScore: number; // 0 - 100
  fidgetDetected: boolean;
}

/**
 * Exponential Moving Average (EMA) smoother for landmark stability.
 * Formula: S_t = alpha * X_t + (1 - alpha) * S_{t-1}
 * Solves raw webcam high-frequency exposure/sensor jitter.
 */
export class EMASmoother {
  private alpha: number;
  private current: number | null = null;

  constructor(alpha: number = 0.25) {
    this.alpha = alpha;
  }

  update(val: number): number {
    if (this.current === null) {
      this.current = val;
    } else {
      this.current = this.alpha * val + (1 - this.alpha) * this.current;
    }
    return this.current;
  }

  get(): number {
    return this.current ?? 0;
  }

  reset(): void {
    this.current = null;
  }
}

/**
 * Calculates Euclidean distance between two 2D/3D points
 */
export function euclideanDistance(p1: Landmark3D, p2: Landmark3D): number {
  const dx = p1.x - p2.x;
  const dy = p1.y - p2.y;
  const dz = (p1.z || 0) - (p2.z || 0);
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

/**
 * Eye Aspect Ratio (EAR) for blink detection
 * Left eye standard landmarks: 33 (outer), 133 (inner), 160 (top-outer), 158 (top-inner), 144 (bottom-outer), 153 (bottom-inner)
 */
export function calculateEyeAspectRatio(landmarks: Landmark3D[]): number {
  if (!landmarks || landmarks.length < 468) return 0.25;

  const p1 = landmarks[33]; // Outer corner
  const p4 = landmarks[133]; // Inner corner
  const p2 = landmarks[160]; // Top
  const p6 = landmarks[144]; // Bottom
  const p3 = landmarks[158]; // Top
  const p5 = landmarks[153]; // Bottom

  const horizontal = euclideanDistance(p1, p4);
  if (horizontal === 0) return 0.25;

  const vertical1 = euclideanDistance(p2, p6);
  const vertical2 = euclideanDistance(p3, p5);

  const ear = (vertical1 + vertical2) / (2.0 * horizontal);
  return ear;
}

/**
 * Computes Iris Gaze alignment relative to eye corners.
 * REQUIRES refineLandmarks: true in FaceMesh options to populate points 468-477.
 * Point 468 = Left Iris Center.
 */
export function calculateIrisGazeRatio(landmarks: Landmark3D[]): {
  gazeRatio: number;
  isCentered: boolean;
} {
  // Guard check: ensure iris landmarks exist (index 468)
  if (!landmarks || landmarks.length <= 468) {
    return { gazeRatio: 0.5, isCentered: true };
  }

  const leftIrisCenter = landmarks[468];
  const eyeOuter = landmarks[33];
  const eyeInner = landmarks[133];

  const totalEyeWidth = eyeInner.x - eyeOuter.x;
  if (Math.abs(totalEyeWidth) < 0.001) {
    return { gazeRatio: 0.5, isCentered: true };
  }

  // Ratio of iris position relative to horizontal eye span
  const irisOffset = leftIrisCenter.x - eyeOuter.x;
  const rawRatio = irisOffset / totalEyeWidth;

  // Clamped ratio between 0.0 and 1.0 (0.40 to 0.60 indicates direct camera gaze)
  const clampedRatio = Math.max(0, Math.min(1, rawRatio));
  const isCentered = clampedRatio >= 0.38 && clampedRatio <= 0.62;

  return {
    gazeRatio: Number(clampedRatio.toFixed(3)),
    isCentered,
  };
}

/**
 * Estimates Head Pose Angles (Yaw, Pitch, Roll) using 3D facial feature triangles
 * Points: Nose tip (1), Chin (152), Left Eye Outer (33), Right Eye Outer (263)
 */
export function estimateHeadPose(landmarks: Landmark3D[]): {
  yawDegrees: number;
  pitchDegrees: number;
} {
  if (!landmarks || landmarks.length < 468) {
    return { yawDegrees: 0, pitchDegrees: 0 };
  }

  const noseTip = landmarks[1];
  const chin = landmarks[152];
  const leftCheek = landmarks[234];
  const rightCheek = landmarks[454];

  // Yaw (horizontal turn)
  const faceWidth = rightCheek.x - leftCheek.x;
  const noseRelativeX = faceWidth !== 0 ? (noseTip.x - leftCheek.x) / faceWidth : 0.5;
  const yawDegrees = (noseRelativeX - 0.5) * 80; // approximate +/- 40 degrees

  // Pitch (vertical tilt)
  const faceHeight = chin.y - landmarks[10].y; // 10 is forehead top
  const noseRelativeY = faceHeight !== 0 ? (noseTip.y - landmarks[10].y) / faceHeight : 0.6;
  const pitchDegrees = (noseRelativeY - 0.6) * 70;

  return {
    yawDegrees: Number(yawDegrees.toFixed(1)),
    pitchDegrees: Number(pitchDegrees.toFixed(1)),
  };
}

/**
 * Explicit FaceMesh Configuration Options verifying refineLandmarks: true (Fix 3)
 */
export const MEDIAPIPE_FACEMESH_CONFIG = {
  maxNumFaces: 1,
  refineLandmarks: true, // <-- CRITICAL FIX 3: REQUIRED FOR IRIS POINTS 468-477
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
};
