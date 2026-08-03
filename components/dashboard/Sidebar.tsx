"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NotificationCenter } from "@/components/shared/NotificationCenter";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";
import {
  LayoutDashboard,
  FileSearch,
  Settings,
  LogOut,
  Menu,
  X,
  Layout,
  Compass,
  Flame,
  Laptop,
  ShieldAlert,
  Target,
  DollarSign,
  Languages,
  Briefcase,
  Send,
  Zap,
  Eye,
  Palette,
  Globe,
  Github,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

export function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Lock body scrolling when off-canvas drawer is open on mobile
  useEffect(() => {
    if (typeof document !== "undefined") {
      if (mobileOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  }, [mobileOpen]);

  // Handle ESC key press to close mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen]);

  const handleLogout = async () => {
    document.cookie = "mock-session-id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    try {
      localStorage.clear();
      sessionStorage.clear();
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    window.location.href = "/login";
  };

  const ADMIN_EMAILS = [
    "admin@vaylo.ai",
    "jattshiv32@gmail.com",
    "paid_tester_123@example.com"
  ];

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analyze", label: "New Analysis", icon: FileSearch },
    { href: "/job-match", label: "Job Match", icon: Target },
    { href: "/builder", label: "Resume Builder", icon: Layout },
    { href: "/hiring-probability", label: "Hiring Odds AI", icon: Zap },
    { href: "/recruiter-simulation", label: "10s Eye Screen", icon: Eye },
    { href: "/branding-studio", label: "Branding Studio", icon: Palette },
    { href: "/applications", label: "Job Tracker", icon: Briefcase },
    { href: "/networking", label: "AI Networking", icon: Send },
    { href: "/portfolio", label: "AI Portfolio", icon: Laptop },
    { href: "/portfolio/deploy", label: "Deploy Subdomain", icon: Globe },
    { href: "/github-sync", label: "GitHub Auto Sync", icon: Github },
    { href: "/roadmap", label: "AI Roadmap", icon: Compass },
    { href: "/roast", label: "Resume Roast", icon: Flame },
    { href: "/salary-calculator", label: "Salary Negotiator", icon: DollarSign },
    { href: "/translate", label: "AI Translator", icon: Languages },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  if (profile.email && ADMIN_EMAILS.includes(profile.email)) {
    navItems.push({ href: "/admin", label: "Admin Panel", icon: ShieldAlert });
  }

  const NavContent = () => (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
        <Link href="/" className="text-xl font-bold text-text-primary">
          Vaylo<span className="text-accent">AI</span>
        </Link>
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href === "/analyze" && pathname.startsWith("/analyze")) ||
            (item.href === "/settings" && pathname.startsWith("/settings")) ||
            (item.href === "/builder" && pathname.startsWith("/builder")) ||
            (item.href === "/roadmap" && pathname.startsWith("/roadmap")) ||
            (item.href === "/roast" && pathname.startsWith("/roast")) ||
            (item.href === "/portfolio" && pathname.startsWith("/portfolio"));
          return (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-accent/20 text-accent font-bold border-l-2 border-accent shadow-sm"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-3 shrink-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">Theme</span>
          <ThemeToggle />
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-text-muted">Current plan</span>
          <PlanBadge plan={profile.plan} />
        </div>
        {profile.plan === "free" && (
          <Link href="/pricing">
            <Button className="w-full bg-gradient-to-r from-accent to-accent-hover text-white font-bold shadow-md hover:scale-[1.02] transition-all" size="sm">
              Upgrade plan
            </Button>
          </Link>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-text-muted hover:text-text-primary transition-colors w-full px-3 py-2"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Trigger */}
      <button
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-xl bg-surface/90 backdrop-blur border border-border shadow-md text-text-primary hover:bg-surface-elevated transition-all"
        onClick={() => setMobileOpen(true)}
        aria-label="Open Navigation Menu"
      >
        <Menu size={20} />
      </button>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-surface h-screen sticky top-0 shrink-0">
        <NavContent />
      </aside>

      {/* Mobile Off-Canvas Drawer */}
      {mobileOpen && (
        <aside className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer Body */}
          <div className="relative flex flex-col w-[min(85vw,320px)] bg-surface h-[100dvh] shadow-2xl border-r border-border animate-in slide-in-from-left">
            <NavContent />
          </div>
        </aside>
      )}
    </>
  );
}
