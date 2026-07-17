/**
 * In-memory token-bucket rate limiter for the AI route (STANDARDS §8/§10).
 *
 * This is intentionally best-effort and per-instance: serverless deployments
 * run multiple isolated instances, so this bounds abuse from a single instance
 * rather than providing a global guarantee. It needs no external store and adds
 * no dependency. Documented as best-effort in AI_ARCHITECTURE.md.
 */

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the next token is available (0 when allowed). */
  retryAfterSec: number;
  /** Tokens left in the bucket after this call. */
  remaining: number;
}

interface Bucket {
  tokens: number;
  updatedAt: number;
}

/** Burst capacity per client. */
export const BUCKET_CAPACITY = 12;
/** Sustained refill rate (tokens per second) — ~20 requests/minute. */
export const REFILL_PER_SEC = 20 / 60;
/** Buckets untouched for longer than this are pruned to bound memory. */
const STALE_MS = 10 * 60 * 1000;

const buckets = new Map<string, Bucket>();

function prune(now: number): void {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (now - bucket.updatedAt > STALE_MS) buckets.delete(key);
  }
}

/**
 * Consume one token for `key`. Pass `now` for deterministic testing.
 */
export function rateLimit(key: string, now: number = Date.now()): RateLimitResult {
  prune(now);
  const existing = buckets.get(key);
  const bucket: Bucket = existing ?? { tokens: BUCKET_CAPACITY, updatedAt: now };

  // Refill based on elapsed time, capped at capacity.
  const elapsedSec = Math.max(0, (now - bucket.updatedAt) / 1000);
  const refilled = Math.min(
    BUCKET_CAPACITY,
    bucket.tokens + elapsedSec * REFILL_PER_SEC,
  );

  if (refilled < 1) {
    const deficit = 1 - refilled;
    buckets.set(key, { tokens: refilled, updatedAt: now });
    return {
      allowed: false,
      retryAfterSec: Math.ceil(deficit / REFILL_PER_SEC),
      remaining: 0,
    };
  }

  const remaining = refilled - 1;
  buckets.set(key, { tokens: remaining, updatedAt: now });
  return { allowed: true, retryAfterSec: 0, remaining: Math.floor(remaining) };
}

/** Test-only: reset all buckets. */
export function __resetRateLimit(): void {
  buckets.clear();
}
