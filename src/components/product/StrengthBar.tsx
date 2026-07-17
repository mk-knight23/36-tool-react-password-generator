import type { StrengthLevel } from "@/lib/analysis/strength";

interface StrengthBarProps {
  bits: number;
  level: StrengthLevel;
  label: string;
  estimated?: boolean;
}

const SEGMENTS: StrengthLevel[] = [0, 1, 2, 3, 4];

/**
 * Five-segment linear strength meter (DESIGN_SYSTEM.md §9). Same scale as the
 * entropy ring; label and bits are always shown adjacent, so meaning never
 * relies on colour alone.
 */
export function StrengthBar({ bits, level, label, estimated }: StrengthBarProps) {
  const color = `var(--strength-${level})`;
  const roundedBits = Math.round(bits);
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex gap-1.5"
        role="meter"
        aria-valuemin={0}
        aria-valuemax={4}
        aria-valuenow={level}
        aria-label={`Strength: ${label}, ${roundedBits} bits`}
      >
        {SEGMENTS.map((seg) => (
          <span
            key={seg}
            aria-hidden="true"
            className="h-2 flex-1 rounded-full"
            style={{
              backgroundColor: seg <= level ? color : "var(--border)",
              transition: "background-color var(--duration-base) var(--ease-enter)",
            }}
          />
        ))}
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold" style={{ color }}>
          {label}
        </span>
        <span className="font-mono text-sm tabular-nums text-fg-muted">
          {roundedBits} bits{estimated ? " (est.)" : ""}
        </span>
      </div>
    </div>
  );
}
