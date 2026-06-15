"use client";

import { motion } from "framer-motion";
import { Upload, Search, Download } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload your resume",
    description: "Drop your PDF, DOCX, or paste text. We parse it instantly.",
  },
  {
    icon: Search,
    title: "Paste the job description",
    description: "Add the JD you're applying to. Our AI analyzes the match.",
  },
  {
    icon: Download,
    title: "Download optimized resume",
    description: "Get your improved ATS score and a rewritten resume ready to send.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">How it works</h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Three simple steps to beat the ATS and land more interviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-gradient-to-r from-accent/50 to-transparent" />
              )}
              <div className="text-center p-6 rounded-xl border border-border bg-surface card-glow">
                <div className="w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-7 h-7 text-accent" />
                </div>
                <div className="text-xs text-accent font-semibold mb-2">Step {i + 1}</div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
