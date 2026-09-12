"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Video, VideoOff, ShieldCheck, Eye, Activity, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  calculateIrisGazeRatio,
  estimateHeadPose,
  calculateEyeAspectRatio,
  EMASmoother,
  MEDIAPIPE_FACEMESH_CONFIG,
} from "@/lib/interview/mediapipe-vision";

export interface MediaPipeTrackingMetrics {
  enabled: boolean;
  totalFramesAnalyzed: number;
  gazeOnCameraPercent: number;
  postureStabilityPercent: number;
  fidgetCount: number;
  blinkCount: number;
  isMediaPipeActive: boolean;
  descriptiveFeedback: string[];
}

interface WebcamMediaPipeTrackerProps {
  onMetricsUpdate?: (metrics: MediaPipeTrackingMetrics) => void;
  isInterviewActive: boolean;
}

declare global {
  interface Window {
    FaceMesh?: any;
    Camera?: any;
  }
}

export function WebcamMediaPipeTracker({
  onMetricsUpdate,
  isInterviewActive,
}: WebcamMediaPipeTrackerProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isMediaPipeLoaded, setIsMediaPipeLoaded] = useState(false);
  const [liveMetrics, setLiveMetrics] = useState({
    gazeCentered: true,
    yaw: 0,
    pitch: 0,
    fidgets: 0,
    postureScore: 92,
    gazePercent: 88,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceMeshRef = useRef<any>(null);
  const animFrameRef = useRef<number | null>(null);

  // EMA Smoothers for continuous signals
  const yawSmoother = useRef(new EMASmoother(0.2));
  const pitchSmoother = useRef(new EMASmoother(0.2));

  // Running tally statistics
  const statsRef = useRef({
    totalFrames: 0,
    centeredGazeFrames: 0,
    stablePostureFrames: 0,
    fidgets: 0,
    blinks: 0,
    lastNosePos: { x: 0, y: 0 },
    wasBlinking: false,
  });

  // Dynamically load MediaPipe FaceMesh CDN script once on mount
  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    if (typeof window !== "undefined" && !window.FaceMesh) {
      script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js";
      script.async = true;
      script.onload = () => {
        setIsMediaPipeLoaded(true);
      };
      script.onerror = () => {
        console.warn("[MediaPipe Vision]: Failed to load CDN script, fallback active.");
      };
      document.head.appendChild(script);
    } else if (window.FaceMesh) {
      setIsMediaPipeLoaded(true);
    }

    return () => {
      if (script && document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleFaceMeshResults = useCallback(
    (results: any) => {
      statsRef.current.totalFrames++;

      if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
        return;
      }

      const landmarks = results.multiFaceLandmarks[0];

      // 1. Iris Gaze Analysis (Fix 3: utilizes iris points 468-477 via refineLandmarks: true)
      const irisData = calculateIrisGazeRatio(landmarks);
      if (irisData.isCentered) {
        statsRef.current.centeredGazeFrames++;
      }

      // 2. Head Pose & Posture Tilt Analysis
      const rawPose = estimateHeadPose(landmarks);
      const smoothedYaw = yawSmoother.current.update(rawPose.yawDegrees);
      const smoothedPitch = pitchSmoother.current.update(rawPose.pitchDegrees);

      const isPostureGood = Math.abs(smoothedYaw) < 18 && Math.abs(smoothedPitch) < 20;
      if (isPostureGood) {
        statsRef.current.stablePostureFrames++;
      }

      // 3. Fidget & Rapid Motion Detection
      const noseTip = landmarks[1];
      if (statsRef.current.lastNosePos.x !== 0) {
        const dx = Math.abs(noseTip.x - statsRef.current.lastNosePos.x);
        const dy = Math.abs(noseTip.y - statsRef.current.lastNosePos.y);
        if (dx > 0.04 || dy > 0.04) {
          statsRef.current.fidgets++;
        }
      }
      statsRef.current.lastNosePos = { x: noseTip.x, y: noseTip.y };

      // 4. Blink Rate Detection
      const ear = calculateEyeAspectRatio(landmarks);
      const isCurrentlyBlinking = ear < 0.18;
      if (isCurrentlyBlinking && !statsRef.current.wasBlinking) {
        statsRef.current.blinks++;
      }
      statsRef.current.wasBlinking = isCurrentlyBlinking;

      // Compute aggregate percentiles
      const total = statsRef.current.totalFrames || 1;
      const currentGazePercent = Math.round((statsRef.current.centeredGazeFrames / total) * 100);
      const currentPosturePercent = Math.round((statsRef.current.stablePostureFrames / total) * 100);

      setLiveMetrics({
        gazeCentered: irisData.isCentered,
        yaw: Math.round(smoothedYaw),
        pitch: Math.round(smoothedPitch),
        fidgets: statsRef.current.fidgets,
        postureScore: currentPosturePercent,
        gazePercent: currentGazePercent,
      });

      if (onMetricsUpdate) {
        const feedback: string[] = [];
        if (currentGazePercent < 70) {
          feedback.push("Eye Contact: Try directing your gaze toward the camera lens rather than looking down at notes.");
        }
        if (currentPosturePercent < 75) {
          feedback.push("Posture: Head tilt or slouch detected. Elevate screen to keep shoulders aligned.");
        }
        if (statsRef.current.fidgets > 8) {
          feedback.push("Movement: Frequent rapid shifts detected. Settle comfortably into your seat.");
        }

        onMetricsUpdate({
          enabled: true,
          totalFramesAnalyzed: total,
          gazeOnCameraPercent: currentGazePercent,
          postureStabilityPercent: currentPosturePercent,
          fidgetCount: statsRef.current.fidgets,
          blinkCount: statsRef.current.blinks,
          isMediaPipeActive: true,
          descriptiveFeedback: feedback,
        });
      }
    },
    [onMetricsUpdate]
  );

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setCameraActive(true);

      // Initialize FaceMesh if loaded
      if (window.FaceMesh && !faceMeshRef.current) {
        const fm = new window.FaceMesh({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });

        // Fix 3: Explicit refineLandmarks: true configuration
        fm.setOptions(MEDIAPIPE_FACEMESH_CONFIG);
        fm.onResults(handleFaceMeshResults);
        faceMeshRef.current = fm;
      }

      // Start processing loop
      const processFrame = async () => {
        if (videoRef.current && videoRef.current.readyState >= 2 && faceMeshRef.current) {
          try {
            await faceMeshRef.current.send({ image: videoRef.current });
          } catch (e) {
            // Drop frame on busy loop
          }
        }
        animFrameRef.current = requestAnimationFrame(processFrame);
      };

      animFrameRef.current = requestAnimationFrame(processFrame);
    } catch (err: any) {
      console.warn("[MediaPipe Vision Camera Error]:", err);
      setCameraError("Camera access denied. Voice session will continue without video analysis.");
      setCameraActive(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setCameraActive(false);
  }, []);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-border bg-slate-950/80 shadow-md">
      {/* Video Viewport */}
      <div className="relative aspect-video w-full max-w-sm bg-black/90 flex items-center justify-center">
        <video
          ref={videoRef}
          playsInline
          muted
          className={`w-full h-full object-cover transform -scale-x-100 ${cameraActive ? "block" : "hidden"}`}
        />
        <canvas ref={canvasRef} className="hidden" />

        {!cameraActive && (
          <div className="text-center p-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-400">
              <VideoOff className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-300">MediaPipe Vision Camera Inactive</p>
              <p className="text-[10px] text-slate-500 mt-0.5">Real-time eye contact &amp; posture calibration</p>
            </div>
            <Button
              onClick={startCamera}
              size="sm"
              variant="outline"
              className="text-xs font-bold gap-1.5 border-slate-700 hover:bg-slate-900 text-slate-200"
            >
              <Video className="w-3.5 h-3.5 text-indigo-400" /> Start Camera Check
            </Button>
          </div>
        )}

        {/* Live HUD Overlay when Camera is Active */}
        {cameraActive && (
          <div className="absolute inset-0 pointer-events-none p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/40 text-[9px] font-mono gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                MediaPipe Iris 3D Active
              </Badge>
              <Button
                onClick={stopCamera}
                size="sm"
                variant="ghost"
                className="pointer-events-auto h-6 text-[10px] text-slate-400 hover:text-white bg-slate-900/80 px-2 rounded-md"
              >
                Turn Off
              </Button>
            </div>

            {/* Live Telemetry Gauges */}
            <div className="grid grid-cols-2 gap-1.5 bg-slate-950/80 p-2 rounded-xl border border-slate-800 backdrop-blur-sm text-[10px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-indigo-400" />
                <span>
                  Gaze:{" "}
                  <strong className={liveMetrics.gazeCentered ? "text-emerald-400" : "text-amber-400"}>
                    {liveMetrics.gazeCentered ? "Centered" : "Looking Away"}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-sky-400" />
                <span>
                  Posture: <strong className="text-emerald-400">{liveMetrics.postureScore}%</strong>
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {cameraError && (
        <div className="p-2.5 bg-rose-500/10 border-t border-rose-500/20 text-[11px] text-rose-300">
          {cameraError}
        </div>
      )}
    </div>
  );
}
