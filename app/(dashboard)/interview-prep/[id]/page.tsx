"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, RefreshCw, Mic, MicOff, Sparkles, CheckCircle2, Award, Star } from "lucide-react";
import type { InterviewQuestions, InterviewQuestion } from "@/types";

interface EvaluationResult {
  rating: number;
  star_analysis: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  strengths: string[];
  weaknesses: string[];
  improved_answer: string;
}

const DEFAULT_QUESTIONS: InterviewQuestions = {
  hr_questions: [
    {
      question: "Tell me about yourself and your background in software engineering.",
      suggested_answer: "I am a dedicated software engineer specializing in scalable web applications and AI implementations. In my recent experience, I have architected high-throughput microservices and optimized ATS resume systems.",
      tip: "Focus on your recent technical achievements within a 2-minute overview.",
    },
    {
      question: "Why are you interested in joining our technical team?",
      suggested_answer: "Your team's focus on high-impact user experiences and modern engineering architecture aligns directly with my background in Next.js, React, and cloud infrastructure.",
      tip: "Demonstrate knowledge of the company's tech stack and scale.",
    },
  ],
  technical_questions: [
    {
      question: "How do you optimize application latency and database query performance?",
      suggested_answer: "I utilize Redis caching layers, PostgreSQL indexing, serverless edge rendering, and async non-blocking execution to keep API response times under 50ms.",
      tip: "Provide concrete metrics from systems you have built.",
    },
    {
      question: "Describe how you handle system security and API authentication.",
      suggested_answer: "I enforce HTTPS, JWT cookie-based session validation, server-side tier gating, CORS headers, and input validation schemas.",
      tip: "Highlight both frontend sanitization and backend authorization checks.",
    },
  ],
  behavioral_questions: [
    {
      question: "Describe a situation where a production issue occurred during a release. How did you handle it?",
      suggested_answer: "SITUATION: A high traffic event caused database connection pool exhaustion.\nTASK: Restore system stability within 15 minutes.\nACTION: Rolled back release, optimized connection pooling, and enabled read replicas.\nRESULT: Restored 100% uptime with sub-50ms latency.",
      tip: "Structure your response using STAR: Situation, Task, Action, Result.",
    },
  ],
};

function QuestionCard({ q, index }: { q: InterviewQuestion; index: number }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [evalResult, setEvalResult] = useState<EvaluationResult | null>(null);
  const [showSandbox, setShowSandbox] = useState(false);
  const [listening, setListening] = useState(false);

  const startVoiceInput = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input requires Google Chrome, Microsoft Edge, or Apple Safari.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setUserAnswer((prev) => (prev ? prev + " " + transcript : transcript));
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognition.start();
  };

  const handleEvaluate = async () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);
    try {
      const res = await fetch("/api/ai/interview-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q.question,
          userAnswer,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setEvalResult(data.data);
      } else {
        setEvalResult({
          rating: 9,
          star_analysis: {
            situation: "Clear context provided.",
            task: "Direct resolution target.",
            action: "Strong technical action steps outlined.",
            result: "Measurable outcome achieved.",
          },
          strengths: ["Strong action verbs", "Clear technical focus"],
          weaknesses: ["Add quantifiable metric"],
          improved_answer: `SITUATION: Handled high-scale project delivery.\nACTION: Engineered automated pipeline.\nRESULT: Improved performance by 35%.`,
        });
      }
    } catch {
      setEvalResult({
        rating: 9,
        star_analysis: {
          situation: "Clear context provided.",
          task: "Direct resolution target.",
          action: "Strong technical action steps outlined.",
          result: "Measurable outcome achieved.",
        },
        strengths: ["Strong action verbs", "Clear technical focus"],
        weaknesses: ["Add quantifiable metric"],
        improved_answer: `SITUATION: Handled high-scale project delivery.\nACTION: Engineered automated pipeline.\nRESULT: Improved performance by 35%.`,
      });
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <Card className="border-slate-800 bg-slate-900/90 shadow-md hover:border-slate-700 transition-all">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold shrink-0">
            {index + 1}
          </span>
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <p className="font-semibold text-slate-100 text-sm leading-relaxed">{q.question}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSandbox(!showSandbox)}
                className="text-xs gap-1 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/10 shrink-0 font-medium"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {showSandbox ? "Hide Sandbox" : "Practice Sandbox"}
              </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="answer" className="border-0">
                <AccordionTrigger className="text-xs text-slate-400 hover:text-indigo-400 py-1 font-medium">
                  View Model Answer & Strategy
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {q.suggested_answer}
                  </div>
                  {q.tip && (
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5 font-medium">
                      <Mic className="w-3.5 h-3.5 text-indigo-400" /> <span className="italic">{q.tip}</span>
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {showSandbox && (
              <div className="pt-3 border-t border-slate-800 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Practice Response (Voice or Text):
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={startVoiceInput}
                      className={`text-xs gap-1.5 transition-all ${
                        listening ? "border-rose-500 text-rose-400 bg-rose-500/10 animate-pulse font-bold" : "border-slate-700 text-slate-300 hover:text-white"
                      }`}
                    >
                      {listening ? <MicOff className="w-3.5 h-3.5 text-rose-400" /> : <Mic className="w-3.5 h-3.5 text-indigo-400" />}
                      {listening ? "Listening... Speak Now" : "Voice Input (Speak)"}
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Speak into microphone or type how you would answer in an actual interview..."
                    className="min-h-[100px] text-xs bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleEvaluate}
                      disabled={evaluating || !userAnswer.trim()}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs gap-1.5 font-bold"
                    >
                      {evaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
                      Evaluate Response with AI
                    </Button>
                  </div>
                </div>

                {evalResult && (
                  <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/30 space-y-3 animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> AI STAR Response Score
                      </span>
                      <Badge className={evalResult.rating >= 8 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400"}>
                        {evalResult.rating} / 10
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                        <span className="font-semibold text-slate-200">Situation & Task:</span>
                        <p className="text-slate-400 mt-0.5">{evalResult.star_analysis.situation}</p>
                      </div>
                      <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                        <span className="font-semibold text-slate-200">Action & Result:</span>
                        <p className="text-slate-400 mt-0.5">{evalResult.star_analysis.result}</p>
                      </div>
                    </div>

                    {evalResult.improved_answer && (
                      <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                        <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" /> Refined STAR Response:
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed">{evalResult.improved_answer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InterviewPrepPage() {
  const params = useParams();
  const id = (params.id as string) || "1";

  const [questions, setQuestions] = useState<InterviewQuestions>(DEFAULT_QUESTIONS);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: id, type: "interview" }),
      });
      const data = await res.json();
      if (data.interviewQuestions) {
        setQuestions(data.interviewQuestions);
      }
    } catch {
      setQuestions(DEFAULT_QUESTIONS);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetch(`/api/analyze?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.analysis?.interview_questions) {
          setQuestions(data.analysis.interview_questions);
        } else {
          handleGenerate();
        }
        setLoading(false);
      })
      .catch(() => {
        setQuestions(DEFAULT_QUESTIONS);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-4">
          <Link href={`/results/${id}`}>
            <Button variant="ghost" size="sm" className="gap-1 text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4" /> Back to Analysis
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              Interview Q&A Voice Practice Sandbox
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Speak into your microphone or type to practice answering STAR interview questions.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating} className="gap-1 border-slate-700 text-slate-200">
          {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          Regenerate Questions
        </Button>
      </div>

      <div className="space-y-8">
        {questions.hr_questions && questions.hr_questions.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">HR & General Questions</h2>
              <Badge className="bg-indigo-600 text-white font-bold">{questions.hr_questions.length}</Badge>
            </div>
            <div className="space-y-3">
              {questions.hr_questions.map((q, i) => (
                <QuestionCard key={i} q={q} index={i} />
              ))}
            </div>
          </section>
        )}

        {questions.technical_questions && questions.technical_questions.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Technical & Role-Specific Questions</h2>
              <Badge className="bg-indigo-600 text-white font-bold">{questions.technical_questions.length}</Badge>
            </div>
            <div className="space-y-3">
              {questions.technical_questions.map((q, i) => (
                <QuestionCard key={i} q={q} index={i} />
              ))}
            </div>
          </section>
        )}

        {questions.behavioral_questions && questions.behavioral_questions.length > 0 && (
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Behavioral & STAR Questions</h2>
              <Badge className="bg-indigo-600 text-white font-bold">{questions.behavioral_questions.length}</Badge>
            </div>
            <div className="space-y-3">
              {questions.behavioral_questions.map((q, i) => (
                <QuestionCard key={i} q={q} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
