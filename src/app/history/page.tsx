import type { Metadata } from "next";
import { HistoryView } from "@/components/history/HistoryView";

export const metadata: Metadata = {
  title: "History",
  description:
    "Optional, on-device history of what you have generated with MK VaultPass. Off by default, stored only in this browser, wipeable in one click.",
  alternates: { canonical: "/history" },
};

export default function HistoryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-fg">History</h1>
        <p className="mt-2 max-w-2xl text-lg text-fg-muted">
          History is off unless you turn it on. When on, generated secrets are
          saved in this browser only so you can look them up later.
        </p>
      </header>
      <HistoryView />
    </div>
  );
}
