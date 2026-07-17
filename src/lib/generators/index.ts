import type { GeneratorMode, GenerationResult } from "./types";

export * from "./types";
export * from "./charsets";
export * from "./wordlist";
export * from "./password";
export * from "./passphrase";
export * from "./pronounceable";
export * from "./pin";
export * from "./uuid";
export * from "./randomString";
export * from "./apiToken";
export * from "./recoveryCodes";
export * from "./wifi";

export const MODE_LABELS: Record<GeneratorMode, string> = {
  password: "Password",
  passphrase: "Passphrase",
  pronounceable: "Pronounceable",
  pin: "PIN",
  uuid: "UUID v4",
  string: "Random string",
  token: "API token",
  recovery: "Recovery codes",
  wifi: "Wi-Fi password",
};

export const MODE_DESCRIPTIONS: Record<GeneratorMode, string> = {
  password: "Length and character sets you control.",
  passphrase: "Words from the EFF large wordlist.",
  pronounceable: "Syllable-based, easier to say and recall.",
  pin: "Numeric codes for devices and cards.",
  uuid: "RFC 4122 version 4 identifiers.",
  string: "Arbitrary length over a chosen alphabet.",
  token: "Byte-accurate hex, base64url, or prefixed keys.",
  recovery: "Printable backup codes for 2FA.",
  wifi: "WPA2/WPA3-friendly network keys.",
};

export const BULK = { min: 2, max: 100 } as const;

/**
 * Run a generator function `count` times. Synchronous — every generator is
 * microsecond-scale, so N ≤ 100 stays well under one animation frame.
 */
export function generateBulk(
  makeOne: () => GenerationResult,
  count: number,
): GenerationResult[] {
  const clamped = Math.max(BULK.min, Math.min(BULK.max, Math.floor(count)));
  const out: GenerationResult[] = [];
  for (let i = 0; i < clamped; i++) out.push(makeOne());
  return out;
}
