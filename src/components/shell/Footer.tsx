import Link from "next/link";
import { Github, Globe, KeyRound } from "lucide-react";
import { SITE, CREATOR, NOT_A_PASSWORD_MANAGER } from "@/lib/site";
import { NAV_LINKS as PRODUCT_LINKS } from "@/lib/nav";

/**
 * Footer present on every route. The creator sentence is exact and
 * non-negotiable (STANDARDS §3). Help/links sit in the same place on every page
 * (WCAG 2.2 §3.2.6 Consistent Help).
 */
export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr]">
          <div className="max-w-sm">
            <div className="inline-flex items-center gap-2 font-semibold text-fg">
              <KeyRound size={20} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
              {SITE.name}
            </div>
            <p className="mt-3 text-sm text-fg-muted">{NOT_A_PASSWORD_MANAGER}</p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.06em] text-fg-faint">
              Product
            </span>
            {PRODUCT_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit text-sm text-fg-muted hover:text-fg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-fg-muted">
            {CREATOR.footerSentence}
          </p>
          <div className="flex items-center gap-4">
            <a
              href={CREATOR.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
            >
              <Github size={16} strokeWidth={1.75} aria-hidden="true" />
              GitHub
            </a>
            <a
              href={SITE.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
            >
              <KeyRound size={16} strokeWidth={1.75} aria-hidden="true" />
              Source
            </a>
            <a
              href={CREATOR.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
            >
              <Globe size={16} strokeWidth={1.75} aria-hidden="true" />
              Portfolio
            </a>
          </div>
        </div>
        <p className="mt-6 text-xs text-fg-faint">
          &copy; {year} {CREATOR.name}. MIT licensed. Open source for everyone.
        </p>
      </div>
    </footer>
  );
}
