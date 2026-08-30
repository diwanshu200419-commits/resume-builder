// lib/seo/role-pages.ts
//
// Authoritative, deep, role-specific content hubs for Vaylo AI SEO acquisition.
// Every single role contains 100% unique technical stacks, ATS keywords, Google X-Y-Z bullet formulas, and FAQs.

export interface RolePageData {
  slug: string;
  title: string;
  subtitle: string;
  category: "role" | "degree" | "country";
  targetRole: string;
  metaDescription: string;
  keywords: string[];
  recommendedStructure: string[];
  mustHaveKeywords: string[];
  preferredKeywords: string[];
  exampleBullets: Array<{
    before: string;
    after: string;
    explanation: string;
  }>;
  recruiterFocus: string[];
  commonMistakes: string[];
  faq: Array<{ question: string; answer: string }>;
}

export const ROLE_PAGES_DATA: Record<string, RolePageData> = {
  "software-engineer": {
    slug: "software-engineer",
    title: "Software Engineer Resume & ATS Optimization Guide",
    subtitle: "Master the exact keywords, X-Y-Z bullet formulas, and ATS formatting required for Software Engineering roles at FAANG and top tech companies.",
    category: "role",
    targetRole: "Software Engineer",
    metaDescription: "Build a high-scoring Software Engineer resume. Get top ATS keywords, Google X-Y-Z bullet formulas, and free ATS compatibility checking.",
    keywords: ["software engineer resume", "ATS keywords for software engineer", "software engineer resume template", "FAANG resume guide", "software developer ATS score"],
    recommendedStructure: [
      "Header: Name, Email, Phone, GitHub, LinkedIn, Portfolio URL",
      "Technical Skills Matrix: Languages, Frameworks, Cloud & Databases, Developer Tools",
      "Work Experience: 3-4 bullet points per role using Google X-Y-Z impact formulas",
      "Key Projects: 2 architecture-heavy projects with GitHub & live demo links",
      "Education: Degree, Institution, Graduation Year, Core CS Coursework",
    ],
    mustHaveKeywords: ["React", "TypeScript", "Node.js", "Python", "SQL", "PostgreSQL", "Git", "REST APIs", "Data Structures", "System Design"],
    preferredKeywords: ["Docker", "Kubernetes", "AWS", "Redis", "GraphQL", "CI/CD Pipelines", "Microservices", "Jest / RTL"],
    exampleBullets: [
      {
        before: "Worked on building backend services for web app.",
        after: "Architected 4 high-throughput Node.js microservices handling 150k daily active requests, reducing p99 API latency by 38% with Redis caching.",
        explanation: "Transforms vague duty into quantifiable technical impact using metrics and specific stack keywords.",
      },
      {
        before: "Fixed bugs and wrote unit tests for frontend.",
        after: "Increased frontend test coverage from 45% to 88% using Jest and React Testing Library, preventing 20+ regression bugs per release cycle.",
        explanation: "Quantifies quality impact and names specific industry-standard testing frameworks.",
      },
    ],
    recruiterFocus: [
      "Quantified impact metrics (%, $, scale, users, QPS) in 70%+ of experience bullets",
      "Clear technical stack separation (Languages vs Frameworks vs Cloud Infrastructure)",
      "System design and architectural ownership signals for senior candidates",
    ],
    commonMistakes: [
      "Using multi-column graphic templates that scramble ATS parsers",
      "Listing outdated tools like Microsoft Word or basic HTML without modern frameworks",
      "Writing long paragraphs instead of concise 1-2 line action bullets",
    ],
    faq: [
      {
        question: "How long should a Software Engineer resume be?",
        answer: "A single page is ideal for candidates with under 5 years of experience. Candidates with 6+ years of extensive leadership or multi-company experience can use a clean 2-page format.",
      },
      {
        question: "Should I include my GitHub profile link on my software engineer resume?",
        answer: "Yes, provided your GitHub has active repositories, pinned projects with descriptive READMEs, and clean commit histories demonstrating real code quality.",
      },
    ],
  },

  "data-analyst": {
    slug: "data-analyst",
    title: "Data Analyst Resume Guide & ATS Keywords",
    subtitle: "How to format SQL, Python, Tableau, and business intelligence metrics to pass recruiter screening and ATS filters with top scores.",
    category: "role",
    targetRole: "Data Analyst",
    metaDescription: "Data Analyst resume guide with top ATS keywords (SQL, Power BI, Tableau, Python), quantifiable business impact bullet formulas, and free ATS scanner.",
    keywords: ["data analyst resume", "data analyst ATS keywords", "SQL resume examples", "Power BI resume bullet points", "business intelligence resume"],
    recommendedStructure: [
      "Header: Name, Email, Phone, LinkedIn, Portfolio / Tableau Public / GitHub",
      "Core Competencies: SQL Query Optimization, BI Tools, Statistical Analysis, Data Modeling",
      "Professional Experience: Quantified business impact, revenue driven, and decision enablement",
      "Data Analytics Projects: End-to-end dashboard or statistical pipeline case studies",
      "Education & Certifications: Degree, PL-300 / Google Data Analytics / Tableau Desktop Specialist",
    ],
    mustHaveKeywords: ["SQL", "Python", "Tableau", "Power BI", "Excel", "Data Cleaning", "Data Visualization", "Statistical Analysis", "ETL Pipelines", "Pandas"],
    preferredKeywords: ["Snowflake", "BigQuery", "dbt", "A/B Testing", "Cohort Analysis", "DAX", "Looker", "PostgreSQL"],
    exampleBullets: [
      {
        before: "Created dashboards for sales team using Tableau.",
        after: "Built 6 automated executive Tableau dashboards tracking \$14M in annual recurring revenue, reducing weekly reporting turnaround time by 18 hours.",
        explanation: "Highlights business scale (\$14M) and hours saved through automated dashboard engineering.",
      },
      {
        before: "Wrote SQL queries to extract customer data.",
        after: "Optimized complex multi-table SQL queries across 4.2M transactional records in BigQuery, lowering query compute costs by 34% and cutting runtime from 12m to 45s.",
        explanation: "Shows deep database optimization capability, cost savings, and runtime improvements.",
      },
    ],
    recruiterFocus: [
      "Proven ability to translate raw data into actionable executive decisions and revenue growth",
      "Advanced SQL proficiency (Window functions, CTEs, self-joins, query optimization)",
      "Interactive dashboard links (Tableau Public, Power BI portfolio, or GitHub notebook repos)",
    ],
    commonMistakes: [
      "Listing 'Excel' without specifying advanced features (VLOOKUP, XLOOKUP, Pivot Tables, Power Query)",
      "Focusing only on tools without explaining what business problem the analysis solved",
      "Missing metric outcomes (e.g. churn reduced, revenue unlocked, hours saved)",
    ],
    faq: [
      {
        question: "Do Data Analysts need Python or is SQL + Tableau enough?",
        answer: "SQL and BI tools (Tableau/Power BI) are mandatory for 95% of roles. Python (Pandas/NumPy) elevates your candidacy for Mid/Senior roles and algorithmic data cleaning.",
      },
      {
        question: "How should I showcase data projects if my work is confidential?",
        answer: "Describe the underlying technical methods, data volumes, and percentage improvements without naming sensitive internal proprietary numbers or client names.",
      },
    ],
  },

  "ai-engineer": {
    slug: "ai-engineer",
    title: "AI Engineer & Machine Learning Resume Guide",
    subtitle: "Showcase PyTorch, LLMs, RAG pipelines, fine-tuning, and production model deployments for modern Applied AI and ML Engineering roles.",
    category: "role",
    targetRole: "AI Engineer",
    metaDescription: "Master AI Engineer resume keywords (LLMs, RAG, PyTorch, LangChain, Vector DBs), production ML deployment metrics, and free ATS compatibility score.",
    keywords: ["AI engineer resume", "machine learning resume", "LLM engineer resume ATS", "PyTorch resume bullets", "generative AI resume keywords"],
    recommendedStructure: [
      "Header: Name, Email, Phone, GitHub, Hugging Face, LinkedIn, Google Scholar (if published)",
      "AI/ML Technical Matrix: Frameworks (PyTorch/TensorFlow), LLM Tooling, Vector DBs, Cloud ML",
      "Engineering Experience: Production latency, inference cost reductions, and evaluation metrics",
      "Model Deployments & Research Projects: End-to-end RAG pipelines and open-source models",
      "Education: Computer Science, Mathematics, or Data Science Degree + Research Publications",
    ],
    mustHaveKeywords: ["PyTorch", "Python", "Transformers", "LLMs", "RAG Pipelines", "LangChain", "Vector Databases", "Model Evaluation", "Docker", "REST APIs"],
    preferredKeywords: ["vLLM", "Pinecone", "Qdrant", "Hugging Face", "LoRA / QLoRA", "MLflow", "TensorFlow", "Kubernetes / Triton", "CUDA"],
    exampleBullets: [
      {
        before: "Built a chatbot using OpenAI API and LangChain.",
        after: "Engineered production RAG pipeline using Llama-3, Qdrant vector search, and hybrid retrieval, reducing hallucination rate from 18% to 2.1% across 50,000 internal documents.",
        explanation: "Quantifies accuracy improvement and demonstrates real architecture choices over simple API wrappers.",
      },
      {
        before: "Trained machine learning models on AWS.",
        after: "Fine-tuned 7B parameter open-source LLM using QLoRA on 4x A100 GPUs, reducing token inference latency by 45% while saving \$8.4k in monthly cloud hosting costs via vLLM.",
        explanation: "Demonstrates hardware optimization, latency reduction, and direct infrastructure cost ROI.",
      },
    ],
    recruiterFocus: [
      "Production deployment experience vs toy notebook research projects",
      "Understanding of model evaluation benchmarks (BLEU, ROUGE, LLM-as-a-Judge, latency/throughput)",
      "Proficiency with inference optimization (quantization, caching, batching, GPU utilization)",
    ],
    commonMistakes: [
      "Listing standard Python packages without mentioning LLM/ML architecture specifics",
      "Failing to mention training dataset sizes, token throughput, or validation benchmarks",
      "Treating simple prompt engineering as full AI Engineering",
    ],
    faq: [
      {
        question: "What is the difference between Data Scientist and AI Engineer resumes?",
        answer: "Data Scientists focus on statistical modeling and business insights; AI Engineers focus on deploying, scaling, optimizing, and integrating production deep learning and LLM architectures.",
      },
      {
        question: "Should I include Hugging Face or paper publications on my resume?",
        answer: "Absolutely. Hugging Face model cards, datasets, and arXiv/peer-reviewed publications represent the gold standard of technical proof for AI Engineering recruiters.",
      },
    ],
  },

  "frontend-developer": {
    slug: "frontend-developer",
    title: "Frontend Developer Resume & ATS Keywords Guide",
    subtitle: "Craft a standout Frontend Engineer resume highlighting React, Next.js, TypeScript, Core Web Vitals, and modern state architectures.",
    category: "role",
    targetRole: "Frontend Developer",
    metaDescription: "Frontend Developer resume guide with high-scoring ATS keywords (React, Next.js, TypeScript), Core Web Vitals performance bullets, and free ATS scanner.",
    keywords: ["frontend developer resume", "React developer resume keywords", "Next.js resume examples", "frontend engineer ATS score", "UI engineer resume"],
    recommendedStructure: [
      "Header: Name, Email, Phone, Portfolio URL (Mandatory!), GitHub, LinkedIn",
      "Frontend Skills Matrix: Frameworks, State Management, Styling / UI, Testing, Performance",
      "Work Experience: User conversion gains, performance score improvements, and component architecture",
      "High-Impact Frontend Projects: Live hosted web applications with responsive design",
      "Education: Degree or relevant engineering coursework",
    ],
    mustHaveKeywords: ["React", "Next.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS", "HTML5/CSS3", "REST APIs", "State Management", "Git", "Responsive Design"],
    preferredKeywords: ["Redux Toolkit", "Zustand", "Core Web Vitals", "Jest / React Testing Library", "GraphQL", "Webpack / Vite", "Storybook", "CI/CD"],
    exampleBullets: [
      {
        before: "Redesigned company website using React and CSS.",
        after: "Re-architected core user checkout flow in Next.js 14 and Tailwind CSS, improving Google Lighthouse performance score from 58 to 96 and lifting mobile conversion by 22%.",
        explanation: "Quantifies performance and direct business conversion metrics alongside modern tech stack.",
      },
      {
        before: "Built reusable UI components for team.",
        after: "Created accessible, WCAG 2.2 AA compliant UI component library in Storybook and TypeScript used across 8 engineering teams, accelerating feature delivery by 35%.",
        explanation: "Demonstrates cross-team engineering leverage, accessibility standards, and velocity gains.",
      },
    ],
    recruiterFocus: [
      "Clean, modern live portfolio link showing mobile responsiveness and zero console errors",
      "Evidence of optimizing Core Web Vitals (LCP, FID/INP, CLS) and bundle sizes",
      "Component design systems, accessibility (a11y), and state management mastery",
    ],
    commonMistakes: [
      "Missing a live portfolio link or linking to broken/unresponsive sites",
      "Listing outdated libraries like jQuery or AngularJS without modern React/Vue/Angular",
      "Omitting automated frontend testing frameworks (Jest, Vitest, Cypress, Playwright)",
    ],
    faq: [
      {
        question: "Is a portfolio website necessary for Frontend Developers?",
        answer: "Yes! A live portfolio that proves responsive design, clean typography, and fast performance is the single fastest way to get shortlisted for frontend interviews.",
      },
      {
        question: "How do I show Core Web Vitals improvements on my resume?",
        answer: "State the specific metrics: 'Reduced Largest Contentful Paint (LCP) from 3.8s to 1.2s by implementing Next.js image optimization and route code-splitting.'",
      },
    ],
  },

  "backend-developer": {
    slug: "backend-developer",
    title: "Backend Developer Resume Guide & ATS Keywords",
    subtitle: "Highlight scalable microservices, database query optimization, Redis caching, and robust API architectures for backend engineering roles.",
    category: "role",
    targetRole: "Backend Developer",
    metaDescription: "Backend Developer resume guide with top ATS keywords (Node.js, Go, Python, PostgreSQL, Redis, Docker), high-throughput scaling bullets, and ATS scanner.",
    keywords: ["backend developer resume", "backend engineer ATS keywords", "Node.js backend resume", "PostgreSQL query optimization resume", "microservices resume"],
    recommendedStructure: [
      "Header: Name, Email, Phone, GitHub, LinkedIn, Technical Blog / System Architecture links",
      "Backend Skills: Languages, Databases (SQL & NoSQL), Caching & Queues, Cloud & DevOps",
      "Work Experience: Throughput, QPS, latency reductions, database tuning, and uptime metrics",
      "Distributed Systems Projects: High-concurrency backend services with GitHub source code",
      "Education: Computer Science or related degree",
    ],
    mustHaveKeywords: ["Node.js", "Python", "Go / Golang", "PostgreSQL", "SQL", "Redis", "REST APIs", "Docker", "Database Design", "Git"],
    preferredKeywords: ["Microservices", "Kafka", "RabbitMQ", "Kubernetes", "AWS (EC2, S3, RDS)", "GraphQL", "gRPC", "CI/CD", "Nginx"],
    exampleBullets: [
      {
        before: "Wrote backend APIs for mobile app.",
        after: "Engineered 14 resilient REST and gRPC endpoints in Go and PostgreSQL, handling 2.5M daily requests with 99.98% uptime SLA.",
        explanation: "Quantifies throughput scale, protocol choices, and production reliability metrics.",
      },
      {
        before: "Added caching to database to make queries faster.",
        after: "Implemented distributed Redis cache layer and database index tuning on PostgreSQL tables with 8M+ rows, slashing p99 read latency from 420ms to 28ms.",
        explanation: "Highlights exact database volume and drastic latency reduction metrics.",
      },
    ],
    recruiterFocus: [
      "Experience handling scale (QPS, concurrent connections, database partitioning, caching)",
      "Data consistency, transaction handling (ACID), and distributed system failure modes",
      "Security best practices (OAuth2, JWT, rate limiting, encryption at rest and in transit)",
    ],
    commonMistakes: [
      "Failing to mention database indexing, caching strategies, or API rate limiting",
      "Writing generic descriptions that sound like frontend or fullstack without backend depth",
      "Not specifying scale metrics (e.g. daily active users, requests per second, database row volume)",
    ],
    faq: [
      {
        question: "Should I specialize in one backend language or list multiple?",
        answer: "Demonstrating deep mastery in one core language (e.g. Go, Java, Python, or Node.js) paired with strong database fundamentals is far more effective than shallow familiarity with ten.",
      },
      {
        question: "How do I highlight system design on a 1-page resume?",
        answer: "Use bullet points that describe architecture: 'Architected event-driven ingestion pipeline with Kafka and PostgreSQL, decoupling payment webhooks from order processing.'",
      },
    ],
  },

  "full-stack-developer": {
    slug: "full-stack-developer",
    title: "Full-Stack Developer Resume & ATS Keywords Guide",
    subtitle: "Prove complete end-to-end architectural mastery across modern frontend interfaces, robust backend APIs, and cloud deployments.",
    category: "role",
    targetRole: "Full-Stack Developer",
    metaDescription: "Full-Stack Developer resume guide with high-impact ATS keywords (React, Next.js, Node.js, PostgreSQL, Docker), X-Y-Z bullet formulas, and free ATS scanner.",
    keywords: ["full stack developer resume", "full stack engineer ATS keywords", "MERN stack resume", "Next.js fullstack resume", "full stack developer ATS score"],
    recommendedStructure: [
      "Header: Name, Email, Phone, GitHub, Portfolio URL, LinkedIn",
      "Full-Stack Technical Matrix: Frontend, Backend, Databases, Cloud & DevOps, Testing",
      "Professional Experience: End-to-end features delivered, performance gains, and scale handled",
      "Full-Stack Production Projects: Live web apps demonstrating database, auth, and UI integration",
      "Education: Degree in Computer Science or Software Engineering",
    ],
    mustHaveKeywords: ["React", "Node.js", "TypeScript", "Next.js", "PostgreSQL", "MongoDB", "REST APIs", "Git", "Docker", "Tailwind CSS"],
    preferredKeywords: ["GraphQL", "Redis", "AWS", "CI/CD", "Prisma / Drizzle ORM", "Microservices", "Jest", "Supabase / Firebase"],
    exampleBullets: [
      {
        before: "Built an e-commerce website for client with full stack.",
        after: "Architected end-to-end e-commerce platform using Next.js 14, Node.js, PostgreSQL, and Stripe API, processing \$180K in monthly GMV with zero payment sync failures.",
        explanation: "Proves end-to-end ownership, business revenue scale, and zero-defect payment integration.",
      },
      {
        before: "Improved speed of frontend and backend.",
        after: "Optimized database query indexing in PostgreSQL and implemented React Server Components, cutting full-page load times by 54% across 80,000 monthly visitors.",
        explanation: "Shows technical depth across both database layer and modern React server-side rendering.",
      },
    ],
    recruiterFocus: [
      "Balanced proficiency between responsive UI design and scalable backend database architecture",
      "End-to-end feature ownership from user story to production deployment and monitoring",
      "Pragmatic technology choices that reduce complexity and maintenance overhead",
    ],
    commonMistakes: [
      "Listing 30 tools without clear depth in a coherent core stack (e.g. Next.js + PostgreSQL)",
      "Focusing 90% on frontend without demonstrating backend, database, or API design skills",
      "Missing links to live deployed full-stack applications",
    ],
    faq: [
      {
        question: "What is the best tech stack for a Full-Stack Developer resume in 2026?",
        answer: "TypeScript + React/Next.js on the frontend, Node.js/Go on the backend, and PostgreSQL + Redis in the data layer is the most universally in-demand stack across tech hiring.",
      },
      {
        question: "How do I prove I am not just a junior frontend developer calling myself full-stack?",
        answer: "Highlight backend architecture: custom authentication flows, database schema design, index tuning, transaction locks, and containerized Docker deployments.",
      },
    ],
  },

  "web-developer": {
    slug: "web-developer",
    title: "Web Developer Resume Guide & ATS Keywords",
    subtitle: "Create a modern, high-converting Web Developer resume showcasing responsive web design, JavaScript, performance optimization, and CMS integrations.",
    category: "role",
    targetRole: "Web Developer",
    metaDescription: "Web Developer resume guide with top ATS keywords (HTML5, CSS3, JavaScript, React, WordPress, Web Vitals), portfolio presentation, and free ATS score.",
    keywords: ["web developer resume", "web developer ATS keywords", "HTML CSS JavaScript resume", "responsive web developer resume", "web designer resume"],
    recommendedStructure: [
      "Header: Name, Email, Phone, Live Portfolio Link (Crucial!), GitHub, LinkedIn",
      "Technical Toolkit: HTML5/CSS3, Modern JavaScript, Frameworks, CMS / Jamstack, SEO & Speed",
      "Web Development Experience: Client website launches, conversion improvements, mobile responsiveness",
      "Featured Web Projects: 2-3 live responsive websites with visual portfolio screenshots",
      "Education & Certifications: Web Development Bootcamp, CS Degree, or Google Mobile Web Specialist",
    ],
    mustHaveKeywords: ["HTML5", "CSS3", "JavaScript", "Responsive Design", "React", "WordPress / CMS", "Cross-Browser Compatibility", "Git", "REST APIs", "SEO Basics"],
    preferredKeywords: ["Tailwind CSS", "Next.js", "Bootstrap", "Web Vitals Optimization", "Figma to Code", "Shopify / Liquid", "PHP", "Sass / SCSS"],
    exampleBullets: [
      {
        before: "Created responsive websites for small business clients.",
        after: "Developed 12 mobile-first responsive client websites using modern JavaScript, Tailwind CSS, and headless WordPress, increasing client lead generation by an average of 42%.",
        explanation: "Quantifies output volume (12 sites) and client business conversion impact.",
      },
      {
        before: "Fixed website styling bugs on mobile phones.",
        after: "Standardized cross-browser CSS and optimized image asset pipelines across 5 web properties, ensuring 100% mobile compatibility and cutting bounce rates by 26%.",
        explanation: "Demonstrates cross-browser QA rigor and direct reduction in user bounce rates.",
      },
    ],
    recruiterFocus: [
      "Flawless mobile-first responsive design tested across Chrome, Safari, Firefox, and Edge",
      "Figma / Adobe XD to pixel-perfect code translation accuracy",
      "Web accessibility (a11y), clean semantic HTML markup, and technical on-page SEO",
    ],
    commonMistakes: [
      "Using non-responsive fixed-pixel widths that break on modern mobile viewports",
      "Failing to provide a clickable live portfolio URL showing real client or personal work",
      "Writing generic bullets like 'Designed web pages' without mentioning technologies or outcomes",
    ],
    faq: [
      {
        question: "Is WordPress still relevant for Web Developer resumes?",
        answer: "Yes, especially for agencies, e-commerce, and marketing companies. Highlighting custom theme development, PHP, and headless WordPress with React gives you a major advantage.",
      },
      {
        question: "How do I showcase SEO knowledge as a Web Developer?",
        answer: "Highlight semantic HTML5 tags, JSON-LD structured data implementation, dynamic OpenGraph meta tags, and Lighthouse Core Web Vitals optimization.",
      },
    ],
  },

  "digital-marketer": {
    slug: "digital-marketer",
    title: "Digital Marketer Resume Guide & ATS Keywords",
    subtitle: "Showcase ROI, customer acquisition cost (CAC), SEO traffic growth, paid advertising scale, and conversion rate optimization (CRO) metrics.",
    category: "role",
    targetRole: "Digital Marketer",
    metaDescription: "Digital Marketer resume guide with top ATS keywords (SEO, Google Ads, GA4, Meta Ads, CRO, CAC/LTV), revenue growth bullet formulas, and free ATS scanner.",
    keywords: ["digital marketer resume", "digital marketing ATS keywords", "SEO specialist resume", "growth marketer resume examples", "PPC manager resume"],
    recommendedStructure: [
      "Header: Name, Email, Phone, LinkedIn, Portfolio / Case Study link",
      "Marketing Core Competencies: Performance Marketing (PPC), SEO, Analytics, Content, CRO",
      "Professional Experience: Revenue driven, ROAS, CAC reduction, organic traffic growth",
      "Campaign Case Studies: Major growth campaigns, budget scale managed, and conversion funnels",
      "Certifications: Google Analytics (GA4), Google Ads Search/Display, HubSpot Inbound, Meta Certified",
    ],
    mustHaveKeywords: ["SEO", "Google Ads", "Meta Ads", "Google Analytics 4 (GA4)", "Conversion Rate Optimization (CRO)", "Content Marketing", "Email Marketing", "ROI / ROAS", "A/B Testing", "Customer Acquisition Cost (CAC)"],
    preferredKeywords: ["HubSpot", "Semrush / Ahrefs", "Looker Studio", "SQL Basics", "Marketing Automation", "Lead Generation", "Retargeting Campaigns", "Klaviyo"],
    exampleBullets: [
      {
        before: "Ran Google Ads and Facebook ads for our e-commerce store.",
        after: "Managed \$45K monthly PPC budget across Google Search and Meta Ads, scaling blended ROAS from 2.4x to 4.1x and acquiring 3,800+ new paying customers in 6 months.",
        explanation: "Specifies budget scale (\$45K), ROAS growth (4.1x), and exact customer volume acquired.",
      },
      {
        before: "Did SEO work to get more blog traffic.",
        after: "Executed content cluster and technical SEO strategy using Ahrefs and GA4, growing organic search traffic from 15K to 120K monthly unique visitors (+700%) within 9 months.",
        explanation: "Quantifies organic growth (+700%) and names specific industry-standard SEO tooling.",
      },
    ],
    recruiterFocus: [
      "Hard revenue metrics (ROAS, pipeline value generated, customer lifetime value LTV, CAC)",
      "Experience managing substantial monthly ad spend budgets with documented ROI",
      "Data-driven experimentation mindset (A/B testing, statistical significance, funnel drop-off analysis)",
    ],
    commonMistakes: [
      "Listing marketing buzzwords without backing them up with numbers ($ budget, %, ROAS)",
      "Focusing exclusively on vanity metrics (likes, impressions) instead of qualified leads and revenue",
      "Omitting official certifications (Google Ads, GA4, Meta Blueprint)",
    ],
    faq: [
      {
        question: "What metrics matter most on a Digital Marketing resume?",
        answer: "ROAS (Return on Ad Spend), CAC (Customer Acquisition Cost), Conversion Rate (CVR), Organic Traffic Growth (%), and Total Pipeline Revenue Generated ($/₹).",
      },
      {
        question: "Should I tailor my resume for SEO vs Performance Marketing?",
        answer: "Yes. If applying for an SEO role, lead with organic rankings, technical audits, and content clusters. For PPC roles, lead with ad spend budgets, ROAS, and CAC.",
      },
    ],
  },

  "devops-engineer": {
    slug: "devops-engineer",
    title: "DevOps & Cloud Engineer Resume Guide",
    subtitle: "Master Kubernetes, Docker, Terraform (IaC), AWS/GCP cloud architectures, and automated CI/CD pipeline metrics to land top infrastructure roles.",
    category: "role",
    targetRole: "DevOps Engineer",
    metaDescription: "DevOps Engineer resume guide with high-scoring ATS keywords (Kubernetes, Docker, Terraform, AWS, CI/CD, Prometheus), uptime metrics, and free ATS scanner.",
    keywords: ["devops engineer resume", "cloud engineer ATS keywords", "Kubernetes resume examples", "Terraform resume bullet points", "SRE resume guide"],
    recommendedStructure: [
      "Header: Name, Email, Phone, GitHub, LinkedIn, Cloud Certifications",
      "Infrastructure & Tooling Matrix: Containerization & Orchestration, IaC, CI/CD, Cloud Providers, Observability",
      "Work Experience: Deployment frequency, infrastructure cost savings, MTTR, and 99.99% uptime achievements",
      "Infrastructure Projects: Multi-region cloud clusters and automated zero-downtime pipelines",
      "Certifications: AWS Solutions Architect / CKA (Certified Kubernetes Administrator) / Terraform Associate",
    ],
    mustHaveKeywords: ["Kubernetes", "Docker", "Terraform", "AWS", "CI/CD (GitHub Actions / Jenkins)", "Linux / Bash", "Prometheus", "Grafana", "Git", "Infrastructure as Code (IaC)"],
    preferredKeywords: ["ArgoCD", "Helm", "GCP / Azure", "Ansible", "ELK / Datadog", "Service Mesh (Istio)", "Security / DevSecOps", "Cost Optimization"],
    exampleBullets: [
      {
        before: "Set up CI/CD pipeline using GitHub Actions.",
        after: "Built automated multi-stage GitHub Actions CI/CD pipeline with Docker and Helm, cutting production deployment time from 45 minutes to 4.2 minutes with automated rollbacks.",
        explanation: "Quantifies speed improvement (45m to 4.2m) and automated safety mechanisms.",
      },
      {
        before: "Managed Kubernetes clusters in AWS.",
        after: "Managed 8 production EKS Kubernetes clusters running 200+ microservices; implemented Karpenter auto-scaling and spot instances, saving \$34K annually in AWS compute costs.",
        explanation: "Demonstrates production scale (200+ services) and massive annual cloud cost savings.",
      },
    ],
    recruiterFocus: [
      "Industry certifications (CKA, CKAD, AWS Certified Solutions Architect, HashiCorp Terraform)",
      "Zero-downtime deployment strategies (Canary, Blue/Green) and disaster recovery runbooks",
      "Observability and incident response metrics (MTTD, MTTR, SLIs/SLOs, uptime SLAs)",
    ],
    commonMistakes: [
      "Listing tools without explaining the infrastructure architecture or deployment scale",
      "Omitting cost optimization achievements, which are top priority for engineering leadership",
      "Not specifying monitoring tools (Prometheus, Grafana, Datadog) or security best practices",
    ],
    faq: [
      {
        question: "Which certifications carry the most weight for DevOps resumes?",
        answer: "Certified Kubernetes Administrator (CKA) and AWS Certified Solutions Architect Associate are the two most respected credentials by tech hiring managers.",
      },
      {
        question: "How do I demonstrate security (DevSecOps) on my resume?",
        answer: "Highlight automated container vulnerability scanning (Trivy/Snyk), secrets management (HashiCorp Vault/AWS Secrets Manager), and IAM least-privilege policies.",
      },
    ],
  },

  "fresher": {
    slug: "fresher",
    title: "Fresher & Student Resume Guide (Zero Experience ATS Blueprint)",
    subtitle: "How college students, fresh graduates, and career changers can build a 90%+ ATS resume using capstone projects, coding ranks, and internships.",
    category: "role",
    targetRole: "Fresher / College Graduate",
    metaDescription: "Fresher resume guide for college graduates with zero work experience. Top ATS keywords, project bullet formulas, LeetCode formatting, and free ATS scanner.",
    keywords: ["fresher resume", "student resume ATS keywords", "zero experience resume", "college graduate resume template", "entry level software engineer resume"],
    recommendedStructure: [
      "Header: Name, Email, Phone, GitHub, LinkedIn, Portfolio / LeetCode profile URL",
      "Education: Degree, College / University, Graduation Year, CGPA (if above 7.5/10)",
      "Technical Skills Matrix: Programming Languages, Frameworks, Databases, Core CS Concepts",
      "Key Technical Projects (Top Priority!): 2-3 detailed projects framed with Google X-Y-Z formulas",
      "Achievements & Certifications: Hackathons, competitive coding ratings, open-source PRs",
    ],
    mustHaveKeywords: ["Data Structures & Algorithms", "Python / Java / C++", "JavaScript", "SQL / Databases", "Git / GitHub", "Object-Oriented Programming (OOP)", "REST APIs", "Problem Solving", "Web Development", "Computer Science Fundamentals"],
    preferredKeywords: ["React", "Node.js", "Docker Basics", "PostgreSQL", "MongoDB", "Linux", "Competitive Programming (LeetCode / CodeChef)", "Hackathon Finalist"],
    exampleBullets: [
      {
        before: "Made an e-commerce website using MERN stack for college project.",
        after: "Engineered full-stack e-commerce web app using React, Node.js, and MongoDB; integrated Razorpay payment gateway and JWT auth, supporting 500+ mock transactions in user testing.",
        explanation: "Frames academic project with real production features, payment integration, and test metrics.",
      },
      {
        before: "Solved coding questions on LeetCode.",
        after: "Solved 450+ Data Structures & Algorithms problems across LeetCode and CodeChef (Knight rating / Top 5%), mastering dynamic programming, graphs, and system design fundamentals.",
        explanation: "Quantifies problem-solving consistency, platform rating, and algorithm breadth.",
      },
    ],
    recruiterFocus: [
      "Demonstrated problem-solving ability via high LeetCode/CodeChef ratings and CS fundamentals",
      "Clean, working GitHub projects with descriptive READMEs, demo links, and modern tech stacks",
      "High learning agility, hackathon participation, and eagerness to contribute to production code",
    ],
    commonMistakes: [
      "Listing high school details or hobbies that waste precious single-page resume real estate",
      "Leaving projects without GitHub links or descriptions of the technologies used",
      "Writing 'Fresher looking for opportunities' in the summary instead of highlighting technical skills",
    ],
    faq: [
      {
        question: "Should I include my college CGPA on a fresher resume?",
        answer: "If your CGPA is 7.5/10 (or 3.2/4.0) or higher, definitely include it. If it is lower, focus your resume space on standout projects and coding problem-solving ratings.",
      },
      {
        question: "How many projects should a fresher put on their resume?",
        answer: "2 to 3 high-quality, fully deployed projects with working demo links and clean GitHub repositories are far better than 6 unfinished tutorial clones.",
      },
    ],
  },

  "bca": {
    slug: "bca",
    title: "BCA Graduate Resume Guide & ATS Keywords",
    subtitle: "How BCA students and fresh graduates can highlight full-stack projects, database skills, and DSA to compete with B.Tech graduates for top tech jobs.",
    category: "degree",
    targetRole: "BCA Graduate",
    metaDescription: "BCA graduate resume guide with top ATS keywords, project showcase formulas, MCA vs job strategies, and free ATS compatibility checking.",
    keywords: ["BCA resume", "BCA fresher resume format", "BCA computer science resume", "BCA job ATS keywords", "BCA developer resume"],
    recommendedStructure: [
      "Header: Name, Email, Phone, GitHub, LinkedIn, Portfolio / LeetCode",
      "Technical Skills Matrix: Core Programming, Web Technologies, Databases, Tools",
      "Major Capstone Projects: 2-3 production-ready full-stack projects with live demo links",
      "Education: Bachelor of Computer Applications (BCA), College Name, Graduation Year, Score",
      "Certifications & Hackathons: Full-Stack Web Development, Cloud Foundations, Coding Contests",
    ],
    mustHaveKeywords: ["Java / Python / C++", "JavaScript", "React", "Node.js", "SQL / MySQL", "Database Management (DBMS)", "Data Structures", "OOP Concepts", "Git", "REST APIs"],
    preferredKeywords: ["MongoDB", "PostgreSQL", "Tailwind CSS", "Docker Basics", "Linux", "LeetCode Rating", "Full-Stack Development"],
    exampleBullets: [
      {
        before: "Created student management system in Java for final semester.",
        after: "Developed Java and MySQL student management system with role-based access control and automated report generation, reducing manual registration time by 75%.",
        explanation: "Highlights business outcome, role security, and database integration.",
      },
    ],
    recruiterFocus: [
      "Hands-on coding capability backed by active GitHub repositories and live deployments",
      "Strong grasp of core Computer Science fundamentals (OOP, DBMS, OS, Data Structures)",
    ],
    commonMistakes: [
      "Relying solely on basic college syllabus projects like simple calculators",
      "Failing to learn modern frameworks like React or Node.js alongside core Java/C++",
    ],
    faq: [
      {
        question: "Can a BCA graduate get a high-paying software engineering job without MCA?",
        answer: "Yes! Top product companies and startups prioritize real coding skills, problem-solving ratings, and portfolio projects over degree titles.",
      },
    ],
  },

  "mca": {
    slug: "mca",
    title: "MCA Graduate Resume Guide & ATS Keywords",
    subtitle: "Leverage advanced software engineering, distributed databases, and system design to target Senior/Mid-level engineering packages.",
    category: "degree",
    targetRole: "MCA Graduate",
    metaDescription: "MCA graduate resume guide with top ATS keywords (System Design, Cloud, Advanced DSA, Full-Stack), package optimization tips, and free ATS checker.",
    keywords: ["MCA resume", "MCA fresher resume", "MCA developer ATS keywords", "MCA software engineer resume", "master of computer applications resume"],
    recommendedStructure: [
      "Header: Name, Email, Phone, GitHub, LinkedIn, Portfolio",
      "Advanced Skills Matrix: Backend Architecture, Databases, Cloud, Machine Learning / AI",
      "Engineering Projects & Internships: Full-stack applications with scalable architecture",
      "Education: Master of Computer Applications (MCA) & BCA/B.Sc. details",
      "Certifications: AWS / Azure, Advanced Java / Python, System Design",
    ],
    mustHaveKeywords: ["System Design", "Java / Python / Go", "Microservices", "PostgreSQL / MongoDB", "Docker", "Data Structures & Algorithms", "REST & GraphQL APIs", "Git", "Cloud Computing"],
    preferredKeywords: ["Kubernetes", "Redis", "Kafka", "AWS", "CI/CD", "Machine Learning Basics"],
    exampleBullets: [
      {
        before: "Built a hospital management portal using PHP and MySQL.",
        after: "Architected microservices-based healthcare portal in Node.js and PostgreSQL with Redis session caching and JWT auth, handling 10,000+ mock patient records.",
        explanation: "Upgrades academic project to modern scalable architecture.",
      },
    ],
    recruiterFocus: [
      "System design understanding and advanced architectural choices",
      "Readiness for immediate Day-1 production contribution without extensive training",
    ],
    commonMistakes: [
      "Repeating basic undergraduate projects instead of advanced scalable software",
      "Not highlighting internship experience or real client work",
    ],
    faq: [
      {
        question: "How should MCA freshers differentiate themselves from B.Tech freshers?",
        answer: "Highlight deeper database architecture, advanced project scale, system design principles, and production internship experience.",
      },
    ],
  },

  "btech": {
    slug: "btech",
    title: "B.Tech Computer Science Resume Guide & ATS Keywords",
    subtitle: "Tailor your B.Tech CSE resume for campus placements, FAANG off-campus drives, and top tech startups with high-scoring ATS templates.",
    category: "degree",
    targetRole: "B.Tech CSE Graduate",
    metaDescription: "B.Tech CSE resume guide for campus placements and off-campus tech drives. Top ATS keywords, FAANG project formulas, and free ATS score checker.",
    keywords: ["BTech resume", "BTech CSE resume format", "campus placement resume", "BTech fresher resume ATS", "computer science engineering resume"],
    recommendedStructure: [
      "Header: Name, Email, Phone, GitHub, LinkedIn, Portfolio, LeetCode / Codeforces handle",
      "Education: B.Tech in Computer Science / IT, College Name, CGPA, Year of Passing",
      "Technical Skills: Languages (C++, Java, Python), Web/Mobile, Core CS, Cloud & Tools",
      "Major Projects: 2-3 complex projects with GitHub repositories and live URLs",
      "Internships / Work Experience: Technical contributions and metrics achieved",
      "Achievements & Coding Ranks: Competitive programming ratings, Hackathons, IEEE papers",
    ],
    mustHaveKeywords: ["Data Structures & Algorithms", "C++ / Java / Python", "Object-Oriented Programming (OOP)", "Operating Systems", "Computer Networks", "DBMS & SQL", "Git / GitHub", "Web Development", "Problem Solving"],
    preferredKeywords: ["React", "Node.js", "Docker", "AWS / Cloud", "Machine Learning", "LeetCode 300+", "Smart India Hackathon Finalist"],
    exampleBullets: [
      {
        before: "Did software engineering internship at startup.",
        after: "Completed 3-month SWE internship; optimized React UI rendering and built 4 REST APIs in Django, reducing server response times by 30% for 12,000 active users.",
        explanation: "Quantifies internship impact and specifies dual frontend/backend contributions.",
      },
    ],
    recruiterFocus: [
      "High competitive coding ratings (LeetCode, Codeforces, CodeChef) for Day-1 screening",
      "Core CS engineering depth across Operating Systems, Networks, DBMS, and Algorithms",
    ],
    commonMistakes: [
      "Cluttering the resume with non-technical college event organizing unless showing leadership",
      "Listing 8 programming languages without demonstrating real problem-solving mastery in one",
    ],
    faq: [
      {
        question: "What ATS score should I target for off-campus FAANG applications?",
        answer: "Aim for an ATS score of 85%+ on Vaylo AI, ensuring exact matching of hard technical skills and Google X-Y-Z formatted project bullet points.",
      },
    ],
  },

  "usa": {
    slug: "usa",
    title: "US Tech Resume Guide & ATS Formatting Standards",
    subtitle: "Format your resume for the United States tech job market, US tech recruiters, and Silicon Valley ATS screening compliance.",
    category: "country",
    targetRole: "US Tech Job Candidate",
    metaDescription: "US tech resume guide and ATS standards. Learn strict US resume formatting rules (no photos, 1-page rule, privacy laws, H1B/OPT context), and free ATS score.",
    keywords: ["US resume format", "US tech resume ATS", "Silicon Valley resume template", "USA resume rules", "H1B resume guide"],
    recommendedStructure: [
      "Header: Full Name, City & State (e.g. San Francisco, CA), Phone (+1), Email, LinkedIn, GitHub, Portfolio",
      "Summary (Optional): 2-line executive overview of domain expertise and impact",
      "Technical Skills Matrix: Categorized cleanly by Languages, Frameworks, Cloud, Databases",
      "Work Experience: Reverse-chronological action-impact bullets using Google X-Y-Z formula",
      "Education: Degree, University Name, Location, Graduation Date",
    ],
    mustHaveKeywords: ["US Work Authorization (Citizen / Green Card / OPT / H1-B)", "Quantified Business Impact ($/%)", "System Design", "Cloud Infrastructure (AWS/GCP/Azure)", "Agile / Scrum", "Microservices", "Git", "Scalability"],
    preferredKeywords: ["Kubernetes", "CI/CD", "Distributed Systems", "Cross-Functional Leadership", "SOC2 / HIPAA Compliance"],
    exampleBullets: [
      {
        before: "Managed cloud servers and databases for client projects.",
        after: "Spearheaded migration of legacy monolith to AWS microservices architecture (ECS, Aurora, Redis), reducing cloud infrastructure spend by \$62K/year with zero downtime.",
        explanation: "Uses US dollar metric and clear architectural migration terminology.",
      },
    ],
    recruiterFocus: [
      "Strict compliance with US Equal Employment Opportunity (EEO) norms: ZERO photos, marital status, age, or personal identifying data",
      "Measurable business revenue, dollar efficiency, and scale metrics in every role",
    ],
    commonMistakes: [
      "Including a headshot photo or date of birth (instant rejection in the US due to EEO liability)",
      "Exceeding 1 page for professionals with under 7 years of work experience",
      "Listing domestic address without US standard phone and city/state formatting",
    ],
    faq: [
      {
        question: "Can I include a photo on a US resume?",
        answer: "No! Never include a photo, age, marital status, or nationality on a US resume. US companies discard resumes with photos to avoid discrimination lawsuits.",
      },
      {
        question: "How should international or H1B/OPT candidates mention work authorization?",
        answer: "Add a clean 1-line note under your contact header: 'Work Authorization: US Citizen / Permanent Resident / STEM OPT / H-1B Transfer Ready'.",
      },
    ],
  },

  "germany": {
    slug: "germany",
    title: "Germany Tech Resume Guide (Lebenslauf for Tech & EU Blue Card)",
    subtitle: "Navigate German tech hiring standards, English-speaking Berlin/Munich startup norms, and EU Blue Card sponsorship requirements.",
    category: "country",
    targetRole: "Germany Tech Job Candidate",
    metaDescription: "Germany tech resume guide (Lebenslauf). Learn German tech market standards, English-speaking startup CV rules, EU Blue Card tips, and free ATS scanner.",
    keywords: ["Germany tech resume", "Lebenslauf for software engineer", "Berlin tech jobs CV", "EU Blue Card resume", "Germany IT resume ATS"],
    recommendedStructure: [
      "Header: Name, City & Country (e.g. Berlin, Germany), Email, Phone (+49), LinkedIn, GitHub, Portfolio",
      "Professional Profile: 2-3 sentences highlighting tech stack and European work authorization status",
      "Work Experience: Reverse-chronological detailed technical contributions and project scope",
      "Technical Skills Matrix: Categorized clearly with proficiency levels",
      "Education & Degree Recognition: University Degree, Anabin database status if applicable",
      "Languages: English (Fluent/C1), German (A1/B1/B2/Fluent if applicable)",
    ],
    mustHaveKeywords: ["English (Fluent / Professional)", "German (Level indicated)", "EU Work Authorization / Blue Card Eligible", "Clean Architecture", "Unit Testing & QA", "CI/CD", "Docker / Cloud", "Agile / Scrum"],
    preferredKeywords: ["GDPR Compliance", "TypeScript", "Go / Java", "Kubernetes", "PostgreSQL", "Open Source Contributions"],
    exampleBullets: [
      {
        before: "Worked on customer portal and fixed bugs.",
        after: "Engineered GDPR-compliant user data deletion service in TypeScript and Node.js, ensuring 100% regulatory compliance for 450,000 European active users.",
        explanation: "Highlights European GDPR compliance standard and active user scale.",
      },
    ],
    recruiterFocus: [
      "Clear visa/residency status (EU Citizen, Blue Card eligible, German resident)",
      "Language proficiencies specified with CEFR levels (e.g. English C1, German B1)",
      "High software quality, automated test coverage, and documentation standards",
    ],
    commonMistakes: [
      "Confusing traditional German academic CVs (with photos) with modern Berlin tech startup standards (where clean 1-2 page English CVs without photos are preferred)",
      "Omitting language levels (recruiters need to know if German is required for client communication)",
    ],
    faq: [
      {
        question: "Can I get a software developer job in Germany without speaking German?",
        answer: "Yes! Hundreds of tech companies in Berlin, Munich, Hamburg, and Frankfurt operate entirely in English. Marking your English as 'Fluent / Professional (C1/C2)' is key.",
      },
      {
        question: "What is an Anabin check for the EU Blue Card?",
        answer: "The Anabin database verifies foreign university degrees for German visa equivalence. Mentioning 'Degree Anabin H+ Recognized' on your resume speeds up recruiter sponsorship checks.",
      },
    ],
  },
};

export function getRolePageBySlug(slug: string): RolePageData | undefined {
  return ROLE_PAGES_DATA[slug];
}
