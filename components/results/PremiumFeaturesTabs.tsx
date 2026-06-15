"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { UpgradeModal } from "@/components/shared/UpgradeModal";
import { Lock, Mail, MessageSquare, Linkedin } from "lucide-react";
import type { Profile } from "@/types";

interface PremiumFeaturesTabsProps {
  analysisId: string;
  profile: Profile;
  hasCoverLetter: boolean;
  hasPremium: boolean;
  coverLetter: string | null;
}

export function PremiumFeaturesTabs({
  analysisId,
  hasCoverLetter,
  hasPremium,
  coverLetter,
}: PremiumFeaturesTabsProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [requiredPlan, setRequiredPlan] = useState<"pro" | "premium">("pro");

  const handleLocked = (plan: "pro" | "premium") => {
    setRequiredPlan(plan);
    setShowUpgrade(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Premium features</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="cover-letter">
            <TabsList className="mb-4 flex-wrap h-auto gap-1">
              <TabsTrigger value="cover-letter" className="gap-1">
                <Mail className="w-3 h-3" />
                Cover Letter
              </TabsTrigger>
              <TabsTrigger value="interview" className="gap-1">
                <MessageSquare className="w-3 h-3" />
                Interview Prep
              </TabsTrigger>
              <TabsTrigger value="linkedin" className="gap-1">
                <Linkedin className="w-3 h-3" />
                LinkedIn
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cover-letter">
              {hasCoverLetter ? (
                <div className="space-y-4">
                  {coverLetter ? (
                    <p className="text-sm text-text-secondary whitespace-pre-wrap">{coverLetter}</p>
                  ) : (
                    <p className="text-text-muted text-sm">Cover letter not generated yet.</p>
                  )}
                  <Link href={`/cover-letter/${analysisId}`}>
                    <Button variant="outline" size="sm">Open cover letter editor</Button>
                  </Link>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Lock className="w-8 h-8 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm mb-4">Cover letter generator requires Pro plan</p>
                  <Button size="sm" onClick={() => handleLocked("pro")}>Upgrade to Pro</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="interview">
              {hasPremium ? (
                <Link href={`/interview-prep/${analysisId}`}>
                  <Button variant="outline" size="sm">Open interview prep</Button>
                </Link>
              ) : (
                <div className="text-center py-8">
                  <Lock className="w-8 h-8 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm mb-4">Interview prep requires Premium plan</p>
                  <Button size="sm" onClick={() => handleLocked("premium")}>Upgrade to Premium</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="linkedin">
              {hasPremium ? (
                <Link href={`/linkedin/${analysisId}`}>
                  <Button variant="outline" size="sm">Open LinkedIn optimizer</Button>
                </Link>
              ) : (
                <div className="text-center py-8">
                  <Lock className="w-8 h-8 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm mb-4">LinkedIn optimizer requires Premium plan</p>
                  <Button size="sm" onClick={() => handleLocked("premium")}>Upgrade to Premium</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <UpgradeModal
        open={showUpgrade}
        onOpenChange={setShowUpgrade}
        requiredPlan={requiredPlan}
      />
    </>
  );
}
