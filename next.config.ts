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
 * When GTM/analytics lands (consent-gated), its origins get appended to
 * script-src/connect-src/img-src at that stage.
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline'",
  "connect-src 'self'",
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
