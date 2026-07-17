"use client";

import { useRef } from "react";
import { cn } from "@/lib/cn";

interface Segment<T extends string> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string> {
  label: string;
  value: T;
  segments: Array<Segment<T>>;
  onChange: (value: T) => void;
}

/** A roving-tabindex tablist with arrow-key navigation (WCAG 2.1). */
export function SegmentedControl<T extends string>({
  label,
  value,
  segments,
  onChange,
}: SegmentedControlProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusIndex = (i: number) => {
    const wrapped = (i + segments.length) % segments.length;
    refs.current[wrapped]?.focus();
    onChange(segments[wrapped].value);
  };

  return (
    <div
      role="tablist"
      aria-label={label}
      className="flex gap-1 overflow-x-auto rounded-md border border-border bg-surface-sunken p-1"
    >
      {segments.map((seg, i) => {
        const selected = seg.value === value;
        return (
          <button
            key={seg.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(seg.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                focusIndex(i + 1);
              } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                focusIndex(i - 1);
              } else if (e.key === "Home") {
                e.preventDefault();
                focusIndex(0);
              } else if (e.key === "End") {
                e.preventDefault();
                focusIndex(segments.length - 1);
              }
            }}
            className={cn(
              "whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-colors duration-fast ease-enter",
              selected
                ? "bg-accent-soft text-accent"
                : "text-fg-muted hover:bg-surface hover:text-fg",
            )}
          >
            {seg.label}
          </button>
        );
      })}
    </div>
  );
}
