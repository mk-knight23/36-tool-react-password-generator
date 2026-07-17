/**
 * Client helper for the AI explainer. It is the single place the browser talks
 * to `/api/ai/explain`, and it enforces the client half of the privacy contract
 * (PRODUCT_SPEC §6, STANDARDS §10):
 *
 * - Runs the secret-shape guard BEFORE any network call; a flagged question is
 *   never sent anywhere.
 * - Applies the courtesy daily quota (bypassed when the user supplies their own
 *   key, since that call is on their own account).
 * - Forwards an AbortSignal so the caller can cancel in-flight requests.
 * - Always resolves to a renderable outcome: when the AI is unavailable, the
 *   quota is spent, or the network fails, it returns the deterministic local
 *   explanation, clearly labeled as the built-in (non-AI) answer.
 */
import type { AiTopicId } from "@/lib/ai/topics";
import { getTopic } from "@/lib/ai/topics";
import type { ExplainError, PolicyInput } from "@/lib/ai/schema";
import { looksLikeSecret, secretGuardMessage } from "@/lib/ai/secret-guard";
import {
  canUseAi,
  recordAiUse,
  getAiQuotaSnapshot,
  type AiQuota,
} from "@/lib/ai/quota";
import { getByokSnapshot } from "@/lib/ai/byok";

export type FallbackReason = "unavailable" | "quota" | "rate_limited" | "error" | "network";

export type ExplainOutcome =
  | { kind: "ai"; answer: string; model?: string }
  | { kind: "fallback"; answer: string; reason: FallbackReason }
  | { kind: "refused"; message: string }
  | { kind: "canceled" };

export interface ExplainInput {
  topic: AiTopicId;
  question?: string;
  policy?: PolicyInput;
}

function fallback(topic: AiTopicId, reason: FallbackReason): ExplainOutcome {
  const t = getTopic(topic);
  return {
    kind: "fallback",
    answer: t?.fallback ?? "That explanation is not available right now.",
    reason,
  };
}

export async function requestExplain(
  input: ExplainInput,
  opts: { signal?: AbortSignal } = {},
): Promise<ExplainOutcome> {
  const question = input.question?.trim();

  // 1. Client-side secret guard — never send a secret-shaped question.
  if (question) {
    const guard = looksLikeSecret(question);
    if (guard.flagged && guard.reason) {
      return { kind: "refused", message: secretGuardMessage(guard.reason) };
    }
  }

  const byokKey = getByokSnapshot();

  // 2. Courtesy quota (skipped when the user brings their own key).
  if (!byokKey && !canUseAi()) {
    return fallback(input.topic, "quota");
  }

  const headers: Record<string, string> = { "content-type": "application/json" };
  if (byokKey) headers["x-byok-key"] = byokKey;

  const body: ExplainInput = { topic: input.topic };
  if (question) body.question = question;
  if (input.policy) body.policy = input.policy;

  let res: Response;
  try {
    res = await fetch("/api/ai/explain", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      signal: opts.signal,
    });
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { kind: "canceled" };
    }
    return fallback(input.topic, "network");
  }

  if (res.status === 200) {
    const data = (await res.json()) as { answer: string; model?: string };
    if (!byokKey) recordAiUse();
    return { kind: "ai", answer: data.answer, model: data.model };
  }

  let err: ExplainError | null = null;
  try {
    err = (await res.json()) as ExplainError;
  } catch {
    err = null;
  }

  if (err?.code === "secret_rejected") {
    return {
      kind: "refused",
      message:
        "That looks like it may contain a secret, so it was not sent. Ask about the concept instead.",
    };
  }
  if (err?.code === "rate_limited") return fallback(input.topic, "rate_limited");
  if (err?.code === "ai_unavailable") return fallback(input.topic, "unavailable");
  return fallback(input.topic, "error");
}

export function currentQuota(): AiQuota {
  return getAiQuotaSnapshot();
}
