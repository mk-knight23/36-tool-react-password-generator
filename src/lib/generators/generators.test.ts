import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { generatePassword, resolvePasswordAlphabet, PasswordOptionsError } from "./password";
import { generatePassphrase, PassphraseOptionsError } from "./passphrase";
import { generatePronounceable } from "./pronounceable";
import { generatePin } from "./pin";
import { generateUuid } from "./uuid";
import { generateRandomString, RandomStringOptionsError } from "./randomString";
import { generateApiToken } from "./apiToken";
import { generateRecoveryCodes } from "./recoveryCodes";
import { generateWifiPassword, WIFI, WifiOptionsError } from "./wifi";
import { EFF_LARGE_WORDLIST, EFF_WORDLIST_SIZE } from "./wordlist";

describe("EFF wordlist asset", () => {
  it("has exactly 7,776 unique words", () => {
    expect(EFF_WORDLIST_SIZE).toBe(7776);
    expect(new Set(EFF_LARGE_WORDLIST).size).toBe(7776);
  });

  it("matches the bundled checksum (asset not silently mutated)", () => {
    const raw = readFileSync(join(process.cwd(), "src/data/eff-large-wordlist.json"));
    const hash = createHash("sha256").update(raw).digest("hex");
    expect(hash).toBe("a9676e73d7c511216a74d8297c3749afe49137dd5899073f3ddc8fdb17931285");
  });
});

describe("password", () => {
  it("respects length and only uses selected sets", () => {
    const r = generatePassword({
      length: 40,
      uppercase: false,
      lowercase: true,
      digits: true,
      symbols: false,
      excludeAmbiguous: false,
      requireEachSet: true,
    });
    expect(r.value).toHaveLength(40);
    expect(r.value).toMatch(/^[a-z0-9]+$/);
    expect(r.value).toMatch(/[a-z]/);
    expect(r.value).toMatch(/[0-9]/);
  });

  it("excludes ambiguous characters when asked", () => {
    for (let i = 0; i < 50; i++) {
      const r = generatePassword({
        length: 60,
        uppercase: true,
        lowercase: true,
        digits: true,
        symbols: false,
        excludeAmbiguous: true,
        requireEachSet: false,
      });
      expect(r.value).not.toMatch(/[il1Lo0OI]/);
    }
  });

  it("throws when no set is selected", () => {
    expect(() =>
      resolvePasswordAlphabet({
        length: 12,
        uppercase: false,
        lowercase: false,
        digits: false,
        symbols: false,
        excludeAmbiguous: false,
        requireEachSet: false,
      }),
    ).toThrow(PasswordOptionsError);
  });

  it("throws when length is too short to include each required set", () => {
    expect(() =>
      resolvePasswordAlphabet({
        length: 8,
        uppercase: true,
        lowercase: true,
        digits: true,
        symbols: true,
        excludeAmbiguous: false,
        requireEachSet: true,
        customInclude: "€£¥",
      }),
    ).not.toThrow();
    expect(() =>
      generatePassword({
        length: 2,
        uppercase: true,
        lowercase: true,
        digits: true,
        symbols: true,
        excludeAmbiguous: false,
        requireEachSet: true,
      }),
    ).toThrow(PasswordOptionsError);
  });

  it("entropy for a 20-char full alphabet is ~131 bits", () => {
    const r = generatePassword({
      length: 20,
      uppercase: true,
      lowercase: true,
      digits: true,
      symbols: true,
      excludeAmbiguous: false,
      requireEachSet: false,
    });
    // 88-char alphabet → 20 * log2(88) ≈ 129.2
    expect(r.entropyBits).toBeGreaterThan(125);
    expect(r.entropyBits).toBeLessThan(135);
  });
});

describe("passphrase", () => {
  it("produces the requested number of words plus optional digits", () => {
    const r = generatePassphrase({
      wordCount: 6,
      separator: "-",
      capitalize: "first",
      appendDigits: 2,
    });
    const parts = r.value.split("-");
    expect(parts).toHaveLength(7); // 6 words + 1 digit group
    expect(parts[6]).toMatch(/^\d{2}$/);
    for (let i = 0; i < 6; i++) expect(parts[i]).toMatch(/^[A-Z][a-z]+$/);
  });

  it("entropy is words × log2(7776) plus digit bits", () => {
    const r = generatePassphrase({
      wordCount: 5,
      separator: " ",
      capitalize: "none",
      appendDigits: 0,
    });
    expect(r.entropyBits).toBeCloseTo(5 * Math.log2(7776), 5);
  });

  it("rejects out-of-range word counts", () => {
    expect(() =>
      generatePassphrase({ wordCount: 2, separator: "-", capitalize: "none", appendDigits: 0 }),
    ).toThrow(PassphraseOptionsError);
  });
});

describe("pronounceable", () => {
  it("has the exact requested length and only letters (+digits)", () => {
    const r = generatePronounceable({ length: 16, capitalize: true, appendDigits: 3 });
    expect(r.value).toHaveLength(16 + 3);
    expect(r.value.slice(0, 16)).toMatch(/^[A-Za-z]+$/);
    expect(r.value.slice(16)).toMatch(/^\d{3}$/);
    expect(r.entropyEstimated).toBe(true);
  });
});

describe("pin", () => {
  it("produces digits of the right length", () => {
    const r = generatePin({ length: 6, forbidTrivial: true });
    expect(r.value).toMatch(/^\d{6}$/);
  });

  it("avoids trivial pins when asked", () => {
    for (let i = 0; i < 200; i++) {
      const r = generatePin({ length: 4, forbidTrivial: true });
      expect(r.value).not.toBe("0000");
      expect(r.value).not.toBe("1234");
      expect(r.value).not.toBe("4321");
      expect(/^(\d)\1+$/.test(r.value)).toBe(false);
    }
  });
});

describe("uuid", () => {
  it("is a valid v4 UUID with 122 bits", () => {
    const r = generateUuid();
    expect(r.value).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
    );
    expect(r.entropyBits).toBe(122);
  });
});

describe("random string", () => {
  it("honours a named alphabet", () => {
    const r = generateRandomString({ length: 64, alphabet: "hex" });
    expect(r.value).toMatch(/^[0-9a-f]{64}$/);
  });

  it("rejects a custom alphabet with fewer than 2 distinct chars", () => {
    expect(() =>
      generateRandomString({ length: 10, alphabet: "custom", customAlphabet: "aaaa" }),
    ).toThrow(RandomStringOptionsError);
  });
});

describe("api token", () => {
  it("hex token of 32 bytes is 64 chars and 256 bits", () => {
    const r = generateApiToken({ format: "hex", byteLength: 32 });
    expect(r.value).toMatch(/^[0-9a-f]{64}$/);
    expect(r.charCount).toBe(64);
    expect(r.entropyBits).toBe(256);
  });

  it("prefixed token keeps prefix out of entropy", () => {
    const r = generateApiToken({ format: "prefixed", byteLength: 24, prefix: "sk_live_" });
    expect(r.value.startsWith("sk_live_")).toBe(true);
    expect(r.entropyBits).toBe(24 * 8);
  });
});

describe("recovery codes", () => {
  it("makes N codes in group format", () => {
    const r = generateRecoveryCodes({ count: 10, groupSize: 5, groups: 2 });
    expect(r.codes).toHaveLength(10);
    for (const code of r.codes) expect(code).toMatch(/^[A-Z0-9]{5}-[A-Z0-9]{5}$/);
    expect(r.entropyBitsPerCode).toBeGreaterThan(40);
  });
});

describe("wifi", () => {
  it("stays within the WPA2 63-char limit", () => {
    const r = generateWifiPassword({ length: WIFI.maxLength, easyEntry: false });
    expect(r.value.length).toBe(63);
  });

  it("easy-entry omits ambiguous characters", () => {
    for (let i = 0; i < 50; i++) {
      const r = generateWifiPassword({ length: 32, easyEntry: true });
      expect(r.value).not.toMatch(/[il1Lo0OI]/);
    }
  });

  it("rejects lengths beyond the WPA2 limit", () => {
    expect(() => generateWifiPassword({ length: 64, easyEntry: false })).toThrow(WifiOptionsError);
  });
});
