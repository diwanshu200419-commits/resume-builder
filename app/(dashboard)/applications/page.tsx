"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, Building, Calendar, ExternalLink, CheckCircle2, Clock, XCircle, Sparkles } from "lucide-react";

interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  stage: "Saved" | "Applied" | "Interviewing" | "Offer" | "Rejected";
  appliedDate: string;
}

const INITIAL_JOBS: JobApplication[] = [
  {
    id: "1",
    company: "Google",
    role: "Senior React Engineer",
    location: "Bengaluru (Hybrid)",
    salary: "₹38 LPA",
    stage: "Interviewing",
    appliedDate: "2026-07-20",
  },
  {
    id: "2",
    company: "Stripe",
    role: "Full Stack Engineer",
    location: "Remote ($ USD)",
    salary: "$120,000 / yr",
    stage: "Applied",
    appliedDate: "2026-07-25",
  },
  {
    id: "3",
    company: "Flipkart",
    role: "Lead Frontend Architect",
    location: "Bengaluru",
    salary: "₹42 LPA",
    stage: "Offer",
    appliedDate: "2026-07-10",
  },
  {
    id: "4",
    company: "Microsoft",
    role: "Software Engineer II",
    location: "Hyderabad",
    salary: "₹28 LPA",
    stage: "Saved",
    appliedDate: "2026-07-28",
  },
];

const STAGES: Array<JobApplication["stage"]> = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];

export default function ApplicationsTrackerPage() {
  const [jobs, setJobs] = useState<JobApplication[]>(INITIAL_JOBS);
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newSalary, setNewSalary] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    const created: JobApplication = {
      id: Date.now().toString(),
      company: newCompany.trim(),
      role: newRole.trim(),
      location: "Remote / Onsite",
      salary: newSalary.trim() || "Market CTC",
      stage: "Saved",
      appliedDate: new Date().toISOString().split("T")[0],
    };

    setJobs((prev) => [created, ...prev]);
    setNewCompany("");
    setNewRole("");
    setNewSalary("");
    setShowAddForm(false);
  };

  const handleMoveStage = (id: string, newStage: JobApplication["stage"]) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, stage: newStage } : j)));
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 space-y-8 text-text-primary">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Career Kanban Pipeline
          </div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2 tracking-tight">
            <Briefcase className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            AI Job Application Tracker
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Track your job applications, interviews, offers, and follow-ups in a Linear-style Kanban board.
          </p>
        </div>

        <Button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> Add New Opportunity
        </Button>
      </div>

      {/* Add Job Form */}
      {showAddForm && (
        <Card className="border-emerald-500/30 bg-surface shadow-xl p-5 animate-fade-in">
          <form onSubmit={handleAddJob} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="text-xs font-semibold text-text-secondary">Company Name</label>
              <Input
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="e.g. OpenAI, Uber"
                className="mt-1 text-xs bg-surface-elevated"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary">Target Role</label>
              <Input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g. Frontend Engineer"
                className="mt-1 text-xs bg-surface-elevated"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary">Expected CTC / Salary</label>
              <Input
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                placeholder="e.g. ₹25 LPA or $100k"
                className="mt-1 text-xs bg-surface-elevated"
              />
            </div>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs">
              Save to Pipeline
            </Button>
          </form>
        </Card>
      )}

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {STAGES.map((stage) => {
          const stageJobs = jobs.filter((j) => j.stage === stage);
          return (
            <div key={stage} className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">{stage}</span>
                <Badge variant="outline" className="text-xs font-extrabold bg-surface text-text-secondary">
                  {stageJobs.length}
                </Badge>
              </div>

              <div className="space-y-3 min-h-[450px]">
                {stageJobs.map((j) => (
                  <Card key={j.id} className="border-border bg-surface shadow-sm hover:shadow-md transition-all p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-text-primary text-sm leading-tight">{j.role}</h4>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                          <Building className="w-3 h-3" /> {j.company}
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] text-text-muted space-y-1">
                      <p className="font-medium text-text-secondary">{j.salary}</p>
                      <p className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-text-muted" /> Applied: {j.appliedDate}
                      </p>
                    </div>

                    {/* Move Stage Selector */}
                    <div className="pt-2 border-t border-border flex items-center justify-between gap-1">
                      <select
                        value={j.stage}
                        onChange={(e) => handleMoveStage(j.id, e.target.value as JobApplication["stage"])}
                        className="w-full text-[10px] p-1.5 rounded-lg bg-surface-elevated border border-border text-text-primary font-medium focus:outline-none"
                      >
                        {STAGES.map((s) => (
                          <option key={s} value={s}>
                            Move to: {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
