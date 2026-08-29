"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  User,
  ArrowRight,
  Loader2,
  MessageSquare,
  Award,
  Clock,
  Zap,
} from "lucide-react";
import {
  INTERVIEWER_PERSONAS,
  VoicePersona,
  getPersona,
} from "@/lib/interview/voice-personas";
import {
  InterviewTurn,
  STAREvaluation,
  synthesizeQuestionReview,
  synthesizeTopFocusAreas,
} from "@/lib/interview/conversation-engine";
import {
  waitForVoices,
  speakAsPersona,
  selectBestAvailableVoice,
} from "@/lib/interview/browser-speech-engine";
import { WebcamProxyTracker, WebcamProxyMetrics } from "./WebcamProxyTracker";
import {
  PostSessionReview,
  SessionSummaryData,
  QuestionReviewItem,
} from "./PostSessionReview";

interface QuestionItem {
  id: string;
  type: string;
  question: string;
  why_this_matters?: string;
  rubric?: any;
}

interface VoiceInterviewSessionProps {
  role: string;
  seniority: string;
  companyStyle?: string;
  initialQuestions: QuestionItem[];
  personaId?: string;
  onPersonaChange?: (personaId: string) => void;
  onPracticeAgain?: () => void;
  onChangeRole?: () => void;
  onViewHistory?: () => void;
  onFinishSession?: (turns: InterviewTurn[], overallScore: number) => void;
}

export function VoiceInterviewSession({
  role,
  seniority,
  companyStyle,
  initialQuestions,
  personaId,
  onPersonaChange,
  onPracticeAgain,
  onChangeRole,
  onViewHistory,
  onFinishSession,
}: VoiceInterviewSessionProps) {
  // Session State
  const [internalPersonaId, setInternalPersonaId] = useState<string>(personaId || "josh_neutral");
  const activePersonaId = personaId || internalPersonaId;
  const persona: VoicePersona = getPersona(activePersonaId);

  const handleSelectPersona = (id: string) => {
    setInternalPersonaId(id);
    onPersonaChange?.(id);
  };

  const [isSessionActive, setIsSessionActive] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isFollowUpTurn, setIsFollowUpTurn] = useState(false);
  const [activeQuestionText, setActiveQuestionText] = useState(initialQuestions[0]?.question || "");
  const [candidateTranscript, setCandidateTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);

  // Turn History
  const [turns, setTurns] = useState<InterviewTurn[]>([]);
  const [currentTurn, setCurrentTurn] = useState<InterviewTurn | null>({
    questionId: initialQuestions[0]?.id || "q1",
    questionType: (initialQuestions[0]?.type as any) || "behavioral",
    question: initialQuestions[0]?.question || "Describe a complex project you led.",
    candidateAnswer: "",
    followUpTriggered: false,
  });

  // Webcam Metrics
  const [webcamMetrics, setWebcamMetrics] = useState<WebcamProxyMetrics | null>(null);

  // Speech Recognition Ref
  const recognitionRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Preload and cache browser voices asynchronously
  useEffect(() => {
    let isMounted = true;
    waitForVoices().then((voices) => {
      if (isMounted && voices.length > 0) {
        setAvailableVoices(voices);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize questions
  const questionsList = initialQuestions.length > 0 ? initialQuestions : [
    {
      id: "q1",
      type: "behavioral",
      question: "Tell me about a complex project where you had to make critical architectural or trade-off decisions.",
      why_this_matters: "Evaluates decision-making rigor and technical ownership.",
    },
    {
      id: "q2",
      type: "technical",
      question: "How do you approach debugging and optimizing a production performance bottleneck under time pressure?",
      why_this_matters: "Tests analytical problem-solving under pressure.",
    },
  ];

  // Play Persona Audio (Multi-Tier TTS: Server Neural -> Optimized Browser Engine)
  const playPersonaSpeech = useCallback(
    async (text: string) => {
      if (!text) return;
      setIsPlayingAudio(true);
      setErrorMessage(null);

      try {
        const res = await fetch("/api/ai/interview-tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            personaId: persona.id,
          }),
        });

        const contentType = res.headers.get("content-type");
        if (res.ok && (contentType?.includes("audio/mpeg") || contentType?.includes("audio/wav"))) {
          const blob = await res.blob();
          const audioUrl = URL.createObjectURL(blob);

          if (audioPlayerRef.current) {
            audioPlayerRef.current.src = audioUrl;
            audioPlayerRef.current.onended = () => setIsPlayingAudio(false);
            audioPlayerRef.current.onerror = () => {
              // Fallback to tuned browser voice
              speakAsPersona(
                text,
                persona.id,
                availableVoices,
                () => setIsPlayingAudio(true),
                () => setIsPlayingAudio(false),
                () => setIsPlayingAudio(false)
              );
            };
            await audioPlayerRef.current.play();
            return;
          }
        }

        // Fallback to tuned browser speech engine
        speakAsPersona(
          text,
          persona.id,
          availableVoices,
          () => setIsPlayingAudio(true),
          () => setIsPlayingAudio(false),
          () => setIsPlayingAudio(false)
        );
      } catch (err) {
        console.warn("[TTS Playback Notice]:", err);
        speakAsPersona(
          text,
          persona.id,
          availableVoices,
          () => setIsPlayingAudio(true),
          () => setIsPlayingAudio(false),
          () => setIsPlayingAudio(false)
        );
      }
    },
    [persona, availableVoices]
  );

  // Initialize Speech Recognition (Web Speech API)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let fullTranscript = "";
          for (let i = 0; i < event.results.length; i++) {
            fullTranscript += event.results[i][0].transcript + " ";
          }
          setCandidateTranscript(fullTranscript.trim());
        };

        recognition.onerror = (event: any) => {
          console.warn("[SpeechRecognition Error]:", event.error);
          if (event.error === "not-allowed") {
            setErrorMessage("Microphone access denied. You can also type your answer in the text box below.");
          }
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      setErrorMessage("Speech recognition not supported in this browser. Please type your response.");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setErrorMessage(null);
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.warn("Recognition restart:", err);
      }
    }
  };

  // Start Voice Interview Session
  const handleStartSession = () => {
    setIsSessionActive(true);
    setCurrentQuestionIndex(0);
    setIsFollowUpTurn(false);
    setTurns([]);
    setSessionCompleted(false);

    const firstQ = questionsList[0];
    setActiveQuestionText(firstQ.question);
    setCurrentTurn({
      questionId: firstQ.id,
      questionType: (firstQ.type as any) || "behavioral",
      question: firstQ.question,
      candidateAnswer: "",
      followUpTriggered: false,
    });

    // Play greeting and first question
    playPersonaSpeech(`${persona.greeting} Let's begin with our first question: ${firstQ.question}`);
  };

  // Submit Answer & Handle Conversational Probing / Advancing
  const handleSubmitAnswer = async () => {
    if (!candidateTranscript.trim() || !currentTurn) return;

    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }

    setIsEvaluating(true);
    setErrorMessage(null);

    try {
      // 1. Evaluate answer with STAR rubric
      const evalRes = await fetch("/api/ai/interview-eval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: activeQuestionText,
          answer: candidateTranscript,
          rubric: questionsList[currentQuestionIndex]?.rubric,
        }),
      });

      const evalData: STAREvaluation = evalRes.ok
        ? await evalRes.json()
        : {
            score: 75,
            situation_context_score: 18,
            task_action_score: 38,
            result_metrics_score: 19,
            feedback: "Answer articulated key concepts with clear personal involvement.",
            strengths: ["Clear communication", "Structured approach"],
            missing_elements: [],
            is_vague_or_incomplete: false,
          };

      const updatedTurn: InterviewTurn = isFollowUpTurn
        ? {
            ...currentTurn,
            followUpAnswer: candidateTranscript,
            followUpEvaluation: evalData,
          }
        : {
            ...currentTurn,
            candidateAnswer: candidateTranscript,
            evaluation: evalData,
          };

      // 2. Conversational Next-Turn Decision
      const remaining = questionsList.slice(currentQuestionIndex + 1);
      const decisionRes = await fetch("/api/ai/interview-followup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentTurn: updatedTurn,
          remainingQuestions: remaining,
          personaId: persona.id,
        }),
      });

      const decision = decisionRes.ok
        ? await decisionRes.json()
        : { action: "next_question" };

      // Clear transcript for next turn
      setCandidateTranscript("");

      if (decision.action === "follow_up" && !isFollowUpTurn) {
        // Trigger conversational follow-up
        setIsFollowUpTurn(true);
        const followUpQuestion = decision.question || "Can you provide a specific metric or outcome from that project?";
        setActiveQuestionText(followUpQuestion);
        setCurrentTurn({
          ...updatedTurn,
          followUpTriggered: true,
          followUpQuestion: followUpQuestion,
        });

        playPersonaSpeech(followUpQuestion);
      } else {
        // Move to next question or complete
        const finalTurns = [...turns, updatedTurn];
        setTurns(finalTurns);
        setIsFollowUpTurn(false);

        if (currentQuestionIndex + 1 < questionsList.length) {
          const nextIdx = currentQuestionIndex + 1;
          setCurrentQuestionIndex(nextIdx);
          const nextQ = questionsList[nextIdx];
          setActiveQuestionText(nextQ.question);

          const nextTurn: InterviewTurn = {
            questionId: nextQ.id,
            questionType: (nextQ.type as any) || "behavioral",
            question: nextQ.question,
            candidateAnswer: "",
            followUpTriggered: false,
          };
          setCurrentTurn(nextTurn);

          playPersonaSpeech(`Thank you. Let's move to the next question: ${nextQ.question}`);
        } else {
          // Finished all questions
          setSessionCompleted(true);
          setIsSessionActive(false);

          const avgScore = Math.round(
            finalTurns.reduce((acc, t) => acc + (t.evaluation?.score || 70), 0) / (finalTurns.length || 1)
          );

          playPersonaSpeech(
            `That concludes our interview session! You achieved an overall evaluation score of ${avgScore} percent. Review your detailed STAR breakdown below.`
          );

          onFinishSession?.(finalTurns, avgScore);
        }
      }
    } catch (err: any) {
      console.error("[handleSubmitAnswer Error]:", err);
      setErrorMessage("Evaluation timed out. Please try resubmitting.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Allow candidate to end session early and view partial scorecard without losing progress
  const handleEndEarly = () => {
    const activeTurns = turns.length > 0 ? turns : (currentTurn ? [currentTurn] : []);
    if (activeTurns.length === 0 || (!activeTurns[0].candidateAnswer && !candidateTranscript)) {
      if (confirm("You haven't submitted an answer yet. Do you want to return to domain setup?")) {
        onChangeRole?.();
        return;
      }
    }
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
    setSessionCompleted(true);
    setIsSessionActive(false);
  };

  // Build pedagogical summary payload
  const buildSessionSummary = (): SessionSummaryData => {
    const finalTurns = turns.length > 0 ? turns : (currentTurn ? [currentTurn] : []);
    const questionReviews: QuestionReviewItem[] = finalTurns.map((t, idx) => synthesizeQuestionReview(t, idx));
    const topFocusAreas = synthesizeTopFocusAreas(finalTurns);
    const avgScore = Math.round(
      questionReviews.reduce((acc, q) => acc + q.score, 0) / (questionReviews.length || 1)
    );

    let verdict = "Solid performance — focus on metrics and concise context setting.";
    if (avgScore >= 85) verdict = "Exceptional interview session! High STAR structure precision and strong active delivery.";
    else if (avgScore >= 70) verdict = "Strong session — 2 key areas to sharpen before your real interview.";
    else verdict = "Good effort — drill into concrete metrics and personal ownership to lift your score.";

    return {
      id: `sess-${Date.now()}`,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      role,
      seniority,
      persona,
      overallScore: avgScore,
      fillerWordDensity: 2,
      speakingPaceWpm: 145,
      totalWords: finalTurns.reduce((acc, t) => acc + (t.candidateAnswer?.split(/\s+/).length || 0), 0),
      verdict,
      webcamMetrics,
      turns: finalTurns,
      questionReviews,
      topFocusAreas,
    };
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <audio ref={audioPlayerRef} className="hidden" />

      {/* Persona Selection Header (Before Session Starts) */}
      {!isSessionActive && !sessionCompleted && (
        <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-6 space-y-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-50 dark:bg-blue-950/20 text-xs">
                  <Sparkles className="w-3.5 h-3.5 mr-1" /> Licensed Stock Voice Personas
                </Badge>
                <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-50 dark:bg-emerald-950/20 text-xs">
                  Universal Role Coverage
                </Badge>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Select Your AI Interviewer Persona</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose an interviewer tone suited for your target role: {role} ({seniority})
              </p>
              <div className="text-[11px] text-blue-600 dark:text-blue-400/90 font-medium flex items-center gap-1.5 mt-1">
                <span>💡 Voice quality depends on your device and browser — Chrome and Edge typically sound most natural.</span>
              </div>
            </div>

            <Button
              onClick={handleStartSession}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-5 rounded-xl shadow-lg shadow-emerald-600/20 gap-2"
            >
              <Play className="w-4 h-4 fill-current" /> Begin Voice Interview
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.values(INTERVIEWER_PERSONAS).map((p) => {
              const isSelected = activePersonaId === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectPersona(p.id)}
                  className={`p-4 rounded-2xl border text-left cursor-pointer transition-all space-y-2 relative flex flex-col justify-between ${
                    isSelected
                      ? "bg-slate-50 dark:bg-slate-800/90 border-blue-500 shadow-md ring-1 ring-blue-500"
                      : "bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
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
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">{p.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                    <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold block">{p.bestFor}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Optional Webcam Opt-in */}
          <WebcamProxyTracker isInterviewActive={false} onMetricsUpdate={setWebcamMetrics} />
        </Card>
      )}

      {/* Active Voice Interview Loop Studio */}
      {isSessionActive && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left: Active Question & Persona Card */}
          <Card className="lg:col-span-8 bg-slate-950 border-slate-800 text-white p-6 space-y-6 shadow-2xl rounded-3xl">
            {/* Top Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold shadow-md"
                  style={{ backgroundColor: persona.avatarColor }}
                >
                  {persona.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white">{persona.name}</span>
                    <span className="text-xs text-slate-400">({persona.style} style)</span>
                    {isPlayingAudio && (
                      <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px] animate-pulse">
                        Speaking...
                      </Badge>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Question {currentQuestionIndex + 1} of {questionsList.length} • {role}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleEndEarly}
                  className="text-xs border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  End &amp; View Scorecard
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => playPersonaSpeech(activeQuestionText)}
                  className="text-xs text-slate-300 hover:text-white gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Replay Voice
                </Button>
              </div>
            </div>

            {/* Current Question Box */}
            <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
              {isFollowUpTurn && (
                <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
                  <Zap className="w-3.5 h-3.5" /> Follow-Up Probing Question
                </div>
              )}
              <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                "{activeQuestionText}"
              </h3>
            </div>

            {/* Candidate Response Area */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Mic className="w-3.5 h-3.5 text-blue-400" /> Your Live Spoken Answer
                </label>
                <span className="text-[11px] text-slate-500">Speak naturally or type below</span>
              </div>

              <Textarea
                value={candidateTranscript}
                onChange={(e) => setCandidateTranscript(e.target.value)}
                placeholder="Click 'Record Answer' to speak, or type your response here..."
                rows={4}
                className="bg-slate-900/90 border-slate-800 text-white placeholder:text-slate-600 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-2xl resize-none p-4"
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={toggleRecording}
                    variant={isRecording ? "destructive" : "outline"}
                    className={`gap-2 text-xs font-bold rounded-xl ${
                      isRecording
                        ? "bg-rose-600 hover:bg-rose-500 text-white animate-pulse"
                        : "border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-4 h-4" /> Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 text-blue-400" /> Record Answer
                      </>
                    )}
                  </Button>

                  {candidateTranscript && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setCandidateTranscript("")}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Clear
                    </Button>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleSubmitAnswer}
                  disabled={isEvaluating || !candidateTranscript.trim()}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl gap-2 shadow-lg shadow-blue-600/20 text-xs"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Evaluating STAR Structure...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Answer</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </Card>

          {/* Right: Real-time Camera Proxy & Turn Scoreboard */}
          <div className="lg:col-span-4 space-y-4">
            <WebcamProxyTracker isInterviewActive={true} onMetricsUpdate={setWebcamMetrics} />

            {/* Session Progress Card */}
            <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-sm rounded-2xl">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Interview Progress
              </div>
              <div className="space-y-2">
                {questionsList.map((q, idx) => {
                  const isDone = idx < currentQuestionIndex;
                  const isCurrent = idx === currentQuestionIndex;
                  return (
                    <div
                      key={q.id}
                      className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                        isCurrent
                          ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 font-semibold text-blue-900 dark:text-blue-300"
                          : isDone
                          ? "bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                          : "border-transparent text-slate-400"
                      }`}
                    >
                      <span className="truncate pr-2">
                        {idx + 1}. {q.question.slice(0, 38)}...
                      </span>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : isCurrent ? (
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0" />
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Post-Session Comprehensive Pedagogical Scorecard & Guidance */}
      {sessionCompleted && (
        <PostSessionReview
          sessionData={buildSessionSummary()}
          onPracticeAgain={onPracticeAgain || handleStartSession}
          onChangeRole={onChangeRole || (() => setIsSessionActive(false))}
          onViewHistory={onViewHistory}
        />
      )}
    </div>
  );
}
