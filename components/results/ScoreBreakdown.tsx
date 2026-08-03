"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { getScoreColor } from "@/lib/utils";
import { ArrowRight, AlertTriangle, Award, Target, Zap, ShieldCheck } from "lucide-react";

interface ScoreItem {
  label: string;
  before: number;
  after: number;
  subtitle?: string;
}

interface ScoreBreakdownProps {
  scores: ScoreItem[];
  metricFeedback?: string | null;
  structuralFlags?: string[] | null;
}

export function ScoreBreakdown({ scores, metricFeedback, structuralFlags }: ScoreBreakdownProps) {
  const icons: Record<string, any> = {
    "ATS Keyword Match": Target,
    "Metric Density": Zap,
    "Action Verb Strength": Award,
    "Seniority & Scope Match": ShieldCheck,
  };

  return (
    <div className="space-y-4 min-w-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {scores.map((score, i) => {
          const Icon = icons[score.label] || Target;
          return (
            <motion.div
              key={score.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="min-w-0"
            >
              <Card className="border-border bg-surface hover:border-accent/30 transition-all min-w-0 shadow-sm">
                <CardContent className="p-3.5 sm:p-4 space-y-2 min-w-0">
                  <div className="flex items-center justify-between min-w-0">
                    <p className="text-xs font-semibold text-text-secondary flex items-center gap-1.5 min-w-0">
                      <Icon className="w-3.5 h-3.5 text-accent shrink-0" />
                      <span className="truncate">{score.label}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold" style={{ color: getScoreColor(score.before) }}>
                      {score.before}%
                    </span>
                    <ArrowRight className="w-3 h-3 text-text-muted shrink-0" />
                    <span className="text-base sm:text-lg font-bold" style={{ color: getScoreColor(score.after) }}>
                      {score.after}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* FAANG Metric Density Feedback Banner */}
      {metricFeedback && (
        <div className="p-3.5 rounded-xl bg-accent/10 border border-accent/25 text-xs text-text-primary flex items-start gap-2.5 min-w-0">
          <Zap className="w-4 h-4 text-accent shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1 leading-relaxed break-word-safe">
            <span className="font-bold text-accent">FAANG Metric Density Insight: </span>
            <span>{metricFeedback}</span>
          </div>
        </div>
      )}

      {/* Structural Red Flags Indicator */}
      {structuralFlags && (
        <div className="p-3.5 rounded-xl bg-surface-elevated border border-border text-xs space-y-1.5 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 font-bold text-text-primary">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-success shrink-0" /> Structural &amp; ATS Parser Check
            </span>
            <span className={structuralFlags.length === 0 ? "text-success font-semibold text-xs" : "text-warning font-semibold text-xs"}>
              {structuralFlags.length === 0 ? "PASSED (0 Red Flags)" : `${structuralFlags.length} Alert(s)`}
            </span>
          </div>
          {structuralFlags.length > 0 && (
            <ul className="list-disc list-inside text-text-secondary space-y-1 pt-1">
              {structuralFlags.map((flag, idx) => (
                <li key={idx} className="text-warning flex items-start gap-1 text-[11px] leading-relaxed break-word-safe">
                  <AlertTriangle className="w-3.5 h-3.5 text-warning shrink-0 mt-0.5" /> <span>{flag}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
