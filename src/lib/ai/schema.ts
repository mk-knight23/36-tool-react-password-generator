/**
 * Request/response contract for `POST /api/ai/explain` (PRODUCT_SPEC §6).
 *
 * The schema is the primary, physical guarantee that the AI route cannot
 * receive a secret:
 *
 * - `topic` is an enum — no free text.
 * - `policy` is a strict object of numbers and booleans only; there is no
 *   free-text field on it, and unknown keys are rejected.
 * - `question` is the only free-text field: capped at 280 characters and passed
 *   through the shared secret-shape guard (see `secret-guard.ts`), the same
 *   check the client runs before sending.
 *
 * `strictObject` means any extra field a caller tries to smuggle in is rejected
 * outright rather than ignored.
 */
import { z } from "zod";
import { AI_TOPIC_IDS } from "@/lib/ai/topics";
import { looksLikeSecret } from "@/lib/ai/secret-guard";

export const MAX_QUESTION_LENGTH = 280;

/**
 * Structured password policy — numbers and enums/booleans only, no free-text
 * fields, so it can never carry a secret.
 */
export const policySchema = z
  .strictObject({
    minLength: z.number().int().min(1).max(256),
    requireUpper: z.boolean(),
    requireLower: z.boolean(),
    requireDigit: z.boolean(),
    requireSymbol: z.boolean(),
    rotationDays: z.number().int().min(0).max(3650).optional(),
  })
  .describe("Password policy composed of numeric and boolean rules only");

export type PolicyInput = z.infer<typeof policySchema>;

export const explainRequestSchema = z.strictObject({
  topic: z.enum(AI_TOPIC_IDS),
  question: z
    .string()
    .max(MAX_QUESTION_LENGTH)
    .trim()
    .refine((q) => !looksLikeSecret(q).flagged, {
      message: "Question rejected: it looks like it may contain a secret.",
    })
    .optional(),
  policy: policySchema.optional(),
});

export type ExplainRequest = z.infer<typeof explainRequestSchema>;

/** The source of an answer, surfaced honestly in the UI. */
export type AnswerSource = "ai" | "fallback";

export interface ExplainSuccess {
  answer: string;
  source: AnswerSource;
  /** Present only for AI answers; the resolved gateway model slug. */
  model?: string;
}

export type ExplainErrorCode =
  | "invalid_request"
  | "secret_rejected"
  | "rate_limited"
  | "ai_unavailable"
  | "ai_error";

export interface ExplainError {
  error: string;
  code: ExplainErrorCode;
}
