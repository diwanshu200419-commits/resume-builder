"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="md:col-span-1 border border-border bg-surface rounded-2xl p-5 sm:p-6 h-[180px] sm:h-[190px] animate-pulse space-y-4">
          <div className="h-4 w-28 bg-surface-elevated rounded" />
          <div className="h-10 w-20 bg-surface-elevated rounded" />
          <div className="h-2 w-full bg-surface-elevated rounded" />
          <div className="h-3 w-3/4 bg-surface-elevated rounded" />
        </div>
        <div className="md:col-span-2 border border-border bg-surface rounded-2xl p-5 sm:p-6 h-[180px] sm:h-[190px] animate-pulse space-y-4">
          <div className="h-4 w-28 bg-surface-elevated rounded" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="h-12 bg-surface-elevated rounded" />
            <div className="h-12 bg-surface-elevated rounded" />
            <div className="h-12 bg-surface-elevated rounded" />
            <div className="h-12 bg-surface-elevated rounded" />
          </div>
        </div>
      </div>
    );
  }

  const current = report?.current;
  const hasValidReport = current && typeof current.overall_score === "number";

  if (!hasValidReport) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card className="border-border/80 bg-surface">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-text-secondary flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
              Career Score
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2 max-w-md">
                <p className="text-sm text-text-primary">
                  Complete your profile and run analyses to calculate your career score.
                </p>
                <p className="text-xs text-text-muted">
                  We&apos;ll benchmark resume, skills, experience, and LinkedIn readiness.
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild size="sm">
                  <Link href="/profile">
                    Calculate my score →
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const growth = report?.growth;

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
            {growth && (
              <span className="text-sm text-success font-medium flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> {growth}
              </span>
            )}
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
          {typeof current.resume_score === "number" && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Target className="w-3 h-3" /> Resume
              </div>
              <div className="text-lg font-semibold text-text-primary">{current.resume_score}%</div>
            </div>
          )}
          {typeof current.skills_score === "number" && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Award className="w-3 h-3" /> Skills
              </div>
              <div className="text-lg font-semibold text-text-primary">{current.skills_score}%</div>
            </div>
          )}
          {typeof current.experience_score === "number" && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Briefcase className="w-3 h-3" /> Experience
              </div>
              <div className="text-lg font-semibold text-text-primary">{current.experience_score}%</div>
            </div>
          )}
          {typeof current.linkedin_score === "number" && (
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-text-muted">
                <Linkedin className="w-3 h-3" /> LinkedIn
              </div>
              <div className="text-lg font-semibold text-text-primary">{current.linkedin_score}%</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
