"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BarChart3, Database, History } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { MODE_LABELS } from "@/lib/generators";
import { GENERATOR_MODES } from "@/lib/generators/types";
import { totalGenerations, getStorageUsage, type StorageUsage } from "@/lib/storage";
import { useCounts, useSettings, useHydrated } from "@/lib/client-hooks";

function formatBytes(bytes: number | null): string {
  if (bytes === null) return "unknown";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

/**
 * Local-only dashboard. Every number here is read from this browser's own
 * storage — per-mode generation counts (localStorage) and IndexedDB usage. There
 * are no server calls and no invented figures; an unused install shows an honest
 * empty state (STANDARDS §3, PRODUCT_SPEC §5.13).
 */
export function Dashboard() {
  const hydrated = useHydrated();
  const counts = useCounts();
  const { historyEnabled } = useSettings();
  const [usage, setUsage] = useState<StorageUsage | null>(null);

  // IndexedDB usage is async, so setState here runs in a promise callback (not
  // synchronously in the effect body).
  useEffect(() => {
    void getStorageUsage().then(setUsage);
  }, []);

  if (!hydrated) {
    return (
      <div
        className="h-64 rounded-lg border border-border bg-surface-sunken"
        aria-hidden="true"
      />
    );
  }

  const total = totalGenerations(counts);
  const max = Math.max(1, ...GENERATOR_MODES.map((m) => counts[m]));
  const used = GENERATOR_MODES.filter((m) => counts[m] > 0);

  if (total === 0) {
    return (
      <Card className="flex flex-col items-center gap-4 py-16 text-center">
        <BarChart3 size={32} strokeWidth={1.5} className="text-fg-faint" aria-hidden="true" />
        <div>
          <h2 className="text-xl font-semibold text-fg">No generations yet</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-fg-muted">
            Once you start generating, this page shows how many of each type you
            have made on this device. These counts are stored locally and never
            leave your browser.
          </p>
        </div>
        <Link
          href="/generate"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent-fill px-5 text-sm font-medium text-on-accent transition-colors duration-fast ease-enter hover:bg-accent-hover"
        >
          Open the generator
        </Link>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={BarChart3}
          label="Total generated"
          value={total.toLocaleString()}
          hint="on this device"
        />
        <StatCard
          icon={History}
          label="Saved to history"
          value={historyEnabled ? (usage?.historyEntries ?? 0).toLocaleString() : "Off"}
          hint={historyEnabled ? "history is on" : "history is off by default"}
        />
        <StatCard
          icon={Database}
          label="Local storage used"
          value={usage ? formatBytes(usage.usageBytes) : "…"}
          hint={usage?.quotaBytes ? `of ~${formatBytes(usage.quotaBytes)} available` : "estimate"}
        />
      </div>

      <Card as="section" className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-fg">Generations by type</h2>
        <ul className="flex flex-col gap-3">
          {used
            .sort((a, b) => counts[b] - counts[a])
            .map((mode) => {
              const value = counts[mode];
              const pct = Math.round((value / max) * 100);
              return (
                <li key={mode} className="flex flex-col gap-1.5">
                  <div className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="font-medium text-fg">{MODE_LABELS[mode]}</span>
                    <span className="font-mono tabular-nums text-fg-muted">{value}</span>
                  </div>
                  <div
                    className="h-2 overflow-hidden rounded-full bg-surface-sunken"
                    role="img"
                    aria-label={`${MODE_LABELS[mode]}: ${value}`}
                  >
                    <span
                      className="block h-full rounded-full bg-accent-fill"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
        </ul>
        <p className="text-xs text-fg-muted">
          These are counts only. The passwords themselves are never recorded here
          — the count increments even when history is off.
        </p>
      </Card>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: typeof BarChart3;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm text-fg-muted">
        <Icon size={16} strokeWidth={1.75} aria-hidden="true" />
        {label}
      </div>
      <p className="font-mono text-3xl font-bold tabular-nums text-fg">{value}</p>
      <p className="text-xs text-fg-faint">{hint}</p>
    </Card>
  );
}
