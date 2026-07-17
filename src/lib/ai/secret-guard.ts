/**
 * Secret-shape guard (PRODUCT_SPEC §6, STANDARDS §8).
 *
 * The AI request schema is *physically* unable to carry a secret: `topic` is an
 * enum and `policy` holds only numbers and booleans. The only free-text field,
 * `question`, is length-capped and passed through this guard both on the client
 * (before anything is sent) and on the server (inside the zod `.refine`). The
 * guard refuses any string that looks like generated output — a token-like run,
 * a hex/base64 run, or a passphrase — so a user cannot accidentally paste a
 * secret into a question. Refused strings are never transmitted or logged.
 *
 * This module has NO imports and does no I/O so it can run identically in the
 * browser and on the server.
 */

export interface SecretGuardResult {
  /** True when the text looks like it may contain a generated secret. */
  flagged: boolean;
  /** Machine-readable reason (present only when flagged). */
  reason?: SecretGuardReason;
}

export type SecretGuardReason =
  | "hex-run"
  | "base64-run"
  | "mixed-token"
  | "passphrase"
  | "single-long-value";

/** Minimum length of a whitespace-free token before mixed-class rules apply. */
const MIXED_TOKEN_MIN = 12;
/** Minimum length for hex / base64-looking runs. */
const ENCODED_RUN_MIN = 16;
/** A whole input with no spaces this long is treated as a single pasted value. */
const NO_SPACE_BACKSTOP_MIN = 24;

function classCount(token: string): number {
  let classes = 0;
  if (/[a-z]/.test(token)) classes++;
  if (/[A-Z]/.test(token)) classes++;
  if (/[0-9]/.test(token)) classes++;
  // Any non-alphanumeric, non-space character counts as a symbol class.
  if (/[^A-Za-z0-9\s]/.test(token)) classes++;
  return classes;
}

function inspectToken(token: string): SecretGuardReason | null {
  if (token.length >= ENCODED_RUN_MIN && /^[0-9a-fA-F]+$/.test(token)) {
    return "hex-run";
  }
  // Generated passphrase: several word-like segments joined by - . or _
  // (checked before the base64 rule, since dashes also satisfy base64url).
  const parts = token.split(/[-._]/);
  const wordSegments = parts.filter((s) => /^[A-Za-z]{2,}$/.test(s));
  if (wordSegments.length >= 4 && wordSegments.length === parts.length) {
    return "passphrase";
  }
  if (
    token.length >= ENCODED_RUN_MIN &&
    /^[A-Za-z0-9+/=_-]+$/.test(token) &&
    classCount(token) >= 2
  ) {
    // base64 / base64url / random-string output (mixed alnum, no spaces).
    return "base64-run";
  }
  if (token.length >= MIXED_TOKEN_MIN && classCount(token) >= 3) {
    return "mixed-token";
  }
  return null;
}

/**
 * Inspect free text for secret-shaped content.
 *
 * Real natural-language questions ("what does 12 bits mean?", "is a 16 char
 * minimum enough?") pass; pasted generated secrets do not.
 */
export function looksLikeSecret(text: string): SecretGuardResult {
  const trimmed = text.trim();
  if (trimmed.length === 0) return { flagged: false };

  // Backstop: a long value with no whitespace at all is treated as one pasted
  // secret, even when it is a single character class (e.g. a lowercase random
  // string or a dotted passphrase).
  if (!/\s/.test(trimmed) && trimmed.length >= NO_SPACE_BACKSTOP_MIN) {
    return { flagged: true, reason: "single-long-value" };
  }

  for (const token of trimmed.split(/\s+/)) {
    const reason = inspectToken(token);
    if (reason) return { flagged: true, reason };
  }
  return { flagged: false };
}

const REASON_MESSAGE: Record<SecretGuardReason, string> = {
  "hex-run":
    "That looks like a hex-encoded secret. Ask about the concept instead — never paste a real secret here.",
  "base64-run":
    "That looks like a generated token. Ask about the concept instead — never paste a real secret here.",
  "mixed-token":
    "That looks like a generated password. Ask about the concept instead — never paste a real secret here.",
  passphrase:
    "That looks like a generated passphrase. Ask about the concept instead — never paste a real secret here.",
  "single-long-value":
    "That looks like a secret value. Ask about the concept instead — never paste a real secret here.",
};

/** User-facing explanation for a refusal (safe to show; echoes nothing back). */
export function secretGuardMessage(reason: SecretGuardReason): string {
  return REASON_MESSAGE[reason];
}
