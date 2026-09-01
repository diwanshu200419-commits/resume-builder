// lib/analytics.ts
//
// Vaylo AI — Privacy-Safe GA4 Funnel & Conversion Tracking Engine
// Strictly prohibits personally identifiable information (PII) like names, emails, phone numbers, or raw resume text.

export type AnalyticsEventName =
  | "page_view"
  | "start_free"
  | "signup_started"
  | "signup_completed"
  | "resume_upload"
  | "ats_analysis_started"
  | "ats_analysis_completed"
  | "pricing_view"
  | "checkout_started"
  | "purchase";

export interface AnalyticsEventParams {
  [key: string]: string | number | boolean | undefined | null;
}

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Track a custom GA4 event safely.
 * Strips any potential PII before sending.
 */
export function trackEvent(eventName: AnalyticsEventName, params?: AnalyticsEventParams) {
  if (typeof window === "undefined") return;

  // Suppress tracking in automated test environments (Playwright/Puppeteer), localhost, or disabled state
  if (
    window.navigator?.webdriver ||
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    (window as any)["ga-disable-G-ENLDX3KQQ7"] === true
  ) {
    return;
  }

  // Sanitize: ensure no email, phone, or raw text is leaked
  const sanitizedParams: Record<string, any> = {};

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;

      // Filter out keys that might accidentally contain PII
      const lowerKey = key.toLowerCase();
      if (
        lowerKey.includes("email") ||
        lowerKey.includes("name") ||
        lowerKey.includes("phone") ||
        lowerKey.includes("text") ||
        lowerKey.includes("resume")
      ) {
        continue;
      }

      sanitizedParams[key] = value;
    }
  }

  // Add standard timestamp
  sanitizedParams.event_time = new Date().toISOString();

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, sanitizedParams);
  } else if (window.dataLayer && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({
      event: eventName,
      ...sanitizedParams,
    });
  }
}

/**
 * Helper to track ATS conversion funnel steps
 */
export function trackFunnelStep(
  step: "upload" | "analyzing" | "results" | "signup_prompt" | "checkout",
  metadata?: AnalyticsEventParams
) {
  trackEvent(
    step === "upload"
      ? "start_free"
      : step === "analyzing"
      ? "ats_analysis_started"
      : step === "results"
      ? "ats_analysis_completed"
      : step === "checkout"
      ? "checkout_started"
      : "start_free",
    {
      funnel_step: step,
      ...metadata,
    }
  );
}
