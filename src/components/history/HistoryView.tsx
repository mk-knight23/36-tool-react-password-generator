"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { History, Search, ShieldAlert, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { TextField } from "@/components/ui/Field";
import { SecretOutput } from "@/components/product/SecretOutput";
import { IconButton } from "@/components/ui/IconButton";
import { useToast } from "@/components/ui/Toast";
import { MODE_LABELS } from "@/lib/generators";
import { loadSettings, saveSettings } from "@/lib/settings";
import {
  listHistory,
  deleteHistoryEntry,
  updateHistoryNote,
  wipeHistory,
  type HistoryEntry,
} from "@/lib/storage";

function formatDate(ms: number): string {
  try {
    return new Date(ms).toLocaleString();
  } catch {
    return "";
  }
}

/**
 * Opt-in secret history (PRODUCT_SPEC §5.13). Off by default; enabling requires
 * acknowledging the shared-machine risk. Entries are masked by default, live in
 * IndexedDB on this device only, and can be wiped in one action. Searching runs
 * entirely in memory and never leaves the browser.
 */
export function HistoryView() {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [query, setQuery] = useState("");
  const [enableOpen, setEnableOpen] = useState(false);
  const [wipeOpen, setWipeOpen] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setEntries(await listHistory());
    } catch {
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    const s = loadSettings();
    setEnabled(s.historyEnabled);
    if (s.historyEnabled) void refresh();
  }, [refresh]);

  const enableHistory = () => {
    saveSettings({ ...loadSettings(), historyEnabled: true });
    setEnabled(true);
    setEnableOpen(false);
    void refresh();
    toast("History is on. New generations will be saved on this device.", "success");
  };

  const onWipe = async () => {
    await wipeHistory();
    setEntries([]);
    setWipeOpen(false);
    toast("History wiped from this device.", "success");
  };

  const onDelete = async (id: string) => {
    await deleteHistoryEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const onNote = async (id: string, note: string) => {
    await updateHistoryNote(id, note);
    setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, note } : e)));
  };

  if (enabled === null) {
    return <div className="h-64 rounded-lg border border-border bg-surface-sunken" aria-hidden="true" />;
  }

  if (!enabled) {
    return (
      <>
        <Card className="flex flex-col items-center gap-4 py-16 text-center">
          <History size={32} strokeWidth={1.5} className="text-fg-faint" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold text-fg">History is off</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-fg-muted">
              By default, MK VaultPass does not keep any record of what you
              generate. You can turn on local history if you want to look up
              recent secrets, but only do that on a device you trust.
            </p>
          </div>
          <Button variant="primary" onClick={() => setEnableOpen(true)}>
            Turn on history
          </Button>
        </Card>

        <Modal
          open={enableOpen}
          onClose={() => setEnableOpen(false)}
          title="Turn on local history?"
          footer={
            <>
              <Button variant="ghost" onClick={() => setEnableOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={enableHistory}>
                I understand, turn it on
              </Button>
            </>
          }
        >
          <div className="flex items-start gap-3">
            <ShieldAlert size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
            <div className="flex flex-col gap-2 text-sm text-fg-muted">
              <p>
                With history on, every secret you generate is stored in this
                browser&apos;s IndexedDB in plain text so you can view it later.
              </p>
              <p>
                Anyone with access to this device and browser profile could open
                it. Do not turn this on for a shared or public machine. You can
                wipe history at any time, and turning it back off stops new
                entries from being saved.
              </p>
            </div>
          </div>
        </Modal>
      </>
    );
  }

  const q = query.trim().toLowerCase();
  const filtered = q
    ? entries.filter(
        (e) =>
          e.value.toLowerCase().includes(q) ||
          e.note.toLowerCase().includes(q) ||
          MODE_LABELS[e.mode].toLowerCase().includes(q),
      )
    : entries;

  return (
    <div className="flex flex-col gap-6">
      <Card className="flex items-start gap-3 border-warning/40">
        <ShieldAlert size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-warning" aria-hidden="true" />
        <p className="text-sm text-fg-muted">
          History is on for this device. Secrets below are stored locally in plain
          text. Turn history off in{" "}
          <Link href="/settings" className="text-accent hover:text-accent-hover">
            Settings
          </Link>{" "}
          when you are done.
        </p>
      </Card>

      {entries.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 py-16 text-center">
          <History size={32} strokeWidth={1.5} className="text-fg-faint" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold text-fg">No saved secrets yet</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-fg-muted">
              History is on, so anything you generate from now on will appear
              here.
            </p>
          </div>
          <Link
            href="/generate"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent-fill px-5 text-sm font-medium text-on-accent transition-colors duration-fast ease-enter hover:bg-accent-hover"
          >
            Open the generator
          </Link>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative min-w-[220px] flex-1">
              <Search
                size={16}
                strokeWidth={1.75}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fg-faint"
                aria-hidden="true"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search entries"
                aria-label="Search history"
                className="w-full rounded-md border border-border-strong bg-surface py-2 pl-9 pr-3 text-sm text-fg placeholder:text-fg-faint"
              />
            </div>
            <Button variant="danger" onClick={() => setWipeOpen(true)}>
              <Trash2 size={16} strokeWidth={1.75} aria-hidden="true" />
              Wipe all
            </Button>
          </div>

          <ul className="flex flex-col gap-4">
            {filtered.map((entry) => (
              <li key={entry.id}>
                <Card className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-sm font-medium text-fg">
                      {MODE_LABELS[entry.mode]}
                    </span>
                    <span className="font-mono text-xs tabular-nums text-fg-faint">
                      {Math.round(entry.entropyBits)} bits · {formatDate(entry.createdAt)}
                    </span>
                  </div>
                  <SecretOutput
                    value={entry.value}
                    what={MODE_LABELS[entry.mode].toLowerCase()}
                    defaultRevealed={false}
                  />
                  <div className="flex items-end gap-2">
                    <div className="flex-1">
                      <TextField
                        label="Note"
                        value={entry.note}
                        onChange={(v) => onNote(entry.id, v)}
                        placeholder="Optional label, e.g. old router"
                        maxLength={120}
                      />
                    </div>
                    <IconButton label="Delete this entry" onClick={() => void onDelete(entry.id)}>
                      <Trash2 size={18} strokeWidth={1.75} aria-hidden="true" />
                    </IconButton>
                  </div>
                </Card>
              </li>
            ))}
          </ul>

          {filtered.length === 0 ? (
            <p className="text-center text-sm text-fg-muted">
              No entries match &ldquo;{query}&rdquo;.
            </p>
          ) : null}
        </>
      )}

      <Modal
        open={wipeOpen}
        onClose={() => setWipeOpen(false)}
        title="Wipe all history?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setWipeOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => void onWipe()}>
              Wipe {entries.length} {entries.length === 1 ? "entry" : "entries"}
            </Button>
          </>
        }
      >
        <p className="text-sm text-fg-muted">
          This permanently removes every saved secret from this browser. It
          cannot be undone. History stays on, so new generations will still be
          saved.
        </p>
      </Modal>
    </div>
  );
}
