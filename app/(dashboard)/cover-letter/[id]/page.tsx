"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Copy, RefreshCw, FileDown, ArrowLeft, Check, Loader2 } from "lucide-react";

export default function CoverLetterPage() {
  const params = useParams();
  const id = params.id as string;

  const [coverLetter, setCoverLetter] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/analyze?id=${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.analysis) {
          setCoverLetter(data.analysis.cover_letter || "");
          setJobTitle(data.analysis.job_title || "");
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
        body: JSON.stringify({ analysisId: id, type: "cover-letter" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCoverLetter(data.coverLetter);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong, try again");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async (format: "pdf" | "docx") => {
    const res = await fetch(`/api/download/${format}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ analysisId: id, jobTitle, type: "cover-letter" }),
    });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${jobTitle || "resume"}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
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
      <div className="flex items-center gap-4">
        <Link href={`/results/${id}`}>
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="w-4 h-4" /> Back to results
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Cover Letter</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Context</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="context">
                <AccordionTrigger className="text-sm">Resume & JD context</AccordionTrigger>
                <AccordionContent>
                  <p className="text-xs text-text-muted">
                    Cover letter is generated based on your resume and job description for{" "}
                    <span className="text-text-secondary">{jobTitle || "this role"}</span>.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Generated cover letter</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleGenerate} disabled={generating} className="gap-1">
                {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                Regenerate
              </Button>
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1">
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                Copy
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <p className="text-danger text-sm">{error}</p>}

            {!coverLetter && !generating ? (
              <div className="text-center py-12">
                <p className="text-text-muted mb-4">No cover letter generated yet</p>
                <Button onClick={handleGenerate}>Generate cover letter</Button>
              </div>
            ) : (
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setCoverLetter(e.currentTarget.innerText)}
                className="p-6 rounded-xl border border-border bg-surface min-h-[400px] text-sm text-text-primary whitespace-pre-wrap leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {coverLetter}
              </div>
            )}

            {coverLetter && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload("pdf")} className="gap-1">
                  <FileDown className="w-3 h-3" /> PDF
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDownload("docx")} className="gap-1">
                  <FileDown className="w-3 h-3" /> DOCX
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
