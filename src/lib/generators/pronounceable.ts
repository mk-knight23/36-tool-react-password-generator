import { pick, randomChar, randomInt } from "@/lib/crypto/random";
import { CHARSETS } from "./charsets";
import { type GenerationResult } from "./types";

/**
 * Pronounceable generator.
 *
 * Fixes AUDIT.md §2 finding 1 & broken-functionality note: the legacy code used
 * `Math.random` and picked a single character out of the string
 * "cv vc cvc vcc ccv" (often a space) instead of one whole pattern. Here we pick
 * a whole syllable pattern each step, using Web Crypto only.
 */
const CONSONANTS = "bcdfghjklmnpqrstvwxyz"; // 21
const VOWELS = "aeiou"; // 5
const PATTERNS = ["cv", "vc", "cvc", "cvv", "vcc", "cvcv"] as const;

export interface PronounceableOptions {
  length: number;
  capitalize: boolean;
  appendDigits: number;
}

export const DEFAULT_PRONOUNCEABLE_OPTIONS: PronounceableOptions = {
  length: 16,
  capitalize: false,
  appendDigits: 0,
};

export const PRONOUNCEABLE = { minLength: 8, maxLength: 32, maxDigits: 6 } as const;

export class PronounceableOptionsError extends Error {}

export function generatePronounceable(opts: PronounceableOptions): GenerationResult {
  if (
    !Number.isInteger(opts.length) ||
    opts.length < PRONOUNCEABLE.minLength ||
    opts.length > PRONOUNCEABLE.maxLength
  ) {
    throw new PronounceableOptionsError(
      `Length must be between ${PRONOUNCEABLE.minLength} and ${PRONOUNCEABLE.maxLength}.`,
    );
  }
  if (
    !Number.isInteger(opts.appendDigits) ||
    opts.appendDigits < 0 ||
    opts.appendDigits > PRONOUNCEABLE.maxDigits
  ) {
    throw new PronounceableOptionsError(
      `Appended digits must be between 0 and ${PRONOUNCEABLE.maxDigits}.`,
    );
  }

  const chars: string[] = [];
  const perCharBits: number[] = [];

  while (chars.length < opts.length) {
    const pattern = pick(PATTERNS);
    for (const slot of pattern) {
      if (slot === "c") {
        chars.push(randomChar(CONSONANTS));
        perCharBits.push(Math.log2(CONSONANTS.length));
      } else {
        chars.push(randomChar(VOWELS));
        perCharBits.push(Math.log2(VOWELS.length));
      }
    }
  }

  // Trim to the exact requested length; only count entropy for kept characters.
  const kept = chars.slice(0, opts.length);
  let bits = 0;
  for (let i = 0; i < opts.length; i++) bits += perCharBits[i];

  let value = kept.join("");
  if (opts.capitalize) value = value.charAt(0).toUpperCase() + value.slice(1);

  if (opts.appendDigits > 0) {
    let digits = "";
    for (let i = 0; i < opts.appendDigits; i++) {
      digits += CHARSETS.digits.charAt(randomInt(10));
    }
    value += digits;
    bits += opts.appendDigits * Math.log2(10);
  }

  // Estimated: the syllable model is not a flat alphabet, so this is a modelled
  // estimate, not the exact-uniform figure other modes report.
  return { value, entropyBits: bits, entropyEstimated: true };
}
