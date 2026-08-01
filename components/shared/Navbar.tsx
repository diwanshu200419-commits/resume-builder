"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Menu,
  X,
  User,
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { createClient } from "@/lib/supabase/client";

export function Navbar() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);

  const checkUserSession = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const currentUser = data?.user;

      if (currentUser) {
        setUser(currentUser);
        try {
          const res = await fetch("/api/profile");
          if (res.ok) {
            const pData = await res.json();
            setProfile(pData.profile || { plan: "free" });
          }
        } catch {
          setProfile({ plan: "free" });
        }
      } else {
        const hasMockSession = typeof document !== "undefined" && document.cookie.includes("mock-session-id=");
        if (hasMockSession) {
          setUser({
            email: "candidate@vaylo.ai",
            user_metadata: { full_name: "Demo Candidate" },
          });
          setProfile({ plan: "pro" });
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserSession();

    const handleAuthChange = () => {
      checkUserSession();
    };

    window.addEventListener("focus", handleAuthChange);
    return () => {
      window.removeEventListener("focus", handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}

    if (typeof document !== "undefined") {
      document.cookie = "mock-session-id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }

    setUser(null);
    setProfile(null);
    setUserDropdownOpen(false);
    setLoading(false);
    router.push("/");
    router.refresh();
  };

  const getInitials = () => {
    const name = user?.user_metadata?.full_name || user?.email || "U";
    const parts = name.split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const planName = (profile?.plan || "free").toUpperCase();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-xl font-extrabold text-text-primary">
              Vaylo<span className="text-accent">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link href="/#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors font-medium">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors font-medium">
              How it works
            </Link>
            <Link href="/#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors font-medium">
              Pricing
            </Link>
            <ThemeToggle />

            {loading ? (
              <div className="w-24 h-8 bg-surface-elevated animate-pulse rounded-lg" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl border border-border bg-surface hover:bg-surface-elevated transition-all"
                >
                  {user.user_metadata?.avatar_url || user.user_metadata?.picture ? (
                    <img
                      src={user.user_metadata.avatar_url || user.user_metadata.picture}
                      alt="Profile"
                      className="w-7 h-7 rounded-full object-cover border border-accent/40"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-accent/20 text-accent font-bold text-xs flex items-center justify-center border border-accent/30">
                      {getInitials()}
                    </div>
                  )}

                  <span className="text-xs font-bold text-text-primary max-w-[120px] truncate">
                    {user.user_metadata?.full_name || user.email?.split("@")[0] || "Account"}
                  </span>

                  <Badge className="text-[10px] font-extrabold bg-accent/15 text-accent border-accent/30 px-1.5 py-0">
                    {planName}
                  </Badge>

                  <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-surface shadow-2xl p-2 space-y-1 animate-in fade-in zoom-in-95"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="p-3 rounded-lg bg-surface-elevated/70 border border-border/50 space-y-1">
                      <p className="text-xs font-extrabold text-text-primary truncate">
                        {user.user_metadata?.full_name || "Vaylo Candidate"}
                      </p>
                      <p className="text-[11px] text-text-muted font-mono truncate">{user.email}</p>
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-text-muted">Subscription Plan</span>
                        <Badge className="text-[10px] font-bold bg-accent text-white">{planName}</Badge>
                      </div>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-elevated rounded-lg transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-accent" /> Dashboard
                    </Link>

                    <Link
                      href="/builder"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-elevated rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4 text-indigo-400" /> Resume Builder
                    </Link>

                    <Link
                      href="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-text-primary hover:bg-surface-elevated rounded-lg transition-colors"
                    >
                      <Settings className="w-4 h-4 text-sky-400" /> Account Settings
                    </Link>

                    <div className="pt-1 border-t border-border/50">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="font-semibold text-xs">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-accent hover:bg-accent-hover text-white font-bold text-xs shadow-md">
                    Try free
                  </Button>
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              className="p-1.5 text-text-primary rounded-lg hover:bg-surface-elevated"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden pb-6 pt-2 space-y-3 border-t border-border/50 animate-fade-in">
            <Link href="/#features" className="block text-sm text-text-secondary hover:text-text-primary py-1" onClick={() => setOpen(false)}>
              Features
            </Link>
            <Link href="/#how-it-works" className="block text-sm text-text-secondary hover:text-text-primary py-1" onClick={() => setOpen(false)}>
              How it works
            </Link>
            <Link href="/pricing" className="block text-sm text-text-secondary hover:text-text-primary py-1" onClick={() => setOpen(false)}>
              Pricing
            </Link>

            {user ? (
              <div className="space-y-2 pt-2 border-t border-border/50">
                <div className="p-3 rounded-lg bg-surface-elevated border border-border space-y-1">
                  <p className="text-xs font-bold text-text-primary">{user.user_metadata?.full_name || "Vaylo Candidate"}</p>
                  <p className="text-[11px] text-text-muted">{user.email}</p>
                </div>
                <Link href="/dashboard" className="block text-xs font-semibold py-1.5 text-accent" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                <Link href="/builder" className="block text-xs font-semibold py-1.5 text-text-primary" onClick={() => setOpen(false)}>
                  Resume Builder
                </Link>
                <button onClick={handleLogout} className="w-full text-left text-xs font-bold py-1.5 text-rose-500">
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link href="/login" className="flex-1" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full text-xs font-semibold" size="sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" className="flex-1" onClick={() => setOpen(false)}>
                  <Button className="w-full text-xs bg-accent text-white font-bold" size="sm">
                    Try free
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
