"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

interface BeforeAfterViewProps {
  beforeSummary: string;
  afterSummary: string;
  beforeSkills: string;
  afterSkills: string;
  beforeExperience: string;
  afterExperience: string;
}

function ComparisonPanel({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="rounded-xl border border-border bg-surface/50 p-5 opacity-80">
        <Badge variant="danger" className="mb-3">{beforeLabel}</Badge>
        <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
          {before || "No content available"}
        </p>
      </div>
      <div className="rounded-xl border border-success/30 bg-surface p-5">
        <Badge variant="success" className="mb-3">{afterLabel}</Badge>
        <p className="text-sm text-text-primary whitespace-pre-wrap leading-relaxed">
          {after || "No content available"}
        </p>
      </div>
    </div>
  );
}

export function BeforeAfterView({
  beforeSummary,
  afterSummary,
  beforeSkills,
  afterSkills,
  beforeExperience,
  afterExperience,
}: BeforeAfterViewProps) {
  return (
    <div className="space-y-4">
      {/* Suggestion-only callout — clarifies dashboard vs PDF mismatch */}
      <div className="flex items-start gap-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 text-xs text-text-secondary">
        <Info className="w-4 h-4 text-accent shrink-0 mt-0.5" />
        <span>
          <span className="font-semibold text-text-primary">AI Suggestion Preview</span> — these are recommended improvements only.
          To apply them, copy any &quot;After&quot; text into the <span className="font-semibold text-text-primary">Optimized Resume</span> editor below, then click <span className="font-semibold text-text-primary">Save changes</span>. The exported PDF reflects whatever is saved in the editor.
        </span>
      </div>

      <Tabs defaultValue="summary">
        <TabsList className="mb-4">
          <TabsTrigger value="summary">Professional Summary</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <ComparisonPanel before={beforeSummary} after={afterSummary} />
        </TabsContent>
        <TabsContent value="skills">
          <ComparisonPanel before={beforeSkills} after={afterSkills} />
        </TabsContent>
        <TabsContent value="experience">
          <ComparisonPanel before={beforeExperience} after={afterExperience} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
