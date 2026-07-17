"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Eye, EyeOff, Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EntropyRing } from "@/components/product/EntropyRing";
import { StrengthBar } from "@/components/product/StrengthBar";
import { LocalOnlyBadge } from "@/components/product/LocalOnlyBadge";
import { analyzePassword } from "@/lib/analysis/analyze";

/**
 * Fully local password analyzer (PRODUCT_SPEC §5.11). Typing runs the analysis
 * in the browser with no network request of any kind. The entropy figure is a
 * heuristic estimate, stated as such — not a guarantee.
 */
export function Analyzer() {
  const [value, setValue] = useState("");
  const [revealed, setRevealed] = useState(false);

  const analysis = useMemo(
    () => (value ? analyzePassword(value) : null),
    [value],
  );

  return (
    <div className="flex flex-col gap-6">
      <Card as="section" className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <label htmlFor="analyze-input" className="text-sm font-medium text-fg">
            Password to check
          </label>
          <LocalOnlyBadge />
        </div>
        <div className="flex items-stretch gap-2 rounded-lg border border-border-strong bg-surface-sunken p-2">
          <input
            id="analyze-input"
            type={revealed ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            placeholder="Type or paste a password"
            className="min-h-11 flex-1 bg-transparent px-2 font-mono text-base text-fg placeholder:text-fg-faint focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-pressed={revealed}
            aria-label={revealed ? "Hide password" : "Show password"}
            title={revealed ? "Hide" : "Show"}
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-muted transition-colors duration-fast ease-enter hover:bg-surface hover:text-fg active:scale-[0.98]"
          >
            {revealed ? (
              <EyeOff size={18} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Eye size={18} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
        </div>
        <p className="text-xs text-fg-muted">
          This runs entirely in your browser. What you type here is never sent
          anywhere, and the strength shown is an estimate, not a guarantee.
        </p>
      </Card>

      {analysis ? (
        <>
          <Card as="section" className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex flex-1 flex-col gap-4">
              <StrengthBar
                bits={analysis.effectiveEntropyBits}
                level={analysis.strength.level}
                label={analysis.strength.label}
              />
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                <Stat label="Length" value={String(analysis.length)} />
                <Stat label="Character set" value={`${analysis.charsetSize} chars`} />
                <Stat
                  label="Raw entropy"
                  value={`${Math.round(analysis.rawEntropyBits)} bits`}
                />
              </dl>
            </div>
            <div className="flex shrink-0 justify-center">
              <EntropyRing
                bits={analysis.effectiveEntropyBits}
                level={analysis.strength.level}
                label={analysis.strength.label}
              />
            </div>
          </Card>

          {analysis.commonHit ? (
            <Card className="flex items-start gap-3 border-danger/40">
              <AlertTriangle size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-danger" aria-hidden="true" />
              <p className="text-sm text-fg">
                This is one of the thousand most common passwords. Treat it as
                already compromised and do not use it anywhere.
              </p>
            </Card>
          ) : null}

          {analysis.patterns.length > 0 ? (
            <Card as="section" className="flex flex-col gap-3">
              <h2 className="text-xl font-semibold text-fg">Patterns found</h2>
              <ul className="flex flex-col gap-2">
                {analysis.patterns.map((p, i) => (
                  <li key={`${p.kind}-${i}`} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-fg-muted">{p.label}</span>
                    <code className="rounded-sm bg-surface-sunken px-1.5 py-0.5 font-mono text-xs text-fg">
                      {revealed ? p.fragment : "•".repeat(p.fragment.length)}
                    </code>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-fg-muted">
                Predictable runs like these lower real strength below the raw
                number, because an attacker can guess them cheaply.
              </p>
            </Card>
          ) : null}

          <Card as="section" className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
              <Lightbulb size={20} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
              Recommendations
            </h2>
            <ul className="flex list-disc flex-col gap-1.5 pl-5 text-sm text-fg-muted">
              {analysis.recommendations.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </Card>
        </>
      ) : (
        <Card className="py-12 text-center text-sm text-fg-muted">
          Start typing to see a local strength estimate, pattern warnings, and a
          check against common passwords.
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-xs uppercase tracking-[0.06em] text-fg-faint">{label}</dt>
      <dd className="font-mono tabular-nums text-fg">{value}</dd>
    </div>
  );
}
