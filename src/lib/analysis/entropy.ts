import { detectPatterns, type PatternFinding } from "./patterns";

/** Estimate the alphabet size a string appears to draw from. */
export function estimateCharsetSize(value: string): number {
  let size = 0;
  if (/[a-z]/.test(value)) size += 26;
  if (/[A-Z]/.test(value)) size += 26;
  if (/[0-9]/.test(value)) size += 10;
  if (/[^a-zA-Z0-9]/.test(value)) size += 32; // approximate printable-symbol span
  return size;
}

/** Naive charset entropy: length × log2(charset size). */
export function rawEntropyBits(value: string): number {
  if (!value) return 0;
  const size = estimateCharsetSize(value);
  if (size <= 1) return 0;
  return value.length * Math.log2(size);
}

/**
 * Effective entropy: charset entropy minus a rough penalty for detected
 * structure (repetition, sequences, keyboard runs). This is a heuristic
 * estimate for analysis of user-supplied strings — clearly labelled as such in
 * the UI — not a claim about generated secrets (which report exact model bits).
 */
export function effectiveEntropyBits(
  value: string,
  patterns: PatternFinding[] = detectPatterns(value),
): number {
  const raw = rawEntropyBits(value);
  if (raw === 0) return 0;

  // Characters that sit inside a detected pattern carry far less information.
  // Count them and discount their contribution to ~1.5 bits each.
  const perChar = raw / value.length;
  let patternedChars = 0;
  for (const p of patterns) patternedChars += p.fragment.length;
  patternedChars = Math.min(patternedChars, value.length);

  const discounted = patternedChars * Math.max(0, perChar - 1.5);
  return Math.max(0, raw - discounted);
}
