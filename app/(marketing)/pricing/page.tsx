import { type Metadata } from "next";
import { PricingClient } from "@/components/marketing/PricingClient";

const APP_URL = "https://vayloai.online";

export const metadata: Metadata = {
  title: "Pricing Plans & Subscriptions | Vaylo AI",
  description:
    "Transparent pricing for Vaylo AI. Free Tier (₹0), Pro Plan (₹99/mo), Premium Plan (₹299/mo), and Career Pack (₹499 one-time lifetime). 100% money-back guarantee.",
  keywords: [
    "Vaylo AI pricing",
    "AI resume builder pricing",
    "ATS checker plans",
    "cheap AI career copilot",
    "career pack lifetime deal"
  ],
  alternates: {
    canonical: `${APP_URL}/pricing`,
  },
  openGraph: {
    title: "Pricing Plans & Subscriptions | Vaylo AI",
    description:
      "Simple, transparent pricing. Free (₹0), Pro (₹99/mo), Premium (₹299/mo), or Career Pack (₹499 lifetime). Start building your career today.",
    url: `${APP_URL}/pricing`,
    siteName: "Vaylo AI",
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Vaylo AI Pricing Plans",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing Plans | Vaylo AI",
    description: "Free (₹0), Pro (₹99/mo), Premium (₹299/mo), or Career Pack (₹499 lifetime).",
    images: [`${APP_URL}/og-image.png`],
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
            "name": "What is included in the Vaylo AI Free plan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Free plan includes 2 full ATS resume scans per month, access to the interactive resume builder, and PDF exports."
            }
          },
          {
            "@type": "Question",
            "name": "How much does Vaylo AI Pro cost?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Vaylo AI Pro costs ₹99/month and includes 50 scans/day, 1-Click Auto-Fix bullet rewriter, AI cover letters, and unwatermarked PDF/DOCX exports."
            }
          },
          {
            "@type": "Question",
            "name": "What is the Career Pack lifetime plan?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "The Career Pack is a ₹499 one-time payment for lifetime access to all Premium features, custom portfolio domain CNAME setup, STAR voice interview practice, and priority AI compute."
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

