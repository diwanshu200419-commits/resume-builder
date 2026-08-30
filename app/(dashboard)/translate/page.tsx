"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Globe, Languages, Sparkles, Copy, Check, Loader2, ArrowRight } from "lucide-react";

const LANGUAGES = [
  { code: "en", name: "English (US / UK Standard)" },
  { code: "de", name: "German (Deutsch - DACH Region)" },
  { code: "fr", name: "French (Français - EU Region)" },
  { code: "es", name: "Spanish (Español - LATAM & EU)" },
  { code: "ja", name: "Japanese (日本語 - Asia Remote)" },
  { code: "hi", name: "Hindi (हिंदी - India Regional)" },
];

export default function ResumeTranslatorPage() {
  const [sourceText, setSourceText] = useState("");
  const [targetLang, setTargetLang] = useState("de");
  const [translatedText, setTranslatedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetLanguage: LANGUAGES.find(l => l.code === targetLang)?.name || "German",
          resumeText: sourceText,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.message || "Translation failed");
      }
      if (data.translatedText) {
        setTranslatedText(data.translatedText);
      } else {
        setTranslatedText(`[${LANGUAGES.find(l => l.code === targetLang)?.name} Translation]\n\n` + sourceText);
      }
    } catch (err: any) {
      setTranslatedText(`[Error: ${err.message || "Failed to translate"}]`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 sm:py-10 space-y-8 text-text-primary">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-info/10 border border-info/20 text-info text-xs font-bold mb-3">
          <Globe className="w-3.5 h-3.5" /> International Career Relocation Tool
        </div>
        <h1 className="text-3xl font-extrabold flex items-center gap-2">
          <Languages className="w-8 h-8 text-info" />
          AI Multi-Language Resume Translator
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          Translate your resume, bio, and work experience into German, French, Spanish, Japanese, or English for international tech roles.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Source Content Input */}
        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Globe className="w-4 h-4 text-info" /> Original Resume Content
            </CardTitle>
            <CardDescription className="text-xs">Paste your resume bullets or profile summary here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Paste your original resume text, work experience, or bio here..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              className="min-h-[300px] font-mono text-xs bg-surface-elevated border-border"
            />

            <div>
              <Label className="text-xs font-semibold">Select Target Language</Label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full mt-1.5 p-2.5 rounded-xl bg-surface-elevated border border-border text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-info"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              className="w-full bg-info hover:bg-info/90 text-slate-950 font-bold gap-2 shadow-lg transition-all"
              onClick={handleTranslate}
              disabled={loading || !sourceText.trim()}
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Translate Resume to {LANGUAGES.find((l) => l.code === targetLang)?.name.split(" ")[0]}
            </Button>
          </CardContent>
        </Card>

        {/* Translated Result Output */}
        <Card className="border-border bg-surface min-h-[480px]">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Languages className="w-4 h-4 text-success" /> Translated Resume Output
            </CardTitle>
            {translatedText && (
              <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1 text-xs">
                {copied ? <Check className="w-3.5 h-3.5 text-success" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Translation"}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {!translatedText && !loading ? (
              <div className="min-h-[360px] flex flex-col items-center justify-center text-center p-8">
                <Globe className="w-12 h-12 text-text-muted mb-3 opacity-40" />
                <h3 className="font-bold text-text-primary text-sm mb-1">No Translation Generated</h3>
                <p className="text-xs text-text-muted max-w-xs">Provide source resume text and choose target language on the left.</p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-surface-elevated border border-border text-xs font-mono text-text-primary whitespace-pre-wrap leading-relaxed min-h-[360px]">
                {loading ? (
                  <div className="flex items-center justify-center py-20 text-info gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Translating technical terms...
                  </div>
                ) : (
                  translatedText
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
