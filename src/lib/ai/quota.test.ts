import { describe, it, expect, beforeEach } from "vitest";
import {
  getAiQuotaSnapshot,
  recordAiUse,
  clearAiQuota,
  canUseAi,
  AI_DAILY_LIMIT,
} from "@/lib/ai/quota";

describe("AI daily quota", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearAiQuota();
  });

  it("starts empty with the full allowance remaining", () => {
    const q = getAiQuotaSnapshot();
    expect(q.used).toBe(0);
    expect(q.remaining).toBe(AI_DAILY_LIMIT);
    expect(canUseAi()).toBe(true);
  });

  it("increments used and decrements remaining on record", () => {
    recordAiUse();
    recordAiUse();
    const q = getAiQuotaSnapshot();
    expect(q.used).toBe(2);
    expect(q.remaining).toBe(AI_DAILY_LIMIT - 2);
  });

  it("blocks once the daily limit is reached", () => {
    for (let i = 0; i < AI_DAILY_LIMIT; i++) recordAiUse();
    expect(canUseAi()).toBe(false);
    expect(getAiQuotaSnapshot().remaining).toBe(0);
  });

  it("clears back to empty", () => {
    recordAiUse();
    clearAiQuota();
    expect(getAiQuotaSnapshot().used).toBe(0);
    expect(canUseAi()).toBe(true);
  });
});
