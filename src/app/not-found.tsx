import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { NAV_LINKS } from "@/components/shell/Nav";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-6 px-4 py-24 text-center sm:px-6">
      <FileQuestion size={40} strokeWidth={1.75} className="text-accent" aria-hidden="true" />
      <div className="flex flex-col gap-2">
        <p className="font-mono text-sm text-fg-muted">404</p>
        <h1 className="text-3xl font-semibold text-fg">Page not found</h1>
        <p className="text-base text-fg-muted">
          That page does not exist. Try one of these instead:
        </p>
      </div>
      <nav aria-label="Suggested pages" className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-md bg-accent-fill px-4 text-sm font-medium text-on-accent hover:bg-accent-hover"
        >
          Home
        </Link>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="inline-flex h-11 items-center justify-center rounded-md border border-border-strong bg-surface px-4 text-sm font-medium text-fg hover:bg-surface-sunken"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
