import { randomString } from "@/lib/crypto/random";
import { CHARSETS, AMBIGUOUS, dedupeChars, removeChars } from "./charsets";
import { uniformEntropyBits, type GenerationResult } from "./types";

export interface PasswordOptions {
  length: number;
  uppercase: boolean;
  lowercase: boolean;
  digits: boolean;
  symbols: boolean;
  /** Drop visually ambiguous characters (il1Lo0O …). */
  excludeAmbiguous: boolean;
  /** Guarantee at least one character from every selected set. */
  requireEachSet: boolean;
  /** Extra characters to add to the alphabet and require (optional). */
  customInclude?: string;
  /** Characters to remove from the alphabet entirely. */
  excludeChars?: string;
}

export const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  digits: true,
  symbols: true,
  excludeAmbiguous: false,
  requireEachSet: true,
  customInclude: "",
  excludeChars: "",
};

export const PASSWORD_LENGTH = { min: 8, max: 128 } as const;

interface CharSetSpec {
  key: string;
  chars: string;
}

function buildSets(opts: PasswordOptions): CharSetSpec[] {
  const filters = (s: string): string => {
    let out = s;
    if (opts.excludeAmbiguous) out = removeChars(out, AMBIGUOUS);
    if (opts.excludeChars) out = removeChars(out, opts.excludeChars);
    return out;
  };

  const sets: CharSetSpec[] = [];
  if (opts.uppercase) sets.push({ key: "uppercase", chars: filters(CHARSETS.uppercase) });
  if (opts.lowercase) sets.push({ key: "lowercase", chars: filters(CHARSETS.lowercase) });
  if (opts.digits) sets.push({ key: "digits", chars: filters(CHARSETS.digits) });
  if (opts.symbols) sets.push({ key: "symbols", chars: filters(CHARSETS.symbols) });
  if (opts.customInclude && opts.customInclude.length > 0) {
    const custom = filters(dedupeChars(opts.customInclude));
    if (custom.length > 0) sets.push({ key: "custom", chars: custom });
  }
  return sets.filter((s) => s.chars.length > 0);
}

export class PasswordOptionsError extends Error {}

/**
 * Validate options and return the effective alphabet + active sets, or throw a
 * `PasswordOptionsError` with a user-facing message.
 */
export function resolvePasswordAlphabet(opts: PasswordOptions): {
  alphabet: string;
  sets: CharSetSpec[];
} {
  if (
    !Number.isInteger(opts.length) ||
    opts.length < PASSWORD_LENGTH.min ||
    opts.length > PASSWORD_LENGTH.max
  ) {
    throw new PasswordOptionsError(
      `Length must be between ${PASSWORD_LENGTH.min} and ${PASSWORD_LENGTH.max}.`,
    );
  }
  const sets = buildSets(opts);
  if (sets.length === 0) {
    throw new PasswordOptionsError("Select at least one character set.");
  }
  const alphabet = dedupeChars(sets.map((s) => s.chars).join(""));
  if (alphabet.length === 0) {
    throw new PasswordOptionsError(
      "The exclusion rules removed every available character. Loosen them.",
    );
  }
  if (opts.requireEachSet && sets.length > opts.length) {
    throw new PasswordOptionsError(
      `Length must be at least ${sets.length} to include one character from each selected set.`,
    );
  }
  return { alphabet, sets };
}

function satisfiesEachSet(password: string, sets: CharSetSpec[]): boolean {
  return sets.every((set) => {
    const setChars = new Set(set.chars);
    for (const ch of password) {
      if (setChars.has(ch)) return true;
    }
    return false;
  });
}

/**
 * Generate a password.
 *
 * When `requireEachSet` is on we generate the whole password and, if it is
 * missing a required set, regenerate the whole thing (rejection). We never
 * splice a character in at a fixed position, which would bias that position and
 * leak structure — the exact class of bug we are avoiding.
 */
export function generatePassword(opts: PasswordOptions): GenerationResult {
  const { alphabet, sets } = resolvePasswordAlphabet(opts);
  const entropyBits = uniformEntropyBits(alphabet.length, opts.length);

  if (!opts.requireEachSet || sets.length <= 1) {
    return {
      value: randomString(alphabet, opts.length),
      entropyBits,
      entropyEstimated: false,
    };
  }

  // Bounded rejection: with length >= number of sets, success is overwhelmingly
  // likely within a few tries; the cap prevents a pathological infinite loop.
  const maxAttempts = 1000;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const candidate = randomString(alphabet, opts.length);
    if (satisfiesEachSet(candidate, sets)) {
      return { value: candidate, entropyBits, entropyEstimated: false };
    }
  }
  throw new PasswordOptionsError(
    "Could not satisfy the character-set requirements. Increase length or reduce required sets.",
  );
}
