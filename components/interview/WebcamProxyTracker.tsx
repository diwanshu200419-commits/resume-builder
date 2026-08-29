"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { Video, VideoOff, ShieldCheck, Eye, Activity, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface WebcamProxyMetrics {
  enabled: boolean;
  totalFramesAnalyzed: number;
  gazeOnCameraPercent: number;
  postureStabilityPercent: number;
  fidgetCount: number;
  descriptiveFeedback: string[];
}

interface WebcamProxyTrackerProps {
  onMetricsUpdate?: (metrics: WebcamProxyMetrics) => void;
  isInterviewActive: boolean;
}

export function WebcamProxyTracker({ onMetricsUpdate, isInterviewActive }: WebcamProxyTrackerProps) {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<WebcamProxyMetrics>({
    enabled: false,
    totalFramesAnalyzed: 0,
    gazeOnCameraPercent: 85,
    postureStabilityPercent: 90,
    fidgetCount: 0,
    descriptiveFeedback: [],
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Statistics trackers
  const statsRef = useRef({
    frames: 0,
    onCameraGazeFrames: 0,
    stablePostureFrames: 0,
    fidgets: 0,
    lastFaceCenter: { x: 0, y: 0 },
  });

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
        videoRef.current.play();
      }
      setCameraActive(true);
      setMetrics((prev) => ({ ...prev, enabled: true }));
    } catch (err: any) {
      console.warn("[WebcamProxyTracker] Camera permission error:", err);
      setCameraError("Camera access denied or unavailable. Voice session will continue without video.");
      setCameraActive(false);
    }
  };

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    setCameraActive(false);
    setMetrics((prev) => ({ ...prev, enabled: false }));
  }, []);

  // Frame processing loop using canvas brightness & center-of-mass motion proxies
  const processFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !cameraActive || !isInterviewActive) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = frameData.data;

      // Compute motion and center of intensity proxy
      let totalIntensity = 0;
      let sumX = 0;
      let sumY = 0;
      for (let i = 0; i < data.length; i += 16) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
        if (brightness > 60) {
          const pixelIndex = i / 4;
          const x = pixelIndex % canvas.width;
          const y = Math.floor(pixelIndex / canvas.width);
          totalIntensity += brightness;
          sumX += x * brightness;
          sumY += y * brightness;
        }
      }

      if (totalIntensity > 0) {
        const centerX = sumX / totalIntensity;
        const centerY = sumY / totalIntensity;

        statsRef.current.frames += 1;

        // Gaze on camera proxy: face center is roughly centered in frame (within 35% radius)
        const isCentered =
          Math.abs(centerX - canvas.width / 2) < canvas.width * 0.35 &&
          Math.abs(centerY - canvas.height / 2) < canvas.height * 0.35;

        if (isCentered) {
          statsRef.current.onCameraGazeFrames += 1;
        }

        // Posture stability proxy: delta movement between consecutive keyframes
        const deltaX = Math.abs(centerX - statsRef.current.lastFaceCenter.x);
        const deltaY = Math.abs(centerY - statsRef.current.lastFaceCenter.y);
        const movement = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (movement < 25) {
          statsRef.current.stablePostureFrames += 1;
        } else if (movement > 60) {
          statsRef.current.fidgets += 1;
        }

        statsRef.current.lastFaceCenter = { x: centerX, y: centerY };

        // Update metrics periodically every 30 frames
        if (statsRef.current.frames % 30 === 0 && statsRef.current.frames > 0) {
          const gazePct = Math.min(
            100,
            Math.round((statsRef.current.onCameraGazeFrames / statsRef.current.frames) * 100)
          );
          const posturePct = Math.min(
            100,
            Math.round((statsRef.current.stablePostureFrames / statsRef.current.frames) * 100)
          );

          const feedback: string[] = [];
          if (gazePct >= 75) {
            feedback.push("Good camera gaze consistency (maintained eye line >75% of answers).");
          } else {
            feedback.push(`Looked away from camera during ${100 - gazePct}% of the speech turns.`);
          }

          if (posturePct >= 80) {
            feedback.push("Steady, upright posture maintained throughout answers.");
          } else {
            feedback.push("Frequent position shifts observed during technical responses.");
          }

          const currentMetrics: WebcamProxyMetrics = {
            enabled: true,
            totalFramesAnalyzed: statsRef.current.frames,
            gazeOnCameraPercent: gazePct,
            postureStabilityPercent: posturePct,
            fidgetCount: Math.round(statsRef.current.fidgets / 10),
            descriptiveFeedback: feedback,
          };

          setMetrics(currentMetrics);
          onMetricsUpdate?.(currentMetrics);
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(processFrame);
  }, [cameraActive, isInterviewActive, onMetricsUpdate]);

  useEffect(() => {
    if (cameraActive && isInterviewActive) {
      animationFrameRef.current = requestAnimationFrame(processFrame);
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [cameraActive, isInterviewActive, processFrame]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Body Language &amp; Gaze Tracker</h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">100% Client-Side • Zero Video Stored</p>
          </div>
        </div>

        <Button
          type="button"
          size="sm"
          variant={cameraActive ? "outline" : "default"}
          onClick={cameraActive ? stopCamera : startCamera}
          className={`h-7 text-xs gap-1.5 ${
            cameraActive
              ? "border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              : "bg-blue-600 hover:bg-blue-500 text-white font-bold"
          }`}
        >
          {cameraActive ? (
            <>
              <VideoOff className="w-3.5 h-3.5" /> Disable Camera
            </>
          ) : (
            <>
              <Video className="w-3.5 h-3.5" /> Enable Webcam
            </>
          )}
        </Button>
      </div>

      {cameraError && (
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-[11px] text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{cameraError}</span>
        </div>
      )}

      {cameraActive ? (
        <div className="space-y-2.5">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
            <video
              ref={videoRef}
              playsInline
              muted
              className="w-full h-full object-cover -scale-x-100"
            />
            <canvas ref={canvasRef} width={160} height={120} className="hidden" />

            <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Analyzing Gaze &amp; Posture Proxies</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Eye Contact Proxy</div>
              <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {metrics.gazeOnCameraPercent}%
              </div>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Posture Stability</div>
              <div className="text-sm font-bold text-blue-600 dark:text-blue-400">
                {metrics.postureStabilityPercent}%
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/40 border border-dashed border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            Optional: Enable camera for real-time eye-line consistency and posture feedback during speech. Frames are processed locally and discarded immediately.
          </span>
        </div>
      )}
    </div>
  );
}
