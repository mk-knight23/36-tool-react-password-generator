"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
  disabled?: boolean;
}

export function Checkbox({ label, checked, onChange, hint, disabled }: CheckboxProps) {
  const id = useId();
  return (
    <div className="flex items-start gap-3">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-xs border-border-strong accent-[var(--accent)]"
      />
      <label htmlFor={id} className="cursor-pointer text-sm text-fg">
        {label}
        {hint ? <span className="mt-0.5 block text-xs text-fg-muted">{hint}</span> : null}
      </label>
    </div>
  );
}

interface SwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}

/** A switch that also states its on/off status in text, not colour alone. */
export function Switch({ label, checked, onChange, hint }: SwitchProps) {
  const id = useId();
  return (
    <div className="flex items-start justify-between gap-4">
      <label htmlFor={id} className="text-sm text-fg">
        {label}
        {hint ? <span className="mt-0.5 block text-xs text-fg-muted">{hint}</span> : null}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors duration-fast ease-enter",
          checked ? "border-accent bg-accent-fill" : "border-border-strong bg-surface-sunken",
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 rounded-full bg-surface shadow-1 transition-transform duration-fast ease-enter",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
        <span className="sr-only">{checked ? "On" : "Off"}</span>
      </button>
    </div>
  );
}
