"use client";

import { Button } from "@/components/ui/Button";
import { useSettings, useHydrated } from "@/lib/client-hooks";
import { saveSettings, type ConsentState } from "@/lib/settings";
import { track } from "@/lib/analytics";

function label(state: ConsentState): string {
  if (state === "granted") return "Allowed";
  if (state === "declined") return "Declined";
  return "Not set (treated as declined)";
}

/**
 * Current analytics choice plus Allow/Decline buttons, for the cookies page.
 * Writes the choice to local settings; `track` stays a no-op until consent is
 * granted in production with an analytics id configured (STANDARDS §6).
 */
export function ConsentControls() {
  const hydrated = useHydrated();
  const settings = useSettings();

  const setConsent = (consent: ConsentState) => {
    saveSettings({ ...settings, analyticsConsent: consent });
    track("settings_changed", { keys: "analyticsConsent" });
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-surface p-4">
      <span className="text-sm text-fg-muted">
        Current choice:{" "}
        <span className="font-medium text-fg">
          {hydrated ? label(settings.analyticsConsent) : "…"}
        </span>
      </span>
      <div className="flex gap-2">
        <Button
          variant={settings.analyticsConsent === "granted" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setConsent("granted")}
          disabled={!hydrated}
        >
          Allow analytics
        </Button>
        <Button
          variant={settings.analyticsConsent === "declined" ? "primary" : "secondary"}
          size="sm"
          onClick={() => setConsent("declined")}
          disabled={!hydrated}
        >
          Decline
        </Button>
      </div>
    </div>
  );
}
