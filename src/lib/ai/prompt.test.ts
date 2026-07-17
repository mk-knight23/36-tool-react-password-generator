import { describe, it, expect } from "vitest";
import { buildPrompt } from "@/lib/ai/prompt";

describe("buildPrompt", () => {
  it("uses the topic's canonical prompt", () => {
    const { prompt, system } = buildPrompt({ topic: "password-strength" });
    expect(prompt.length).toBeGreaterThan(0);
    expect(system).toContain("not a password manager");
  });

  it("renders a structured policy as human-readable numbers and classes", () => {
    const { prompt } = buildPrompt({
      topic: "policy-explanation",
      policy: {
        minLength: 16,
        requireUpper: true,
        requireLower: true,
        requireDigit: true,
        requireSymbol: false,
        rotationDays: 90,
      },
    });
    expect(prompt).toContain("Minimum length 16");
    expect(prompt).toContain("uppercase");
    expect(prompt).toContain("rotation every 90 days");
    expect(prompt).not.toContain("symbols"); // requireSymbol was false
  });

  it("appends the user's question when present", () => {
    const { prompt } = buildPrompt({
      topic: "password-policies",
      question: "Is 16 enough for admins?",
    });
    expect(prompt).toContain("Is 16 enough for admins?");
  });

  it("states no forced rotation when rotationDays is zero", () => {
    const { prompt } = buildPrompt({
      topic: "policy-explanation",
      policy: {
        minLength: 12,
        requireUpper: false,
        requireLower: true,
        requireDigit: true,
        requireSymbol: false,
        rotationDays: 0,
      },
    });
    expect(prompt).toContain("no forced rotation");
  });
});
