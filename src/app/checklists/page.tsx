import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/content/PageHeader";
import { ChecklistsView } from "@/components/checklists/ChecklistsView";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Security checklists & policy templates",
  description:
    "Work through an environment-secret checklist and an API-key rotation checklist, and copy plain password-policy templates. Check-off state is saved locally and the sheets are printable.",
  path: "/checklists",
});

export default function ChecklistsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <PageHeader
        title="Security checklists & policy templates"
        lead="Repeatable steps for handling secrets, and starting-point policy text you can copy and adapt. Everything runs in your browser; your ticks are stored only on this device."
        trail={[{ name: "Checklists", path: "/checklists" }]}
      />

      <div className="mt-10">
        <ChecklistsView />
      </div>

      <section className="no-print mt-12 border-t border-border pt-8">
        <p className="text-sm text-fg-muted">
          Building a policy from scratch? The{" "}
          <Link href="/policies" className="text-accent hover:text-accent-hover">
            policy builder
          </Link>{" "}
          composes and tests the mechanical rules, and{" "}
          <Link
            href="/guides/password-policies-that-work"
            className="text-accent hover:text-accent-hover"
          >
            password policies that work
          </Link>{" "}
          explains the reasoning behind them.
        </p>
      </section>
    </div>
  );
}
