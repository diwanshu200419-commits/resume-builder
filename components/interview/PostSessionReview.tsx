// components/interview/PostSessionReview.tsx
//
// Vaylo AI — Executive Post-Session Review & STAR Coaching Guidance Component
// Delivers deep pedagogical feedback, turn-by-turn STAR breakdowns, suggested rewrites, and trend analytics.

"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  ArrowRight,
  TrendingUp,
  Clock,
  Eye,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  HelpCircle,
  Zap,
} from "lucide-react";
import { InterviewTurn, STAREvaluation } from "@/lib/interview/conversation-engine";
import { VoicePersona } from "@/lib/interview/voice-personas";
import { WebcamProxyMetrics } from "./WebcamProxyTracker";
import { createClient } from "@/lib/supabase/client";
import { saveInterviewSessionToCloud } from "@/lib/interview/history-sync";
import { Cloud, CloudOff, Loader2 } from "lucide-react";

export interface QuestionReviewItem {
  questionIndex: number;
  questionText: string;
  questionType: string;
  candidateAnswerTranscript: string;
  followUpAsked?: string;
  followUpAnswerTranscript?: string;
  score: number;
  wordCount: number;
  starBreakdown: {
    situation: { present: boolean; note: string };
    task: { present: boolean; note: string };
    action: { present: boolean; note: string };
    result: { present: boolean; note: string };
  };
  strengthNote: string;
  improvementNote: string;
  suggestedRewrite: string;
}

export interface SessionSummaryData {
  id: string;
  date: string;
  role: string;
  seniority: string;
  persona: VoicePersona;
  overallScore: number;
  fillerWordDensity: number;
  speakingPaceWpm: number;
  totalWords: number;
  verdict: string;
  webcamMetrics?: WebcamProxyMetrics | null;
  turns: InterviewTurn[];
  questionReviews: QuestionReviewItem[];
  topFocusAreas: string[];
  completed?: boolean;
}

interface PostSessionReviewProps {
  sessionData: SessionSummaryData;
  onPracticeAgain: () => void;
  onChangeRole: () => void;
  onViewHistory?: () => void;
}

export function PostSessionReview({
  sessionData,
  onPracticeAgain,
  onChangeRole,
  onViewHistory,
}: PostSessionReviewProps) {
  const [expandedQuestionIdx, setExpandedQuestionIdx] = useState<number | null>(0);
  const [syncStatus, setSyncStatus] = useState<"synced" | "saving" | "local_only">("saving");
  const [userId, setUserId] = useState<string | null>(null);

  const {
    role,
    seniority,
    persona,
    overallScore,
    fillerWordDensity,
    speakingPaceWpm,
    verdict,
    webcamMetrics,
    questionReviews,
    topFocusAreas,
  } = sessionData;

  // Auto-sync session to Supabase on mount
  useEffect(() => {
    let isMounted = true;
    const supabase = createClient();

    async function persist() {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const currentUserId = authData?.user?.id || null;
        if (isMounted) setUserId(currentUserId);

        const res = await saveInterviewSessionToCloud(supabase, currentUserId, {
          id: sessionData.id,
          role: sessionData.role,
          seniority: sessionData.seniority,
          personaId: sessionData.persona.id,
          turns: sessionData.turns,
          questionReviews: sessionData.questionReviews,
          overallScore: sessionData.overallScore,
          fillerWordDensity: sessionData.fillerWordDensity,
          speakingPaceWpm: sessionData.speakingPaceWpm,
          webcamMetrics: sessionData.webcamMetrics,
          completed: sessionData.completed !== false,
        });

        if (isMounted) {
          setSyncStatus(res.source === "supabase" ? "synced" : "local_only");
        }
      } catch (err) {
        console.warn("[PostSessionReview] Sync error:", err);
        if (isMounted) setSyncStatus("local_only");
      }
    }

    persist();

    return () => {
      isMounted = false;
    };
  }, [sessionData]);

  const toggleAccordion = (idx: number) => {
    setExpandedQuestionIdx((prev) => (prev === idx ? null : idx));
  };

  const handleManualSave = async () => {
    setSyncStatus("saving");
    const supabase = createClient();
    const res = await saveInterviewSessionToCloud(supabase, userId, {
      id: sessionData.id,
      role: sessionData.role,
      seniority: sessionData.seniority,
      personaId: sessionData.persona.id,
      turns: sessionData.turns,
      questionReviews: sessionData.questionReviews,
      overallScore: sessionData.overallScore,
      fillerWordDensity: sessionData.fillerWordDensity,
      speakingPaceWpm: sessionData.speakingPaceWpm,
      webcamMetrics: sessionData.webcamMetrics,
      completed: sessionData.completed !== false,
    });
    setSyncStatus(res.source === "supabase" ? "synced" : "local_only");
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16 animate-in fade-in slide-in-from-bottom-2">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 text-white shadow-2xl">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-xs px-3 py-1 font-bold">
              🎉 Session Completed
            </Badge>
            <Badge variant="outline" className="text-xs text-slate-300 border-slate-700">
              Interviewer: {persona.name} ({persona.style})
            </Badge>
            {syncStatus === "synced" ? (
              <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/40 bg-emerald-950/30 flex items-center gap-1">
                <Cloud className="w-3 h-3" /> Account Synced
              </Badge>
            ) : syncStatus === "saving" ? (
              <Badge variant="outline" className="text-[10px] text-blue-400 border-blue-500/40 bg-blue-950/30 flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Syncing to Account...
              </Badge>
            ) : (
              <Badge variant="outline" className="text-[10px] text-amber-400 border-amber-500/40 bg-amber-950/30 flex items-center gap-1">
                <CloudOff className="w-3 h-3" /> Local Session Cache
              </Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Interview Coaching &amp; STAR Scorecard
          </h1>
          <p className="text-sm text-slate-300">
            Target Role: <span className="font-semibold text-white">{role}</span> ({seniority}) • {questionReviews.length} Questions Evaluated
          </p>
          <div className="pt-2 text-emerald-400 text-xs sm:text-sm font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{verdict}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
          <Button
            onClick={onPracticeAgain}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-5 rounded-xl shadow-lg shadow-emerald-600/30 gap-2 text-xs sm:text-sm"
          >
            <RotateCcw className="w-4 h-4" /> Practice Fresh Round
          </Button>
          <Button
            onClick={handleManualSave}
            variant="outline"
            className="border-slate-700 text-white hover:bg-slate-800 text-xs gap-1.5"
          >
            <Bookmark className="w-3.5 h-3.5" />
            {syncStatus === "synced" ? "Saved to Account ✓" : syncStatus === "saving" ? "Saving..." : "Save Session"}
          </Button>
        </div>
      </div>

      {/* A. Overall Session Scorecard Overview Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>STAR Structure</span>
            <Trophy className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {overallScore}<span className="text-xs text-slate-400 font-normal">/100</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Weighted STAR mastery</p>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Filler Density</span>
            <MessageSquare className="w-4 h-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              {fillerWordDensity}%
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Target: &lt; 3% vocal fillers</p>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Speaking Pace</span>
            <Clock className="w-4 h-4 text-purple-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600 dark:text-purple-400">
              {speakingPaceWpm} <span className="text-xs text-slate-400 font-normal">WPM</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">Ideal: 130–160 WPM</p>
          </div>
        </Card>

        <Card className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Camera Presence</span>
            <Eye className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">
              {webcamMetrics?.enabled ? `${webcamMetrics.gazeOnCameraPercent}%` : "Opted Out"}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {webcamMetrics?.enabled ? `Posture: ${webcamMetrics.postureStabilityPercent}%` : "Camera was off"}
            </p>
          </div>
        </Card>
      </div>

      {/* C. Top 3 Focus Areas (High Impact Actionable Guidance) */}
      <Card className="p-5 sm:p-6 bg-gradient-to-br from-indigo-950/20 via-slate-900 to-slate-900 border border-indigo-500/30 rounded-3xl shadow-md space-y-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white">Top 3 High-Impact Focus Areas</h2>
            <p className="text-xs text-slate-400">Synthesized across your entire session for immediate interview improvement</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {topFocusAreas.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-400 border border-indigo-500/40 text-xs font-bold flex items-center justify-center">
                  #{idx + 1}
                </span>
                <span className="text-xs font-bold text-slate-200">Priority {idx + 1}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">{item}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* B. Question-by-Question Deep Dive Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Question-by-Question Coaching Analysis</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Expand each question to see granular STAR rubric verification, real-detail preservation, and suggested rewrites.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">{questionReviews.length} Total Questions</span>
        </div>

        <div className="space-y-3">
          {questionReviews.map((q, idx) => {
            const isExpanded = expandedQuestionIdx === idx;
            return (
              <Card
                key={idx}
                className={`border rounded-2xl transition-all overflow-hidden ${
                  isExpanded
                    ? "bg-white dark:bg-slate-900 border-blue-500 shadow-md ring-1 ring-blue-500/40"
                    : "bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                {/* Header Clickable Row */}
                <div
                  onClick={() => toggleAccordion(idx)}
                  className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none gap-3"
                >
                  <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                    <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                      Q{idx + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-[10px] uppercase font-mono px-1.5 py-0">
                          {q.questionType}
                        </Badge>
                        <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          "{q.questionText}"
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Badge
                      className={`text-xs font-bold px-2.5 py-0.5 ${
                        q.score >= 80
                          ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                          : q.score >= 60
                          ? "bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30"
                          : "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30"
                      }`}
                    >
                      {q.score}/100
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Accordion Body */}
                {isExpanded && (
                  <div className="px-4 pb-5 sm:px-6 sm:pb-6 space-y-5 border-t border-slate-100 dark:border-slate-800 pt-4 bg-slate-50/50 dark:bg-slate-950/40">
                    {/* Spoken Answer Transcript */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Your Spoken Answer
                      </div>
                      <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-700 dark:text-slate-300 italic leading-relaxed">
                        "{q.candidateAnswerTranscript || "No verbal transcript recorded."}"
                      </div>
                    </div>

                    {/* Conversational Follow-Up (If triggered) */}
                    {q.followUpAsked && (
                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                        <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                          <Zap className="w-3.5 h-3.5" /> Follow-Up Probed by {persona.name}: "{q.followUpAsked}"
                        </div>
                        {q.followUpAnswerTranscript && (
                          <div className="text-slate-700 dark:text-slate-300 italic pl-5">
                            Your Clarification: "{q.followUpAnswerTranscript}"
                          </div>
                        )}
                      </div>
                    )}

                    {/* STAR Component Matrix */}
                    <div className="space-y-2">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        STAR Framework Component Verification
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white">Situation</span>
                            {q.starBreakdown.situation.present ? (
                              <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Verified ✓</Badge>
                            ) : (
                              <Badge className="bg-rose-500/20 text-rose-400 text-[10px]">Missing Context</Badge>
                            )}
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">{q.starBreakdown.situation.note}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white">Task</span>
                            {q.starBreakdown.task.present ? (
                              <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Verified ✓</Badge>
                            ) : (
                              <Badge className="bg-rose-500/20 text-rose-400 text-[10px]">Goal Unclear</Badge>
                            )}
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">{q.starBreakdown.task.note}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white">Action</span>
                            {q.starBreakdown.action.present ? (
                              <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Verified ✓</Badge>
                            ) : (
                              <Badge className="bg-rose-500/20 text-rose-400 text-[10px]">Need Personal Actions</Badge>
                            )}
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">{q.starBreakdown.action.note}</p>
                        </div>

                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 dark:text-white">Result</span>
                            {q.starBreakdown.result.present ? (
                              <Badge className="bg-emerald-500/20 text-emerald-400 text-[10px]">Verified ✓</Badge>
                            ) : (
                              <Badge className="bg-rose-500/20 text-rose-400 text-[10px]">Missing Metric</Badge>
                            )}
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">{q.starBreakdown.result.note}</p>
                        </div>
                      </div>
                    </div>

                    {/* Specific Strength & Improvement Notes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-1">
                        <div className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Specific Strength
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{q.strengthNote}</p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1">
                        <div className="font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-500" /> Actionable Fix
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{q.improvementNote}</p>
                      </div>
                    </div>

                    {/* Suggested Fact-Preserving Rewrite */}
                    {q.suggestedRewrite && (
                      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs space-y-2">
                        <div className="font-bold text-indigo-400 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
                          <Sparkles className="w-3.5 h-3.5" /> High-Impact Fact-Preserving Rewrite Model
                        </div>
                        <p className="text-slate-200 dark:text-slate-200 leading-relaxed italic">
                          "{q.suggestedRewrite}"
                        </p>
                        <div className="text-[10px] text-indigo-300/80">
                          ℹ️ Preserves your actual facts while elevating STAR structure, active verbs, and quantifiable clarity.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>

      {/* D. Clear Next Steps Navigation Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Ready for your next milestone?</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Continue drilling until your STAR structure and filler density reach interview-ready thresholds.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={onChangeRole}
            variant="outline"
            className="text-xs border-slate-300 dark:border-slate-700"
          >
            Change Role / Domain
          </Button>
          {onViewHistory && (
            <Button
              onClick={onViewHistory}
              variant="outline"
              className="text-xs border-slate-300 dark:border-slate-700 gap-1.5"
            >
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" /> My Interview History
            </Button>
          )}
          <Button
            onClick={onPracticeAgain}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 px-5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Practice Again →
          </Button>
        </div>
      </div>
    </div>
  );
}
