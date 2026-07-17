import { describe, it, expect } from "vitest";
import { validateAgainstPolicy, policyToText, type PasswordPolicy } from "./policy";
import { rawEntropyBits, effectiveEntropyBits, estimateCharsetSize } from "./entropy";
import { isCommonPassword } from "./common";
import { analyzePassword } from "./analyze";
import { detectPatterns } from "./patterns";

const STRICT_POLICY: PasswordPolicy = {
  name: "Strict",
  minLength: 8,
  maxLength: 20,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSymbol: true,
  denyCommon: false,
  rotationDays: 90,
};

describe("policy per-rule violations", () => {
  it("reports a maxLength violation for an over-long candidate", () => {
    const r = validateAgainstPolicy("A".repeat(25) + "a1!", STRICT_POLICY);
    expect(r.violations.some((v) => v.rule === "maxLength")).toBe(true);
  });

  it("reports each missing character class individually", () => {
    const r = validateAgainstPolicy("abcdefgh", STRICT_POLICY); // no upper/digit/symbol
    const rules = r.violations.map((v) => v.rule);
    expect(rules).toContain("uppercase");
    expect(rules).toContain("digit");
    expect(rules).toContain("symbol");
    expect(rules).not.toContain("lowercase");
  });

  it("reports a lowercase violation when only uppercase is present", () => {
    const r = validateAgainstPolicy("ABCD1234!X", STRICT_POLICY);
    expect(r.violations.some((v) => v.rule === "lowercase")).toBe(true);
  });

  it("passes a fully compliant candidate", () => {
    const r = validateAgainstPolicy("Abcd1234!x", STRICT_POLICY);
    expect(r.compliant).toBe(true);
    expect(r.violations).toEqual([]);
  });
});

describe("policyToText optional lines", () => {
  it("includes maxLength, symbol, and rotation lines when configured", () => {
    const text = policyToText(STRICT_POLICY);
    expect(text).toContain("Maximum length: 20");
    expect(text).toContain("Requires a symbol");
    expect(text).toContain("Suggested rotation: every 90 days");
  });
});

describe("entropy edge cases", () => {
  it("rawEntropyBits is 0 for an empty string", () => {
    expect(rawEntropyBits("")).toBe(0);
  });

  it("effectiveEntropyBits is 0 for an empty string", () => {
    expect(effectiveEntropyBits("")).toBe(0);
  });

  it("estimateCharsetSize sums every present character class", () => {
    expect(estimateCharsetSize("aA1!")).toBe(26 + 26 + 10 + 32);
  });
});

describe("common-password empty guard", () => {
  it("treats an empty string as not common", () => {
    expect(isCommonPassword("")).toBe(false);
  });
});

describe("patterns — descending runs", () => {
  it("detects a descending sequence", () => {
    const p = detectPatterns("zyxw9Q");
    expect(p.some((x) => x.kind === "sequence")).toBe(true);
  });
});

describe("analyze recommendations", () => {
  it("recommends fixes for each detected structural pattern", () => {
    const recs = analyzePassword("aaaabcde").recommendations;
    expect(recs.some((r) => /Avoid repeated/.test(r))).toBe(true);
    expect(recs.some((r) => /Avoid sequences/.test(r))).toBe(true);
  });

  it("recommends a keyboard-run fix", () => {
    const recs = analyzePassword("qwertyui").recommendations;
    expect(recs.some((r) => /keyboard runs/.test(r))).toBe(true);
  });

  it("recommends adding missing character classes", () => {
    const recs = analyzePassword("abcdefghij").recommendations;
    expect(recs.some((r) => /uppercase/.test(r))).toBe(true);
    expect(recs.some((r) => /digits/.test(r))).toBe(true);
    expect(recs.some((r) => /symbols/.test(r))).toBe(true);
  });

  it("gives the positive fallback recommendation for a strong random password", () => {
    const recs = analyzePassword("Xk9$mQ2pL7wZ!vB4nR8t").recommendations;
    expect(recs.some((r) => /strongest option/.test(r))).toBe(true);
  });
});
