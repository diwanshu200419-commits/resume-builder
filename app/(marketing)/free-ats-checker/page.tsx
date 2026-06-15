import { type Metadata } from "next";
import { FreeATSCalculatorClient } from "@/components/marketing/FreeATSCalculatorClient";

export const metadata: Metadata = {
  title: "Free ATS Resume Checker | Vaylo AI",
  description:
    "Free online ATS resume checker. Check your resume's ATS score, find missing keywords, and improve your job application instantly with AI.",
  keywords:
    "free ATS checker, resume ATS score, ATS friendly resume, free resume analyzer, AI resume checker",
  openGraph: {
    title: "Free ATS Resume Checker | Vaylo AI",
    description:
      "Free online ATS resume checker. Check your resume's ATS score, find missing keywords, and improve your job application instantly with AI.",
  },
};

export default function FreeATSCheckerPage() {
  return <FreeATSCalculatorClient />;
}
