"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sparkles, Target, Zap } from "lucide-react";

const platformValues = [
  {
    icon: Target,
    title: "Targeted ATS Match",
    description: "Scan your resume against any job description to discover missing keywords, structural formatting gaps, and section improvements.",
    tag: "ATS Optimization",
  },
  {
    icon: Sparkles,
    title: "AI Interview Coaching",
    description: "Practice answering real FAANG & product interview questions using the STAR framework with instant spoken response evaluation.",
    tag: "Voice Interview",
  },
  {
    icon: Zap,
    title: "Complete Career Toolkit",
    description: "Generate tailored cover letters, optimize your LinkedIn headline, calculate salary expectations, and launch a personal portfolio.",
    tag: "Career Copilot",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">Built for Every Stage of Your Career Search</h2>
          <p className="text-text-secondary text-sm max-w-xl mx-auto">
            Early access platform designed to help freshers, software engineers, and working professionals present their best candidate profile.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {platformValues.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-7 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-border shadow-sm hover:shadow-xl transition-all space-y-4 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <t.icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold bg-indigo-500/15 text-indigo-400 px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {t.tag}
                </span>
              </div>

              <h3 className="font-extrabold text-text-primary text-base">{t.title}</h3>

              <p className="text-xs text-text-secondary leading-relaxed font-normal">
                {t.description}
              </p>

              <div className="pt-3 border-t border-slate-100 dark:border-border flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Integrated in Vaylo AI
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
