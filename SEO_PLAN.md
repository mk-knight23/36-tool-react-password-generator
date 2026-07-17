# MK VaultPass — SEO Plan

This documents the search and discovery setup that ships in the repo today. It
is a record of what is implemented, not a wish list. Every mechanism named here
can be checked in the source files referenced.

Binding contract: `/Users/mkazi/Tools/_shared/STANDARDS.md` §5. Domain:
`https://vaultpass.mkazi.live`.

## 1. Canonical origin

Every URL in the site derives from one value: `NEXT_PUBLIC_SITE_URL`, read in
`src/lib/site.ts` and defaulting to `https://vaultpass.mkazi.live`. Changing the
env var re-points canonicals, OpenGraph URLs, the sitemap, and `robots.txt` in
one move, so a preview deploy on `*.vercel.app` never leaks the production
domain into its own metadata.

- `metadataBase` is set once in `src/app/layout.tsx` from `SITE.url`.
- `src/lib/seo.ts` `pageMetadata()` sets `alternates.canonical` to the page path,
  which Next resolves against `metadataBase` into an absolute canonical.
- `absoluteUrl()` builds absolute links for the sitemap, robots, and JSON-LD.

## 2. Per-page metadata

Each route exports `metadata` (or `generateMetadata` for dynamic routes) built
through `pageMetadata()`. That helper guarantees, for every page:

- a unique `title` and `description`;
- a canonical URL;
- OpenGraph fields (`type`, `siteName`, `title`, `description`, `url`);
- Twitter `summary_large_image` fields.

Dynamic routes (`/guides/[slug]`, `/use-cases/[slug]`) generate their metadata
from the content document, so a new guide gets correct SEO with no extra wiring.
The `type` is set to `article` for guides and use-cases, `website` elsewhere.

Coverage was verified: every `page.tsx` in `src/app` exports metadata.

## 3. Sitemap and robots

- `src/app/sitemap.ts` emits `/sitemap.xml`. It lists all indexable routes with
  coarse `changeFrequency` and `priority`, and derives each guide/use-case
  `lastModified` from the article's own `dateModified`/`datePublished` so updated
  content re-surfaces to crawlers. Guides and use-cases are enumerated from their
  registries (`src/content/guides`, `src/content/use-cases`), so the sitemap can
  never drift from the pages that actually exist.
- `src/app/robots.ts` emits `/robots.txt`. Everything is allowed except `/api/`
  (no crawlable content there), and it points crawlers at the sitemap on the same
  canonical origin.

## 4. Static discovery files

- `public/llms.txt` — a plain-language summary for model-based crawlers. It
  states what the tool is, what it is not (not a password manager), the key
  pages, and explicit instructions for summarizers not to invent testimonials or
  usage counts.
- `public/humans.txt` — author and stack credits.
- `public/.well-known/security.txt` — disclosure contact, expiry, and policy
  link (RFC 9116 fields).

## 5. Structured data (JSON-LD)

All builders live in `src/lib/jsonld.ts` as pure functions and render through the
`<JsonLd>` component. Applied as follows:

| Schema type | Where | Source |
|---|---|---|
| `WebApplication` | `/` | `webApplicationJsonLd()` |
| `FAQPage` | `/faq` | `faqPageJsonLd()` over the FAQ entries |
| `Person` | `/creator` | `personJsonLd()` |
| `Article` | every guide and use-case | `articleJsonLd()` in `ArticleLayout` |
| `HowTo` | guides/use-cases that define `howTo` steps | `howToJsonLd()` in `ArticleLayout` |
| `BreadcrumbList` | every page with a breadcrumb trail | `breadcrumbJsonLd()` in `Breadcrumbs` |

The `WebApplication` entry declares `isAccessibleForFree`, a zero-price `Offer`,
and `applicationCategory: SecurityApplication`. No rating, review count, or other
aggregate is claimed, because none exists (STANDARDS §3).

## 6. Social preview image

`src/app/opengraph-image.tsx` renders a 1200x630 PNG at build time via `next/og`.
It uses no external font or service (CSP-clean) and Next applies it to every
route automatically, so individual pages do not set their own `images`. The card
carries the product name, the one-line positioning, and the "not a password
manager" line, matching the on-site copy.

## 7. Content and internal linking

The content set that ships:

- **8 guides** (`src/content/guides`, 900-1090 words each, all original to this
  product): passphrase-vs-password, entropy-explained, browser-crypto-explained,
  common-password-lists, password-policies-that-work, api-token-formats,
  wifi-password-guide, recovery-codes-done-right.
- **5 use-cases** (`src/content/use-cases`): developer-api-tokens,
  env-secrets-hygiene, team-wifi-rotation, recovery-code-sheets,
  family-passphrases.
- **FAQ** with 14 honest question/answer pairs, including "Is this a password
  manager?" (no) and "Can you see my passwords?" (no, and how to verify).

Each guide and use-case carries a "Keep reading" block of related links, and the
guides/use-cases index pages cross-link into the tool routes (`/generate`,
`/analyze`, `/policies`). The tool pages link back out to the relevant guide.
This tool ↔ guide ↔ use-case triangle is the internal-linking spine
(STANDARDS §5).

### Topic-to-page map

| Search intent | Target page |
|---|---|
| how strong should a password be / entropy | `/guides/entropy-explained` |
| passphrase vs password | `/guides/passphrase-vs-password` |
| are browser password generators safe | `/guides/browser-crypto-explained` |
| is my password on a common list | `/guides/common-password-lists`, `/analyze` |
| password policy for a team | `/guides/password-policies-that-work`, `/policies` |
| api token / secret format | `/guides/api-token-formats`, `/generate?mode=token` |
| strong wifi password | `/guides/wifi-password-guide`, `/generate?mode=wifi` |
| 2fa recovery codes | `/guides/recovery-codes-done-right`, `/generate?mode=recovery` |

## 8. Technical SEO baseline

- Semantic HTML with one `h1` per page via `PageHeader`; guides use a real
  heading hierarchy inside `Prose`.
- FAQ accordion content is server-rendered visible in HTML (not hidden behind a
  client toggle), so crawlers and the `FAQPage` schema agree.
- Descriptive, hyphenated slugs.
- No external font, script, or image origins, which keeps pages fast and CSP
  strict (headers in `next.config.ts`).
- Guides and use-cases are statically generated (`generateStaticParams`), so they
  are served as static HTML.

## 9. What is deliberately not done

- No `hreflang` / i18n: the product is English-only in v1.
- No AMP.
- No submission to search consoles or backlink work: that is orchestrator-owned
  post-deploy, not a squad task.
- No fabricated `AggregateRating`, `review`, or usage numbers anywhere.
