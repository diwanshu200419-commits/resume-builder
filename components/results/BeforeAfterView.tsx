"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
  );
}
