import { describe, it, expect } from "vitest";
import { looksLikeSecret, secretGuardMessage } from "@/lib/ai/secret-guard";

describe("looksLikeSecret — refuses generated-secret shapes", () => {
  it("flags a typical mixed-class password", () => {
    const r = looksLikeSecret("Tr0ub4dor&3xKq9zLm");
    expect(r.flagged).toBe(true);
    expect(r.reason).toBe("mixed-token");
  });

  it("flags a hex token of 16+ chars", () => {
    expect(looksLikeSecret("deadbeefdeadbeef12").flagged).toBe(true);
    expect(looksLikeSecret("deadbeefdeadbeef12").reason).toBe("hex-run");
  });

  it("flags a base64url / random-string token (mixed alnum, no spaces)", () => {
    const r = looksLikeSecret("a1B2c3D4e5F6g7H8i9");
    expect(r.flagged).toBe(true);
    expect(["base64-run", "mixed-token"]).toContain(r.reason);
  });

  it("flags a lowercase-only random string via the no-space backstop", () => {
    // 24 lowercase chars, single class, no spaces -> backstop.
    const r = looksLikeSecret("qwixbvmnzhdkerplasudftgc");
    expect(r.flagged).toBe(true);
    expect(r.reason).toBe("single-long-value");
  });

  it("flags a generated passphrase (words joined by dashes)", () => {
    const r = looksLikeSecret("correct-horse-battery-staple");
    expect(r.flagged).toBe(true);
    // no-space backstop fires first for this 28-char value
    expect(["passphrase", "single-long-value"]).toContain(r.reason);
  });

  it("flags a passphrase embedded in a sentence", () => {
    const r = looksLikeSecret("is river-oak-cliff-north-echo strong");
    expect(r.flagged).toBe(true);
    expect(r.reason).toBe("passphrase");
  });

  it("flags a secret sitting inside otherwise normal text", () => {
    const r = looksLikeSecret("is this ok Xk9$mQ2!vБad no wait aB3#dE7&fG1 fine");
    expect(r.flagged).toBe(true);
  });
});

describe("looksLikeSecret — allows real questions", () => {
  const questions = [
    "What makes a password strong?",
    "Is a 16 character minimum enough for my team?",
    "How many bits of entropy is considered safe?",
    "Should I rotate passwords every 90 days?",
    "Why is password reuse dangerous?",
    "internationalization is a long word but not a secret",
    "Explain WPA3 versus WPA2 for home wifi",
    "does adding symbols really help",
    "",
    "   ",
  ];

  for (const q of questions) {
    it(`allows: ${JSON.stringify(q)}`, () => {
      expect(looksLikeSecret(q).flagged).toBe(false);
    });
  }
});

describe("secretGuardMessage", () => {
  it("returns a safe message that never echoes the input", () => {
    const msg = secretGuardMessage("mixed-token");
    expect(msg.length).toBeGreaterThan(0);
    expect(msg).toContain("concept");
  });
});
