"use client";

import { motion } from "framer-motion";

const companies = ["TCS", "Infosys", "Wipro", "Flipkart", "Amazon", "Google"];

export function SocialProof() {
  return (
    <section className="py-12 border-y border-border bg-surface/50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-text-secondary text-sm mb-6"
        >
          Join <span className="text-text-primary font-semibold">2,400+</span> job seekers who improved their ATS score
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {companies.map((company, i) => (
            <motion.span
              key={company}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-text-muted font-semibold text-lg tracking-wide"
            >
              {company}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
