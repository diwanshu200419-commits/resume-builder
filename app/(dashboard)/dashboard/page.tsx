import Link from "next/link";
import { getProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { StatsBar } from "@/components/dashboard/StatsBar";
import { AnalysisCard } from "@/components/dashboard/AnalysisCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileSearch, ArrowRight } from "lucide-react";
import type { Analysis } from "@/types";
import { UpgradeHandler } from "@/components/dashboard/UpgradeHandler";
import { CareerScoreCard } from "@/components/dashboard/CareerScoreCard";
import { NotificationBar } from "@/components/dashboard/NotificationBar";
import { AIFeed } from "@/components/dashboard/AIFeed";

export default async function DashboardPage() {
  const profile = await getProfile();
  const supabase = await createClient();

  const { data: analyses } = await supabase
    .from("analyses")
    .select("*")
    .eq("user_id", profile!.id)
    .order("created_at", { ascending: false })
    .limit(20);

  const analysisList = (analyses || []) as Analysis[];

  return (
    <div className="space-y-8">
      <UpgradeHandler />
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
        </h1>
        <p className="text-text-secondary mt-1">Track your resume optimizations and ATS improvements</p>
      </div>

      <NotificationBar />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <CareerScoreCard />
          <StatsBar profile={profile!} analyses={analysisList} />
          <Card className="border-accent/30 bg-accent/5">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-accent/20">
              <FileSearch className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h3 className="font-semibold text-text-primary">Analyze a new resume</h3>
              <p className="text-sm text-text-secondary">Upload your resume and paste a job description</p>
            </div>
          </div>
          <Link href="/analyze">
            <Button className="gap-2">
              Start analysis <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
        </div>

        <div className="space-y-6">
          <AIFeed />
        </div>
      </div>

      <div id="history">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent analyses</h2>
        {analysisList.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-text-muted">No analyses yet — start your first one</p>
              <Link href="/analyze" className="mt-4 inline-block">
                <Button variant="outline" size="sm">New analysis</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-elevated">
                <tr className="text-left text-xs text-text-muted uppercase tracking-wider">
                  <th className="py-3 px-4">Job title</th>
                  <th className="py-3 px-4 hidden sm:table-cell">Date</th>
                  <th className="py-3 px-4">Before</th>
                  <th className="py-3 px-4">After</th>
                  <th className="py-3 px-4">Improvement</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {analysisList.map((analysis) => (
                  <AnalysisCard key={analysis.id} analysis={analysis} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
