import { randomBytes } from "@/lib/crypto/random";
import { bytesToHex, bytesToBase64url } from "./charsets";
import { type GenerationResult } from "./types";

export type TokenFormat = "hex" | "base64url" | "prefixed";

export interface ApiTokenOptions {
  format: TokenFormat;
  /** Number of random bytes of entropy (16 / 24 / 32 / 64 typical). */
  byteLength: number;
  /** Only for the "prefixed" format, e.g. "sk_live_". Excluded from entropy. */
  prefix?: string;
}

export const DEFAULT_API_TOKEN_OPTIONS: ApiTokenOptions = {
  format: "hex",
  byteLength: 32,
  prefix: "sk_live_",
};

export const API_TOKEN = {
  byteChoices: [16, 24, 32, 64] as const,
  minBytes: 8,
  maxBytes: 128,
  maxPrefixLength: 24,
} as const;

export interface ApiTokenResult extends GenerationResult {
  byteLength: number;
  charCount: number;
}

export class ApiTokenOptionsError extends Error {}

export function generateApiToken(opts: ApiTokenOptions): ApiTokenResult {
  if (
    !Number.isInteger(opts.byteLength) ||
    opts.byteLength < API_TOKEN.minBytes ||
    opts.byteLength > API_TOKEN.maxBytes
  ) {
    throw new ApiTokenOptionsError(
      `Byte length must be between ${API_TOKEN.minBytes} and ${API_TOKEN.maxBytes}.`,
    );
  }

  const bytes = randomBytes(opts.byteLength);
  let body: string;
  if (opts.format === "hex") {
    body = bytesToHex(bytes);
  } else {
    body = bytesToBase64url(bytes);
  }

  let value = body;
  if (opts.format === "prefixed") {
    const prefix = (opts.prefix ?? "").slice(0, API_TOKEN.maxPrefixLength);
    value = prefix + body;
  }

  // Entropy is exactly byteLength × 8; the prefix is a fixed, public label and
  // contributes nothing. The UI never implies a prefix is reserved/registered.
  return {
    value,
    entropyBits: opts.byteLength * 8,
    entropyEstimated: false,
    byteLength: opts.byteLength,
    charCount: value.length,
  };
}
