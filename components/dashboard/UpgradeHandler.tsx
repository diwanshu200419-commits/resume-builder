"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { UpgradeModal } from "@/components/shared/UpgradeModal";

export function UpgradeHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [feature, setFeature] = useState("this feature");

  useEffect(() => {
    const upgrade = searchParams.get("upgrade");
    const featureParam = searchParams.get("feature");
    const upgraded = searchParams.get("upgraded");

    if (upgrade === "true") {
      setShowUpgrade(true);
      if (featureParam) {
        setFeature(featureParam.replace("-", " "));
      }
    }

    if (upgraded === "true") {
      // Clean up URL
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete("upgraded");
      router.replace(`/dashboard?${newParams.toString()}`);
    }
  }, [searchParams, router]);

  return (
    <UpgradeModal 
      open={showUpgrade} 
      onOpenChange={setShowUpgrade} 
      feature={feature}
    />
  );
}
