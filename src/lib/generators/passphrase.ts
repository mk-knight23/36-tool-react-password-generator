import { pick, randomInt } from "@/lib/crypto/random";
import { EFF_LARGE_WORDLIST, EFF_WORDLIST_SIZE } from "./wordlist";
import { CHARSETS } from "./charsets";
import { type GenerationResult } from "./types";

export type CapitalizeMode = "none" | "first" | "all";

export interface PassphraseOptions {
  wordCount: number;
  separator: string;
  capitalize: CapitalizeMode;
  /** Number of random digits appended to the end (0 = none). */
  appendDigits: number;
}

export const DEFAULT_PASSPHRASE_OPTIONS: PassphraseOptions = {
  wordCount: 5,
  separator: "-",
  capitalize: "none",
  appendDigits: 0,
};

export const PASSPHRASE = {
  minWords: 3,
  maxWords: 10,
  maxDigits: 8,
} as const;

export class PassphraseOptionsError extends Error {}

function capitalizeWord(word: string, mode: CapitalizeMode): string {
  if (mode === "all") return word.toUpperCase();
  if (mode === "first") return word.charAt(0).toUpperCase() + word.slice(1);
  return word;
}

export function generatePassphrase(opts: PassphraseOptions): GenerationResult {
  if (
    !Number.isInteger(opts.wordCount) ||
    opts.wordCount < PASSPHRASE.minWords ||
    opts.wordCount > PASSPHRASE.maxWords
  ) {
    throw new PassphraseOptionsError(
      `Word count must be between ${PASSPHRASE.minWords} and ${PASSPHRASE.maxWords}.`,
    );
  }
  if (
    !Number.isInteger(opts.appendDigits) ||
    opts.appendDigits < 0 ||
    opts.appendDigits > PASSPHRASE.maxDigits
  ) {
    throw new PassphraseOptionsError(
      `Appended digits must be between 0 and ${PASSPHRASE.maxDigits}.`,
    );
  }

  const chosen: string[] = [];
  for (let i = 0; i < opts.wordCount; i++) {
    // Independent draw per word (repetition allowed, as in diceware).
    chosen.push(capitalizeWord(pick(EFF_LARGE_WORDLIST), opts.capitalize));
  }

  let value = chosen.join(opts.separator);

  // Appended digits use FRESH draws, never a value reused for another purpose
  // (legacy AUDIT.md §2 finding 5 reused one random value for two decisions).
  let digitBits = 0;
  if (opts.appendDigits > 0) {
    let digits = "";
    for (let i = 0; i < opts.appendDigits; i++) {
      digits += CHARSETS.digits.charAt(randomInt(10));
    }
    value += opts.separator + digits;
    digitBits = opts.appendDigits * Math.log2(10);
  }

  // Entropy is words × log2(7776). Capitalization is a deterministic transform
  // of the chosen words, so it adds no entropy — we do not overstate it.
  const wordBits = opts.wordCount * Math.log2(EFF_WORDLIST_SIZE);

  return {
    value,
    entropyBits: wordBits + digitBits,
    entropyEstimated: false,
  };
}
