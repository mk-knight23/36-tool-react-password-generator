import { randomString } from "@/lib/crypto/random";
import { uniformEntropyBits } from "./types";

// Crockford-style base32 minus visually ambiguous characters, uppercase for
// legible printing. 30 symbols → ~4.9 bits per character.
const RECOVERY_ALPHABET = "ABCDEFGHJKMNPQRSTVWXYZ23456789";

export interface RecoveryCodeOptions {
  count: number;
  /** Characters per group. */
  groupSize: number;
  /** Number of groups per code (joined by "-"). */
  groups: number;
}

export const DEFAULT_RECOVERY_OPTIONS: RecoveryCodeOptions = {
  count: 10,
  groupSize: 5,
  groups: 2,
};

export const RECOVERY = {
  minCount: 1,
  maxCount: 50,
  minGroupSize: 3,
  maxGroupSize: 8,
  minGroups: 1,
  maxGroups: 6,
} as const;

export class RecoveryOptionsError extends Error {}

export interface RecoveryCodesResult {
  codes: string[];
  /** Entropy of a single code. */
  entropyBitsPerCode: number;
  alphabetSize: number;
}

export function generateRecoveryCodes(opts: RecoveryCodeOptions): RecoveryCodesResult {
  if (opts.count < RECOVERY.minCount || opts.count > RECOVERY.maxCount) {
    throw new RecoveryOptionsError(
      `Count must be between ${RECOVERY.minCount} and ${RECOVERY.maxCount}.`,
    );
  }
  if (opts.groupSize < RECOVERY.minGroupSize || opts.groupSize > RECOVERY.maxGroupSize) {
    throw new RecoveryOptionsError(
      `Group size must be between ${RECOVERY.minGroupSize} and ${RECOVERY.maxGroupSize}.`,
    );
  }
  if (opts.groups < RECOVERY.minGroups || opts.groups > RECOVERY.maxGroups) {
    throw new RecoveryOptionsError(
      `Groups must be between ${RECOVERY.minGroups} and ${RECOVERY.maxGroups}.`,
    );
  }

  const totalChars = opts.groupSize * opts.groups;
  const codes: string[] = [];
  for (let i = 0; i < opts.count; i++) {
    const parts: string[] = [];
    for (let g = 0; g < opts.groups; g++) {
      parts.push(randomString(RECOVERY_ALPHABET, opts.groupSize));
    }
    codes.push(parts.join("-"));
  }

  return {
    codes,
    entropyBitsPerCode: uniformEntropyBits(RECOVERY_ALPHABET.length, totalChars),
    alphabetSize: RECOVERY_ALPHABET.length,
  };
}
