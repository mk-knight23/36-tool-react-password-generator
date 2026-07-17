import { randomString } from "@/lib/crypto/random";
import { ALPHABETS, dedupeChars, type AlphabetName } from "./charsets";
import { uniformEntropyBits, type GenerationResult } from "./types";

export interface RandomStringOptions {
  length: number;
  alphabet: AlphabetName | "custom";
  /** Used only when alphabet === "custom". */
  customAlphabet?: string;
}

export const DEFAULT_RANDOM_STRING_OPTIONS: RandomStringOptions = {
  length: 32,
  alphabet: "alnum",
  customAlphabet: "",
};

export const RANDOM_STRING = { minLength: 1, maxLength: 1024 } as const;

export class RandomStringOptionsError extends Error {}

export function resolveStringAlphabet(opts: RandomStringOptions): string {
  if (opts.alphabet === "custom") {
    const custom = dedupeChars(opts.customAlphabet ?? "");
    if (custom.length < 2) {
      throw new RandomStringOptionsError("A custom alphabet needs at least 2 distinct characters.");
    }
    return custom;
  }
  return ALPHABETS[opts.alphabet];
}

export function generateRandomString(opts: RandomStringOptions): GenerationResult {
  if (
    !Number.isInteger(opts.length) ||
    opts.length < RANDOM_STRING.minLength ||
    opts.length > RANDOM_STRING.maxLength
  ) {
    throw new RandomStringOptionsError(
      `Length must be between ${RANDOM_STRING.minLength} and ${RANDOM_STRING.maxLength}.`,
    );
  }
  const alphabet = resolveStringAlphabet(opts);
  return {
    value: randomString(alphabet, opts.length),
    entropyBits: uniformEntropyBits(alphabet.length, opts.length),
    entropyEstimated: false,
  };
}
