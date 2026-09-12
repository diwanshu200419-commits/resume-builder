"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Camera,
  Mic,
  Sun,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Volume2,
} from "lucide-react";
import { VIRTUAL_INTERVIEW_SETUP_RULES } from "@/lib/interview/coaching-rules";

interface PreSessionChecklistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmReady: () => void;
}

export function PreSessionChecklistModal({
  open,
  onOpenChange,
  onConfirmReady,
}: PreSessionChecklistModalProps) {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    "setup-camera-01": true,
    "setup-lighting-01": true,
    "setup-audio-01": true,
    "setup-delivery-01": true,
  });

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "camera":
        return <Camera className="w-4 h-4 text-sky-400" />;
      case "lighting":
        return <Sun className="w-4 h-4 text-amber-400" />;
      case "audio":
        return <Mic className="w-4 h-4 text-emerald-400" />;
      case "delivery":
        return <Sparkles className="w-4 h-4 text-indigo-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl bg-surface border-border text-text-primary p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30 text-[10px] uppercase font-bold">
              Pre-Session Calibration
            </Badge>
          </div>
          <DialogTitle className="text-xl font-bold text-text-primary flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-accent" /> Virtual Interview Readiness Checklist
          </DialogTitle>
          <DialogDescription className="text-xs text-text-secondary">
            Quick 30-second environmental check to guarantee optimal audio transcription and camera posture.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-3">
          {VIRTUAL_INTERVIEW_SETUP_RULES.map((rule) => {
            const isChecked = !!checkedItems[rule.id];
            return (
              <div
                key={rule.id}
                onClick={() => toggleItem(rule.id)}
                className={`p-3.5 rounded-xl border text-xs cursor-pointer transition-all flex items-start gap-3 ${
                  isChecked
                    ? "bg-surface-elevated border-border"
                    : "bg-surface/50 border-border/60 opacity-60"
                }`}
              >
                <div className="pt-0.5">{getCategoryIcon(rule.category)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-text-primary text-xs">{rule.title}</p>
                    <Checkbox
                      checked={isChecked}
                      onCheckedChange={() => toggleItem(rule.id)}
                      className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                    />
                  </div>
                  <p className="text-text-secondary text-[11px] leading-relaxed">{rule.recommendation}</p>
                  <p className="text-text-muted text-[10px] italic">💡 Pro tip: {rule.proTip}</p>
                </div>
              </div>
            );
          })}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <span className="text-[11px] text-text-muted text-center sm:text-left">
            100% Client-Side Video Processing · Zero Video Stored
          </span>
          <Button
            onClick={() => {
              onOpenChange(false);
              onConfirmReady();
            }}
            size="sm"
            className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-white font-bold text-xs gap-1.5 px-6"
          >
            I&apos;m Ready — Launch Session <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
