// app/p/[subdomain]/page.tsx
//
// Vaylo AI — Instant Public Portfolio Renderer
// Serves live generated HTML portfolio pages for any candidate handle (e.g. /p/shiv)

import { generatePortfolioHTML, autoSuggestTemplate, PortfolioData } from "@/lib/portfolio-templates";

export const dynamic = "force-dynamic";

export default async function PublicPortfolioPage({ params }: { params: { subdomain: string } }) {
  const handle = params.subdomain || "candidate";

  const defaultData: PortfolioData = {
    name: handle.charAt(0).toUpperCase() + handle.slice(1) + " (Vaylo AI Portfolio)",
    title: "Senior Technology Leader & Software Specialist",
    bio: "Passionate engineer and leader with expertise in building high-performance web applications, scalable database systems, and AI copilot solutions.",
    skills: ["System Architecture", "TypeScript", "React / Next.js", "PostgreSQL", "Cloud Infrastructure", "API Design", "AI Integration"],
    projects: [
      {
        title: "High-Throughput SaaS Platform",
        description: "Architected microservices infrastructure handling 500k+ monthly active requests with sub-50ms latency.",
        tech: "Next.js • PostgreSQL • Redis",
      },
      {
        title: "Enterprise AI Career OS",
        description: "Engineered multi-dimensional ATS evaluation and STAR voice interview simulation engines.",
        tech: "TypeScript • Gemini AI • Supabase",
      },
    ],
    experience: [
      {
        role: "Senior Engineering Manager",
        company: "Global Tech Solutions",
        period: "2021 — Present",
        summary: "Led engineering teams, optimized core product performance, and delivered high-reliability applications.",
      },
    ],
  };

  const template = autoSuggestTemplate(defaultData.bio);
  const htmlContent = generatePortfolioHTML(defaultData, template);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
      style={{ width: "100%", height: "100vh", margin: 0, padding: 0 }}
    />
  );
}
