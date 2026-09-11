import { type Metadata } from "next";
import { PricingClient } from "@/components/marketing/PricingClient";

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  title: "VayloAI Pricing — Free ₹0, Pro ₹99, Premium ₹299",
  description:
    "Simple, transparent pricing for Indian job seekers. Free (₹0), Pro (₹99/mo), Premium (₹299/mo), or Career Pack (₹499 lifetime). Try VayloAI free.",
  keywords: [
    "VayloAI pricing",
    "resume builder price India",
    "AI resume builder cost",
    "pro resume subscription",
    "career pack lifetime deal"
  ],
  alternates: {
    canonical: `${APP_URL}/pricing`,
  },
  openGraph: {
    title: "VayloAI Pricing — Free ₹0, Pro ₹99, Premium ₹299",
    description:
      "Simple, transparent pricing for Indian job seekers. Free (₹0), Pro (₹99/mo), Premium (₹299/mo), or Career Pack (₹499 lifetime). Try VayloAI free.",
    url: `${APP_URL}/pricing`,
    siteName: "VayloAI",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VayloAI Pricing — Free ₹0, Pro ₹99, Premium ₹299",
    description: "Simple, transparent pricing for Indian job seekers. Free (₹0), Pro (₹99/mo), Premium (₹299/mo), or Career Pack (₹499 lifetime). Try VayloAI free.",
    creator: "@vayloai",
  },
};

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is included in the VayloAI Free plan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Free plan includes 2 ATS resume scans (total), access to the interactive resume builder, and PDF exports with a watermark. No credit card required."
            }
          },
          {
            "@type": "Question",
            "name": "How much does VayloAI Pro cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "VayloAI Pro costs ₹99/month and includes 30 ATS scans per month, 1-Click Auto-Fix bullet rewriter, AI cover letters, LinkedIn optimizer, and unwatermarked PDF/DOCX exports."
            }
          },
          {
            "@type": "Question",
            "name": "What is the Career Pack lifetime plan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Career Pack is a ₹499 one-time payment for lifetime access to all Premium features, AI Portfolio Website Builder (6 Pro Themes, Code Export & Free Host Hub), STAR voice interview practice, and priority AI compute."
            }
          }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PricingClient />
    </>
  );
}

