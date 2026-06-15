import { type Metadata } from "next";
import { PricingClient } from "@/components/marketing/PricingClient";

export const metadata: Metadata = {
  title: "Pricing | Vaylo AI",
  description:
    "Vaylo AI pricing plans. Free plan with 2 resume analyses. Pro plan for unlimited AI, downloads, and cover letters. Premium plan for full career growth platform.",
  keywords:
    "Vaylo AI pricing, AI resume builder pricing, ATS checker pricing, career AI cost",
  openGraph: {
    title: "Pricing | Vaylo AI",
    description:
      "Vaylo AI pricing plans. Free plan with 2 resume analyses. Pro plan for unlimited AI, downloads, and cover letters. Premium plan for full career growth platform.",
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
