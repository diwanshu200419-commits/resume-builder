"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Compass, Loader2, Sparkles, GraduationCap, Code, Clock } from "lucide-react";

interface RoadmapData {
  learning_roadmap: { title: string; duration: string; skills_to_learn: string[]; action_steps: string[] }[];
  projects: { title: string; description: string; tech_stack: string[]; difficulty: string }[];
  courses: string[];
  timeline: string;
}

export default function CareerRoadmapPage() {
  const [currentSkills, setCurrentSkills] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [dreamCompany, setDreamCompany] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("Entry Level");

  const [roadmap, setRoadmap] = useState<RoadmapData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!targetRole.trim() || !dreamCompany.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSkills,
          targetRole,
          dreamCompany,
          experienceLevel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not generate roadmap");
      setRoadmap(data);
    } catch (err: any) {
      setError(err.message || "Failed to generate career roadmap");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
          <Compass className="w-8 h-8 text-accent animate-pulse" />
          AI Career Roadmap
        </h1>
        <p className="text-text-secondary mt-1">Generate a custom learning path, course recommendations, and side projects targeting your dream companies.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start">
        {/* Form panel */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg">Configure your goals</CardTitle>
            <CardDescription>Tell Vaylo AI about where you want to go.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="targetRole">Target Role</Label>
              <Input
                id="targetRole"
                placeholder="e.g. Senior Frontend Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dreamCompany">Dream Company</Label>
              <Input
                id="dreamCompany"
                placeholder="e.g. Stripe, Google, Netflix"
                value={dreamCompany}
                onChange={(e) => setDreamCompany(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currentSkills">Current Skills (Optional)</Label>
              <Input
                id="currentSkills"
                placeholder="e.g. HTML, JavaScript, React"
                value={currentSkills}
                onChange={(e) => setCurrentSkills(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="exp">Experience level</Label>
              <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                <SelectTrigger id="exp">
                  <SelectValue placeholder="Select level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Entry Level">Entry Level / Student</SelectItem>
                  <SelectItem value="Mid Level">Mid Level (1-3 years)</SelectItem>
                  <SelectItem value="Senior Level">Senior Level (3+ years)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full bg-accent hover:bg-accent-hover text-white gap-2 font-semibold"
              disabled={loading || !targetRole.trim() || !dreamCompany.trim()}
              onClick={handleGenerate}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Customizing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Map Career Road
                </>
              )}
            </Button>
            {error && <p className="text-xs text-danger">{error}</p>}
          </CardContent>
        </Card>

        {/* Roadmap Display */}
        <Card className="relative overflow-hidden min-h-[400px]">
          {loading && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10">
              <Loader2 className="w-10 h-10 text-accent animate-spin" />
              <p className="text-sm font-semibold animate-pulse text-text-primary">Plotting your coordinates...</p>
            </div>
          )}

          {!roadmap && !loading ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 min-h-[400px]">
              <Compass className="w-16 h-16 text-text-muted mb-4 opacity-30" />
              <h3 className="font-semibold text-text-secondary text-lg mb-2">No Roadmap Generated</h3>
              <p className="text-text-muted text-sm max-w-sm">Provide your target role and dream company, and Vaylo AI will plot a personalized timeline.</p>
            </div>
          ) : (
            roadmap && (
              <CardContent className="p-6 space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-border pb-4 gap-2">
                  <div>
                    <h3 className="text-xl font-bold text-text-primary">Roadmap to {dreamCompany}</h3>
                    <p className="text-sm text-text-secondary">Targeting: {targetRole} ({experienceLevel})</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-accent font-semibold bg-accent/10 px-3 py-1.5 rounded-xl text-sm border border-accent/25">
                    <Clock className="w-4 h-4" />
                    Timeline: {roadmap.timeline}
                  </div>
                </div>

                {/* Phases */}
                <div className="space-y-6">
                  <h4 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-accent" /> Learning milestones
                  </h4>
                  <div className="relative border-l border-border pl-6 ml-3 space-y-6">
                    {roadmap.learning_roadmap.map((phase, idx) => (
                      <div key={idx} className="relative">
                        {/* Dot */}
                        <div className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-accent border-4 border-background flex items-center justify-center" />
                        
                        <div className="space-y-2 bg-surface-elevated border border-border p-4 rounded-xl">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <h5 className="font-bold text-text-primary text-sm">{phase.title}</h5>
                            <span className="text-xs text-accent bg-accent/10 px-2 py-0.5 rounded-lg border border-accent/20 w-fit">{phase.duration}</span>
                          </div>
                          
                          <div className="text-xs text-text-secondary space-y-1">
                            <p className="font-semibold text-text-primary">Skills to master:</p>
                            <div className="flex flex-wrap gap-1.5 py-1">
                              {phase.skills_to_learn.map((s) => (
                                <span key={s} className="bg-background px-2.5 py-1 rounded-md border border-border">{s}</span>
                              ))}
                            </div>
                          </div>

                          <div className="text-xs text-text-secondary space-y-1">
                            <p className="font-semibold text-text-primary">Milestones &amp; Action items:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                              {phase.action_steps.map((step, sIdx) => (
                                <li key={sIdx}>{step}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Side Projects */}
                <div className="space-y-4">
                  <h4 className="text-base font-bold text-text-primary flex items-center gap-2">
                    <Code className="w-5 h-5 text-accent" /> Recommended builds
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roadmap.projects.map((proj, idx) => (
                      <div key={idx} className="bg-surface border border-border p-4 rounded-xl space-y-3 flex flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-bold text-text-primary text-sm">{proj.title}</h5>
                            <span className="text-[10px] text-warning bg-warning/5 border border-warning/20 px-2 py-0.5 rounded-full">{proj.difficulty}</span>
                          </div>
                          <p className="text-xs text-text-secondary leading-relaxed">{proj.description}</p>
                        </div>
                        <div className="flex flex-wrap gap-1 pt-2">
                          {proj.tech_stack.map((t) => (
                            <span key={t} className="text-[10px] text-text-muted bg-surface-elevated px-2 py-0.5 rounded border border-border">{t}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggested Course Topics */}
                {roadmap.courses && roadmap.courses.length > 0 && (
                  <div className="bg-accent/5 border border-accent/15 rounded-xl p-4 space-y-2">
                    <h5 className="text-xs font-bold uppercase text-accent">Recommended core courses / syllabus</h5>
                    <ul className="list-disc list-inside text-xs text-text-secondary space-y-1">
                      {roadmap.courses.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            )
          )}
        </Card>
      </div>
    </div>
  );
}
