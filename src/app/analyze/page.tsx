import type { Metadata } from "next";
import { Analyzer } from "@/components/analyze/Analyzer";

export const metadata: Metadata = {
  title: "Analyze password strength",
  description:
    "Check a password's strength in your browser: entropy estimate, pattern detection, and a common-password check. Nothing you type is ever sent anywhere.",
  alternates: { canonical: "/analyze" },
};

export default function AnalyzePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-fg">Analyze</h1>
        <p className="mt-2 max-w-2xl text-lg text-fg-muted">
          Paste a password to see an entropy estimate, warnings about predictable
          patterns, and whether it appears on the common-password list. It all
          runs locally.
        </p>
      </header>
      <Analyzer />
    </div>
  );
}
