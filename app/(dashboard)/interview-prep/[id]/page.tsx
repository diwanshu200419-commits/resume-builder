"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, RefreshCw, Mic } from "lucide-react";
import type { InterviewQuestions, InterviewQuestion } from "@/types";

function QuestionCard({ q, index }: { q: InterviewQuestion; index: number }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold shrink-0">
            {index + 1}
          </span>
          <div className="flex-1">
            <p className="font-medium text-text-primary text-sm mb-3">{q.question}</p>
            <Accordion type="single" collapsible>
              <AccordionItem value="answer" className="border-0">
                <AccordionTrigger className="text-xs text-accent py-2">Suggested answer</AccordionTrigger>
                <AccordionContent>
                  <p className="text-sm text-text-secondary whitespace-pre-wrap">{q.suggested_answer}</p>
                  {q.tip && (
                    <p className="text-xs text-text-muted mt-3 flex items-center gap-1">
                      <Mic className="w-3 h-3" /> {q.tip}
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <p className="text-xs text-warning mt-2">Practice out loud before your interview</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function InterviewPrepPage() {
  const params = useParams();
  const id = params.id as string;

  const [questions, setQuestions] = useState<InterviewQuestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/analyze?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.analysis?.interview_questions) {
          setQuestions(data.analysis.interview_questions);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId: id, type: "interview" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setQuestions(data.interviewQuestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong, try again");
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/results/${id}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">Interview Prep</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating} className="gap-1">
          {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          {questions ? "Regenerate" : "Generate questions"}
        </Button>
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}
      {!questions ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-text-muted mb-4">Generate personalized interview questions based on your resume and JD</p>
            <Button onClick={handleGenerate} disabled={generating}>Generate interview prep</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-text-primary">HR Questions</h2>
              <Badge variant="default">{questions.hr_questions?.length || 0}</Badge>
            </div>
            <div className="space-y-3">
              {questions.hr_questions?.map((q, i) => (
                <QuestionCard key={i} q={q} index={i} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Technical Questions</h2>
              <Badge variant="default">{questions.technical_questions?.length || 0}</Badge>
            </div>
            <div className="space-y-3">
              {questions.technical_questions?.map((q, i) => (
                <QuestionCard key={i} q={q} index={i} />
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-text-primary">Behavioral Questions</h2>
              <Badge variant="default">{questions.behavioral_questions?.length || 0}</Badge>
            </div>
            <div className="space-y-3">
              {questions.behavioral_questions?.map((q, i) => (
                <QuestionCard key={i} q={q} index={i} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
