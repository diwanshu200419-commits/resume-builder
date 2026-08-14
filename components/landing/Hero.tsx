"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, CheckCircle, ShieldCheck, CreditCard, Send, Loader2 } from "lucide-react";

export function Hero() {
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "bot" | "user"; text: string }>>([
    { sender: "bot", text: "How can I help optimize your resume score today?" },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  const handleSendChat = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput.trim();
    setChatInput("");
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/ai/career-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.reply || "To boost your ATS score above 85%, use high-impact action verbs like 'Architected' or 'Spearheaded'!",
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "To boost your ATS score above 85%, use high-impact action verbs like 'Architected' or 'Spearheaded'!",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <section className="relative pt-28 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-background">
      {/* Light Mesh Glow Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <Badge variant="outline" className="px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-surface border-indigo-200 dark:border-border text-indigo-600 dark:text-indigo-400 font-semibold text-xs gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Built for India's Next Generation of Job Seekers
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-text-primary leading-[1.15] tracking-tight"
            >
              Your AI Career Copilot.{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
                Move from application to opportunity.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed"
            >
              Build a stronger resume, optimize it for real job descriptions, prepare for STAR interviews, and launch your career with AI.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
            >
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto px-7 py-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/20 gap-2 transition-all hover:scale-[1.02]">
                  Start Free
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/#features">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 py-6 rounded-xl border-border bg-surface text-text-primary hover:bg-surface-elevated font-semibold gap-2">
                  Explore Features
                </Button>
              </Link>
            </motion.div>

            {/* Honest Value Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 pt-4 text-xs text-text-secondary"
            >
              <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <CreditCard className="w-4 h-4" /> No Credit Card Required
              </div>

              <div className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-4 h-4" /> 100% Private &amp; Secure
              </div>
            </motion.div>
          </div>

          {/* Right SaaS Product Mockup */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-border shadow-2xl space-y-5 text-left relative"
            >
              {/* Card Top bar */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-border pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vaylo AI Dashboard</span>
              </div>

              {/* ATS Score Gauge Box */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 dark:bg-surface-elevated border border-slate-100 dark:border-border/60">
                <div className="w-16 h-16 rounded-full border-4 border-emerald-500 flex items-center justify-center font-extrabold text-2xl text-emerald-600 dark:text-emerald-400 bg-emerald-500/10">
                  89
                </div>
                <div>
                  <h4 className="font-extrabold text-text-primary text-sm">ATS Match Score</h4>
                  <p className="text-xs text-text-muted mt-0.5">Resume optimization analysis breakdown.</p>
                </div>
              </div>

              {/* AI Checklist */}
              <div className="space-y-2 text-xs">
                <p className="font-bold text-text-primary uppercase tracking-wider text-[10px]">AI Optimization Breakdown</p>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-between font-medium">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Quantifiable Metric Achievements
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-500/20 px-2 py-0.5 rounded">Analyzed</span>
                </div>
                <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-between font-medium">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-500" /> Industry Skill Keyword Matching
                  </span>
                  <span className="text-[10px] font-bold bg-indigo-500/20 px-2 py-0.5 rounded">Matched</span>
                </div>
              </div>

              {/* Interactive AI Chat Assistant Box */}
              <div className="p-3.5 rounded-xl bg-slate-900 text-white space-y-3 shadow-inner">
                <div className="flex items-center justify-between text-[11px] border-b border-slate-800 pb-2">
                  <span className="font-bold flex items-center gap-1.5 text-indigo-400">
                    <Sparkles className="w-3.5 h-3.5" /> Interactive AI Career Assistant
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Ready
                  </span>
                </div>

                <div className="max-h-36 overflow-y-auto space-y-2 pr-1 text-xs">
                  {chatMessages.map((m, idx) => (
                    <div key={idx} className={`p-2.5 rounded-lg text-xs leading-relaxed ${m.sender === "user" ? "bg-indigo-600 text-white font-medium ml-4 text-right" : "bg-slate-800 text-slate-200 border border-slate-700 mr-4"}`}>
                      {m.text}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex items-center gap-1.5 text-xs text-indigo-300">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> AI is generating response...
                    </div>
                  )}
                </div>

                <form onSubmit={handleSendChat} className="flex gap-2">
                  <input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask AI anything about your resume..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button type="submit" disabled={chatLoading || !chatInput.trim()} className="p-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition disabled:opacity-50">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
