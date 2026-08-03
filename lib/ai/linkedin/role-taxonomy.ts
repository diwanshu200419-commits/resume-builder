export interface CareerCategory {
  category: string;
  roles: string[];
  defaultKeywords: string[];
}

export const CAREER_TAXONOMY: CareerCategory[] = [
  {
    category: "Technology",
    roles: [
      "Software Engineer",
      "Frontend Developer",
      "Backend Developer",
      "Full Stack Developer",
      "Mobile Developer",
      "DevOps Engineer",
      "Cloud Engineer",
      "SRE",
      "Platform Engineer",
      "QA Engineer",
      "Automation Engineer",
      "Cybersecurity Analyst",
      "Security Engineer",
      "Network Engineer",
      "System Administrator",
      "Solutions Architect",
      "Technical Support Engineer",
    ],
    defaultKeywords: ["Software Architecture", "TypeScript", "React", "Node.js", "Cloud Infrastructure", "APIs", "System Design"],
  },
  {
    category: "Data & AI",
    roles: [
      "Data Analyst",
      "Business Analyst",
      "Data Scientist",
      "Data Engineer",
      "ML Engineer",
      "AI Engineer",
      "Generative AI Engineer",
      "NLP Engineer",
      "Computer Vision Engineer",
      "MLOps Engineer",
      "BI Developer",
      "Analytics Engineer",
      "Research Engineer",
    ],
    defaultKeywords: ["Python", "SQL", "Machine Learning", "Data Pipelines", "PyTorch", "Tableau", "Statistical Modeling"],
  },
  {
    category: "Product & Design",
    roles: [
      "Product Manager",
      "Technical Product Manager",
      "Product Analyst",
      "Project Manager",
      "Program Manager",
      "Scrum Master",
      "UI Designer",
      "UX Designer",
      "UI/UX Designer",
      "Product Designer",
      "Graphic Designer",
    ],
    defaultKeywords: ["Product Strategy", "User Research", "Agile Roadmap", "UI/UX", "Figma", "Cross-functional Leadership"],
  },
  {
    category: "Business & Strategy",
    roles: [
      "Business Development",
      "Operations Manager",
      "Strategy Consultant",
      "Management Consultant",
      "Entrepreneur / Founder",
      "Business Operations",
      "General Manager",
    ],
    defaultKeywords: ["Strategic Planning", "Business Growth", "Operations Management", "Process Optimization", "Stakeholder Management"],
  },
  {
    category: "Marketing",
    roles: [
      "Digital Marketing Specialist",
      "SEO Specialist",
      "Performance Marketing Lead",
      "Content Marketing Manager",
      "Social Media Manager",
      "Brand Marketer",
      "Growth Marketer",
      "Marketing Analyst",
      "Product Marketing Manager",
    ],
    defaultKeywords: ["Growth Marketing", "SEO Optimization", "Campaign Strategy", "Content Strategy", "Google Analytics", "CAC & LTV"],
  },
  {
    category: "Sales & Customer Success",
    roles: [
      "Sales Executive",
      "B2B Sales Representative",
      "SaaS Account Executive",
      "Sales Development Rep (SDR)",
      "Business Development Manager",
      "Account Manager",
      "Customer Success Manager",
    ],
    defaultKeywords: ["B2B Sales", "SaaS Prospecting", "Pipeline Management", "CRM", "Contract Negotiation", "Revenue Growth"],
  },
  {
    category: "Finance & Accounting",
    roles: [
      "Financial Analyst",
      "Investment Banking Analyst",
      "Accountant",
      "Auditor",
      "FP&A Manager",
      "Risk Analyst",
      "Credit Analyst",
      "FinTech Specialist",
      "Equity Research Analyst",
    ],
    defaultKeywords: ["Financial Modeling", "FP&A", "Accounting", "Risk Management", "Valuation", "Excel / Financial Analysis"],
  },
  {
    category: "Human Resources",
    roles: [
      "HR Executive",
      "Recruiter / Talent Acquisition",
      "HR Business Partner",
      "People Operations Lead",
      "Learning & Development Manager",
    ],
    defaultKeywords: ["Talent Acquisition", "Employee Engagement", "HR Policies", "Performance Management", "Onboarding"],
  },
  {
    category: "Core Engineering",
    roles: [
      "Mechanical Engineer",
      "Civil Engineer",
      "Electrical Engineer",
      "Electronics Engineer",
      "Chemical Engineer",
      "Automobile Engineer",
      "Industrial Engineer",
      "Manufacturing Engineer",
      "Robotics Engineer",
    ],
    defaultKeywords: ["CAD Modeling", "Engineering Design", "Quality Control", "Circuit Design", "Project Management"],
  },
  {
    category: "Healthcare & Life Sciences",
    roles: [
      "Healthcare Administrator",
      "Pharmacist",
      "Biotechnology Researcher",
      "Clinical Research Associate",
      "Bioinformatics Specialist",
      "Medical Researcher",
    ],
    defaultKeywords: ["Clinical Research", "Biotechnology", "Healthcare Protocols", "Data Compliance", "Medical Analytics"],
  },
  {
    category: "Education & Academia",
    roles: [
      "Teacher",
      "Professor",
      "Academic Researcher",
      "Corporate Trainer",
      "Instructional Designer",
      "Education Consultant",
    ],
    defaultKeywords: ["Curriculum Development", "Pedagogy", "Educational Technology", "Academic Research", "Student Mentorship"],
  },
  {
    category: "Legal & Compliance",
    roles: [
      "Legal Analyst",
      "Lawyer / Attorney",
      "Legal Researcher",
      "Corporate Compliance Officer",
    ],
    defaultKeywords: ["Legal Research", "Contract Drafting", "Regulatory Compliance", "Corporate Law", "Intellectual Property"],
  },
  {
    category: "Creative & Media",
    roles: [
      "Content Writer",
      "Copywriter",
      "Video Editor",
      "Photographer",
      "Animator",
      "Journalist",
      "Creative Director",
    ],
    defaultKeywords: ["Copywriting", "Video Editing", "Content Creation", "Storytelling", "Adobe Creative Suite"],
  },
  {
    category: "Supply Chain & Operations",
    roles: [
      "Supply Chain Analyst",
      "Procurement Specialist",
      "Logistics Manager",
      "Warehouse Operations Lead",
    ],
    defaultKeywords: ["Supply Chain Optimization", "Logistics", "Procurement", "Inventory Management", "Vendor Relations"],
  },
];

export function getKeywordsForRole(role: string): string[] {
  const normalized = role.toLowerCase().trim();
  for (const cat of CAREER_TAXONOMY) {
    for (const r of cat.roles) {
      if (r.toLowerCase() === normalized || normalized.includes(r.toLowerCase())) {
        return cat.defaultKeywords;
      }
    }
  }
  return ["Industry Best Practices", "Professional Excellence", "Strategic Execution", "Project Management"];
}
