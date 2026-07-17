"use client";

import { NumberSlider } from "@/components/ui/NumberSlider";
import { Checkbox } from "@/components/ui/Toggle";
import { TextField, SelectField } from "@/components/ui/Field";
import { PASSWORD_LENGTH, type PasswordOptions } from "@/lib/generators/password";
import { PASSPHRASE, type PassphraseOptions, type CapitalizeMode } from "@/lib/generators/passphrase";
import { PRONOUNCEABLE, type PronounceableOptions } from "@/lib/generators/pronounceable";
import { PIN, type PinOptions } from "@/lib/generators/pin";
import { RANDOM_STRING, type RandomStringOptions } from "@/lib/generators/randomString";
import { API_TOKEN, type ApiTokenOptions, type TokenFormat } from "@/lib/generators/apiToken";
import { WIFI, type WifiOptions } from "@/lib/generators/wifi";
import type { AlphabetName } from "@/lib/generators/charsets";

interface ControlProps<T> {
  value: T;
  onChange: (next: T) => void;
}

/** Common separators for passphrases; "custom" reveals a single-char input. */
const SEPARATORS: Array<{ value: string; label: string }> = [
  { value: "-", label: "Dash ( - )" },
  { value: " ", label: "Space" },
  { value: ".", label: "Dot ( . )" },
  { value: "_", label: "Underscore ( _ )" },
  { value: ",", label: "Comma ( , )" },
];

export function PasswordControls({ value, onChange }: ControlProps<PasswordOptions>) {
  const set = <K extends keyof PasswordOptions>(k: K, v: PasswordOptions[K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="flex flex-col gap-5">
      <NumberSlider
        label="Length"
        value={value.length}
        min={PASSWORD_LENGTH.min}
        max={PASSWORD_LENGTH.max}
        onChange={(n) => set("length", n)}
      />
      <fieldset className="grid grid-cols-2 gap-3">
        <legend className="mb-2 text-sm font-medium text-fg">Character sets</legend>
        <Checkbox label="Uppercase (A–Z)" checked={value.uppercase} onChange={(v) => set("uppercase", v)} />
        <Checkbox label="Lowercase (a–z)" checked={value.lowercase} onChange={(v) => set("lowercase", v)} />
        <Checkbox label="Digits (0–9)" checked={value.digits} onChange={(v) => set("digits", v)} />
        <Checkbox label="Symbols (!@#…)" checked={value.symbols} onChange={(v) => set("symbols", v)} />
      </fieldset>
      <div className="flex flex-col gap-3">
        <Checkbox
          label="Require one from each selected set"
          hint="Guarantees coverage without biasing any position."
          checked={value.requireEachSet}
          onChange={(v) => set("requireEachSet", v)}
        />
        <Checkbox
          label="Exclude look-alike characters"
          hint="Drops il1Lo0O and similar."
          checked={value.excludeAmbiguous}
          onChange={(v) => set("excludeAmbiguous", v)}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Also include these characters"
          value={value.customInclude ?? ""}
          onChange={(v) => set("customInclude", v)}
          placeholder="optional"
          mono
        />
        <TextField
          label="Exclude these characters"
          value={value.excludeChars ?? ""}
          onChange={(v) => set("excludeChars", v)}
          placeholder="optional"
          mono
        />
      </div>
    </div>
  );
}

export function PassphraseControls({ value, onChange }: ControlProps<PassphraseOptions>) {
  const set = <K extends keyof PassphraseOptions>(k: K, v: PassphraseOptions[K]) =>
    onChange({ ...value, [k]: v });
  const isCustomSep = !SEPARATORS.some((s) => s.value === value.separator);
  return (
    <div className="flex flex-col gap-5">
      <NumberSlider
        label="Words"
        value={value.wordCount}
        min={PASSPHRASE.minWords}
        max={PASSPHRASE.maxWords}
        onChange={(n) => set("wordCount", n)}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Separator"
          value={isCustomSep ? "custom" : value.separator}
          onChange={(v) => set("separator", v === "custom" ? "" : v)}
          options={[...SEPARATORS, { value: "custom", label: "Custom character" }]}
        />
        <SelectField<CapitalizeMode>
          label="Capitalization"
          value={value.capitalize}
          onChange={(v) => set("capitalize", v)}
          options={[
            { value: "none", label: "None" },
            { value: "first", label: "First letter of each word" },
            { value: "all", label: "All uppercase" },
          ]}
        />
      </div>
      {isCustomSep ? (
        <TextField
          label="Custom separator"
          value={value.separator}
          onChange={(v) => set("separator", v.slice(0, 3))}
          placeholder="e.g. #"
          mono
        />
      ) : null}
      <NumberSlider
        label="Digits appended"
        value={value.appendDigits}
        min={0}
        max={PASSPHRASE.maxDigits}
        onChange={(n) => set("appendDigits", n)}
      />
    </div>
  );
}

export function PronounceableControls({ value, onChange }: ControlProps<PronounceableOptions>) {
  const set = <K extends keyof PronounceableOptions>(k: K, v: PronounceableOptions[K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="flex flex-col gap-5">
      <NumberSlider
        label="Length"
        value={value.length}
        min={PRONOUNCEABLE.minLength}
        max={PRONOUNCEABLE.maxLength}
        onChange={(n) => set("length", n)}
      />
      <Checkbox label="Capitalize the first letter" checked={value.capitalize} onChange={(v) => set("capitalize", v)} />
      <NumberSlider
        label="Digits appended"
        value={value.appendDigits}
        min={0}
        max={PRONOUNCEABLE.maxDigits}
        onChange={(n) => set("appendDigits", n)}
      />
    </div>
  );
}

export function PinControls({ value, onChange }: ControlProps<PinOptions>) {
  const set = <K extends keyof PinOptions>(k: K, v: PinOptions[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="flex flex-col gap-5">
      <NumberSlider
        label="Digits"
        value={value.length}
        min={PIN.minLength}
        max={PIN.maxLength}
        onChange={(n) => set("length", n)}
      />
      <Checkbox
        label="Avoid trivial PINs"
        hint="Rejects 0000, 1234, and other obvious patterns."
        checked={value.forbidTrivial}
        onChange={(v) => set("forbidTrivial", v)}
      />
    </div>
  );
}

export function StringControls({ value, onChange }: ControlProps<RandomStringOptions>) {
  const set = <K extends keyof RandomStringOptions>(k: K, v: RandomStringOptions[K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="flex flex-col gap-5">
      <NumberSlider
        label="Length"
        value={value.length}
        min={RANDOM_STRING.minLength}
        max={RANDOM_STRING.maxLength}
        onChange={(n) => set("length", n)}
      />
      <SelectField<AlphabetName | "custom">
        label="Alphabet"
        value={value.alphabet}
        onChange={(v) => set("alphabet", v)}
        options={[
          { value: "alnum", label: "Alphanumeric (A–Z a–z 0–9)" },
          { value: "hex", label: "Hex (0–9 a–f)" },
          { value: "base32", label: "Base32 (RFC 4648)" },
          { value: "base58", label: "Base58 (Bitcoin)" },
          { value: "base64url", label: "Base64url" },
          { value: "custom", label: "Custom alphabet" },
        ]}
      />
      {value.alphabet === "custom" ? (
        <TextField
          label="Custom alphabet"
          value={value.customAlphabet ?? ""}
          onChange={(v) => set("customAlphabet", v)}
          hint="At least 2 distinct characters. Duplicates are ignored."
          placeholder="e.g. ABCDEF0123456789"
          mono
        />
      ) : null}
    </div>
  );
}

export function TokenControls({ value, onChange }: ControlProps<ApiTokenOptions>) {
  const set = <K extends keyof ApiTokenOptions>(k: K, v: ApiTokenOptions[K]) =>
    onChange({ ...value, [k]: v });
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField<TokenFormat>
          label="Format"
          value={value.format}
          onChange={(v) => set("format", v)}
          options={[
            { value: "hex", label: "Hex" },
            { value: "base64url", label: "Base64url" },
            { value: "prefixed", label: "Prefixed (base64url body)" },
          ]}
        />
        <SelectField
          label="Random bytes"
          value={String(value.byteLength)}
          onChange={(v) => set("byteLength", Number(v))}
          options={API_TOKEN.byteChoices.map((b) => ({
            value: String(b),
            label: `${b} bytes (${b * 8} bits)`,
          }))}
        />
      </div>
      {value.format === "prefixed" ? (
        <TextField
          label="Prefix"
          value={value.prefix ?? ""}
          onChange={(v) => set("prefix", v.slice(0, API_TOKEN.maxPrefixLength))}
          hint="A plain label only. It is not a registered or reserved prefix and adds no entropy."
          placeholder="sk_live_"
          mono
        />
      ) : null}
    </div>
  );
}

export function WifiControls({ value, onChange }: ControlProps<WifiOptions>) {
  const set = <K extends keyof WifiOptions>(k: K, v: WifiOptions[K]) => onChange({ ...value, [k]: v });
  return (
    <div className="flex flex-col gap-5">
      <NumberSlider
        label="Length"
        value={value.length}
        min={WIFI.minLength}
        max={WIFI.maxLength}
        onChange={(n) => set("length", n)}
      />
      <Checkbox
        label="Easy-entry characters"
        hint="Drops symbols and look-alikes for TV and console keyboards. Lower entropy per character."
        checked={value.easyEntry}
        onChange={(v) => set("easyEntry", v)}
      />
    </div>
  );
}
