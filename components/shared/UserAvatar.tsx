"use client";

import { useState, useEffect } from "react";

export interface UserAvatarProps {
  avatarUrl: string | null;
  fullName: string;
  size: "sm" | "md" | "lg";
}

const SIZE_CLASSES = {
  sm: "w-8 h-8 text-[11px]",
  md: "w-12 h-12 text-sm",
  lg: "w-24 h-24 text-2xl",
};

export function UserAvatar({
  avatarUrl,
  fullName,
  size,
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [avatarUrl]);

  const safeName = fullName?.trim() || "User";
  const initials =
    safeName
      .split(/\s+/)
      .map((name) => name[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "U";

  const sizeClass = SIZE_CLASSES[size];

  const trimmed = avatarUrl?.trim();
  const isValidUrl = Boolean(
    trimmed &&
    trimmed !== "null" &&
    trimmed !== "undefined" &&
    (trimmed.startsWith("http://") ||
      trimmed.startsWith("https://") ||
      trimmed.startsWith("data:image/") ||
      trimmed.startsWith("/"))
  );

  const hasAvatar = isValidUrl && !failed;

  if (hasAvatar) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={avatarUrl!}
        alt={safeName}
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className={`${sizeClass} rounded-full object-cover shrink-0 border border-border bg-surface-elevated`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center shrink-0 border border-border select-none`}
      aria-label={safeName}
    >
      {initials}
    </div>
  );
}

