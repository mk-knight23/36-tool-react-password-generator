"use client";

import { useEffect, useRef, useState } from "react";
import { Download, ShieldAlert, Trash2, Upload } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Switch } from "@/components/ui/Toggle";
import { SelectField } from "@/components/ui/Field";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { useToast } from "@/components/ui/Toast";
import {
  loadSettings,
  saveSettings,
  DEFAULT_SETTINGS,
  type Settings,
  type AutoClearDelay,
  type ConsentState,
} from "@/lib/settings";
import {
  exportData,
  importData,
  clearAllData,
  getStorageUsage,
  type ExportBundle,
  type StorageUsage,
} from "@/lib/storage";
import { downloadText } from "@/lib/download";
import { track } from "@/lib/analytics";

const AUTO_CLEAR_OPTIONS: Array<{ value: string; label: string }> = [
  { value: "15", label: "After 15 seconds" },
  { value: "30", label: "After 30 seconds" },
  { value: "60", label: "After 60 seconds" },
  { value: "0", label: "Never clear automatically" },
];

function formatBytes(bytes: number | null): string {
  if (bytes === null) return "unknown";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

/**
 * All local preferences plus data controls. Settings live in localStorage;
 * secret history lives in IndexedDB and is only ever touched when the user opts
 * in. Export/import/clear act on this browser's own data — nothing is sent
 * anywhere (STANDARDS §8, PRODUCT_SPEC §5.13).
 */
export function SettingsView() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [usage, setUsage] = useState<StorageUsage | null>(null);
  const [enableHistoryOpen, setEnableHistoryOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const refreshUsage = () => void getStorageUsage().then(setUsage);

  useEffect(() => {
    setSettings(loadSettings());
    refreshUsage();
  }, []);

  if (!settings) {
    return <div className="h-96 rounded-lg border border-border bg-surface-sunken" aria-hidden="true" />;
  }

  const update = (patch: Partial<Settings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveSettings(next);
    track("settings_changed", { keys: Object.keys(patch).join(",") });
  };

  const onHistoryToggle = (checked: boolean) => {
    if (checked) {
      setEnableHistoryOpen(true);
    } else {
      update({ historyEnabled: false });
      toast("History turned off. Existing entries are kept until you wipe them.", "info");
    }
  };

  const confirmEnableHistory = () => {
    update({ historyEnabled: true });
    setEnableHistoryOpen(false);
    toast("History is on for this device.", "success");
  };

  const setConsent = (consent: ConsentState) => update({ analyticsConsent: consent });

  const onExport = async () => {
    const bundle = await exportData();
    const stamp = new Date().toISOString().slice(0, 10);
    downloadText(`vaultpass-export-${stamp}.json`, JSON.stringify(bundle, null, 2), "application/json");
    toast("Exported your local data to a file.", "success");
  };

  const onImportFile = async (file: File) => {
    try {
      const text = await file.text();
      const bundle = JSON.parse(text) as ExportBundle;
      await importData(bundle);
      setSettings(loadSettings());
      refreshUsage();
      toast("Imported data from the file.", "success");
    } catch (e) {
      toast(e instanceof Error ? e.message : "That file could not be imported.", "error");
    }
  };

  const onClearAll = async () => {
    await clearAllData();
    const reset = { ...DEFAULT_SETTINGS };
    saveSettings(reset);
    setSettings(reset);
    refreshUsage();
    setClearOpen(false);
    toast("All local data cleared from this browser.", "success");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* History */}
      <Card as="section" className="flex flex-col gap-4">
        <SectionHeading title="History" />
        <Switch
          label="Save generated secrets on this device"
          hint="Off by default. When on, secrets are stored in this browser so you can look them up in History."
          checked={settings.historyEnabled}
          onChange={onHistoryToggle}
        />
      </Card>

      {/* Clipboard */}
      <Card as="section" className="flex flex-col gap-4">
        <SectionHeading title="Clipboard" />
        <SelectField
          label="Clear the clipboard after copying"
          value={String(settings.autoClearDelay)}
          onChange={(v) => update({ autoClearDelay: Number(v) as AutoClearDelay })}
          options={AUTO_CLEAR_OPTIONS}
        />
        <p className="text-xs text-fg-muted">
          Best effort only: clearing works while this page is open and focused,
          and some operating-system clipboard managers keep their own history.
        </p>
      </Card>

      {/* Appearance */}
      <Card as="section" className="flex flex-col gap-4">
        <SectionHeading title="Appearance" />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-fg">Theme</p>
            <p className="text-xs text-fg-muted">Light, dark, or match your system.</p>
          </div>
          <ThemeToggle />
        </div>
        <Switch
          label="Sound on generate"
          hint="Play a short click when you generate a secret."
          checked={settings.sound}
          onChange={(v) => update({ sound: v })}
        />
      </Card>

      {/* Privacy / analytics */}
      <Card as="section" className="flex flex-col gap-4">
        <SectionHeading title="Analytics" />
        <p className="text-sm text-fg-muted">
          Analytics are off unless you allow them, and they never receive any
          generated secret — only anonymous event names and counts. It is safe
          to leave this declined.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-fg-muted">
            Current: <span className="font-medium text-fg">{consentLabel(settings.analyticsConsent)}</span>
          </span>
          <div className="flex gap-2">
            <Button
              variant={settings.analyticsConsent === "granted" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setConsent("granted")}
            >
              Allow
            </Button>
            <Button
              variant={settings.analyticsConsent === "declined" ? "primary" : "secondary"}
              size="sm"
              onClick={() => setConsent("declined")}
            >
              Decline
            </Button>
          </div>
        </div>
      </Card>

      {/* Data controls */}
      <Card as="section" className="flex flex-col gap-4">
        <SectionHeading title="Your data" />
        <p className="text-sm text-fg-muted">
          Stored locally: {usage ? formatBytes(usage.usageBytes) : "…"}
          {usage?.quotaBytes ? ` of about ${formatBytes(usage.quotaBytes)} available` : ""}
          {usage ? ` · ${usage.historyEntries} history ${usage.historyEntries === 1 ? "entry" : "entries"}` : ""}.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => void onExport()}>
            <Download size={16} strokeWidth={1.75} aria-hidden="true" />
            Export
          </Button>
          <Button variant="secondary" onClick={() => fileInput.current?.click()}>
            <Upload size={16} strokeWidth={1.75} aria-hidden="true" />
            Import
          </Button>
          <input
            ref={fileInput}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onImportFile(file);
              e.target.value = "";
            }}
          />
          <Button variant="danger" onClick={() => setClearOpen(true)}>
            <Trash2 size={16} strokeWidth={1.75} aria-hidden="true" />
            Clear all data
          </Button>
        </div>
      </Card>

      {/* Enable-history warning */}
      <Modal
        open={enableHistoryOpen}
        onClose={() => setEnableHistoryOpen(false)}
        title="Turn on local history?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setEnableHistoryOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmEnableHistory}>
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
              browser in plain text so you can view it later.
            </p>
            <p>
              Anyone with access to this device and browser profile could open
              it. Do not turn this on for a shared or public machine.
            </p>
          </div>
        </div>
      </Modal>

      {/* Clear-all confirm */}
      <Modal
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        title="Clear all local data?"
        footer={
          <>
            <Button variant="ghost" onClick={() => setClearOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => void onClearAll()}>
              Clear everything
            </Button>
          </>
        }
      >
        <p className="text-sm text-fg-muted">
          This removes your saved history, generation counts, and preferences
          from this browser and resets settings to their defaults. It cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}

function consentLabel(state: ConsentState): string {
  if (state === "granted") return "Allowed";
  if (state === "declined") return "Declined";
  return "Not set (treated as declined)";
}

function SectionHeading({ title }: { title: string }) {
  return <h2 className="text-xl font-semibold text-fg">{title}</h2>;
}
