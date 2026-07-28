"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/shared/ThemeToggle";

export function Navbar() {
  const [open, setOpen] = useState(false);

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
            <Link href="/#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              How it works
            </Link>
            <Link href="/#pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Pricing
            </Link>
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="bg-accent hover:bg-accent-hover text-white font-bold">Try free</Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button className="p-1.5 text-text-primary rounded-lg hover:bg-surface-elevated" onClick={() => setOpen(!open)} aria-label="Toggle menu">
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
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1" onClick={() => setOpen(false)}>
                <Button variant="outline" className="w-full text-xs" size="sm">Log in</Button>
              </Link>
              <Link href="/signup" className="flex-1" onClick={() => setOpen(false)}>
                <Button className="w-full text-xs bg-accent text-white font-bold" size="sm">Try free</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
