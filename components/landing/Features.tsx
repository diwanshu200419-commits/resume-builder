"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Sparkles,
  GitCompare,
  FileDown,
  Mail,
  MessageSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: BarChart3,
    title: "ATS Score Analysis",
    description: "Get an honest ATS compatibility score with detailed breakdown across keywords, skills, and format.",
  },
  {
    icon: Sparkles,
    title: "AI Resume Optimization",
    description: "Our AI rewrites your resume to naturally incorporate missing keywords without fabricating experience.",
  },
  {
    icon: GitCompare,
    title: "Before/After Comparison",
    description: "See exactly what changed with side-by-side comparison of summary, skills, and experience sections.",
  },
  {
    icon: FileDown,
    title: "PDF + DOCX Download",
    description: "Download your optimized resume in professional PDF or editable DOCX format.",
  },
  {
    icon: Mail,
    title: "Cover Letter Generator",
    description: "Generate personalized cover letters tailored to the job description and your background.",
    badge: "Pro",
  },
  {
    icon: MessageSquare,
    title: "Interview Prep",
    description: "Get HR, technical, and behavioral interview questions with suggested STAR-format answers.",
    badge: "Premium",
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 px-4 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Everything you need to land the interview
          </h2>
          <p className="text-text-secondary max-w-xl mx-auto">
            Powerful AI tools designed specifically for the Indian job market
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl border border-border bg-surface card-glow hover:border-border-active transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                {feature.badge && (
                  <Badge variant={feature.badge === "Premium" ? "warning" : "success"}>
                    {feature.badge}
                  </Badge>
                )}
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-text-secondary">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
