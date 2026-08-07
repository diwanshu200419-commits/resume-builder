"use client";

import { Sparkles, ArrowRight, Target, FileText, Linkedin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface AIFeedProps {
  activities?: Array<{
    id: string;
    title: string;
    subtitle?: string;
    date?: string;
    icon?: string;
  }>;
  analysesCount?: number;
}

const iconMap: Record<string, React.ReactNode> = {
  sparkles: <Sparkles className="w-5 h-5 text-accent" />,
  target: <Target className="w-5 h-5 text-success" />,
  file: <FileText className="w-5 h-5 text-text-primary" />,
  linkedin: <Linkedin className="w-5 h-5 text-accent" />,
};

export function AIFeed({ activities, analysesCount }: AIFeedProps) {
  const hasActivities = activities && activities.length > 0;

  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Vaylo AI Career Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasActivities ? (
          <>
            {activities!.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-border bg-muted/30 flex items-start gap-3"
              >
                <div className="mt-1 p-2 rounded-full bg-muted">
                  {item.icon ? iconMap[item.icon] || <Sparkles className="w-5 h-5 text-accent" /> : <Sparkles className="w-5 h-5 text-accent" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text-primary">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-text-muted mt-0.5">{item.subtitle}</p>
                  )}
                  {item.date && (
                    <p className="text-xs text-text-muted mt-1">{item.date}</p>
                  )}
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Button variant="ghost" className="w-full text-sm">
                View all updates <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-dashed border-border/60 bg-muted/20 text-center">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-muted mb-3">
                <Sparkles className="w-5 h-5 text-text-muted" />
              </div>
              <p className="text-sm text-text-primary font-medium">
                Activity will appear here as you use Vaylo AI tools.
              </p>
              <p className="text-xs text-text-muted mt-1">
                Start with an ATS analysis or resume optimization.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <div className="p-3 rounded-lg border border-border/60 bg-muted/10 flex items-start gap-3 opacity-70">
                <div className="mt-0.5 p-1.5 rounded-full bg-muted">
                  <Target className="w-4 h-4 text-text-muted" />
                </div>
                <div>
                  <p className="text-xs font-medium text-text-secondary">ATS Scanner</p>
                  <p className="text-xs text-text-muted mt-0.5">Analyses will appear here</p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border/60 bg-muted/10 flex items-start gap-3 opacity-70">
                <div className="mt-0.5 p-1.5 rounded-full bg-muted">
                  <FileText className="w-4 h-4 text-text-muted" />
                </div>
                <div>
                  <p className="text-xs font-medium text-text-secondary">Resume Builder</p>
                  <p className="text-xs text-text-muted mt-0.5">Saves and exports will appear</p>
                </div>
              </div>

              <div className="p-3 rounded-lg border border-border/60 bg-muted/10 flex items-start gap-3 opacity-70">
                <div className="mt-0.5 p-1.5 rounded-full bg-muted">
                  <Linkedin className="w-4 h-4 text-text-muted" />
                </div>
                <div>
                  <p className="text-xs font-medium text-text-secondary">LinkedIn Optimizer</p>
                  <p className="text-xs text-text-muted mt-0.5">Your branding updates tracked</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
