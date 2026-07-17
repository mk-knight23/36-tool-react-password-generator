import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
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
import { MiniGenerator } from "@/components/product/MiniGenerator";
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
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      {/* Hero */}
      <section className="grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
        <div className="flex flex-col gap-6">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-sm border border-success px-2 py-0.5 text-xs font-medium uppercase tracking-[0.06em] text-success">
            <ShieldCheck size={14} strokeWidth={1.75} aria-hidden="true" />
            Runs entirely in your browser
          </span>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-fg sm:text-5xl md:text-[clamp(2.5rem,1.5rem+3vw,4rem)]">
            Generate passwords and secrets that never leave your device.
          </h1>
          <p className="max-w-xl text-lg text-fg-muted">
            Passwords, passphrases, tokens, and recovery codes, all produced
            locally with Web Crypto. Nothing you generate touches a server.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/generate"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-accent-fill px-5 text-sm font-medium text-on-accent transition-colors duration-fast ease-enter hover:bg-accent-hover"
            >
              Open the generator
              <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
            </Link>
            <Link
              href="/analyze"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border-strong bg-surface px-5 text-sm font-medium text-fg transition-colors duration-fast ease-enter hover:bg-surface-sunken"
            >
              Analyze a password
            </Link>
          </div>
        </div>
        <MiniGenerator />
      </section>

      {/* Not a password manager */}
      <Card
        as="section"
        className="flex items-start gap-3 border-warning/40 bg-surface"
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
          <p className="mt-1 text-sm text-fg-muted">{NOT_A_PASSWORD_MANAGER}</p>
        </div>
      </Card>

      {/* Boundary diagram */}
      <section className="py-16 md:py-24">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-fg">
            Where the boundary sits
          </h2>
          <p className="mt-2 text-fg-muted">
            The claim that your secrets stay local is only worth something if you
            can see it. Here is exactly what happens on your device and what,
            if anything, crosses to the internet.
          </p>
        </div>
        <BoundaryDiagram />
      </section>

      {/* Feature grid */}
      <section className="pb-16 md:pb-24">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-fg">
            What it does
          </h2>
          <p className="mt-2 text-fg-muted">
            Concrete features, described plainly. No fake numbers, no
            testimonials.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="flex flex-col gap-3">
              <Icon size={24} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-fg">{title}</h3>
              <p className="text-sm text-fg-muted">{body}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="pb-24">
        <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-fg">
              Generate your first secret
            </h2>
            <p className="mt-1 text-sm text-fg-muted">
              Free, open source, and nothing to install.
            </p>
          </div>
          <Link
            href="/generate"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-accent-fill px-5 text-sm font-medium text-on-accent transition-colors duration-fast ease-enter hover:bg-accent-hover"
          >
            Open the generator
            <ArrowRight size={16} strokeWidth={1.75} aria-hidden="true" />
          </Link>
        </Card>
      </section>
    </div>
  );
}
