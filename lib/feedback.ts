// lib/feedback.ts ? Feedback Data Layer with Resilient Fallback & Rate Limiting

export interface UserFeedbackRecord {
  id: string;
  user_id: string | null;
  user_email: string;
  name?: string | null;
  category: string; // 'bug' | 'billing' | 'feature' | 'complaint' | 'general'
  message: string;
  status: "open" | "in_progress" | "resolved" | "closed";
  admin_response?: string | null;
  responded_at?: string | null;
  created_at: string;
}

export const FALLBACK_FEEDBACK: UserFeedbackRecord[] = [
  {
    id: "fb-sample-1",
    user_id: null,
    user_email: "feedback-demo@vayloai.online",
    name: "Public Visitor",
    category: "feature",
    message: "Great AI resume builder! Would love to see more one-click dark mode resume templates.",
    status: "open",
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
];

export function addFallbackFeedback(record: UserFeedbackRecord): void {
  FALLBACK_FEEDBACK.unshift(record);
  if (FALLBACK_FEEDBACK.length > 200) {
    FALLBACK_FEEDBACK.pop();
  }
}

export function getAllFallbackFeedback(): UserFeedbackRecord[] {
  return [...FALLBACK_FEEDBACK];
}

interface RateBucket {
  count: number;
  resetAt: number;
}

const anonymousFeedbackBuckets = new Map<string, RateBucket>();
const MAX_ANON_REQUESTS = 10;
const WINDOW_MS = 15 * 60 * 1000;

export function checkAnonymousFeedbackRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
} {
  const now = Date.now();
  const bucket = anonymousFeedbackBuckets.get(identifier);

  if (!bucket || now > bucket.resetAt) {
    anonymousFeedbackBuckets.set(identifier, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: MAX_ANON_REQUESTS - 1,
      resetSeconds: Math.ceil(WINDOW_MS / 1000),
    };
  }

  if (bucket.count >= MAX_ANON_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: MAX_ANON_REQUESTS - bucket.count,
    resetSeconds: Math.ceil((bucket.resetAt - now) / 1000),
  };
}
