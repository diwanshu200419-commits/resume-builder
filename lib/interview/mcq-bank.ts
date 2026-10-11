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
  },

  // =========================================================================
  // ADVANCED FRONTEND & REACT 18 / NEXT.JS
  // =========================================================================
  {
    id: "mcq-fe-03",
    roleCategory: "software_engineering",
    subRole: "frontend",
    difficulty: "hard",
    category: "technical",
    scenario: "What is the primary architectural difference between React 18 Server Components (RSC) and traditional Client-Side Hydration (SSR with getInitialProps / getServerSideProps)?",
    options: [
      "Server Components re-render on every state change inside the browser DOM",
      "Server Components zero-out their JavaScript dependencies from the client bundle because they execute exclusively on the server and stream serialized React nodes (JSON-like wire format)",
      "Server Components replace CSS Modules with inline styles automatically",
      "Server Components only support SQLite and cannot execute database queries directly"
    ],
    correctIndex: 1,
    explanation: "React Server Components (RSC) execute exclusively on the server and emit an abstract UI tree representation rather than executable JS bundles. Third-party dependencies used only within Server Components (e.g. markdown parsers, heavy date libraries) are completely excluded from the browser bundle, drastically reducing initial JS payload and TBT.",
    tags: ["react", "nextjs", "rsc", "performance"]
  },
  {
    id: "mcq-fe-04",
    roleCategory: "software_engineering",
    subRole: "frontend",
    difficulty: "medium",
    category: "technical",
    scenario: "Consider the following JavaScript execution: console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); queueMicrotask(() => console.log(4)); console.log(5); In what order are the numbers printed?",
    options: [
      "1, 2, 3, 4, 5",
      "1, 5, 3, 4, 2",
      "1, 5, 2, 3, 4",
      "1, 3, 4, 5, 2"
    ],
    correctIndex: 1,
    explanation: "Synchronous code runs first (1, then 5). Microtasks (Promise.then and queueMicrotask) are drained completely before the event loop moves to the macrotask queue. Thus, microtasks 3 and 4 execute before the setTimeout macrotask callback (2), yielding: 1, 5, 3, 4, 2.",
    tags: ["javascript", "event-loop", "asynchronous"]
  },
  {
    id: "mcq-fe-05",
    roleCategory: "software_engineering",
    subRole: "frontend",
    difficulty: "medium",
    category: "technical",
    scenario: "In a TypeScript project, you have an API response that returns either { status: 'success', data: User } or { status: 'error', error: string }. What is the recommended type-safe pattern to handle both variants without type casting?",
    options: [
      "Cast the response to 'any' and check if response.data is truthy",
      "Use Discriminated Unions where the common literal property 'status' serves as the discriminant tag for narrowing in switch/if blocks",
      "Write a custom RegExp to match error strings in JSON",
      "Convert the object into a TypeScript Enum"
    ],
    correctIndex: 1,
    explanation: "Discriminated Unions (tagged unions) leverage a shared literal property ('status') so TypeScript compiler automatically narrows the object type inside conditional branches (e.g. if (res.status === 'success') guarantees access to res.data without unsafe casts).",
    tags: ["typescript", "type-safety", "architecture"]
  },

  // =========================================================================
  // ADVANCED BACKEND, DATABASES & NODE.JS
  // =========================================================================
  {
    id: "mcq-be-04",
    roleCategory: "software_engineering",
    subRole: "backend",
    difficulty: "hard",
    category: "technical",
    scenario: "A CPU-intensive image compression algorithm running on a Node.js Express server is causing high response latency for lightweight health check and user profile endpoints. What is the root cause and the best resolution?",
    options: [
      "The garbage collector has run out of memory; increase --max-old-space-size to 8GB",
      "The synchronous image processing logic blocks the single-threaded Node.js Event Loop; offload the computation to a Worker Thread pool or asynchronous background worker queue (e.g. BullMQ / Redis)",
      "Express.js cannot handle more than 10 concurrent requests; rewrite in PHP",
      "Switch from HTTP/1.1 to HTTP/2 to allow simultaneous CPU execution"
    ],
    correctIndex: 1,
    explanation: "Because Node.js executes application JavaScript on a single event loop thread, synchronous CPU-bound operations stall all asynchronous I/O callbacks, causing pending connections to buffer and timeout. Offloading heavy CPU work to Worker Threads or external background workers frees the event loop to serve concurrent requests immediately.",
    tags: ["nodejs", "event-loop", "performance", "worker-threads"]
  },
  {
    id: "mcq-be-05",
    roleCategory: "software_engineering",
    subRole: "backend",
    difficulty: "hard",
    category: "technical",
    scenario: "Under PostgreSQL's default READ COMMITTED isolation level, which concurrency phenomenon is prevented, and which phenomenon can still occur within the same transaction?",
    options: [
      "Dirty Reads are prevented; Non-Repeatable Reads and Phantom Reads can still occur",
      "All anomalies including Dirty Reads, Non-Repeatable Reads, and Serialization Failures are fully prevented",
      "Dirty Reads can occur, but Non-Repeatable Reads are prevented",
      "PostgreSQL locks all rows in the entire table preventing concurrent writes"
    ],
    correctIndex: 0,
    explanation: "In READ COMMITTED, transactions only see data committed before the query began (preventing Dirty Reads where uncommitted changes are visible). However, if another transaction commits an update or insert midway, a re-read within the first transaction can see modified values (Non-Repeatable Read) or new matching rows (Phantom Read).",
    tags: ["postgresql", "acid", "transactions", "databases"]
  },
  {
    id: "mcq-be-06",
    roleCategory: "software_engineering",
    subRole: "backend",
    difficulty: "hard",
    category: "system_design",
    scenario: "A hot cache key (e.g. homepage top products) in Redis expires during peak traffic, causing 50,000 concurrent requests to hit the primary relational database simultaneously, crashing the DB. What is this phenomenon called and how is it prevented?",
    options: [
      "Cache Poisoning; resolve by disabling Redis TLS encryption",
      "Cache Stampede (Thundering Herd); resolve using a distributed mutex lock (Singleflight/Mutex) or probabilistic early expiration (XFetch algorithm)",
      "Buffer Overflow; resolve by converting integers to floating point numbers",
      "Memory Leak; resolve by flushing Redis with FLUSHALL every minute"
    ],
    correctIndex: 1,
    explanation: "Cache Stampede occurs when a high-traffic key expires, triggering simultaneous expensive database queries from concurrent workers. Mitigations include distributed mutex locks (allowing only one request to rebuild cache while others await), or background re-computation before TTL expires (probabilistic early refresh).",
    tags: ["redis", "caching", "system-design", "high-availability"]
  },

  // =========================================================================
  // SYSTEM DESIGN, ARCHITECTURE & DEVOPS
  // =========================================================================
  {
    id: "mcq-sd-01",
    roleCategory: "software_engineering",
    subRole: "system_design",
    difficulty: "medium",
    category: "system_design",
    scenario: "According to the CAP theorem in distributed systems, when a network partition (P) occurs between two data centers, what fundamental trade-off must system architects choose between?",
    options: [
      "Speed vs Storage cost",
      "Consistency (C) vs Availability (A) — either return error/stale rejection to ensure data unanimity, or accept writes locally risking split-brain divergence",
      "Security vs Microservices",
      "IPv4 vs IPv6 routing"
    ],
    correctIndex: 1,
    explanation: "Because physical network partitions (loss of communication between nodes) are inevitable in distributed systems, architects must choose whether to sacrifice Availability (returning errors to guarantee every reader receives latest write) or Consistency (permitting isolated nodes to answer reads/writes at the cost of stale or divergent state).",
    tags: ["system-design", "cap-theorem", "distributed-systems"]
  },
  {
    id: "mcq-sd-02",
    roleCategory: "software_engineering",
    subRole: "system_design",
    difficulty: "medium",
    category: "technical",
    scenario: "A payment gateway webhook delivers transaction success notifications. Due to network retries, the webhook URL receives the exact same event payload 4 times over 30 seconds. How should the backend ensure the user's wallet is credited only once?",
    options: [
      "Sleep for 5 seconds before processing each incoming webhook",
      "Implement an Idempotency mechanism with a unique transaction_id constraint in the database, verifying whether the transaction was already processed before applying balance increments",
      "Drop every second webhook automatically based on request count",
      "Store payment events only in client sessionStorage"
    ],
    correctIndex: 1,
    explanation: "Payment webhooks operate on at-least-once delivery guarantees. Ensuring idempotency requires persisting the unique transaction ID with a database UNIQUE constraint or transactional lock, rejecting duplicate processing attempts without failing the HTTP 200 acknowledgement to the gateway.",
    tags: ["payments", "idempotency", "system-design", "security"]
  },
  {
    id: "mcq-devops-01",
    roleCategory: "software_engineering",
    subRole: "devops",
    difficulty: "easy",
    category: "technical",
    scenario: "Why are Docker Multi-Stage Builds considered an industry best practice for compiling and containerizing Next.js or Go applications?",
    options: [
      "They enable running Docker containers on multiple physical laptops simultaneously",
      "They separate the heavyweight build environment (Node.js SDK, npm devDependencies, compilers) from the slim production runtime container, minimizing image size and reducing security attack surface",
      "They bypass Dockerfile syntax validation",
      "They automatically provision cloud Kubernetes clusters on AWS"
    ],
    correctIndex: 1,
    explanation: "Multi-stage builds allow developers to execute 'npm install' and 'next build' within a full builder image, and copy only the compiled static output and production node_modules into a minimal lightweight base (such as alpine or distroless), shrinking image sizes from 1.5GB down to <100MB and stripping compiler vulnerabilities.",
    tags: ["docker", "devops", "containerization", "security"]
  },
  {
    id: "mcq-devops-02",
    roleCategory: "software_engineering",
    subRole: "devops",
    difficulty: "medium",
    category: "system_design",
    scenario: "What is the key functional difference between a Kubernetes Liveness Probe and a Readiness Probe?",
    options: [
      "Liveness probes check network bandwidth; Readiness probes check CPU clock speed",
      "A failing Liveness probe triggers Kubernetes to restart the container; a failing Readiness probe removes the Pod from Service load balancer traffic until it passes without restarting it",
      "Liveness probes only run on dev clusters; Readiness probes only run in production",
      "Readiness probes terminate the entire Kubernetes node"
    ],
    correctIndex: 1,
    explanation: "Liveness probes detect deadlocks or unrecoverable application hangs (restarting the pod to recover). Readiness probes determine if the pod is initialized and ready to accept incoming HTTP traffic (preventing requests from reaching a pod that is still warming up caches or executing DB migrations).",
    tags: ["kubernetes", "devops", "microservices", "reliability"]
  },

  // =========================================================================
  // DATA SCIENCE, AI & PYTHON
  // =========================================================================
  {
    id: "mcq-data-03",
    roleCategory: "data_ai",
    subRole: "python",
    difficulty: "medium",
    category: "technical",
    scenario: "You need to parse and filter a 40GB server log file on a machine with only 8GB of RAM in Python. Which implementation avoids Out-Of-Memory (OOM) termination?",
    options: [
      "Read all lines into a Python list: logs = file.readlines()",
      "Use a Python Generator function with 'yield' to stream line-by-line in O(1) memory overhead",
      "Load the file into a JSON object using json.load()",
      "Multiply RAM capacity using Python's sys.setrecursionlimit()"
    ],
    correctIndex: 1,
    explanation: "Generators produce items lazily on demand via the iterator protocol without materializing the entire sequence in memory. Streaming line-by-line consumes constant O(1) memory regardless of file size, preventing OOM crashes on memory-constrained systems.",
    tags: ["python", "generators", "memory-management", "data-pipelines"]
  },
  {
    id: "mcq-data-04",
    roleCategory: "data_ai",
    subRole: "machine_learning",
    difficulty: "hard",
    category: "technical",
    scenario: "In an enterprise Retrieval-Augmented Generation (RAG) system, why is a two-stage retrieval pipeline (Bi-Encoder Dense Vector Search followed by Cross-Encoder Re-Ranking) preferred over vector search alone?",
    options: [
      "Bi-encoders cannot handle English vocabulary",
      "Dense vector search (Bi-Encoder) quickly retrieves candidate chunks from millions of documents in milliseconds (high recall), while Cross-Encoder accurately models token-level query-document interactions to score top results (high precision)",
      "Cross-encoders run completely without GPUs and consume zero memory",
      "Vector databases delete documents that have not been re-ranked within 24 hours"
    ],
    correctIndex: 1,
    explanation: "Bi-encoders encode queries and documents into separate embeddings (enabling sub-millisecond approximate nearest neighbor search via HNSW), but lose fine-grained token-level cross-attention. Passing the top 20-50 candidates through a Cross-Encoder re-ranker evaluates deep query-document interactions, boosting retrieval precision by up to 25-35%.",
    tags: ["ai", "rag", "embeddings", "vector-search", "llm"]
  },

  // =========================================================================
  // CORE COMPUTER SCIENCE (OS, DBMS, NETWORKS FOR PLACEMENTS)
  // =========================================================================
  {
    id: "mcq-cs-01",
    roleCategory: "software_engineering",
    subRole: "core_cs",
    difficulty: "medium",
    category: "technical",
    scenario: "What causes 'Thrashing' in an Operating System's Virtual Memory management subsystem?",
    options: [
      "The hard drive spindle speed exceeds CPU clock cycle limits",
      "The system spends more time swapping pages into and out of memory than executing actual process CPU instructions due to insufficient physical RAM for active working sets",
      "Two processes simultaneously access the same read-only shared library",
      "The network interface card drops UDP packets during high congestion"
    ],
    correctIndex: 1,
    explanation: "Thrashing occurs when the total memory required by active processes (their working sets) exceeds available physical RAM. The OS continuously encounters page faults and pages data between RAM and swap space, dropping CPU utilization to near zero as processes spend all their time waiting on disk I/O.",
    tags: ["operating-systems", "virtual-memory", "core-cs"]
  },
  {
    id: "mcq-cs-02",
    roleCategory: "software_engineering",
    subRole: "core_cs",
    difficulty: "medium",
    category: "technical",
    scenario: "Why do relational database engines (PostgreSQL, MySQL InnoDB) use B+ Trees rather than standard Binary Search Trees (BST) or Hash Tables as the default index structure?",
    options: [
      "B+ Trees have higher node branch factors (minimizing disk I/O depth) and linked leaf nodes that allow efficient range scans (e.g. BETWEEN, >, <)",
      "Binary Search Trees store only alphanumeric characters and cannot index timestamps",
      "Hash Tables do not work with numerical primary keys",
      "B+ Trees require zero storage space on disk"
    ],
    correctIndex: 0,
    explanation: "B+ Trees have very high fan-out (thousands of keys per node), keeping tree depth small (typically 3-4 levels for millions of rows) and minimizing expensive disk block reads. Crucially, all values reside in linked leaf nodes, enabling fast sequential range queries (WHERE age BETWEEN 20 AND 30) which Hash Tables cannot perform.",
    tags: ["dbms", "b-plus-tree", "indexing", "core-cs"]
  },
  {
    id: "mcq-cs-03",
    roleCategory: "software_engineering",
    subRole: "core_cs",
    difficulty: "medium",
    category: "technical",
    scenario: "During the establishment of a secure HTTPS connection over TCP and TLS 1.3, what is the minimum round-trip time (RTT) overhead required before application data can be transmitted on a resumed session?",
    options: [
      "4 RTTs (2 for TCP handshake and 2 for TLS asymmetric key exchange)",
      "0-RTT (Zero Round-Trip Time) using TLS 1.3 Early Data resumption over an established connection",
      "Always 10 RTTs regardless of protocol version",
      "TCP connections do not require handshakes when HTTPS is enabled"
    ],
    correctIndex: 1,
    explanation: "While a standard fresh connection requires 1 RTT for TCP 3-way handshake and 1 RTT for TLS 1.3 key exchange (total 2 RTTs), TLS 1.3 supports 0-RTT Session Resumption (Early Data) using pre-shared keys (PSK), allowing the client to send HTTP requests in the very first payload flight.",
    tags: ["networking", "tcp", "tls", "core-cs", "performance"]
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
