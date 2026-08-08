"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Layout, User, Briefcase, GraduationCap, Code, Award, Download, Eye, Sparkles } from "lucide-react";

export default function ResumeBuilderPage() {
  const [template, setTemplate] = useState("Minimalist");
  
  // Resume state
  const [personal, setPersonal] = useState({
    name: "John Doe",
    title: "Software Engineer",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    location: "San Francisco, CA",
    summary: "Dedicated software engineer with experience building web applications using React, Node.js, and TypeScript.",
  });

  const [experience, setExperience] = useState({
    company: "Vaylo AI",
    role: "Full Stack Engineer",
    duration: "2024 - Present",
    bullets: "- Built dynamic checkout and AI career tools resulting in a 40% engagement boost.\n- Optimized backend queries reducing response latency by 200ms.",
  });

  const [education, setEducation] = useState({
    school: "University of Technology",
    degree: "B.S. in Computer Science",
    duration: "2020 - 2024",
  });

  const [skills, setSkills] = useState("React, Next.js, Node.js, TypeScript, PostgreSQL, Tailwind CSS");

  const [aiLoading, setAiLoading] = useState(false);

  const handleAIImprove = async () => {
    setAiLoading(true);
    try {
      const res = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: experience.bullets,
          type: "improve"
        })
      });
      const data = await res.json();
      if (data.optimizedText) {
        setExperience(prev => ({ ...prev, bullets: data.optimizedText }));
      }
    } catch {
      // Keep original on error
    } finally {
      setAiLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  return (
    <div className="max-w-7xl mx-auto py-4 sm:py-8 space-y-6 print:p-0 print:bg-white print:text-black">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary flex items-center gap-2">
            <Layout className="w-7 h-7 text-accent animate-pulse" />
            AI Resume Builder
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Design and customize an ATS-optimized, responsive resume in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Mobile View Toggle Segment */}
          <div className="flex lg:hidden rounded-xl bg-surface-elevated p-1 border border-border">
            <button
              onClick={() => setActiveTab("edit")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "edit" ? "bg-accent text-white shadow-sm" : "text-text-muted hover:text-text-primary"
              }`}
            >
              Edit Form
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === "preview" ? "bg-accent text-white shadow-sm" : "text-text-muted hover:text-text-primary"
              }`}
            >
              Live Preview
            </button>
          </div>

          <Button variant="outline" onClick={handlePrint} className="gap-2 text-xs font-bold">
            <Download className="w-4 h-4" /> Export PDF / Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* Editor Form Panel */}
        <div className={`space-y-6 print:hidden ${activeTab === "preview" ? "hidden lg:block" : "block"}`}>
          {/* Templates */}
          <Card className="border-border bg-surface">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-bold text-text-primary">Choose Resume Style</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap pb-4">
              {["Minimalist", "Developer", "Executive", "Creative"].map((t) => (
                <Button
                  key={t}
                  variant={template === t ? "default" : "outline"}
                  onClick={() => setTemplate(t)}
                  size="sm"
                  className="text-xs font-semibold"
                >
                  {t}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card className="border-border bg-surface">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-bold text-text-primary flex items-center gap-2">
                <User className="w-4 h-4 text-accent" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Full Name</Label>
                  <Input value={personal.name} onChange={(e) => setPersonal({ ...personal, name: e.target.value })} className="text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Target Job Title</Label>
                  <Input value={personal.title} onChange={(e) => setPersonal({ ...personal, title: e.target.value })} className="text-xs" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Email</Label>
                  <Input value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} className="text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Phone</Label>
                  <Input value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} className="text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Location</Label>
                  <Input value={personal.location} onChange={(e) => setPersonal({ ...personal, location: e.target.value })} className="text-xs" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Professional Summary</Label>
                <Textarea value={personal.summary} onChange={(e) => setPersonal({ ...personal, summary: e.target.value })} className="text-xs" rows={3} />
              </div>
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card className="border-border bg-surface">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-accent" /> Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs">Company</Label>
                  <Input value={experience.company} onChange={(e) => setExperience({ ...experience, company: e.target.value })} className="text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Role</Label>
                  <Input value={experience.role} onChange={(e) => setExperience({ ...experience, role: e.target.value })} className="text-xs" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Duration</Label>
                  <Input value={experience.duration} onChange={(e) => setExperience({ ...experience, duration: e.target.value })} className="text-xs" />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <Label className="text-xs">Bullet Points</Label>
                  <Button variant="ghost" size="sm" onClick={handleAIImprove} disabled={aiLoading} className="text-accent hover:text-accent-hover text-xs gap-1 h-7 px-2">
                    <Sparkles className="w-3 h-3" /> AI Refine Bullet Points
                  </Button>
                </div>
                <Textarea value={experience.bullets} onChange={(e) => setExperience({ ...experience, bullets: e.target.value })} rows={4} className="text-xs font-mono" />
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card className="border-border bg-surface">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-bold text-text-primary flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-accent" /> Education
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label className="text-xs">Institution</Label>
                <Input value={education.school} onChange={(e) => setEducation({ ...education, school: e.target.value })} className="text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Degree</Label>
                <Input value={education.degree} onChange={(e) => setEducation({ ...education, degree: e.target.value })} className="text-xs" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Duration</Label>
                <Input value={education.duration} onChange={(e) => setEducation({ ...education, duration: e.target.value })} className="text-xs" />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border-border bg-surface">
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Code className="w-4 h-4 text-accent" /> Technical Skills
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} className="text-xs" />
            </CardContent>
          </Card>
        </div>

        {/* Live Resume Sheet Preview Panel (Fluid & Auto-Sized Paper Container) */}
        <div className={`lg:sticky lg:top-6 space-y-3 ${activeTab === "edit" ? "hidden lg:block" : "block"}`}>
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-accent" /> Live ATS Preview
            </span>
            <span className="text-[10px] font-mono text-text-muted">A4 Paper View</span>
          </div>

          <div className="bg-slate-900/50 p-3 sm:p-6 rounded-2xl border border-border shadow-2xl overflow-x-auto flex justify-center">
            <div className="w-full max-w-[800px] bg-white text-black p-6 sm:p-10 rounded-xl shadow-xl space-y-5 font-sans h-auto print:border-none print:shadow-none print:p-0">
              {/* Header info */}
              <div className="text-center space-y-1.5 border-b border-gray-300 pb-4">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight leading-tight">{personal.name || "Full Name"}</h2>
                <p className="text-xs sm:text-sm font-bold text-indigo-700 tracking-wide uppercase">{personal.title || "Target Role"}</p>
                <p className="text-[11px] sm:text-xs text-gray-600 font-sans">
                  {personal.email} {personal.phone && `• ${personal.phone}`} {personal.location && `• ${personal.location}`}
                </p>
              </div>

              {/* Profile Summary */}
              {personal.summary && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Professional Profile</h3>
                  <p className="text-xs text-gray-700 leading-relaxed font-sans">{personal.summary}</p>
                </div>
              )}

              {/* Professional Experience */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Work Experience</h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-gray-900">
                    <span>{experience.role || "Role"} — {experience.company || "Company"}</span>
                    <span className="font-normal text-gray-500">{experience.duration}</span>
                  </div>
                  <div className="text-xs text-gray-700 whitespace-pre-wrap leading-relaxed pl-2 border-l-2 border-indigo-500/30">
                    {experience.bullets}
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-1.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Education</h3>
                <div className="flex justify-between text-xs font-bold text-gray-900">
                  <span>{education.degree || "Degree"} — {education.school || "School"}</span>
                  <span className="font-normal text-gray-500">{education.duration}</span>
                </div>
              </div>

              {/* Technical Skills */}
              {skills && (
                <div className="space-y-1.5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-200 pb-1">Technical Skills</h3>
                  <p className="text-xs text-gray-700 font-sans">{skills}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
