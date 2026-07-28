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
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <Card className="border-border bg-surface shadow-md hover:border-border-active transition-all">
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold shrink-0">
            {index + 1}
          </span>
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <p className="font-semibold text-text-primary text-sm leading-relaxed">{q.question}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSandbox(!showSandbox)}
                className="text-xs gap-1 border-accent/30 text-accent hover:bg-accent/10 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {showSandbox ? "Hide Sandbox" : "Practice Sandbox"}
              </Button>
            </div>

            {/* Accordion for Model Answer */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="answer" className="border-0">
                <AccordionTrigger className="text-xs text-text-secondary hover:text-accent py-1">
                  View Model Answer & Strategy
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <div className="p-3 rounded-lg bg-surface-elevated/60 border border-border/40 text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                    {q.suggested_answer}
                  </div>
                  {q.tip && (
                    <p className="text-xs text-text-muted mt-2 flex items-center gap-1.5">
                      <Mic className="w-3.5 h-3.5 text-accent" /> <span className="italic">{q.tip}</span>
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Interactive Answer Sandbox */}
            {showSandbox && (
              <div className="pt-3 border-t border-border/40 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-text-secondary flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-accent" /> Practice Your Response (Voice or Text):
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={startVoiceInput}
                      className={`text-xs gap-1.5 transition-all ${
                        listening ? "border-danger text-danger bg-danger/10 animate-pulse font-bold" : "border-border text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {listening ? <MicOff className="w-3.5 h-3.5 text-danger" /> : <Mic className="w-3.5 h-3.5 text-accent" />}
                      {listening ? "Listening... Speak Now" : "Voice Input (Speak)"}
                    </Button>
                  </div>
                  <Textarea
                    placeholder="Speak into microphone or type how you would answer in an actual interview..."
                    className="min-h-[100px] text-sm bg-background border-border"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleEvaluate}
                      disabled={evaluating || !userAnswer.trim()}
                      className="bg-accent hover:bg-accent-hover text-white text-xs gap-1.5 font-bold"
                    >
                      {evaluating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
                      Evaluate Response with AI
                    </Button>
                  </div>
                </div>

                {/* AI Feedback Report */}
                {evalResult && (
                  <div className="p-4 rounded-xl bg-surface-elevated border border-accent/30 space-y-3 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1">
                        <Star className="w-4 h-4 text-warning fill-warning" /> AI STAR Response Score
                      </span>
                      <Badge className={evalResult.rating >= 8 ? "bg-success text-white" : "bg-warning text-black"}>
                        {evalResult.rating} / 10
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded bg-background/50 border border-border/30">
                        <span className="font-semibold text-text-primary">Situation & Task:</span>
                        <p className="text-text-muted mt-0.5">{evalResult.star_analysis.situation}</p>
                      </div>
                      <div className="p-2 rounded bg-background/50 border border-border/30">
                        <span className="font-semibold text-text-primary">Action & Result:</span>
                        <p className="text-text-muted mt-0.5">{evalResult.star_analysis.result}</p>
                      </div>
                    </div>

                    {evalResult.improved_answer && (
                      <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                        <span className="text-xs font-semibold text-accent flex items-center gap-1 mb-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Refined STAR Response:
                        </span>
                        <p className="text-xs text-text-secondary leading-relaxed">{evalResult.improved_answer}</p>
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
  const id = params.id as string;

  const [questions, setQuestions] = useState<InterviewQuestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: id, type: "interview" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQuestions(data.interviewQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong, try again");
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
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
        <div className="flex items-center gap-4">
          <Link href={`/results/${id}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back to Analysis
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
              Interview Q&A Voice Practice Sandbox
            </h1>
            <p className="text-xs text-text-muted mt-0.5">Speak into your microphone or type to practice answering STAR interview questions.</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating} className="gap-1">
          {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
          {questions ? "Regenerate Questions" : "Generate Prep Questions"}
        </Button>
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}
      {!questions ? (
        <Card className="border-border bg-surface">
          <CardContent className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto text-accent">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-text-primary">Generate Personalized Prep Questions</h3>
            <p className="text-sm text-text-muted max-w-md mx-auto">
              Our AI analyzes your resume and job description to predict HR, technical, and behavioral questions.
            </p>
            <Button onClick={handleGenerate} disabled={generating} className="bg-accent text-white font-bold">
              {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Generate Interview Questions
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* HR Section */}
          {questions.hr_questions && questions.hr_questions.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-text-primary">HR & General Questions</h2>
                <Badge variant="default" className="bg-accent text-white">{questions.hr_questions.length}</Badge>
              </div>
              <div className="space-y-3">
                {questions.hr_questions.map((q, i) => (
                  <QuestionCard key={i} q={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Technical Section */}
          {questions.technical_questions && questions.technical_questions.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-text-primary">Technical & Role-Specific Questions</h2>
                <Badge variant="default" className="bg-accent text-white">{questions.technical_questions.length}</Badge>
              </div>
              <div className="space-y-3">
                {questions.technical_questions.map((q, i) => (
                  <QuestionCard key={i} q={q} index={i} />
                ))}
              </div>
            </section>
          )}

          {/* Behavioral Section */}
          {questions.behavioral_questions && questions.behavioral_questions.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-text-primary">Behavioral & STAR Questions</h2>
                <Badge variant="default" className="bg-accent text-white">{questions.behavioral_questions.length}</Badge>
              </div>
              <div className="space-y-3">
                {questions.behavioral_questions.map((q, i) => (
                  <QuestionCard key={i} q={q} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
}
