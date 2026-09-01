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
    default: "VayloAI — AI Career Copilot for Resume, Jobs & Interviews",
    template: "%s | VayloAI",
  },
  description:
    "Build better resumes, optimize applications, prepare for interviews, and accelerate your job search with VayloAI.",
  keywords: [
    "AI resume builder",
    "ATS resume checker",
    "AI career coach",
    "resume optimizer",
    "interview preparation",
    "AI resume India",
    "resume builder for freshers",
    "ATS scanner free",
    "VayloAI"
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
    siteName: "VayloAI",
    title: "VayloAI — AI Career Copilot for Resume, Jobs & Interviews",
    description: "Build better resumes, optimize applications, prepare for interviews, and accelerate your job search with VayloAI.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "VayloAI Dashboard — AI Resume Builder and ATS Scanner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "VayloAI — AI Career Copilot for Resume, Jobs & Interviews",
    description: "Build better resumes, optimize applications, prepare for interviews, and accelerate your job search with VayloAI.",
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
        name: "VayloAI",
        description: "AI Career Copilot for Resume, Jobs & Interviews",
        publisher: { "@id": `${APP_URL}/#organization` }
      },
      {
        "@type": "SoftwareApplication",
        name: "VayloAI Career Copilot",
        operatingSystem: "Web",
        applicationCategory: "BusinessApplication",
        description: "Build better resumes, optimize applications, prepare for interviews, and accelerate your job search with VayloAI.",
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
