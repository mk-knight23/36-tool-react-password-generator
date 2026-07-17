/**
 * Reserved advertising slot — prepared but DISABLED (STANDARDS §7).
 *
 * With `NEXT_PUBLIC_ADSENSE_ENABLED` unset or not "true" (the default), this
 * renders nothing and no ad script is ever loaded. The flag and this component
 * exist so ads can be switched on later without touching page layout. Even when
 * the flag is on, no network ad script loads until a real publisher ID is wired
 * — see MONETIZATION_PLAN.md. Placements are limited to long guides and the docs
 * sidebar. Fixed dimensions keep cumulative layout shift at zero when enabled.
 */
const ADSENSE_ENABLED = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === "true";

interface AdSlotProps {
  /** Human-readable placement id, e.g. "guide-inline". */
  slot: string;
  /** Reserved height in px (fixed to avoid CLS). Defaults to a leaderboard. */
  height?: number;
  className?: string;
}

export function AdSlot({ slot, height = 90, className }: AdSlotProps) {
  if (!ADSENSE_ENABLED) return null;
  return (
    <div
      data-ad-slot={slot}
      style={{ height }}
      className={`flex w-full items-center justify-center rounded-md border border-dashed border-border bg-surface-sunken text-xs uppercase tracking-[0.06em] text-fg-faint ${className ?? ""}`}
      aria-hidden="true"
    >
      Advertisement
    </div>
  );
}
