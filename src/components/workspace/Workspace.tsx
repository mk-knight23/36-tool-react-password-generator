"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { NumberSlider } from "@/components/ui/NumberSlider";
import { Switch } from "@/components/ui/Toggle";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { SecretOutput } from "@/components/product/SecretOutput";
import { EntropyRing } from "@/components/product/EntropyRing";
import { StrengthBar } from "@/components/product/StrengthBar";
import { LocalOnlyBadge } from "@/components/product/LocalOnlyBadge";
import { BulkList } from "./BulkList";
import { RecoveryPanel } from "./RecoveryPanel";
import {
  PasswordControls,
  PassphraseControls,
  PronounceableControls,
  PinControls,
  StringControls,
  TokenControls,
  WifiControls,
} from "./controls";
import {
  GENERATOR_MODES,
  type GeneratorMode,
  type GenerationResult,
} from "@/lib/generators/types";
import { MODE_LABELS, MODE_DESCRIPTIONS, BULK } from "@/lib/generators";
import { generatePassword, DEFAULT_PASSWORD_OPTIONS } from "@/lib/generators/password";
import { generatePassphrase, DEFAULT_PASSPHRASE_OPTIONS } from "@/lib/generators/passphrase";
import { generatePronounceable, DEFAULT_PRONOUNCEABLE_OPTIONS } from "@/lib/generators/pronounceable";
import { generatePin, DEFAULT_PIN_OPTIONS } from "@/lib/generators/pin";
import { generateUuid } from "@/lib/generators/uuid";
import { generateRandomString, DEFAULT_RANDOM_STRING_OPTIONS } from "@/lib/generators/randomString";
import { generateApiToken, DEFAULT_API_TOKEN_OPTIONS } from "@/lib/generators/apiToken";
import { generateWifiPassword, DEFAULT_WIFI_OPTIONS } from "@/lib/generators/wifi";
import { classifyStrength } from "@/lib/analysis/strength";
import { recordGeneration } from "@/lib/storage";
import { track } from "@/lib/analytics";

const FILE_BASE: Record<GeneratorMode, string> = {
  password: "passwords",
  passphrase: "passphrases",
  pronounceable: "pronounceable",
  pin: "pins",
  uuid: "uuids",
  string: "strings",
  token: "tokens",
  recovery: "recovery-codes",
  wifi: "wifi-passwords",
};

function parseMode(raw: string | null): GeneratorMode {
  return GENERATOR_MODES.includes(raw as GeneratorMode) ? (raw as GeneratorMode) : "password";
}

export function Workspace() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<GeneratorMode>(() => parseMode(searchParams.get("mode")));

  // Per-mode option state.
  const [passwordOpts, setPasswordOpts] = useState(DEFAULT_PASSWORD_OPTIONS);
  const [passphraseOpts, setPassphraseOpts] = useState(DEFAULT_PASSPHRASE_OPTIONS);
  const [pronounceableOpts, setPronounceableOpts] = useState(DEFAULT_PRONOUNCEABLE_OPTIONS);
  const [pinOpts, setPinOpts] = useState(DEFAULT_PIN_OPTIONS);
  const [stringOpts, setStringOpts] = useState(DEFAULT_RANDOM_STRING_OPTIONS);
  const [tokenOpts, setTokenOpts] = useState(DEFAULT_API_TOKEN_OPTIONS);
  const [wifiOpts, setWifiOpts] = useState(DEFAULT_WIFI_OPTIONS);

  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bulk, setBulk] = useState(false);
  const [bulkCount, setBulkCount] = useState(10);
  const [bulkItems, setBulkItems] = useState<string[] | null>(null);

  const generateOne = useCallback(
    (m: GeneratorMode): GenerationResult => {
      switch (m) {
        case "password":
          return generatePassword(passwordOpts);
        case "passphrase":
          return generatePassphrase(passphraseOpts);
        case "pronounceable":
          return generatePronounceable(pronounceableOpts);
        case "pin":
          return generatePin(pinOpts);
        case "uuid":
          return generateUuid();
        case "string":
          return generateRandomString(stringOpts);
        case "token":
          return generateApiToken(tokenOpts);
        case "wifi":
          return generateWifiPassword(wifiOpts);
        case "recovery":
          throw new Error("Recovery codes are generated in their own panel.");
      }
    },
    [passwordOpts, passphraseOpts, pronounceableOpts, pinOpts, stringOpts, tokenOpts, wifiOpts],
  );

  // Produce a fresh preview from an already-built value. Called only from event
  // handlers (option changes, mode switches), never from an effect.
  const applyResult = useCallback((produce: () => GenerationResult) => {
    try {
      setResult(produce());
      setError(null);
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "Could not generate.");
    }
  }, []);

  // Update a mode's options and live-refresh the preview (unless in bulk mode).
  function updateOpts<T>(setter: (v: T) => void, next: T, produce: () => GenerationResult) {
    setter(next);
    if (!bulk) applyResult(produce);
  }

  // Explicit generate — records one real generation (or N in bulk).
  const runGenerate = useCallback(() => {
    if (mode === "recovery") return;
    try {
      if (bulk) {
        const items: string[] = [];
        for (let i = 0; i < bulkCount; i++) {
          const r = generateOne(mode);
          items.push(r.value);
          void recordGeneration({ mode, value: r.value, entropyBits: r.entropyBits });
        }
        setBulkItems(items);
        setError(null);
      } else {
        const r = generateOne(mode);
        setResult(r);
        setError(null);
        void recordGeneration({ mode, value: r.value, entropyBits: r.entropyBits });
      }
      track("tool_completed", { mode, bulk, count: bulk ? bulkCount : 1 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not generate.");
    }
  }, [mode, bulk, bulkCount, generateOne]);

  // Fire the "opened" event once. track() is a no-op unless analytics is on.
  useEffect(() => {
    track("tool_opened", {});
  }, []);

  // Keyboard shortcuts: Cmd/Ctrl+Enter generates; "." regenerates when not
  // typing. Kept current via a ref so the listener attaches only once.
  const generateRef = useRef(runGenerate);
  useEffect(() => {
    generateRef.current = runGenerate;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        generateRef.current();
      } else if (e.key === "." && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        generateRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const changeMode = (next: GeneratorMode) => {
    setMode(next);
    setBulkItems(null);
    setError(null);
    if (next !== "recovery" && !bulk) {
      applyResult(() => generateOne(next));
    } else {
      setResult(null);
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("mode", next);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    track("tool_opened", { mode: next });
  };

  const toggleBulk = (v: boolean) => {
    setBulk(v);
    setBulkItems(null);
    if (!v && mode !== "recovery") {
      applyResult(() => generateOne(mode));
    }
  };

  const strength = result ? classifyStrength(result.entropyBits, false) : null;
  const modeLabel = MODE_LABELS[mode].toLowerCase();

  return (
    <div className="flex flex-col gap-6">
      <SegmentedControl<GeneratorMode>
        label="Generator mode"
        value={mode}
        onChange={changeMode}
        segments={GENERATOR_MODES.map((m) => ({ value: m, label: MODE_LABELS[m] }))}
      />

      <Card as="section" className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-fg">
              {MODE_LABELS[mode]}
              <LocalOnlyBadge />
            </h2>
            <p className="mt-1 text-sm text-fg-muted">{MODE_DESCRIPTIONS[mode]}</p>
          </div>
        </div>

        {mode === "recovery" ? (
          <RecoveryPanel />
        ) : (
          <>
            {error ? (
              <p
                role="alert"
                className="rounded-md border border-danger bg-surface px-4 py-3 text-sm text-danger"
              >
                {error}
              </p>
            ) : null}

            {!bulk && result ? (
              <div className="flex flex-col gap-6 md:flex-row md:items-center">
                <div className="flex flex-1 flex-col gap-4">
                  <SecretOutput
                    value={result.value}
                    what={modeLabel}
                    announce={
                      strength
                        ? `New ${modeLabel} generated, ${Math.round(result.entropyBits)} bits, ${strength.label}`
                        : undefined
                    }
                  />
                  {strength ? (
                    <StrengthBar
                      bits={result.entropyBits}
                      level={strength.level}
                      label={strength.label}
                      estimated={result.entropyEstimated}
                    />
                  ) : null}
                </div>
                {strength ? (
                  <div className="hidden shrink-0 sm:block">
                    <EntropyRing
                      bits={result.entropyBits}
                      level={strength.level}
                      label={strength.label}
                      estimated={result.entropyEstimated}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {!bulk && !result && !error ? (
              <p className="rounded-md border border-border bg-surface-sunken px-4 py-6 text-center text-sm text-fg-muted">
                Press Generate (or change an option) to create a {modeLabel} on your device.
              </p>
            ) : null}

            {bulk && bulkItems ? (
              <BulkList items={bulkItems} what={modeLabel} fileBase={FILE_BASE[mode]} />
            ) : null}

            {bulk && !bulkItems ? (
              <p className="rounded-md border border-border bg-surface-sunken px-4 py-3 text-sm text-fg-muted">
                Set your options and press Generate to create {bulkCount} at once.
              </p>
            ) : null}

            {/* Actions */}
            <div className="flex flex-col gap-4 border-t border-border pt-5">
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="primary" onClick={runGenerate}>
                  <RefreshCw size={16} strokeWidth={1.75} aria-hidden="true" />
                  Generate
                  <kbd className="ml-1 hidden rounded-sm border border-[color-mix(in_srgb,var(--on-accent)_40%,transparent)] px-1 font-mono text-xs sm:inline">
                    ⌘↵
                  </kbd>
                </Button>
                <div className="min-w-[220px] flex-1">
                  <Switch
                    label="Bulk generate"
                    hint={`Create ${BULK.min}–${BULK.max} at once with copy-all and export.`}
                    checked={bulk}
                    onChange={toggleBulk}
                  />
                </div>
              </div>
              {bulk ? (
                <NumberSlider
                  label="How many"
                  value={bulkCount}
                  min={BULK.min}
                  max={BULK.max}
                  onChange={setBulkCount}
                  className="max-w-md"
                />
              ) : null}
            </div>

            {/* Options */}
            {mode !== "uuid" ? (
              <div className="border-t border-border pt-5">
                <h3 className="mb-4 text-sm font-medium uppercase tracking-[0.06em] text-fg-faint">
                  Options
                </h3>
                {mode === "password" ? (
                  <PasswordControls
                    value={passwordOpts}
                    onChange={(o) => updateOpts(setPasswordOpts, o, () => generatePassword(o))}
                  />
                ) : null}
                {mode === "passphrase" ? (
                  <PassphraseControls
                    value={passphraseOpts}
                    onChange={(o) => updateOpts(setPassphraseOpts, o, () => generatePassphrase(o))}
                  />
                ) : null}
                {mode === "pronounceable" ? (
                  <PronounceableControls
                    value={pronounceableOpts}
                    onChange={(o) =>
                      updateOpts(setPronounceableOpts, o, () => generatePronounceable(o))
                    }
                  />
                ) : null}
                {mode === "pin" ? (
                  <PinControls
                    value={pinOpts}
                    onChange={(o) => updateOpts(setPinOpts, o, () => generatePin(o))}
                  />
                ) : null}
                {mode === "string" ? (
                  <StringControls
                    value={stringOpts}
                    onChange={(o) => updateOpts(setStringOpts, o, () => generateRandomString(o))}
                  />
                ) : null}
                {mode === "token" ? (
                  <TokenControls
                    value={tokenOpts}
                    onChange={(o) => updateOpts(setTokenOpts, o, () => generateApiToken(o))}
                  />
                ) : null}
                {mode === "wifi" ? (
                  <WifiControls
                    value={wifiOpts}
                    onChange={(o) => updateOpts(setWifiOpts, o, () => generateWifiPassword(o))}
                  />
                ) : null}
              </div>
            ) : (
              <p className="border-t border-border pt-5 text-sm text-fg-muted">
                UUID v4 has no options. Each identifier carries 122 bits of randomness.
              </p>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
