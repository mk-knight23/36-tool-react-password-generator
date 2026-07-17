import type { Metadata } from "next";
import { Github, Mail, Shield } from "lucide-react";
import { PageHeader } from "@/components/content/PageHeader";
import { Card } from "@/components/ui/Card";
import { pageMetadata } from "@/lib/seo";
import { CONTACT_EMAIL, SITE } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Reach the maintainer of MK VaultPass by email or open an issue on GitHub. For security reports, use the responsible-disclosure address.",
  path: "/contact",
});

const ISSUES_URL = `${SITE.repo}/issues`;

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16">
      <PageHeader
        title="Contact"
        lead="Questions, bug reports, and ideas are all welcome. Pick whichever channel fits."
        trail={[{ name: "Contact", path: "/contact" }]}
      />

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Card className="flex flex-col gap-3">
          <Github size={24} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-fg">Open an issue</h2>
          <p className="text-sm text-fg-muted">
            Bugs, feature requests, and questions about the code are best raised as a GitHub
            issue, where they are public and tracked.
          </p>
          <a
            href={ISSUES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover"
          >
            Go to GitHub issues
          </a>
        </Card>

        <Card className="flex flex-col gap-3">
          <Mail size={24} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
          <h2 className="text-xl font-semibold text-fg">Email</h2>
          <p className="text-sm text-fg-muted">
            For anything that does not fit an issue, or a private note, email the maintainer
            directly.
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-1 inline-flex w-fit items-center gap-1.5 font-mono text-sm font-medium text-accent hover:text-accent-hover"
          >
            {CONTACT_EMAIL}
          </a>
        </Card>
      </div>

      <Card as="section" className="mt-6 flex items-start gap-3">
        <Shield size={20} strokeWidth={1.75} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
        <div>
          <h2 className="text-sm font-semibold text-fg">Reporting a security issue</h2>
          <p className="mt-1 text-sm text-fg-muted">
            If you have found a vulnerability, please report it privately by email to{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-mono text-accent hover:text-accent-hover"
            >
              {CONTACT_EMAIL}
            </a>{" "}
            rather than opening a public issue, so it can be fixed before it is widely known.
            Details are in the machine-readable{" "}
            <a
              href="/.well-known/security.txt"
              className="text-accent hover:text-accent-hover"
            >
              security.txt
            </a>
            .
          </p>
        </div>
      </Card>
    </div>
  );
}
