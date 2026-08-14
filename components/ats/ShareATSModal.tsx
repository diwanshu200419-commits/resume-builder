"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Share2, Copy, Check, ShieldCheck, Twitter, Linkedin, Loader2, EyeOff } from "lucide-react";

interface ShareATSModalProps {
  score: number;
  keywordScore?: number;
  skillsScore?: number;
  readabilityScore?: number;
  formattingScore?: number;
  triggerText?: string;
  variant?: "default" | "outline" | "secondary";
}

export function ShareATSModal({
  score,
  keywordScore,
  skillsScore,
  readabilityScore,
  formattingScore,
  triggerText = "Share My ATS Result",
  variant = "outline",
}: ShareATSModalProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [revoked, setRevoked] = useState(false);

  const generateShareLink = async () => {
    if (shareUrl && !revoked) return;
    setLoading(true);
    setRevoked(false);

    try {
      const res = await fetch("/api/share/ats/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          score,
          keywordScore,
          skillsScore,
          readabilityScore,
          formattingScore,
        }),
      });
      const data = await res.json();
      if (data.shareUrl) {
        setShareUrl(data.shareUrl);
        setPublicId(data.publicId);
      }
    } catch (err) {
      console.error("Could not generate share link:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (isOpen && !shareUrl) {
      generateShareLink();
    }
  };

  const handleCopyLink = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(
      `I just checked my resume with VayloAI and got an ATS score of ${score}/100! 🚀\n\nCheck your resume for free:`
    );
    const url = encodeURIComponent("https://www.vayloai.online/free-ats-checker");
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(shareUrl || "https://www.vayloai.online/free-ats-checker");
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, "_blank");
  };

  const handleRevokeSharing = async () => {
    if (!publicId) return;
    setRevoking(true);
    try {
      await fetch(`/api/share/ats/${publicId}`, { method: "DELETE" });
      setRevoked(true);
      setShareUrl(null);
    } catch (err) {
      console.error("Could not revoke sharing:", err);
    } finally {
      setRevoking(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={variant} className="gap-2 font-bold text-xs shadow-sm">
          <Share2 className="w-3.5 h-3.5 text-indigo-400" />
          {triggerText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-slate-950 border-slate-800 text-white p-6 rounded-2xl shadow-2xl">
        <DialogHeader className="space-y-2 text-left">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-400" /> Share Privacy-Safe ATS Result
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 leading-relaxed">
            Create a public badge to share your ATS readiness score on LinkedIn or Twitter.
          </DialogDescription>
        </DialogHeader>

        {/* 100% Privacy Banner */}
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] text-emerald-300 flex items-start gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-tight">
            <strong>100% Privacy Protected:</strong> Your name, email, address, employer names, and resume text are <strong>NEVER</strong> included on public share cards.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-8 text-slate-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            <span className="text-xs">Generating privacy-safe share link...</span>
          </div>
        ) : revoked ? (
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-center space-y-3">
            <EyeOff className="w-6 h-6 text-amber-400 mx-auto" />
            <p className="text-xs font-semibold text-slate-200">Public Sharing Stopped</p>
            <p className="text-[11px] text-slate-400">The public URL has been deactivated and will no longer display your score.</p>
            <Button size="sm" onClick={generateShareLink} className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold">
              Re-enable Public Sharing
            </Button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Share Link Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">Public Share URL</label>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={shareUrl || "Generating..."}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-amber-300 select-all focus:outline-none"
                />
                <Button
                  size="sm"
                  onClick={handleCopyLink}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shrink-0 gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </Button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">Share to Social Networks</label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareLinkedIn}
                  className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold gap-2"
                >
                  <Linkedin className="w-4 h-4 text-sky-400" /> LinkedIn
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShareTwitter}
                  className="border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold gap-2"
                >
                  <Twitter className="w-4 h-4 text-sky-400" /> X (Twitter)
                </Button>
              </div>
            </div>

            {/* Stop Sharing Control */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Want to revoke this link?</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRevokeSharing}
                disabled={revoking}
                className="text-[11px] text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 h-7 font-semibold"
              >
                {revoking ? <Loader2 className="w-3 h-3 animate-spin" /> : "Stop Sharing"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
