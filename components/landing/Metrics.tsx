"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp, Briefcase, BarChart } from "lucide-react";

const metrics = [
  {
    icon: Users,
    value: "2,400+",
    label: "Users helped",
    color: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: TrendingUp,
    value: "31%",
    label: "ATS score increase",
    color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Briefcase,
    value: "2x",
    label: "Interview calls",
    color: "text-sky-600 bg-sky-500/10 border-sky-500/20",
  },
  {
    icon: BarChart,
    value: "62% ➔ 89%",
    label: "Avg. score improvement",
    color: "text-purple-600 bg-purple-500/10 border-purple-500/20",
  },
];

export function Metrics() {
  return (
    <section className="py-8 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="p-5 rounded-2xl bg-white dark:bg-surface border border-slate-200 dark:border-border shadow-sm hover:shadow-md transition-all space-y-2"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${m.color}`}>
                <m.icon className="w-5 h-5" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">{m.value}</p>
              <p className="text-xs text-text-muted font-medium">{m.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
