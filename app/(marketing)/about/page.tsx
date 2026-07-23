import { Badge } from "@/components/ui/badge";
import { Sparkles, Target, Compass, Heart } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-6 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <Badge variant="default" className="gap-1.5 px-3 py-1 text-xs">
          <Sparkles className="w-3.5 h-3.5" /> Our Mission
        </Badge>
        <h1 className="text-4xl font-extrabold text-text-primary tracking-tight">
          Democratizing Career Growth through AI
        </h1>
        <p className="text-text-secondary text-sm">
          Vaylo AI was founded with a simple vision: to empower candidates everywhere with automated, high-quality recruiter intelligence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-3 bg-surface border border-border p-6 rounded-xl">
          <div className="p-3 bg-accent/10 rounded-xl w-fit text-accent">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">Our Vision</h3>
          <p className="text-text-secondary text-xs leading-relaxed">
            We aim to rebuild the bridge between job seekers and companies, turning resume scanning into an opportunity for candidates to showcase their actual skills and potential.
          </p>
        </div>

        <div className="space-y-3 bg-surface border border-border p-6 rounded-xl">
          <div className="p-3 bg-success/10 rounded-xl w-fit text-success">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-text-primary">Our Story</h3>
          <p className="text-text-secondary text-xs leading-relaxed">
            What started as a simple resume checker has evolved into a complete AI Career Copilot. We help users optimize profiles, plan career roadmaps, generate portfolios, and practice mock interviews.
          </p>
        </div>
      </div>
    </div>
  );
}
