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
    keywords: ["software engineer resume", "ATS keywords for software engineer", "full stack developer resume", "FAANG resume template", "software engineer resume bullet points"],
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
        question: "What ATS score should a Software Engineer target?",
        answer: "Software Engineers should aim for an ATS score of 80% or higher to ensure their resume passes automated screening filters at top tech companies.",
      },
      {
        question: "Should I include a summary section on a Software Engineering resume?",
        answer: "A 2-3 sentence technical summary is beneficial if tailored to the target role's core stack (e.g., Senior Full-Stack Engineer specializing in React & Distributed Systems).",
      },
    ],
  },

  "frontend-developer": {
    slug: "frontend-developer",
    title: "Frontend Developer Resume & ATS Keyword Guide",
    subtitle: "Format your Frontend Engineering resume to highlight modern UI frameworks, Core Web Vitals, state management, and responsive design.",
    category: "role",
    targetRole: "Frontend Developer",
    metaDescription: "Optimize your Frontend Developer resume for ATS filters. Get top keywords for React, Next.js, TypeScript, Core Web Vitals, and responsive UI.",
    keywords: ["frontend developer resume", "React developer resume", "Next.js resume keywords", "frontend ATS resume", "UI developer bullet points"],
    recommendedStructure: [
      "Header: Name, Email, GitHub, Portfolio URL (Critical for Frontend Roles)",
      "Technical Skills: UI Frameworks, State Management, Styling, Testing, Web Vitals",
      "Work Experience: Performance metrics, UI component libraries, accessibility",
      "Featured Projects: Live web apps with responsive mobile previews and code links",
      "Education & Frontend Certifications",
    ],
    mustHaveKeywords: ["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "HTML5 / CSS3", "TailwindCSS", "Redux / Zustand", "REST APIs"],
    preferredKeywords: ["Core Web Vitals", "GraphQL", "Web Accessibility (WCAG)", "Jest / Cypress", "Webpack / Vite", "Storybook", "SSR / SSG"],
    exampleBullets: [
      {
        before: "Built responsive frontend pages using React.",
        after: "Engineered 12+ responsive Next.js pages using TypeScript and TailwindCSS, improving Largest Contentful Paint (LCP) from 3.8s to 1.1s.",
        explanation: "Highlights Core Web Vitals performance benchmarks and exact tech stack.",
      },
    ],
    recruiterFocus: [
      "Portfolio link showcasing live, fast-loading, mobile-responsive web applications",
      "Proficiency in modern TypeScript and component-based state management",
      "Experience optimizing web performance and accessibility (WCAG 2.2 AA)",
    ],
    commonMistakes: [
      "Omitting a live portfolio link or GitHub repository link",
      "Failing to mention modern React patterns (hooks, SSR, server components)",
      "Overloading on generic design terms without mentioning frontend code frameworks",
    ],
    faq: [
      {
        question: "Is Next.js required for Frontend Developer resumes in 2026?",
        answer: "Yes, Next.js and React server components are highly requested by 75%+ of tech employers for production web applications.",
      },
    ],
  },

  "backend-developer": {
    slug: "backend-developer",
    title: "Backend Developer Resume & System Architecture Guide",
    subtitle: "Optimize your Backend Engineering resume for ATS filters with keywords for microservices, database indexing, API security, and cloud scalability.",
    category: "role",
    targetRole: "Backend Developer",
    metaDescription: "Build a high-scoring Backend Developer resume. Top ATS keywords for Node.js, Python, Go, PostgreSQL, Docker, Redis, and microservices.",
    keywords: ["backend developer resume", "Node.js developer resume", "Python backend resume", "database indexing resume", "backend ATS keywords"],
    recommendedStructure: [
      "Header: Name, Email, GitHub, LinkedIn",
      "Technical Skills: Languages, Databases, Cloud & DevOps, Message Queues, Testing",
      "Experience: API throughput, latency reduction, database query optimization, security",
      "System Design Projects: Distributed systems, rate limiters, payment integrations",
      "Education: Computer Science or related degree",
    ],
    mustHaveKeywords: ["Node.js", "Python", "Go", "PostgreSQL", "MongoDB", "Redis", "RESTful APIs", "Docker", "SQL Optimization"],
    preferredKeywords: ["Kubernetes", "gRPC", "Apache Kafka", "AWS S3 / EC2", "CI/CD", "RabbitMQ", "Microservices Architecture", "OAuth 2.0 / JWT"],
    exampleBullets: [
      {
        before: "Created database queries and backend endpoints.",
        after: "Optimized PostgreSQL indexes and query execution plans, cutting p99 query latency by 45% for 2M daily API transactions.",
        explanation: "Demonstrates database expertise and quantitative performance gains.",
      },
    ],
    recruiterFocus: [
      "Demonstrated ability to write scalable, thread-safe, resilient backend services",
      "Hands-on database tuning, caching strategies, and data schema design",
      "Clear metrics showing high throughput (QPS), low latency (ms), and cost efficiency",
    ],
    commonMistakes: [
      "Focusing only on CRUD operations without mentioning scale or optimization",
      "Omitting containerization tools like Docker and Kubernetes",
    ],
    faq: [
      {
        question: "What databases should I feature on a Backend Developer resume?",
        answer: "Feature at least one major relational database (PostgreSQL/MySQL) and one NoSQL/Caching solution (MongoDB/Redis).",
      },
    ],
  },

  "data-analyst": {
    slug: "data-analyst",
    title: "Data Analyst Resume & ATS Keyword Guide",
    subtitle: "Format your Data Analyst resume to highlight SQL, Python, Tableau, PowerBI, statistical modeling, and business intelligence impact.",
    category: "role",
    targetRole: "Data Analyst",
    metaDescription: "Optimize your Data Analyst resume for ATS filters. Get top keywords for SQL, Python, Tableau, PowerBI, data modeling, and business analytics.",
    keywords: ["data analyst resume", "SQL resume keywords", "Tableau data analyst resume", "business intelligence resume", "data analyst ATS score"],
    recommendedStructure: [
      "Header: Name, Email, LinkedIn, GitHub / Kaggle Profile",
      "Core Skills: SQL, BI Tools, Analytics & Statistics, Programming, Data Pipelines",
      "Professional Experience: Business ROI, automated dashboards, statistical insights",
      "Analytics Projects: End-to-end data pipelines and visualization dashboards",
      "Education: Statistics, Mathematics, Computer Science, or Economics",
    ],
    mustHaveKeywords: ["SQL", "Python", "Excel (Advanced)", "Tableau", "Power BI", "Data Visualization", "Data Modeling", "ETL Pipelines"],
    preferredKeywords: ["Pandas / NumPy", "Snowflake", "dbt", "Google Analytics", "A/B Testing", "Statistical Analysis", "BigQuery"],
    exampleBullets: [
      {
        before: "Built sales reports and analyzed customer data.",
        after: "Engineered automated PowerBI dashboard connected to Snowflake, identifying ₹1.2M in annual customer churn prevention opportunities.",
        explanation: "Links data visualization tools to tangible business revenue and retention outcomes.",
      },
    ],
    recruiterFocus: [
      "Advanced SQL skills (Window functions, CTEs, complex joins)",
      "Ability to translate raw data into actionable executive decision insights",
      "Experience with modern cloud data warehouses (Snowflake, BigQuery)",
    ],
    commonMistakes: [
      "Listing generic Microsoft Excel without highlighting advanced functions or SQL",
      "Failing to quantify the business outcome of data analysis projects",
    ],
    faq: [
      {
        question: "Should a Data Analyst know Python or R?",
        answer: "Python (Pandas, NumPy) is preferred by 80%+ of recruiters for data manipulation and automation.",
      },
    ],
  },

  "fresher": {
    slug: "fresher",
    title: "Fresher & College Graduate Resume ATS Guide",
    subtitle: "A complete step-by-step guide for freshers, students, and bootcamp grads to build an ATS-proof resume with zero corporate experience.",
    category: "role",
    targetRole: "Fresher / Entry-Level",
    metaDescription: "Build a high-scoring ATS resume with zero experience. Learn how to format college projects, hackathons, and skills for entry-level tech roles.",
    keywords: ["fresher resume template", "no experience resume ATS", "college student resume", "entry level software engineer resume", "fresher ATS resume"],
    recommendedStructure: [
      "Header: Name, Email, Phone, GitHub, LinkedIn, Portfolio",
      "Technical Skills Matrix: Languages, Frameworks, Databases, Developer Tools",
      "Key Projects: 2-3 detailed project entries with live demo & repository links",
      "Education: Degree, College Name, Graduation Year, Relevant Coursework",
      "Certifications, Hackathons & Coding Ranks: LeetCode, HackerRank, Open Source",
    ],
    mustHaveKeywords: ["Object-Oriented Programming (OOP)", "Data Structures & Algorithms", "Git / GitHub", "Problem Solving", "Software Development Life Cycle (SDLC)"],
    preferredKeywords: ["Full Stack Development", "REST API Integration", "Unit Testing", "Database Management", "Agile Methodology"],
    exampleBullets: [
      {
        before: "Made a final year project on web development.",
        after: "Engineered full-stack capstone web application using React and Node.js; integrated JWT authentication and Razorpay API, supporting 200+ test users.",
        explanation: "Transforms basic academic project into a production-like engineering achievement.",
      },
    ],
    recruiterFocus: [
      "Strong foundation in Computer Science fundamentals and Data Structures",
      "High-quality GitHub projects demonstrating hands-on code writing",
      "Clear, clean 1-page ATS formatting with no artificial filler",
    ],
    commonMistakes: [
      "Including high school details or personal hobbies instead of technical projects",
      "Using multi-column visual resume templates that scramble ATS software",
    ],
    faq: [
      {
        question: "How long should a fresher resume be?",
        answer: "A fresher resume should strictly be 1 single page.",
      },
    ],
  },

  "bca": {
    slug: "bca",
    title: "BCA Graduate Resume & Tech Career ATS Guide",
    subtitle: "Tailor your BCA resume to highlight modern web development, software engineering projects, and technical skills to beat ATS filters.",
    category: "degree",
    targetRole: "BCA Graduate",
    metaDescription: "ATS resume guide for BCA students and graduates. Learn how to highlight projects, Python/Java skills, and land software developer roles.",
    keywords: ["BCA resume template", "BCA fresher resume", "BCA software developer resume", "BCA ATS resume score"],
    recommendedStructure: [
      "Header: Name, Contact, GitHub, LinkedIn",
      "Technical Skills: Languages (Python/Java/JS), Frameworks, Databases, Web Technologies",
      "Major Projects: Capstone and personal web/mobile development projects",
      "Education: BCA Degree, College Name, Year of Passing, Aggregate Percentage",
      "Certifications: Web development, Python, AWS, or database certifications",
    ],
    mustHaveKeywords: ["Python", "Java", "JavaScript", "SQL", "HTML5/CSS3", "React", "Node.js", "Git"],
    preferredKeywords: ["Full Stack Web Development", "MongoDB", "Data Structures", "API Integration", "Agile"],
    exampleBullets: [
      {
        before: "Created BCA final semester project in PHP and MySQL.",
        after: "Developed web-based inventory management portal using PHP and MySQL; implemented role-based access control for 50+ user accounts.",
        explanation: "Highlights security features and database implementation details.",
      },
    ],
    recruiterFocus: ["Practical application of coding skills in real-world web/mobile projects", "Proficiency in modern stacks (MERN/Python/Java)"],
    commonMistakes: ["Focusing only on theoretical subjects without GitHub project code links"],
    faq: [{ question: "Can BCA graduates get software engineer roles at top tech companies?", answer: "Yes! High-scoring projects, strong LeetCode problem solving, and an ATS-optimized resume enable BCA graduates to secure tech roles." }],
  },

  "mca": {
    slug: "mca",
    title: "MCA Graduate Resume & Software Developer Guide",
    subtitle: "Structure your MCA resume to showcase advanced computer science concepts, system architecture, and production project deployments.",
    category: "degree",
    targetRole: "MCA Graduate",
    metaDescription: "ATS resume guide for MCA freshers & professionals. Highlight advanced CS coursework, full-stack projects, and system design skills.",
    keywords: ["MCA resume template", "MCA fresher resume", "MCA software engineer resume", "MCA ATS resume keywords"],
    recommendedStructure: [
      "Header: Name, Email, GitHub, LinkedIn, Portfolio",
      "Technical Skills Matrix: Core Programming, Advanced Frameworks, Cloud & Databases",
      "Experience / Internships: Industry internships or freelance dev work",
      "Advanced Projects: Distributed systems, cloud deployments, capstone projects",
      "Education: MCA & BCA/B.Sc Degrees, Institution, Year",
    ],
    mustHaveKeywords: ["Java", "Python", "C++", "System Architecture", "Object-Oriented Design", "PostgreSQL", "Spring Boot / Node.js"],
    preferredKeywords: ["Docker", "AWS", "Microservices", "RESTful Web Services", "Data Structures & Algorithms"],
    exampleBullets: [
      {
        before: "Completed MCA internship in software testing.",
        after: "Automated API test suites using Postman and Jest during MCA internship, reducing manual QA regression cycles by 50%.",
        explanation: "Quantifies efficiency gain during internship.",
      },
    ],
    recruiterFocus: ["Advanced CS theory paired with practical framework execution"],
    commonMistakes: ["Underplaying internship contributions or capstone projects"],
    faq: [{ question: "Is MCA equivalent to B.Tech for software developer roles?", answer: "Most tech recruiters treat MCA and B.Tech CSE graduates equally for software developer roles." }],
  },

  "btech": {
    slug: "btech",
    title: "B.Tech CSE / IT Graduate Resume ATS Blueprint",
    subtitle: "Maximize your B.Tech CSE resume score for campus placements and off-campus tech drives with FAANG-grade ATS keyword alignment.",
    category: "degree",
    targetRole: "B.Tech CSE Graduate",
    metaDescription: "B.Tech CSE & IT resume ATS guide. Optimize for campus placements and off-campus drives with top technical skills and project frameworks.",
    keywords: ["BTech CSE resume", "BTech fresher resume", "BTech placement resume template", "BTech computer science ATS resume"],
    recommendedStructure: [
      "Header: Name, Email, Phone, GitHub, LinkedIn, Codeforces/LeetCode Profile",
      "Technical Skills: Languages, Frameworks, Core CS (OS, DBMS, CN, OOP)",
      "Key Projects: High-complexity coding projects, hackathon entries, or open source",
      "Education: B.Tech in Computer Science & Engineering, CGPA, Year",
      "Achievements: Competitive programming ranks, hackathon wins, technical papers",
    ],
    mustHaveKeywords: ["Data Structures & Algorithms", "C++ / Java / Python", "DBMS", "Operating Systems", "Computer Networks", "Git"],
    preferredKeywords: ["System Design Fundamentals", "React", "Node.js", "Docker", "Machine Learning Fundamentals"],
    exampleBullets: [
      {
        before: "Participated in college hackathon and made an app.",
        after: "Secured Top 5 spot out of 120 teams in Smart India Hackathon by building a real-time disaster tracking web app using React and Firebase.",
        explanation: "Demonstrates competitive excellence and real-time tech execution.",
      },
    ],
    recruiterFocus: ["Strong algorithmic fundamentals and clear CS core knowledge"],
    commonMistakes: ["Failing to highlight competitive coding profiles or project repos"],
    faq: [{ question: "Should I list my CGPA on a B.Tech resume?", answer: "Yes, include your CGPA if it is 7.5/10 or higher. If lower, emphasize your projects and skills instead." }],
  },

  "usa": {
    slug: "usa",
    title: "US Resume Format & ATS Conventions Guide",
    subtitle: "Understand the strict rules for US job applications: 1-page standard, zero photos, action-metric bullets, and US ATS software compatibility.",
    category: "country",
    targetRole: "US Job Applicant",
    metaDescription: "Guide to US resume formatting and ATS filters. Learn 1-page standards, US terminology, metric requirements, and anti-bias rules.",
    keywords: ["US resume format", "American resume template", "USA job application resume", "US ATS resume checker"],
    recommendedStructure: [
      "Strict 1-Page Rule for candidates under 7-10 years of experience",
      "Contact Info: Name, City & State, Phone, Email, LinkedIn (NO photo, NO birthdate, NO marital status)",
      "Work Experience: Reverse chronological, Google X-Y-Z metric format",
      "Education: University, Degree, Location, Graduation Date",
      "Skills: Technical skills grouped cleanly by category",
    ],
    mustHaveKeywords: ["Cross-Functional Collaboration", "Quantified Impact", "Process Improvement", "Project Management", "Stakeholder Alignment"],
    preferredKeywords: ["Agile/Scrum", "Cloud Infrastructure", "KPI Drivers", "Scalability"],
    exampleBullets: [
      {
        before: "Managed client projects in the US market.",
        after: "Spearheaded digital transformation projects for 3 Fortune 500 US clients, driving $1.4M in annual recurring software savings.",
        explanation: "Uses US business metrics ($ revenue/savings) and executive verbs.",
      },
    ],
    recruiterFocus: [
      "Strict anti-discrimination adherence: NEVER include photos, age, gender, marital status, or full street address",
      "Heavy reliance on quantified metrics ($ revenue, % growth, scale)",
    ],
    commonMistakes: [
      "Including a personal headshot photo (causes immediate rejection in US)",
      "Submitting multi-page resumes for early-to-mid career roles",
    ],
    faq: [{ question: "Do US recruiters accept 2-page resumes?", answer: "2-page resumes are accepted in the US ONLY for candidates with 8-10+ years of relevant experience." }],
  },

  "germany": {
    slug: "germany",
    title: "Germany & EU Resume Format (Lebenslauf) & ATS Guide",
    subtitle: "Format your resume for German tech companies and European Union employers: clean layout, language levels (CEFR), and EU ATS standards.",
    category: "country",
    targetRole: "Germany & EU Applicant",
    metaDescription: "Resume format guide for Germany & Europe (Lebenslauf). Learn EU ATS conventions, language proficiency levels, and tech formatting.",
    keywords: ["Germany resume format", "Lebenslauf tech resume", "EU resume format", "German job application resume"],
    recommendedStructure: [
      "Header: Name, City & Country, Email, Phone, LinkedIn, GitHub",
      "Language Skills: Explicit CEFR levels (e.g. English: C2 / Native, German: B1/B2)",
      "Work Experience: Clear timeline with month/year format",
      "Education: Master's/Bachelor's Degree, ECTS credits if applicable",
      "Technical Skills Matrix",
    ],
    mustHaveKeywords: ["English (Professional/C2)", "German (A1-C2)", "Technical Documentation", "Agile / Scrum", "GDPR Compliance"],
    preferredKeywords: ["International Project Management", "Cross-Border Teams", "Cloud Architecture"],
    exampleBullets: [
      {
        before: "Worked for European client software project.",
        after: "Engineered GDPR-compliant data ingestion pipeline for German enterprise client, handling 500k EU customer records securely.",
        explanation: "Highlights EU regulatory compliance (GDPR) and international project execution.",
      },
    ],
    recruiterFocus: [
      "Clear timeline integrity without unexplainable employment gaps",
      "Explicit language proficiency ratings using European standards (A1 to C2)",
    ],
    commonMistakes: ["Omitting language fluency levels when applying to European companies"],
    faq: [{ question: "Do German companies require a German language resume?", answer: "For international tech roles, an English resume is standard, but always state your German language level clearly." }],
  },
};
