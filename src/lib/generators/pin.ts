import { randomInt } from "@/lib/crypto/random";
import { type GenerationResult } from "./types";

export interface PinOptions {
  length: number;
  /** Reject trivial PINs (all-same, straight sequences). */
  forbidTrivial: boolean;
}

export const DEFAULT_PIN_OPTIONS: PinOptions = { length: 6, forbidTrivial: true };

export const PIN = { minLength: 4, maxLength: 12 } as const;

export class PinOptionsError extends Error {}

function isTrivial(pin: string): boolean {
  // All identical digits.
  if (/^(\d)\1+$/.test(pin)) return true;
  // Strictly ascending or descending by 1 (with wrap not counted).
  let ascending = true;
  let descending = true;
  for (let i = 1; i < pin.length; i++) {
    const prev = pin.charCodeAt(i - 1);
    const cur = pin.charCodeAt(i);
    if (cur !== prev + 1) ascending = false;
    if (cur !== prev - 1) descending = false;
  }
  return ascending || descending;
}

export function generatePin(opts: PinOptions): GenerationResult {
  if (
    !Number.isInteger(opts.length) ||
    opts.length < PIN.minLength ||
    opts.length > PIN.maxLength
  ) {
    throw new PinOptionsError(`PIN length must be between ${PIN.minLength} and ${PIN.maxLength}.`);
  }

  const build = (): string => {
    let pin = "";
    for (let i = 0; i < opts.length; i++) pin += String(randomInt(10));
    return pin;
  };

  let value = build();
  if (opts.forbidTrivial) {
    // Re-roll the WHOLE pin (no biased single-digit edits) until non-trivial.
    let attempts = 0;
    while (isTrivial(value) && attempts < 1000) {
      value = build();
      attempts++;
    }
  }

  // A PIN's real protection is device lockout, not entropy. We report the honest
  // figure; the strength label contextualises it.
  return {
    value,
    entropyBits: opts.length * Math.log2(10),
    entropyEstimated: false,
  };
}
