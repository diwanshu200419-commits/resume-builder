"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, CheckCircle2, XCircle, AlertCircle, Sparkles, RefreshCw, ChevronRight, Award, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

interface InterviewQuestion {
  id: string;
  question_text: string;
  company_tag?: string;
  difficulty?: string;
  question_type?: string;
}

export default function InterviewPrepRoomPage({ params }: { params: { id: string } }) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [micError, setMicError] = useState<string | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState<any | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<InterviewQuestion[]>([
    {
      id: "q-1",
      question_text: "Describe how you optimized rendering performance and load time of a complex React web app.",
      company_tag: "google_style",
      difficulty: "medium",
    },
    {
      id: "q-2",
      question_text: "Tell me about a time when a production service under your ownership experienced unexpected traffic surges.",
      company_tag: "amazon_style",
      difficulty: "medium",
    },
    {
      id: "q-3",
      question_text: "How would you measure success of Google Photos and prioritize the next key retention feature?",
      company_tag: "meta_style",
      difficulty: "hard",
    },
  ]);

  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionScores, setSessionScores] = useState<number[]>([]);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API if supported in browser
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let currentTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
        };

        recognition.onerror = (event: any) => {
          console.warn("[SpeechRecognition Error]:", event.error);
          if (event.error === "not-allowed" || event.error === "permission-denied") {
            setMicError("Microphone permission denied. Please allow microphone access in browser settings or use manual text input below.");
          } else {
            setMicError(`Voice input issue: ${event.error}. You can type your answer manually.`);
          }
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      } else {
        setMicError("Web Speech API is not supported in this browser. You can type your answer manually in the text area.");
      }
    }
  }, []);

  const toggleRecording = () => {
    setMicError(null);
    if (!recognitionRef.current) {
      setMicError("Microphone recording is unavailable. Please type your answer manually below.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setTranscript("");
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error(err);
        setIsRecording(false);
      }
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!transcript || transcript.trim().length < 10) return;
    setEvaluating(true);
    setEvaluation(null);

    try {
      const res = await fetch("/api/ai/interview-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionId: questions[currentQuestionIndex].id,
          questionText: questions[currentQuestionIndex].question_text,
          transcript,
          questionCount: currentQuestionIndex + 1,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        setEvaluation(json);
        setSessionScores((prev) => [...prev, json.score]);
      } else {
        setMicError(json.error || "Evaluation failed");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setTranscript("");
      setEvaluation(null);
      setMicError(null);
    } else {
      setSessionCompleted(true);
    }
  };

  const currentQ = questions[currentQuestionIndex];
  const avgSessionScore = sessionScores.length > 0
    ? Math.round(sessionScores.reduce((a, b) => a + b, 0) / sessionScores.length)
    : 0;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Session Progress Header */}
      <div className="flex items-center justify-between bg-surface p-4 rounded-2xl border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/30 text-accent">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold text-text-primary">FAANG Voice Interview Practice</h1>
            <p className="text-xs text-text-muted">STAR Framework Speech Analysis &amp; Verbal Feedback</p>
          </div>
        </div>

        <Badge variant="outline" className="border-accent/40 text-accent bg-accent/10 font-mono text-xs">
          Question {currentQuestionIndex + 1} of {questions.length}
        </Badge>
      </div>

      {micError && (
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-300">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <p>{micError}</p>
        </div>
      )}

      {!sessionCompleted ? (
        <div className="space-y-6">
          {/* Question Card */}
          <Card className="border-border bg-surface shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-[10px] font-mono uppercase">
                  {currentQ.company_tag?.replace("_", " ")}
                </Badge>
                <Badge className="bg-surface-elevated text-text-muted text-[10px] uppercase">
                  Difficulty: {currentQ.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-base font-bold text-text-primary pt-2 leading-snug">
                "{currentQ.question_text}"
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Mic & Controls */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 rounded-xl bg-surface-elevated border border-border">
                <div className="flex items-center gap-3">
                  <button
                    onClick={toggleRecording}
                    className={`p-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all ${
                      isRecording
                        ? "bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30"
                        : "bg-accent text-white hover:bg-accent-hover"
                    }`}
                  >
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    <span>{isRecording ? "Stop Recording" : "Start Voice Answer"}</span>
                  </button>
                  {isRecording && (
                    <span className="text-xs text-rose-400 font-mono font-bold animate-pulse">
                      ● Recording Audio...
                    </span>
                  )}
                </div>

                <Button
                  disabled={evaluating || !transcript.trim()}
                  onClick={handleEvaluateAnswer}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-1.5"
                >
                  <Sparkles className="w-4 h-4" /> Evaluate Answer
                </Button>
              </div>

              {/* Spoken Transcript Area */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-primary block">
                  Spoken Answer Transcript (Live Speech-to-Text):
                </label>
                <Textarea
                  rows={4}
                  placeholder="Click 'Start Voice Answer' and speak into your microphone, or type your answer here..."
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="text-xs bg-surface-elevated font-mono"
                />
              </div>

              {/* AI Evaluation Report */}
              {evaluation && (
                <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-accent" />
                      <span className="font-bold text-sm text-text-primary">STAR Framework Feedback</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-text-muted">Verbal Score:</span>
                      <Badge className="bg-accent text-white font-bold text-xs">{evaluation.score} / 100</Badge>
                    </div>
                  </div>

                  {/* STAR Components Status */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {Object.entries(evaluation.starComponents || {}).map(([key, isPresent]) => (
                      <div key={key} className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isPresent ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300" : "bg-rose-500/10 border-rose-500/30 text-rose-300"
                      }`}>
                        <span className="capitalize font-bold text-[11px]">{key}</span>
                        {isPresent ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-rose-400" />}
                      </div>
                    ))}
                  </div>

                  <div className="text-xs space-y-1">
                    <p className="font-bold text-text-primary">Speech Metrics:</p>
                    <p className="text-text-secondary text-[11px]">
                      Total Words: <span className="font-mono font-bold">{evaluation.totalWords}</span> | Filler Words: <span className="font-mono font-bold">{evaluation.fillerCount}</span> ({evaluation.fillerDensityPct}% density)
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="font-bold text-xs text-text-primary">Recruiter Coaching Feedback:</p>
                    <ul className="space-y-1 text-xs text-text-secondary">
                      {evaluation.feedbackPoints?.map((pt: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-accent">•</span> {pt}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button onClick={handleNextQuestion} className="bg-accent hover:bg-accent-hover text-white text-xs font-bold gap-1">
                      Next Question <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        /* End of Session Diagnostic Summary */
        <Card className="border-border bg-surface p-6 space-y-6 text-center shadow-xl">
          <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/40 text-accent flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-bold text-text-primary">Voice Interview Session Completed!</h2>
            <p className="text-xs text-text-muted">Average Verbal Score across {questions.length} questions</p>
          </div>

          <div className="inline-block p-4 rounded-2xl bg-accent/10 border border-accent/30">
            <span className="text-4xl font-extrabold text-accent">{avgSessionScore}</span>
            <span className="text-xs text-text-muted block font-semibold mt-1">/ 100 STAR Rating</span>
          </div>

          <div className="flex gap-3 justify-center pt-4">
            <Button
              onClick={() => {
                setSessionCompleted(false);
                setCurrentQuestionIndex(0);
                setSessionScores([]);
                setTranscript("");
                setEvaluation(null);
              }}
              className="bg-accent hover:bg-accent-hover text-white font-bold text-xs gap-1.5"
            >
              <RefreshCw className="w-4 h-4" /> Re-Practice Session
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
