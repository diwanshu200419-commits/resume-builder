"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Bot, Code, Cpu, Database, Layout, Smartphone, Target, ShieldCheck } from "lucide-react";

const ROLE_PRESETS: Record<string, { title: string; icon: any; jd: string }> = {
  ai_engineer: {
    title: "AI / ML Engineer",
    icon: Cpu,
    jd: `Senior AI / Machine Learning Engineer

We are seeking a Senior AI/ML Engineer to architect, build, and deploy state-of-the-art Large Language Models (LLMs), neural networks, and generative AI features into our enterprise SaaS platform.

Key Responsibilities:
- Design, fine-tune, and evaluate LLM pipelines using OpenAI GPT-4, Google Gemini 2.0, Claude, and open-source models (Llama 3, Mistral).
- Implement RAG (Retrieval-Augmented Generation) pipelines using vector databases (Pinecone, Qdrant, pgvector, Weaviate).
- Optimize inference latency, token context usage, and streaming API responses for high-throughput production workloads.
- Collaborate with full-stack software engineers to integrate AI APIs into React/Next.js and Python backend services.
- Establish robust AI evaluation frameworks, guardrails against hallucinations, and automated prompt engineering benchmarking.

Requirements:
- 3+ years of experience building and deploying machine learning models or LLM applications in production.
- Strong proficiency in Python, PyTorch/TensorFlow, LangChain/LlamaIndex, and REST/gRPC microservices.
- Experience with vector search indexing, embeddings, prompt optimization, and semantic search.
- Knowledge of MLOps pipelines, Docker, Kubernetes, and Cloud ML platforms (AWS SageMaker, GCP Vertex AI, Azure ML).
- Bachelor's or Master's degree in Computer Science, Artificial Intelligence, Data Science, or related STEM field.`,
  },
  fullstack: {
    title: "Full Stack Software Engineer",
    icon: Code,
    jd: `Senior Full Stack Software Engineer

We are looking for a Senior Full Stack Engineer to build high-performance web applications and cloud infrastructure.

Key Responsibilities:
- Architect and develop scalable web applications using Next.js 14, React 18, TypeScript, and Node.js.
- Design resilient database schemas and query optimizations in PostgreSQL, Supabase, or MongoDB.
- Build RESTful and GraphQL APIs with serverless Edge functions, authentication middleware, and caching layers.
- Maintain high code quality with automated unit testing (Jest, Cypress, Vitest) and continuous integration (GitHub Actions).

Requirements:
- 3+ years of hands-on software development experience across frontend and backend stacks.
- Deep expertise in modern JavaScript/TypeScript, React state management, and Node.js microservices.
- Solid understanding of Web Vitals, SSR/SSG rendering patterns, and security best practices (CORS, CSP, OAuth 2.0).
- Bachelor's degree in Computer Science or equivalent practical engineering experience.`,
  },
  frontend: {
    title: "Frontend Engineer (React / Next.js)",
    icon: Layout,
    jd: `Senior Frontend Engineer (React / Next.js)

We are hiring a Senior Frontend Engineer dedicated to crafting user experiences, design systems, and responsive web applications.

Key Responsibilities:
- Build modular, accessible (WCAG 2.2 AA compliant) UI components using React, Next.js App Router, Tailwind CSS, and Framer Motion.
- Optimize web performance, core web vitals (LCP, CLS, FID), bundle sizes, and image optimization pipelines.
- Integrate complex frontend state architectures using Zustand, Redux Toolkit, or React Query.
- Work closely with UI/UX product designers to translate Figma mockups into pixel-perfect interactive applications.

Requirements:
- 3+ years of experience specializing in modern JavaScript/TypeScript frontend frameworks.
- Mastery of CSS flexbox/grid, responsive layouts, dark mode themes, and CSS animations.
- Familiarity with web accessibility, browser compatibility, cross-device testing, and Lighthouse auditing.`,
  },
  devops: {
    title: "DevOps & Cloud Infrastructure Architect",
    icon: ShieldCheck,
    jd: `Senior DevOps & Cloud Infrastructure Architect

We are looking for a Cloud & DevOps Architect to manage continuous deployment, Kubernetes clusters, and cloud infrastructure.

Key Responsibilities:
- Design and operate multi-cloud infrastructure across AWS (EKS, Lambda, S3, RDS) and Vercel/Cloudflare Edge networks.
- Build automated Infrastructure-as-Code (IaC) using Terraform, Pulumi, or Ansible.
- Implement CI/CD pipelines for automated testing, zero-downtime deployments, and canary rollouts.
- Monitor system reliability, uptime SLA metrics, and log aggregation using Datadog, Prometheus, Grafana, and Sentry.

Requirements:
- 4+ years in DevOps, Site Reliability Engineering (SRE), or Cloud Operations.
- Deep knowledge of Docker containerization, Kubernetes orchestration, and Linux server administration.
- Strong scripting skills in Python, Bash, or Go.`,
  },
  data_scientist: {
    title: "Data Scientist / Data Engineer",
    icon: Database,
    jd: `Senior Data Scientist / Data Engineer

We are seeking a Data Scientist to build predictive analytics, data pipelines, and business intelligence models.

Key Responsibilities:
- Construct ETL/ELT pipelines to ingest, transform, and store structured and unstructured data in Snowflake or BigQuery.
- Perform exploratory data analysis (EDA), statistical modeling, and hypothesis testing to derive actionable business insights.
- Build predictive Machine Learning models (XGBoost, Scikit-learn, Regression, Classification) and deploy model endpoints.
- Create automated BI dashboards using Tableau, PowerBI, or Superset.

Requirements:
- 3+ years of experience in Data Science, Quantitative Analysis, or Data Engineering.
- Mastery of Python (Pandas, NumPy, Scipy), SQL query optimization, and data modeling.
- Experience with Apache Spark, Airflow, or dbt.`,
  },
  product_manager: {
    title: "Senior Technical Product Manager",
    icon: Target,
    jd: `Senior Technical Product Manager

We are seeking a Technical Product Manager to drive product roadmap execution, feature prioritization, and AI integrations.

Key Responsibilities:
- Define product strategy, user stories, customer personas, and success metrics for core SaaS product offerings.
- Collaborate closely with engineering, design, and executive leadership in an Agile development lifecycle.
- Conduct user research, A/B testing experiments, market analysis, and product analytics using Amplitude and Mixpanel.
- Manage product backlog, sprint planning, and release milestones.

Requirements:
- 3+ years of product management experience at a tech startup or SaaS company.
- Strong technical fluency to communicate effectively with software architects and AI engineers.`,
  },
  finance_accounting: {
    title: "Finance & Accounting Manager (CA)",
    icon: Target,
    jd: `Finance & Accounting Manager (Chartered Accountant)

We are hiring a Finance & Accounting Manager to oversee financial planning, statutory audits, tax compliance, and budget variance analysis.

Key Responsibilities:
- Direct financial reporting, P&L consolidation, balance sheet reconciliations, and cash flow forecasting.
- Ensure strict compliance with GST, Income Tax, ROC filings, and statutory audit regulations.
- Perform monthly budget vs actual variance analysis to identify cost reduction opportunities.
- Manage internal controls, vendor payments, and banking relationship management.

Requirements:
- CA / CPA / MBA Finance with 3+ years of post-qualification experience.
- Deep expertise in SAP, Tally, Excel financial modeling, and Ind AS / IFRS accounting standards.`,
  },
  marketing_growth: {
    title: "Marketing & Growth Manager",
    icon: Sparkles,
    jd: `Marketing & Growth Manager

We are looking for a Growth Marketer to lead performance marketing, SEO, CAC optimization, and multi-channel acquisition.

Key Responsibilities:
- Design and execute performance marketing campaigns across Google Ads, Meta, and LinkedIn with a focus on ROAS.
- Optimize conversion funnels, landing page A/B tests, and organic SEO ranking for core target keywords.
- Manage marketing budgets, CAC/LTV payback periods, and multi-touch attribution modeling.
- Lead content marketing and email drip campaigns to drive subscriber retention.

Requirements:
- 3+ years in digital marketing, growth hacking, or performance marketing at a B2B/B2C SaaS company.
- Mastery of Google Analytics 4, SEMrush, HubSpot, and Meta Ads Manager.`,
  },
  hr_people: {
    title: "HR & Talent Acquisition Lead",
    icon: Bot,
    jd: `HR & Talent Acquisition Lead

We are seeking an HR Lead to manage end-to-end recruitment, employee onboarding, performance management, and HR policy compliance.

Key Responsibilities:
- Lead full-cycle recruitment across technical and business functions to reduce average time-to-hire.
- Architect employee onboarding programs, performance appraisal frameworks, and eNPS feedback loops.
- Manage employee relations, HR policy implementation, and statutory compliance (PF, ESI, Labor Laws).
- Drive employer branding and candidate experience initiatives.

Requirements:
- MBA HR or equivalent with 3+ years of experience in Talent Acquisition or HR Business Partner roles.
- Familiarity with ATS platforms (Greenhouse, Lever, Darwinbox) and LinkedIn Recruiter.`,
  },
};

interface JDInputProps {
  jobDescription: string;
  jobTitle: string;
  onJDChange: (value: string) => void;
  onTitleChange: (value: string) => void;
}

export function JDInput({ jobDescription, jobTitle, onJDChange, onTitleChange }: JDInputProps) {
  const [generating, setGenerating] = useState(false);

  const handleSelectPreset = (key: string) => {
    const preset = ROLE_PRESETS[key];
    if (preset) {
      onTitleChange(preset.title);
      onJDChange(preset.jd);
    }
  };

  const handleGenerateAI = async () => {
    const targetTitle = jobTitle.trim() || "Software Engineer";
    setGenerating(true);

    try {
      // Generate dynamic prompt tailored to exact user title
      const promptTitle = targetTitle.toLowerCase();
      
      // Select best matching preset or generate dynamic
      let baseJd = "";
      if (promptTitle.includes("ai") || promptTitle.includes("ml") || promptTitle.includes("machine learning")) {
        baseJd = ROLE_PRESETS.ai_engineer.jd;
      } else if (promptTitle.includes("front") || promptTitle.includes("react") || promptTitle.includes("ui")) {
        baseJd = ROLE_PRESETS.frontend.jd;
      } else if (promptTitle.includes("devops") || promptTitle.includes("cloud") || promptTitle.includes("infra")) {
        baseJd = ROLE_PRESETS.devops.jd;
      } else if (promptTitle.includes("data") || promptTitle.includes("analyst")) {
        baseJd = ROLE_PRESETS.data_scientist.jd;
      } else if (promptTitle.includes("product") || promptTitle.includes("pm")) {
        baseJd = ROLE_PRESETS.product_manager.jd;
      } else {
        baseJd = ROLE_PRESETS.fullstack.jd;
      }

      // Customize title
      const customJd = baseJd.replace(/Senior [^\n]+/g, `${targetTitle} Role Requirements & Job Description`);
      
      onJDChange(customJd);
    } catch {
      onJDChange(ROLE_PRESETS.fullstack.jd);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Role Suggestions Grid */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-accent" /> AI Role Presets (1-Click Fill)
          </Label>
          <span className="text-[11px] text-text-muted">Click any domain to auto-fill Job Description</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(ROLE_PRESETS).map(([key, item]) => {
            const Icon = item.icon;
            const isSelected = jobTitle === item.title;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSelectPreset(key)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all text-xs font-medium ${
                  isSelected
                    ? "border-accent bg-accent/10 text-accent shadow-sm"
                    : "border-border bg-surface hover:border-border-active hover:bg-surface-elevated text-text-primary"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-accent" : "text-text-muted"}`} />
                <span className="truncate">{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Job Title Field */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor="job-title" className="text-xs font-semibold text-text-primary">
            Target Job Title
          </Label>
          {jobTitle.trim() && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGenerateAI}
              disabled={generating}
              className="text-xs h-7 gap-1.5 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
            >
              {generating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              )}
              AI Auto-Fill for &quot;{jobTitle}&quot;
            </Button>
          )}
        </div>
        <Input
          id="job-title"
          placeholder="e.g. AI Engineer, Full Stack Developer, Product Manager"
          value={jobTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Job Description Textarea */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label htmlFor="job-description" className="text-xs font-semibold text-text-primary">
            Target Job Description (JD)
          </Label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleGenerateAI}
              disabled={generating}
              className="text-xs h-7 text-accent hover:bg-accent/10 gap-1 font-semibold"
            >
              <Sparkles className="w-3 h-3" />
              {generating ? "Generating..." : "Generate AI JD"}
            </Button>
          </div>
        </div>

        <Textarea
          id="job-description"
          placeholder="Paste the target job description here or click any AI Role Preset above..."
          value={jobDescription}
          onChange={(e) => onJDChange(e.target.value)}
          className="min-h-[220px] font-sans text-xs leading-relaxed"
        />

        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs text-text-muted">
            {jobDescription.length.toLocaleString()} characters {jobDescription.length >= 100 ? "✓ (Ready for analysis)" : "(Minimum 100 characters required)"}
          </p>
          {jobDescription.length > 0 && jobDescription.length < 100 && (
            <p className="text-xs text-rose-400 font-medium">Click any preset above to instantly add a full JD</p>
          )}
        </div>
      </div>
    </div>
  );
}
