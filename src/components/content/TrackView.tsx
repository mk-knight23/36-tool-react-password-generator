"use client";

import { useEffect } from "react";
import { track, type AnalyticsEvent, type AnalyticsParams } from "@/lib/analytics";

/**
 * Fires a single analytics event when a content page mounts. `track` is a no-op
 * unless analytics consent is granted in production with a GTM id configured, so
 * this never sends anything by default. Params must stay non-identifying (a
 * slug or feature name only) per STANDARDS §6.
 */
export function TrackView({
  event,
  params,
}: {
  event: AnalyticsEvent;
  params?: AnalyticsParams;
}) {
  useEffect(() => {
    track(event, params);
    // Fire once per mount; params are stable primitives for content pages.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
