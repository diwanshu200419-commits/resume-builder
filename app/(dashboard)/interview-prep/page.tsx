"use client";

import { useState } from "react";
import {
  Mic,
  Volume2,
  Sparkles,
  Award,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Play,
  Landmark,
  Building,
  GraduationCap,
  Users,
  Eye,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { VoiceInterviewSession } from "@/components/interview/VoiceInterviewSession";
import { INTERVIEWER_PERSONAS, VoicePersona } from "@/lib/interview/voice-personas";

const DOMAIN_PRESETS = [
  {
    id: "software_engineering",
    title: "Software Engineering & Architecture",
    desc: "Frontend, Backend, Distributed Systems, Microservices & System Design",
    icon: Zap,
    companyStyle: "Google & Amazon Style",
    tags: ["Google", "Amazon", "Meta", "Staff+"],
  },
  {
    id: "civil_services_govt",
    title: "Civil Services & Public Administration",
    desc: "Constitutional Ethics, Administrative Integrity, Policy Execution & Crisis Governance",
    icon: Landmark,
    companyStyle: "Government & UPSC Panel",
    tags: ["UPSC", "State PSC", "IAS/IPS", "Banking PO", "RBI"],
  },
  {
    id: "product_management",
    title: "Product Management & Strategy",
    desc: "Product Vision, North Star Metrics, User Empathy, Prioritization & GTM",
    icon: Sparkles,
    companyStyle: "Product Sense & Execution",
    tags: ["Google", "Amazon", "Stripe"],
  },
  {
    id: "data_science_ai",
    title: "Data Science & Machine Learning",
    desc: "A/B Testing, MLOps, Transformer Pipelines, Statistical Inference & Modeling",
    icon: Award,
    companyStyle: "Applied AI & Analytics",
    tags: ["Meta", "Apple", "OpenAI"],
  },
  {
    id: "leadership_exec",
    title: "Executive & Engineering Leadership",
    desc: "P&L Management, Stakeholder Diplomacy, Technical Debt & Cultural Governance",
    icon: ShieldCheck,
    companyStyle: "Bar-Raiser Executive",
    tags: ["Netflix", "Amazon", "Enterprise"],
  },
  {
    id: "custom_role",
    title: "Custom Role / Free-Text Field",
    desc: "Any global job title — AI dynamically calibrates questions and STAR rubrics",
    icon: GraduationCap,
    companyStyle: "General Industry Standard",
    tags: ["Universal", "Custom Domain"],
  },
];

export default function InterviewPrepLobbyPage() {
  const [selectedDomain, setSelectedDomain] = useState("software_engineering");
  const [customRoleText, setCustomRoleText] = useState("");
  const [seniority, setSeniority] = useState<"entry-level" | "mid-level" | "senior" | "leadership">("mid-level");
  const [selectedPersonaId, setSelectedPersonaId] = useState("josh_neutral");
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [sessionQuestions, setSessionQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const activePreset = DOMAIN_PRESETS.find((d) => d.id === selectedDomain) || DOMAIN_PRESETS[0];
  const targetRoleTitle =
    selectedDomain === "custom_role" && customRoleText.trim()
      ? customRoleText.trim()
      : activePreset.title;

  const handleLaunchVoiceSession = async () => {
    setLoadingQuestions(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/interview-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetRole: targetRoleTitle,
          seniority: seniority,
          companyStyle: activePreset.companyStyle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load questions");

      const questions = data.questionSet?.questions || data.questions || [];
      if (questions.length === 0) throw new Error("No questions generated for this domain.");

      setSessionQuestions(questions);
      setIsSessionActive(true);
    } catch (err: any) {
      console.warn("[Launch Session Warning]:", err);
      // Fallback questions to guarantee session start
      setSessionQuestions([
        {
          id: "q1",
          type: "behavioral",
          question: `Describe a challenging situation in your work as a ${targetRoleTitle} where you had to lead resolution under tight deadlines.`,
          why_this_matters: "Evaluates situational leadership, composure, and problem-solving.",
        },
        {
          id: "q2",
          type: "technical",
          question: `What specific methodologies or metrics do you rely on to measure the quality and impact of your deliverables?`,
          why_this_matters: "Assesses domain depth and data-driven accountability.",
        },
      ]);
      setIsSessionActive(true);
    } finally {
      setLoadingQuestions(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 p-4 sm:p-6 lg:p-8">
      {/* Active Studio View */}
      {isSessionActive ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div>
              <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
                Live Voice Interview Studio
              </Badge>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                {targetRoleTitle} ({seniority})
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Persona: {INTERVIEWER_PERSONAS[selectedPersonaId]?.label || "Josh"} • {activePreset.companyStyle}
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSessionActive(false)}
              className="text-xs border-slate-300 dark:border-slate-700"
            >
              ← Change Domain / Persona
            </Button>
          </div>

          <VoiceInterviewSession
            role={targetRoleTitle}
            seniority={seniority}
            companyStyle={activePreset.companyStyle}
            initialQuestions={sessionQuestions}
          />
        </div>
      ) : (
        /* Lobby View */
        <div className="space-y-8">
          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border border-slate-800 p-6 sm:p-10 shadow-2xl text-white">
            <div className="relative z-10 max-w-2xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono">
                <Mic className="w-3.5 h-3.5 animate-pulse" /> AI Voice Interview Coach • 4 Stock Personas
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Realistic Voice Interviews with Conversational Follow-Ups
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Practice out loud with lifelike synthetic interviewer personas. Get probed on vague answers in real time, receive objective camera eye-contact feedback, and evaluate your <strong className="text-white font-semibold">STAR framework</strong> score.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  onClick={handleLaunchVoiceSession}
                  disabled={loadingQuestions}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-5 text-sm gap-2 shadow-lg shadow-emerald-600/25 rounded-xl"
                >
                  <Play className="w-4 h-4 fill-white" />
                  {loadingQuestions ? "Generating Domain Questions..." : "Start Practice Session"}
                </Button>
              </div>
            </div>
          </div>

          {/* Domain & Role Selection */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">1. Select Target Domain &amp; Role</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Covers technical FAANG loops, civil services/government panels, and free-text custom roles
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DOMAIN_PRESETS.map((d) => {
                const Icon = d.icon;
                const isSelected = selectedDomain === d.id;
                return (
                  <Card
                    key={d.id}
                    onClick={() => setSelectedDomain(d.id)}
                    className={`cursor-pointer transition-all border p-5 flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-1 ring-emerald-500 shadow-md"
                        : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className={`p-2.5 rounded-xl border ${
                          isSelected
                            ? "bg-emerald-600 text-white border-emerald-500"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                      </div>

                      <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-3">{d.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{d.desc}</p>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 dark:border-slate-800">
                      {d.tags.map((t, idx) => (
                        <Badge key={idx} variant="outline" className="text-[10px] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                );
              })}
            </div>

            {selectedDomain === "custom_role" && (
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                  Enter Custom Job Title / Field
                </label>
                <Input
                  value={customRoleText}
                  onChange={(e) => setCustomRoleText(e.target.value)}
                  placeholder="e.g. Senior Security Engineer, Bank Branch Manager, Policy Analyst..."
                  className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-sm"
                />
              </div>
            )}
          </div>

          {/* Persona Selection */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">2. Choose Interviewer Persona Tone</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Select your preferred interviewer persona — powered by licensed stock voices
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.values(INTERVIEWER_PERSONAS).map((p) => {
                const isSelected = selectedPersonaId === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setSelectedPersonaId(p.id)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all space-y-2 relative flex flex-col justify-between ${
                      isSelected
                        ? "bg-slate-50 dark:bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500"
                        : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: p.avatarColor }}
                        />
                        <Badge variant="outline" className="text-[9px] px-1.5 py-0 capitalize">
                          {p.gender} • {p.style}
                        </Badge>
                      </div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">{p.label}</div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{p.tagline}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block">{p.bestFor}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Feature Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4" /> STAR Framework Evaluation
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Evaluates Situation, Task, Action, and Result components with granular rubrics for every answer.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs">
                <MessageSquare className="w-4 h-4" /> Conversational Follow-Up Probing
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                If your answer lacks a specific metric or concrete detail, the AI naturally probes for clarification before moving forward.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs">
                <Eye className="w-4 h-4" /> 100% Client-Side Body Language
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Optional in-browser camera analysis tracks eye-line consistency and posture stability with zero video stored.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
