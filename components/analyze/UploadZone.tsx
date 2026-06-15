"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, X, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { validateResumeFile } from "@/lib/validate-resume";

interface UploadZoneProps {
  onFileParsed: (text: string, filename: string) => void;
  onClear: () => void;
  parsedText: string;
  filename: string;
}

export function UploadZone({ onFileParsed, onClear, parsedText, filename }: UploadZoneProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const validationError = validateResumeFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }

      setError(null);
      setLoading(true);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/parse", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to parse file");

        onFileParsed(data.text, file.name);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong, try again");
      } finally {
        setLoading(false);
      }
    },
    [onFileParsed]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxFiles: 1,
    disabled: loading,
  });

  if (filename) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 rounded-xl border border-accent/30 bg-accent/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="font-medium text-text-primary text-sm">{filename}</div>
              <div className="text-xs text-text-muted">{parsedText.length.toLocaleString()} characters parsed</div>
            </div>
          </div>
          <button onClick={onClear} className="p-1 hover:text-danger transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          {showPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          {showPreview ? "Hide" : "Show"} parsed text preview
        </button>

        {showPreview && (
          <div className="p-4 rounded-lg bg-surface-elevated border border-border max-h-48 overflow-y-auto">
            <pre className="text-xs text-text-secondary whitespace-pre-wrap font-sans">{parsedText}</pre>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200",
          isDragActive
            ? "border-accent bg-accent/10 shadow-glow"
            : "border-border hover:border-accent/50 hover:bg-accent/5"
        )}
      >
        <input {...getInputProps()} />
        <div className="mx-auto w-14 h-14 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
          <Upload className={cn("w-7 h-7 text-accent", loading && "animate-pulse")} />
        </div>
        <p className="text-text-primary font-medium mb-1">
          {loading ? "Parsing your resume..." : isDragActive ? "Drop your resume here" : "Drag & drop your resume"}
        </p>
        <p className="text-sm text-text-muted">PDF, DOCX, or TXT — max 5MB</p>
      </div>
      {error && <p className="text-danger text-sm mt-2">{error}</p>}
    </div>
  );
}
