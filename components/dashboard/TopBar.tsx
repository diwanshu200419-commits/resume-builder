"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  UserCircle2,
  CreditCard,
  Settings,
  LogOut,
  ShieldAlert,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { Profile } from "@/types";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { NotificationCenter } from "@/components/shared/NotificationCenter";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { createClient } from "@/lib/supabase/client";

interface TopBarProps {
  profile: Profile;
  pageTitle?: string;
}

export function TopBar({ profile, pageTitle }: TopBarProps) {
  const router = useRouter();
  const displayName = profile.full_name || profile.email || "User";

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {
    }
    router.replace("/login");
    router.refresh();
  };

  return (
    <header
      className="sticky top-0 z-30 w-full h-14 bg-surface/80 backdrop-blur border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8"
    >
      <div className="flex items-center min-w-0 flex-1 pl-12 lg:pl-0">
        {pageTitle ? (
          <h1 className="text-lg font-bold text-text-primary truncate">
            {pageTitle}
          </h1>
        ) : null}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationCenter />

        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-2 sm:gap-3 rounded-xl border border-transparent hover:border-border hover:bg-surface-elevated px-2 py-1.5 transition-all focus:outline-none focus:ring-2 focus:ring-accent/40"
            >
              <UserAvatar
                avatarUrl={profile.avatar_url}
                fullName={displayName}
                size="sm"
              />

              <div className="hidden md:flex flex-col items-start leading-tight">
                <span className="font-semibold text-sm text-text-primary">
                  {displayName}
                </span>
                <div className="mt-0.5">
                  <PlanBadge plan={profile.plan} />
                </div>
              </div>

              <ChevronDown className="w-4 h-4 text-text-muted shrink-0" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              align="end"
              sideOffset={8}
              className="bg-surface border border-border rounded-xl shadow-2xl p-2 z-50 w-56 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
            >
              <DropdownMenu.Label className="px-3 py-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
                Account
              </DropdownMenu.Label>

              <DropdownMenu.Item asChild>
                <Link
                  href="/profile"
                  className="rounded-lg px-3 py-2 hover:bg-surface-elevated cursor-pointer flex items-center gap-2 text-sm text-text-primary outline-none data-[highlighted]:bg-surface-elevated"
                >
                  <UserCircle2 className="w-4 h-4 text-text-secondary" />
                  My Profile
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Item asChild>
                <Link
                  href="/account/usage"
                  className="rounded-lg px-3 py-2 hover:bg-surface-elevated cursor-pointer flex items-center gap-2 text-sm text-text-primary outline-none data-[highlighted]:bg-surface-elevated"
                >
                  <CreditCard className="w-4 h-4 text-text-secondary" />
                  Plan &amp; Usage
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Item asChild>
                <Link
                  href="/settings"
                  className="rounded-lg px-3 py-2 hover:bg-surface-elevated cursor-pointer flex items-center gap-2 text-sm text-text-primary outline-none data-[highlighted]:bg-surface-elevated"
                >
                  <Settings className="w-4 h-4 text-text-secondary" />
                  Settings
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Item asChild>
                <Link
                  href="/about"
                  className="rounded-lg px-3 py-2 hover:bg-surface-elevated cursor-pointer flex items-center gap-2 text-sm text-text-primary outline-none data-[highlighted]:bg-surface-elevated"
                >
                  <HelpCircle className="w-4 h-4 text-text-secondary" />
                  Help
                </Link>
              </DropdownMenu.Item>

              <DropdownMenu.Separator className="h-px bg-border my-1.5" />

              {profile.role === "admin" ? (
                <DropdownMenu.Item asChild>
                  <Link
                    href="/admin"
                    className="rounded-lg px-3 py-2 hover:bg-surface-elevated cursor-pointer flex items-center gap-2 text-sm text-text-primary outline-none data-[highlighted]:bg-surface-elevated"
                  >
                    <ShieldAlert className="w-4 h-4 text-accent" />
                    Admin Console
                  </Link>
                </DropdownMenu.Item>
              ) : null}

              <DropdownMenu.Item
                onSelect={handleSignOut}
                className="rounded-lg px-3 py-2 hover:bg-rose-500/10 cursor-pointer flex items-center gap-2 text-sm text-rose-500 outline-none data-[highlighted]:bg-rose-500/10"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
