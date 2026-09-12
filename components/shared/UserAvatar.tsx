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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
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

  return (
    <div
      className={`${sizeClass} rounded-full relative inline-flex items-center justify-center shrink-0 border border-border bg-indigo-600 text-white font-bold select-none overflow-hidden`}
      aria-label={safeName}
    >
      <span className="text-current">{initials}</span>

      {hasAvatar && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl!}
          alt={safeName}
          referrerPolicy="no-referrer"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-200 ${
            loaded ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
          style={{ color: "transparent" }}
        />
      )}
    </div>
  );
}

