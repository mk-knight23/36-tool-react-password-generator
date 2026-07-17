/**
 * Typed analytics facade (STANDARDS §6). GTM is consent-gated and disabled by
 * default: with no `NEXT_PUBLIC_GTM_ID`, outside production, or without granted
 * consent, `track` is a no-op. Event params are limited to counts, bucketed
 * sizes, durations, and feature names — NEVER any generated secret, its length
 * tied to output, or its charset (STANDARDS §6 / PRODUCT_SPEC §7).
 */
import { loadSettings } from "@/lib/settings";

export type AnalyticsEvent =
  | "tool_opened"
  | "tool_started"
  | "tool_completed"
  | "tool_failed"
  | "file_selected"
  | "file_processed"
  | "ai_started"
  | "ai_completed"
  | "ai_failed"
  | "result_exported"
  | "result_copied"
  | "result_shared"
  | "history_opened"
  | "settings_changed"
  | "feedback_submitted"
  | "guide_opened"
  | "quota_reached";

type ParamValue = string | number | boolean;
export type AnalyticsParams = Record<string, ParamValue>;

interface DataLayerWindow extends Window {
  dataLayer?: Array<Record<string, unknown>>;
}

function analyticsEnabled(): boolean {
  if (typeof window === "undefined") return false;
  if (process.env.NODE_ENV !== "production") return false;
  if (!process.env.NEXT_PUBLIC_GTM_ID) return false;
  return loadSettings().analyticsConsent === "granted";
}

export function track(event: AnalyticsEvent, params: AnalyticsParams = {}): void {
  if (!analyticsEnabled()) return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...params });
}
