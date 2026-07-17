import type { Metadata } from "next";
import { Dashboard } from "@/components/dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description:
    "Local, on-device stats for MK VaultPass: how many passwords, tokens, and codes you have generated in this browser. No accounts, no server data.",
  alternates: { canonical: "/dashboard" },
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-fg">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-lg text-fg-muted">
          Everything here is measured on this device and stored in this browser.
          There are no accounts and no server-side analytics behind these
          numbers.
        </p>
      </header>
      <Dashboard />
    </div>
  );
}
