"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Award, Briefcase, Linkedin } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function CareerScoreCard() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/career/report")
      .then((res) => res.json())
      .then((data) => {
        setReport(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="h-48 animate-pulse bg-surface-elevated rounded-xl" />;
  if (!report || report.error) return null;

  const current = report.current;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-1 border-accent/20 bg-surface">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-text-secondary flex items-center gap-2">
            <Award className="w-4 h-4 text-accent" />
            Overall Career Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-text-primary">{current.overall_score}</span>
            <span className="text-sm text-success font-medium flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" /> {report.growth}
            </span>
          </div>
          <Progress value={current.overall_score} className="h-2 mt-4" />
          <p className="text-xs text-text-muted mt-4">
            Based on resume, skills, experience, and market readiness.
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 border-border bg-surface">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-text-secondary">
            Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Target className="w-3 h-3" /> Resume
            </div>
            <div className="text-lg font-semibold text-text-primary">{current.resume_score}%</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Award className="w-3 h-3" /> Skills
            </div>
            <div className="text-lg font-semibold text-text-primary">{current.skills_score}%</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Briefcase className="w-3 h-3" /> Experience
            </div>
            <div className="text-lg font-semibold text-text-primary">{current.experience_score}%</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-text-muted">
              <Linkedin className="w-3 h-3" /> LinkedIn
            </div>
            <div className="text-lg font-semibold text-text-primary">{current.linkedin_score}%</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
