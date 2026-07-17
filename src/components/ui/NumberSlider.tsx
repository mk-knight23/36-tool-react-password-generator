"use client";

import { useId } from "react";
import { cn } from "@/lib/cn";

interface NumberSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  className?: string;
}

/**
 * A range slider paired with a numeric input. The numeric input is the WCAG 2.2
 * §2.5.7 dragging alternative and gives keyboard users an exact entry path.
 */
export function NumberSlider({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
  className,
}: NumberSliderProps) {
  const id = useId();

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
        </label>
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => {
            const n = Number(e.target.value);
            if (!Number.isNaN(n)) onChange(clamp(n));
          }}
          aria-label={`${label} (exact value)`}
          className={cn(
            "w-20 rounded-md border border-border-strong bg-surface px-2 py-1",
            "text-right font-mono text-sm tabular-nums text-fg",
          )}
        />
      </div>
      <input
        id={id}
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(clamp(Number(e.target.value)))}
        className="h-2 w-full cursor-pointer accent-[var(--accent)]"
      />
    </div>
  );
}
