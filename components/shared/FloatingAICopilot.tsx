"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, X, Send, Sparkles, Loader2, ArrowRight, Zap, Target, Globe, DollarSign, BarChart3, FileText, CheckCircle2 } from "lucide-react";

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  actionRoute?: string;
  actionText?: string;
}

const QUICK_ACTIONS = [
  { label: "⚡ Fix ATS Score", prompt: "How do I fix my resume ATS score?", route: "/analyze" },
  { label: "🎙️ STAR Interview Prep", prompt: "Help me practice for a STAR interview", route: "/interview-prep/1" },
  { label: "🌐 Deploy Portfolio", prompt: "How do I deploy my portfolio website?", route: "/portfolio/deploy" },
  { label: "💰 Negotiate Salary", prompt: "Help me negotiate my salary offer", route: "/salary-calculator" },
  { label: "📊 Check Hiring Odds", prompt: "What are my hiring probability odds?", route: "/hiring-probability" },
];

export function FloatingAICopilot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      sender: "bot",
      text: "👋 Welcome to Vaylo AI! I am your 24/7 AI Career Copilot. I can help you fix ATS resume errors, build portfolios, practice voice interviews, or calculate hiring odds. What would you like to achieve today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const sendMessage = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = { id: `usr-${Date.now()}`, sender: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/career-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      const replyText = data.reply || data.advice || "I can help you optimize your resume, prepare for interviews, or deploy your portfolio website!";

      // Detect relevant action routes from text
      let actionRoute: string | undefined;
      let actionText: string | undefined;

      if (replyText.includes("/analyze")) {
        actionRoute = "/analyze";
        actionText = "Open ATS Resume Scanner →";
      } else if (replyText.includes("/builder")) {
        actionRoute = "/builder";
        actionText = "Open Resume Builder →";
      } else if (replyText.includes("/portfolio/deploy") || replyText.includes("/portfolio")) {
        actionRoute = "/portfolio/deploy";
        actionText = "Deploy Portfolio Site →";
      } else if (replyText.includes("/interview-prep")) {
        actionRoute = "/interview-prep/1";
        actionText = "Start Voice Practice →";
      } else if (replyText.includes("/salary-calculator")) {
        actionRoute = "/salary-calculator";
        actionText = "Open Salary Negotiator →";
      } else if (replyText.includes("/hiring-probability")) {
        actionRoute = "/hiring-probability";
        actionText = "Check Hiring Odds →";
      } else if (replyText.includes("/branding-studio")) {
        actionRoute = "/branding-studio";
        actionText = "Open Branding Studio →";
      } else if (replyText.includes("/applications")) {
        actionRoute = "/applications";
        actionText = "Open Job Tracker →";
      }

      setMessages((prev) => [
        ...prev,
        { id: `bot-${Date.now()}`, sender: "bot", text: replyText, actionRoute, actionText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: "To boost your ATS score above 85%, upload your resume at /analyze and click 'Auto-Fix All ATS Errors' to automatically inject missing keywords!",
          actionRoute: "/analyze",
          actionText: "Open ATS Scanner →",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 print:hidden">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-12 px-4 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-2xl gap-2 font-bold transition-all transform hover:scale-105"
        >
          <Bot className="w-5 h-5 animate-pulse" />
          <span className="hidden sm:inline">Ask AI Assistant</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        </Button>
      ) : (
        <Card className="w-80 sm:w-96 border-slate-800 bg-slate-900/95 backdrop-blur-xl shadow-2xl overflow-hidden rounded-2xl animate-in fade-in slide-in-from-bottom-2">
          <CardHeader className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-500/30">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-xs font-extrabold text-white flex items-center gap-1.5">
                  Vaylo AI Copilot
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-semibold border border-emerald-500/30">
                    Live AI
                  </span>
                </CardTitle>
                <p className="text-[10px] text-slate-400">Trained on 14 Autonomous Career Tools</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-7 w-7 p-0 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>

          <CardContent className="p-3.5 space-y-3">
            {/* Quick Action Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none text-[10px]">
              {QUICK_ACTIONS.map((action, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(action.prompt)}
                  className="px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-indigo-600/30 border border-slate-700/80 hover:border-indigo-500/50 text-slate-300 hover:text-white transition-all shrink-0 font-medium"
                >
                  {action.label}
                </button>
              ))}
            </div>

            {/* Messages Window */}
            <div className="h-64 overflow-y-auto space-y-3 pr-1 text-xs">
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {m.sender === "bot" && (
                    <div className="w-6 h-6 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                  )}
                  <div className="space-y-1.5 max-w-[82%]">
                    <div
                      className={`p-3 rounded-2xl leading-relaxed text-xs ${
                        m.sender === "user"
                          ? "bg-indigo-600 text-white rounded-br-none shadow-md"
                          : "bg-slate-800/90 border border-slate-700/80 text-slate-200 rounded-bl-none"
                      }`}
                    >
                      {m.text}
                    </div>

                    {m.actionRoute && (
                      <Button
                        size="sm"
                        className="w-full h-7 text-[11px] bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 font-semibold gap-1 justify-between"
                        onClick={() => {
                          setIsOpen(false);
                          router.push(m.actionRoute!);
                        }}
                      >
                        <span>{m.actionText || "Open Tool →"}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 justify-start items-center text-xs text-indigo-400 font-medium">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" /> Vaylo AI is thinking...
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="flex gap-2 pt-2 border-t border-slate-800"
            >
              <Input
                placeholder="Ask Vaylo AI about ATS, resume, or plans..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="text-xs bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 rounded-xl"
              />
              <Button
                type="submit"
                size="sm"
                disabled={loading || !input.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 text-white shrink-0 rounded-xl px-3"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
