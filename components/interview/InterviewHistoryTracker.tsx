// components/interview/InterviewHistoryTracker.tsx
//
// Vaylo AI — Cross-Session Progress & Historical Interview Trends Component
// Visualizes multi-session STAR performance improvements, filler word reductions, and pace metrics over time.

"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Clock,
  MessageSquare,
  Trophy,
  RotateCcw,
  Trash2,
  Calendar,
  Eye,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export interface HistoricalSessionRecord {
  id: string;
  date: string;
  role: string;
  seniority: string;
  personaName: string;
  personaStyle: string;
  overallScore: number;
  questionsCount: number;
  fillerWordDensity: number;
  speakingPaceWpm: number;
  gazePercent?: number | null;
  posturePercent?: number | null;
}

interface InterviewHistoryTrackerProps {
  onStartNewSession?: () => void;
  onSelectRole?: (role: string) => void;
}

export function InterviewHistoryTracker({
  onStartNewSession,
  onSelectRole,
}: InterviewHistoryTrackerProps) {
  const [history, setHistory] = useState<HistoricalSessionRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("vaylo_interview_history");
      if (raw) {
        const parsed = JSON.parse(raw);
        setHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (e) {
      console.warn("Failed to load interview history", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your local interview session history?")) {
      localStorage.removeItem("vaylo_interview_history");
      setHistory([]);
    }
  };

  const avgScore = history.length > 0
    ? Math.round(history.reduce((a, b) => a + (b.overallScore || 0), 0) / history.length)
    : 0;

  const avgFiller = history.length > 0
    ? Math.round(history.reduce((a, b) => a + (b.fillerWordDensity || 0), 0) / history.length)
    : 0;

  const avgPace = history.length > 0
    ? Math.round(history.reduce((a, b) => a + (b.speakingPaceWpm || 140), 0) / history.length)
    : 0;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header & High-level Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 text-xs">
              <TrendingUp className="w-3.5 h-3.5 mr-1" /> Longitudinal Progress
            </Badge>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold mt-1">My Interview Performance History</h2>
          <p className="text-xs text-slate-400">
            Track your verbal fluency, STAR structure mastery, and camera presence across practice sessions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {history.length > 0 && (
            <Button
              onClick={handleClearHistory}
              variant="outline"
              size="sm"
              className="text-xs border-slate-700 text-slate-400 hover:text-rose-400 hover:bg-slate-800 gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </Button>
          )}
          {onStartNewSession && (
            <Button
              onClick={onStartNewSession}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs gap-1.5 rounded-xl"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Start New Session
            </Button>
          )}
        </div>
      </div>

      {/* Aggregate Lifetime Metrics */}
      {history.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400">Total Practice Rounds</div>
            <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {history.length}
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400">Lifetime Avg STAR</div>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">
              {avgScore}/100
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400">Avg Filler Density</div>
            <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">
              {avgFiller}%
            </div>
          </Card>

          <Card className="p-4 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm text-center">
            <div className="text-xs text-slate-500 dark:text-slate-400">Avg Speaking Pace</div>
            <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
              {avgPace} <span className="text-xs font-normal">WPM</span>
            </div>
          </Card>
        </div>
      )}

      {/* Historical List */}
      {history.length === 0 ? (
        <Card className="p-10 text-center bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <Trophy className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No Practice Sessions Recorded Yet</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Complete your first voice interview session to start tracking your STAR scores and verbal delivery trends over time.
          </p>
          {onStartNewSession && (
            <Button
              onClick={onStartNewSession}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl mt-2"
            >
              Start First Practice Session →
            </Button>
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {history.map((rec) => (
            <Card
              key={rec.id}
              className="p-4 sm:p-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {rec.role}
                  </span>
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {rec.seniority}
                  </Badge>
                  <span className="text-xs text-slate-400">• Interviewer: {rec.personaName}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 flex-wrap pt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {rec.date}
                  </span>
                  <span>• {rec.questionsCount} Questions</span>
                  <span>• Pace: {rec.speakingPaceWpm} WPM</span>
                  <span>• Fillers: {rec.fillerWordDensity}%</span>
                  {rec.gazePercent != null && (
                    <span>• Gaze: {rec.gazePercent}%</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    {rec.overallScore}/100
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-mono">STAR Score</div>
                </div>

                {onSelectRole && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onSelectRole(rec.role)}
                    className="text-xs border-slate-300 dark:border-slate-700 gap-1"
                  >
                    Drill Role <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
