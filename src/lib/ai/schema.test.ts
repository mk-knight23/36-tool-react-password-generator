import { describe, it, expect } from "vitest";
import {
  explainRequestSchema,
  policySchema,
  MAX_QUESTION_LENGTH,
} from "@/lib/ai/schema";

describe("explainRequestSchema", () => {
  it("accepts a known topic with no question or policy", () => {
    const r = explainRequestSchema.safeParse({ topic: "password-strength" });
    expect(r.success).toBe(true);
  });

  it("rejects an unknown topic", () => {
    const r = explainRequestSchema.safeParse({ topic: "not-a-real-topic" });
    expect(r.success).toBe(false);
  });

  it("accepts a short natural-language question", () => {
    const r = explainRequestSchema.safeParse({
      topic: "password-policies",
      question: "Is a 16 character minimum enough?",
    });
    expect(r.success).toBe(true);
  });

  it("rejects a question that looks like a secret (schema-level guard)", () => {
    const r = explainRequestSchema.safeParse({
      topic: "password-strength",
      question: "Tr0ub4dor&3xKq9zLm",
    });
    expect(r.success).toBe(false);
  });

  it("rejects a question longer than the cap", () => {
    const r = explainRequestSchema.safeParse({
      topic: "password-strength",
      question: "a ".repeat(MAX_QUESTION_LENGTH),
    });
    expect(r.success).toBe(false);
  });

  it("rejects unknown/smuggled fields (strictObject)", () => {
    const r = explainRequestSchema.safeParse({
      topic: "password-strength",
      secret: "hunter2-abc-xyz",
    });
    expect(r.success).toBe(false);
  });

  it("accepts a valid structured policy", () => {
    const r = explainRequestSchema.safeParse({
      topic: "policy-explanation",
      policy: {
        minLength: 16,
        requireUpper: true,
        requireLower: true,
        requireDigit: true,
        requireSymbol: false,
        rotationDays: 0,
      },
    });
    expect(r.success).toBe(true);
  });
});

describe("policySchema", () => {
  it("rejects a free-text field on the policy object", () => {
    const r = policySchema.safeParse({
      minLength: 12,
      requireUpper: true,
      requireLower: true,
      requireDigit: true,
      requireSymbol: true,
      note: "some secret text",
    });
    expect(r.success).toBe(false);
  });

  it("rejects an out-of-range minimum length", () => {
    const r = policySchema.safeParse({
      minLength: 0,
      requireUpper: true,
      requireLower: true,
      requireDigit: true,
      requireSymbol: true,
    });
    expect(r.success).toBe(false);
  });
});
