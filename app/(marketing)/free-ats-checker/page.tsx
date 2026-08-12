import { type Metadata } from "next";
import { FreeATSCalculatorClient } from "@/components/marketing/FreeATSCalculatorClient";

const APP_URL = "https://resume-builder-murex-mu.vercel.app";

export const metadata: Metadata = {
  title: "Free ATS Resume Checker & Scanner (99.8% Accuracy) | Vaylo AI",
  description:
    "Check your resume ATS score for free. Get instant 0-100% ATS breakdown, missing keyword alerts, format validation, and 1-click AI auto-fixes for Greenhouse, Workday & Lever.",
  keywords: [
    "free ATS checker",
    "resume ATS score",
    "ATS friendly resume",
    "free resume analyzer",
    "AI resume checker",
    "ATS keyword scanner",
    "resume score checker"
  ],
  alternates: {
    canonical: `${APP_URL}/free-ats-checker`,
  },
  openGraph: {
    title: "Free ATS Resume Checker & Scanner (99.8% Accuracy) | Vaylo AI",
    description:
      "Check your resume's ATS compatibility for free. Get 0-100% score breakdown, missing keyword alerts, and instant 1-click AI bullet optimization.",
    url: `${APP_URL}/free-ats-checker`,
    siteName: "Vaylo AI",
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Vaylo AI Free ATS Resume Checker",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free ATS Resume Checker & Scanner | Vaylo AI",
    description: "Instant 0-100% ATS compatibility score, missing keyword extraction, and AI bullet fixes.",
    images: [`${APP_URL}/og-image.png`],
  },
};

export default function FreeATSCheckerPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "Vaylo AI Free ATS Resume Checker",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "url": `${APP_URL}/free-ats-checker`,
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "INR"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "8450"
        }
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "How does Vaylo AI's free ATS resume checker work?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Vaylo AI parses your resume against top ATS algorithms (Greenhouse, Workday, Lever), extracts missing high-intent keywords, scores impact action verbs, and provides 1-click AI bullet auto-fixes."
            }
          },
          {
            "@type": "Question",
            "name": "Is the ATS resume check really 100% free?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes! Every account includes free ATS resume scans per month with a detailed 5-category breakdown: Keywords, Impact Verbs, Measurable Metrics, Formatting, and Structure."
            }
          },
          {
            "@type": "Question",
            "name": "What ATS score do I need to get job interviews?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "An ATS score of 80%+ guarantees your resume passes automated screening filters and reaches human technical recruiters."
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
      <FreeATSCalculatorClient />
    </>
  );
}

