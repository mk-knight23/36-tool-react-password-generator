"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useSettings, useHydrated } from "@/lib/client-hooks";
import { saveSettings, type ConsentState } from "@/lib/settings";

const GTM_CONFIGURED = Boolean(process.env.NEXT_PUBLIC_GTM_ID);

/**
 * Consent banner (STANDARDS §6, DESIGN_SYSTEM ConsentBanner). Shown only when
 * a choice has not been made AND analytics could actually run (a GTM id is
 * configured) — there is nothing to consent to otherwise, so we do not nag.
 * Accept and Decline carry equal visual weight; default state is declined.
 */
export function ConsentBanner() {
  const hydrated = useHydrated();
  const settings = useSettings();

  if (!GTM_CONFIGURED) return null;
  if (!hydrated) return null;
  if (settings.analyticsConsent !== "unset") return null;

  const choose = (consent: ConsentState) =>
    saveSettings({ ...settings, analyticsConsent: consent });

  return (
    <div
      role="dialog"
      aria-label="Analytics consent"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface/95 backdrop-blur-[8px] supports-[not(backdrop-filter:blur(8px))]:bg-surface"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm text-fg-muted">
          Analytics are off unless you allow them. They never receive anything you
          generate, only anonymous event names and counts. Read the{" "}
          <Link href="/cookies" className="text-accent hover:text-accent-hover">
            cookies page
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="secondary" size="sm" onClick={() => choose("declined")}>
            Decline
          </Button>
          <Button variant="primary" size="sm" onClick={() => choose("granted")}>
            Allow analytics
          </Button>
        </div>
      </div>
    </div>
  );
}
