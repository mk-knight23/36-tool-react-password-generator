/**
 * Integration tests for the AI route handler `POST /api/ai/explain`.
 *
 * These exercise the request pipeline directly (no live server, no network) and
 * guard the security-critical paths that must never regress:
 *
 * - Graceful degradation when no gateway credential is present (503).
 * - Physical secret rejection for a secret-shaped question (422), with no echo.
 * - Rejection of smuggled/unknown fields and bad enums (400).
 * - Non-JSON bodies (400) and non-POST methods (405).
 * - Best-effort per-client rate limiting (429 with Retry-After).
 *
 * The success (200) and gateway-error (502) paths require a real gateway
 * credential and outbound call, so they are covered by runtime verification and
 * documented in AI_ARCHITECTURE.md rather than mocked here.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { POST, GET } from "./route";
import { __resetRateLimit, BUCKET_CAPACITY } from "@/lib/ai/rate-limit";
import type { ExplainError } from "@/lib/ai/schema";

const URL = "https://vaultpass.mkazi.live/api/ai/explain";

/** Build a POST Request with a JSON body and a distinct client IP per test. */
function post(body: unknown, ip = "198.51.100.1", headers: Record<string, string> = {}): Request {
  return new Request(URL, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": ip,
      ...headers,
    },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

async function readError(res: Response): Promise<ExplainError> {
  return (await res.json()) as ExplainError;
}

describe("POST /api/ai/explain", () => {
  beforeEach(() => {
    __resetRateLimit();
    // Ensure the "no credential" path is deterministic regardless of the host
    // environment: strip any gateway credentials for these tests.
    vi.stubEnv("AI_GATEWAY_API_KEY", "");
    vi.stubEnv("VERCEL_OIDC_TOKEN", "");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("degrades to 503 ai_unavailable when no gateway credential is present", async () => {
    const res = await POST(post({ topic: "password-strength" }, "ip-503"));
    expect(res.status).toBe(503);
    expect((await readError(res)).code).toBe("ai_unavailable");
  });

  it("rejects a secret-shaped question with 422 and never echoes it back", async () => {
    const secret = "aB3xK9mP2qR7tW1z";
    const res = await POST(
      post({ topic: "password-strength", question: `is ${secret} strong` }, "ip-422"),
    );
    expect(res.status).toBe(422);
    const body = await res.text();
    expect(JSON.parse(body).code).toBe("secret_rejected");
    // The offending value must not appear anywhere in the response.
    expect(body).not.toContain(secret);
  });

  it("rejects a smuggled unknown field with 400 (strictObject)", async () => {
    const res = await POST(
      post({ topic: "password-strength", secret: "leak-me" }, "ip-400a"),
    );
    expect(res.status).toBe(400);
    expect((await readError(res)).code).toBe("invalid_request");
  });

  it("rejects an unknown topic enum with 400", async () => {
    const res = await POST(post({ topic: "not-a-real-topic" }, "ip-400b"));
    expect(res.status).toBe(400);
    expect((await readError(res)).code).toBe("invalid_request");
  });

  it("rejects a non-JSON body with 400", async () => {
    const res = await POST(post("this is not json", "ip-400c"));
    expect(res.status).toBe(400);
    expect((await readError(res)).code).toBe("invalid_request");
  });

  it("rejects GET with 405", async () => {
    const res = GET();
    expect(res.status).toBe(405);
    expect((await readError(res)).code).toBe("invalid_request");
  });

  it("rate-limits a single client after the burst capacity with Retry-After", async () => {
    const ip = "ip-429";
    for (let i = 0; i < BUCKET_CAPACITY; i++) {
      const ok = await POST(post({ topic: "entropy-explained" }, ip));
      // Each is allowed by the limiter (then 503 for lack of a credential).
      expect(ok.status).toBe(503);
    }
    const limited = await POST(post({ topic: "entropy-explained" }, ip));
    expect(limited.status).toBe(429);
    expect((await readError(limited)).code).toBe("rate_limited");
    expect(limited.headers.get("retry-after")).toBeTruthy();
  });

  it("does not consume another client's rate-limit budget", async () => {
    for (let i = 0; i < BUCKET_CAPACITY; i++) {
      await POST(post({ topic: "entropy-explained" }, "ip-heavy"));
    }
    // A different client still has its full budget.
    const other = await POST(post({ topic: "entropy-explained" }, "ip-light"));
    expect(other.status).toBe(503);
  });
});
