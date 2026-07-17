import type { NextConfig } from "next";

/**
 * Content Security Policy for MK VaultPass.
 *
 * The product's core guarantee is zero network egress of secret material, so
 * `connect-src 'self'` is the load-bearing directive: the browser can only talk
 * back to this origin (the same-origin AI route validates input and, by schema,
 * can never receive secret material). No external script, font, style, or image
 * origins are used.
 *
 * Documented exceptions (STANDARDS §8):
 * - `script-src 'unsafe-inline'`: Next.js injects an inline bootstrap script and
 *   we run a tiny inline no-flash theme script in <head>. We do NOT allow
 *   'unsafe-eval' in the production runtime (`next start`).
 * - `style-src 'unsafe-inline'`: Tailwind v4 + Next inject inline styles.
 *
 * Analytics origins (GTM/GA) are appended to script-src/connect-src/img-src
 * ONLY when `NEXT_PUBLIC_GTM_ID` is configured at build time. In the default
 * build (no id) the policy stays `connect-src 'self'`, preserving the strict
 * zero-egress guarantee. Even when configured, the GTM script itself loads only
 * after the visitor grants consent (see GtmScript.tsx); the CSP merely permits
 * it. No generated secret is ever sent to these origins (STANDARDS §6/§8).
 */
const GTM_ENABLED = Boolean(process.env.NEXT_PUBLIC_GTM_ID);
const GTM_ORIGINS = "https://www.googletagmanager.com";
const GA_ORIGINS =
  "https://www.google-analytics.com https://*.google-analytics.com https://*.analytics.google.com";

const scriptSrc = ["'self'", "'unsafe-inline'", GTM_ENABLED ? GTM_ORIGINS : ""]
  .filter(Boolean)
  .join(" ");
const connectSrc = ["'self'", GTM_ENABLED ? `${GTM_ORIGINS} ${GA_ORIGINS}` : ""]
  .filter(Boolean)
  .join(" ");
const imgSrc = ["'self'", "data:", GTM_ENABLED ? `${GTM_ORIGINS} ${GA_ORIGINS}` : ""]
  .filter(Boolean)
  .join(" ");

const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  `img-src ${imgSrc}`,
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  `script-src ${scriptSrc}`,
  `connect-src ${connectSrc}`,
  "manifest-src 'self'",
  "worker-src 'self' blob:",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
