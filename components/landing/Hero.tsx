"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Users, Zap, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const TRUST_STATS = [
  { label: "Users helped", value: "2,400+" },
  { label: "ATS score increase", value: "+31%" },
  { label: "Interview calls", value: "2x" },
];

function AnimatedScore() {
  const [score, setScore] = useState(62);

  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setScore((prev) => {
          if (prev >= 89) {
            clearInterval(interval);
            return 89;
          }
          return prev + 1;
        });
      }, 30);
      return () => clearInterval(interval);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12"
    >
      <div className="flex items-center gap-3 px-6 py-4 rounded-xl bg-surface border border-border card-glow">
        <div className="text-center">
          <div className="text-3xl font-bold text-danger">62%</div>
          <div className="text-xs text-text-muted">Before</div>
        </div>
        <ArrowRight className="w-6 h-6 text-accent" />
        <div className="text-center">
          <div className="text-3xl font-bold text-success">{score}%</div>
          <div className="text-xs text-text-muted">After</div>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm text-text-secondary">
        {TRUST_STATS.map((stat, idx) => (
          <div key={idx} className="text-center">
            <p className="font-bold text-lg text-text-primary">{stat.value}</p>
            <p>{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 mb-6">
          <Badge variant="default" className="px-3 py-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" /> Your AI Career Copilot
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" /> 100% Private
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-text-primary leading-tight mb-6"
        >
          Your next career move{" "}
          <span className="text-gradient">starts with AI.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-text-secondary max-w-2xl mx-auto mb-8"
        >
          Vaylo AI optimizes your resume, prepares you for interviews, and helps you find the perfect career path — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto gap-2">
              Start Your Free Career Scan
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/career-coach">
            <Button variant="ghost" size="lg" className="w-full sm:w-auto gap-2">
              Try AI Coach
            </Button>
          </Link>
        </motion.div>

        <AnimatedScore />
      </div>
    </section>
  );
}
