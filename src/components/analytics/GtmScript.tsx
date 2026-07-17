"use client";

import Script from "next/script";
import { useSettings, useHydrated } from "@/lib/client-hooks";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

/**
 * Loads Google Tag Manager, and only then (STANDARDS §6): in production, with a
 * GTM id configured, after the user has granted consent. With any of those
 * missing, nothing is injected and no analytics network request is made. The
 * `track` util in lib/analytics.ts is the matching no-op guard for events.
 */
export function GtmScript() {
  const hydrated = useHydrated();
  const settings = useSettings();

  if (process.env.NODE_ENV !== "production") return null;
  if (!GTM_ID) return null;
  if (!hydrated) return null;
  if (settings.analyticsConsent !== "granted") return null;

  return (
    <Script id="gtm-loader" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}
