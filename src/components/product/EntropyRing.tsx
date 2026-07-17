import type { StrengthLevel } from "@/lib/analysis/strength";

interface EntropyRingProps {
  bits: number;
  level: StrengthLevel;
  label: string;
  estimated?: boolean;
  size?: "sm" | "lg";
}

/** Bits mapped to the full circle. 128 bits fills the ring. */
const FULL_SCALE_BITS = 128;

const DIMS = {
  sm: { box: 96, stroke: 8, font: 20, sub: 10 },
  lg: { box: 176, stroke: 12, font: 34, sub: 13 },
} as const;

/**
 * The product's signature entropy gauge (DESIGN_SYSTEM.md §8.1). A circular SVG
 * dial: the arc length maps to entropy bits (capped at 128), coloured by the
 * strength level. Never colour-only — the bits number and label are always
 * shown, and the SVG is labelled for screen readers.
 */
export function EntropyRing({ bits, level, label, estimated, size = "lg" }: EntropyRingProps) {
  const { box, stroke, font, sub } = DIMS[size];
  const radius = (box - stroke) / 2;
  const cx = box / 2;
  const cy = box / 2;
  const circumference = 2 * Math.PI * radius;
  const fraction = Math.max(0, Math.min(1, bits / FULL_SCALE_BITS));
  const dashOffset = circumference * (1 - fraction);
  const color = `var(--strength-${level})`;
  const roundedBits = Math.round(bits);

  // Vault-dial tick marks every 10 bits around the track.
  const ticks: number[] = [];
  for (let b = 0; b <= FULL_SCALE_BITS; b += 10) ticks.push(b);

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <svg
        width={box}
        height={box}
        viewBox={`0 0 ${box} ${box}`}
        role="img"
        aria-label={`Strength: ${label}, ${roundedBits}${estimated ? " estimated" : ""} bits`}
      >
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={stroke}
        />
        {/* Tick marks */}
        <g stroke="var(--border-strong)" strokeWidth={1}>
          {ticks.map((b) => {
            const angle = (b / FULL_SCALE_BITS) * 2 * Math.PI - Math.PI / 2;
            const outer = radius + stroke / 2;
            const inner = outer - stroke * 0.6;
            const x1 = cx + Math.cos(angle) * inner;
            const y1 = cy + Math.sin(angle) * inner;
            const x2 = cx + Math.cos(angle) * outer;
            const y2 = cy + Math.sin(angle) * outer;
            return <line key={b} x1={x1} y1={y1} x2={x2} y2={y2} aria-hidden="true" />;
          })}
        </g>
        {/* Value arc */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dashoffset var(--duration-ring) var(--ease-enter)" }}
        />
        {/* Center readout */}
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--fg)"
          fontFamily="var(--font-mono)"
          fontSize={font}
          fontWeight={700}
          style={{ fontVariantNumeric: "tabular-nums" }}
        >
          {roundedBits}
        </text>
        <text
          x={cx}
          y={cy + font * 0.7}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--fg-muted)"
          fontFamily="var(--font-mono)"
          fontSize={sub}
        >
          bits
        </text>
      </svg>
      <div className="text-center">
        <p className="text-sm font-semibold" style={{ color }}>
          {label}
        </p>
        {estimated ? (
          <p className="text-xs text-fg-muted">estimated</p>
        ) : null}
      </div>
    </div>
  );
}
