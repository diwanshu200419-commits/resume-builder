"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "Vaylo AI improved my resume score from 55 to 91. I started getting interview calls every week!",
    name: "Rohit Sharma",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
  },
  {
    quote: "The AI interview coach is incredible. It felt like talking to a real recruiter.",
    name: "Sneha Verma",
    role: "Product Manager",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
  },
  {
    quote: "Finally, a tool that truly understands what recruiters are looking for.",
    name: "Arjun Mehta",
    role: "Data Analyst",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">Loved by job seekers everywhere</h2>
          <p className="text-text-secondary text-sm">See how Vaylo AI has helped thousands of candidates achieve their career goals.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-7 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-border shadow-sm hover:shadow-xl transition-all space-y-4"
            >
              <div className="flex text-amber-400 gap-1">
                {[...Array(5)].map((_, idx) => (
                  <Star key={idx} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-text-primary leading-relaxed font-medium italic">
                &ldquo;{t.quote}&rdquo;
              </p>

              <div className="flex items-center gap-3 pt-2 border-t border-slate-100 dark:border-border">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-border" />
                <div>
                  <h4 className="font-bold text-text-primary text-xs">{t.name}</h4>
                  <p className="text-[11px] text-text-muted">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
