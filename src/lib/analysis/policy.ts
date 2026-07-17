import { isCommonPassword } from "./common";

export interface PasswordPolicy {
  name: string;
  minLength: number;
  maxLength: number | null;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireSymbol: boolean;
  /** Reject any candidate on the bundled common-password list. */
  denyCommon: boolean;
  /** Advisory only (documented in exported text; not checked on a candidate). */
  rotationDays: number | null;
}

export const DEFAULT_POLICY: PasswordPolicy = {
  name: "Baseline policy",
  minLength: 12,
  maxLength: null,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSymbol: false,
  denyCommon: true,
  rotationDays: null,
};

export interface PolicyViolation {
  rule: string;
  message: string;
}

export interface PolicyResult {
  compliant: boolean;
  violations: PolicyViolation[];
}

export function validateAgainstPolicy(candidate: string, policy: PasswordPolicy): PolicyResult {
  const violations: PolicyViolation[] = [];

  if (candidate.length < policy.minLength) {
    violations.push({
      rule: "minLength",
      message: `Must be at least ${policy.minLength} characters (has ${candidate.length}).`,
    });
  }
  if (policy.maxLength !== null && candidate.length > policy.maxLength) {
    violations.push({
      rule: "maxLength",
      message: `Must be at most ${policy.maxLength} characters (has ${candidate.length}).`,
    });
  }
  if (policy.requireUppercase && !/[A-Z]/.test(candidate)) {
    violations.push({ rule: "uppercase", message: "Must include an uppercase letter." });
  }
  if (policy.requireLowercase && !/[a-z]/.test(candidate)) {
    violations.push({ rule: "lowercase", message: "Must include a lowercase letter." });
  }
  if (policy.requireDigit && !/[0-9]/.test(candidate)) {
    violations.push({ rule: "digit", message: "Must include a digit." });
  }
  if (policy.requireSymbol && !/[^a-zA-Z0-9]/.test(candidate)) {
    violations.push({ rule: "symbol", message: "Must include a symbol." });
  }
  if (policy.denyCommon && isCommonPassword(candidate)) {
    violations.push({ rule: "denyCommon", message: "Appears on the common-password list." });
  }

  return { compliant: violations.length === 0, violations };
}

/** Human-readable rendering of a policy for export/display. */
export function policyToText(policy: PasswordPolicy): string {
  const lines: string[] = [];
  lines.push(`Policy: ${policy.name}`);
  lines.push(`- Minimum length: ${policy.minLength}`);
  if (policy.maxLength !== null) lines.push(`- Maximum length: ${policy.maxLength}`);
  if (policy.requireUppercase) lines.push("- Requires an uppercase letter");
  if (policy.requireLowercase) lines.push("- Requires a lowercase letter");
  if (policy.requireDigit) lines.push("- Requires a digit");
  if (policy.requireSymbol) lines.push("- Requires a symbol");
  if (policy.denyCommon) lines.push("- Rejects common passwords");
  if (policy.rotationDays !== null) lines.push(`- Suggested rotation: every ${policy.rotationDays} days`);
  return lines.join("\n");
}
