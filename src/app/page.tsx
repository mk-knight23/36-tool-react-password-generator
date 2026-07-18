import type { Metadata } from "next";
import { Suspense } from "react";
import {
  Dice5,
  FileKey,
  History,
  KeyRound,
  Printer,
  ScanSearch,
  ShieldCheck,
  WifiOff,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { BoundaryDiagram } from "@/components/product/BoundaryDiagram";
import { Workspace } from "@/components/workspace/Workspace";
import { SITE, NOT_A_PASSWORD_MANAGER } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: "/" },
};

const FEATURES: Array<{ icon: typeof KeyRound; title: string; body: string }> = [
  {
    icon: KeyRound,
    title: "Nine generators",
    body: "Passwords, passphrases, pronounceable words, PINs, UUIDs, random strings, API tokens, Wi-Fi keys, and recovery codes.",
  },
  {
    icon: Dice5,
    title: "Uniform randomness",
    body: "Every character comes from Web Crypto with rejection sampling, so no character is more likely than another. No general-purpose random number generator is used for secrets.",
  },
  {
    icon: ScanSearch,
    title: "Local strength analysis",
    body: "Paste any password to see an entropy estimate, pattern warnings, and a check against the top thousand common passwords — all in your browser.",
  },
  {
    icon: History,
    title: "History is opt-in",
    body: "Nothing you generate is stored unless you turn history on yourself. When it is off, no secret is written to any storage.",
  },
  {
    icon: Printer,
    title: "Printable recovery sheets",
    body: "Generate a set of backup codes and print a clean, product-free sheet with a checkbox beside each code.",
  },
  {
    icon: WifiOff,
    title: "Works offline",
    body: "Generation needs no network. You can confirm it: open your browser's network tab and watch nothing leave while you generate.",
  },
];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE.name,
  description: SITE.description,
  url: SITE.url,
  applicationCategory: "SecurityApplication",
  operatingSystem: "Any (web browser)",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author: { "@type": "Person", name: "Kazi Musharraf", url: "https://www.mkazi.live" },
};

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* Hero */}
      <section className="flex flex-col items-center text-center gap-6 py-12 md:py-16">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-success/35 bg-success-soft px-3 py-1 text-xs font-semibold uppercase tracking-[0.06em] text-success">
          <ShieldCheck size={14} strokeWidth={2} aria-hidden="true" />
          Runs entirely in your browser
        </span>
        <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-fg sm:text-5xl md:text-6xl max-w-3xl">
          Generate secure passwords and secrets locally.
        </h1>
        <p className="max-w-2xl text-base sm:text-lg text-fg-muted">
          Generate passwords, passphrases, tokens, and recovery sheets locally using Web Crypto. 
          Nothing you make here ever touches a server.
        </p>
      </section>

      {/* Embedded Workspace */}
      <div id="generator" className="mb-16">
        <Suspense fallback={<div className="h-96 rounded-xl border border-border bg-surface-sunken animate-pulse" />}>
          <Workspace />
        </Suspense>
      </div>

      {/* Not a password manager Callout */}
      <Card
        as="section"
        className="mb-16 flex items-start gap-3 border-warning/40 bg-surface shadow-sm"
      >
        <FileKey
          size={20}
          strokeWidth={1.75}
          className="mt-0.5 shrink-0 text-warning"
          aria-hidden="true"
        />
        <div>
          <h2 className="text-sm font-semibold text-fg">
            This is not a password manager
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-fg-muted">{NOT_A_PASSWORD_MANAGER}</p>
        </div>
      </Card>

      {/* Boundary diagram */}
      <section className="py-12 border-t border-border">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
            Where the boundary sits
          </h2>
          <p className="mt-2 text-sm sm:text-base text-fg-muted">
            The claim that your secrets stay local is only worth something if you
            can verify it. Here is exactly what happens on your device and what,
            if anything, crosses to the internet.
          </p>
        </div>
        <BoundaryDiagram />
      </section>

      {/* Feature grid */}
      <section className="py-12 border-t border-border">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-fg">
            Core Security Features
          </h2>
          <p className="mt-2 text-sm sm:text-base text-fg-muted">
            Concrete features, described plainly. No fake numbers, no gimmicks.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="flex flex-col gap-3 shadow-sm hover:shadow-md transition-all">
              <Icon size={24} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
              <h3 className="text-lg font-semibold text-fg">{title}</h3>
              <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">{body}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
