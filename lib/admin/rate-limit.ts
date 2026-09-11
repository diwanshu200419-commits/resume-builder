interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const adminBuckets = new Map<string, RateLimitBucket>();

// Sliding window: 20 actions per 60 seconds
const MAX_ADMIN_REQUESTS = 30;
const WINDOW_MS = 60 * 1000;

export function checkAdminRateLimit(identifier: string): {
  allowed: boolean;
  remaining: number;
  resetSeconds: number;
} {
  const now = Date.now();
  const bucket = adminBuckets.get(identifier);

  if (!bucket || now > bucket.resetAt) {
    adminBuckets.set(identifier, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return {
      allowed: true,
      remaining: MAX_ADMIN_REQUESTS - 1,
      resetSeconds: Math.ceil(WINDOW_MS / 1000),
    };
  }

  if (bucket.count >= MAX_ADMIN_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return {
    allowed: true,
    remaining: MAX_ADMIN_REQUESTS - bucket.count,
    resetSeconds: Math.ceil((bucket.resetAt - now) / 1000),
  };
}
