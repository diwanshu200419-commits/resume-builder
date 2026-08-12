import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { FloatingAICopilot } from "@/components/shared/FloatingAICopilot";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

const APP_URL = "https://resume-builder-murex-mu.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Vaylo AI — World's Best AI Career Operating System & ATS Copilot",
    template: "%s | Vaylo AI",
  },
  description:
    "Transform your career with Vaylo AI. Beat ATS filters with 90%+ score optimizer, practice STAR voice interviews, benchmark tech salaries, and deploy single-page HTML portfolio websites to username.vaylo.ai in 1-click.",
  keywords: [
    "Vaylo AI",
    "AI Career Operating System",
    "ATS Resume Scanner",
    "ATS Resume Optimizer",
    "AI Resume Builder",
    "AI Portfolio Generator",
    "One-Click Portfolio Deployment",
    "STAR Interview Coach",
    "AI Recruiter Simulation",
    "Hiring Probability Predictor",
    "Tech Salary Negotiator",
    "LinkedIn Branding Studio",
    "GitHub Portfolio Sync",
    "Career Copilot"
  ],
  authors: [{ name: "Vaylo AI Technologies Inc.", url: APP_URL }],
  creator: "Vaylo AI Team",
  publisher: "Vaylo AI Technologies Inc.",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    title: "Vaylo AI — World's Best AI Career Operating System",
    description:
      "Beat ATS filters with 90%+ score optimizer, practice STAR voice interviews, benchmark tech salaries, and deploy portfolio websites in 1-click.",
    url: APP_URL,
    siteName: "Vaylo AI",
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Vaylo AI Career Operating System Dashboard Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaylo AI — World's Best AI Career Operating System",
    description:
      "Beat ATS filters, practice STAR voice interviews, benchmark salaries, and launch portfolio websites with Vaylo AI.",
    images: [`${APP_URL}/og-image.png`],
    creator: "@vaylo_ai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "0w0LWASRueXYjlydirI9OkfyFuaSVfHtymdPVEY5ad0",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${APP_URL}/#organization`,
        name: "Vaylo AI",
        url: APP_URL,
        logo: `${APP_URL}/logo.png`,
        sameAs: [
          "https://twitter.com/vaylo_ai",
          "https://github.com/diwanshu200419-commits/resume-builder",
          "https://linkedin.com/company/vaylo-ai"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${APP_URL}/#website`,
        url: APP_URL,
        name: "Vaylo AI",
        description: "World's Best AI Career Operating System & ATS Copilot",
        publisher: { "@id": `${APP_URL}/#organization` }
      },
      {
        "@type": "SoftwareApplication",
        name: "Vaylo AI Career Operating System",
        operatingSystem: "Web",
        applicationCategory: "BusinessApplication",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "INR"
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "12800"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="0w0LWASRueXYjlydirI9OkfyFuaSVfHtymdPVEY5ad0" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ENLDX3KQQ7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-ENLDX3KQQ7');
          `}
        </Script>
        {children}
        <FloatingAICopilot />
      </body>
    </html>
  );
}
