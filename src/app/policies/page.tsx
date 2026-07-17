import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/content/PageHeader";
import { PolicyBuilder } from "@/components/policies/PolicyBuilder";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Password policy builder",
  description:
    "Compose a password policy, export it as JSON and readable text, and test a candidate password against it. Everything runs locally in your browser.",
  path: "/policies",
});

export default function PoliciesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 md:py-16">
      <PageHeader
        title="Password policy builder"
        lead="Build a policy, export it, and test passwords against it. The validator runs entirely on your device, so nothing you type is sent anywhere."
        trail={[{ name: "Policy builder", path: "/policies" }]}
      />
      <div className="mt-10">
        <PolicyBuilder />
      </div>
      <section className="mt-12 border-t border-border pt-8">
        <p className="text-sm text-fg-muted">
          Not sure what to require? Read{" "}
          <Link href="/guides/password-policies-that-work" className="text-accent hover:text-accent-hover">
            password policies that work
          </Link>{" "}
          for the reasoning behind these defaults.
        </p>
      </section>
    </div>
  );
}
