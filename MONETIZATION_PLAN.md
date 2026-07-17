# MK VaultPass — Monetization Plan

Current state: **not monetized.** No ads load, there is no paid tier, and no
payment code exists. This document records the prepared-but-disabled advertising
setup and the intended path if that ever changes.

Binding contract: `/Users/mkazi/Tools/_shared/STANDARDS.md` §7.

## 1. Present state

- **AdSense: prepared, disabled.** The gate is `NEXT_PUBLIC_ADSENSE_ENABLED`,
  read in `src/components/content/AdSlot.tsx`. It defaults to off (the flag must
  equal the literal string `"true"` to enable anything). While off, `AdSlot`
  renders `null` and no ad script is loaded.
- **No paid tier.** The whole tool is free and works with no account
  (PRODUCT_SPEC §3, §6). There is no billing, checkout, or entitlement code in
  the repo.
- **No `ads.txt`.** Per STANDARDS §7, `ads.txt` is not added until a real
  publisher ID exists. There is none, so there is no `ads.txt`.

## 2. The reserved slot

`AdSlot` exists so ads could be switched on later without touching page layout:

- It takes a `slot` id and a fixed `height` and reserves that space with fixed
  dimensions, so enabling ads later causes zero cumulative layout shift.
- It is placed only in long-form content: one inline slot inside `ArticleLayout`
  (guides and use-cases). It is not placed on the tool routes (`/generate`,
  `/analyze`, `/policies`), the dashboard, history, settings, or any legal page.
- Even with the flag on, the component today renders a labeled placeholder box
  and still loads no network ad script. Wiring an actual publisher script is a
  separate, deliberate step gated on having a real account.

## 3. Why ads stay off the tool

The product's credibility rests on a visible privacy boundary: nothing you
generate leaves the device, and that is verifiable in the network tab
(PRODUCT_SPEC §7, G3). A third-party ad script on the generator page would put
network requests next to the exact flow where the product promises none. So ads
are structurally confined to editorial content pages, never the tool, and never
the analyzer.

## 4. If monetization is ever enabled

This is a plan, not a commitment. Any of these would be an orchestrator-level
decision, not a squad change:

1. Obtain a real AdSense (or equivalent) publisher account and ID.
2. Add `public/ads.txt` with that publisher ID.
3. Add the ad script through a consent-gated loader, on the same
   default-declined consent model as analytics (STANDARDS §6), and extend the CSP
   in `next.config.ts` to allow only the specific ad origins required, documented
   as an exception.
4. Keep ad slots limited to guides and the docs sidebar; never the tool,
   analyzer, dashboard, history, settings, or print output.
5. Re-run the network-egress checks to confirm the generation flow is still
   request-free with ads enabled elsewhere.

## 5. Honesty constraints

- No revenue is claimed, because there is none.
- No sponsor, partner, affiliate, or "as used by" claim appears anywhere, because
  none is true (STANDARDS §3).
- If a donation or sponsor link is ever added, it will be a plain, labeled link
  (for example GitHub Sponsors), not a fake urgency or scarcity prompt.

## 6. Current placements summary

| Surface | Ad slot? | Notes |
|---|---|---|
| `/`, `/generate`, `/analyze`, `/policies`, `/checklists` | No | Tool surfaces stay ad-free by design |
| `/dashboard`, `/history`, `/settings` | No | Private/local-data surfaces |
| `/guides/*`, `/use-cases/*` | Reserved, disabled | One inline `AdSlot` via `ArticleLayout` |
| Legal pages, `/faq`, `/about`, `/creator`, `/open-source`, `/contact` | No | — |
| Recovery-code print sheet | No | Rendered with no nav, footer, scripts, or ads |
