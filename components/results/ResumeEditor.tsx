"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Save, Check } from "lucide-react";
import sanitizeHtml from "sanitize-html";

interface ResumeEditorProps {
  initialContent: string;
  analysisId: string;
  onSave?: (content: string) => void;
}

export function ResumeEditor({ initialContent, analysisId, onSave }: ResumeEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Sanitize content before rendering
  const sanitizedHtml = useMemo(() => {
    return sanitizeHtml(content.replace(/\n/g, "<br>"), {
      allowedTags: ["br"],
      allowedAttributes: {},
    });
  }, [content]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: analysisId, optimized_resume_text: content }),
      });
      if (!res.ok) throw new Error("Save failed");
      onSave?.(content);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // friendly error - user can retry
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => setContent(e.currentTarget.innerText)}
        className="p-6 rounded-xl border border-border bg-surface min-h-[400px] text-sm text-text-primary whitespace-pre-wrap leading-relaxed focus:outline-none focus:ring-2 focus:ring-accent"
        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      />
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save changes"}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
