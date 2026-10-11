"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Filter, 
  BookOpen, 
  Award, 
  Flame, 
  Target,
  ChevronRight,
  Code2,
  Database,
  Cpu,
  Terminal,
  Layers,
  FileCheck2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MCQQuestion } from "@/lib/interview/mcq-bank";

interface MCQInteractiveQuizProps {
  questions: MCQQuestion[];
}

export function MCQInteractiveQuiz({ questions }: MCQInteractiveQuizProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [revealedExplanations, setRevealedExplanations] = useState<Record<string, boolean>>({});

  // Category options
  const categories = [
    { id: "all", label: "All Categories", icon: Layers },
    { id: "frontend", label: "Frontend & React", icon: Code2 },
    { id: "backend", label: "Backend & SQL", icon: Database },
    { id: "system_design", label: "System Design", icon: Cpu },
    { id: "devops", label: "DevOps & Cloud", icon: Terminal },
    { id: "data_ai", label: "Data Science & AI", icon: Sparkles },
    { id: "core_cs", label: "Core CS (OS/DBMS)", icon: BookOpen },
  ];

  const difficulties = [
    { id: "all", label: "All Levels" },
    { id: "easy", label: "Easy" },
    { id: "medium", label: "Medium" },
    { id: "hard", label: "Hard" },
  ];

  // Filter questions based on state
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      // Category match
      let catMatch = true;
      if (selectedCategory === "frontend") catMatch = q.subRole === "frontend";
      else if (selectedCategory === "backend") catMatch = q.subRole === "backend";
      else if (selectedCategory === "system_design") catMatch = q.subRole === "system_design" || q.category === "system_design";
      else if (selectedCategory === "devops") catMatch = q.subRole === "devops";
      else if (selectedCategory === "data_ai") catMatch = q.roleCategory === "data_ai";
      else if (selectedCategory === "core_cs") catMatch = q.subRole === "core_cs";

      // Difficulty match
      let diffMatch = true;
      if (selectedDifficulty !== "all") {
        diffMatch = q.difficulty === selectedDifficulty;
      }

      return catMatch && diffMatch;
    });
  }, [questions, selectedCategory, selectedDifficulty]);

  // Compute stats
  const stats = useMemo(() => {
    const answeredIds = Object.keys(userAnswers);
    const totalAnswered = answeredIds.length;
    let totalCorrect = 0;

    answeredIds.forEach((id) => {
      const q = questions.find((item) => item.id === id);
      if (q && userAnswers[id] === q.correctIndex) {
        totalCorrect++;
      }
    });

    const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
    return { totalAnswered, totalCorrect, accuracy };
  }, [userAnswers, questions]);

  const handleSelectOption = (questionId: string, optionIdx: number) => {
    if (userAnswers[questionId] !== undefined) return; // already answered
    setUserAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setRevealedExplanations((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleReset = () => {
    setUserAnswers({});
    setRevealedExplanations({});
  };

  return (
    <div className="space-y-8">
      {/* Live Performance Bar */}
      <div className="p-6 rounded-2xl bg-surface border border-border shadow-xl backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-accent" />
              <div>
                <p className="text-xs text-text-muted">Questions Answered</p>
                <p className="text-lg font-bold text-text-primary">
                  {stats.totalAnswered} <span className="text-xs text-text-muted">/ {filteredQuestions.length}</span>
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-400" />
              <div>
                <p className="text-xs text-text-muted">Correct Answers</p>
                <p className="text-lg font-bold text-emerald-400">
                  {stats.totalCorrect}
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-xs text-text-muted">Accuracy Rate</p>
                <p className="text-lg font-bold text-amber-400">
                  {stats.accuracy}%
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {stats.totalAnswered > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-1.5 text-xs text-text-secondary hover:text-text-primary"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset Quiz
              </Button>
            )}
            <Link href="/free-ats-resume-checker">
              <Button size="sm" className="gap-1.5 text-xs bg-accent hover:bg-accent-hover text-white shadow-md font-semibold">
                <FileCheck2 className="w-3.5 h-3.5" /> Check Resume Match
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  isSelected
                    ? "bg-accent text-white border-accent shadow-md shadow-accent/20"
                    : "bg-surface/80 text-text-secondary border-border hover:border-text-muted hover:text-text-primary"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Difficulty Pills */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-xs text-text-muted flex items-center gap-1 mr-1">
            <Filter className="w-3 h-3" /> Difficulty:
          </span>
          {difficulties.map((diff) => {
            const isSelected = selectedDifficulty === diff.id;
            return (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-surface-elevated text-accent font-bold border border-accent/40"
                    : "text-text-muted hover:text-text-primary"
                }`}
              >
                {diff.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Question List */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-dashed border-border bg-surface/50 space-y-3">
            <HelpCircle className="w-8 h-8 text-text-muted mx-auto" />
            <p className="text-sm font-semibold text-text-primary">No questions found matching your filter criteria.</p>
            <Button variant="outline" size="sm" onClick={() => { setSelectedCategory("all"); setSelectedDifficulty("all"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          filteredQuestions.map((q, qIndex) => {
            const userAnswer = userAnswers[q.id];
            const isAnswered = userAnswer !== undefined;
            const isCorrect = isAnswered && userAnswer === q.correctIndex;

            return (
              <div
                key={q.id}
                id={q.id}
                className={`p-6 sm:p-7 rounded-2xl border transition-all ${
                  isAnswered
                    ? isCorrect
                      ? "border-emerald-500/40 bg-surface shadow-emerald-500/5 shadow-lg"
                      : "border-rose-500/40 bg-surface shadow-rose-500/5 shadow-lg"
                    : "border-border bg-surface hover:border-border/80 shadow-md"
                }`}
              >
                {/* Header Meta */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-surface-elevated text-text-secondary text-xs font-bold flex items-center justify-center border border-border">
                      {qIndex + 1}
                    </span>
                    <Badge variant="outline" className="text-[11px] font-mono text-text-muted uppercase">
                      {q.subRole}
                    </Badge>
                    <Badge
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 ${
                        q.difficulty === "easy"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : q.difficulty === "medium"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}
                    >
                      {q.difficulty}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {q.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-medium text-text-muted bg-surface-elevated px-2 py-0.5 rounded-md">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scenario / Question Text */}
                <h3 className="text-base sm:text-lg font-semibold text-text-primary leading-snug mb-5">
                  {q.scenario}
                </h3>

                {/* Options Grid */}
                <div className="space-y-2.5">
                  {q.options.map((opt, optIdx) => {
                    let optionStyle = "border-border bg-surface-elevated/40 text-text-secondary hover:border-accent hover:bg-surface-elevated";
                    let icon = null;

                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        optionStyle = "border-emerald-500 bg-emerald-500/10 text-text-primary font-semibold shadow-sm";
                        icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
                      } else if (optIdx === userAnswer) {
                        optionStyle = "border-rose-500 bg-rose-500/10 text-rose-200 font-semibold shadow-sm";
                        icon = <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />;
                      } else {
                        optionStyle = "border-border/40 bg-surface/30 text-text-muted opacity-60";
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3 ${optionStyle}`}
                      >
                        <span className="w-6 h-6 rounded-lg bg-surface border border-border text-xs font-mono font-bold flex items-center justify-center shrink-0 mt-0.5 text-text-muted">
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="text-xs sm:text-sm leading-relaxed flex-1">
                          {opt}
                        </span>
                        {icon}
                      </button>
                    );
                  })}
                </div>

                {/* Answer Explanation Box */}
                {isAnswered && (
                  <div className="mt-5 p-4 rounded-xl bg-surface-elevated/80 border border-border/80 space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Correct Answer!
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-rose-400 flex items-center gap-1">
                          <XCircle className="w-4 h-4" /> Incorrect
                        </span>
                      )}
                      <span className="text-xs text-text-muted">•</span>
                      <span className="text-xs font-mono text-text-secondary">
                        Correct: Option {String.fromCharCode(65 + q.correctIndex)}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                      <strong className="text-text-primary">Architectural Explanation: </strong>
                      {q.explanation}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Career Funnel Banner */}
      <div className="mt-12 p-8 rounded-3xl bg-gradient-to-br from-accent/20 via-surface to-surface border border-accent/30 shadow-2xl space-y-6">
        <div className="max-w-2xl space-y-2">
          <Badge className="bg-accent/20 text-accent border-accent/40 font-bold px-2.5 py-1 text-xs">
            NEXT LEVEL PREPARATION
          </Badge>
          <h3 className="text-xl sm:text-2xl font-extrabold text-text-primary">
            Turn Technical Mastery into 3x More Recruiter Interviews
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            Knowing these technical concepts is only half the battle. If your resume does not pass the Application Tracking System (ATS) keyword and metrics scan, recruiters will never see your code.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/free-ats-resume-checker">
            <Button size="lg" className="bg-accent hover:bg-accent-hover text-white font-bold gap-2 shadow-lg shadow-accent/25">
              Scan Resume Against Job Description (Free) <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/interview-preparation">
            <Button variant="outline" size="lg" className="border-border text-text-primary hover:bg-surface-elevated font-semibold gap-2">
              Practice STAR Voice Mock Interview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
