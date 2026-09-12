"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  Clock,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  BookOpen,
  Trophy,
  AlertTriangle,
  Zap,
} from "lucide-react";

interface MCQQuestion {
  id: string;
  roleCategory: string;
  subRole: string;
  difficulty: string;
  category: string;
  scenario: string;
  options: string[];
  tags: string[];
}

interface QuestionResult {
  id: string;
  scenario: string;
  options: string[];
  candidateChoice: number;
  correctIndex: number;
  isCorrect: boolean;
  explanation: string;
  category: string;
}

interface MCQSessionProps {
  roleCategory: string;
  difficulty: string;
  onExit: () => void;
  onSwitchToVoice: () => void;
}

export function MCQInterviewSession({
  roleCategory,
  difficulty,
  onExit,
  onSwitchToVoice,
}: MCQSessionProps) {
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [reviewData, setReviewData] = useState<any>(null);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // Fetch Questions
  useEffect(() => {
    let active = true;
    setLoading(true);

    fetch("/api/ai/interview-mcq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "get_questions",
        roleCategory,
        difficulty,
        limit: 5,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (active && data.success && data.questions) {
          setQuestions(data.questions);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load MCQ questions:", err);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [roleCategory, difficulty]);

  // Session Stopwatch
  useEffect(() => {
    if (isCompleted || loading) return;
    const interval = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isCompleted, loading]);

  const handleSelectOption = (index: number) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: index,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleSubmitBatch();
    }
  };

  const handleSubmitBatch = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/ai/interview-mcq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluate_batch",
          answers: selectedAnswers,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setReviewData(data);
        setIsCompleted(true);
      }
    } catch (err) {
      console.error("Failed to submit MCQ drill:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? "0" : ""}${remainder}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-4">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-secondary font-medium">Curating role-specific MCQ test battery...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center bg-surface rounded-2xl border border-border space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-400 mx-auto" />
        <h3 className="text-lg font-bold text-text-primary">No Questions Available</h3>
        <p className="text-xs text-text-secondary">
          No matching questions found for this specific combination. Try switching roles or launching Voice Mode.
        </p>
        <div className="flex justify-center gap-3">
          <Button onClick={onExit} variant="outline" size="sm">
            Back to Lobby
          </Button>
          <Button onClick={onSwitchToVoice} size="sm" className="bg-accent text-white font-bold">
            Launch Voice Session
          </Button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // REVIEW SCREEN (COMPLETED)
  // =========================================================================
  if (isCompleted && reviewData) {
    const { correctCount, totalQuestions, scorePercent, results, weakAreas } = reviewData;
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header Banner */}
        <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-text-primary">MCQ Assessment Complete</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                Completed {totalQuestions} questions in {formatTime(timerSeconds)}
              </p>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-3xl font-black text-text-primary">
              <span className={scorePercent >= 70 ? "text-emerald-400" : "text-amber-400"}>
                {scorePercent}%
              </span>
            </div>
            <p className="text-xs font-semibold text-text-muted mt-0.5">
              {correctCount} of {totalQuestions} Correct
            </p>
          </div>
        </div>

        {/* Weak Areas Notice */}
        {weakAreas && weakAreas.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5 text-amber-400">
              <Sparkles className="w-4 h-4" /> Top Areas for Review
            </p>
            {weakAreas.map((w: string, idx: number) => (
              <p key={idx} className="pl-5 text-text-secondary">• {w}</p>
            ))}
          </div>
        )}

        {/* Turn-by-Turn Explanations */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Detailed Question Explanations
          </h3>
          {results.map((res: QuestionResult, i: number) => (
            <div
              key={res.id}
              className={`p-5 rounded-2xl border ${
                res.isCorrect ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20"
              } space-y-3`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] uppercase font-mono">
                    Q{i + 1} · {res.category}
                  </Badge>
                  {res.isCorrect ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                    </span>
                  ) : (
                    <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Incorrect
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm font-semibold text-text-primary">{res.scenario}</p>

              {/* Options Grid */}
              <div className="grid grid-cols-1 gap-2 pt-1">
                {res.options.map((opt: string, optIdx: number) => {
                  const isChosen = res.candidateChoice === optIdx;
                  const isAnswer = res.correctIndex === optIdx;

                  let optClass = "border-border bg-surface text-text-secondary";
                  if (isAnswer) optClass = "border-emerald-500 bg-emerald-500/10 text-emerald-300 font-semibold";
                  else if (isChosen && !isAnswer) optClass = "border-rose-500 bg-rose-500/10 text-rose-300";

                  return (
                    <div
                      key={optIdx}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${optClass}`}
                    >
                      <span>{opt}</span>
                      {isAnswer && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                      {isChosen && !isAnswer && <XCircle className="w-4 h-4 text-rose-400 shrink-0" />}
                    </div>
                  );
                })}
              </div>

              {/* Deep Pedagogical Explanation */}
              <div className="pt-2 border-t border-border/50 text-xs text-text-secondary leading-relaxed bg-surface/50 p-3 rounded-xl">
                <strong className="text-text-primary block mb-1">Architectural / Decision Explanation:</strong>
                {res.explanation}
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4">
          <Button onClick={onExit} variant="outline" size="sm" className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Return to Lobby
          </Button>
          <Button onClick={onSwitchToVoice} size="sm" className="bg-accent text-white font-bold gap-2">
            Practice Spoken Voice Session &rarr;
          </Button>
        </div>
      </div>
    );
  }

  // =========================================================================
  // ACTIVE QUIZ RUNNER
  // =========================================================================
  const currentQ = questions[currentIndex];
  const selectedChoice = selectedAnswers[currentQ?.id];
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Progress & Timer Bar */}
      <div className="flex items-center justify-between text-xs text-text-secondary font-mono">
        <div className="flex items-center gap-2">
          <Badge className="bg-indigo-500/15 text-indigo-400 border-indigo-500/30 text-[10px] uppercase font-bold">
            Question {currentIndex + 1} of {questions.length}
          </Badge>
          <span className="text-text-muted">· {currentQ?.category}</span>
        </div>

        <div className="flex items-center gap-1.5 font-bold text-text-primary">
          <Clock className="w-3.5 h-3.5 text-accent" /> {formatTime(timerSeconds)}
        </div>
      </div>

      <Progress value={progressPercent} className="h-1.5 bg-surface-elevated" />

      {/* Main Question Card */}
      <Card className="border-border bg-surface shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-semibold">
              <Zap className="w-4 h-4" /> Role Scenario &amp; Decision Drill
            </div>
            <Badge variant="outline" className="text-[10px] capitalize">
              {currentQ?.difficulty}
            </Badge>
          </div>
          <CardTitle className="text-base sm:text-lg font-bold text-text-primary leading-snug">
            {currentQ?.scenario}
          </CardTitle>
          <CardDescription className="text-xs text-text-muted">
            Select the most optimal architectural approach or professional action.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {currentQ?.options.map((opt, idx) => {
            const isSelected = selectedChoice === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? "border-accent bg-accent/10 text-text-primary font-semibold shadow-sm"
                    : "border-border bg-surface-elevated text-text-secondary hover:border-accent/50 hover:bg-surface"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? "bg-accent text-white"
                        : "bg-surface border border-border text-text-muted"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span>{opt}</span>
                </div>
              </button>
            );
          })}

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="text-xs"
            >
              Previous
            </Button>

            <Button
              size="sm"
              onClick={handleNext}
              disabled={selectedChoice === undefined || submitting}
              className="bg-accent hover:bg-accent/90 text-white font-bold text-xs gap-1.5 px-6"
            >
              {submitting ? (
                "Evaluating..."
              ) : currentIndex === questions.length - 1 ? (
                "Submit Assessment"
              ) : (
                <>Next Question &rarr;</>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
