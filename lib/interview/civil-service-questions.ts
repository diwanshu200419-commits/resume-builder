// lib/interview/civil-service-questions.ts
//
// Vaylo AI — Civil Services, Government & Banking Panel Questions & Role Detector

export const CIVIL_SERVICE_FALLBACK_QUESTION_SET = {
  role: "Civil Services & Public Administration",
  seniority: "mid-level",
  company_style: "Government & Public Service Commission",
  questions: [
    {
      id: "cs_fb_q1",
      type: "behavioral",
      question: "As an administrative officer, describe a situation where you had to implement a crucial public policy despite facing local resistance or resource constraints.",
      why_this_matters: "Assesses administrative resolve, diplomacy, and citizen-first governance.",
      rubric: {
        structure_weight: 0.35,
        specificity_weight: 0.35,
        relevance_weight: 0.15,
        communication_weight: 0.15,
        model_answer_keywords: ["stakeholder engagement", "public welfare", "resource optimization", "transparency"]
      }
    },
    {
      id: "cs_fb_q2",
      type: "behavioral",
      question: "Walk us through an instance where you identified an operational or financial irregularity in a process. What immediate steps did you take to uphold accountability?",
      why_this_matters: "Evaluates zero-tolerance ethics, procedural compliance, and moral courage.",
      rubric: {
        structure_weight: 0.3,
        specificity_weight: 0.35,
        relevance_weight: 0.2,
        communication_weight: 0.15,
        model_answer_keywords: ["whistleblowing", "audit trail", "statutory adherence", "accountability"]
      }
    },
    {
      id: "cs_fb_q3",
      type: "behavioral",
      question: "Describe how you managed a crisis or emergency situation where rapid coordination across multiple government departments was required.",
      why_this_matters: "Tests inter-agency command, crisis communication, and execution speed.",
      rubric: {
        structure_weight: 0.35,
        specificity_weight: 0.35,
        relevance_weight: 0.15,
        communication_weight: 0.15,
        model_answer_keywords: ["disaster response", "inter-departmental liaison", "logistics", "public safety"]
      }
    },
    {
      id: "cs_fb_q4",
      type: "technical",
      question: "What specific digital governance mechanisms or data-driven metrics would you implement to eliminate leakages in public welfare distribution?",
      why_this_matters: "Assesses modern administrative technology literacy and Direct Benefit Transfer systems.",
      rubric: {
        structure_weight: 0.3,
        specificity_weight: 0.4,
        relevance_weight: 0.15,
        communication_weight: 0.15,
        model_answer_keywords: ["Direct Benefit Transfer", "biometric authentication", "real-time auditing", "grievance redressal"]
      }
    },
    {
      id: "cs_fb_q5",
      type: "technical",
      question: "How do you systematically prioritize capital expenditure versus recurring welfare spending in a resource-limited district budget?",
      why_this_matters: "Measures fiscal prudence and public policy socio-economic trade-off judgment.",
      rubric: {
        structure_weight: 0.3,
        specificity_weight: 0.4,
        relevance_weight: 0.15,
        communication_weight: 0.15,
        model_answer_keywords: ["fiscal deficit", "multiplier effect", "social return on investment", "statutory budgeting"]
      }
    },
    {
      id: "cs_fb_q6",
      type: "technical",
      question: "In banking and financial administration, how would you balance aggressive credit growth with non-performing asset (NPA) risk containment?",
      why_this_matters: "Tests credit risk appraisal, statutory compliance, and macroeconomic vigilance.",
      rubric: {
        structure_weight: 0.25,
        specificity_weight: 0.45,
        relevance_weight: 0.15,
        communication_weight: 0.15,
        model_answer_keywords: ["NPA provisioning", "collateral diligence", "liquidity ratio", "early warning signals"]
      }
    },
    {
      id: "cs_fb_q7",
      type: "culture",
      question: "What core constitutional principle or public service value personally anchors your decision to serve in the public administration / banking sector?",
      why_this_matters: "Gauges vocational dedication, democratic ethos, and integrity.",
      rubric: {
        structure_weight: 0.2,
        specificity_weight: 0.3,
        relevance_weight: 0.3,
        communication_weight: 0.2,
        model_answer_keywords: ["constitutional values", "equity", "public trust", "inclusive development"]
      }
    },
    {
      id: "cs_fb_q8",
      type: "curveball",
      question: "If your administrative superior gives you a verbal directive that is technically within rules but ethically questionable and harmful to the local community, how do you respond?",
      why_this_matters: "Tests administrative courage, written record protocols, and ethical governance.",
      rubric: {
        structure_weight: 0.35,
        specificity_weight: 0.35,
        relevance_weight: 0.15,
        communication_weight: 0.15,
        model_answer_keywords: ["written appraisal", "statutory mandate", "ethical dissent", "public interest preservation"]
      }
    }
  ]
};

export function isCivilServiceOrGovtRole(role: string, companyStyle?: string | null): boolean {
  const combined = `${role || ""} ${companyStyle || ""}`.toLowerCase();
  return (
    combined.includes("upsc") ||
    combined.includes("civil service") ||
    combined.includes("ias") ||
    combined.includes("ips") ||
    combined.includes("psc") ||
    combined.includes("banking") ||
    combined.includes("bank po") ||
    combined.includes("rbi") ||
    combined.includes("sbi") ||
    combined.includes("ibps") ||
    combined.includes("public sector") ||
    combined.includes("government") ||
    combined.includes("administration") ||
    combined.includes("policy officer")
  );
}
