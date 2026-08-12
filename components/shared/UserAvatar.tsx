"use client";

import { useState } from "react";
import type { Profile } from "@/types";

export interface UserAvatarProps {
  user?: {
    email?: string | null;
    avatar_url?: string | null;
    user_metadata?: {
      avatar_url?: string | null;
      picture?: string | null;
      full_name?: string | null;
    } | null;
  } | null;
  profile?: Profile | null;
  name?: string | null;
  email?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function getInitials(
  name: string | null | undefined,
  email: string | null | undefined
): string {
  const source = (name || email || "U").trim();
  if (!source) return "U";
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  const src = parts[0] || source;
  if (src.includes("@")) {
    const local = src.split("@")[0];
    return local.slice(0, 2).toUpperCase();
  }
  return src.slice(0, 2).toUpperCase();
}

const SIZE_CLASSES = {
  sm: "w-7 h-7 text-[11px]",
  md: "w-9 h-9 text-xs",
  lg: "w-12 h-12 text-sm",
  xl: "w-20 h-20 text-2xl font-extrabold",
};

export function UserAvatar({
  user,
  profile,
  name,
  email,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const [avatarFailed, setAvatarFailed] = useState(false);

  // Resolution Fallback Chain across Supabase Profile + OAuth User Metadata
  const avatarUrl =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    user?.avatar_url ||
    null;

  const displayName =
    name ||
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    "User";

  const userEmail = email || profile?.email || user?.email || null;
  const initials = getInitials(displayName, userEmail);

  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;
  const hasAvatar = typeof avatarUrl === "string" && avatarUrl.trim().length > 0 && !avatarFailed;

  if (hasAvatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl!}
        alt={displayName}
        referrerPolicy="no-referrer"
        onError={() => setAvatarFailed(true)}
        className={`${sizeClass} rounded-full object-cover shrink-0 border border-border bg-surface-elevated ${className}`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center shrink-0 border border-border ${className}`}
    >
      {initials}
    </div>
  );
}
