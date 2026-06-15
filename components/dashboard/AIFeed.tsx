"use client";

import { Sparkles, Briefcase, TrendingUp, CheckCircle, MessageSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const feedItems = [
  {
    id: 1,
    type: "info",
    icon: <Sparkles className="w-5 h-5 text-accent" />,
    text: "Your resume improved +18 points since your last scan! Keep going!",
    time: "2 minutes ago",
  },
  {
    id: 2,
    type: "trending",
    icon: <TrendingUp className="w-5 h-5 text-success" />,
    text: "React Developer roles increased 12% this month in your region.",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "task",
    icon: <Briefcase className="w-5 h-5 text-text-primary" />,
    text: "Practice 1 behavioral interview question today to stay ready!",
    time: "1 day ago",
  },
  {
    id: 4,
    type: "success",
    icon: <CheckCircle className="w-5 h-5 text-success" />,
    text: "ATS compatibility optimized! You're 82% more likely to pass screening!",
    time: "3 days ago",
  },
  {
    id: 5,
    type: "coach",
    icon: <MessageSquare className="w-5 h-5 text-accent" />,
    text: "Ask your AI Career Coach about salary negotiation tips!",
    time: "This week",
  },
];

export function AIFeed() {
  return (
    <Card className="border-border/80">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Vaylo AI Career Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {feedItems.map((item) => (
          <div key={item.id} className="p-4 rounded-xl border border-border bg-muted/30 flex items-start gap-3">
            <div className="mt-1 p-2 rounded-full bg-muted">
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm text-text-primary">{item.text}</p>
              <p className="text-xs text-text-muted mt-1">{item.time}</p>
            </div>
          </div>
        ))}
        <div className="pt-2">
          <Button variant="ghost" className="w-full text-sm">
            View all updates <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
