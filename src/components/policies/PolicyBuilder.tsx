"use client";

import { useMemo, useState } from "react";
import { Check, Download, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { Checkbox, Switch } from "@/components/ui/Toggle";
import { NumberSlider } from "@/components/ui/NumberSlider";
import { useToast } from "@/components/ui/Toast";
import { downloadText } from "@/lib/download";
import {
  DEFAULT_POLICY,
  policyToText,
  validateAgainstPolicy,
  type PasswordPolicy,
} from "@/lib/analysis/policy";

/**
 * Compose a password policy, see it rendered as JSON and readable text, and test
 * a candidate password against it. Validation runs entirely in the browser
 * (src/lib/analysis/policy.ts); the candidate is never sent anywhere.
 */
export function PolicyBuilder() {
  const { toast } = useToast();
  const [policy, setPolicy] = useState<PasswordPolicy>(DEFAULT_POLICY);
  const [candidate, setCandidate] = useState("");

  const patch = (next: Partial<PasswordPolicy>) => setPolicy((p) => ({ ...p, ...next }));

  const text = useMemo(() => policyToText(policy), [policy]);
  const json = useMemo(() => JSON.stringify(policy, null, 2), [policy]);
  const result = useMemo(
    () => (candidate ? validateAgainstPolicy(candidate, policy) : null),
    [candidate, policy],
  );

  const exportJson = () => {
    downloadText("password-policy.json", json, "application/json");
    toast("Downloaded the policy as JSON.", "success");
  };
  const exportText = () => {
    downloadText("password-policy.txt", text, "text/plain");
    toast("Downloaded the policy as text.", "success");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Builder */}
      <Card as="section" className="flex flex-col gap-5">
        <h2 className="text-xl font-semibold text-fg">Rules</h2>

        <TextField
          label="Policy name"
          value={policy.name}
          onChange={(name) => patch({ name })}
          maxLength={80}
        />

        <NumberSlider
          label="Minimum length"
          value={policy.minLength}
          min={1}
          max={64}
          onChange={(minLength) => patch({ minLength })}
        />

        <div className="flex flex-col gap-3">
          <Switch
            label="Cap maximum length"
            hint="Only cap if a downstream system truly requires it. Never truncate submitted passwords."
            checked={policy.maxLength !== null}
            onChange={(on) => patch({ maxLength: on ? 128 : null })}
          />
          {policy.maxLength !== null ? (
            <NumberSlider
              label="Maximum length"
              value={policy.maxLength}
              min={Math.max(policy.minLength, 8)}
              max={256}
              onChange={(maxLength) => patch({ maxLength })}
            />
          ) : null}
        </div>

        <fieldset className="flex flex-col gap-3">
          <legend className="text-sm font-medium text-fg">Character requirements</legend>
          <Checkbox
            label="Require a lowercase letter"
            checked={policy.requireLowercase}
            onChange={(requireLowercase) => patch({ requireLowercase })}
          />
          <Checkbox
            label="Require an uppercase letter"
            checked={policy.requireUppercase}
            onChange={(requireUppercase) => patch({ requireUppercase })}
          />
          <Checkbox
            label="Require a digit"
            checked={policy.requireDigit}
            onChange={(requireDigit) => patch({ requireDigit })}
          />
          <Checkbox
            label="Require a symbol"
            hint="Modern guidance favours length over forced symbols; leave off unless required."
            checked={policy.requireSymbol}
            onChange={(requireSymbol) => patch({ requireSymbol })}
          />
        </fieldset>

        <Checkbox
          label="Reject common passwords"
          hint="Checks against the bundled top-1000 list. Production systems should screen a larger breach corpus."
          checked={policy.denyCommon}
          onChange={(denyCommon) => patch({ denyCommon })}
        />

        <div className="flex flex-col gap-3">
          <Switch
            label="Suggest a rotation period"
            hint="Advisory only. Prefer rotation on evidence of compromise over a fixed schedule."
            checked={policy.rotationDays !== null}
            onChange={(on) => patch({ rotationDays: on ? 90 : null })}
          />
          {policy.rotationDays !== null ? (
            <NumberSlider
              label="Rotation (days)"
              value={policy.rotationDays}
              min={30}
              max={365}
              step={30}
              onChange={(rotationDays) => patch({ rotationDays })}
            />
          ) : null}
        </div>
      </Card>

      {/* Output + validator */}
      <div className="flex flex-col gap-6">
        <Card as="section" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold text-fg">Export</h2>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={exportText}>
                <Download size={16} strokeWidth={1.75} aria-hidden="true" />
                Text
              </Button>
              <Button variant="secondary" size="sm" onClick={exportJson}>
                <Download size={16} strokeWidth={1.75} aria-hidden="true" />
                JSON
              </Button>
            </div>
          </div>
          <pre className="overflow-x-auto rounded-md border border-border bg-surface-sunken p-4 font-mono text-xs text-fg-muted">
            {text}
          </pre>
        </Card>

        <Card as="section" className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-fg">Test a password</h2>
          <TextField
            label="Candidate password"
            value={candidate}
            onChange={setCandidate}
            placeholder="Type or paste a password to check"
            hint="Checked locally against this policy. Nothing is sent anywhere."
            mono
          />
          {result ? (
            result.compliant ? (
              <p className="inline-flex items-center gap-2 text-sm font-medium text-success">
                <Check size={16} strokeWidth={1.75} aria-hidden="true" />
                Meets every rule in this policy.
              </p>
            ) : (
              <ul className="flex flex-col gap-2" role="alert">
                {result.violations.map((violation) => (
                  <li
                    key={violation.rule}
                    className="inline-flex items-start gap-2 text-sm text-danger"
                  >
                    <X size={16} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden="true" />
                    {violation.message}
                  </li>
                ))}
              </ul>
            )
          ) : (
            <p className="text-sm text-fg-muted">Enter a candidate above to check it.</p>
          )}
        </Card>
      </div>
    </div>
  );
}
