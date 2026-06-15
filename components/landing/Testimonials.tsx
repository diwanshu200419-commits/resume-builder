"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Priya Sharma",
    role: "Software Engineer at Flipkart",
    content: "My ATS score went from 54% to 88% in one session. Got 3 interview calls within a week of using the optimized resume.",
    score: "+34",
  },
  {
    name: "Rahul Mehta",
    role: "Data Analyst at TCS",
    content: "The before/after comparison is incredible. I could see exactly what keywords I was missing and how the AI fixed them naturally.",
    score: "+29",
  },
  {
    name: "Ananya Reddy",
    role: "Product Manager",
    content: "Interview prep questions were spot-on for my target role. The STAR format answers helped me prepare in just 30 minutes.",
    score: "+31",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 px-4 bg-surface/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            Loved by job seekers across India
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-xl border border-border bg-surface card-glow"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-sm text-text-secondary mb-4">&ldquo;{t.content}&rdquo;</p>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-text-primary text-sm">{t.name}</div>
                  <div className="text-xs text-text-muted">{t.role}</div>
                </div>
                <div className="text-success font-bold text-sm">{t.score} pts</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
