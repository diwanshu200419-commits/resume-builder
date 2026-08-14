import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { GoogleAnalytics } from "@next/third-parties/google";
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

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Vaylo AI — AI Resume Builder, ATS Scanner & Interview Prep",
    template: "%s | Vaylo AI",
  },
  description:
    "Vaylo AI is your AI career copilot — build ATS-optimized resumes, get instant ATS match scores, practice FAANG-style interviews with voice AI, and simulate how recruiters actually screen your resume. Free to start.",
  keywords: [
    "AI resume builder",
    "ATS resume checker",
    "resume score checker",
    "AI interview prep",
    "FAANG interview practice",
    "resume optimization tool",
    "ATS scanner free",
    "AI career coach",
    "resume builder online free",
    "interview simulator AI",
    "Vaylo AI"
  ],
  authors: [{ name: "Vaylo AI" }],
  creator: "Vaylo AI",
  publisher: "Vaylo AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: "Vaylo AI",
    title: "Vaylo AI — Your AI Career Copilot",
    description: "Optimize your resume, ace ATS scans, and practice real interviews with AI — all in one place.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vaylo AI Dashboard — AI Resume Builder and ATS Scanner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vaylo AI — Your AI Career Copilot",
    description: "Optimize your resume, ace ATS scans, and practice real interviews with AI.",
    images: ["/og-image.png"],
    creator: "@vayloai",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
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
    google: ["googlea1966f76a89819c1", "0w0LWASRueXYjlydirI9OkfyFuaSVfHtymdPVEY5ad0"],
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
          "https://twitter.com/vayloai",
          "https://github.com/diwanshu200419-commits/resume-builder",
          "https://linkedin.com/company/vayloai"
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
        description: "AI-powered resume builder, ATS scanner, and interview preparation platform.",
        offers: [
          { "@type": "Offer", name: "Free", price: "0", priceCurrency: "INR" },
          { "@type": "Offer", name: "Pro", price: "99", priceCurrency: "INR" },
          { "@type": "Offer", name: "Premium", price: "299", priceCurrency: "INR" },
          { "@type": "Offer", name: "Career Pack", price: "499", priceCurrency: "INR" }
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          ratingCount: "1200"
        }
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="googlea1966f76a89819c1" />
        <meta name="google-site-verification" content="0w0LWASRueXYjlydirI9OkfyFuaSVfHtymdPVEY5ad0" />
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <FloatingAICopilot />
        <GoogleAnalytics gaId="G-ENLDX3KQQ7" />
      </body>
    </html>
  );
}
