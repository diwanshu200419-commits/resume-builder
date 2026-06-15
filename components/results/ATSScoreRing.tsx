"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getScoreColor } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ATSScoreRingProps {
  beforeScore: number;
  afterScore: number;
}

function ScoreRing({ score, label, size = 140 }: { score: number; label: string; size?: number }) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = getScoreColor(score);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(interval);
      } else {
        setDisplayScore(current);
      }
    }, 20);
    return () => clearInterval(interval);
  }, [score]);

  const offset = circumference - (displayScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2A2A3A"
            strokeWidth="8"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold" style={{ color }}>
            {displayScore}%
          </span>
        </div>
      </div>
      <span className="text-sm text-text-muted mt-2">{label}</span>
    </div>
  );
}

export function ATSScoreRing({ beforeScore, afterScore }: ATSScoreRingProps) {
  const improvement = afterScore - beforeScore;

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-6 sm:gap-10">
        <ScoreRing score={beforeScore} label="Before" />
        <ArrowRight className="w-8 h-8 text-accent hidden sm:block" />
        <ScoreRing score={afterScore} label="After" size={160} />
      </div>
      <div className="text-center">
        <h2 className="text-lg font-semibold text-text-primary mb-2">ATS Score</h2>
        {improvement > 0 && (
          <Badge variant="success" className="text-sm px-3 py-1">
            +{improvement} points improvement
          </Badge>
        )}
      </div>
    </div>
  );
}
