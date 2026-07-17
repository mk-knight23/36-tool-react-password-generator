import { detectPatterns, type PatternFinding } from "./patterns";
import { isCommonPassword } from "./common";
import { rawEntropyBits, effectiveEntropyBits, estimateCharsetSize } from "./entropy";
import { classifyStrength, type Strength } from "./strength";

export interface AnalysisResult {
  length: number;
  charsetSize: number;
  rawEntropyBits: number;
  effectiveEntropyBits: number;
  patterns: PatternFinding[];
  commonHit: boolean;
  strength: Strength;
  recommendations: string[];
}

function buildRecommendations(
  value: string,
  patterns: PatternFinding[],
  commonHit: boolean,
): string[] {
  const recs: string[] = [];
  if (commonHit) {
    recs.push("This is a well-known password. Pick something unique.");
  }
  if (value.length < 12) {
    recs.push("Use at least 12 characters; 16 or more is better.");
  }
  if (!/[A-Z]/.test(value)) recs.push("Add uppercase letters.");
  if (!/[a-z]/.test(value)) recs.push("Add lowercase letters.");
  if (!/[0-9]/.test(value)) recs.push("Add digits.");
  if (!/[^a-zA-Z0-9]/.test(value)) recs.push("Add symbols.");
  if (patterns.some((p) => p.kind === "repetition")) recs.push("Avoid repeated characters (aaa, 111).");
  if (patterns.some((p) => p.kind === "sequence")) recs.push("Avoid sequences (abcd, 1234).");
  if (patterns.some((p) => p.kind === "keyboard")) recs.push("Avoid keyboard runs (qwerty, asdf).");
  if (recs.length === 0) {
    recs.push("A generated passphrase or long random password is the strongest option.");
  }
  return recs;
}

/**
 * Fully local analysis of an arbitrary string. Never performs any network
 * request. The entropy figure is a heuristic estimate, not a guarantee.
 */
export function analyzePassword(value: string): AnalysisResult {
  const patterns = detectPatterns(value);
  const commonHit = isCommonPassword(value);
  const raw = rawEntropyBits(value);
  const effective = effectiveEntropyBits(value, patterns);
  return {
    length: value.length,
    charsetSize: estimateCharsetSize(value),
    rawEntropyBits: raw,
    effectiveEntropyBits: effective,
    patterns,
    commonHit,
    strength: classifyStrength(effective, commonHit),
    recommendations: buildRecommendations(value, patterns, commonHit),
  };
}
