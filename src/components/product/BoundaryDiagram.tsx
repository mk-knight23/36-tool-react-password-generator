import { Cpu, Globe, Monitor, ShieldCheck } from "lucide-react";

/**
 * Local-security boundary diagram (DESIGN_SYSTEM.md §8.2). Documentation, not
 * decoration: every element carries real text. Left zone is the user's device
 * where all secret generation happens; the only line crossing to the internet
 * is the optional AI question route, whose schema rejects secrets.
 */
export function BoundaryDiagram() {
  return (
    <figure className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-[1.4fr_auto_1fr]">
        {/* Your device */}
        <div className="rounded-lg border-2 border-success bg-surface p-5">
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-success">
            <Monitor size={20} strokeWidth={1.75} aria-hidden="true" />
            Your device
          </div>
          <ul className="flex flex-col gap-2 text-sm text-fg-muted">
            <li className="flex items-center gap-2">
              <Cpu size={16} strokeWidth={1.75} className="text-fg-faint" aria-hidden="true" />
              Browser runs Web Crypto (crypto.getRandomValues)
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={16} strokeWidth={1.75} className="text-fg-faint" aria-hidden="true" />
              Passwords, tokens, and codes are generated here
            </li>
            <li className="flex items-center gap-2">
              <ShieldCheck size={16} strokeWidth={1.75} className="text-fg-faint" aria-hidden="true" />
              Optional history is stored here only, if you turn it on
            </li>
          </ul>
        </div>

        {/* Boundary */}
        <div className="flex flex-col items-center justify-center gap-2 py-2">
          <div className="hidden h-full w-px bg-fg md:block" aria-hidden="true" />
          <div className="h-px w-full bg-fg md:hidden" aria-hidden="true" />
          <span className="whitespace-nowrap rounded-full border border-border-strong bg-surface px-2 py-0.5 text-xs font-medium uppercase tracking-[0.06em] text-fg-muted">
            Boundary
          </span>
        </div>

        {/* The internet */}
        <div className="rounded-lg border border-border bg-surface-sunken p-5">
          <div className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-fg">
            <Globe size={20} strokeWidth={1.75} aria-hidden="true" />
            The internet
          </div>
          <p className="text-sm text-fg-muted">
            No generated secret, and no derivative of one (hash, prefix, or
            length fingerprint), ever crosses this line.
          </p>
        </div>
      </div>

      <figcaption className="rounded-md border border-border bg-surface-sunken px-4 py-3 text-sm text-fg-muted">
        The one line that can cross the boundary is an optional AI question. Its
        request schema has no field that can hold a secret, and the client
        refuses to send anything that looks like generated output. That feature
        is off unless you use it.
      </figcaption>
    </figure>
  );
}
