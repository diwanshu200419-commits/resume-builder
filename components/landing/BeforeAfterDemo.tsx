"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function BeforeAfterDemo() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            See the difference AI makes
          </h2>
          <p className="text-text-secondary">Real optimization results from ResumeAI users</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="rounded-xl border border-border bg-surface p-6 opacity-70">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="danger">Before — 58% ATS</Badge>
            </div>
            <div className="space-y-3 text-sm text-text-secondary">
              <p>
                <span className="underline decoration-danger decoration-2">Software developer</span> with experience in web development. Worked on various projects using JavaScript and related technologies.
              </p>
              <p className="blur-[2px] select-none">
                Skills: HTML, CSS, JavaScript, basic React knowledge...
              </p>
              <p className="blur-[2px] select-none">
                Experience at company doing web development tasks...
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-accent/30 bg-surface p-6 card-glow">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="success">After — 91% ATS</Badge>
              <div className="flex items-center gap-1 text-success text-sm font-semibold">
                +33 points <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-3 text-sm text-text-primary">
              <p>
                <span className="bg-success/20 px-1 rounded">Full-Stack Software Engineer</span> specializing in scalable web applications. Delivered production-grade solutions using React, Node.js, and cloud technologies with measurable impact on user engagement.
              </p>
              <p>
                <span className="bg-success/20 px-1 rounded">Skills: React.js, Node.js, TypeScript, REST APIs, PostgreSQL, AWS, Agile/Scrum</span>
              </p>
              <p className="blur-[2px] select-none">
                Led development of customer-facing dashboard serving 10K+ users...
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
