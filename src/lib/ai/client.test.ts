import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { requestExplain, currentQuota } from "./client";
import { clearByokKey, saveByokKey } from "./byok";
import { clearAiQuota, recordAiUse, AI_DAILY_LIMIT } from "./quota";

// A 40-char hex run that the secret-shape guard must flag.
const SECRET_SHAPED = "0123456789abcdef0123456789abcdef01234567";

function mockFetch(): ReturnType<typeof vi.fn> {
  const fn = vi.fn();
  global.fetch = fn as unknown as typeof fetch;
  return fn;
}

describe("ai/client requestExplain", () => {
  beforeEach(() => {
    window.localStorage.clear();
    clearByokKey();
    clearAiQuota();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("refuses a secret-shaped question and makes NO network call", async () => {
    const fetchFn = mockFetch();
    const out = await requestExplain({
      topic: "password-strength",
      question: SECRET_SHAPED,
    });
    expect(out.kind).toBe("refused");
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("returns the deterministic local fallback when the daily quota is spent", async () => {
    const fetchFn = mockFetch();
    for (let i = 0; i < AI_DAILY_LIMIT; i++) recordAiUse();
    const out = await requestExplain({ topic: "entropy-explained" });
    expect(out).toMatchObject({ kind: "fallback", reason: "quota" });
    expect(fetchFn).not.toHaveBeenCalled();
  });

  it("returns the AI answer and consumes one quota use on a 200 response", async () => {
    const fetchFn = mockFetch();
    fetchFn.mockResolvedValue({
      status: 200,
      json: async () => ({ answer: "Length matters most.", model: "anthropic/claude-haiku-4.5" }),
    });
    const out = await requestExplain({ topic: "entropy-explained" });
    expect(out).toEqual({
      kind: "ai",
      answer: "Length matters most.",
      model: "anthropic/claude-haiku-4.5",
    });
    expect(currentQuota().used).toBe(1);
  });

  it("falls back locally with reason 'network' when fetch throws", async () => {
    const fetchFn = mockFetch();
    fetchFn.mockRejectedValue(new TypeError("Failed to fetch"));
    const out = await requestExplain({ topic: "wifi-passwords" });
    expect(out).toMatchObject({ kind: "fallback", reason: "network" });
  });

  it("reports 'canceled' when the request is aborted", async () => {
    const fetchFn = mockFetch();
    fetchFn.mockRejectedValue(new DOMException("aborted", "AbortError"));
    const out = await requestExplain({ topic: "wifi-passwords" });
    expect(out.kind).toBe("canceled");
  });

  it("maps a server secret_rejected error to a refusal", async () => {
    const fetchFn = mockFetch();
    fetchFn.mockResolvedValue({ status: 422, json: async () => ({ code: "secret_rejected" }) });
    const out = await requestExplain({ topic: "api-tokens" });
    expect(out.kind).toBe("refused");
  });

  it("maps rate_limited, ai_unavailable, and unknown codes to labelled fallbacks", async () => {
    const fetchFn = mockFetch();

    fetchFn.mockResolvedValueOnce({ status: 429, json: async () => ({ code: "rate_limited" }) });
    expect(await requestExplain({ topic: "api-tokens" })).toMatchObject({
      kind: "fallback",
      reason: "rate_limited",
    });

    fetchFn.mockResolvedValueOnce({ status: 503, json: async () => ({ code: "ai_unavailable" }) });
    expect(await requestExplain({ topic: "api-tokens" })).toMatchObject({
      kind: "fallback",
      reason: "unavailable",
    });

    fetchFn.mockResolvedValueOnce({ status: 500, json: async () => ({ code: "kaboom" }) });
    expect(await requestExplain({ topic: "api-tokens" })).toMatchObject({
      kind: "fallback",
      reason: "error",
    });
  });

  it("with a BYOK key, sends the key header and does not consume the courtesy quota", async () => {
    const fetchFn = mockFetch();
    saveByokKey("vck_user_key");
    fetchFn.mockResolvedValue({ status: 200, json: async () => ({ answer: "ok" }) });
    const out = await requestExplain({ topic: "entropy-explained" });
    expect(out.kind).toBe("ai");
    expect(currentQuota().used).toBe(0);
    const init = fetchFn.mock.calls[0][1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers["x-byok-key"]).toBe("vck_user_key");
  });
});
