"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Send, Sparkles, Copy, Check, Linkedin, Mail, UserCheck, MessageSquare } from "lucide-react";

export default function NetworkingPage() {
  const [company, setCompany] = useState("Google");
  const [role, setRole] = useState("Software Engineer");
  const [recipientName, setRecipientName] = useState("Rahul");
  const [recipientType, setRecipientType] = useState<"referral" | "recruiter" | "cold">("referral");

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const referralMessage = `Hi ${recipientName},

I came across your profile while researching engineering work at ${company} — your journey is truly inspiring!

I'm applying for the ${role} position at ${company}. Given my background in building high-scale React/Next.js systems and database optimization, I'd be incredibly grateful if you'd be open to submitting an internal referral or sharing any insights about the team culture.

Happy to send over my updated resume and ATS alignment portfolio link if helpful!

Best regards,
[Your Name]`;

  const recruiterMessage = `Hi ${recipientName},

Hope you're having a great week!

I noticed you manage technical hiring for ${company}. I recently applied for the ${role} opening and wanted to reach out directly to express my strong interest.

I have 4+ years of hands-on experience delivering scalable full-stack applications with React, TypeScript, and Node.js. My ATS resume score for this role is positioned in the top 5th percentile.

Would love to connect and share my portfolio if you have 5 minutes for a quick chat!

Best,
[Your Name]`;

  const coldMessage = `Hi ${recipientName},

I've been following the impressive engineering work happening at ${company}, especially around AI integration and scalable web infrastructure.

As a ${role} specializing in full-stack web applications, I'd love to connect and learn more about the team's upcoming technical goals for this quarter.

Looking forward to connecting!

Best regards,
[Your Name]`;

  const currentMessage = recipientType === "referral" ? referralMessage : recipientType === "recruiter" ? recruiterMessage : coldMessage;

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(currentMessage);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto py-6 sm:py-10 space-y-8 text-text-primary">
      <div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" /> High-Converting Outreach Engine
        </div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2 tracking-tight">
          <Send className="w-8 h-8 text-purple-600 dark:text-purple-400" />
          AI Networking & Employee Referral Generator
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Generate personalized LinkedIn outreach messages, employee referral requests, and recruiter emails that get 4x higher response rates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-8 items-start">
        {/* Form */}
        <Card className="border-border bg-surface shadow-lg">
          <CardHeader>
            <CardTitle className="text-base">Outreach Inputs</CardTitle>
            <CardDescription className="text-xs">Provide recipient details to generate tailored messages.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-xs font-semibold">Message Goal / Type</Label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => setRecipientType("referral")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    recipientType === "referral" ? "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400" : "border-border bg-surface-elevated text-text-secondary"
                  }`}
                >
                  Referral Request
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientType("recruiter")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    recipientType === "recruiter" ? "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400" : "border-border bg-surface-elevated text-text-secondary"
                  }`}
                >
                  Recruiter InMail
                </button>
                <button
                  type="button"
                  onClick={() => setRecipientType("cold")}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    recipientType === "cold" ? "border-purple-500 bg-purple-500/10 text-purple-600 dark:text-purple-400" : "border-border bg-surface-elevated text-text-secondary"
                  }`}
                >
                  Cold Connection
                </button>
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Target Company</Label>
              <Input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, Microsoft"
                className="mt-1 bg-surface-elevated text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Target Role</Label>
              <Input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Software Engineer"
                className="mt-1 bg-surface-elevated text-xs"
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Recipient First Name</Label>
              <Input
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Rahul, Sarah"
                className="mt-1 bg-surface-elevated text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Message Output */}
        <Card className="border-border bg-surface shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-sm flex items-center gap-2">
                <Linkedin className="w-4 h-4 text-[#0A66C2]" /> Custom LinkedIn Message
              </CardTitle>
              <CardDescription className="text-xs">Copy and paste this message into LinkedIn InMail or Email.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => handleCopy("msg")} className="gap-1 text-xs">
              {copiedKey === "msg" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedKey === "msg" ? "Copied!" : "Copy Message"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <pre className="p-4 rounded-xl bg-surface-elevated border border-border text-xs font-mono text-text-primary whitespace-pre-wrap leading-relaxed">
              {currentMessage}
            </pre>

            <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-700 dark:text-purple-300 font-medium">
              💡 <strong>Pro Outreach Tip:</strong> Sending internal referral requests to mid-level engineers at target companies yields a 38% higher callback rate than applying directly on job boards!
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
