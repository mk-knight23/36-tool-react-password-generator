"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { CopyButton } from "./CopyButton";

interface SecretOutputProps {
  value: string;
  /** What the secret is, for accessible labels, e.g. "password". */
  what?: string;
  /** Live-region announcement, e.g. "New password generated, 96 bits". */
  announce?: string;
  defaultRevealed?: boolean;
}

/** Mask a secret while preserving its length so layout does not jump. */
function maskValue(value: string): string {
  return "•".repeat(Math.min(value.length, 64));
}

/**
 * The canonical single-secret display (DESIGN_SYSTEM.md §9). Mono, wraps with
 * break-all (never truncated), reveal/hide toggle, copy button, and an
 * aria-live announcement so screen readers hear each new result.
 */
export function SecretOutput({
  value,
  what = "value",
  announce,
  defaultRevealed = true,
}: SecretOutputProps) {
  const [revealed, setRevealed] = useState(defaultRevealed);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-stretch gap-2 rounded-lg border border-border-strong bg-surface-sunken p-2">
        <output
          className="flex min-h-11 flex-1 select-all items-center break-all px-2 font-mono leading-[1.4]"
          style={{ fontSize: value.length > 48 ? "1rem" : "1.25rem" }}
          aria-label={revealed ? `Generated ${what}` : `${what}, hidden`}
        >
          {revealed ? value : maskValue(value)}
        </output>
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-pressed={revealed}
            aria-label={revealed ? `Hide ${what}` : `Show ${what}`}
            title={revealed ? "Hide" : "Show"}
            className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-md text-fg-muted transition-colors duration-fast ease-enter hover:bg-surface hover:text-fg active:scale-[0.98]"
          >
            {revealed ? (
              <EyeOff size={18} strokeWidth={1.75} aria-hidden="true" />
            ) : (
              <Eye size={18} strokeWidth={1.75} aria-hidden="true" />
            )}
          </button>
          <CopyButton value={value} what={what} />
        </div>
      </div>
      {/* Polite live region: announces new results without stealing focus. */}
      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}
