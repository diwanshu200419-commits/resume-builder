"use client";

import { motion } from "framer-motion";
import { Upload, Sparkles, Trophy } from "lucide-react";

const steps = [
  {
    icon: Upload,
    stepNum: "1",
    title: "Upload Your Resume",
    description: "Upload your resume and let AI analyze it deeply.",
    badgeColor: "bg-indigo-500/10 text-indigo-600 border-indigo-200",
    numBg: "bg-indigo-600 text-white",
  },
  {
    icon: Sparkles,
    stepNum: "2",
    title: "Get AI Suggestions",
    description: "Receive personalized suggestions to improve your resume.",
    badgeColor: "bg-sky-500/10 text-sky-600 border-sky-200",
    numBg: "bg-sky-600 text-white",
  },
  {
    icon: Trophy,
    stepNum: "3",
    title: "Land Your Dream Job",
    description: "Apply with confidence and crack more interviews.",
    badgeColor: "bg-amber-500/10 text-amber-600 border-amber-200",
    numBg: "bg-amber-500 text-white",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">How Vaylo AI works</h2>
          <p className="text-text-secondary text-sm">Your career transformation in 3 simple steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="relative p-8 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-border shadow-sm hover:shadow-xl transition-all text-center space-y-4"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[65%] w-[70%] h-px border-t-2 border-dashed border-slate-200 dark:border-border z-0 pointer-events-none" />
              )}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border ${step.badgeColor} relative z-10`}>
                <step.icon className="w-7 h-7" />
              </div>

              <div className="space-y-1.5 relative z-10">
                <span className={`w-6 h-6 rounded-full text-xs font-bold inline-flex items-center justify-center mb-1 ${step.numBg}`}>
                  {step.stepNum}
                </span>
                <h3 className="text-lg font-bold text-text-primary">{step.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed max-w-xs mx-auto">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
