"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { getScoreColor } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface ScoreItem {
  label: string;
  before: number;
  after: number;
}

export function ScoreBreakdown({ scores }: { scores: ScoreItem[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {scores.map((score, i) => (
        <motion.div
          key={score.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-text-muted mb-2">{score.label}</p>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold" style={{ color: getScoreColor(score.before) }}>
                  {score.before}%
                </span>
                <ArrowRight className="w-3 h-3 text-text-muted" />
                <span className="text-lg font-bold" style={{ color: getScoreColor(score.after) }}>
                  {score.after}%
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
