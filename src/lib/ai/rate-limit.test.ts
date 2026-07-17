import { describe, it, expect, beforeEach } from "vitest";
import {
  rateLimit,
  __resetRateLimit,
  BUCKET_CAPACITY,
} from "@/lib/ai/rate-limit";

describe("rateLimit token bucket", () => {
  beforeEach(() => __resetRateLimit());

  it("allows up to the burst capacity, then blocks", () => {
    const now = 1_000_000;
    for (let i = 0; i < BUCKET_CAPACITY; i++) {
      expect(rateLimit("ip-a", now).allowed).toBe(true);
    }
    const blocked = rateLimit("ip-a", now);
    expect(blocked.allowed).toBe(false);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
  });

  it("refills over time", () => {
    const start = 2_000_000;
    for (let i = 0; i < BUCKET_CAPACITY; i++) rateLimit("ip-b", start);
    expect(rateLimit("ip-b", start).allowed).toBe(false);
    // Wait long enough to refill at least one token (~3s at 20/min).
    const later = start + 5000;
    expect(rateLimit("ip-b", later).allowed).toBe(true);
  });

  it("tracks separate clients independently", () => {
    const now = 3_000_000;
    for (let i = 0; i < BUCKET_CAPACITY; i++) rateLimit("ip-c", now);
    expect(rateLimit("ip-c", now).allowed).toBe(false);
    expect(rateLimit("ip-d", now).allowed).toBe(true);
  });
});
