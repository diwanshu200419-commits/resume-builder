"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";
import {
  LayoutDashboard,
  FileSearch,
  History,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analyze", label: "New Analysis", icon: FileSearch },
    { href: "/dashboard#history", label: "History", icon: History },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const NavContent = () => (
    <>
      <div className="p-6 border-b border-border">
        <Link href="/" className="text-xl font-bold text-text-primary">
          Resume<span className="text-accent">AI</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/analyze" && pathname.startsWith("/analyze")) ||
            (item.href === "/settings" && pathname.startsWith("/settings"));
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent/20 text-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">Current plan</span>
          <PlanBadge plan={profile.plan} />
        </div>
        {profile.plan === "free" && (
          <Link href="/pricing">
            <Button className="w-full" size="sm">
              Upgrade plan
            </Button>
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors w-full px-3 py-2"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-surface border border-border"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-surface h-screen sticky top-0">
        <NavContent />
      </aside>

      {mobileOpen && (
        <aside className="lg:hidden fixed inset-0 z-40 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative flex flex-col w-64 bg-surface h-full">
            <NavContent />
          </div>
        </aside>
      )}
    </>
  );
}
