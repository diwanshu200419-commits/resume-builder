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

  return (
    <div className="max-w-7xl mx-auto py-6 sm:py-10 space-y-8 print:p-0 print:bg-white print:text-black">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-text-primary flex items-center gap-2">
            <Layout className="w-8 h-8 text-accent animate-pulse" />
            AI Resume Builder
          </h1>
          <p className="text-text-secondary mt-1">Design and customize a professional, ATS-friendly resume in real-time.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint} className="gap-2">
            <Download className="w-4 h-4" /> Download / Print PDF
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.3fr] gap-8 items-start">
        {/* Editor Form Panel */}
        <div className="space-y-6 print:hidden">
          {/* Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Choose Template</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap">
              {["Minimalist", "Developer", "Executive", "Creative"].map((t) => (
                <Button
                  key={t}
                  variant={template === t ? "default" : "outline"}
                  onClick={() => setTemplate(t)}
                  size="sm"
                >
                  {t}
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Personal Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-accent" /> Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Full Name</Label>
                  <Input value={personal.name} onChange={(e) => setPersonal({ ...personal, name: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Job Title</Label>
                  <Input value={personal.title} onChange={(e) => setPersonal({ ...personal, title: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input value={personal.email} onChange={(e) => setPersonal({ ...personal, email: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Phone</Label>
                  <Input value={personal.phone} onChange={(e) => setPersonal({ ...personal, phone: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Location</Label>
                  <Input value={personal.location} onChange={(e) => setPersonal({ ...personal, location: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1">
                <Label>Summary</Label>
                <Textarea value={personal.summary} onChange={(e) => setPersonal({ ...personal, summary: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          {/* Work Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-accent" /> Work Experience
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Label>Company</Label>
                  <Input value={experience.company} onChange={(e) => setExperience({ ...experience, company: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Role</Label>
                  <Input value={experience.role} onChange={(e) => setExperience({ ...experience, role: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label>Duration</Label>
                  <Input value={experience.duration} onChange={(e) => setExperience({ ...experience, duration: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                  <Label>Description / Bullet Points</Label>
                  <Button variant="ghost" size="sm" onClick={handleAIImprove} disabled={aiLoading} className="text-accent hover:text-accent-hover gap-1">
                    <Sparkles className="w-3 h-3" /> AI Refine
                  </Button>
                </div>
                <Textarea value={experience.bullets} onChange={(e) => setExperience({ ...experience, bullets: e.target.value })} rows={4} />
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-accent" /> Education
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label>School / College</Label>
                <Input value={education.school} onChange={(e) => setEducation({ ...education, school: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Degree</Label>
                <Input value={education.degree} onChange={(e) => setEducation({ ...education, degree: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label>Duration</Label>
                <Input value={education.duration} onChange={(e) => setEducation({ ...education, duration: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Code className="w-4 h-4 text-accent" /> Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Input value={skills} onChange={(e) => setSkills(e.target.value)} />
            </CardContent>
          </Card>
        </div>

        {/* Live Resume Sheet Preview Panel */}
        <div className="sticky top-6">
          <Card className="border-border bg-white text-black p-8 rounded-none shadow-md min-h-[750px] font-serif space-y-6 print:border-none print:shadow-none">
            {/* Header info */}
            <div className="text-center space-y-2 border-b border-gray-300 pb-4">
              <h2 className="text-2xl font-bold font-sans text-gray-900 leading-tight">{personal.name || "Full Name"}</h2>
              <p className="text-sm font-semibold text-accent tracking-wide uppercase">{personal.title || "Target Role"}</p>
              <p className="text-xs text-gray-500 font-sans">
                {personal.email} &bull; {personal.phone} &bull; {personal.location}
              </p>
            </div>

            {/* Profile Summary */}
            {personal.summary && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1">Profile</h3>
                <p className="text-xs text-gray-600 leading-relaxed font-sans">{personal.summary}</p>
              </div>
            )}

            {/* Professional Experience */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1">Experience</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-gray-900 font-sans">
                  <span>{experience.role || "Role"} @ {experience.company || "Company"}</span>
                  <span className="font-normal text-gray-500">{experience.duration}</span>
                </div>
                <div className="text-xs text-gray-600 whitespace-pre-wrap leading-relaxed pl-2 border-l border-gray-200">
                  {experience.bullets}
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="space-y-2">
              <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1">Education</h3>
              <div className="flex justify-between text-xs font-bold text-gray-900 font-sans">
                <span>{education.degree || "Degree"} &bull; {education.school || "School"}</span>
                <span className="font-normal text-gray-500">{education.duration}</span>
              </div>
            </div>

            {/* Technical Skills */}
            {skills && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold font-sans uppercase tracking-wider text-gray-800 border-b border-gray-200 pb-1">Technical Skills</h3>
                <p className="text-xs text-gray-600 font-sans">{skills}</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
