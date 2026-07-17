import type { Metadata } from "next";
import { SettingsView } from "@/components/settings/SettingsView";

export const metadata: Metadata = {
  title: "Settings",
  description:
    "Control MK VaultPass on this device: history opt-in, clipboard auto-clear, theme, analytics consent, and export, import, or clear your local data.",
  alternates: { canonical: "/settings" },
};

export default function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-fg">Settings</h1>
        <p className="mt-2 max-w-2xl text-lg text-fg-muted">
          Every setting here applies to this browser only. There is no account,
          and nothing on this page is sent to a server.
        </p>
      </header>
      <SettingsView />
    </div>
  );
}
