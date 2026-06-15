"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Lock } from "lucide-react";
import { UpgradeModal } from "@/components/shared/UpgradeModal";
import type { Profile } from "@/types";
import { canDownload } from "@/lib/plans";

interface DownloadButtonsProps {
  analysisId: string;
  profile: Profile;
  jobTitle?: string;
}

export function DownloadButtons({ analysisId, profile, jobTitle }: DownloadButtonsProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [downloading, setDownloading] = useState<"pdf" | "docx" | null>(null);
  const hasAccess = canDownload(profile);

  const handleDownload = async (format: "pdf" | "docx") => {
    if (!hasAccess) {
      setShowUpgrade(true);
      return;
    }

    setDownloading(format);
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
      a.download = res.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/"/g, "") || `resume.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // friendly error
    } finally {
      setDownloading(null);
    }
  };

  return (
    <>
      <div className="relative">
        <div className={`flex flex-col sm:flex-row gap-3 ${!hasAccess ? "blur-sm pointer-events-none select-none" : ""}`}>
          <Button
            size="lg"
            className="gap-2 flex-1"
            onClick={() => handleDownload("pdf")}
            disabled={downloading !== null}
          >
            <FileDown className="w-4 h-4" />
            {downloading === "pdf" ? "Generating..." : "Download PDF"}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 flex-1"
            onClick={() => handleDownload("docx")}
            disabled={downloading !== null}
          >
            <FileDown className="w-4 h-4" />
            {downloading === "docx" ? "Generating..." : "Download DOCX"}
          </Button>
        </div>

        {!hasAccess && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button onClick={() => setShowUpgrade(true)} className="gap-2">
              <Lock className="w-4 h-4" />
              Upgrade to Pro to download
            </Button>
          </div>
        )}
      </div>

      <UpgradeModal
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        feature="Resume download"
        requiredPlan="pro"
      />
    </>
  );
}
