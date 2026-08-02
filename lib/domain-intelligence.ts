// lib/domain-intelligence.ts
//
// Vaylo AI — Domain-Agnostic Resume Intelligence Engine
// Classifies Job Descriptions into 12 domains (Finance, HR, Sales, Marketing, IT, PM, Ops, etc.)
// and provides domain-specific action verb banks, metric types, and prompt blocks.

export type DomainCategory =
  | "Software/IT"
  | "Data/Analytics"
  | "Product Management"
  | "Finance/Accounting"
  | "Marketing/Growth"
  | "Sales/Business Development"
  | "HR/People"
  | "Operations/Supply Chain"
  | "Design/UX"
  | "Legal"
  | "Consulting"
  | "General/Other";

export interface DomainVocabulary {
  strongVerbs: string[];
  weakVerbs: string[];
  metricKeywords: RegExp;
  sampleMetricTypes: string[];
}

export const DOMAIN_VOCABULARY: Record<DomainCategory, DomainVocabulary> = {
  "Software/IT": {
    strongVerbs: ["architected", "engineered", "optimized", "scaled", "automated", "deployed", "refactored", "spearheaded", "tripled", "orchestrated"],
    weakVerbs: ["worked", "responsible", "helped", "assisted", "handled", "participated", "attended"],
    metricKeywords: /\b\d+([%kM]|ms|s)?\b|\$\d+|\b\d+\s*(users|requests|latency|qps|uptime|endpoints|commits|repos|servers|tests)\b/i,
    sampleMetricTypes: ["latency (ms)", "uptime %", "users / scale", "request volume / QPS", "test coverage %"],
  },
  "Finance/Accounting": {
    strongVerbs: ["audited", "reconciled", "forecasted", "consolidated", "streamlined", "reduced", "ensured", "mitigated", "analyzed", "structured"],
    weakVerbs: ["checked", "entered", "worked on", "assisted", "handled", "participated"],
    metricKeywords: /\b\d+%\b|\$\d+|\b₹\d+|\b\d+\s*(lakhs|crores|million|billion|variance|audits|accounts|tax|returns|cycle|days)\b/i,
    sampleMetricTypes: ["₹/$ portfolio amounts", "% cost reduction", "% variance accuracy", "close-cycle days", "audit resolution %"],
  },
  "Product Management": {
    strongVerbs: ["drove", "launched", "prioritized", "aligned", "championed", "scaled", "negotiated", "formulated", "spearheaded", "pioneered"],
    weakVerbs: ["attended", "managed", "helped", "assisted", "tracked", "wrote"],
    metricKeywords: /\b\d+%\b|\$\d+|\b₹\d+|\b\d+\s*(mau|dau|nps|retention|conversion|arr|mrr|users|features|sprints)\b/i,
    sampleMetricTypes: ["retention %", "MAU/DAU growth", "revenue/ARR impact", "feature launch velocity", "CSAT/NPS score"],
  },
  "Marketing/Growth": {
    strongVerbs: ["grew", "generated", "positioned", "launched", "optimized", "increased", "championed", "amplified", "expanded", "captured"],
    weakVerbs: ["posted", "managed", "worked on", "helped", "created", "sent"],
    metricKeywords: /\b\d+%\b|\$\d+|\b₹\d+|\b\d+\s*(leads|cac|roas|ctr|impressions|followers|conversions|revenue|downloads|subscribers)\b/i,
    sampleMetricTypes: ["conversion rate %", "CAC reduction", "ROAS / ROI", "campaign reach", "organic traffic growth %"],
  },
  "Sales/Business Development": {
    strongVerbs: ["closed", "negotiated", "exceeded", "expanded", "onboarded", "retained", "outperformed", "secured", "generated", "penetrated"],
    weakVerbs: ["called", "emailed", "talked", "worked on", "helped", "met"],
    metricKeywords: /\b\d+%\b|\$\d+|\b₹\d+|\b\d+\s*(quota|pipeline|deals|accounts|clients|acv|mrr|revenue|renewal|target)\b/i,
    sampleMetricTypes: ["quota attainment %", "deal size / ACV", "pipeline value", "win rate %", "client retention %"],
  },
  "HR/People": {
    strongVerbs: ["recruited", "onboarded", "restructured", "facilitated", "resolved", "implemented", "retained", "negotiated", "championed", "standardized"],
    weakVerbs: ["interviewed", "scheduled", "worked on", "helped", "assisted", "handled"],
    metricKeywords: /\b\d+%\b|\b\d+\s*(candidates|hires|employees|headcount|days|turnover|enps|retention|policies|workshops)\b/i,
    sampleMetricTypes: ["time-to-hire (days)", "employee retention rate %", "headcount managed", "eNPS score", "policy compliance %"],
  },
  "Operations/Supply Chain": {
    strongVerbs: ["streamlined", "coordinated", "reduced", "managed", "standardized", "optimized", "procured", "slashed", "accelerated", "re-engineered"],
    weakVerbs: ["handled", "moved", "worked on", "helped", "assisted", "packed"],
    metricKeywords: /\b\d+%\b|\$\d+|\b₹\d+|\b\d+\s*(vendors|orders|sla|shipments|units|turnaround|cost|inventory|hours|days)\b/i,
    sampleMetricTypes: ["turnaround time reduction", "SLA compliance %", "cost savings %", "inventory accuracy %", "unit throughput"],
  },
  "Data/Analytics": {
    strongVerbs: ["modeled", "analyzed", "forecasted", "transformed", "engineered", "synthesized", "visualized", "mined", "automated", "validated"],
    weakVerbs: ["looked at", "ran", "worked on", "helped", "assisted", "cleaned"],
    metricKeywords: /\b\d+%\b|\b\d+\s*(records|datasets|dashboards|accuracy|queries|tables|pipeline|models|insights)\b/i,
    sampleMetricTypes: ["model accuracy %", "query execution speedup", "data pipeline throughput", "dashboards adopted"],
  },
  "Design/UX": {
    strongVerbs: ["designed", "prototyped", "researched", "iterated", "formulated", "validated", "crafted", "unified", "transformed", "standardized"],
    weakVerbs: ["drew", "made", "worked on", "helped", "assisted", "created"],
    metricKeywords: /\b\d+%\b|\b\d+\s*(users|screens|wireframes|usability|nps|components|conversion|tests|flows)\b/i,
    sampleMetricTypes: ["usability task success %", "design system components", "NPS improvement", "conversion lift %"],
  },
  "Legal": {
    strongVerbs: ["drafted", "negotiated", "mitigated", "counselled", "reviewed", "complied", "enforced", "adjudicated", "structured", "settled"],
    weakVerbs: ["read", "filed", "worked on", "helped", "assisted", "looked over"],
    metricKeywords: /\b\d+%\b|\$\d+|\b₹\d+|\b\d+\s*(contracts|agreements|disputes|matters|compliance|settlements|filings)\b/i,
    sampleMetricTypes: ["contract turnaround (days)", "compliance rate %", "dispute risk mitigation ₹/$", "filings completed"],
  },
  "Consulting": {
    strongVerbs: ["advised", "formulated", "transformed", "assessed", "restructured", "recommended", "spearheaded", "quantified", "benchmarked"],
    weakVerbs: ["met with", "talked", "worked on", "helped", "assisted", "wrote"],
    metricKeywords: /\b\d+%\b|\$\d+|\b₹\d+|\b\d+\s*(clients|engagements|savings|value|recommendations|workstreams|stakeholders)\b/i,
    sampleMetricTypes: ["client ROI %", "engagement size ₹/$", "cost savings realized %", "stakeholder alignment score"],
  },
  "General/Other": {
    strongVerbs: ["spearheaded", "drove", "managed", "executed", "optimized", "coordinated", "delivered", "transformed", "restructured", "achieved"],
    weakVerbs: ["worked", "responsible", "helped", "assisted", "handled", "participated"],
    metricKeywords: /\b\d+%\b|\$\d+|\b₹\d+|\b\d+\s*(projects|teams|users|units|growth|savings|results|goals)\b/i,
    sampleMetricTypes: ["project completion %", "budget variance", "team size / scope", "goal attainment %"],
  },
};

/**
 * Classifies Job Description & Title into 1 of 12 domain categories
 */
export function detectDomainFromJD(jobDescription: string, jobTitle: string = ""): DomainCategory {
  const combinedText = `${jobTitle} ${jobDescription}`.toLowerCase();

  if (/\b(accounting|accountant|chartered accountant|ca|finance|financial|treasury|audit|taxation|payroll|gst)\b/i.test(combinedText)) {
    return "Finance/Accounting";
  }
  if (/\b(product manager|tpm|cpo|product owner|product strategy|roadmap)\b/i.test(combinedText)) {
    return "Product Management";
  }
  if (/\b(marketing|growth|seo|sem|social media|content marketer|brand|copywriter|digital marketing)\b/i.test(combinedText)) {
    return "Marketing/Growth";
  }
  if (/\b(sales|account executive|business development|bdr|sdr|account manager|client relationship)\b/i.test(combinedText)) {
    return "Sales/Business Development";
  }
  if (/\b(hr|human resources|talent acquisition|recruiter|people ops|people operations|employee relations)\b/i.test(combinedText)) {
    return "HR/People";
  }
  if (/\b(operations|supply chain|logistics|procurement|inventory|fulfillment|vendor management|facility)\b/i.test(combinedText)) {
    return "Operations/Supply Chain";
  }
  if (/\b(data scientist|data engineer|data analyst|bi developer|analytics|big data|machine learning|ml engineer|ai engineer)\b/i.test(combinedText)) {
    return "Data/Analytics";
  }
  if (/\b(ux|ui|user experience|product designer|graphic designer|figma|visual designer)\b/i.test(combinedText)) {
    return "Design/UX";
  }
  if (/\b(legal|counsel|attorney|lawyer|compliance officer|paralegal|contracts manager)\b/i.test(combinedText)) {
    return "Legal";
  }
  if (/\b(consultant|management consultant|strategy consultant|advisory|business analyst)\b/i.test(combinedText)) {
    return "Consulting";
  }
  if (/\b(software|developer|frontend|backend|fullstack|devops|cloud|engineer|qa|tester|system|tech|architect|react|node|java|python|cpp|c#)\b/i.test(combinedText)) {
    return "Software/IT";
  }

  return "General/Other";
}

/**
 * Returns a domain-specific prompt block to inject into AI system prompts
 */
export function getDomainPromptContext(domain: DomainCategory): string {
  const vocab = DOMAIN_VOCABULARY[domain] || DOMAIN_VOCABULARY["General/Other"];

  return `
DOMAIN-AGNOSTIC CONTEXT:
This resume is being evaluated for a role in the "${domain}" domain.
- Recommended Action Verbs for ${domain}: ${vocab.strongVerbs.join(", ")}.
- Strong Metric Types for ${domain}: ${vocab.sampleMetricTypes.join("; ")}.
- Apply domain-appropriate terminology. Do NOT default to software engineering terms (like Docker, latency, microservices) unless evaluating a Software/IT role.`;
}
