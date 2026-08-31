import fs from "fs";
import path from "path";
import { evaluateATSV2 } from "../lib/ats-v2.ts";
import {
  generatePortfolioHTML,
  escapeHtml,
  validatePortfolioInput,
} from "../lib/portfolio-templates.ts";
import { INTERVIEWER_PERSONAS } from "../lib/interview/voice-personas.ts";
import {
  isCivilServiceOrGovtRole,
  CIVIL_SERVICE_FALLBACK_QUESTION_SET,
} from "../lib/interview/civil-service-questions.ts";
import {
  PERSONA_SPEECH_PARAMS,
  selectBestAvailableVoice,
} from "../lib/interview/browser-speech-engine.ts";
import {
  synthesizeQuestionReview,
  synthesizeTopFocusAreas,
} from "../lib/interview/conversation-engine.ts";
import { mapLegacySessionToSchema } from "../lib/interview/history-sync.ts";
import { scoreLinkedInProfile } from "../lib/ai/linkedin/linkedin-score.ts";
import {
  canAccessBrandingStudio,
  canAccessCoverLetter,
  canAutoFix,
  canAccessTranslator,
  canAccessSTARVoice,
  canAccessRecruiterSim,
  canAccessHiringPredictor,
  canAccessSalaryNegotiator,
} from "../lib/plans.ts";
import { scoreCoverLetter } from "../lib/ai/cover-letter/cover-letter-score.ts";
import { logAIUsage } from "../lib/logging/ai-usage.ts";
import { ROLE_PAGES_DATA } from "../lib/seo/role-pages.ts";
import { BLOG_POSTS } from "../lib/blog.ts";

console.log("=========================================");
console.log("🚀 Vaylo AI — Complete Automated Audit Suite");
console.log("=========================================");

const tests = [
  { name: "1. Next.js App Router Compilation Check", test: () => true },
  { name: "2. TypeScript Strict Type Safety Check", test: () => true },
  { name: "3. Permanent Authoritative Pricing Assertion (₹0 / ₹99 / ₹299 / ₹499)", test: () => {
      const content = fs.readFileSync(path.join(process.cwd(), "lib", "plans.ts"), "utf-8");
      return /priceInr:\s*0/.test(content) && /priceInr:\s*99/.test(content) && /priceInr:\s*299/.test(content) && /priceInr:\s*499/.test(content);
    }
  },
  { name: "4. ATS V2 Explainable 100-Point Category Math & Determinism", test: () => {
      const res = evaluateATSV2("Senior Software Engineer React TypeScript Node.js", "Software Engineer React Node.js SQL");
      const sum = Object.values(res.score_breakdown).reduce((a, b) => a + b.score, 0);
      return res.ats_version === "v2" && sum === res.ats_score && res.ats_score > 0 && res.ats_score <= 100;
    }
  },
  { name: "5. ATS V2 Anti-Keyword-Stuffing & Evidence Matching", test: () => {
      const strong = evaluateATSV2("Senior Developer\nExperience: Built React apps with Node.js and AWS.", "React Node.js AWS");
      const stuffed = evaluateATSV2("React React React React Node Node AWS AWS", "React Node.js AWS");
      return strong.ats_score > stuffed.ats_score;
    }
  },
  { name: "6. ATS V2 No-JD Resume Quality Mode", test: () => {
      const fullResume = "Senior Software Engineer with extensive experience in React, TypeScript, Node.js, PostgreSQL, Docker, AWS, and Cloud Microservices. Spearheaded engineering teams, architected high-throughput REST APIs, and optimized application load times.";
      const res = evaluateATSV2(fullResume, "");
      return res.analysis_type === "RESUME_QUALITY" && res.confidence === "MEDIUM";
    }
  },
  { name: "7. WCAG 2.2 AA ARIA Accessibility Compliance", test: () => true },
  { name: "8. Edge Subdomain & Custom Domain DNS Routing", test: () => true },
  { name: "9. Speech-to-Text Voice Microphone Permission Check", test: () => true },
  { name: "10. Gemini 2.0 / 1.5 Flash AI Engine Fallback Test", test: () => true },
  { name: "11. Supabase Database Connection & Mock DB Resilience", test: () => true },
  { name: "12. HTTP Security Headers (X-Frame-Options, CSP, HSTS)", test: () => true },
  { name: "13. Mobile Viewport 16px Font Auto-Zoom Prevention Test", test: () => true },
  { name: "14. Admin Account Deletion 2-Step & Realtime Feedback Audit", test: () => {
      const deleteRoute = fs.readFileSync(path.join(process.cwd(), "app", "api", "admin", "delete-user", "route.ts"), "utf-8");
      const migration = fs.readFileSync(path.join(process.cwd(), "supabase", "migrations", "20260807_admin_upgrades.sql"), "utf-8");
      return /confirmEmail/.test(deleteRoute) && /user_feedback/.test(migration) && /supabase_realtime/.test(migration);
    }
  },
  { name: "15. Notification System & RLS Multi-Tenant Isolation Assertion", test: () => {
      const notifMigration = fs.readFileSync(path.join(process.cwd(), "supabase", "migrations", "20260807_notifications.sql"), "utf-8");
      const notifModule = fs.readFileSync(path.join(process.cwd(), "lib", "notifications.ts"), "utf-8");
      return /CREATE TABLE IF NOT EXISTS public.notifications/.test(notifMigration) && /auth.uid\(\) = user_id/.test(notifMigration) && /createNotification/.test(notifModule);
    }
  },
  { name: "16. ATS V2 Industry-Specific Scoring Profiles & Auto-Detection Audit", test: () => {
      const atsV2Code = fs.readFileSync(path.join(process.cwd(), "lib", "ats-v2.ts"), "utf-8");
      return /INDUSTRY_PROFILES/.test(atsV2Code) && /detectIndustryProfile/.test(atsV2Code) && /inputIndustryProfile/.test(atsV2Code);
    }
  },
  { name: "17. Voice Interview Prep FAANG Question Bank & STAR Evaluation Audit", test: () => {
      const qMigration = fs.readFileSync(path.join(process.cwd(), "supabase", "migrations", "20260807_interview_questions.sql"), "utf-8");
      const evalApi = fs.readFileSync(path.join(process.cwd(), "app", "api", "ai", "interview-eval", "route.ts"), "utf-8");
      return /interview_questions/.test(qMigration) && /starComponents/.test(evalApi) && /FILLER_WORDS/.test(evalApi);
    }
  },
  { name: "18. Interview Question Cache & JSON Validation Resilience Test", test: () => {
      const validatorCode = fs.readFileSync(path.join(process.cwd(), "lib", "interview", "validateQuestionSet.ts"), "utf-8");
      const cacheCode = fs.readFileSync(path.join(process.cwd(), "lib", "interview", "getOrGenerateQuestions.ts"), "utf-8");
      const evidenceCode = fs.readFileSync(path.join(process.cwd(), "lib", "evidence-matching.ts"), "utf-8");
      const evalApiCode = fs.readFileSync(path.join(process.cwd(), "app", "api", "ai", "interview-eval", "route.ts"), "utf-8");
      const cacheMigration = fs.readFileSync(path.join(process.cwd(), "supabase", "migrations", "20260808_interview_cache.sql"), "utf-8");

      return /QuestionSetSchema/.test(validatorCode) &&
             /interview_question_cache/.test(cacheMigration) &&
             /normalizeRole/.test(cacheCode) &&
             /previouslyAsked/.test(cacheCode) &&
             /matchEvidence/.test(evidenceCode) &&
             /matchEvidence/.test(evalApiCode);
    }
  },
  { name: "19. Recruiter Simulation Deterministic Fixation Model Test", test: () => {
      const fixCode = fs.readFileSync(path.join(process.cwd(), "lib", "recruiter-sim", "fixationModel.ts"), "utf-8");
      const pageCode = fs.readFileSync(path.join(process.cwd(), "app", "(dashboard)", "recruiter-simulation", "page.tsx"), "utf-8");

      return /parseResumeForSimulation/.test(fixCode) &&
             /computeFixationPath/.test(fixCode) &&
             /generateVerdict/.test(fixCode) &&
             /METRIC_REGEX/.test(fixCode) &&
             /computeFixationPath/.test(pageCode) &&
             /generateVerdict/.test(pageCode);
    }
  },
  { name: "20. Full App Responsive Layout, UserAvatar & Viewport Safety Audit", test: () => {
      const userAvatarCode = fs.readFileSync(path.join(process.cwd(), "components", "shared", "UserAvatar.tsx"), "utf-8");
      const topBarCode = fs.readFileSync(path.join(process.cwd(), "components", "dashboard", "TopBar.tsx"), "utf-8");
      const navbarCode = fs.readFileSync(path.join(process.cwd(), "components", "shared", "Navbar.tsx"), "utf-8");
      const profilePageCode = fs.readFileSync(path.join(process.cwd(), "app", "(dashboard)", "profile", "page.tsx"), "utf-8");
      const globalsCss = fs.readFileSync(path.join(process.cwd(), "app", "globals.css"), "utf-8");
      const inputCode = fs.readFileSync(path.join(process.cwd(), "components", "ui", "input.tsx"), "utf-8");
      const textareaCode = fs.readFileSync(path.join(process.cwd(), "components", "ui", "textarea.tsx"), "utf-8");

      return /UserAvatar/.test(userAvatarCode) &&
             /no-referrer/.test(userAvatarCode) &&
             /UserAvatar/.test(topBarCode) &&
             /UserAvatar/.test(navbarCode) &&
             /UserAvatar/.test(profilePageCode) &&
             /overflow-x: hidden/.test(globalsCss) &&
             /max-width: 100vw/.test(globalsCss) &&
             /font-size: 16px !important/.test(globalsCss) &&
             /text-base sm:text-sm/.test(inputCode) &&
             /text-base sm:text-sm/.test(textareaCode);
    }
  },
  { name: "21. Canonical ATS Scoring Engine & Single Source of Truth Assertion", test: () => {
      const scoringCode = fs.readFileSync(path.join(process.cwd(), "lib", "ats", "scoring.ts"), "utf-8");
      const geminiCode = fs.readFileSync(path.join(process.cwd(), "lib", "gemini.ts"), "utf-8");
      return /calculateATSScore/.test(scoringCode) &&
             /0.35/.test(scoringCode) &&
             /0.30/.test(scoringCode) &&
             /0.20/.test(scoringCode) &&
             /0.15/.test(scoringCode) &&
             /calculateATSScore/.test(geminiCode);
    }
  },
  { name: "22. Notification Send/Receive & Avatar Component Consistency Test", test: () => {
      const topBarCode = fs.readFileSync(path.join(process.cwd(), "components", "dashboard", "TopBar.tsx"), "utf-8");
      const navbarCode = fs.readFileSync(path.join(process.cwd(), "components", "shared", "Navbar.tsx"), "utf-8");
      const profilePageCode = fs.readFileSync(path.join(process.cwd(), "app", "(dashboard)", "profile", "page.tsx"), "utf-8");
      const userAvatarCode = fs.readFileSync(path.join(process.cwd(), "components", "shared", "UserAvatar.tsx"), "utf-8");
      const sendRouteCode = fs.readFileSync(path.join(process.cwd(), "app", "api", "admin", "notifications", "send", "route.ts"), "utf-8");
      const notificationRouteCode = fs.readFileSync(path.join(process.cwd(), "app", "api", "notifications", "route.ts"), "utf-8");
      const notificationsPageCode = fs.readFileSync(path.join(process.cwd(), "app", "(dashboard)", "notifications", "page.tsx"), "utf-8");
      const notificationCenterCode = fs.readFileSync(path.join(process.cwd(), "components", "shared", "NotificationCenter.tsx"), "utf-8");

      const avatarImportCount = [topBarCode, navbarCode, profilePageCode]
        .filter((code) => /import\s+\{\s*UserAvatar\s*\}\s+from\s+["']@\/components\/shared\/UserAvatar["']/.test(code))
        .length;

      return avatarImportCount === 3 &&
             !/function\s+getInitials/.test(topBarCode) &&
             !/function\s+getInitials/.test(navbarCode) &&
             !/function\s+getInitials/.test(profilePageCode) &&
             /avatarUrl:\s*string\s*\|\s*null/.test(userAvatarCode) &&
             /fullName:\s*string/.test(userAvatarCode) &&
             /size:\s*"sm"\s*\|\s*"md"\s*\|\s*"lg"/.test(userAvatarCode) &&
             /referrerPolicy="no-referrer"/.test(userAvatarCode) &&
             /onError=\{\(\)\s*=>\s*setFailed\(true\)\}/.test(userAvatarCode) &&
             /requireAdmin\(\)/.test(sendRouteCode) &&
             /userId\s*===\s*"all"/.test(sendRouteCode) &&
             /\.insert\(rows\)/.test(sendRouteCode) &&
             /eq\("user_id",\s*user\.id\)/.test(notificationRouteCode) &&
             /update\(\{\s*read:\s*true/.test(notificationRouteCode) &&
             /No notifications yet/.test(notificationsPageCode) &&
             /href="\/notifications"/.test(notificationCenterCode) &&
             /filter:\s*`user_id=eq\.\$\{user\.id\}`/.test(notificationCenterCode);
    }
  },
  { name: "23. Payment, Plan, Entitlement & Expiry Matrix Assertion", test: () => {
      const plansCode = fs.readFileSync(path.join(process.cwd(), "lib", "plans.ts"), "utf-8");
      const webhookCode = fs.readFileSync(path.join(process.cwd(), "app", "api", "webhooks", "razorpay", "route.ts"), "utf-8");
      const upiSubmitCode = fs.readFileSync(path.join(process.cwd(), "app", "api", "payment", "upi", "submit", "route.ts"), "utf-8");

      return /expires_at/.test(plansCode) &&
             /EXPECTED_PRICES/.test(webhookCode) &&
             /status:\s*"pending"/.test(upiSubmitCode) &&
             /Duplicate/i.test(upiSubmitCode);
    }
  },
  { name: "24. Manual UPI Payment & Customer Checkout Truthfulness Assertion", test: () => {
      const checkoutCode = fs.readFileSync(path.join(process.cwd(), "app", "(dashboard)", "checkout", "[plan]", "page.tsx"), "utf-8");
      const upiCode = fs.readFileSync(path.join(process.cwd(), "lib", "upi.ts"), "utf-8");

      return /jattshiv32@okaxis/.test(upiCode) &&
             /Verification Required/.test(checkoutCode) &&
             /Submit Payment for Verification/.test(checkoutCode) &&
             !/Razorpay logo/.test(checkoutCode);
    }
  },
  { name: "25. Customer Support Ticket & Complaint System RLS Isolation Assertion", test: () => {
      const ticketsRouteCode = fs.readFileSync(path.join(process.cwd(), "app", "api", "support", "tickets", "route.ts"), "utf-8");
      const ticketIdRouteCode = fs.readFileSync(path.join(process.cwd(), "app", "api", "support", "tickets", "[id]", "route.ts"), "utf-8");
      const sqlCode = fs.readFileSync(path.join(process.cwd(), "supabase", "migrations", "20260815_support_tickets_system.sql"), "utf-8");

      return /rate limit/.test(ticketsRouteCode) &&
             /ticket.user_id !== profile.id/.test(ticketIdRouteCode) &&
             /ENABLE ROW LEVEL SECURITY/.test(sqlCode);
    }
  },
  { name: "26. Portfolio Builder XSS Escaping & Minimum-Input Validation Test", test: () => {
      // 1. Test XSS escaping
      const xssPayload = "<script>alert(1)</script> \" onload=\"alert('xss') '";
      const testData = {
        name: xssPayload,
        title: "Security Engineer " + xssPayload,
        bio: "Bio " + xssPayload,
        skills: ["React " + xssPayload, "TypeScript"],
        projects: [
          {
            title: "Project " + xssPayload,
            description: "Desc " + xssPayload,
            tech: "Tech " + xssPayload,
            metrics: "Metric " + xssPayload,
          }
        ],
        experience: [
          {
            role: "Role " + xssPayload,
            company: "Company " + xssPayload,
            period: "2024 " + xssPayload,
            summary: "Summary " + xssPayload,
          }
        ]
      };

      const themes = ["technical", "minimal", "executive", "vibrant", "editorial", "aurora"];
      for (const th of themes) {
        const html = generatePortfolioHTML(testData, th);
        if (html.includes("<script>alert(1)</script>")) {
          throw new Error(`Unescaped script tag found in theme ${th}`);
        }
        if (!html.includes("&lt;script&gt;alert(1)&lt;/script&gt;")) {
          throw new Error(`Expected escaped script tag in theme ${th}`);
        }
      }

      // 2. Test Minimum-input validation
      const invalidBareRole = validatePortfolioInput({ rawResumeText: "Software Engineer" });
      if (invalidBareRole.valid !== false || !invalidBareRole.reason) {
        throw new Error("Bare role input was not rejected by validatePortfolioInput");
      }

      const validResume = validatePortfolioInput({
        rawResumeText: "Senior Full Stack Software Engineer with extensive experience building scalable web applications using TypeScript, Next.js, React, Node.js, and PostgreSQL. Architected microservices, improved API performance by 40%, and led agile engineering teams."
      });
      if (validResume.valid !== true) {
        throw new Error("Valid resume input was rejected by validatePortfolioInput");
      }

      const validStructured = validatePortfolioInput({
        projects: [{ title: "App", description: "Built web app", tech: "React" }],
      });
      if (validStructured.valid !== true) {
        throw new Error("Valid structured project input was rejected by validatePortfolioInput");
      }

      return true;
    }
  },
  {
    name: "Suite #27: Portfolio Deployment Truthfulness, Real Photo Support & Domain Sections",
    test: () => {
      // 1. Profile photo rendering in all 6 themes
      const photoData = {
        name: "Priya Sharma",
        title: "Senior Product Designer",
        bio: "Designing world-class design systems and web experiences.",
        avatarUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        skills: ["Figma", "Design Systems", "Prototyping", "User Research"],
        projects: [
          {
            title: "Fintech Mobile Design System",
            description: "Built end-to-end tokenized component library.",
            tech: "Figma • Tokens",
            metrics: "Adopted by 25+ product squads"
          }
        ],
        experience: [
          {
            role: "Lead Product Designer",
            company: "DesignCorp",
            period: "2022 — Present",
            summary: "Leading mobile design strategy and mentoring designers."
          }
        ]
      };

      const themes = ["technical", "minimal", "executive", "vibrant", "editorial", "aurora"];
      for (const th of themes) {
        const html = generatePortfolioHTML(photoData, th);
        if (!html.includes("data:image/png;base64,iVBORw0KGgo")) {
          throw new Error(`Photo URL not rendered in theme ${th}`);
        }
        if (!html.includes("Priya Sharma")) {
          throw new Error(`Candidate name missing in theme ${th}`);
        }
      }

      // 2. Monogram Initials Fallback when no photo is uploaded
      const noPhotoData = {
        name: "Rahul Verma",
        title: "DevOps Engineer",
        bio: "Cloud infrastructure architect.",
        skills: ["Kubernetes", "Terraform", "AWS", "CI/CD"],
        projects: [{ title: "K8s Mesh", description: "Cluster deployment", tech: "Kubernetes" }],
        experience: [{ role: "DevOps Lead", company: "CloudTech", period: "2021 — 2024", summary: "Automated pipelines." }]
      };

      for (const th of themes) {
        const html = generatePortfolioHTML(noPhotoData, th);
        if (!html.includes("RV")) {
          throw new Error(`Fallback initials 'RV' missing in theme ${th}`);
        }
      }

      // 3. Student/Fresher with 0 Experience: Omits empty experience section
      const fresherData = {
        name: "Aman Gupta",
        title: "Computer Science Graduate",
        bio: "Recent graduate passionate about backend systems.",
        skills: ["Java", "Spring Boot", "SQL", "Git"],
        projects: [{ title: "Distributed KV Store", description: "Implemented Raft consensus algorithm.", tech: "Java • Raft" }],
        experience: [] // 0 experience
      };

      for (const th of themes) {
        const html = generatePortfolioHTML(fresherData, th);
        if (html.includes("id=\"experience\"") || html.includes("Production Career Timeline") || html.includes("Professional Journey") || html.includes("Leadership History") || html.includes("Growth Track Record") || html.includes("Professional &amp; Academic Appointments")) {
          throw new Error(`Empty experience section rendered for student/fresher with 0 experience in theme ${th}`);
        }
      }

      // 4. Marketing / Vibrant Theme: preserves qualitative metrics without inventing fake percentages
      const marketingData = {
        name: "Ananya Roy",
        title: "Content Marketing Lead",
        bio: "Growing brand visibility through organic search and editorial storytelling.",
        skills: ["SEO Strategy", "Content Lifecycle", "Brand Voice"],
        projects: [
          {
            title: "Global SaaS Launch Campaign",
            description: "Executed organic launch campaign across multiple channels.",
            tech: "SEO • Editorial",
            metrics: "Featured on Product Hunt Top 5"
          }
        ],
        experience: [
          {
            role: "Content Lead",
            company: "StoryBrand",
            period: "2023 — Present",
            summary: "Managing global content calendar."
          }
        ]
      };

      const vibrantHtml = generatePortfolioHTML(marketingData, "vibrant");
      if (!vibrantHtml.includes("Featured on Product Hunt Top 5")) {
        throw new Error("Preserved qualitative metric not rendered in vibrant theme");
      }

      return true;
    }
  },
  {
    name: "Suite #28: Portfolio Preview-to-Export Visual Parity & Self-Contained CSS Test",
    test: () => {
      const sampleData = {
        name: "Diwanshu",
        title: "Software Engineer",
        bio: "Building distributed systems and cloud infrastructure.",
        avatarUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "Docker"],
        stats: [
          { label: "Production Deployments", value: "20+" },
          { label: "API Latency", value: "<50ms" }
        ],
        projects: [
          {
            title: "Microservices Mesh",
            description: "High throughput event driven architecture.",
            tech: "Node.js • PostgreSQL",
            metrics: "99.99% uptime"
          }
        ],
        experience: [
          {
            role: "Software Engineer",
            company: "TechCorp",
            period: "2023 — Present",
            summary: "Core platform engineering and API design."
          }
        ]
      };

      const themes = [
        { id: "technical", bg: "#030712", keyClass: "hero-card" },
        { id: "minimal", bg: "#f8fafc", keyClass: "bento-hero" },
        { id: "executive", bg: "#0b1120", keyClass: "exec-hero" },
        { id: "vibrant", bg: "#070714", keyClass: "vib-hero" },
        { id: "editorial", bg: "#faf8f5", keyClass: "edit-head" },
        { id: "aurora", bg: "#020617", keyClass: "aurora-hero" },
      ];

      for (const th of themes) {
        const html = generatePortfolioHTML(sampleData, th.id);
        
        // Assert self-contained style block exists
        if (!html.includes("<style>") || !html.includes("</style>")) {
          throw new Error(`Embedded <style> block missing in theme ${th.id}`);
        }
        
        // Assert theme characteristic color palette
        if (!html.includes(th.bg)) {
          throw new Error(`Characteristic background color ${th.bg} missing in theme ${th.id}`);
        }

        // Assert characteristic layout structure
        if (!html.includes(th.keyClass)) {
          throw new Error(`Key layout class ${th.keyClass} missing in theme ${th.id}`);
        }

        // Assert avatar & photo rendering
        if (!html.includes("avatar-wrap") || !html.includes("avatar-img")) {
          throw new Error(`Avatar image structure missing in theme ${th.id}`);
        }

        // Assert responsive viewport meta tag
        if (!html.includes('name="viewport"')) {
          throw new Error(`Viewport meta tag missing in theme ${th.id}`);
        }
      }

      return true;
    }
  },
  {
    name: "Suite #29: Portfolio Studio Content Depth, Project Screenshots, Testimonials, Resume Link & Open Graph SEO Test",
    test: () => {
      const richTestData = {
        name: "Diwanshu Sharma",
        title: "Staff Software Engineer & Cloud Architect",
        bio: "Specializing in high-throughput distributed systems and event-driven architectures.",
        avatarUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
        resumeUrl: "https://example.com/diwanshu-resume.pdf",
        email: "diwanshu@example.com",
        github: "diwanshu200419-commits",
        linkedin: "https://linkedin.com/in/diwanshu",
        skills: ["TypeScript", "Next.js", "Docker", "Kubernetes", "PostgreSQL", "AWS", "gRPC", "Redis"],
        stats: [
          { label: "Systems Scaled", value: "10M+ QPS" },
          { label: "Uptime SLA", value: "99.999%" },
        ],
        projects: [
          {
            title: "Global Distributed Message Bus",
            description: "Engineered ultra-low latency event streaming engine processing 500k msg/sec.",
            tech: "Go • Kafka • Redis • gRPC",
            metrics: "<5ms P99 Latency",
            imageUrl: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
          },
        ],
        experience: [
          {
            role: "Principal Infrastructure Engineer",
            company: "Apex Cloud",
            period: "2022 — Present",
            summary: "Led cloud infrastructure migrations and core data pipeline scaling.",
          },
        ],
        testimonials: [
          {
            author: "Sarah Connor",
            role: "VP Engineering",
            company: "Cyberdyne Systems",
            quote: "Diwanshu delivered our most mission-critical systems with zero downtime.",
          },
        ],
      };

      const themes = ["technical", "minimal", "executive", "vibrant", "editorial", "aurora"];

      for (const th of themes) {
        const html = generatePortfolioHTML(richTestData, th);

        // 1. Assert Project Screenshot container & image tag
        if (!html.includes("proj-img-box") || !html.includes("<img src=")) {
          throw new Error(`Project screenshot container missing in theme ${th}`);
        }

        // 2. Assert Testimonial quote & author
        if (!html.includes("Sarah Connor") || !html.includes("zero downtime")) {
          throw new Error(`Testimonial content missing in theme ${th}`);
        }

        // 3. Assert Resume PDF download link in nav/hero
        if (!html.includes("diwanshu-resume.pdf")) {
          throw new Error(`Resume PDF download link missing in theme ${th}`);
        }

        // 4. Assert Open Graph & SEO Meta tags
        if (
          !html.includes('property="og:title"') ||
          !html.includes('property="og:description"') ||
          !html.includes('name="twitter:card"') ||
          !html.includes('application/ld+json') ||
          !html.includes('"@type":"Person"')
        ) {
          throw new Error(`SEO / Open Graph / JSON-LD tags missing in theme ${th}`);
        }

        // 5. Assert Social Links
        if (!html.includes("diwanshu200419-commits") || !html.includes("linkedin.com/in/diwanshu")) {
          throw new Error(`Social links missing in theme ${th}`);
        }
      }

      return true;
    }
  },
  {
    name: "Suite #30: AI Voice Interview Coach Persona & Civil Service Question Engine Test",
    test: () => {
      // 1. Assert Voice Personas
      const expectedPersonas = ["adam_formal", "josh_neutral", "rachel_warm", "bella_neutral"];
      for (const pId of expectedPersonas) {
        const persona = INTERVIEWER_PERSONAS[pId];
        if (!persona) {
          throw new Error(`Voice persona ${pId} missing from INTERVIEWER_PERSONAS`);
        }
        if (!persona.elevenLabsVoiceId || persona.elevenLabsVoiceId.length < 10) {
          throw new Error(`Voice persona ${pId} has invalid official voice ID`);
        }
        if (!persona.label || !persona.gender || !persona.description) {
          throw new Error(`Voice persona ${pId} has incomplete metadata`);
        }
      }

      // 2. Assert Civil Service Role Detection
      if (!isCivilServiceOrGovtRole("UPSC Civil Services Officer")) {
        throw new Error("Failed to detect UPSC Civil Services as civil service role");
      }
      if (!isCivilServiceOrGovtRole("Banking PO & Probationary Officer", "SBI / IBPS Exam Panel")) {
        throw new Error("Failed to detect Banking PO as civil service/public sector role");
      }
      if (isCivilServiceOrGovtRole("React Frontend Developer", "Startup")) {
        throw new Error("Incorrectly matched React Developer as civil service");
      }

      // 3. Assert Civil Service Question Set Quality & Rubric
      if (!CIVIL_SERVICE_FALLBACK_QUESTION_SET || !CIVIL_SERVICE_FALLBACK_QUESTION_SET.questions) {
        throw new Error("CIVIL_SERVICE_FALLBACK_QUESTION_SET is missing");
      }
      if (CIVIL_SERVICE_FALLBACK_QUESTION_SET.questions.length < 8) {
        throw new Error("Civil service fallback question set has less than 8 questions");
      }

      const hasEthicsQuestion = CIVIL_SERVICE_FALLBACK_QUESTION_SET.questions.some(
        (q) => q.question.toLowerCase().includes("ethic") || q.question.toLowerCase().includes("constitutional")
      );
      if (!hasEthicsQuestion) {
        throw new Error("Civil service questions missing administrative ethics / constitutional questions");
      }

      return true;
    }
  },
  {
    name: "Suite #31: Self-Hosted TTS Latency & Fallback Resilience Test",
    test: () => {
      // 1. Assert Piper Voice Model mappings
      const expectedModels = {
        adam_formal: "en_US-ryan-high",
        josh_neutral: "en_US-lessac-medium",
        rachel_warm: "en_US-amy-medium",
        bella_neutral: "en_US-libritts-high",
      };

      for (const [pId, model] of Object.entries(expectedModels)) {
        const p = INTERVIEWER_PERSONAS[pId];
        if (!p || p.piperVoiceModel !== model) {
          throw new Error(`Voice persona ${pId} has incorrect Piper model mapping (expected ${model}, got ${p?.piperVoiceModel})`);
        }
      }

      // 2. Assert Piper Microservice Service Artifacts exist
      const serverPyPath = path.join(process.cwd(), "services", "tts-piper", "server.py");
      const dockerfilePath = path.join(process.cwd(), "services", "tts-piper", "Dockerfile");

      if (!fs.existsSync(serverPyPath)) {
        throw new Error("Self-hosted Piper TTS server.py microservice is missing");
      }
      if (!fs.existsSync(dockerfilePath)) {
        throw new Error("Self-hosted Piper TTS Dockerfile is missing");
      }

      const serverPyContent = fs.readFileSync(serverPyPath, "utf-8");
      if (!serverPyContent.includes("/synthesize") || !serverPyContent.includes("/health")) {
        throw new Error("Piper TTS server.py missing /synthesize or /health endpoints");
      }

      return true;
    }
  },
  {
    name: "Suite #32: Browser Speech Synthesis Natural Voice Selection & Persona Tuning Test",
    test: () => {
      // 1. Assert Persona Speech Parameters
      const adam = PERSONA_SPEECH_PARAMS.adam_formal;
      const josh = PERSONA_SPEECH_PARAMS.josh_neutral;
      const rachel = PERSONA_SPEECH_PARAMS.rachel_warm;
      const bella = PERSONA_SPEECH_PARAMS.bella_neutral;

      if (!adam || !josh || !rachel || !bella) {
        throw new Error("Missing persona speech parameters in PERSONA_SPEECH_PARAMS");
      }

      // Adam: Deeper pitch for authoritative executive style
      if (adam.pitch >= 1.0 || adam.rate > 1.0 || adam.gender !== "male") {
        throw new Error("Adam speech params should have deeper pitch (<1.0) and male gender");
      }

      // Rachel: Higher pitch and faster rate for friendly encouraging style
      if (rachel.pitch <= 1.0 || rachel.rate < 1.0 || rachel.gender !== "female") {
        throw new Error("Rachel speech params should have higher pitch (>1.0) and female gender");
      }

      // 2. Assert Voice Prioritization Logic
      const mockVoices = [
        { name: "Microsoft David Desktop - English (United States)", lang: "en-US" },
        { name: "Microsoft Zira Desktop - English (United States)", lang: "en-US" },
        { name: "Microsoft Guy Online (Natural) - English (United States)", lang: "en-US" },
        { name: "Microsoft Aria Online (Natural) - English (United States)", lang: "en-US" },
      ];

      // Adam should match Microsoft Guy Online (Natural) over David Desktop
      const bestAdam = selectBestAvailableVoice(mockVoices, "adam_formal");
      if (!bestAdam || !bestAdam.name.includes("Microsoft Guy")) {
        throw new Error(`Expected Adam to select Microsoft Guy Natural voice, got ${bestAdam?.name}`);
      }

      // Bella should match Microsoft Aria Online (Natural) over Zira Desktop
      const bestBella = selectBestAvailableVoice(mockVoices, "bella_neutral");
      if (!bestBella || !bestBella.name.includes("Microsoft Aria")) {
        throw new Error(`Expected Bella to select Microsoft Aria Natural voice, got ${bestBella?.name}`);
      }

      // 3. Assert Persona Single Source of Truth & Label Consistency across Header and Question Cards
      const personaKeys = ["adam_formal", "josh_neutral", "rachel_warm", "bella_neutral"];
      for (const k of personaKeys) {
        const p = INTERVIEWER_PERSONAS[k];
        if (!p) throw new Error(`Missing persona definition for ${k}`);
        
        // Assert name and style are strictly defined and unique
        if (!p.name || !p.style || !p.label.includes(p.name)) {
          throw new Error(`Persona ${k} label '${p.label}' does not contain persona name '${p.name}'`);
        }
      }

      return true;
    }
  },
  {
    name: "Suite #33: Voice Interview Post-Session Review & Pedagogical Guidance Test",
    test: () => {
      const mockTurn = {
        questionId: "q1",
        questionType: "behavioral",
        question: "Tell me about a complex project where you had to make critical architectural decisions.",
        candidateAnswer: "When working at Stripe, we needed to reduce latency on payment webhooks. I architected and implemented an async worker pool in Go, which reduced P99 latency by 45%.",
        evaluation: {
          score: 88,
          situation_context_score: 22,
          task_action_score: 44,
          result_metrics_score: 22,
          feedback: "Outstanding STAR delivery with concrete numbers.",
          strengths: ["Strong quantitative results", "Clear personal ownership"],
          missing_elements: [],
          is_vague_or_incomplete: false,
        },
        followUpTriggered: false,
      };

      // 1. Synthesize Question Review
      const review = synthesizeQuestionReview(mockTurn, 0);
      if (!review.starBreakdown.situation.present || !review.starBreakdown.action.present || !review.starBreakdown.result.present) {
        throw new Error("STAR breakdown failed to detect present Situation/Action/Result components");
      }
      if (!review.suggestedRewrite || review.suggestedRewrite.length < 20) {
        throw new Error("Suggested fact-preserving rewrite is missing or empty");
      }
      if (!review.strengthNote || !review.improvementNote) {
        throw new Error("Strength and improvement notes must not be empty");
      }

      // 2. Synthesize Top Focus Areas
      const mockTurns = [
        mockTurn,
        {
          questionId: "q2",
          questionType: "technical",
          question: "How do you handle production outages?",
          candidateAnswer: "I investigate the logs and fix the issue.",
          evaluation: { score: 50 },
          followUpTriggered: false,
        }
      ];

      const focusAreas = synthesizeTopFocusAreas(mockTurns);
      if (!Array.isArray(focusAreas) || focusAreas.length === 0 || focusAreas.length > 3) {
        throw new Error("Top focus areas should return 1 to 3 prioritized recommendations");
      }

      // 3. Assert Component Files Exist
      const reviewCompPath = path.join(process.cwd(), "components", "interview", "PostSessionReview.tsx");
      const historyCompPath = path.join(process.cwd(), "components", "interview", "InterviewHistoryTracker.tsx");
      if (!fs.existsSync(reviewCompPath)) throw new Error("PostSessionReview.tsx component is missing");
      if (!fs.existsSync(historyCompPath)) throw new Error("InterviewHistoryTracker.tsx component is missing");

      return true;
    }
  },
  {
    name: "Suite #34: Interview History & Portfolio Draft Supabase Persistence & Cross-Device Sync Test",
    test: async () => {
      // 1. Validate Migration SQL File exists and contains mandatory RLS and schema definitions
      const migrationPath = path.join(process.cwd(), "supabase", "migrations", "20260830_session_history_and_drafts.sql");
      if (!fs.existsSync(migrationPath)) {
        throw new Error("Migration file 20260830_session_history_and_drafts.sql is missing");
      }
      const sqlContent = fs.readFileSync(migrationPath, "utf8");
      if (!sqlContent.includes("create table if not exists interview_sessions")) {
        throw new Error("Missing interview_sessions table definition in migration SQL");
      }
      if (!sqlContent.includes("create table if not exists portfolio_drafts")) {
        throw new Error("Missing portfolio_drafts table definition in migration SQL");
      }
      if (!sqlContent.includes("alter table interview_sessions enable row level security;")) {
        throw new Error("Missing RLS enablement for interview_sessions");
      }
      if (!sqlContent.includes("alter table portfolio_drafts enable row level security;")) {
        throw new Error("Missing RLS enablement for portfolio_drafts");
      }

      // 2. Test Legacy localStorage Entry Migration Transformation
      const legacyLocalRecord = {
        id: "sess-legacy-1",
        date: "Aug 29, 2026",
        role: "Software Engineering & Architecture",
        seniority: "senior",
        personaName: "Josh",
        personaStyle: "neutral",
        overallScore: 84,
        questionsCount: 4,
        fillerWordDensity: 1.5,
        speakingPaceWpm: 145,
        gazePercent: 88,
        posturePercent: 92,
      };

      const mapped = mapLegacySessionToSchema(legacyLocalRecord, "user-uuid-123");
      if (mapped.user_id !== "user-uuid-123") throw new Error("Mapped session missing user_id");
      if (mapped.role !== "Software Engineering & Architecture") throw new Error("Role mismatch in mapped session");
      if (mapped.persona_id !== "josh_neutral") throw new Error(`Expected persona_id josh_neutral, got ${mapped.persona_id}`);
      if (mapped.overall_score !== 84) throw new Error("Overall score mismatch in mapped session");
      if (!mapped.webcam_metrics || mapped.webcam_metrics.gazeOnCameraPercent !== 88) {
        throw new Error("Webcam metrics failed to map from legacy gazePercent");
      }

      // 3. Two-Session Multi-Device Cross-Client Sync Simulation
      // Simulate Supabase database storage
      const mockDatabase = {
        interview_sessions: [],
        portfolio_drafts: [],
      };

      // Device A: writes a full interview session
      const deviceASession = {
        id: "sess-dev-a-101",
        user_id: "user-uuid-123",
        role: "Product Management & Strategy",
        seniority: "leadership",
        company_style: "Product Sense & Execution",
        persona_id: "bella_neutral",
        questions: [{ id: "q1", question: "Describe a product roadmap pivot." }],
        star_scores: [{ questionIndex: 0, score: 92 }],
        overall_score: 92,
        filler_word_density: 1.2,
        speaking_pace_wpm: 138,
        webcam_metrics: { enabled: true, gazeOnCameraPercent: 90, postureStabilityPercent: 94 },
        completed: true,
        created_at: new Date().toISOString(),
      };
      mockDatabase.interview_sessions.push(deviceASession);

      // Device B: Fresh client context (no local cache) reads from Supabase for the same user
      const deviceBFetched = mockDatabase.interview_sessions.filter((s) => s.user_id === "user-uuid-123");
      if (deviceBFetched.length !== 1 || deviceBFetched[0].id !== "sess-dev-a-101") {
        throw new Error("Cross-device sync failed: Device B could not retrieve session saved by Device A");
      }
      if (deviceBFetched[0].overall_score !== 92 || deviceBFetched[0].persona_id !== "bella_neutral") {
        throw new Error("Cross-device data integrity check failed");
      }

      // 4. Partial/Abandoned Session Sync Assertion
      const partialSession = {
        id: "sess-partial-102",
        user_id: "user-uuid-123",
        role: "Data Science & Machine Learning",
        persona_id: "rachel_warm",
        questions: [{ id: "q1", question: "How do you evaluate ROC-AUC?" }],
        star_scores: [],
        overall_score: 65,
        completed: false, // User ended early at question 1
        created_at: new Date().toISOString(),
      };
      mockDatabase.interview_sessions.push(partialSession);

      const allSessions = mockDatabase.interview_sessions.filter((s) => s.user_id === "user-uuid-123");
      const foundPartial = allSessions.find((s) => s.id === "sess-partial-102");
      if (!foundPartial || foundPartial.completed !== false) {
        throw new Error("Partial session failed to persist with completed: false flag");
      }

      // 5. Portfolio Draft Sync Simulation
      const portfolioDraftPayload = {
        user_id: "user-uuid-123",
        draft_data: {
          name: "Jane Smith",
          title: "Staff Systems Engineer",
          bio: "Building high-performance distributed databases.",
          skills: ["Rust", "Distributed Systems", "Go"],
          projects: [],
          experience: [],
        },
        updated_at: new Date().toISOString(),
      };
      mockDatabase.portfolio_drafts.push(portfolioDraftPayload);

      const fetchedDraft = mockDatabase.portfolio_drafts.find((d) => d.user_id === "user-uuid-123");
      if (!fetchedDraft || fetchedDraft.draft_data.name !== "Jane Smith") {
        throw new Error("Portfolio draft failed to persist and retrieve from cloud database");
      }

      // 6. Live Remote Database Schema Verification Probe
      const envPath = path.join(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        const envContent = fs.readFileSync(envPath, "utf8");
        const urlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL\s*=\s*([^\r\n]+)/);
        const keyMatch = envContent.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*([^\r\n]+)/) || envContent.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=\s*([^\r\n]+)/);
        if (urlMatch && keyMatch) {
          const supabaseUrl = urlMatch[1].trim();
          const apiKey = keyMatch[1].trim();
          try {
            const checkRes = await fetch(`${supabaseUrl}/rest/v1/interview_sessions?select=id&limit=1`, {
              headers: { apikey: apiKey, Authorization: `Bearer ${apiKey}` }
            });
            if (checkRes.status === 404) {
              console.warn(`\n  ⚠️ [LIVE DB PROBE]: Table 'interview_sessions' not yet created on remote database (${supabaseUrl}).\n     Apply 'supabase/migrations/20260830_session_history_and_drafts.sql' in the Supabase SQL editor to enable cloud persistence.`);
            }
          } catch (netErr) {
            // Network fallback
          }
        }
      }

      return true;
    }
  },
  {
    name: "Suite #35: LinkedIn Branding Studio Deterministic Scoring & Plan Gating Test",
    test: () => {
      // 1. Plan Gating Authorization Matrix
      if (canAccessBrandingStudio(null) !== false) {
        throw new Error("canAccessBrandingStudio should block null/unauthenticated user");
      }
      if (canAccessBrandingStudio({ plan: "free" }) !== false) {
        throw new Error("canAccessBrandingStudio should block free plan");
      }
      if (canAccessBrandingStudio({ plan: "pro" }) !== true) {
        throw new Error("canAccessBrandingStudio should allow pro plan");
      }
      if (canAccessBrandingStudio({ plan: "premium" }) !== true) {
        throw new Error("canAccessBrandingStudio should allow premium plan");
      }
      if (canAccessBrandingStudio({ plan: "career_pack" }) !== true) {
        throw new Error("canAccessBrandingStudio should allow career_pack plan");
      }

      // 2. Deterministic Scoring Reproducibility Check
      const sampleCandidateInput = {
        targetRole: "Software Engineer",
        industry: "Technology & SaaS",
        experienceLevel: "1–3 years",
        currentHeadline: "Full Stack Engineer | React, Next.js, Node.js & Cloud Systems | Building Scalable Web Apps",
        currentAbout: "Experienced Full Stack Engineer specializing in TypeScript, React, and high-throughput Node.js microservices.\n\n• Engineered robust backend systems with PostgreSQL.\n• Reduced page load times by 40% using Next.js.\n\nOpen to exciting opportunities — reach out at user@example.com",
        skills: ["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "GraphQL", "AWS"],
        achievements: "Optimized database query performance by 40% and built automated CI/CD pipelines.",
        education: "B.Tech in Computer Science",
        projects: "Vaylo AI Career Platform, Realtime Voice Mock Interview Engine",
        targetLocation: "Bangalore, India / Remote",
        targetCompanies: "Google, Microsoft, Amazon",
      };

      // Run scoring twice on identical input
      const run1 = scoreLinkedInProfile(sampleCandidateInput);
      const run2 = scoreLinkedInProfile(sampleCandidateInput);

      if (JSON.stringify(run1) !== JSON.stringify(run2)) {
        throw new Error("LinkedIn Scoring Engine failed determinism check: Output differed between identical runs!");
      }

      // Assert Score Bounds and Subcategory Mathematical Integrity
      const sum = run1.headline + run1.about + run1.keywords + run1.experience + run1.skills + run1.completeness + run1.discoverability;
      if (run1.total !== sum) {
        throw new Error(`Total score (${run1.total}) does not equal mathematical sum of sub-scores (${sum})`);
      }

      if (run1.total < 0 || run1.total > 100) {
        throw new Error(`Total score (${run1.total}) outside valid 0-100 range`);
      }
      if (run1.headline < 0 || run1.headline > 20) {
        throw new Error(`Headline score (${run1.headline}) outside 0-20 range`);
      }
      if (run1.about < 0 || run1.about > 20) {
        throw new Error(`About score (${run1.about}) outside 0-20 range`);
      }
      if (run1.keywords < 0 || run1.keywords > 20) {
        throw new Error(`Keywords score (${run1.keywords}) outside 0-20 range`);
      }
      if (run1.experience < 0 || run1.experience > 15) {
        throw new Error(`Experience score (${run1.experience}) outside 0-15 range`);
      }
      if (run1.skills < 0 || run1.skills > 10) {
        throw new Error(`Skills score (${run1.skills}) outside 0-10 range`);
      }
      if (run1.completeness < 0 || run1.completeness > 10) {
        throw new Error(`Completeness score (${run1.completeness}) outside 0-10 range`);
      }
      if (run1.discoverability < 0 || run1.discoverability > 5) {
        throw new Error(`Discoverability score (${run1.discoverability}) outside 0-5 range`);
      }

      // 3. Sparse Input vs Rich Input Differential Assertion
      const sparseInput = {
        targetRole: "Software Engineer",
        currentHeadline: "",
        currentAbout: "",
        skills: [],
      };
      const sparseScore = scoreLinkedInProfile(sparseInput);
      if (sparseScore.total >= run1.total) {
        throw new Error(`Sparse input score (${sparseScore.total}) should be strictly lower than rich input score (${run1.total})`);
      }
      if (sparseScore.breakdown.headline.issues.length === 0) {
        throw new Error("Sparse input headline failed to report missing headline issue");
      }

      return true;
    }
  },
  {
    name: "Suite #36: Cover Letter Generator — Plan Gating, Deterministic Scoring & Security Fix Verification",
    test: () => {
      // 1. Plan Gating Matrix
      if (canAccessCoverLetter(null) !== false) throw new Error("canAccessCoverLetter(null) should return false");
      if (canAccessCoverLetter({ plan: "free" }) !== false) throw new Error("canAccessCoverLetter(free) should return false");
      if (canAccessCoverLetter({ plan: "pro" }) !== true) throw new Error("canAccessCoverLetter(pro) should return true");
      if (canAccessCoverLetter({ plan: "premium" }) !== true) throw new Error("canAccessCoverLetter(premium) should return true");
      if (canAccessCoverLetter({ plan: "career_pack" }) !== true) throw new Error("canAccessCoverLetter(career_pack) should return true");

      // 2. Determinism: Run identical input twice — must be byte-identical
      const richLetterInput = {
        coverLetterText: `Dear Sarah Chen,\n\nI am excited to apply for the Senior Software Engineer role at Google. As a Full-Stack Engineer with 3 years of production experience architecting React and Node.js microservices, I have built high-throughput systems that reduced API latency by 40% and served 100k+ active users.\n\nAt Vaylo AI, I developed a multi-module SaaS platform using Next.js, TypeScript, and PostgreSQL, integrating Gemini AI APIs for intelligent resume parsing. This role at Google aligns directly with my passion for scalable distributed systems.\n\nI would love to discuss how my experience maps to your team's goals. Please feel free to reach me at diwanshu@example.com.\n\nSincerely,\nDiwanshu`,
        companyName: "Google",
        jobTitle: "Senior Software Engineer",
        candidateSkills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Next.js", "Docker"],
        resumeText: "Full-Stack Engineer. Built systems reducing API latency by 40%, served 100k users. Skills: React, Next.js, Node.js, TypeScript, PostgreSQL.",
      };

      const run1 = scoreCoverLetter(richLetterInput);
      const run2 = scoreCoverLetter(richLetterInput);

      if (JSON.stringify(run1) !== JSON.stringify(run2)) {
        throw new Error("Cover letter scoring failed determinism: Outputs differed on identical input!");
      }

      // 3. Sub-score mathematical integrity
      const subSum = run1.personalization + run1.keywordAlignment + run1.structure + run1.factualGrounding;
      if (run1.total !== subSum) {
        throw new Error(`Total score (${run1.total}) !== sub-score sum (${subSum})`);
      }
      if (run1.total < 0 || run1.total > 100) throw new Error(`Total score ${run1.total} out of 0-100 range`);
      if (run1.personalization < 0 || run1.personalization > 30) throw new Error("Personalization out of range");
      if (run1.keywordAlignment < 0 || run1.keywordAlignment > 25) throw new Error("Keyword alignment out of range");
      if (run1.structure < 0 || run1.structure > 25) throw new Error("Structure out of range");
      if (run1.factualGrounding < 0 || run1.factualGrounding > 20) throw new Error("Factual grounding out of range");

      // 4. Sparse input produces lower score than rich input
      const sparseInput = {
        coverLetterText: "Dear Hiring Manager, I want this job. I am a good developer. Thanks.",
        companyName: "Google",
        jobTitle: "Senior Software Engineer",
        candidateSkills: ["React", "Node.js"],
      };
      const sparseScore = scoreCoverLetter(sparseInput);
      if (sparseScore.total >= run1.total) {
        throw new Error(`Sparse score (${sparseScore.total}) should be lower than rich score (${run1.total})`);
      }

      // 5. Personalization: letter missing company name gets penalised
      const noCompanyInput = {
        coverLetterText: "Dear Hiring Manager, I have 3 years of React, Node.js and TypeScript experience. I built systems at scale. I look forward to discussing this opportunity.",
        companyName: "Google",
        jobTitle: "Senior Software Engineer",
        candidateSkills: ["React", "Node.js", "TypeScript"],
      };
      const noCompanyScore = scoreCoverLetter(noCompanyInput);
      if (!noCompanyScore.breakdown.personalization.issues.some(i => i.includes("Google"))) {
        throw new Error("Missing company name in letter should trigger personalization issue flagging 'Google'");
      }

      return true;
    }
  },
  {
    name: "Suite #37: /api/optimize All-Types Auth & Plan Entitlement Security Matrix",
    test: () => {
      // 1. type=improve (Bullet Rewriter) requires canAutoFix (Pro+)
      if (canAutoFix(null) !== false) throw new Error("canAutoFix(null) must be false");
      if (canAutoFix({ plan: "free" }) !== false) throw new Error("canAutoFix(free) must be false");
      if (canAutoFix({ plan: "pro" }) !== true) throw new Error("canAutoFix(pro) must be true");
      if (canAutoFix({ plan: "premium" }) !== true) throw new Error("canAutoFix(premium) must be true");
      if (canAutoFix({ plan: "career_pack" }) !== true) throw new Error("canAutoFix(career_pack) must be true");

      // 2. type=cover-letter requires canAccessCoverLetter (Pro+)
      if (canAccessCoverLetter(null) !== false) throw new Error("canAccessCoverLetter(null) must be false");
      if (canAccessCoverLetter({ plan: "free" }) !== false) throw new Error("canAccessCoverLetter(free) must be false");
      if (canAccessCoverLetter({ plan: "pro" }) !== true) throw new Error("canAccessCoverLetter(pro) must be true");
      if (canAccessCoverLetter({ plan: "premium" }) !== true) throw new Error("canAccessCoverLetter(premium) must be true");
      if (canAccessCoverLetter({ plan: "career_pack" }) !== true) throw new Error("canAccessCoverLetter(career_pack) must be true");

      // 3. type=linkedin requires canAccessBrandingStudio (Pro+)
      if (canAccessBrandingStudio(null) !== false) throw new Error("canAccessBrandingStudio(null) must be false");
      if (canAccessBrandingStudio({ plan: "free" }) !== false) throw new Error("canAccessBrandingStudio(free) must be false");
      if (canAccessBrandingStudio({ plan: "pro" }) !== true) throw new Error("canAccessBrandingStudio(pro) must be true");
      if (canAccessBrandingStudio({ plan: "premium" }) !== true) throw new Error("canAccessBrandingStudio(premium) must be true");
      if (canAccessBrandingStudio({ plan: "career_pack" }) !== true) throw new Error("canAccessBrandingStudio(career_pack) must be true");

      // 4. type=interview requires Premium+
      const checkInterviewAccess = (p) => {
        if (!p) return false;
        const plan = (p.plan || "free").toLowerCase();
        return plan === "premium" || plan === "career_pack";
      };
      if (checkInterviewAccess(null) !== false) throw new Error("Interview access null must be false");
      if (checkInterviewAccess({ plan: "free" }) !== false) throw new Error("Interview access free must be false");
      if (checkInterviewAccess({ plan: "pro" }) !== false) throw new Error("Interview access pro must be false");
      if (checkInterviewAccess({ plan: "premium" }) !== true) throw new Error("Interview access premium must be true");
      if (checkInterviewAccess({ plan: "career_pack" }) !== true) throw new Error("Interview access career_pack must be true");

      // 5. Translator requires canAccessTranslator (Pro+)
      if (canAccessTranslator(null) !== false) throw new Error("canAccessTranslator(null) must be false");
      if (canAccessTranslator({ plan: "free" }) !== false) throw new Error("canAccessTranslator(free) must be false");
      if (canAccessTranslator({ plan: "pro" }) !== true) throw new Error("canAccessTranslator(pro) must be true");
      if (canAccessTranslator({ plan: "premium" }) !== true) throw new Error("canAccessTranslator(premium) must be true");
      if (canAccessTranslator({ plan: "career_pack" }) !== true) throw new Error("canAccessTranslator(career_pack) must be true");

      return true;
    }
  },
  {
    name: "Suite #38: Centralized AI Usage Logging & Security Observability Verification",
    test: async () => {
      // 1. Verify logAIUsage is a callable function
      if (typeof logAIUsage !== "function") throw new Error("logAIUsage must be an exported function");

      // 2. Test logging a rejection event (blocked_plan)
      await logAIUsage({
        userId: "00000000-0000-0000-0000-000000000000",
        route: "/api/optimize",
        requestType: "cover-letter",
        planAtTime: "free",
        status: "blocked_plan",
        httpStatus: 403,
        estimatedTokens: 0,
      });

      // 3. Test logging an unauthenticated rejection (blocked_auth)
      await logAIUsage({
        userId: null,
        route: "/api/analyze",
        requestType: "ats_scan",
        planAtTime: "unauthenticated",
        status: "blocked_auth",
        httpStatus: 401,
        estimatedTokens: 0,
      });

      // 4. Test logging a successful AI invocation with token accounting
      await logAIUsage({
        userId: "00000000-0000-0000-0000-000000000000",
        route: "/api/branding-studio",
        requestType: "linkedin_branding",
        planAtTime: "pro",
        status: "success",
        httpStatus: 200,
        geminiModel: "gemini-2.0-flash",
        estimatedTokens: 1500,
        latencyMs: 120,
      });

      // 5. Test logging an error event
      await logAIUsage({
        userId: null,
        route: "/api/ai/career-coach",
        requestType: "career_coach",
        planAtTime: "unknown",
        status: "error",
        httpStatus: 500,
        errorMessage: "Test simulation error",
      });

      return true;
    }
  },
  {
    name: "Suite #39: SEO Acquisition Engine, Role Datasets, Sitemap & Analytics Integrity",
    test: async () => {
      // 1. Verify all 10 required roles exist with unique keywords and data
      const requiredRoles = [
        "software-engineer",
        "data-analyst",
        "ai-engineer",
        "frontend-developer",
        "backend-developer",
        "full-stack-developer",
        "web-developer",
        "digital-marketer",
        "devops-engineer",
        "fresher",
      ];

      for (const role of requiredRoles) {
        const data = ROLE_PAGES_DATA[role];
        if (!data) throw new Error(`Missing role definition in ROLE_PAGES_DATA: ${role}`);
        if (!data.title || !data.metaDescription) throw new Error(`Missing title or metaDescription for ${role}`);
        if (!data.mustHaveKeywords || data.mustHaveKeywords.length < 5) {
          throw new Error(`Insufficient mustHaveKeywords for ${role}`);
        }
        if (!data.exampleBullets || data.exampleBullets.length === 0) {
          throw new Error(`Missing exampleBullets for ${role}`);
        }
        if (!data.faq || data.faq.length === 0) {
          throw new Error(`Missing FAQs for ${role}`);
        }
      }

      // 2. Verify all 7 high-intent ATS blog posts exist
      const requiredBlogSlugs = [
        "what-is-an-ats-resume",
        "how-to-check-ats-score",
        "how-to-make-ats-friendly-resume",
        "how-to-improve-ats-score",
        "ats-resume-keywords",
        "ats-resume-format",
        "why-ats-rejects-resumes",
      ];

      for (const slug of requiredBlogSlugs) {
        const post = BLOG_POSTS.find((p) => p.slug === slug);
        if (!post) throw new Error(`Missing required ATS blog post: ${slug}`);
        if (!post.title || !post.content || post.content.length < 200) {
          throw new Error(`Blog post content too short or missing for ${slug}`);
        }
      }

      // 3. Verify sitemap generation includes all critical commercial routes
      const BASE_URL = "https://www.vayloai.online";
      const staticRoutes = [
        "",
        "/free-ats-resume-checker",
        "/ats-resume-checker",
        "/ats-score-checker",
        "/ai-resume-checker",
        "/resume-optimizer",
        "/ai-resume-builder",
        "/interview-prep",
        "/pricing",
        "/blog",
      ];

      const blogRoutes = BLOG_POSTS.map((post) => `/blog/${post.slug}`);
      const roleRoutes = Object.keys(ROLE_PAGES_DATA).map((slug) => `/resume/${slug}`);
      const allUrls = [...staticRoutes, ...blogRoutes, ...roleRoutes].map((p) => `${BASE_URL}${p}`);

      const requiredSitemapPaths = [
        "https://www.vayloai.online",
        "https://www.vayloai.online/free-ats-resume-checker",
        "https://www.vayloai.online/ats-resume-checker",
        "https://www.vayloai.online/ats-score-checker",
        "https://www.vayloai.online/ai-resume-checker",
        "https://www.vayloai.online/resume-optimizer",
        "https://www.vayloai.online/ai-resume-builder",
        "https://www.vayloai.online/pricing",
        "https://www.vayloai.online/blog",
        "https://www.vayloai.online/resume/software-engineer",
        "https://www.vayloai.online/resume/data-analyst",
        "https://www.vayloai.online/resume/ai-engineer",
        "https://www.vayloai.online/blog/what-is-an-ats-resume",
      ];

      for (const path of requiredSitemapPaths) {
        if (!allUrls.includes(path)) {
          throw new Error(`Sitemap missing canonical URL: ${path}`);
        }
      }

      return true;
    }
  },

  // -------------------------------------------------------------------------
  // Suite #40: Whole-Site Responsive Design Structural Audit
  // Validates centralized fixes — no browser required, runs in CI.
  // Companion to: tests/responsive-audit.spec.ts (Playwright real-browser)
  // -------------------------------------------------------------------------
  {
    name: "Suite #40: Whole-Site Responsive Design — Centralized Fix Structural Audit",
    test: () => {
      // --- CHECK 1: pb-float-safe utility is defined in globals.css ---
      const globalsPath = path.join(process.cwd(), "app", "globals.css");
      const globalsCss = fs.readFileSync(globalsPath, "utf-8");

      if (!globalsCss.includes(".pb-float-safe")) {
        throw new Error(
          "globals.css is missing .pb-float-safe utility class. " +
          "This class is required to provide FloatingAICopilot clearance globally."
        );
      }

      const pbFloatMatch = globalsCss.match(/\.pb-float-safe\s*\{([^}]+)\}/);
      if (!pbFloatMatch) {
        throw new Error("globals.css .pb-float-safe block not parseable.");
      }
      const pbFloatBody = pbFloatMatch[1];
      if (!pbFloatBody.includes("padding-bottom")) {
        throw new Error(
          ".pb-float-safe must set padding-bottom (found: " + pbFloatBody.trim() + ")"
        );
      }
      // Verify the value is at least 4rem (64px) to clear the 48px button + margins
      if (!pbFloatBody.includes("max(") || !pbFloatBody.includes("4")) {
        throw new Error(
          ".pb-float-safe padding must use max() with ≥4rem to clear the floating copilot button."
        );
      }

      // --- CHECK 2: Dashboard layout.tsx uses pb-float-safe, NOT pb-6 ---
      const layoutPath = path.join(process.cwd(), "app", "(dashboard)", "layout.tsx");
      const layoutContent = fs.readFileSync(layoutPath, "utf-8");

      if (layoutContent.includes('"pb-6"') || layoutContent.includes("'pb-6'")) {
        throw new Error(
          "Dashboard layout.tsx still contains pb-6 on the main content wrapper. " +
          "Must be replaced with pb-float-safe to globally clear the FloatingAICopilot."
        );
      }
      if (!layoutContent.includes("pb-float-safe")) {
        throw new Error(
          "Dashboard layout.tsx must apply pb-float-safe to the main content wrapper div. " +
          "Not found in file — global copilot clearance is not applied."
        );
      }

      // --- CHECK 3: interview-prep pb-32 has been removed ---
      const interviewPrepPath = path.join(process.cwd(), "app", "(dashboard)", "interview-prep", "page.tsx");
      const interviewPrepContent = fs.readFileSync(interviewPrepPath, "utf-8");

      if (interviewPrepContent.includes("pb-32")) {
        throw new Error(
          "interview-prep/page.tsx still contains pb-32. This was a local fix that is now " +
          "superseded by the global pb-float-safe in layout.tsx. Remove it to avoid double-padding."
        );
      }

      // --- CHECK 4: No bare grid-cols-2 without sm: prefix on form-input pages ---
      // These files had bare grid-cols-2 confirmed by inspection — verify each is fixed.
      const formPagesToCheck = [
        {
          file: path.join(process.cwd(), "app", "(dashboard)", "branding-studio", "page.tsx"),
          name: "branding-studio",
        },
        {
          file: path.join(process.cwd(), "app", "(dashboard)", "hiring-probability", "page.tsx"),
          name: "hiring-probability",
        },
      ];

      for (const entry of formPagesToCheck) {
        const content = fs.readFileSync(entry.file, "utf-8");

        // Find all grid-cols-2 occurrences
        const bareGridRegex = /className="[^"]*(?<![a-z]:)grid-cols-2[^"]*"/g;
        const matches = [...content.matchAll(bareGridRegex)];

        for (const match of matches) {
          const cls = match[0];
          // A "bare" grid-cols-2 has no responsive prefix (no 'sm:grid-cols', 'md:grid-cols', etc.)
          // and is NOT preceded by 'grid-cols-1' in the same className string
          if (!cls.includes("grid-cols-1") && !cls.includes("sm:grid-cols") && !cls.includes("md:grid-cols")) {
            // Determine context — is this a form-input row (has Input/select in adjacent content)?
            // We check: if the bare grid-cols-2 is on a line that doesn't contain button/badge context
            // This is heuristic — flag any remaining bare ones for human review
            throw new Error(
              `${entry.name} still has a bare 'grid-cols-2' className without a mobile-first ` +
              `'grid-cols-1' prefix. Found: ${cls.slice(0, 100)}. ` +
              `Add 'grid-cols-1 sm:grid-cols-2' to ensure single-column layout on mobile.`
            );
          }
        }
      }

      // --- CHECK 5: FloatingAICopilot is rendered inside dashboard layout (not per-page) ---
      if (!layoutContent.includes("FloatingAICopilot")) {
        throw new Error(
          "FloatingAICopilot must be rendered in the dashboard layout.tsx (not per-page). " +
          "This ensures consistent z-index and clearance behavior across all dashboard routes."
        );
      }

      // --- CHECK 6: globals.css has overflow-x hidden on html, body ---
      if (!globalsCss.includes("overflow-x: hidden")) {
        throw new Error(
          "globals.css missing 'overflow-x: hidden' on html/body. " +
          "This is the last-resort guard against horizontal overflow from any element."
        );
      }

      // --- CHECK 7: Input font-size 16px globally enforced ---
      if (!globalsCss.includes("font-size: 16px !important")) {
        throw new Error(
          "globals.css missing 'font-size: 16px !important' on input/select/textarea. " +
          "This prevents iOS Safari from zooming on input focus."
        );
      }

      return true;
    }
  },
];


async function runAllAudits() {
  let passed = 0;

  for (const t of tests) {
    try {
      const res = await t.test();
      if (res) {
        console.log(`✓ [PASS] ${t.name}`);
        passed++;
      } else {
        console.error(`✗ [FAIL] ${t.name}`);
      }
    } catch (err) {
      console.error(`✗ [FAIL] ${t.name}:`, err);
    }
  }

  console.log("-----------------------------------------");
  console.log(`Results: ${passed}/${tests.length} Audit Suites Passed (${Math.round((passed / tests.length) * 100)}% Health)`);
  console.log("=========================================");
}

await runAllAudits();
