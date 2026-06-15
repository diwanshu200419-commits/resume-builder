import { notFound } from "next/navigation";
import Link from "next/link";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ATSScoreRing } from "@/components/results/ATSScoreRing";
import { ScoreBreakdown } from "@/components/results/ScoreBreakdown";
import { KeywordBadges } from "@/components/results/KeywordBadges";
import { BeforeAfterView } from "@/components/results/BeforeAfterView";
import { ResumeEditor } from "@/components/results/ResumeEditor";
import { DownloadButtons } from "@/components/results/DownloadButtons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { canAccessCoverLetter, canAccessPremium } from "@/lib/plans";
import type { Analysis } from "@/types";
import { PremiumFeaturesTabs } from "@/components/results/PremiumFeaturesTabs";

export default async function ResultsPage({ params }: { params: { id: string } }) {
  const profile = await getProfile();
  const supabase = await createClient();

  const { data: analysis } = await supabase
    .from("analyses")
    .select("*")
    .eq("id", params.id)
    .eq("user_id", profile!.id)
    .single();

  if (!analysis) notFound();

  const a = analysis as Analysis & {
    keyword_match_score?: number;
    skills_match_score?: number;
    readability_score?: number;
    format_score?: number;
    optimized_keyword_match?: number;
    optimized_skills_match?: number;
    optimized_readability?: number;
    optimized_format?: number;
  };

  const missingKeywords = a.missing_keywords || [];
  const optimizedText = (a.optimized_resume_text || "").toLowerCase();
  const addedKeywords = missingKeywords.filter((kw) =>
    optimizedText.includes(kw.toLowerCase())
  );

  const scoreBreakdown = [
    {
      label: "Keyword match",
      before: a.keyword_match_score || a.original_ats_score || 0,
      after: a.optimized_keyword_match || a.optimized_ats_score || 0,
    },
    {
      label: "Skills match",
      before: a.skills_match_score || a.original_ats_score || 0,
      after: a.optimized_skills_match || a.optimized_ats_score || 0,
    },
    {
      label: "Readability",
      before: a.readability_score || a.original_ats_score || 0,
      after: a.optimized_readability || a.optimized_ats_score || 0,
    },
    {
      label: "Format score",
      before: a.format_score || a.original_ats_score || 0,
      after: a.optimized_format || a.optimized_ats_score || 0,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          {a.job_title || "Analysis results"}
        </h1>
        <p className="text-text-secondary mt-1">Your optimized resume is ready</p>
      </div>

      <Card>
        <CardContent className="p-8 flex justify-center">
          <ATSScoreRing
            beforeScore={a.original_ats_score || 0}
            afterScore={a.optimized_ats_score || 0}
          />
        </CardContent>
      </Card>

      <ScoreBreakdown scores={scoreBreakdown} />

      <Card>
        <CardHeader>
          <CardTitle>Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <KeywordBadges missingKeywords={missingKeywords} addedKeywords={addedKeywords} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Before / After comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <BeforeAfterView
            beforeSummary={a.before_summary || ""}
            afterSummary={a.after_summary || ""}
            beforeSkills={a.before_skills || ""}
            afterSkills={a.after_skills || ""}
            beforeExperience={a.before_experience || ""}
            afterExperience={a.after_experience || ""}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Optimized resume</CardTitle>
        </CardHeader>
        <CardContent>
          <ResumeEditor
            initialContent={a.optimized_resume_text || ""}
            analysisId={a.id}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Download</CardTitle>
        </CardHeader>
        <CardContent>
          <DownloadButtons
            analysisId={a.id}
            profile={profile!}
            jobTitle={a.job_title || undefined}
          />
        </CardContent>
      </Card>

      <PremiumFeaturesTabs
        analysisId={a.id}
        profile={profile!}
        hasCoverLetter={canAccessCoverLetter(profile!)}
        hasPremium={canAccessPremium(profile!)}
        coverLetter={a.cover_letter}
      />
    </div>
  );
}
