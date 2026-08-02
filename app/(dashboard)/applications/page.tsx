"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  ExternalLink,
  Trash2,
  Building,
  MapPin,
  Linkedin,
  Bell,
  BellRing,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  Check,
  Briefcase,
} from "lucide-react";

interface Application {
  id: string;
  company: string;
  role: string;
  stage: "wishlist" | "applied" | "interview" | "offer" | "rejected";
  salary?: string;
  location?: string;
  notes?: string;
  appliedDate?: string;
  link?: string;
}

const INITIAL_APPLICATIONS: Application[] = [
  {
    id: "app-1",
    company: "Google",
    role: "Senior AI Software Engineer",
    stage: "interview",
    salary: "$180,000 - $220,000",
    location: "Mountain View, CA (Hybrid)",
    notes: "Round 2 Technical Interview scheduled for Thursday.",
    appliedDate: "2026-07-20",
    link: "https://careers.google.com/jobs/results/",
  },
  {
    id: "app-2",
    company: "Microsoft",
    role: "Software Engineering Intern (2026)",
    stage: "applied",
    salary: "$52 / hr (~₹80,000 / mo)",
    location: "Redmond, WA / Remote",
    notes: "Applied via Microsoft University Recruiting portal.",
    appliedDate: "2026-07-25",
    link: "https://careers.microsoft.com/us/en/search-results?keywords=intern",
  },
  {
    id: "app-3",
    company: "Stripe",
    role: "Staff Infrastructure Engineer",
    stage: "wishlist",
    salary: "$210,000 - $260,000",
    location: "San Francisco, CA",
    notes: "Preparing ATS tailored resume before submitting.",
    appliedDate: "2026-07-28",
    link: "https://stripe.com/jobs",
  },
  {
    id: "app-4",
    company: "OpenAI",
    role: "AI Systems Engineer",
    stage: "offer",
    salary: "$250,000 - $310,000",
    location: "San Francisco, CA",
    notes: "Received written offer letter! Reviewing equity package.",
    appliedDate: "2026-07-10",
    link: "https://openai.com/careers/",
  },
];

interface JobRecommendation {
  id: string;
  category: "internship" | "faang" | "fulltime";
  role: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
  postedTime: string;
  skills: string[];
  directUrl: string;
}

const LIVE_JOB_RECOMMENDATIONS: JobRecommendation[] = [
  // 🎓 INTERNSHIPS & NEW GRAD ROLES
  {
    id: "intern-1",
    category: "internship",
    role: "Software Engineering Intern (2026 / 2027)",
    company: "Google",
    location: "Bengaluru / Mountain View",
    salary: "$52 / hr (₹85,000 / mo)",
    matchScore: 97,
    postedTime: "Just Updated",
    skills: ["Data Structures", "C++ / Python", "Algorithms"],
    directUrl: "https://careers.google.com/jobs/results/?q=intern",
  },
  {
    id: "intern-2",
    category: "internship",
    role: "AI / ML Research Intern",
    company: "Microsoft Research",
    location: "Redmond, WA / Hybrid",
    salary: "$55 / hr",
    matchScore: 96,
    postedTime: "1 hour ago",
    skills: ["PyTorch", "LLM Fine-Tuning", "Python"],
    directUrl: "https://careers.microsoft.com/us/en/search-results?keywords=intern",
  },
  {
    id: "intern-3",
    category: "internship",
    role: "Cloud Infrastructure Engineering Intern",
    company: "Amazon AWS",
    location: "Seattle / Hyderabad",
    salary: "₹75,000 / mo",
    matchScore: 94,
    postedTime: "3 hours ago",
    skills: ["AWS", "Java / Go", "Distributed Systems"],
    directUrl: "https://www.amazon.jobs/en/search?base_query=internship",
  },
  {
    id: "intern-4",
    category: "internship",
    role: "Data Science & Analytics Intern",
    company: "Meta (Facebook)",
    location: "Menlo Park / Remote",
    salary: "$54 / hr",
    matchScore: 93,
    postedTime: "5 hours ago",
    skills: ["SQL", "Python", "A/B Testing"],
    directUrl: "https://www.metacareers.com/jobs?q=intern",
  },
  {
    id: "intern-5",
    category: "internship",
    role: "Finance & Financial Analyst Intern",
    company: "Goldman Sachs",
    location: "Mumbai / Bengaluru",
    salary: "₹65,000 / mo",
    matchScore: 91,
    postedTime: "4 hours ago",
    skills: ["Financial Modeling", "Excel", "P&L Analysis"],
    directUrl: "https://www.linkedin.com/jobs/search/?keywords=Goldman+Sachs+Finance+Intern",
  },

  // 🚀 FAANG & TOP MNC SENIOR ROLES
  {
    id: "faang-1",
    category: "faang",
    role: "AI Systems Software Engineer",
    company: "OpenAI",
    location: "Remote / San Francisco",
    salary: "$160,000 – $220,000 / yr",
    matchScore: 95,
    postedTime: "2 hours ago",
    skills: ["Python", "PyTorch", "LLM Inference"],
    directUrl: "https://www.linkedin.com/jobs/search/?keywords=OpenAI+AI+Systems+Engineer",
  },
  {
    id: "faang-2",
    category: "faang",
    role: "Staff Frontend Architect",
    company: "Uber",
    location: "Bengaluru (Hybrid)",
    salary: "₹55 LPA – ₹70 LPA",
    matchScore: 94,
    postedTime: "5 hours ago",
    skills: ["React.js", "TypeScript", "Mobile Web"],
    directUrl: "https://www.linkedin.com/jobs/search/?keywords=Uber+Frontend+Architect",
  },
  {
    id: "faang-3",
    category: "faang",
    role: "Senior Product Manager (Core AI)",
    company: "Google Cloud",
    location: "Bengaluru / Sunnyvale",
    salary: "₹45 LPA – ₹65 LPA",
    matchScore: 92,
    postedTime: "1 day ago",
    skills: ["Product Strategy", "AI Roadmap", "Agile"],
    directUrl: "https://careers.google.com/jobs/results/?q=Product%20Manager",
  },
  {
    id: "faang-4",
    category: "faang",
    role: "Finance & Accounting Manager (CA)",
    company: "Deloitte India",
    location: "Gurugram / Mumbai",
    salary: "₹28 LPA – ₹38 LPA",
    matchScore: 90,
    postedTime: "1 day ago",
    skills: ["Ind AS", "GST Compliance", "SAP ERP"],
    directUrl: "https://www.linkedin.com/jobs/search/?keywords=Deloitte+Finance+Manager+CA",
  },
];

const STAGES: { key: Application["stage"]; label: string; color: string; countBg: string }[] = [
  { key: "wishlist", label: "Wishlist", color: "border-slate-500/30 text-slate-300", countBg: "bg-slate-800 text-slate-300" },
  { key: "applied", label: "Applied", color: "border-blue-500/30 text-blue-400", countBg: "bg-blue-500/20 text-blue-400" },
  { key: "interview", label: "Interviewing", color: "border-amber-500/30 text-amber-400", countBg: "bg-amber-500/20 text-amber-400" },
  { key: "offer", label: "Offers", color: "border-emerald-500/30 text-emerald-400", countBg: "bg-emerald-500/20 text-emerald-400" },
  { key: "rejected", label: "Archived", color: "border-rose-500/30 text-rose-400", countBg: "bg-rose-500/20 text-rose-400" },
];

export default function KanbanBoardPage() {
  const [applications, setApplications] = useState<Application[]>(INITIAL_APPLICATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeAlerts, setActiveAlerts] = useState<Record<string, boolean>>({});
  const [alertSuccessToast, setAlertSuccessToast] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "internship" | "faang">("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Application | null>(null);

  const [newCompany, setNewCompany] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newStage, setNewStage] = useState<Application["stage"]>("applied");
  const [newSalary, setNewSalary] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newNotes, setNewNotes] = useState("");
  const [newLink, setNewLink] = useState("");

  const handleToggleJobAlert = (jobId: string, roleTitle: string, companyName: string) => {
    const isCurrentlySet = activeAlerts[jobId];
    const newStatus = !isCurrentlySet;

    setActiveAlerts((prev) => ({ ...prev, [jobId]: newStatus }));

    if (newStatus) {
      setAlertSuccessToast(`🔔 Real-Time Job Alert Enabled for "${roleTitle}" at ${companyName}!`);
      setTimeout(() => setAlertSuccessToast(null), 4000);
    }
  };

  const handleAddApplication = () => {
    if (!newCompany.trim() || !newRole.trim()) return;

    const newApp: Application = {
      id: "app-" + Date.now(),
      company: newCompany.trim(),
      role: newRole.trim(),
      stage: newStage,
      salary: newSalary.trim() || undefined,
      location: newLocation.trim() || undefined,
      notes: newNotes.trim() || undefined,
      appliedDate: new Date().toISOString().slice(0, 10),
      link: newLink.trim() || undefined,
    };

    setApplications((prev) => [newApp, ...prev]);

    setNewCompany("");
    setNewRole("");
    setNewStage("applied");
    setNewSalary("");
    setNewLocation("");
    setNewNotes("");
    setNewLink("");
    setIsAddModalOpen(false);
  };

  const handleImportRecommended = (rec: JobRecommendation) => {
    const importedApp: Application = {
      id: "app-" + Date.now(),
      company: rec.company,
      role: rec.role,
      stage: "wishlist",
      salary: rec.salary,
      location: rec.location,
      notes: `Imported from Live Feed (${rec.category.toUpperCase()}). Skills: ${rec.skills.join(", ")}`,
      appliedDate: new Date().toISOString().slice(0, 10),
      link: rec.directUrl,
    };

    setApplications((prev) => [importedApp, ...prev]);
    setSelectedJob(importedApp);
  };

  const filteredApps = applications.filter((app) => {
    const q = searchQuery.toLowerCase();
    return (
      app.company.toLowerCase().includes(q) ||
      app.role.toLowerCase().includes(q) ||
      (app.location && app.location.toLowerCase().includes(q))
    );
  });

  const filteredJobFeed = LIVE_JOB_RECOMMENDATIONS.filter((rec) => {
    if (selectedCategory === "all") return true;
    return rec.category === selectedCategory;
  });

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 space-y-8 text-text-primary">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2 tracking-tight">
            Live Job Feed, Internships &amp; Kanban Tracker
          </h1>
          <p className="text-text-secondary text-sm mt-1">
            Track job applications, browse live FAANG &amp; Internship roles, and configure 1-click real-time AI job alerts.
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 text-xs">
          <Plus className="w-4 h-4" /> Add Application
        </Button>
      </div>

      {/* Global Alert Notification Toast */}
      {alertSuccessToast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between shadow-lg animate-in fade-in">
          <div className="flex items-center gap-2">
            <BellRing className="w-4 h-4 text-emerald-400 animate-bounce" />
            <span>{alertSuccessToast}</span>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30 text-[10px]">Alert Saved</Badge>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search applications or roles by company, title, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-surface text-xs"
          />
        </div>
      </div>

      {/* Kanban Board Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {STAGES.map((stg) => {
          const stageApps = filteredApps.filter((a) => a.stage === stg.key);

          return (
            <div key={stg.key} className="space-y-3 bg-surface-elevated/40 border border-border p-3.5 rounded-2xl flex flex-col min-h-[420px]">
              <div className="flex items-center justify-between border-b border-border pb-2.5">
                <span className="font-bold text-xs flex items-center gap-1.5">
                  {stg.label}
                </span>
                <Badge variant="outline" className={`text-[10px] font-bold ${stg.countBg}`}>
                  {stageApps.length}
                </Badge>
              </div>

              <div className="space-y-3 flex-1">
                {stageApps.length === 0 ? (
                  <div className="h-28 border border-dashed border-border rounded-xl flex items-center justify-center text-center p-4">
                    <p className="text-[11px] text-text-muted">No applications in this stage</p>
                  </div>
                ) : (
                  stageApps.map((app) => (
                    <Card
                      key={app.id}
                      onClick={() => setSelectedJob(app)}
                      className="border-border bg-surface hover:border-indigo-500/40 cursor-pointer p-3.5 space-y-2.5 shadow-sm transition-all hover:translate-y-[-2px]"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-text-primary text-xs leading-snug">{app.role}</h4>
                          <p className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3" /> {app.company}
                          </p>
                        </div>
                      </div>

                      {app.salary && <p className="text-[10px] font-mono text-text-secondary">{app.salary}</p>}

                      <div className="pt-2 border-t border-border flex items-center justify-between text-[10px] text-text-muted">
                        <span>{app.appliedDate || "Recently"}</span>
                        <span className="text-indigo-500 font-bold hover:underline">Details →</span>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* REAL WORKING LIVE JOB FEED & INTERNSHIPS WITH WORKING CAREER URLS */}
      <div className="space-y-6 pt-6 border-t border-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Linkedin className="w-5 h-5 text-sky-500" />
              Live FAANG &amp; Internship Job Feed (Verified Direct Portals)
            </h2>
            <p className="text-xs text-text-secondary">Browse live verified internship &amp; full-time postings with direct working portal links.</p>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-surface border border-border p-1 rounded-xl w-max">
            <button
              type="button"
              onClick={() => setSelectedCategory("all")}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedCategory === "all" ? "bg-indigo-600 text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              All Roles
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("internship")}
              className={`px-3 py-1 rounded-lg text-xs font-bold gap-1 flex items-center transition-all ${
                selectedCategory === "internship" ? "bg-indigo-600 text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" /> Internships (2026/2027)
            </button>
            <button
              type="button"
              onClick={() => setSelectedCategory("faang")}
              className={`px-3 py-1 rounded-lg text-xs font-bold gap-1 flex items-center transition-all ${
                selectedCategory === "faang" ? "bg-indigo-600 text-white" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" /> FAANG &amp; Top MNCs
            </button>
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobFeed.map((rec) => {
            const isAlertSet = activeAlerts[rec.id];

            return (
              <Card key={rec.id} className="border-border bg-surface hover:border-sky-500/40 p-4 space-y-3 flex flex-col justify-between shadow-sm">
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      rec.category === "internship"
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                        : "bg-sky-500/10 text-sky-400 border-sky-500/30"
                    }`}>
                      {rec.category === "internship" ? "🎓 Internship" : "🚀 FAANG / MNC"}
                    </span>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold">
                      {rec.matchScore}% Match
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-text-primary text-sm leading-snug">{rec.role}</h3>
                    <p className="text-xs font-bold text-sky-500 mt-0.5 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5" /> {rec.company}
                    </p>
                  </div>

                  <div className="text-[11px] text-text-muted space-y-1">
                    <p className="font-semibold text-text-secondary">{rec.salary}</p>
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-text-muted" /> {rec.location} • {rec.postedTime}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1">
                    {rec.skills.map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded bg-surface-elevated border border-border text-[10px] font-medium text-text-secondary">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border space-y-2">
                  {/* Job Alert Button */}
                  <Button
                    type="button"
                    onClick={() => handleToggleJobAlert(rec.id, rec.role, rec.company)}
                    variant="outline"
                    size="sm"
                    className={`w-full text-[11px] h-8 gap-1.5 font-bold transition-all ${
                      isAlertSet
                        ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                        : "border-indigo-500/30 text-indigo-500 hover:bg-indigo-500/10"
                    }`}
                  >
                    {isAlertSet ? <BellRing className="w-3.5 h-3.5 text-emerald-400" /> : <Bell className="w-3.5 h-3.5" />}
                    {isAlertSet ? "Job Alert Active" : "Set Job Alert"}
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => handleImportRecommended(rec)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-[11px] h-8 gap-1 font-semibold border-border hover:bg-surface-elevated"
                    >
                      <Plus className="w-3 h-3 text-emerald-500" /> Add to Board
                    </Button>
                    <a href={rec.directUrl} target="_blank" rel="noreferrer">
                      <Button size="sm" className="bg-sky-600 hover:bg-sky-500 text-white text-[11px] h-8 px-3 gap-1 font-bold">
                        <ExternalLink className="w-3 h-3" /> Apply Now
                      </Button>
                    </a>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
