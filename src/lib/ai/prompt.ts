/**
 * Builds the model prompt from a *validated* request (PRODUCT_SPEC §6). Pure and
 * side-effect free so it can be unit-tested. Only enum values, numbers,
 * booleans, and the length-capped, guard-checked question ever reach the model.
 */
import type { ExplainRequest, PolicyInput } from "@/lib/ai/schema";
import { getTopic } from "@/lib/ai/topics";

const SYSTEM_PROMPT = [
  "You are the security explainer built into MK VaultPass, a local, open-source password and secret generator.",
  "Answer questions about password and secret security in plain, concrete language for a general audience.",
  "Rules:",
  "- Keep answers to at most three short paragraphs. No preamble, no headings, no markdown.",
  "- Be honest and specific. State limits and trade-offs. Do not oversell or use marketing language.",
  "- Never ask the user to paste, reveal, or send you a real password, token, or secret. If a message appears to contain one, do not repeat it; explain the concept instead.",
  "- VaultPass generates secrets locally and is not a password manager; do not claim it stores, syncs, or protects secrets after generation.",
  "- If a question is outside password/secret security, briefly say so and redirect to that topic.",
].join("\n");

function renderPolicy(policy: PolicyInput): string {
  const classes: string[] = [];
  if (policy.requireUpper) classes.push("uppercase");
  if (policy.requireLower) classes.push("lowercase");
  if (policy.requireDigit) classes.push("digits");
  if (policy.requireSymbol) classes.push("symbols");
  const classText =
    classes.length > 0
      ? `requires ${classes.join(", ")}`
      : "requires no specific character types";
  const rotation =
    policy.rotationDays && policy.rotationDays > 0
      ? `rotation every ${policy.rotationDays} days`
      : "no forced rotation";
  return `Minimum length ${policy.minLength}; ${classText}; ${rotation}.`;
}

export interface BuiltPrompt {
  system: string;
  prompt: string;
}

export function buildPrompt(req: ExplainRequest): BuiltPrompt {
  const topic = getTopic(req.topic);
  const lines: string[] = [];
  lines.push(topic ? topic.prompt : "Explain this password-security topic.");

  if (req.policy) {
    lines.push(`The policy to explain: ${renderPolicy(req.policy)}`);
  }
  if (req.question && req.question.length > 0) {
    lines.push(`The user also asks: ${req.question}`);
  }

  return { system: SYSTEM_PROMPT, prompt: lines.join("\n\n") };
}
