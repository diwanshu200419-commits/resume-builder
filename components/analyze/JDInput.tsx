"use client";

import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const SAMPLE_JD = `Senior Full Stack Developer

We are looking for a Senior Full Stack Developer to join our engineering team.

Requirements:
- 3+ years of experience with React.js and Node.js
- Strong proficiency in TypeScript and REST API development
- Experience with PostgreSQL or MongoDB
- Knowledge of AWS or cloud deployment
- Familiarity with Agile/Scrum methodologies
- Excellent problem-solving and communication skills

Responsibilities:
- Design and develop scalable web applications
- Collaborate with cross-functional teams
- Write clean, maintainable code with unit tests
- Participate in code reviews and technical discussions
- Mentor junior developers

Nice to have:
- Experience with Next.js and GraphQL
- Knowledge of Docker and CI/CD pipelines
- Open source contributions`;

interface JDInputProps {
  jobDescription: string;
  jobTitle: string;
  onJDChange: (value: string) => void;
  onTitleChange: (value: string) => void;
}

export function JDInput({ jobDescription, jobTitle, onJDChange, onTitleChange }: JDInputProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="job-title">Job title (optional)</Label>
        <Input
          id="job-title"
          placeholder="e.g. Senior Full Stack Developer"
          value={jobTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="mt-1.5"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor="job-description">Job description</Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onJDChange(SAMPLE_JD)}
            className="text-xs h-7"
          >
            Use example JD
          </Button>
        </div>
        <Textarea
          id="job-description"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => onJDChange(e.target.value)}
          className="min-h-[200px] mt-0"
        />
        <p className="text-xs text-text-muted mt-1.5">
          {jobDescription.length.toLocaleString()} characters
        </p>
      </div>
    </div>
  );
}
