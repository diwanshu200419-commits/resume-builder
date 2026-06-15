"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-xl font-bold text-text-primary">
              Vaylo<span className="text-accent">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/#features" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Features
            </Link>
            <Link href="/#how-it-works" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              How it works
            </Link>
            <Link href="/pricing" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Pricing
            </Link>
            <Link href="/login">
              <Button variant="ghost" size="sm">Log in</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Try free</Button>
            </Link>
          </div>

          <button className="md:hidden text-text-primary" onClick={() => setOpen(!open)}>
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="/#features" className="block text-text-secondary hover:text-text-primary" onClick={() => setOpen(false)}>
              Features
            </Link>
            <Link href="/#how-it-works" className="block text-text-secondary hover:text-text-primary" onClick={() => setOpen(false)}>
              How it works
            </Link>
            <Link href="/pricing" className="block text-text-secondary hover:text-text-primary" onClick={() => setOpen(false)}>
              Pricing
            </Link>
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1">
                <Button variant="outline" className="w-full" size="sm">Log in</Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button className="w-full" size="sm">Try free</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
