"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UploadZone } from "@/components/analyze/UploadZone";
import { JDInput } from "@/components/analyze/JDInput";
import { AnalyzingLoader } from "@/components/analyze/AnalyzingLoader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function AnalyzePage() {
  const router = useRouter();
  const [resumeText, setResumeText] = useState("");
  const [filename, setFilename] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.remaining !== undefined) setRemaining(data.remaining);
      })
      .catch(() => {});
  }, []);

  const handleAnalyze = async () => {
    if (!resumeText.trim()) {
      setError("Please upload your resume first.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste the job description.");
      return;
    }

    setError(null);
    setAnalyzing(true);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeText,
          jobDescription,
          jobTitle,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "limit_reached") {
          setError("You've used all your free analyses. Upgrade to Pro for unlimited analyses.");
        } else {
          setError(data.error || "Something went wrong, try again");
        }
        setAnalyzing(false);
        return;
      }

      router.push(`/results/${data.id}`);
    } catch {
      setError("Something went wrong, try again");
      setAnalyzing(false);
    }
  };

  return (
    <>
      {analyzing && <AnalyzingLoader />}

      <div className="space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">New analysis</h1>
          <p className="text-text-secondary mt-1">Upload your resume and paste the job description to get started</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">1</span>
              Upload your resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <UploadZone
              onFileParsed={(text, name) => {
                setResumeText(text);
                setFilename(name);
              }}
              onClear={() => {
                setResumeText("");
                setFilename("");
              }}
              parsedText={resumeText}
              filename={filename}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">2</span>
              Job description
            </CardTitle>
          </CardHeader>
          <CardContent>
            <JDInput
              jobDescription={jobDescription}
              jobTitle={jobTitle}
              onJDChange={setJobDescription}
              onTitleChange={setJobTitle}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/20 text-accent text-xs flex items-center justify-center font-bold">3</span>
              Analyze
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {remaining !== null && (
              <Badge variant="outline" className="text-text-muted">
                {remaining} of 2 free analyses remaining
              </Badge>
            )}

            {error && <p className="text-danger text-sm">{error}</p>}

            <Button
              size="lg"
              className="w-full sm:w-auto gap-2"
              onClick={handleAnalyze}
              disabled={analyzing}
            >
              <Sparkles className="w-4 h-4" />
              Analyze my resume
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
