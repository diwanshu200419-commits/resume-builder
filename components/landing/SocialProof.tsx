"use client";

import { motion } from "framer-motion";
import { ShieldCheck, FileCheck, Award, Zap } from "lucide-react";

const capabilities = [
  {
    title: "100-Point ATS Scanner",
    description: "Detailed category scoring & keyword gap matching",
    icon: FileCheck,
  },
  {
    title: "STAR Voice Evaluator",
    description: "AI-powered interview answer pacing & structure feedback",
    icon: Award,
  },
  {
    title: "Unwatermarked Exports",
    description: "Export clean PDF & DOCX resume formats anytime",
    icon: Zap,
  },
  {
    title: "100% Data Protection",
    description: "Your resume records remain private and secure",
    icon: ShieldCheck,
  },
];

export function SocialProof() {
  return (
    <section className="py-10 border-y border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-text-secondary text-xs sm:text-sm font-semibold mb-6 uppercase tracking-wider"
        >
          AI-powered tools built to help you build, improve, and prepare for your next opportunity
        </motion.p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {capabilities.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-4 rounded-xl bg-white dark:bg-surface border border-slate-200 dark:border-border text-left space-y-1.5 shadow-sm"
            >
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                <item.icon className="w-4 h-4 text-indigo-500" />
                <span>{item.title}</span>
              </div>
              <p className="text-[11px] text-text-muted leading-normal">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
