"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
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
    <>
      <div className="p-6 border-b border-border">
        <Link href="/" className="text-xl font-bold text-text-primary">
          Vaylo<span className="text-accent">AI</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
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
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border space-y-3">
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
