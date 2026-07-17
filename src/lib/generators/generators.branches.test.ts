import { describe, it, expect } from "vitest";
import { generatePassword, resolvePasswordAlphabet, PasswordOptionsError } from "./password";
import { generatePronounceable, PronounceableOptionsError } from "./pronounceable";
import { generatePin, PinOptionsError } from "./pin";
import { generateRandomString, RandomStringOptionsError } from "./randomString";
import { generateApiToken, API_TOKEN, ApiTokenOptionsError } from "./apiToken";
import { generateRecoveryCodes, RecoveryOptionsError } from "./recoveryCodes";

describe("password option validation branches", () => {
  const base = {
    length: 16,
    uppercase: true,
    lowercase: true,
    digits: true,
    symbols: true,
    excludeAmbiguous: false,
    requireEachSet: false,
  };

  it("rejects a length below the minimum", () => {
    expect(() => resolvePasswordAlphabet({ ...base, length: 4 })).toThrow(PasswordOptionsError);
  });

  it("rejects a length above the maximum", () => {
    expect(() => resolvePasswordAlphabet({ ...base, length: 200 })).toThrow(PasswordOptionsError);
  });

  it("throws when exclusion rules remove every available character", () => {
    expect(() =>
      resolvePasswordAlphabet({
        ...base,
        uppercase: false,
        digits: false,
        symbols: false,
        lowercase: true,
        excludeChars: "abcdefghijklmnopqrstuvwxyz",
      }),
    ).toThrow(PasswordOptionsError);
  });

  it("adds and requires custom-include characters as their own set", () => {
    const r = generatePassword({
      ...base,
      uppercase: false,
      lowercase: true,
      digits: false,
      symbols: false,
      requireEachSet: true,
      customInclude: "€£¥",
      length: 24,
    });
    expect(r.value).toMatch(/[€£¥]/);
  });

  it("takes the single-set fast path when only one set is selected", () => {
    const r = generatePassword({
      ...base,
      uppercase: false,
      lowercase: true,
      digits: false,
      symbols: false,
      requireEachSet: true,
    });
    expect(r.value).toMatch(/^[a-z]+$/);
  });
});

describe("pronounceable option validation branches", () => {
  it("rejects a length outside the allowed range", () => {
    expect(() =>
      generatePronounceable({ length: 4, capitalize: false, appendDigits: 0 }),
    ).toThrow(PronounceableOptionsError);
  });

  it("rejects an out-of-range appended-digit count", () => {
    expect(() =>
      generatePronounceable({ length: 12, capitalize: false, appendDigits: 9 }),
    ).toThrow(PronounceableOptionsError);
  });

  it("capitalizes the first character when asked", () => {
    const r = generatePronounceable({ length: 12, capitalize: true, appendDigits: 0 });
    expect(r.value.charAt(0)).toMatch(/[A-Z]/);
  });
});

describe("pin option validation branches", () => {
  it("rejects a length outside the 4-12 range", () => {
    expect(() => generatePin({ length: 2, forbidTrivial: true })).toThrow(PinOptionsError);
  });

  it("allows trivial pins when forbidTrivial is off", () => {
    const r = generatePin({ length: 4, forbidTrivial: false });
    expect(r.value).toMatch(/^\d{4}$/);
  });
});

describe("random-string validation branches", () => {
  it("rejects a length beyond the maximum", () => {
    expect(() => generateRandomString({ length: 2000, alphabet: "hex" })).toThrow(
      RandomStringOptionsError,
    );
  });

  it("produces base64url characters for the base64url alphabet", () => {
    const r = generateRandomString({ length: 40, alphabet: "base64url" });
    expect(r.value).toMatch(/^[A-Za-z0-9\-_]{40}$/);
  });
});

describe("api-token branches", () => {
  it("rejects a byte length below the minimum", () => {
    expect(() => generateApiToken({ format: "hex", byteLength: 4 })).toThrow(ApiTokenOptionsError);
  });

  it("emits base64url without padding for the base64url format", () => {
    const r = generateApiToken({ format: "base64url", byteLength: 32 });
    expect(r.value).toMatch(/^[A-Za-z0-9\-_]+$/);
    expect(r.value).not.toContain("=");
  });

  it("truncates an over-long prefix to the maximum prefix length", () => {
    const longPrefix = "x".repeat(API_TOKEN.maxPrefixLength + 10);
    const r = generateApiToken({ format: "prefixed", byteLength: 16, prefix: longPrefix });
    const emittedPrefix = r.value.slice(0, API_TOKEN.maxPrefixLength);
    expect(emittedPrefix).toBe("x".repeat(API_TOKEN.maxPrefixLength));
    // Entropy still reflects only the random bytes, not the prefix.
    expect(r.entropyBits).toBe(16 * 8);
  });
});

describe("recovery-code validation branches", () => {
  it("rejects a count outside the allowed range", () => {
    expect(() => generateRecoveryCodes({ count: 0, groupSize: 5, groups: 2 })).toThrow(
      RecoveryOptionsError,
    );
    expect(() => generateRecoveryCodes({ count: 999, groupSize: 5, groups: 2 })).toThrow(
      RecoveryOptionsError,
    );
  });

  it("rejects an out-of-range group size", () => {
    expect(() => generateRecoveryCodes({ count: 10, groupSize: 1, groups: 2 })).toThrow(
      RecoveryOptionsError,
    );
  });

  it("rejects an out-of-range group count", () => {
    expect(() => generateRecoveryCodes({ count: 10, groupSize: 5, groups: 9 })).toThrow(
      RecoveryOptionsError,
    );
  });
});
