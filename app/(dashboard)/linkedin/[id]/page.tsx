"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2, RefreshCw, Copy, Check } from "lucide-react";
import type { LinkedInSuggestions } from "@/types";

export default function LinkedInPage() {
  const params = useParams();
  const id = params.id as string;

  const [suggestions, setSuggestions] = useState<LinkedInSuggestions | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/analyze?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.analysis?.linkedin_suggestions) {
          setSuggestions(data.analysis.linkedin_suggestions);
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
        body: JSON.stringify({ analysisId: id, type: "linkedin" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuggestions(data.linkedinSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong, try again");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
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
          <h1 className="text-2xl font-bold text-text-primary">LinkedIn Optimizer</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating} className="gap-1">
          {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          {suggestions ? "Regenerate" : "Generate suggestions"}
        </Button>
      </div>

      {error && <p className="text-danger text-sm">{error}</p>}
      {!suggestions ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-text-muted mb-4">Optimize your LinkedIn profile for your target role</p>
            <Button onClick={handleGenerate} disabled={generating}>Generate LinkedIn suggestions</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Headline suggestions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {suggestions.headline_options?.map((headline, i) => (
                <div key={i} className="flex items-start justify-between gap-4 p-4 rounded-lg bg-surface-elevated border border-border">
                  <p className="text-sm text-text-primary">{headline}</p>
                  <Button variant="ghost" size="sm" onClick={() => handleCopy(headline, i)} className="shrink-0">
                    {copiedIndex === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>About section rewrite</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                {suggestions.about_section}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skills to add</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {suggestions.skills_to_add?.map((skill) => (
                  <Badge key={skill} variant="success">{skill}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Profile strength tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {suggestions.profile_tips?.map((tip, i) => (
                  <li key={i} className="text-sm text-text-secondary flex items-start gap-2">
                    <span className="text-accent font-bold">{i + 1}.</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
