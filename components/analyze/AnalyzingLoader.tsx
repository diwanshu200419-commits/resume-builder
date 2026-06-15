"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2 } from "lucide-react";

const STEPS = [
  "Reading your resume...",
  "Analyzing job requirements...",
  "Calculating ATS score...",
  "Generating optimization...",
  "Almost done...",
];

export function AnalyzingLoader() {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-surface border border-border rounded-xl p-8 max-w-md w-full mx-4 card-glow"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-text-primary">Analyzing your resume</h2>
          <p className="text-sm text-text-muted mt-1">Usually takes 15-20 seconds</p>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {STEPS.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                {i < currentStep ? (
                  <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                ) : i === currentStep ? (
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-border" />
                )}
                <span
                  className={`text-sm ${
                    i <= currentStep ? "text-text-primary" : "text-text-muted"
                  }`}
                >
                  {step}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
