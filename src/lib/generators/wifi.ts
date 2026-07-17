import { randomString } from "@/lib/crypto/random";
import { AMBIGUOUS, removeChars } from "./charsets";
import { uniformEntropyBits, type GenerationResult } from "./types";

// Full charset for Wi-Fi: alnum + a conservative set of symbols that most
// router UIs and clients accept without escaping trouble.
const WIFI_FULL =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&*+-=?@";
// Easy-entry: alphanumerics with every visually ambiguous character removed and
// no symbols — for typing on TV/console keyboards. Lower entropy per character,
// which the UI discloses.
const WIFI_EASY = removeChars(
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  AMBIGUOUS,
);

export interface WifiOptions {
  length: number;
  /** Reduced, easy-to-type charset for TV/console keyboards. */
  easyEntry: boolean;
}

export const DEFAULT_WIFI_OPTIONS: WifiOptions = { length: 20, easyEntry: false };

// WPA2 pre-shared keys are 8–63 ASCII characters; we default the floor higher.
export const WIFI = { minLength: 16, maxLength: 63 } as const;

export class WifiOptionsError extends Error {}

export function generateWifiPassword(opts: WifiOptions): GenerationResult {
  if (
    !Number.isInteger(opts.length) ||
    opts.length < WIFI.minLength ||
    opts.length > WIFI.maxLength
  ) {
    throw new WifiOptionsError(
      `Wi-Fi password length must be between ${WIFI.minLength} and ${WIFI.maxLength} (WPA2 limit).`,
    );
  }
  const alphabet = opts.easyEntry ? WIFI_EASY : WIFI_FULL;
  return {
    value: randomString(alphabet, opts.length),
    entropyBits: uniformEntropyBits(alphabet.length, opts.length),
    entropyEstimated: false,
  };
}
