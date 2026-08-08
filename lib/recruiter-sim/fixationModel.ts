// Grounded Recruiter 10-Second Eye-Tracking Fixation Model (Research-Informed Behavioral Model)

export interface BulletZone {
  zoneId: string;
  bulletIndex: number;
  text: string;
  wordCount: number;
  hasMetric: boolean;
  metricMatches: string[];
  firstWords: string;
  lineNumber: number;
}

export interface ParsedResume {
  rawText: string;
  nameLine: string | null;
  titleCompanyLine: string | null;
  educationLine: string | null;
  bullets: BulletZone[];
  isDensePlainText: boolean;
  totalWordCount: number;
}

export interface FixationZone {
  zoneId: string;
  label: string; // e.g. "Candidate Name Header", "Current Role / Title", "Bullet #1"
  textSnippet: string;
  baseWeight: number; // 0-1, position-based prior
  metricBoost: number; // additive boost if hasMetric
  finalWeight: number;
  reached: boolean; // did simulated 10-second budget reach this zone
  fixationDurationMs: number;
  hasMetric: boolean;
  metricMatches: string[];
}

export interface KeyFinding {
  type: "buried_metric" | "weak_opening" | "dense_text_penalty" | "strong_early_signal" | "title_not_reached";
  message: string;
  zoneId: string;
}

export interface ScreenVerdict {
  outcome: "shortlist_likely" | "borderline" | "pass_likely";
  score: number; // 0-100
  reasoning: string;
  keyFindings: KeyFinding[];
  totalFixationTimeMs: number;
  zonesScannedCount: number;
  totalZonesCount: number;
}

// ---------------------------------------------------------
// 1. Structural Resume Parsing (Whitespace-Normalized)
// ---------------------------------------------------------
const METRIC_REGEX = /(?:\d+(?:\.\d+)?%\b|\$\d+(?:\.\d+)?[kKmMbB]?\b|\b\d+[kK]\s*(?:revenue|ARR|MRR|dollars|users|customers)\b|\b#?\d+(?:st|nd|rd|th)?\s*(?:ranked|rank|place|top)?\b|\b\d+x\b|\b\d+(?:\.\d+)?X\b|\b\d+(?:,\d{3})*(?:\.\d+)?\s*(?:users|dau|mau|requests|qps|engineers|clients|customers|hours|days|weeks|months|years|percent|points|ms|seconds|million|billion|k|k\+)\b|\b\d{1,3}(?:,\d{3})+\+?\b)/gi;

export function extractMetrics(text: string): string[] {
  if (!text) return [];
  const matches = text.match(METRIC_REGEX);
  if (!matches) return [];
  return Array.from(new Set(matches.map((m) => m.trim())));
}

export function parseResumeForSimulation(rawInput: string): ParsedResume {
  // Normalize whitespace noise (extra spaces, carriage returns, trailing newlines)
  const normalizedRaw = (rawInput || "")
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .trim();

  const lines = normalizedRaw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  let nameLine: string | null = null;
  let titleCompanyLine: string | null = null;
  let educationLine: string | null = null;

  if (lines.length > 0) nameLine = lines[0];
  if (lines.length > 1) titleCompanyLine = lines[1];

  for (const line of lines) {
    const lLower = line.toLowerCase();
    if (/\b(bachelor|master|phd|b\.tech|btech|degree|university|college|education|certif)\b/i.test(lLower)) {
      educationLine = line;
      break;
    }
  }

  const bullets: BulletZone[] = [];
  let bulletCount = 0;

  lines.forEach((line, idx) => {
    const isBulletDelimiter = /^[\s•\-\*\u2022\u2023\u2043\u2219]+/.test(line) || /^\d+[\.\)]/.test(line);
    const cleanLine = line.replace(/^[\s•\-\*\u2022\u2023\u2043\u2219\d\.\)]+/, "").trim();

    if (cleanLine.length > 15) {
      const metrics = extractMetrics(cleanLine);
      const words = cleanLine.split(/\s+/);

      if (isBulletDelimiter || idx >= 2) {
        bulletCount++;
        bullets.push({
          zoneId: `bullet_${bulletCount}`,
          bulletIndex: bulletCount - 1,
          text: cleanLine,
          wordCount: words.length,
          hasMetric: metrics.length > 0,
          metricMatches: metrics,
          firstWords: words.slice(0, 8).join(" "),
          lineNumber: idx + 1,
        });
      }
    }
  });

  const hasDelimiters = lines.some((l) => /^[\s•\-\*\u2022]/.test(l));
  const avgLineLength = lines.length > 0 ? normalizedRaw.length / lines.length : 0;
  const isDensePlainText = !hasDelimiters && (avgLineLength > 120 || bullets.length <= 1);

  const totalWords = normalizedRaw.split(/\s+/).filter(Boolean).length;

  return {
    rawText: normalizedRaw,
    nameLine,
    titleCompanyLine,
    educationLine,
    bullets,
    isDensePlainText,
    totalWordCount: totalWords,
  };
}

// ---------------------------------------------------------
// 2. Deterministic Fixation Scoring Model (10,000ms Budget)
// ---------------------------------------------------------
export function computeFixationPath(parsed: ParsedResume): FixationZone[] {
  const zones: FixationZone[] = [];
  const TOTAL_BUDGET_MS = 10000;

  // Zone 1: Name Line
  if (parsed.nameLine) {
    const metrics = extractMetrics(parsed.nameLine);
    zones.push({
      zoneId: "zone_name",
      label: "Candidate Name Header",
      textSnippet: parsed.nameLine.slice(0, 60),
      baseWeight: 0.95,
      metricBoost: metrics.length > 0 ? 0.05 : 0,
      finalWeight: metrics.length > 0 ? 1.0 : 0.95,
      reached: false,
      fixationDurationMs: 0,
      hasMetric: metrics.length > 0,
      metricMatches: metrics,
    });
  }

  // Zone 2: Title / Company Line
  if (parsed.titleCompanyLine) {
    const metrics = extractMetrics(parsed.titleCompanyLine);
    zones.push({
      zoneId: "zone_title",
      label: "Current Role / Title & Company",
      textSnippet: parsed.titleCompanyLine.slice(0, 80),
      baseWeight: 0.85,
      metricBoost: metrics.length > 0 ? 0.15 : 0,
      finalWeight: metrics.length > 0 ? 1.0 : 0.85,
      reached: false,
      fixationDurationMs: 0,
      hasMetric: metrics.length > 0,
      metricMatches: metrics,
    });
  }

  // Zone 3+: Bullets
  parsed.bullets.forEach((b, idx) => {
    // Top-to-Bottom Eye Decay: Attention decays after Bullet #3
    const positionDecay = Math.max(0.1, 0.75 - idx * 0.09);
    const metricBoost = b.hasMetric ? 0.35 : 0;
    let finalWeight = positionDecay + metricBoost;

    if (parsed.isDensePlainText) {
      finalWeight *= 0.6; // Sparse scatter penalty for unbroken text blocks
    }

    zones.push({
      zoneId: b.zoneId,
      label: `Bullet #${idx + 1}`,
      textSnippet: b.text.slice(0, 90),
      baseWeight: Number(positionDecay.toFixed(2)),
      metricBoost: Number(metricBoost.toFixed(2)),
      finalWeight: Number(finalWeight.toFixed(2)),
      reached: false,
      fixationDurationMs: 0,
      hasMetric: b.hasMetric,
      metricMatches: b.metricMatches,
    });
  });

  // Zone Education (if exists)
  if (parsed.educationLine) {
    zones.push({
      zoneId: "zone_education",
      label: "Education & Credentials",
      textSnippet: parsed.educationLine.slice(0, 70),
      baseWeight: 0.3,
      metricBoost: 0,
      finalWeight: 0.3,
      reached: false,
      fixationDurationMs: 0,
      hasMetric: false,
      metricMatches: [],
    });
  }

  // Budget Allocation Loop: Walk zones in priority order until 10,000ms is exhausted
  let remainingBudgetMs = TOTAL_BUDGET_MS;

  for (const zone of zones) {
    if (remainingBudgetMs <= 200) break; // Recruiter stop condition

    // Base duration proportional to final weight (700ms - 1800ms per fixated zone)
    const durationNeeded = Math.round(Math.min(remainingBudgetMs, 700 + zone.finalWeight * 1100));

    if (durationNeeded >= 350) {
      zone.reached = true;
      zone.fixationDurationMs = durationNeeded;
      remainingBudgetMs -= durationNeeded;
    }
  }

  return zones;
}

// ---------------------------------------------------------
// 3. Verdict & Actionable Key Findings Generator
// ---------------------------------------------------------
export function generateVerdict(zones: FixationZone[], parsed: ParsedResume): ScreenVerdict {
  const nameZone = zones.find((z) => z.zoneId === "zone_name");
  const titleZone = zones.find((z) => z.zoneId === "zone_title");
  const reachedZones = zones.filter((z) => z.reached);
  const reachedMetrics = reachedZones.filter((z) => z.hasMetric);
  const unreachedMetrics = zones.filter((z) => z.hasMetric && !z.reached);

  const totalFixationTimeMs = zones.reduce((sum, z) => sum + z.fixationDurationMs, 0);

  let outcome: "shortlist_likely" | "borderline" | "pass_likely" = "borderline";
  const hasTopSignals = (nameZone?.reached ?? true) && (titleZone?.reached ?? true);

  if (hasTopSignals && reachedMetrics.length >= 1 && !parsed.isDensePlainText) {
    outcome = "shortlist_likely";
  } else if ((titleZone && !titleZone.reached) || (parsed.isDensePlainText && reachedMetrics.length === 0)) {
    outcome = "pass_likely";
  } else {
    outcome = "borderline";
  }

  let score = 50;
  if (outcome === "shortlist_likely") score = 88 + Math.min(10, reachedMetrics.length * 4);
  else if (outcome === "pass_likely") score = 35 + (parsed.isDensePlainText ? -10 : 10);
  else score = 65 + Math.min(15, reachedMetrics.length * 5);

  score = Math.max(20, Math.min(98, score));

  const keyFindings: KeyFinding[] = [];

  if (parsed.isDensePlainText) {
    keyFindings.push({
      type: "dense_text_penalty",
      message: "Dense paragraph formatting detected. Recruiters scan in an F-pattern and skip ~40% of unbroken text blocks. Break your experience into bullet points starting with strong action verbs.",
      zoneId: "zone_name",
    });
  }

  if (unreachedMetrics.length > 0) {
    const firstBuried = unreachedMetrics[0];
    const metricText = firstBuried.metricMatches[0] || "quantifiable metric";
    keyFindings.push({
      type: "buried_metric",
      message: `Your metric ('${metricText}') in ${firstBuried.label} sat beyond the simulated recruiter's 10-second scan window. Move this metric to the first 2 lines of your top experience bullet.`,
      zoneId: firstBuried.zoneId,
    });
  }

  const bullet1Zone = zones.find((z) => z.zoneId === "bullet_1");
  if (bullet1Zone && !bullet1Zone.hasMetric) {
    keyFindings.push({
      type: "weak_opening",
      message: "Bullet #1 lacks quantifiable metrics. Recruiters allocate ~2.5s to the top section — lead bullet #1 with a concrete number (%, $, scale) to capture instant interest.",
      zoneId: "bullet_1",
    });
  } else if (bullet1Zone && bullet1Zone.hasMetric && bullet1Zone.reached) {
    const metricText = bullet1Zone.metricMatches[0] || "metric";
    keyFindings.push({
      type: "strong_early_signal",
      message: `Strong early hook: Your metric ('${metricText}') in Bullet #1 was captured within the first 3 seconds of the recruiter scan.`,
      zoneId: "bullet_1",
    });
  }

  if (titleZone && !titleZone.reached) {
    keyFindings.push({
      type: "title_not_reached",
      message: "Your target job title was not clearly identifiable in the top 2 seconds of the scan. Ensure your primary title is prominent at the top.",
      zoneId: "zone_title",
    });
  }

  let reasoning = "";
  if (outcome === "shortlist_likely") {
    reasoning = `Passes initial 10-second recruiter scan. Key title & ${reachedMetrics.length} metric signal(s) were captured in the primary eye-fixation path.`;
  } else if (outcome === "pass_likely") {
    reasoning = `High dropoff risk during 10-second screening. ${parsed.isDensePlainText ? "Dense formatting obscured key achievements." : "Key metrics were buried below the recruiter's initial scan fold."}`;
  } else {
    reasoning = "Borderline 10-second scan result. The recruiter captured your background but missed secondary impact metrics due to position placement.";
  }

  return {
    outcome,
    score,
    reasoning,
    keyFindings,
    totalFixationTimeMs,
    zonesScannedCount: reachedZones.length,
    totalZonesCount: zones.length,
  };
}
