"use client";

import { motion } from "framer-motion";
import { FileSearch, Mic, FileText, Sparkles } from "lucide-react";

const capabilities = [
  {
    icon: FileSearch,
    title: "100-Point ATS Analyzer",
    subtitle: "Category-based scoring & keyword gap analysis",
    color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: Mic,
    title: "STAR Voice Practice",
    subtitle: "AI interview response evaluation & feedback",
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: FileText,
    title: "Multi-Format Exports",
    subtitle: "Export clean PDF & DOCX resumes without watermarks",
    color: "text-sky-600 bg-sky-500/10 border-sky-500/20",
  },
  {
    icon: Sparkles,
    title: "AI Career Branding",
    subtitle: "LinkedIn profile optimizer & cover letter generator",
    color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
  },
];

export function Metrics() {
  return (
    <section className="py-8 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {capabilities.map((m, i) => (
            <motion.div
              key={m.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-border shadow-sm hover:shadow-md transition-all space-y-2"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${m.color}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <p className="text-base font-extrabold text-text-primary tracking-tight">{m.title}</p>
              <p className="text-xs text-text-muted font-medium">{m.subtitle}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
