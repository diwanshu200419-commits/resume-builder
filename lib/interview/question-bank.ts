// lib/interview/question-bank.ts
//
// VayloAI — Curated Question Bank
// Original questions structured around public interview assessment patterns (STAR, System Architecture, Behavioral Rubrics).
// No proprietary or copyrighted text copied from external sources.

export interface CuratedQuestion {
  id: string;
  roleCategory: "software_engineering" | "data_ai" | "product_management" | "business_consulting" | "sales_bizdev" | "civil_services";
  subRole: string;
  companyTag: "faang_style" | "startup_style" | "consulting_style" | "public_sector";
  questionType: "behavioral" | "technical" | "system_design" | "case_study" | "culture_fit";
  difficulty: "easy" | "medium" | "hard";
  question: string;
  whyThisMatters: string;
  rubric: {
    situationContext: string;
    actionEvidence: string[];
    resultMetrics: string;
    modelKeywords: string[];
  };
  tags: string[];
}

export const CURATED_QUESTION_BANK: CuratedQuestion[] = [
  // =========================================================================
  // 1. SOFTWARE ENGINEERING — FRONTEND
  // =========================================================================
  {
    id: "swe-fe-01",
    roleCategory: "software_engineering",
    subRole: "frontend",
    companyTag: "faang_style",
    questionType: "technical",
    difficulty: "medium",
    question: "How would you diagnose and resolve a severe interaction delay (INP / Input Delay) on a data-heavy React dashboard rendering real-time telemetry?",
    whyThisMatters: "Tests deep understanding of browser rendering lifecycle, event loop blocking, and modern Core Web Vitals optimization.",
    rubric: {
      situationContext: "Candidate specifies a bottleneck involving UI freeze during heavy state dispatches or complex DOM reconciliation.",
      actionEvidence: ["useTransition or startTransition", "web worker offloading", "virtualized windowing", "profiler flamegraph analysis"],
      resultMetrics: "Specific reduction in INP from >300ms down to <50ms, improving user responsiveness.",
      modelKeywords: ["INP", "event loop", "reconciliation", "useTransition", "virtualization", "web worker"]
    },
    tags: ["react", "web-vitals", "performance", "frontend"]
  },
  {
    id: "swe-fe-02",
    roleCategory: "software_engineering",
    subRole: "frontend",
    companyTag: "startup_style",
    questionType: "behavioral",
    difficulty: "medium",
    question: "Tell me about a time you had to push back on a designer or product manager whose proposed UI design would severely degrade page load speed.",
    whyThisMatters: "Evaluates cross-functional collaboration, technical advocacy, and pragmatic compromise.",
    rubric: {
      situationContext: "Identifies heavy assets (e.g., massive 3D animations, unoptimized web fonts, excessive nested components).",
      actionEvidence: ["presented data with Lighthouse benchmarks", "proposed visual compromise", "implemented progressive enhancement"],
      resultMetrics: "Preserved core visual aesthetics while maintaining sub-1.5s LCP on mobile connections.",
      modelKeywords: ["compromise", "Lighthouse", "user experience", "performance budget", "cross-functional"]
    },
    tags: ["collaboration", "design-system", "trade-offs"]
  },
  {
    id: "swe-fe-03",
    roleCategory: "software_engineering",
    subRole: "frontend",
    companyTag: "faang_style",
    questionType: "system_design",
    difficulty: "hard",
    question: "Walk me through how you would architect an enterprise Design System library consumed by 40+ independent engineering teams across micro-frontends.",
    whyThisMatters: "Measures scalable component architecture, versioning strategy, accessibility (WCAG), and tree-shaking.",
    rubric: {
      situationContext: "Addresses cross-team consistency, bundle bloat, and version skew across distributed web applications.",
      actionEvidence: ["monorepo with semantic versioning", "headless primitives", "CSS variables / tokens", "automated visual regression CI"],
      resultMetrics: "Zero breaking changes during major upgrades and 30% reduction in duplicated styling code.",
      modelKeywords: ["design tokens", "micro-frontends", "accessibility", "WCAG", "tree-shaking", "monorepo"]
    },
    tags: ["architecture", "design-tokens", "microfrontends"]
  },

  // =========================================================================
  // 1. SOFTWARE ENGINEERING — BACKEND & DISTRIBUTED SYSTEMS
  // =========================================================================
  {
    id: "swe-be-01",
    roleCategory: "software_engineering",
    subRole: "backend",
    companyTag: "faang_style",
    questionType: "system_design",
    difficulty: "hard",
    question: "Design an idempotent payment webhook processor that handles duplicate third-party callbacks and out-of-order event deliveries safely.",
    whyThisMatters: "Evaluates understanding of distributed transactions, idempotency keys, database row locking, and ledger consistency.",
    rubric: {
      situationContext: "Third-party payment gateways (Stripe, Razorpay) retrying webhooks with identical payload IDs or delayed delivery.",
      actionEvidence: ["idempotency key hashing", "distributed lock via Redis / optimistic locking", "database unique constraints", "dead-letter queue"],
      resultMetrics: "Eliminated double-credit anomalies and ensured 100% financial reconciliation integrity.",
      modelKeywords: ["idempotency", "distributed lock", "transactional outbox", "row locking", "reconciliation"]
    },
    tags: ["payments", "distributed-systems", "idempotency", "backend"]
  },
  {
    id: "swe-be-02",
    roleCategory: "software_engineering",
    subRole: "backend",
    companyTag: "startup_style",
    questionType: "technical",
    difficulty: "medium",
    question: "Explain your strategy for migrating an operational database schema with 100 million rows from a single PostgreSQL table without query timeouts or application downtime.",
    whyThisMatters: "Validates real-world database migration patterns, locking behavior, and zero-downtime deployment expertise.",
    rubric: {
      situationContext: "Active high-traffic production table with concurrent read/write queries.",
      actionEvidence: ["Expand and Contract pattern", "adding column as nullable without lock", "asynchronous background backfill", "dual-writing before switchover"],
      resultMetrics: "Completed backfill across 100M rows with zero service interruption and p99 query latency under 25ms.",
      modelKeywords: ["expand-and-contract", "zero-downtime", "backfill", "table lock", "dual-write"]
    },
    tags: ["database", "postgresql", "zero-downtime"]
  },
  {
    id: "swe-be-03",
    roleCategory: "software_engineering",
    subRole: "backend",
    companyTag: "faang_style",
    questionType: "behavioral",
    difficulty: "hard",
    question: "Describe a high-severity production outage you were directly responsible for debugging. Walk me through your triage, mitigation, and post-mortem.",
    whyThisMatters: "Amazon-style Ownership & Bias for Action. Assesses poise under pressure, root cause depth, and systemic prevention.",
    rubric: {
      situationContext: "Critical cascading failure (e.g., connection pool exhaustion, memory leak, circular dependency).",
      actionEvidence: ["isolated fault via distributed tracing", "executed rollback/kill-switch to restore service immediately", "conducted 5-Whys root cause post-mortem"],
      resultMetrics: "Restored service within 12 minutes; implemented automated circuit breaker preventing recurrence.",
      modelKeywords: ["triage", "circuit breaker", "5-Whys", "post-mortem", "observability", "rollback"]
    },
    tags: ["incident-response", "ownership", "post-mortem"]
  },

  // =========================================================================
  // 1. SOFTWARE ENGINEERING — DEVOPS & CLOUD INFRASTRUCTURE
  // =========================================================================
  {
    id: "swe-devops-01",
    roleCategory: "software_engineering",
    subRole: "devops",
    companyTag: "faang_style",
    questionType: "technical",
    difficulty: "hard",
    question: "How would you design an automated Canary deployment pipeline on Kubernetes that detects anomaly regressions and rolls back automatically without human intervention?",
    whyThisMatters: "Tests CI/CD engineering, Prometheus metric analysis, ingress traffic routing, and resilient automation.",
    rubric: {
      situationContext: "High-risk releases where buggy deployments could impact revenue or customer trust.",
      actionEvidence: ["Argo Rollouts / Flagger integration", "Prometheus error rate and latency threshold monitoring", "weighted traffic splitting (5% -> 25% -> 100%)", "automated rollback trigger"],
      resultMetrics: "Zero bad deploys reaching >10% of users; cut rollback Mean Time to Recovery (MTTR) from 20 minutes to 45 seconds.",
      modelKeywords: ["canary", "argo rollouts", "prometheus", "traffic splitting", "MTTR", "automated rollback"]
    },
    tags: ["kubernetes", "cicd", "sre", "canary"]
  },

  // =========================================================================
  // 2. DATA & AI — DATA ANALYST & SQL
  // =========================================================================
  {
    id: "data-ana-01",
    roleCategory: "data_ai",
    subRole: "analytics",
    companyTag: "startup_style",
    questionType: "technical",
    difficulty: "medium",
    question: "You notice our core checkout conversion rate dropped by 18% week-over-week. Walk me through your structured investigation framework to isolate the cause.",
    whyThisMatters: "Tests structured analytical thinking, metric decomposition, cohort segmentation, and business intuition.",
    rubric: {
      situationContext: "Sudden top-line metric drop that could stem from tracking bugs, payment gateway downtime, device bugs, or seasonal effects.",
      actionEvidence: ["checked data pipeline tracking integrity first", "segmented by device, browser, geo, and traffic acquisition channel", "funnel drop-off step analysis"],
      resultMetrics: "Identified a JavaScript error impacting Safari mobile users; enabled swift engineering hotfix restoring 18% conversion.",
      modelKeywords: ["segmentation", "cohort analysis", "funnel drop-off", "root cause", "conversion rate"]
    },
    tags: ["analytics", "funnel", "conversion", "sql"]
  },
  {
    id: "data-ana-02",
    roleCategory: "data_ai",
    subRole: "analytics",
    companyTag: "consulting_style",
    questionType: "case_study",
    difficulty: "hard",
    question: "Explain how you would design a unified Customer Lifetime Value (LTV) metric for a subscription product with high churn in the first 30 days.",
    whyThisMatters: "Evaluates financial modeling, cohort analysis, discount rate adjustments, and statistical retention curves.",
    rubric: {
      situationContext: "Product facing front-loaded churn where naive linear LTV estimates misallocate marketing ad spend.",
      actionEvidence: ["cohort-based survival curve (Kaplan-Meier)", "separated payback period from asymptotic LTV", "integrated gross margin adjustments"],
      resultMetrics: "Corrected customer acquisition cost (CAC) allowance ceiling, preventing ₹25L in unprofitable ad spend.",
      modelKeywords: ["LTV", "CAC ratio", "cohort survival", "churn", "cohort analysis"]
    },
    tags: ["metrics", "ltv", "retention"]
  },

  // =========================================================================
  // 2. DATA & AI — MACHINE LEARNING & MLOPS
  // =========================================================================
  {
    id: "data-ml-01",
    roleCategory: "data_ai",
    subRole: "machine_learning",
    companyTag: "faang_style",
    questionType: "technical",
    difficulty: "hard",
    question: "How do you detect and mitigate embedding drift or concept drift in a production semantic search system powered by LLM embeddings?",
    whyThisMatters: "Tests cutting-edge GenAI and retrieval evaluation, vector drift metrics, and continuous evaluation pipelines.",
    rubric: {
      situationContext: "Vocabulary and query semantics shift over time (e.g. seasonal slang, new domain entities), causing retrieval ranking quality to decay.",
      actionEvidence: ["monitored cosine similarity distributions of top-k results", "tracked Mean Reciprocal Rank (MRR) and NDCG on golden benchmark queries", "implemented active learning pipeline"],
      resultMetrics: "Maintained MRR above 0.82 across 6 months of query volume shifts.",
      modelKeywords: ["concept drift", "embedding drift", "MRR", "NDCG", "vector search", "golden dataset"]
    },
    tags: ["machine-learning", "rag", "embeddings", "drift"]
  },

  // =========================================================================
  // 3. PRODUCT MANAGEMENT — PRODUCT SENSE & STRATEGY
  // =========================================================================
  {
    id: "pm-strat-01",
    roleCategory: "product_management",
    subRole: "strategy",
    companyTag: "faang_style",
    questionType: "case_study",
    difficulty: "hard",
    question: "Imagine you are the Lead PM for LinkedIn Learning. User completion rates are below 15%. How would you diagnose the problem and what product solution would you test first?",
    whyThisMatters: "Standard Google/Meta PM execution question. Assesses user empathy, friction identification, hypothesis formulation, and metric definition.",
    rubric: {
      situationContext: "Identifies why users abandon courses (too long, lack of social accountability, no immediate career utility).",
      actionEvidence: ["analyzed drop-off milestone curve", "hypothesized micro-learning bite-sized video modules with verifiable resume badges", "scoped minimal MVP test for 5% user cohort"],
      resultMetrics: "Achieved 32% completion rate in pilot cohort with a 22% lift in peer LinkedIn profile shares.",
      modelKeywords: ["user empathy", "drop-off curve", "hypothesis testing", "MVP", "counter-metrics"]
    },
    tags: ["product-sense", "retention", "user-empathy", "case-study"]
  },
  {
    id: "pm-strat-02",
    roleCategory: "product_management",
    subRole: "execution",
    companyTag: "startup_style",
    questionType: "behavioral",
    difficulty: "medium",
    question: "Tell me about a time you had to make a critical feature launch decision with incomplete data and conflicting opinions between sales and engineering.",
    whyThisMatters: "Evaluates prioritization under ambiguity, risk assessment, and decisive leadership.",
    rubric: {
      situationContext: "Sales demanded immediate custom enterprise features while engineering warned of technical debt and stability risks.",
      actionEvidence: ["synthesized core underlying client problem", "negotiated a phased alpha milestone with the client", "established clear rollback success criteria"],
      resultMetrics: "Closed a key enterprise contract on schedule while preserving codebase architecture integrity.",
      modelKeywords: ["ambiguity", "trade-offs", "prioritization", "stakeholder management", "phased rollout"]
    },
    tags: ["leadership", "stakeholders", "prioritization"]
  },

  // =========================================================================
  // 4. BUSINESS & CONSULTING — MANAGEMENT CONSULTING
  // =========================================================================
  {
    id: "consult-01",
    roleCategory: "business_consulting",
    subRole: "management",
    companyTag: "consulting_style",
    questionType: "case_study",
    difficulty: "hard",
    question: "A legacy retail supermarket chain with 300 stores is seeing operating margins shrink by 4% despite steady foot traffic. Structure your approach to diagnose the profitability leak.",
    whyThisMatters: "Tests McKinsey/BCG Profitability Framework: Revenue (Price x Volume) vs Cost (Fixed + Variable), supplier terms, shrinkage, and digital competition.",
    rubric: {
      situationContext: "Foot traffic is stable, meaning revenue volume is preserved — pointing toward cost inflation, product mix shifts, or markdown losses.",
      actionEvidence: ["decomposed profit = Revenue - Cost", "analyzed cost per square foot, supply chain cold-storage inflation, and product wastage", "examined high-margin vs low-margin SKU shift"],
      resultMetrics: "Isolated 60% of leak to perishable category shrink; proposed automated inventory restocking to recover 2.8% margin.",
      modelKeywords: ["profitability framework", "SKU mix", "fixed vs variable costs", "shrinkage", "supply chain"]
    },
    tags: ["consulting", "profitability", "frameworks"]
  },

  // =========================================================================
  // 4. BUSINESS & CONSULTING — CORPORATE FINANCE
  // =========================================================================
  {
    id: "finance-01",
    roleCategory: "business_consulting",
    subRole: "finance",
    companyTag: "consulting_style",
    questionType: "technical",
    difficulty: "hard",
    question: "Walk me through how a ₹100 increase in depreciation expense impacts the Three Financial Statements (Income Statement, Cash Flow, and Balance Sheet).",
    whyThisMatters: "Core investment banking & corporate finance assessment. Tests tax shield mechanics and cross-statement accounting precision.",
    rubric: {
      situationContext: "Standard 30% corporate tax rate assumed.",
      actionEvidence: [
        "Income Statement: Operating Income drops by 100; at 30% tax rate, Net Income drops by 70",
        "Cash Flow Statement: Net Income down 70, but non-cash 100 depreciation added back; Cash from Operations increases by +30",
        "Balance Sheet: Cash increases by +30; PP&E decreases by -100; Assets down by -70, balancing with Retained Earnings down by -70"
      ],
      resultMetrics: "Demonstrates exact balance equation equality (Assets = Liabilities + Equity).",
      modelKeywords: ["depreciation", "tax shield", "cash flow statement", "balance sheet", "net income"]
    },
    tags: ["finance", "accounting", "three-statements"]
  },

  // =========================================================================
  // 5. SALES & BUSINESS DEVELOPMENT — B2B ENTERPRISE SALES
  // =========================================================================
  {
    id: "sales-01",
    roleCategory: "sales_bizdev",
    subRole: "enterprise",
    companyTag: "startup_style",
    questionType: "behavioral",
    difficulty: "medium",
    question: "How do you navigate a B2B sales cycle when your internal champion loves your product, but the CFO steps in late with an unexpected 'no budget' objection?",
    whyThisMatters: "Tests MEDDIC/BANT enterprise sales frameworks, economic buyer alignment, and ROI business case presentation.",
    rubric: {
      situationContext: "Late-stage pipeline block where the technical buyer lacks budgetary authorization.",
      actionEvidence: ["coached champion on internal ROI deck", "quantified payback period and hard operational savings for the CFO", "offered structured deferred billing or phased licensing"],
      resultMetrics: "Successfully obtained CFO sign-off on a ₹18L annual contract within 3 weeks of the initial freeze.",
      modelKeywords: ["economic buyer", "MEDDIC", "ROI business case", "objection handling", "payback period"]
    },
    tags: ["b2b-sales", "meddic", "objection-handling"]
  },

  // =========================================================================
  // 6. CIVIL SERVICES & PUBLIC SECTOR (GOVERNMENT / UPSC PANEL)
  // =========================================================================
  {
    id: "govt-01",
    roleCategory: "civil_services",
    subRole: "governance",
    companyTag: "public_sector",
    questionType: "case_study",
    difficulty: "hard",
    question: "As a District Magistrate, you receive credible intelligence that a religious procession scheduled in 3 hours will trigger communal friction, but political authorities pressure you to allow it without restrictions. How do you resolve this?",
    whyThisMatters: "Evaluates constitutional integrity, public safety prioritization under political pressure, preventive policing, and administrative law.",
    rubric: {
      situationContext: "Conflict between maintaining public peace/law and order versus external executive/political pressure.",
      actionEvidence: ["prioritized public safety and Article 21 constitutional duty", "exercised lawful statutory powers under CrPC/BNSS", "convened urgent peace committee with community leaders", "deployed drone surveillance and route diversions"],
      resultMetrics: "Conducted the event peacefully without casualties or communal escalation while maintaining institutional neutrality.",
      modelKeywords: ["constitutional duty", "law and order", "administrative integrity", "preventive measures", "impartiality"]
    },
    tags: ["upsc", "ethics", "public-administration", "governance"]
  },
  {
    id: "govt-02",
    roleCategory: "civil_services",
    subRole: "ethics",
    companyTag: "public_sector",
    questionType: "behavioral",
    difficulty: "medium",
    question: "You discover that a senior colleague who mentored you has inadvertently approved an irregular procurement tender that violates financial rules. What is your immediate course of action?",
    whyThisMatters: "Tests ethical fortitude, fidelity to public funds, separation of personal loyalty from statutory duty, and whistleblowing protocols.",
    rubric: {
      situationContext: "Personal loyalty to a mentor in direct opposition to public auditing and procurement transparency.",
      actionEvidence: ["reviewed tender documentation objectively against procurement manuals", "privately presented discrepancies to the officer to verify intent", "escalated formally through official vigilance/audit channels when irregularities confirmed"],
      resultMetrics: "Safeguarded public exchequer while adhering strictly to statutory vigilance procedure.",
      modelKeywords: ["probity", "public funds", "whistleblowing", "statutory duty", "vigilance"]
    },
    tags: ["ethics", "probity", "public-funds"]
  }
];

/**
 * Filter and retrieve curated questions with repetition exclusion
 */
export function getCuratedQuestions(options: {
  roleCategory?: string;
  subRole?: string;
  companyTag?: string;
  difficulty?: string;
  excludeIds?: string[];
  limit?: number;
}): CuratedQuestion[] {
  const {
    roleCategory,
    subRole,
    companyTag,
    difficulty,
    excludeIds = [],
    limit = 5,
  } = options;

  const excludeSet = new Set(excludeIds);

  let pool = CURATED_QUESTION_BANK.filter((q) => !excludeSet.has(q.id));

  if (roleCategory && roleCategory !== "all") {
    const roleFiltered = pool.filter((q) => q.roleCategory === roleCategory);
    if (roleFiltered.length > 0) pool = roleFiltered;
  }

  if (subRole && subRole !== "all") {
    const subFiltered = pool.filter((q) => q.subRole === subRole);
    if (subFiltered.length > 0) pool = subFiltered;
  }

  if (companyTag && companyTag !== "all") {
    const tagFiltered = pool.filter((q) => q.companyTag === companyTag);
    if (tagFiltered.length > 0) pool = tagFiltered;
  }

  if (difficulty && difficulty !== "all") {
    const diffFiltered = pool.filter((q) => q.difficulty === difficulty);
    if (diffFiltered.length > 0) pool = diffFiltered;
  }

  // Shuffle
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}
