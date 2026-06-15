"use client";

import { ShieldCheck, Lock, EyeOff } from "lucide-react";

export function PrivacyBadge() {
  return (
    <div className="flex items-center gap-2 text-xs text-text-muted bg-muted/50 border border-border/50 rounded-full px-3 py-1.5">
      <ShieldCheck className="w-3.5 h-3.5 text-success" />
      <span>Your data is encrypted and never shared</span>
    </div>
  );
}
