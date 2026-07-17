import { describe, it, expect } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { analyzePassword } from "./analyze";
import { classifyStrength } from "./strength";
import { detectPatterns } from "./patterns";
import { isCommonPassword, COMMON_PASSWORD_COUNT } from "./common";
import { validateAgainstPolicy, DEFAULT_POLICY, policyToText } from "./policy";

describe("common-password asset", () => {
  it("has 1,000 entries and a stable checksum", () => {
    expect(COMMON_PASSWORD_COUNT).toBe(1000);
    const raw = readFileSync(join(process.cwd(), "src/data/common-passwords.json"));
    const hash = createHash("sha256").update(raw).digest("hex");
    expect(hash).toBe("79f70e28f81453a8cfff96249de4c704af79eb8cb512f1a763bc73486b6c5538");
  });

  it("flags obvious common passwords (case-insensitive)", () => {
    expect(isCommonPassword("password")).toBe(true);
    expect(isCommonPassword("123456")).toBe(true);
    expect(isCommonPassword("PASSWORD")).toBe(true);
    expect(isCommonPassword("Xk9$mQ2pL7wZ")).toBe(false);
  });
});

describe("classifyStrength", () => {
  it("maps bits to the five levels", () => {
    expect(classifyStrength(10).level).toBe(0);
    expect(classifyStrength(40).level).toBe(1);
    expect(classifyStrength(60).level).toBe(2);
    expect(classifyStrength(85).level).toBe(3);
    expect(classifyStrength(128).level).toBe(4);
  });

  it("forces Very weak on a common hit regardless of entropy", () => {
    expect(classifyStrength(200, true).level).toBe(0);
  });
});

describe("detectPatterns", () => {
  it("finds repetition", () => {
    const p = detectPatterns("aaaa1234");
    expect(p.some((x) => x.kind === "repetition")).toBe(true);
  });
  it("finds sequences", () => {
    const p = detectPatterns("hello1234");
    expect(p.some((x) => x.kind === "sequence")).toBe(true);
  });
  it("finds keyboard runs", () => {
    const p = detectPatterns("qwertyZ9");
    expect(p.some((x) => x.kind === "keyboard")).toBe(true);
  });
  it("returns nothing for a strong random string", () => {
    expect(detectPatterns("Xk9$mQ2pLwZ")).toEqual([]);
  });
});

describe("analyzePassword", () => {
  it("classifies a common password as Very weak", () => {
    const r = analyzePassword("password");
    expect(r.commonHit).toBe(true);
    expect(r.strength.level).toBe(0);
  });

  it("rates a long random password highly", () => {
    const r = analyzePassword("Xk9$mQ2pL7wZ!vB4nR8t");
    expect(r.strength.level).toBeGreaterThanOrEqual(3);
    expect(r.commonHit).toBe(false);
  });

  it("discounts entropy for patterned input", () => {
    const patterned = analyzePassword("abcdefghabcdefgh");
    const random = analyzePassword("Xk9mQ2pLwZvB4nR8");
    expect(patterned.effectiveEntropyBits).toBeLessThan(random.effectiveEntropyBits);
  });
});

describe("policy", () => {
  it("passes a compliant candidate and reports violations otherwise", () => {
    expect(validateAgainstPolicy("Abcd1234efgh", DEFAULT_POLICY).compliant).toBe(true);
    const weak = validateAgainstPolicy("short", DEFAULT_POLICY);
    expect(weak.compliant).toBe(false);
    expect(weak.violations.some((v) => v.rule === "minLength")).toBe(true);
  });

  it("rejects common passwords when denyCommon is on", () => {
    const r = validateAgainstPolicy("password", { ...DEFAULT_POLICY, minLength: 4 });
    expect(r.violations.some((v) => v.rule === "denyCommon")).toBe(true);
  });

  it("renders human-readable text", () => {
    expect(policyToText(DEFAULT_POLICY)).toContain("Minimum length: 12");
  });
});
