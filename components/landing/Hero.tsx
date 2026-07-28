"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Star, CheckCircle, ShieldCheck, CreditCard, Send } from "lucide-react";

export function Hero() {
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
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Your AI Career Copilot
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-text-primary leading-[1.15] tracking-tight"
            >
              Your next career move{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 bg-clip-text text-transparent">
                starts with AI.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-text-secondary max-w-xl leading-relaxed"
            >
              Vaylo AI optimizes your resume, prepares you for interviews, and helps you find the perfect career path — all in one place.
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
                  Start Your Free Career Scan
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/career-coach">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 py-6 rounded-xl border-border bg-surface text-text-primary hover:bg-surface-elevated font-semibold gap-2">
                  Try AI Coach
                </Button>
              </Link>
            </motion.div>

            {/* Social Proof Avatars & Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-6 pt-4 text-xs text-text-secondary"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <img className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User 1" />
                  <img className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="User 2" />
                  <img className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="User 3" />
                </div>
                <div>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-text-primary text-[11px]">4.9/5 from 1,200+ users</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-400">
                <CreditCard className="w-4 h-4" /> No Credit Card
              </div>

              <div className="flex items-center gap-1.5 font-medium text-indigo-600 dark:text-indigo-400">
                <ShieldCheck className="w-4 h-4" /> 100% Private
              </div>
            </motion.div>
          </div>

          {/* Right Floating SaaS Product Mockup */}
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
                  <h4 className="font-extrabold text-text-primary text-sm">Excellent ATS Match</h4>
                  <p className="text-xs text-text-muted mt-0.5">Your resume is strong! Ready to send to recruiters.</p>
                </div>
              </div>

              {/* AI Checklist */}
              <div className="space-y-2 text-xs">
                <p className="font-bold text-text-primary uppercase tracking-wider text-[10px]">AI Optimization Checklist</p>
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 flex items-center justify-between font-medium">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Add 4 quantifiable metric achievements
                  </span>
                  <span className="text-[10px] font-bold bg-emerald-500/20 px-2 py-0.5 rounded">Fixed</span>
                </div>
                <div className="p-2.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 flex items-center justify-between font-medium">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-indigo-500" /> Include React & TypeScript keywords
                  </span>
                  <span className="text-[10px] font-bold bg-indigo-500/20 px-2 py-0.5 rounded">Added</span>
                </div>
              </div>

              {/* Mini AI Chat Widget Preview */}
              <div className="p-3 rounded-xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold flex items-center gap-1.5 text-indigo-400">
                    <Sparkles className="w-3.5 h-3.5" /> AI Chat Assistant
                  </span>
                  <span className="text-[10px] text-slate-400">Online</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-800 text-xs text-slate-200">
                  How can I help improve your resume score today?
                </div>
                <div className="flex gap-2">
                  <input readOnly value="Ask anything about your resume..." className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-400 focus:outline-none" />
                  <div className="p-2 rounded-lg bg-indigo-600 text-white">
                    <Send className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
