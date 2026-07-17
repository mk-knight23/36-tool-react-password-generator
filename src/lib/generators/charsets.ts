import { randomBytes } from "@/lib/crypto/random";

/** Canonical character sets. Symbols are the printable ASCII specials. */
export const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
} as const;

/** Characters that are easy to confuse visually. Excludable on demand. */
export const AMBIGUOUS = "il1Lo0OI|`'\"{}[]()/\\";

/** Named alphabets for the random-string generator. */
export const ALPHABETS = {
  alnum: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  hex: "0123456789abcdef",
  base32: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567", // RFC 4648, no padding
  base58: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", // Bitcoin
  base64url: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_",
} as const;

export type AlphabetName = keyof typeof ALPHABETS;

/** Deduplicate characters in a string, preserving first-seen order. */
export function dedupeChars(input: string): string {
  const seen = new Set<string>();
  let out = "";
  for (const ch of input) {
    if (!seen.has(ch)) {
      seen.add(ch);
      out += ch;
    }
  }
  return out;
}

/** Remove every character present in `remove` from `input`. */
export function removeChars(input: string, remove: string): string {
  if (!remove) return input;
  const removeSet = new Set(remove);
  let out = "";
  for (const ch of input) {
    if (!removeSet.has(ch)) out += ch;
  }
  return out;
}

/** Encode bytes to unpadded base64url (byte-accurate, unbiased). */
export function bytesToBase64url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const b64 = btoa(binary);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Lowercase hex of the given bytes. */
export function bytesToHex(bytes: Uint8Array): string {
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    out += bytes[i].toString(16).padStart(2, "0");
  }
  return out;
}

/** Convenience: `n` random bytes as base64url. */
export function randomBase64url(byteLength: number): string {
  return bytesToBase64url(randomBytes(byteLength));
}
