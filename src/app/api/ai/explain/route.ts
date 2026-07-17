/**
 * POST /api/ai/explain — the single AI route for MK VaultPass (PRODUCT_SPEC §6,
 * STANDARDS §10).
 *
 * Guarantees enforced here:
 * - The request schema is physically unable to carry a secret (enum topic,
 *   numeric/boolean policy, guarded + length-capped question). See schema.ts.
 * - Best-effort per-instance rate limiting by client IP.
 * - Graceful, honest degradation: with no gateway credentials (env key, Vercel
 *   OIDC, or a BYOK header) the route returns 503 `ai_unavailable` and the
 *   client shows the deterministic local explanation instead.
 * - BYOK: an optional `x-byok-key` header is used only to authenticate this one
 *   gateway call. It is never logged, never stored, and never echoed back.
 * - Cancellation: the caller's abort signal is forwarded to the model call.
 * - Errors are structured and leak nothing about inputs or credentials.
 */
import { generateText, createGateway } from "ai";
import {
  explainRequestSchema,
  type ExplainError,
  type ExplainSuccess,
} from "@/lib/ai/schema";
import { looksLikeSecret } from "@/lib/ai/secret-guard";
import { buildPrompt } from "@/lib/ai/prompt";
import { rateLimit } from "@/lib/ai/rate-limit";
import { POLICY_TOPIC_ID } from "@/lib/ai/topics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DEFAULT_MODEL = "anthropic/claude-haiku-4.5";
const DEFAULT_MODEL_QUALITY = "anthropic/claude-sonnet-4-5";
const MAX_OUTPUT_TOKENS = 700;

function json(body: ExplainSuccess | ExplainError, status: number, headers?: HeadersInit): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}

function clientKey(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "unknown";
}

/** True when some gateway credential is available (env key, OIDC, or BYOK). */
function hasGatewayCredential(byokKey: string | null): boolean {
  return Boolean(
    byokKey ||
      process.env.AI_GATEWAY_API_KEY ||
      process.env.VERCEL_OIDC_TOKEN,
  );
}

function isAbort(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "AbortError" || error.name === "TimeoutError")
  );
}

export async function POST(req: Request): Promise<Response> {
  // --- Rate limit (best-effort, per instance) ---
  const limit = rateLimit(clientKey(req));
  if (!limit.allowed) {
    return json(
      { error: "Too many requests. Please wait a moment and try again.", code: "rate_limited" },
      429,
      { "retry-after": String(limit.retryAfterSec) },
    );
  }

  // --- Parse + validate (physical secret rejection) ---
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return json({ error: "Request body must be JSON.", code: "invalid_request" }, 400);
  }

  const parsed = explainRequestSchema.safeParse(raw);
  if (!parsed.success) {
    // Distinguish a secret-shaped question from other validation errors so the
    // UI can explain the refusal — without echoing the offending value.
    const q =
      raw && typeof raw === "object" && "question" in raw
        ? (raw as { question?: unknown }).question
        : undefined;
    if (typeof q === "string" && looksLikeSecret(q).flagged) {
      return json(
        {
          error:
            "That looks like it may contain a secret, so it was not sent anywhere. Ask about the concept instead.",
          code: "secret_rejected",
        },
        422,
      );
    }
    return json({ error: "That request was not valid.", code: "invalid_request" }, 400);
  }
  const request = parsed.data;

  // --- Availability / graceful degradation ---
  const byokKey = req.headers.get("x-byok-key")?.trim() || null;
  if (!hasGatewayCredential(byokKey)) {
    return json(
      {
        error: "AI answers are not available right now. Showing the built-in explanation.",
        code: "ai_unavailable",
      },
      503,
    );
  }

  // --- Model selection (slugs are config, not code) ---
  const modelId =
    request.topic === POLICY_TOPIC_ID
      ? process.env.AI_MODEL_QUALITY || DEFAULT_MODEL_QUALITY
      : process.env.AI_MODEL || DEFAULT_MODEL;

  // BYOK: build a gateway bound to the user's key for this call only. The key is
  // never logged or stored. Without BYOK, the plain model slug uses the env key
  // or Vercel OIDC.
  const model = byokKey ? createGateway({ apiKey: byokKey })(modelId) : modelId;

  const { system, prompt } = buildPrompt(request);

  try {
    const result = await generateText({
      model,
      system,
      prompt,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      temperature: 0.4,
      abortSignal: req.signal,
    });
    const answer = result.text.trim();
    if (!answer) {
      return json(
        { error: "The AI service returned an empty answer. Showing the built-in explanation.", code: "ai_error" },
        502,
      );
    }
    return json({ answer, source: "ai", model: modelId }, 200);
  } catch (error: unknown) {
    if (isAbort(error) || req.signal.aborted) {
      // Client canceled; nothing to return to.
      return new Response(null, { status: 499 });
    }
    // Never leak inputs or credentials in the response. A wrong BYOK key is the
    // one case worth hinting at so the user can fix it.
    const authFailed =
      error instanceof Error && /authentication|forbidden|unauthorized|api key/i.test(error.message);
    return json(
      {
        error: byokKey && authFailed
          ? "The AI service rejected your key. Check the key in Settings, or clear it to use the built-in explanation."
          : "The AI service could not be reached. Showing the built-in explanation.",
        code: "ai_error",
      },
      502,
    );
  }
}

/** Reject non-POST methods explicitly. */
export function GET(): Response {
  return json({ error: "Use POST.", code: "invalid_request" }, 405);
}
