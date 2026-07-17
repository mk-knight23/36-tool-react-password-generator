import type { Metadata } from "next";
import { Suspense } from "react";
import { Workspace } from "@/components/workspace/Workspace";

export const metadata: Metadata = {
  title: "Generate passwords, passphrases, and secrets",
  description:
    "Generate passwords, passphrases, PINs, UUIDs, API tokens, Wi-Fi keys, and recovery codes in your browser. Every secret is made with Web Crypto and never leaves your device.",
  alternates: { canonical: "/generate" },
};

export default function GeneratePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-fg">Generator</h1>
        <p className="mt-2 max-w-2xl text-lg text-fg-muted">
          Pick a mode, tune the options, and generate. Nothing you make here is sent
          anywhere — it is all produced in your browser.
        </p>
      </header>
      <Suspense fallback={<div className="h-96 rounded-lg border border-border bg-surface-sunken" />}>
        <Workspace />
      </Suspense>
    </div>
  );
}
