"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { NumberSlider } from "@/components/ui/NumberSlider";
import { SecretOutput } from "@/components/product/SecretOutput";
import { StrengthBar } from "@/components/product/StrengthBar";
import { LocalOnlyBadge } from "@/components/product/LocalOnlyBadge";
import {
  generatePassword,
  DEFAULT_PASSWORD_OPTIONS,
  PASSWORD_LENGTH,
} from "@/lib/generators/password";
import { classifyStrength } from "@/lib/analysis/strength";
import { useHydrated } from "@/lib/client-hooks";
import type { GenerationResult } from "@/lib/generators/types";

const DEMO_DEFAULT_LENGTH = 20;

/**
 * A self-contained password demo for the landing page. It runs the real
 * generator (no mock), so a first-time visitor sees a genuine, working result
 * produced entirely in their browser. It intentionally records nothing to
 * storage — the landing demo is a preview, not a tracked generation.
 *
 * The first value is produced only after hydration (crypto output differs from
 * any server render), so during hydration the server and client markup match.
 */
export function MiniGenerator() {
  const hydrated = useHydrated();
  const [length, setLength] = useState(DEMO_DEFAULT_LENGTH);
  const [result, setResult] = useState<GenerationResult | null>(null);

  // The shown value is either the last explicit generation or, before the user
  // interacts, a first value produced only after hydration (so server and
  // client markup match). Derived — no ref, no setState-in-effect.
  const shown = useMemo<GenerationResult | null>(() => {
    if (result) return result;
    if (!hydrated) return null;
    return generatePassword({ ...DEFAULT_PASSWORD_OPTIONS, length: DEMO_DEFAULT_LENGTH });
  }, [result, hydrated]);

  const regenerate = (len: number) => {
    setResult(generatePassword({ ...DEFAULT_PASSWORD_OPTIONS, length: len }));
  };

  const onLength = (len: number) => {
    setLength(len);
    regenerate(len);
  };

  const strength = shown ? classifyStrength(shown.entropyBits, false) : null;

  return (
    <div className="flex flex-col gap-5 rounded-xl border border-border bg-surface p-5 shadow-1 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium uppercase tracking-[0.06em] text-fg-faint">
          Try it now
        </h2>
        <LocalOnlyBadge />
      </div>

      <div className="min-h-[76px]">
        {shown ? (
          <SecretOutput
            value={shown.value}
            what="password"
            announce={
              strength
                ? `New password generated, ${Math.round(shown.entropyBits)} bits, ${strength.label}`
                : undefined
            }
          />
        ) : (
          <div
            className="h-[60px] rounded-lg border border-border-strong bg-surface-sunken"
            aria-hidden="true"
          />
        )}
      </div>

      {shown && strength ? (
        <StrengthBar
          bits={shown.entropyBits}
          level={strength.level}
          label={strength.label}
        />
      ) : null}

      <NumberSlider
        label="Length"
        value={length}
        min={PASSWORD_LENGTH.min}
        max={64}
        onChange={onLength}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="primary" onClick={() => regenerate(length)}>
          <RefreshCw size={16} strokeWidth={1.75} aria-hidden="true" />
          Regenerate
        </Button>
        <Link
          href="/generate"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-strong bg-surface px-4 text-sm font-medium text-fg transition-colors duration-fast ease-enter hover:bg-surface-sunken"
        >
          All generators
        </Link>
      </div>

      <p className="text-xs text-fg-muted">
        Upper and lower case, digits, and symbols, with one of each guaranteed.
        Open the full generator for passphrases, tokens, recovery codes, and
        more.
      </p>
    </div>
  );
}
