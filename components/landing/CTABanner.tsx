"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function CTABanner() {
  return (
    <section className="py-16 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white text-center space-y-6 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-semibold backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" /> Transform Your Career Today
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
            Ready to take the next step in your career?
          </h2>

          <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto">
            Join our growing community of job seekers using AI to land their dream roles.
          </p>

          <div>
            <Link href="/signup">
              <Button size="lg" className="px-8 py-6 rounded-xl bg-white text-indigo-700 hover:bg-slate-100 font-extrabold shadow-lg gap-2 text-sm transition-all hover:scale-105">
                Start Your Free Career Scan
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
