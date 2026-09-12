// lib/interview/mcq-bank.ts
//
// VayloAI — Curated MCQ Practice Bank
// Tests core technical concepts, situational judgment, and best next action scenarios.

export interface MCQQuestion {
  id: string;
  roleCategory: "software_engineering" | "data_ai" | "product_management" | "business_consulting" | "sales_bizdev" | "civil_services";
  subRole: string;
  difficulty: "easy" | "medium" | "hard";
  category: "technical" | "situational" | "system_design";
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  tags: string[];
}

export const MCQ_QUESTION_BANK: MCQQuestion[] = [
  // =========================================================================
  // SOFTWARE ENGINEERING — FRONTEND & REACT
  // =========================================================================
  {
    id: "mcq-fe-01",
    roleCategory: "software_engineering",
    subRole: "frontend",
    difficulty: "medium",
    category: "technical",
    scenario: "In a Next.js 14 App Router application, you have a client component displaying a live chart that re-renders every second. Subordinate form inputs on the same page lag noticeably when the user types. What is the most effective architectural fix?",
    options: [
      "Wrap the entire page component inside React.memo()",
      "Isolate the live chart state into its own leaf component and use useTransition for non-urgent input updates",
      "Switch the entire page to a Server Component with revalidate = 1",
      "Store the input value directly in localStorage instead of React component state"
    ],
    correctIndex: 1,
    explanation: "Isolating high-frequency state to a self-contained leaf component prevents re-rendering parent and sibling tree branches. useTransition allows React to prioritize keyboard typing updates over chart re-renders, eliminating input latency.",
    tags: ["react", "nextjs", "performance", "rendering"]
  },
  {
    id: "mcq-fe-02",
    roleCategory: "software_engineering",
    subRole: "frontend",
    difficulty: "easy",
    category: "technical",
    scenario: "Which HTTP header and configuration best ensures that static JavaScript bundles are aggressively cached by browsers while ensuring instant cache invalidation upon a new deployment?",
    options: [
      "Cache-Control: no-cache, no-store, must-revalidate",
      "Cache-Control: public, max-age=31536000, immutable with content-hashed filenames",
      "ETag header only without Cache-Control",
      "Cache-Control: public, max-age=3600 with fixed filenames"
    ],
    correctIndex: 1,
    explanation: "Content-hashed filenames (e.g. app.[hash].js) ensure that newly deployed code receives a unique URL. This allows setting Cache-Control: max-age=31536000, immutable so browsers cache the asset indefinitely without round-trip revalidations.",
    tags: ["caching", "http", "performance"]
  },

  // =========================================================================
  // SOFTWARE ENGINEERING — BACKEND & DATABASES
  // =========================================================================
  {
    id: "mcq-be-01",
    roleCategory: "software_engineering",
    subRole: "backend",
    difficulty: "medium",
    category: "technical",
    scenario: "A PostgreSQL query filtering on 'status = active' and ordering by 'created_at DESC' on a 10M-row orders table takes 3.8s. An EXPLAIN ANALYZE shows an explicit Sort step consuming 90% of execution time. What index addresses this?",
    options: [
      "CREATE INDEX idx_orders_status ON orders(status);",
      "CREATE INDEX idx_orders_status_created ON orders(status, created_at DESC);",
      "CREATE INDEX idx_orders_created ON orders(created_at DESC);",
      "CREATE HASH INDEX idx_orders_composite ON orders(status, created_at);"
    ],
    correctIndex: 1,
    explanation: "A composite B-tree index on (status, created_at DESC) allows the database engine to find active rows and read them in already-sorted order in a single index scan, completely eliminating the expensive in-memory/disk Sort node.",
    tags: ["sql", "postgresql", "indexing", "performance"]
  },
  {
    id: "mcq-be-02",
    roleCategory: "software_engineering",
    subRole: "backend",
    difficulty: "hard",
    category: "system_design",
    scenario: "You are designing a distributed rate limiter for an API handling 200,000 requests/sec across 50 container instances. Which Redis data structure and algorithm provides atomic precision with minimal memory overhead?",
    options: [
      "Redis Sorted Set (ZSET) storing timestamps with ZREMRANGEBYSCORE",
      "Generic String GET and SET with in-application sleep loop",
      "Redis Token Bucket implemented via Lua script using HSET/EVAL",
      "Redis PUB/SUB broadcasting every incoming request"
    ],
    correctIndex: 2,
    explanation: "A Lua script implementing a Token Bucket algorithm executes atomically in Redis single-threaded engine, avoiding race conditions. Unlike sliding window ZSETs which store a member per request (causing huge RAM bloat at 200k req/s), token buckets require only two integer fields (tokens, last_refill_timestamp).",
    tags: ["redis", "rate-limiting", "distributed-systems"]
  },
  {
    id: "mcq-be-03",
    roleCategory: "software_engineering",
    subRole: "backend",
    difficulty: "medium",
    category: "situational",
    scenario: "During a major holiday sale, your primary database reaches 98% CPU utilization and incoming API requests begin timing out with HTTP 504. What is your best immediate first mitigation step?",
    options: [
      "Immediately begin sharding the database across multiple physical servers",
      "Activate a database read-replica or Redis caching for read queries, and rate-limit non-critical search endpoints",
      "Restart the database instance to clear active memory and connections",
      "Drop historical transaction tables to free up disk space"
    ],
    correctIndex: 1,
    explanation: "In an active incident, sharding is too risky and complex, while restarting the DB will cause complete downtime and a connection stampede upon reboot. Diverting read traffic to replicas/cache and shedding non-essential load relieves CPU instantly.",
    tags: ["incident-response", "sre", "troubleshooting"]
  },

  // =========================================================================
  // DATA & AI — ANALYTICS & MACHINE LEARNING
  // =========================================================================
  {
    id: "mcq-data-01",
    roleCategory: "data_ai",
    subRole: "analytics",
    difficulty: "medium",
    category: "technical",
    scenario: "In SQL, what is the key difference between ROW_NUMBER(), RANK(), and DENSE_RANK() when ordering values that contain exact ties (e.g. scores 100, 90, 90, 80)?",
    options: [
      "ROW_NUMBER assigns unique sequential integers (1,2,3,4); RANK leaves gaps after ties (1,2,2,4); DENSE_RANK leaves no gaps (1,2,2,3)",
      "ROW_NUMBER skips numbers on ties; RANK assigns random order; DENSE_RANK averages the tie values",
      "DENSE_RANK leaves gaps after ties, while RANK assigns unique integers",
      "All three window functions behave identically in PostgreSQL and MySQL"
    ],
    correctIndex: 0,
    explanation: "ROW_NUMBER() guarantees distinct sequence (1,2,3,4). RANK() ties matching values but skips subsequent numbers to reflect count (1,2,2,4). DENSE_RANK() ties matching values without skipping rank increments (1,2,2,3).",
    tags: ["sql", "window-functions", "analytics"]
  },
  {
    id: "mcq-data-02",
    roleCategory: "data_ai",
    subRole: "machine_learning",
    difficulty: "hard",
    category: "technical",
    scenario: "You train a classification model on an imbalanced fraud dataset (99.5% legitimate transactions, 0.5% fraud). The model achieves 99.5% accuracy but catches 0% of fraud cases. Which metric must you optimize instead?",
    options: [
      "Mean Squared Error (MSE)",
      "Precision-Recall AUC (PR-AUC) and F1-Score (or F2-Score focusing on Recall)",
      "R-Squared (Coefficient of Determination)",
      "Increase accuracy to 99.9% by training for 100 more epochs"
    ],
    correctIndex: 1,
    explanation: "Accuracy is completely misleading on severely imbalanced datasets because a trivial model predicting 'legitimate' 100% of the time scores 99.5% accuracy. PR-AUC and F-Beta (Recall) evaluate true positive detection among rare minority instances.",
    tags: ["machine-learning", "metrics", "imbalanced-data"]
  },

  // =========================================================================
  // PRODUCT MANAGEMENT — STRATEGY & METRICS
  // =========================================================================
  {
    id: "mcq-pm-01",
    roleCategory: "product_management",
    subRole: "strategy",
    difficulty: "medium",
    category: "situational",
    scenario: "You run an A/B test on a new sign-up flow. The test variant shows a statistically significant 15% increase in signups (p < 0.01), but day-7 retention drops by 20%. What is your recommended product decision?",
    options: [
      "Launch variant immediately because top-of-funnel user growth is the North Star metric",
      "Do not ship to 100%; analyze whether the variant introduced low-intent users or obscured value clarity, causing downstream churn",
      "Extend the test for 6 months without taking action",
      "Remove day-7 retention from the dashboard to highlight signup victory"
    ],
    correctIndex: 1,
    explanation: "Optimizing top-of-funnel signups at the cost of retention creates a leaky bucket. Downstream retention is almost always the true driver of enterprise value; shipping a flow that destroys 20% of cohort retention reduces long-term LTV.",
    tags: ["ab-testing", "retention", "metrics"]
  },

  // =========================================================================
  // BUSINESS & CONSULTING — STRATEGY
  // =========================================================================
  {
    id: "mcq-consult-01",
    roleCategory: "business_consulting",
    subRole: "management",
    difficulty: "medium",
    category: "situational",
    scenario: "A client company wants to enter an adjacent B2B SaaS market. Their core advantage is an established enterprise sales team, but they have zero engineering experience in the new domain. Which market entry mode provides the lowest risk-adjusted time-to-market?",
    options: [
      "Build the product completely in-house from scratch over 3 years",
      "Strategic acquisition of a small product-market-fit startup or white-label partnership, distribution-led",
      "Exit their current business and pivot entirely to the new market",
      "Run aggressive TV and billboard marketing before building any product"
    ],
    correctIndex: 1,
    explanation: "When distribution is your primary asset and technical R&D is your core vulnerability, acquiring an existing product-market-fit solution or establishing an OEM/white-label partnership leverages your sales force immediately while avoiding 2-3 years of unproven engineering risk.",
    tags: ["consulting", "market-entry", "strategy"]
  },

  // =========================================================================
  // CIVIL SERVICES & GOVERNANCE — ADMINISTRATIVE INTEGRITY
  // =========================================================================
  {
    id: "mcq-govt-01",
    roleCategory: "civil_services",
    subRole: "governance",
    difficulty: "medium",
    category: "situational",
    scenario: "An essential public health relief supply truck is blocked at a district border due to a minor bureaucratic permit typo. Hospital patients in your jurisdiction require these medicines within hours. What should the presiding administrative officer do?",
    options: [
      "Turn the truck around and require a 5-day formal re-application process to maintain rigid documentation",
      "Grant provisional provisional clearance under emergency administrative powers, record an official transit memo, and verify documentation concurrently",
      "Instruct field staff to ignore the situation so personal responsibility is avoided",
      "Privately accept an informal cash fee from the driver to speed up clearance"
    ],
    correctIndex: 1,
    explanation: "Public administration balances rule of law with public welfare and life-safety. In life-critical emergencies, administrative law empowers officers to grant conditional/provisional entry with recorded memos, ensuring public health needs are met without compromising official auditability.",
    tags: ["ethics", "governance", "public-welfare"]
  }
];

export function getMCQQuestions(options: {
  roleCategory?: string;
  difficulty?: string;
  category?: string;
  excludeIds?: string[];
  limit?: number;
}): MCQQuestion[] {
  const {
    roleCategory,
    difficulty,
    category,
    excludeIds = [],
    limit = 5,
  } = options;

  const excludeSet = new Set(excludeIds);
  let pool = MCQ_QUESTION_BANK.filter((q) => !excludeSet.has(q.id));

  if (roleCategory && roleCategory !== "all") {
    const rFiltered = pool.filter((q) => q.roleCategory === roleCategory);
    if (rFiltered.length > 0) pool = rFiltered;
  }

  if (difficulty && difficulty !== "all") {
    const dFiltered = pool.filter((q) => q.difficulty === difficulty);
    if (dFiltered.length > 0) pool = dFiltered;
  }

  if (category && category !== "all") {
    const cFiltered = pool.filter((q) => q.category === category);
    if (cFiltered.length > 0) pool = cFiltered;
  }

  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, limit);
}
