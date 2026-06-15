import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vaylo.ai"), // Update to your Vaylo domain
  title: {
    default: "Vaylo AI — Your AI Career Copilot",
    template: "%s | Vaylo AI",
  },
  description:
    "AI-powered career platform for resumes, interviews, job matching and career growth. Your AI Career Copilot.",
  openGraph: {
    title: "Vaylo AI — Your AI Career Copilot",
    description:
      "AI-powered career platform for resumes, interviews, job matching and career growth. Your AI Career Copilot.",
    url: "https://vaylo.ai",
    siteName: "Vaylo AI",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
