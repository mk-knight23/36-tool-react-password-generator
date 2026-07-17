"use client";

import { useState } from "react";
import { Download, Printer, RefreshCw } from "lucide-react";
import { NumberSlider } from "@/components/ui/NumberSlider";
import { Checkbox } from "@/components/ui/Toggle";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/product/CopyButton";
import {
  generateRecoveryCodes,
  DEFAULT_RECOVERY_OPTIONS,
  RECOVERY,
  RecoveryOptionsError,
  type RecoveryCodesResult,
} from "@/lib/generators/recoveryCodes";
import { recordGeneration } from "@/lib/storage";
import { downloadText, toTxt } from "@/lib/download";
import { track } from "@/lib/analytics";
import { SITE } from "@/lib/site";

/**
 * Recovery-code generator with a printable sheet. Codes are only written to
 * history if the user has opted in; the printable sheet drops all app chrome.
 */
export function RecoveryPanel() {
  const [opts, setOpts] = useState(DEFAULT_RECOVERY_OPTIONS);
  const [result, setResult] = useState<RecoveryCodesResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hideProductName, setHideProductName] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string>("");

  const build = () => {
    try {
      const res = generateRecoveryCodes(opts);
      setResult(res);
      setError(null);
      setGeneratedAt(new Date().toLocaleString());
      void recordGeneration({
        mode: "recovery",
        value: res.codes.join("\n"),
        entropyBits: res.entropyBitsPerCode,
      });
      track("tool_completed", { mode: "recovery", count: res.codes.length });
    } catch (e) {
      setResult(null);
      setError(e instanceof RecoveryOptionsError ? e.message : "Could not generate codes.");
    }
  };

  const set = <K extends keyof typeof opts>(k: K, v: (typeof opts)[K]) =>
    setOpts((prev) => ({ ...prev, [k]: v }));

  const onDownload = () => {
    if (!result) return;
    downloadText("recovery-codes.txt", toTxt(result.codes), "text/plain");
    track("result_exported", { format: "txt", mode: "recovery" });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="no-print flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-3">
          <NumberSlider
            label="Codes"
            value={opts.count}
            min={RECOVERY.minCount}
            max={RECOVERY.maxCount}
            onChange={(n) => set("count", n)}
          />
          <NumberSlider
            label="Characters per group"
            value={opts.groupSize}
            min={RECOVERY.minGroupSize}
            max={RECOVERY.maxGroupSize}
            onChange={(n) => set("groupSize", n)}
          />
          <NumberSlider
            label="Groups per code"
            value={opts.groups}
            min={RECOVERY.minGroups}
            max={RECOVERY.maxGroups}
            onChange={(n) => set("groups", n)}
          />
        </div>
        <Checkbox
          label="Hide product name on the printed sheet"
          hint="For privacy when printing on a shared printer."
          checked={hideProductName}
          onChange={setHideProductName}
        />
        {error ? (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        ) : null}
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" onClick={build}>
            <RefreshCw size={16} strokeWidth={1.75} aria-hidden="true" />
            Generate codes
          </Button>
          <Button variant="secondary" onClick={() => window.print()} disabled={!result}>
            <Printer size={16} strokeWidth={1.75} aria-hidden="true" />
            Print
          </Button>
          <Button variant="secondary" onClick={onDownload} disabled={!result}>
            <Download size={16} strokeWidth={1.75} aria-hidden="true" />
            Download .txt
          </Button>
          {result ? <CopyButton value={result.codes.join("\n")} what="recovery codes" variant="button" /> : null}
        </div>
        {result ? (
          <p className="text-sm text-fg-muted">
            {result.codes.length} codes ·{" "}
            <span className="font-mono tabular-nums">{Math.round(result.entropyBitsPerCode)}</span> bits
            each · alphabet of {result.alphabetSize} characters (look-alikes removed for legible
            printing).
          </p>
        ) : null}
      </div>

      {result ? (
        <div className="print-sheet rounded-lg border border-border bg-surface p-6">
          <div className="mb-4 flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <h3 className="text-lg font-semibold text-fg">
              {hideProductName ? "Recovery codes" : `${SITE.name} — recovery codes`}
            </h3>
            <span className="font-mono text-xs text-fg-muted">{generatedAt}</span>
          </div>
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 sm:grid-cols-2">
            {result.codes.map((code, i) => (
              <li key={`${i}-${code}`} className="flex items-center gap-3 py-1">
                <span
                  aria-hidden="true"
                  className="inline-block h-4 w-4 shrink-0 border border-fg-muted"
                />
                <span className="font-mono text-base tracking-wide text-fg">{code}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-border pt-3 text-xs text-fg-muted">
            Each code works once. Store this sheet somewhere safe and cross off codes as you use
            them. Anyone who has these codes can use them.
          </p>
        </div>
      ) : null}
    </div>
  );
}
