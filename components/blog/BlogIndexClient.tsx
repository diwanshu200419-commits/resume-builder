"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BlogPost } from "@/lib/blog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Tag,
  User,
  Sparkles,
  ShieldCheck,
  Search,
  Code2,
  Cpu,
  Layers,
  HelpCircle,
  TrendingUp,
  MessageSquare,
} from "lucide-react";

interface BlogIndexClientProps {
  posts: BlogPost[];
}

export function BlogIndexClient({ posts }: BlogIndexClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { id: "all", label: "All Guides & Questions", icon: BookOpen },
    { id: "interviews", label: "Real Interview Questions & STAR", icon: MessageSquare },
    { id: "system-design", label: "System Design & Architecture", icon: Cpu },
    { id: "coding", label: "Coding & DSA Patterns", icon: Code2 },
    { id: "ats", label: "ATS & Resume Scoring", icon: Layers },
    { id: "salary", label: "Salary & Career Growth", icon: TrendingUp },
  ];

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "all" ||
        post.category === selectedCategory ||
        (selectedCategory === "interviews" && (post.tag.toLowerCase().includes("interview") || post.tag.toLowerCase().includes("star"))) ||
        (selectedCategory === "ats" && post.tag.toLowerCase().includes("ats"));

      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.keywords.some((k) => k.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = posts[0];

  return (
    <div className="space-y-12">
      {/* Header Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="default" className="gap-1.5 px-3.5 py-1.5 text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Vaylo AI Career & Technical Interview Hub
        </Badge>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight leading-tight">
          Real Technical Interview Questions & <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 bg-clip-text text-transparent">Career Blueprints</span>
        </h1>
        <p className="text-text-secondary text-base leading-relaxed">
          Master real-world FAANG system design questions, Google STAR behavioral answers, advanced React/Node internals, and ATS optimization formulas.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="relative max-w-md mx-auto">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
          <Input
            placeholder="Search questions by keyword (e.g. System Design, STAR, React, SQL)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-surface border-border text-xs rounded-xl h-11 focus:ring-indigo-500"
          />
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-surface border border-border text-text-secondary hover:text-text-primary hover:bg-surface-elevated"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Guide Card */}
      {!searchQuery && selectedCategory === "all" && featuredPost && (
        <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-slate-900/90 to-indigo-950/40 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="flex items-center gap-3">
              <Badge className="bg-indigo-600 text-white font-bold text-xs px-3 py-1">Featured Masterclass</Badge>
              <span className="text-xs text-indigo-300 font-medium flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> {featuredPost.readTime}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              <Link href={`/blog/${featuredPost.slug}`} className="hover:text-indigo-400 transition-colors">
                {featuredPost.title}
              </Link>
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {featuredPost.description}
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>{featuredPost.author}</span>
                <span>•</span>
                <span>{featuredPost.date}</span>
              </div>
              <Link href={`/blog/${featuredPost.slug}`}>
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-2 rounded-xl shadow-lg">
                  Read Full Masterclass <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Filtered Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.slug} className="border-border bg-surface hover:border-indigo-500/40 transition-all flex flex-col justify-between shadow-sm hover:shadow-md">
            <CardHeader className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-muted flex items-center gap-1 font-medium">
                  <Clock className="w-3 h-3 text-indigo-400" /> {post.readTime}
                </span>
                <Badge variant="outline" className="text-[10px] uppercase font-bold flex items-center gap-1 border-indigo-500/20 text-indigo-400">
                  <Tag className="w-2.5 h-2.5" /> {post.tag}
                </Badge>
              </div>
              <CardTitle className="text-base sm:text-lg font-bold text-text-primary leading-snug hover:text-indigo-400 transition-colors">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </CardTitle>
              <CardDescription className="text-xs text-text-secondary line-clamp-3 leading-relaxed">
                {post.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-6 flex items-center justify-between text-xs text-text-muted border-t border-border/50 mt-4">
              <span>{post.date}</span>
              <Link href={`/blog/${post.slug}`}>
                <Button size="sm" variant="ghost" className="gap-1 text-indigo-400 hover:text-indigo-300 font-semibold text-xs">
                  Read Guide <ArrowRight className="w-3 h-3" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16 space-y-3 border border-dashed border-border rounded-2xl bg-surface/30">
          <p className="text-base font-semibold text-text-primary">No articles found matching &quot;{searchQuery}&quot;</p>
          <p className="text-xs text-text-secondary">Try searching for &quot;System Design&quot;, &quot;STAR&quot;, &quot;ATS&quot;, or &quot;SQL&quot;.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }} className="text-xs mt-2">
            Clear Filters
          </Button>
        </div>
      )}

      {/* Dual High-Converting Action Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Test Your Resume ATS Score</h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Get an instant 0–100% score breakdown against Greenhouse & Workday screening filters in under 10 seconds.
          </p>
          <Button asChild className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs">
            <Link href="/free-ats-resume-checker">
              Start Free ATS Resume Check <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-4 shadow-xl">
          <div className="w-10 h-10 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-white">Practice Live AI Voice Interviews</h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            Speak into your microphone and receive instant AI evaluation on your STAR answers, filler words, and technical depth.
          </p>
          <Button asChild className="bg-accent hover:bg-accent-hover text-white font-bold text-xs">
            <Link href="/interview-prep">
              Launch Voice Interview Studio <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
