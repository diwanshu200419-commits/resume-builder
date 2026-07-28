"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp, Sparkles, Copy, Check, Briefcase, Award, MessageSquare } from "lucide-react";

export default function SalaryCalculatorPage() {
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [experience, setExperience] = useState("3-5");
  const [location, setLocation] = useState("india");
  const [currentCtc, setCurrentCtc] = useState("");

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);

    setTimeout(() => {
      const expMultiplier = experience === "0-2" ? 1 : experience === "3-5" ? 1.6 : experience === "6-8" ? 2.4 : 3.5;
      const baseInr = Math.round(8 * expMultiplier);
      const medianInr = Math.round(14 * expMultiplier);
      const topInr = Math.round(22 * expMultiplier);

      const script = `Hi [Recruiter Name],

Thank you so much for extending the offer for the ${jobTitle} position at [Company Name]. I'm extremely excited about the team's vision and the opportunity to make an impact.

Based on my ${experience} years of hands-on experience in building scalable systems and recent market data for ${jobTitle} roles, industry standards for top performers are currently positioned around ₹${topInr} LPA.

Given my proven track record and key technical proficiencies, I would be thrilled to accept right away if we can adjust the base compensation to ₹${Math.round(topInr * 0.9)} LPA, or include a performance sign-on bonus.

Looking forward to hearing your thoughts!

Best regards,
[Your Name]`;

      setResult({
        currency: location === "remote" ? "$" : "₹",
        symbol: location === "remote" ? "USD" : "LPA",
        p25: location === "remote" ? Math.round(baseInr * 4.5) + "k" : `₹${baseInr} LPA`,
        p50: location === "remote" ? Math.round(medianInr * 4.5) + "k" : `₹${medianInr} LPA`,
        p90: location === "remote" ? Math.round(topInr * 4.5) + "k" : `₹${topInr} LPA`,
        suggestedCounter: location === "remote" ? `$${Math.round(topInr * 4.5 * 0.9)}k / yr` : `₹${Math.round(topInr * 0.9)} LPA`,
        script,
        tips: [
          "Never state your current salary first during initial HR screening calls.",
          "Highlight competing offers or high ATS resume alignment score to increase leverage.",
          "Ask for joining bonus (Sign-on) if base salary budget is capped.",
        ],
      });
      setLoading(false);
    }, 600);
  };

  const handleCopy = () => {
    if (!result?.script) return;
    navigator.clipboard.writeText(result.script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 space-y-8 text-text-primary">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> Market Intelligence & Counter-Offer Generator
        </div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2">
          <DollarSign className="w-8 h-8 text-emerald-500" />
          AI Salary Negotiator & Compensation Benchmark
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Benchmark tech salaries across India & Global Remote roles, and generate word-for-word counter offer scripts to negotiate 30%+ higher compensation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-6 items-start">
        {/* Inputs Form */}
        <Card className="border-border bg-surface shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Salary Benchmark Inputs</CardTitle>
            <CardDescription className="text-xs">Provide your target role and experience to fetch compensation benchmarks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs font-semibold">Target Job Role</Label>
              <Input
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer, Data Scientist"
                className="mt-1 bg-surface-elevated border-border text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Years of Experience</Label>
              <select
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-surface-elevated border border-border text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="0-2">0 - 2 Years (Junior / Entry)</option>
                <option value="3-5">3 - 5 Years (Mid-Level)</option>
                <option value="6-8">6 - 8 Years (Senior Lead)</option>
                <option value="9+">9+ Years (Staff / Principal)</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Target Market / Location</Label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full mt-1 p-2 rounded-xl bg-surface-elevated border border-border text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="india">India (Tier-1 Tech Hubs: BLR, NCR, HYD)</option>
                <option value="remote">Global US/EU Remote Roles ($ USD)</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Current Offer / Expectations (Optional)</Label>
              <Input
                value={currentCtc}
                onChange={(e) => setCurrentCtc(e.target.value)}
                placeholder="e.g. ₹12 LPA or $60k"
                className="mt-1 bg-surface-elevated border-border text-xs"
              />
            </div>

            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold gap-2 shadow-lg transition-all"
              onClick={handleCalculate}
              disabled={loading}
            >
              <TrendingUp className="w-4 h-4" /> Calculate Market Salary & Negotiation Script
            </Button>
          </CardContent>
        </Card>

        {/* Results & Script Display */}
        <div className="space-y-6">
          {!result ? (
            <Card className="border-border bg-surface min-h-[400px] flex items-center justify-center text-center p-8">
              <div className="space-y-3 max-w-sm">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-text-primary text-base">No Compensation Benchmark Generated</h3>
                <p className="text-xs text-text-muted">Enter your target role details on the left to calculate pay percentiles and generate counter offer scripts.</p>
              </div>
            </Card>
          ) : (
            <>
              {/* Pay Percentiles Grid */}
              <div className="grid grid-cols-3 gap-3">
                <Card className="border-border bg-surface p-4 text-center">
                  <p className="text-[11px] text-text-muted font-medium">25th Percentile</p>
                  <p className="text-lg font-bold text-text-primary mt-1">{result.p25}</p>
                  <span className="text-[10px] text-text-muted">Entry Band</span>
                </Card>
                <Card className="border-emerald-500/40 bg-emerald-500/5 p-4 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-emerald-500 text-[9px] font-bold text-white px-2 py-0.5 rounded-bl">MEDIAN</div>
                  <p className="text-[11px] text-emerald-400 font-bold">50th Percentile</p>
                  <p className="text-xl font-extrabold text-emerald-300 mt-1">{result.p50}</p>
                  <span className="text-[10px] text-emerald-400 font-medium">Market Average</span>
                </Card>
                <Card className="border-accent/40 bg-accent/5 p-4 text-center">
                  <p className="text-[11px] text-accent font-bold">90th Top Tier</p>
                  <p className="text-lg font-bold text-accent mt-1">{result.p90}</p>
                  <span className="text-[10px] text-accent">Top Performers</span>
                </Card>
              </div>

              {/* Counter Offer Email Script */}
              <Card className="border-border bg-surface">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-accent" /> Word-for-Word HR Counter Script
                    </CardTitle>
                    <CardDescription className="text-xs">Copy and customize this email to negotiate a higher base offer.</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1 text-xs">
                    {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedScript ? "Copied!" : "Copy Script"}
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <pre className="p-4 rounded-xl bg-surface-elevated border border-border text-xs font-mono text-text-primary whitespace-pre-wrap leading-relaxed overflow-x-auto">
                    {result.script}
                  </pre>

                  {/* Pro Negotiation Tips */}
                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-2">
                    <p className="font-bold flex items-center gap-1.5 text-amber-200">
                      <Award className="w-4 h-4" /> Pro HR Negotiation Rules:
                    </p>
                    <ul className="list-disc pl-4 space-y-1 text-amber-300/90 text-[11px]">
                      {result.tips.map((t: string) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
