"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { PlanBadge } from "@/components/shared/PlanBadge";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import type { Profile } from "@/types";
import {
  LayoutDashboard,
  FilePen,
  FileSearch,
  FileText,
  Palette,
  GraduationCap,
  Eye,
  Zap,
  Compass,
  DollarSign,
  Users,
  Languages,
  Flame,
  Laptop,
  Globe,
  Briefcase,
  Bell,
  UserCircle2,
  CreditCard,
  Settings,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  BarChart3,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<any>;
  activePrefixes?: string[];
}

interface NavSection {
  heading: string;
  items: NavItem[];
}

export function Sidebar({ profile }: { profile: Profile }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (mobileOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    }
  }, [mobileOpen]);

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
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    router.replace("/login");
    router.refresh();
  };

  const navSections: NavSection[] = [
    {
      heading: "OVERVIEW",
      items: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          activePrefixes: ["/dashboard"],
        },
      ],
    },
    {
      heading: "RESUME",
      items: [
        {
          href: "/builder",
          label: "Resume Builder",
          icon: FilePen,
          activePrefixes: ["/builder"],
        },
        {
          href: "/analyze",
          label: "ATS Scanner",
          icon: FileSearch,
          activePrefixes: ["/analyze", "/results"],
        },
        {
          href: "/dashboard",
          label: "My Analyses",
          icon: BarChart3,
          activePrefixes: [],
        },
        {
          href: "/cover-letter/new",
          label: "Cover Letters",
          icon: FileText,
          activePrefixes: ["/cover-letter"],
        },
      ],
    },
    {
      heading: "CAREER AI",
      items: [
        {
          href: "/branding-studio",
          label: "LinkedIn Optimizer",
          icon: Palette,
          activePrefixes: ["/branding-studio", "/linkedin"],
        },
        {
          href: "/interview-prep",
          label: "Interview Prep",
          icon: GraduationCap,
          activePrefixes: ["/interview-prep"],
        },
        {
          href: "/recruiter-simulation",
          label: "Recruiter Simulation",
          icon: Eye,
          activePrefixes: ["/recruiter-simulation"],
        },
        {
          href: "/hiring-probability",
          label: "Hiring Readiness",
          icon: Zap,
          activePrefixes: ["/hiring-probability"],
        },
        {
          href: "/roadmap",
          label: "Career Roadmap",
          icon: Compass,
          activePrefixes: ["/roadmap"],
        },
      ],
    },
    {
      heading: "TOOLS",
      items: [
        {
          href: "/salary-calculator",
          label: "Salary Insights",
          icon: DollarSign,
          activePrefixes: ["/salary-calculator"],
        },
        {
          href: "/networking",
          label: "Networking",
          icon: Users,
          activePrefixes: ["/networking"],
        },
        {
          href: "/translate",
          label: "Resume Translator",
          icon: Languages,
          activePrefixes: ["/translate"],
        },
        {
          href: "/roast",
          label: "Resume Roast",
          icon: Flame,
          activePrefixes: ["/roast"],
        },
      ],
    },
    {
      heading: "PORTFOLIO",
      items: [
        {
          href: "/portfolio",
          label: "Portfolio Builder",
          icon: Laptop,
          activePrefixes: ["/portfolio"],
        },
        {
          href: "/portfolio",
          label: "My Portfolio",
          icon: Globe,
          activePrefixes: ["/p/"],
        },
      ],
    },
    {
      heading: "ACTIVITY",
      items: [
        {
          href: "/applications",
          label: "Applications",
          icon: Briefcase,
          activePrefixes: ["/applications"],
        },
        {
          href: "/notifications",
          label: "Notifications",
          icon: Bell,
          activePrefixes: ["/notifications"],
        },
      ],
    },
    {
      heading: "ACCOUNT",
      items: [
        {
          href: "/profile",
          label: "Profile",
          icon: UserCircle2,
          activePrefixes: ["/profile"],
        },
        {
          href: "/account/usage",
          label: "Plan & Usage",
          icon: CreditCard,
          activePrefixes: ["/account"],
        },
        {
          href: "/settings",
          label: "Settings",
          icon: Settings,
          activePrefixes: ["/settings"],
        },
      ],
    },
  ];

  if (profile.role === "admin") {
    navSections.push({
      heading: "ADMIN",
      items: [
        {
          href: "/admin",
          label: "Admin Console",
          icon: ShieldAlert,
          activePrefixes: ["/admin"],
        },
      ],
    });
  }

  const isItemActive = (item: NavItem) => {
    if (pathname === item.href) return true;
    if (item.activePrefixes) {
      return item.activePrefixes.some((prefix) => pathname.startsWith(prefix));
    }
    return false;
  };

  const NavContent = () => (
    <div className="flex flex-col h-full overflow-y-auto scrollbar-thin-sidebar">
      <div className="p-5 border-b border-border flex items-center justify-between shrink-0">
        <Link href="/" className="text-xl font-bold text-text-primary">
          Vaylo<span className="text-accent">AI</span>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-elevated"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 p-3 pb-5 overflow-y-auto scrollbar-thin-sidebar">
        {navSections.map((section, sectionIndex) => (
          <div
            key={section.heading}
            className={cn(sectionIndex > 0 && "mt-6")}
          >
            <div className="px-3 mb-2 text-xs font-bold text-slate-500 tracking-wider uppercase">
              {section.heading}
            </div>
            <div className="space-y-1">
              {section.items.map((item) => {
                const isActive = isItemActive(item);
                return (
                  <Link
                    key={section.heading + "-" + item.label}
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
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-border space-y-3 shrink-0 pb-safe">
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
      <button
        className="lg:hidden fixed top-4 left-4 z-40 p-2 rounded-xl bg-surface/90 backdrop-blur border border-border shadow-md text-text-primary hover:bg-surface-elevated transition-all"
        onClick={() => setMobileOpen(true)}
        aria-label="Open Navigation Menu"
      >
        <Menu size={20} />
      </button>

      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-surface h-dvh sticky top-0 shrink-0">
        <NavContent />
      </aside>

      {mobileOpen && (
        <aside className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative flex flex-col w-[min(85vw,320px)] bg-surface h-dvh shadow-2xl border-r border-border animate-in slide-in-from-left">
            <NavContent />
          </div>
        </aside>
      )}
    </>
  );
}

