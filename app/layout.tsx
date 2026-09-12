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

const APP_URL = "https://www.vayloai.online";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "AI Resume Builder for India | VayloAI — Beat ATS Filters",
    template: "%s | VayloAI",
  },
  description:
    "Get your free ATS score in 30 seconds. AI-powered resume builder built for Indian job seekers — no credit card required. Try VayloAI free.",
  keywords: [
    "AI resume builder India",
    "free ATS resume checker",
    "resume builder for freshers India",
    "ATS score checker",
    "AI career copilot",
    "resume builder for Indian job seekers",
    "ATS resume checker for Naukri & LinkedIn",
    "VayloAI"
  ],
  authors: [{ name: "VayloAI" }],
  creator: "VayloAI",
  publisher: "VayloAI",
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
    siteName: "VayloAI",
    title: "AI Resume Builder for India | VayloAI — Beat ATS Filters",
    description: "Get your free ATS score in 30 seconds. AI-powered resume builder built for Indian job seekers — no credit card required. Try VayloAI free.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Resume Builder for India | VayloAI — Beat ATS Filters",
    description: "Get your free ATS score in 30 seconds. AI-powered resume builder built for Indian job seekers — no credit card required. Try VayloAI free.",
    creator: "@vayloai",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/favicon-16x16.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
        "@type": "Person",
        "@id": `${APP_URL}/#founder`,
        name: "Diwanshu",
        url: `${APP_URL}/about`,
        sameAs: [
          "https://linkedin.com/in/diwanshu",
          "https://github.com/diwanshu200419-commits"
        ],
        jobTitle: "Founder",
        worksFor: { "@id": `${APP_URL}/#organization` }
      },
      {
        "@type": "Organization",
        "@id": `${APP_URL}/#organization`,
        name: "VayloAI",
        url: APP_URL,
        logo: `${APP_URL}/icon.png`,
        description: "AI-powered resume builder, ATS checker, and career copilot for Indian job seekers.",
        founder: { "@id": `${APP_URL}/#founder` },
        sameAs: [
          "https://github.com/diwanshu200419-commits/resume-builder"
        ]
      },
      {
        "@type": "WebSite",
        "@id": `${APP_URL}/#website`,
        url: APP_URL,
        name: "VayloAI",
        description: "AI Resume Builder, ATS Checker & Career Copilot for Indian job seekers",
        publisher: { "@id": `${APP_URL}/#organization` }
      },
      {
        "@type": "SoftwareApplication",
        name: "VayloAI",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        offers: [
          { "@type": "Offer", name: "Free", price: "0", priceCurrency: "INR" },
          { "@type": "Offer", name: "Pro", price: "99", priceCurrency: "INR" },
          { "@type": "Offer", name: "Premium", price: "299", priceCurrency: "INR" },
          { "@type": "Offer", name: "Career Pack", price: "499", priceCurrency: "INR" }
        ]
      }
    ]
  };

  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="googlea1966f76a89819c1" />
        <meta name="google-site-verification" content="0w0LWASRueXYjlydirI9OkfyFuaSVfHtymdPVEY5ad0" />
        {/* TODO: Replace empty string below with your real msvalidate.01 code from https://www.bing.com/webmasters */}
        {/* Steps: Sign in → Add Site → Verify via HTML Meta Tag → copy the content value */}
        {/* Leave empty until you have the real code — an invalid code is worse than none */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-ENLDX3KQQ7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            // Prevent analytics pollution from automated tests (Playwright/Puppeteer/Selenium), localhost, and test runners
            var isAutomatedTest = !!(navigator.webdriver || window.__playwright || window._phantom || window.callPhantom);
            var isLocalOrPreview = window.location.hostname === 'localhost' || 
                                   window.location.hostname === '127.0.0.1' || 
                                   window.location.hostname.endsWith('.vercel.app');
            
            if (isAutomatedTest || isLocalOrPreview) {
              // Opt-out / disable GA4 measurement for synthetic and local traffic
              window['ga-disable-G-ENLDX3KQQ7'] = true;
            }

            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            if (isAutomatedTest || isLocalOrPreview) {
              gtag('config', 'G-ENLDX3KQQ7', {
                traffic_type: 'internal',
                debug_mode: true,
                send_page_view: false
              });
            } else {
              gtag('config', 'G-ENLDX3KQQ7');
            }
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
      </body>
    </html>
  );
}
