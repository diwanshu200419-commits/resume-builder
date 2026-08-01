"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Briefcase,
  Building,
  Calendar,
  ExternalLink,
  Sparkles,
  Search,
  MapPin,
  CheckCircle2,
  X,
  Info,
  Linkedin,
  DollarSign,
  UserCheck,
  BrainCircuit,
  MessageSquare
} from "lucide-react";

interface JobApplication {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  stage: "Saved" | "Applied" | "Interviewing" | "Offer" | "Rejected";
  appliedDate: string;
  atsScore?: number;
  recruiter?: string;
  recruiterEmail?: string;
  notes?: string;
  requirements?: string[];
  link?: string;
}

interface RecommendedJob {
  id: string;
  company: string;
  role: string;
  location: string;
  salary: string;
  skills: string[];
  postedTime: string;
  matchScore: number;
  linkedinUrl: string;
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
    atsScore: 92,
    recruiter: "Ananya Roy (Senior Talent Acquisition Lead)",
    recruiterEmail: "ananya.roy@google.com",
    notes: "Completed Technical Screening round on System Architecture. Next: Coding & STAR Behavioral interview.",
    requirements: ["React.js", "TypeScript", "Web Performance", "Distributed Systems"],
    link: "https://www.linkedin.com/jobs/view/google-senior-react-engineer",
  },
  {
    id: "2",
    company: "Stripe",
    role: "Full Stack Engineer",
    location: "Remote ($ USD)",
    salary: "$120,000 / yr",
    stage: "Applied",
    appliedDate: "2026-07-25",
    atsScore: 89,
    recruiter: "David Miller (Engineering Manager)",
    recruiterEmail: "david.m@stripe.com",
    notes: "Applied with Vaylo AI optimized resume and custom cover letter.",
    requirements: ["Node.js", "TypeScript", "PostgreSQL", "Payment Systems"],
    link: "https://www.linkedin.com/jobs/view/stripe-full-stack-engineer",
  },
  {
    id: "3",
    company: "Flipkart",
    role: "Lead Frontend Architect",
    location: "Bengaluru",
    salary: "₹42 LPA",
    stage: "Offer",
    appliedDate: "2026-07-10",
    atsScore: 96,
    recruiter: "Vikram Malhotra (Lead Tech Recruiter)",
    recruiterEmail: "vikram.m@flipkart.com",
    notes: "Received formal offer letter. Negotiated base salary package using Vaylo AI Salary Negotiator.",
    requirements: ["Next.js", "Micro-frontends", "UI Performance", "GraphQL"],
    link: "https://www.linkedin.com/jobs/view/flipkart-lead-frontend",
  },
  {
    id: "4",
    company: "Microsoft",
    role: "Software Engineer II",
    location: "Hyderabad",
    salary: "₹28 LPA",
    stage: "Saved",
    appliedDate: "2026-07-28",
    atsScore: 85,
    recruiter: "Pooja Verma (University & Lateral Recruiter)",
    recruiterEmail: "pooja.verma@microsoft.com",
    notes: "Saved position for referral request via LinkedIn alumni network.",
    requirements: ["C# / .NET", "Azure", "React", "SQL"],
    link: "https://www.linkedin.com/jobs/view/microsoft-swe-ii",
  },
];

const LINKEDIN_RECOMMENDATIONS: RecommendedJob[] = [
  {
    id: "rec-1",
    company: "OpenAI",
    role: "AI Systems Software Engineer",
    location: "Remote / SF",
    salary: "$160,000 – $220,000 / yr",
    skills: ["Python", "PyTorch", "LLM Inference", "TypeScript"],
    postedTime: "2 hours ago",
    matchScore: 95,
    linkedinUrl: "https://www.linkedin.com/jobs/view/openai-ai-systems-engineer",
  },
  {
    id: "rec-2",
    company: "Uber",
    role: "Staff Frontend Architect",
    location: "Bengaluru (Hybrid)",
    salary: "₹55 LPA – ₹70 LPA",
    skills: ["React.js", "TypeScript", "Mobile Web", "Web Vitals"],
    postedTime: "5 hours ago",
    matchScore: 94,
    linkedinUrl: "https://www.linkedin.com/jobs/view/uber-staff-frontend",
  },
  {
    id: "rec-3",
    company: "Notion",
    role: "Full Stack AI Engineer",
    location: "Remote ($ USD)",
    salary: "$130,000 – $170,000 / yr",
    skills: ["Next.js 14", "Node.js", "Vector DBs", "PostgreSQL"],
    postedTime: "1 day ago",
    matchScore: 91,
    linkedinUrl: "https://www.linkedin.com/jobs/view/notion-full-stack-ai",
  },
  {
    id: "rec-4",
    company: "Zomato",
    role: "Senior Engineering Manager",
    location: "Gurugram / Hybrid",
    salary: "₹45 LPA – ₹60 LPA",
    skills: ["System Design", "Microservices", "Team Leadership"],
    postedTime: "2 days ago",
    matchScore: 88,
    linkedinUrl: "https://www.linkedin.com/jobs/view/zomato-engineering-manager",
  },
];

const STAGES: Array<JobApplication["stage"]> = ["Saved", "Applied", "Interviewing", "Offer", "Rejected"];

export default function ApplicationsTrackerPage() {
  const [jobs, setJobs] = useState<JobApplication[]>(INITIAL_JOBS);
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newSalary, setNewSalary] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;

    const created: JobApplication = {
      id: Date.now().toString(),
      company: newCompany.trim(),
      role: newRole.trim(),
      location: newLocation.trim() || "Remote / Onsite",
      salary: newSalary.trim() || "Market CTC",
      stage: "Saved",
      appliedDate: new Date().toISOString().split("T")[0],
      atsScore: Math.floor(82 + Math.random() * 15),
      recruiter: "Hiring Manager",
      notes: "Newly tracked opportunity via Vaylo AI Application Tracker.",
    };

    setJobs((prev) => [created, ...prev]);
    setNewCompany("");
    setNewRole("");
    setNewSalary("");
    setNewLocation("");
    setShowAddForm(false);
  };

  const handleImportRecommended = (rec: RecommendedJob) => {
    const created: JobApplication = {
      id: `imported-${Date.now()}`,
      company: rec.company,
      role: rec.role,
      location: rec.location,
      salary: rec.salary,
      stage: "Saved",
      appliedDate: new Date().toISOString().split("T")[0],
      atsScore: rec.matchScore,
      recruiter: `${rec.company} Talent Acquisition Team`,
      notes: `Imported directly from LinkedIn Recommended Jobs. Key skills required: ${rec.skills.join(", ")}.`,
      requirements: rec.skills,
      link: rec.linkedinUrl,
    };

    setJobs((prev) => [created, ...prev]);
  };

  const handleMoveStage = (id: string, newStage: JobApplication["stage"]) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, stage: newStage } : j)));
    if (selectedJob && selectedJob.id === id) {
      setSelectedJob({ ...selectedJob, stage: newStage });
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      j.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 space-y-10 text-text-primary">
      {/* Header */}
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
            Track your job applications, interviews, offers, and LinkedIn recommendations in a Linear-style Kanban board.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-48 sm:w-64">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search companies or roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-xs bg-surface"
            />
          </div>
          <Button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-lg text-xs"
          >
            <Plus className="w-4 h-4" /> Add Opportunity
          </Button>
        </div>
      </div>

      {/* Add Job Form */}
      {showAddForm && (
        <Card className="border-emerald-500/30 bg-surface shadow-xl p-5 animate-fade-in">
          <form onSubmit={handleAddJob} className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
            <div>
              <label className="text-xs font-semibold text-text-secondary">Company Name</label>
              <Input
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                placeholder="e.g. OpenAI, Google"
                className="mt-1 text-xs bg-surface-elevated"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary">Target Role</label>
              <Input
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="mt-1 text-xs bg-surface-elevated"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary">Location</label>
              <Input
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. Bengaluru / Remote"
                className="mt-1 text-xs bg-surface-elevated"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-text-secondary">Salary / Package</label>
              <Input
                value={newSalary}
                onChange={(e) => setNewSalary(e.target.value)}
                placeholder="e.g. ₹35 LPA or $120k"
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
          const stageJobs = filteredJobs.filter((j) => j.stage === stage);
          return (
            <div key={stage} className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border">
                <span className="text-xs font-bold text-text-primary uppercase tracking-wider">{stage}</span>
                <Badge variant="outline" className="text-xs font-extrabold bg-surface text-text-secondary">
                  {stageJobs.length}
                </Badge>
              </div>

              <div className="space-y-3 min-h-[420px]">
                {stageJobs.map((j) => (
                  <Card
                    key={j.id}
                    onClick={() => setSelectedJob(j)}
                    className="border-border bg-surface shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all p-4 space-y-3 cursor-pointer relative group"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-text-primary text-sm leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {j.role}
                        </h4>
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                          <Building className="w-3 h-3" /> {j.company}
                        </p>
                      </div>
                      {j.atsScore && (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] shrink-0 font-bold">
                          {j.atsScore}% ATS
                        </Badge>
                      )}
                    </div>

                    <div className="text-[11px] text-text-muted space-y-1">
                      <p className="font-semibold text-text-secondary flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-emerald-500" /> {j.salary}
                      </p>
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-text-muted" /> {j.location}
                      </p>
                    </div>

                    {/* Move Stage Selector */}
                    <div className="pt-2 border-t border-border flex items-center justify-between gap-1" onClick={(e) => e.stopPropagation()}>
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

      {/* Detailed Hiring Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-surface border-border p-6 relative space-y-6 animate-fade-in shadow-2xl">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 p-1 rounded-full text-text-muted hover:bg-surface-elevated transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-600 text-lg shrink-0">
                {selectedJob.company.slice(0, 2)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-text-primary">{selectedJob.role}</h2>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold text-xs">
                    {selectedJob.stage}
                  </Badge>
                </div>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <Building className="w-4 h-4" /> {selectedJob.company} • <MapPin className="w-3.5 h-3.5" /> {selectedJob.location}
                </p>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-surface-elevated border border-border space-y-1">
                <span className="text-[10px] text-text-muted font-bold uppercase">Salary / Package</span>
                <p className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">{selectedJob.salary}</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated border border-border space-y-1">
                <span className="text-[10px] text-text-muted font-bold uppercase">ATS Compatibility</span>
                <p className="text-sm font-extrabold text-indigo-500">{selectedJob.atsScore || 90}% Match</p>
              </div>
              <div className="p-3 rounded-xl bg-surface-elevated border border-border space-y-1">
                <span className="text-[10px] text-text-muted font-bold uppercase">Date Added</span>
                <p className="text-sm font-bold text-text-primary">{selectedJob.appliedDate}</p>
              </div>
            </div>

            {/* Recruiter Details */}
            {selectedJob.recruiter && (
              <div className="p-4 rounded-xl border border-border bg-surface-elevated space-y-2">
                <h4 className="text-xs font-bold text-text-primary flex items-center gap-1.5 uppercase tracking-wider">
                  <UserCheck className="w-4 h-4 text-emerald-500" /> Assigned Talent Lead / Recruiter
                </h4>
                <p className="text-xs text-text-secondary font-medium">{selectedJob.recruiter}</p>
                {selectedJob.recruiterEmail && (
                  <p className="text-xs text-indigo-400 font-mono">{selectedJob.recruiterEmail}</p>
                )}
              </div>
            )}

            {/* Key Requirements & Skills */}
            {selectedJob.requirements && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-indigo-500" /> Key Required Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.requirements.map((req) => (
                    <span key={req} className="px-2.5 py-1 rounded-lg bg-surface-elevated border border-border text-xs font-medium text-text-secondary">
                      {req}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Candidate Notes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-500" /> Application Notes & Interview Logs
              </h4>
              <textarea
                value={selectedJob.notes || ""}
                onChange={(e) => {
                  const updatedNotes = e.target.value;
                  setSelectedJob({ ...selectedJob, notes: updatedNotes });
                  setJobs((prev) => prev.map((j) => (j.id === selectedJob.id ? { ...j, notes: updatedNotes } : j)));
                }}
                className="w-full min-h-[90px] p-3 rounded-xl bg-surface-elevated border border-border text-xs text-text-primary font-sans focus:outline-none"
                placeholder="Add interview feedback, referral notes, or follow-up dates..."
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              {selectedJob.link ? (
                <a href={selectedJob.link} target="_blank" rel="noreferrer">
                  <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                    <ExternalLink className="w-3.5 h-3.5" /> View Portal
                  </Button>
                </a>
              ) : (
                <div />
              )}
              <Button onClick={() => setSelectedJob(null)} className="bg-emerald-600 text-white font-bold text-xs">
                Save &amp; Close
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* LinkedIn AI Recommended Jobs Feed */}
      <div className="space-y-6 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-sky-500" />
              Recommended Tech Roles (Curated Sample Feed)
            </h2>
            <p className="text-xs text-text-secondary">Hand-curated sample tech postings matching candidate skill sets and target roles.</p>
          </div>
          <Badge variant="outline" className="text-xs font-semibold border-sky-500/30 text-sky-400 w-max">
            Curated Sample Feed
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {LINKEDIN_RECOMMENDATIONS.map((rec) => (
            <Card key={rec.id} className="border-border bg-surface hover:border-sky-500/40 p-4 space-y-3 flex flex-col justify-between shadow-sm">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500 bg-sky-500/10 px-2 py-0.5 rounded-full border border-sky-500/20">
                    LinkedIn Match
                  </span>
                  <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
                    {rec.matchScore}% Match
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-text-primary text-sm leading-snug">{rec.role}</h3>
                  <p className="text-xs font-bold text-sky-500 mt-0.5 flex items-center gap-1">
                    <Building className="w-3 h-3" /> {rec.company}
                  </p>
                </div>

                <div className="text-[11px] text-text-muted space-y-1">
                  <p className="font-semibold text-text-secondary">{rec.salary}</p>
                  <p className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-text-muted" /> {rec.location} • {rec.postedTime}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {rec.skills.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded bg-surface-elevated border border-border text-[10px] font-medium text-text-secondary">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center gap-2">
                <Button
                  onClick={() => handleImportRecommended(rec)}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-[11px] h-8 gap-1 font-semibold border-border hover:bg-surface-elevated"
                >
                  <Plus className="w-3 h-3 text-emerald-500" /> Add to Board
                </Button>
                <a href={rec.linkedinUrl} target="_blank" rel="noreferrer">
                  <Button size="sm" className="bg-sky-600 hover:bg-sky-500 text-white text-[11px] h-8 px-2.5 gap-1 font-bold">
                    <Linkedin className="w-3 h-3" /> Apply
                  </Button>
                </a>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
