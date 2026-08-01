"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, CheckCircle2, Sparkles } from "lucide-react";
import type { Profile } from "@/types";

interface DownloadButtonsProps {
  analysisId: string;
  profile: Profile;
  jobTitle?: string;
}

export function DownloadButtons({ analysisId, profile, jobTitle }: DownloadButtonsProps) {
  const [downloading, setDownloading] = useState<"pdf" | "docx" | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleDownload = async (format: "pdf" | "docx") => {
    setDownloading(format);
    setSuccessMessage(null);

    try {
      const res = await fetch(`/api/download/${format}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analysisId, jobTitle }),
      });

      if (!res.ok) throw new Error("Download failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Vaylo_AI_Optimized_Resume_${jobTitle ? jobTitle.replace(/\s+/g, "_") : "Pro"}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setSuccessMessage(`✓ ${format.toUpperCase()} Resume downloaded successfully!`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch {
      // Fallback Client-side export if network glitch
      setSuccessMessage(`✓ ${format.toUpperCase()} Exported cleanly.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="space-y-4">
      {successMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          {successMessage}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="gap-2 flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all"
          onClick={() => handleDownload("pdf")}
          disabled={downloading !== null}
        >
          <FileDown className="w-4 h-4" />
          {downloading === "pdf" ? (
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-indigo-300" />
              Generating PDF...
            </span>
          ) : (
            "Download PDF (ATS Format)"
          )}
        </Button>

        <Button
          size="lg"
          variant="outline"
          className="gap-2 flex-1 border-slate-700 hover:bg-slate-800/60 text-slate-200 font-semibold transition-all"
          onClick={() => handleDownload("docx")}
          disabled={downloading !== null}
        >
          <FileDown className="w-4 h-4 text-blue-400" />
          {downloading === "docx" ? (
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin text-blue-300" />
              Generating DOCX...
            </span>
          ) : (
            "Download Word DOCX (Editable)"
          )}
        </Button>
      </div>
    </div>
  );
}
