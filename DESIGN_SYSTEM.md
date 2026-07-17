# MK VaultPass — Design System (v2)

Binding for the build stage. Implement the Tailwind v4 `@theme` block in §11 **verbatim**.
Direction: high-trust, precise, minimal, strong contrast. Vault mechanisms, entropy ring, local-security boundary. Restrained glass. Security information over decoration.

## 1. Provenance

Generated with the `ui-ux-pro-max` skill (query: "security password generator developer tool trust minimal high-contrast") and then adapted:

- **Kept from skill output:** "Trust & Authority" landing pattern; Exaggerated Minimalism style (oversized type, high contrast, negative space); high-contrast navy/trust-blue palette family (`#0F172A` / `#0369A1`); anti-patterns (no excessive decoration, no color-only indicators).
- **Rejected from skill output:** Playfair Display / Source Serif via Google Fonts CDN (violates the no-external-font-CDN CSP rule, and editorial serif contradicts "precise tool"); matrix-green hacker palette (novelty, poor trust signal); "security badges / case studies" conversion props (STANDARDS §3 forbids fake proof — our proof is the boundary diagram and open source).
- **Added:** full light+dark token set with computed WCAG contrast, mono-first secret display, entropy-ring/vault metaphor system, Tailwind v4 mapping.

The five portfolio products must not look alike: VaultPass is the **cold, machined, engineering-precision** one. No purple-blue gradients, glowing blobs, particle fields, emoji icons, or generic AI-dashboard look (STANDARDS §13).

## 2. Color tokens

Semantic tokens only — components never use raw hex. Contrast ratios below were computed with the WCAG 2.x relative-luminance formula; the build stage must re-verify them in an automated unit test (a tiny contrast function over this table).

### 2.1 Light theme (`:root`)

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--bg` | `#F8FAFC` | Page background | — |
| `--surface` | `#FFFFFF` | Cards, panels, inputs | — |
| `--surface-sunken` | `#EEF2F7` | Wells, code blocks, table stripes | — |
| `--fg` | `#0F172A` | Primary text | 17.1:1 on `--bg` |
| `--fg-muted` | `#475569` | Secondary text, captions | 7.0:1 on `--bg` |
| `--fg-faint` | `#64748B` | Placeholders, disabled text (never body copy) | 4.7:1 on `#FFFFFF` |
| `--accent` | `#0369A1` | Links, primary actions, active states | 5.9:1 on `#FFFFFF` |
| `--accent-hover` | `#075985` | Hover/pressed accent | 7.7:1 on `#FFFFFF` |
| `--on-accent` | `#FFFFFF` | Text on accent fills | 5.9:1 on `--accent` |
| `--accent-soft` | `#E0F2FE` | Selected-tab fill, info surfaces (with `--accent` text: 5.5:1) | — |
| `--border` | `#E2E8F0` | Hairlines, dividers (decorative) | — |
| `--border-strong` | `#64748B` | Input borders, control outlines (functional) | 4.7:1 on `#FFFFFF` (≥3:1 UI req.) |
| `--ring` | `#0369A1` | Focus ring | ≥3:1 on both `--bg` and `--surface` |
| `--success` | `#15803D` | Success text/icons | 5.0:1 on `#FFFFFF` |
| `--warning` | `#A16207` | Warning text/icons | 4.9:1 on `#FFFFFF` |
| `--danger` | `#B91C1C` | Danger text/icons | 6.5:1 on `#FFFFFF` |
| `--danger-fill` | `#DC2626` | Destructive button fill (white text: 4.8:1) | — |
| `--scrim` | `rgb(2 6 23 / 0.55)` | Modal overlay | — |

### 2.2 Dark theme (`[data-theme="dark"]`) — designed together with light, not inverted

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--bg` | `#0B1220` | Page background ("vault steel", never pure black) | — |
| `--surface` | `#121A2B` | Cards, panels, inputs | — |
| `--surface-sunken` | `#0E1523` | Wells, code blocks | — |
| `--surface-raised` | `#1A2439` | Popovers, dropdowns (elevation via lightness, §5) | — |
| `--fg` | `#E6EBF2` | Primary text | 15.6:1 on `--bg` |
| `--fg-muted` | `#94A3B8` | Secondary text | 7.3:1 on `--bg`, 6.8:1 on `--surface` |
| `--fg-faint` | `#7C8BA1` | Placeholders, disabled text | ≥4.5:1 on `--surface` |
| `--accent` | `#38BDF8` | Links, active states (text-capable) | 8.7:1 on `--bg` |
| `--accent-fill` | `#0EA5E9` | Primary button fill | — |
| `--on-accent` | `#0B1220` | Text on accent fills | 6.8:1 on `--accent-fill` |
| `--accent-soft` | `#0C2D42` | Selected-tab fill (with `--accent` text) | — |
| `--border` | `#24304A` | Hairlines, dividers | — |
| `--border-strong` | `#64748B` | Input borders | 3.7:1 on `--surface` (≥3:1 UI req.) |
| `--ring` | `#38BDF8` | Focus ring | — |
| `--success` | `#4ADE80` | Success text/icons | 10.7:1 on `--bg` |
| `--warning` | `#FBBF24` | Warning text/icons | 11.2:1 on `--bg` |
| `--danger` | `#F87171` | Danger text/icons | 6.8:1 on `--bg` |
| `--danger-fill` | `#DC2626` | Destructive fill (white text: 4.8:1) | — |
| `--scrim` | `rgb(0 0 0 / 0.6)` | Modal overlay | — |

In light theme, `--accent-fill` = `--accent` and `--surface-raised` = `--surface` (declare both so components are theme-agnostic).

### 2.3 Entropy / strength scale (5 levels — never color-only)

Every strength indication renders **color + text label + bits number + filled-segment count** simultaneously.

| Level | Label | Light | Dark | Threshold (random mode) |
|---|---|---|---|---|
| 0 | Very weak | `#B91C1C` | `#F87171` | < 28 bits or common-list hit |
| 1 | Weak | `#C2410C` | `#FB923C` | 28–49 bits |
| 2 | Fair | `#A16207` | `#FBBF24` | 50–69 bits |
| 3 | Strong | `#15803D` | `#4ADE80` | 70–99 bits |
| 4 | Excellent | `#0369A1` | `#38BDF8` | ≥ 100 bits |

All ten values ≥4.5:1 as text on their theme background (verified; lowest is `#C2410C` at 5.2:1 on white). Level 4 deliberately lands on the trust-blue brand accent: maximum strength = brand color.

## 3. Typography

**No external font CDNs.** System stacks only (zero bytes, zero FOUT, CSP-clean):

- `--font-sans`: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif` — all UI and content.
- `--font-mono`: `ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace` — **every secret, code, entropy number, and tabular figure**. Secrets are never rendered in the sans face.

Type scale (rem; base 16px):

| Token | Size | Line-height | Weight | Tracking | Use |
|---|---|---|---|---|---|
| `text-display` | `clamp(2.5rem, 1.5rem + 4vw, 4.5rem)` | 1.05 | 700 | -0.02em | Landing hero only (Exaggerated Minimalism: the hero is type, not imagery) |
| `text-4xl` | 2.25rem | 1.15 | 700 | -0.015em | h1 |
| `text-3xl` | 1.875rem | 1.2 | 600 | -0.01em | h2 |
| `text-2xl` | 1.5rem | 1.25 | 600 | -0.01em | h3 |
| `text-xl` | 1.25rem | 1.35 | 600 | 0 | h4, card titles |
| `text-lg` | 1.125rem | 1.55 | 400 | 0 | Lead paragraphs |
| `text-base` | 1rem | 1.6 | 400 | 0 | Body (min body size; never smaller for paragraphs) |
| `text-sm` | 0.875rem | 1.5 | 400/500 | 0 | Secondary text, table cells, buttons |
| `text-xs` | 0.75rem | 1.4 | 500 | +0.06em, uppercase | Overline labels, badges only — never sentences |
| `text-secret` | 1.25rem (mono) | 1.4 | 400 | 0 | Generated secret display; scales down to 1rem when length > 48 chars |

Numbers in stats, entropy readouts, countdowns: `font-variant-numeric: tabular-nums` (prevents layout shift during count changes). Guide/doc prose max-width: `72ch`. Secret display allows soft-wrap `break-all` — never truncate a secret with ellipsis.

## 4. Spacing, radii, layout

- **Spacing:** 4px base scale (Tailwind default `--spacing: 0.25rem`). Vertical rhythm tiers: 16 (intra-component) / 24 (between controls) / 48 (between sections) / 96px (landing sections).
- **Radii:** `--radius-xs: 2px` (checkboxes), `--radius-sm: 4px` (badges, code chips), `--radius-md: 6px` (buttons, inputs — the default; small radii read as machined precision), `--radius-lg: 10px` (cards), `--radius-xl: 14px` (modals, hero panels), `--radius-full: 9999px` (pills, ring track). No radius > 14px anywhere except pills.
- **Containers:** content `max-w-6xl` (72rem); prose `max-w-[72ch]`; workspace `/generate` uses `max-w-4xl` centered (tool focus, no dashboard sprawl).
- **Breakpoints:** Tailwind defaults (640/768/1024/1280). Mobile-first. No horizontal scroll at 375px; recovery-code sheet and tables scroll inside their own `overflow-x-auto` container.
- **Z-index scale:** 0 (content) / 10 (sticky nav) / 20 (dropdown) / 30 (toast) / 40 (modal scrim) / 50 (modal).

## 5. Elevation & glass rules

Light theme shadows (functional, subtle — this is a flat, precise system):

- `--shadow-1: 0 1px 2px rgb(15 23 42 / 0.06), 0 1px 3px rgb(15 23 42 / 0.08)` — cards.
- `--shadow-2: 0 4px 12px rgb(15 23 42 / 0.10), 0 2px 4px rgb(15 23 42 / 0.06)` — dropdowns, popovers.
- `--shadow-3: 0 16px 40px rgb(15 23 42 / 0.18)` — modals only.

Dark theme: shadows are nearly invisible on `#0B1220` — elevation is expressed by **surface lightness step + hairline border** (`--surface` → `--surface-raised` + `--border`). Keep `--shadow-3` for modals (still perceptible against scrim).

**Glass (restrained — exactly three sanctioned uses):**
1. Sticky top nav: `backdrop-filter: blur(8px)`, background `--bg` at 85% opacity, bottom hairline.
2. Modal scrim: `--scrim` color; optional `blur(4px)`.
3. Command palette (if built): same recipe as nav.

Glass is **forbidden** on cards, buttons, inputs, badges, and any surface carrying body text. Every glass surface needs an `@supports not (backdrop-filter: blur(8px))` fallback to ≥97% opaque background. Text on glass must still meet 4.5:1 against the worst-case underlying content (the 85% tint guarantees this against both themes' backgrounds).

## 6. Motion

Tokens:

- `--duration-fast: 120ms` (hover, press, toggle), `--duration-base: 180ms` (dropdowns, tabs, toasts), `--duration-slow: 240ms` (modals, page-level), `--duration-ring: 400ms` (entropy ring sweep — the one sanctioned "slow" moment).
- `--ease-enter: cubic-bezier(0.2, 0, 0, 1)` (decelerate); `--ease-exit: cubic-bezier(0.4, 0, 1, 1)` (accelerate). Exits run at ~70% of enter duration.

Rules: animate `transform`/`opacity` only — never width/height/top/left (no CLS). Max 1–2 animated elements per view. Signature micro-interactions:

- **Generate press:** button `scale(0.98)` on `:active`, 120ms; on completion the entropy ring sweeps to its new value (400ms, ease-enter) while the bits number counts up (300ms, tabular-nums so nothing shifts).
- **Copy:** icon swaps to check (crossfade 120ms), toast slides up 8px + fade (180ms in / 120ms out).
- **Secret reveal:** instant (no blur-to-sharp gimmick — masked ↔ shown is a discrete security state, not a transition).

`prefers-reduced-motion: reduce` (mandatory, tested): ring renders instantly at final value (no sweep), no count-up, no scale press (use opacity 0.85 press feedback), all remaining transitions become opacity-only ≤80ms, toast appears/disappears without slide. Implement once via a global `@media` block that zeroes the duration tokens — components inherit compliance.

## 7. Iconography

`lucide-react` only. Stroke 1.75px consistently. Size tokens: 16 (inline/buttons), 20 (nav, inputs), 24 (feature cards). Icon-only buttons always have `aria-label` + tooltip. No emoji as icons anywhere, including docs and guides. Brand-adjacent icons: `shield-check`, `lock-keyhole`, `key-round`, `dice-5` (entropy), `monitor-off`/`wifi-off` (local-only), `printer`, `history`, `trash-2`.

## 8. Product-specific visual metaphors

1. **Entropy ring** — the product's signature. A circular SVG gauge around/beside the secret output: track in `--border`, arc in the current strength color, machined tick marks every 10 bits (like a vault dial), center shows `NN bits` (mono, tabular) + label. The arc length maps to bits (capped at 128 for the full circle). Never color-only: label + number always visible. Reduced motion: no sweep.
2. **Local-security boundary diagram** — a two-zone diagram (landing + `/docs`): left zone "Your device" (contains browser, Web Crypto, generator, history-when-enabled), right zone "The internet", separated by a bold `--fg` boundary line. Arrows that stay inside the left zone: secret generation. The only crossing arrow (dashed, labeled): "optional AI questions — schema rejects secrets". Built as inline SVG with theme tokens; every element labeled with real text (it is documentation, not decoration).
3. **Vault-dial generate control** — the primary Generate button reads as a machined control: solid accent fill, 6px radius, mono keyboard-hint chip (`⌘↵`), press = tumbler `scale(0.98)`.
4. **LOCAL-ONLY badge** — a stamp-like pill (uppercase `text-xs`, 1.5px border in `--success`, `shield-check` 16px) appearing beside every generator title. Clicking it opens the boundary diagram. Same component everywhere (3.2.6 consistency).
5. **Auto-clear countdown pill** — after copy: mono countdown `0:30` in a pill that drains a 2px underline progress bar (width via `transform: scaleX` — no layout shift). Honest microcopy: "best effort — see limits".

## 9. Component inventory & interaction states

Global state rules: every interactive element has visible **hover** (surface/border shift), **focus-visible** (2px `--ring` outline, 2px offset — never removed, never obscured by sticky nav: content uses `scroll-margin-top`), **active/pressed** (scale or tone shift), **disabled** (`opacity: 0.5`, `cursor: not-allowed`, `aria-disabled`/`disabled`, no hover response). Async controls get a **loading** state (spinner replaces label, width preserved, `aria-busy`). Min interactive target: 40×40px (44px on touch; exceeds WCAG 2.2 §2.5.8's 24px minimum).

| Component | Variants | States beyond global | Notes |
|---|---|---|---|
| Button | primary (accent-fill), secondary (surface + border-strong), ghost, danger (danger-fill) | loading | One primary per view. `cursor-pointer`. |
| IconButton | ghost, subtle | — | `aria-label` mandatory, tooltip on hover/focus |
| SecretOutput | single, list-item (bulk) | masked / revealed / copied / regenerating (brief opacity pulse unless reduced-motion) | Mono, `break-all`, reveal toggle (`eye`/`eye-off`, pressed state via `aria-pressed`), copy button, per-secret `aria-live="polite"` announcement "New password generated, 96 bits" |
| EntropyRing | sm (inline 48px), lg (workspace 96px) | animating / static / reduced-motion | SVG `role="img"` + `aria-label="Strength: Strong, 82 bits"` |
| StrengthBar | 5-segment linear (analyzer, mobile) | — | Same scale as ring; label + bits always adjacent |
| Slider (length, count) | — | dragging | Always paired with a numeric input (WCAG 2.2 §2.5.7 dragging alternative + keyboard arrows/Home/End); value bubble uses tabular-nums |
| Checkbox / Switch | — | indeterminate (checkbox only) | Switch for history opt-in with explicit on/off text label, not color alone |
| SegmentedControl (mode tabs) | scrollable on mobile | selected (`--accent-soft` fill + `--accent` text + 2px bottom indicator) | `role="tablist"`, roving tabindex, arrow-key nav; drives `?mode=` param |
| Input / Textarea | default, with-addon (prefix for token mode) | error (border + `--danger` text below + `role="alert"`), success | Visible `<label>` always; helper text persistent, not placeholder-only |
| Select | native `<select>` styled | — | Native for a11y; custom listbox only if genuinely needed |
| Card | default, interactive (link cards for guides) | interactive: hover raises to `--shadow-2`/`--surface-raised` | Radius-lg, 24px padding |
| Badge | neutral, success (LOCAL-ONLY), warning, danger | — | Uppercase text-xs, never sole info carrier |
| Tooltip | — | — | 180ms delay, keyboard-triggerable on focus, `role="tooltip"`; never contains essential-only info |
| Toast | success, error, info | auto-dismiss 4s (pauses on hover/focus) | `aria-live="polite"`; errors `role="alert"` and persist until dismissed; never steals focus; stacked max 3 |
| Modal / Dialog | confirm (wipe history), form (policy editor), info (boundary diagram) | — | Focus trap, `Esc` closes, restores focus to trigger, initial focus on least-destructive action; destructive confirms require explicit button text ("Wipe 14 entries") |
| Banner | info (AI unavailable), warning (history enabled on this device) | dismissible | Honest degradation copy per STANDARDS §10 |
| Table | recovery codes, policy rules, history | row hover, sortable headers (`aria-sort`) | Mono for code columns; wraps in `overflow-x-auto` |
| CodeBlock | inline chip, block | copied | `--surface-sunken`, mono, copy button |
| Navbar | desktop (horizontal), mobile (disclosure menu) | current page (`aria-current="page"` + accent underline) | Glass recipe §5; nav placement identical on all pages |
| Footer | — | — | Exact creator sentence + links (STANDARDS §3); consistent help placement (WCAG 2.2 §3.2.6) |
| DocsSidebar | desktop sticky, mobile accordion | active section | — |
| Accordion (FAQ) | — | expanded (`aria-expanded`, chevron rotate 180ms) | Content indexed/SEO-visible (server-rendered open in HTML) |
| ConsentBanner | — | — | Default declined; equal visual weight Accept/Decline; no dark patterns; link to `/cookies` |
| ThemeToggle | light/dark/system tri-state | — | Persisted in localStorage; no-flash inline script sets `data-theme` pre-hydration |
| Skeleton | text, card | — | Only for genuinely async content (guides index); generators are instant and never skeleton |
| EmptyState | dashboard, history | — | Icon + one honest sentence + primary action; no fake sample data |
| ChecklistItem | `/checklists` | checked (persisted locally) | Large 24px checkbox, strike-through + `--fg-muted` |
| PrintSheet (recovery codes) | — | — | Print stylesheet: black on white, mono, no nav/footer/toasts, checkbox squares, date line, optional product-name suppression |

## 10. Accessibility constraints (WCAG 2.2 AA — binding)

1. Contrast: text ≥4.5:1 (≥3:1 for ≥24px/19px-bold), functional UI parts and focus indicators ≥3:1 — both themes independently (tokens in §2 already comply; CI re-verifies).
2. Focus visible on everything (2.4.7); focus never hidden under the sticky nav (2.4.11 Focus Not Obscured) — global `scroll-margin-top: 72px` on focusables/anchors.
3. Target size ≥24×24 CSS px (2.5.8) — we standardize 40px minimum.
4. Dragging alternative (2.5.7): every slider has a synced numeric input.
5. Consistent help (3.2.6): footer contact/help links identical position on all pages.
6. Redundant entry (3.3.7): policy validator and settings never ask users to re-enter values the app already has locally.
7. Full keyboard support: documented shortcuts (⌘/Ctrl+Enter generate, ⌘/Ctrl+C copies focused secret, `.` regenerate), no traps, shortcuts disabled while typing in inputs (port legacy `useKeyboard` guard); single-key shortcuts remappable/disableable in Settings (2.1.4).
8. Screen readers: generation results announced via `aria-live="polite"`; strength changes announced with label + bits; masked secrets expose state ("hidden") not the value; decorative SVG `aria-hidden`, meaningful SVG labeled.
9. `prefers-reduced-motion` per §6. `prefers-contrast: more` bumps `--border` → `--border-strong`.
10. Zoom to 200% without loss of content/function; body text never below 1rem; no `maximum-scale` in viewport meta.
11. Never color-only meaning (strength, validation, diff states all carry text/icon).
12. Forms: visible labels, persistent helper text, errors adjacent + `role="alert"`, focus moves to first invalid field on submit.

## 11. Tailwind v4 `@theme` mapping (implement verbatim in `src/app/globals.css`)

```css
@import "tailwindcss";

/* Dark mode = data-theme attribute (set pre-hydration; defaults to system) */
@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));

:root {
  --bg: #F8FAFC;
  --surface: #FFFFFF;
  --surface-sunken: #EEF2F7;
  --surface-raised: #FFFFFF;
  --fg: #0F172A;
  --fg-muted: #475569;
  --fg-faint: #64748B;
  --accent: #0369A1;
  --accent-hover: #075985;
  --accent-fill: #0369A1;
  --on-accent: #FFFFFF;
  --accent-soft: #E0F2FE;
  --border: #E2E8F0;
  --border-strong: #64748B;
  --ring-c: #0369A1;
  --success: #15803D;
  --warning: #A16207;
  --danger: #B91C1C;
  --danger-fill: #DC2626;
  --on-danger: #FFFFFF;
  --scrim: rgb(2 6 23 / 0.55);
  --strength-0: #B91C1C;
  --strength-1: #C2410C;
  --strength-2: #A16207;
  --strength-3: #15803D;
  --strength-4: #0369A1;
}

[data-theme="dark"] {
  --bg: #0B1220;
  --surface: #121A2B;
  --surface-sunken: #0E1523;
  --surface-raised: #1A2439;
  --fg: #E6EBF2;
  --fg-muted: #94A3B8;
  --fg-faint: #7C8BA1;
  --accent: #38BDF8;
  --accent-hover: #7DD3FC;
  --accent-fill: #0EA5E9;
  --on-accent: #0B1220;
  --accent-soft: #0C2D42;
  --border: #24304A;
  --border-strong: #64748B;
  --ring-c: #38BDF8;
  --success: #4ADE80;
  --warning: #FBBF24;
  --danger: #F87171;
  --danger-fill: #DC2626;
  --on-danger: #FFFFFF;
  --scrim: rgb(0 0 0 / 0.6);
  --strength-0: #F87171;
  --strength-1: #FB923C;
  --strength-2: #FBBF24;
  --strength-3: #4ADE80;
  --strength-4: #38BDF8;
}

@theme inline {
  /* Colors — usable as bg-bg, text-fg, border-border-strong, text-strength-3, etc. */
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-surface-sunken: var(--surface-sunken);
  --color-surface-raised: var(--surface-raised);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-fg-faint: var(--fg-faint);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-accent-fill: var(--accent-fill);
  --color-on-accent: var(--on-accent);
  --color-accent-soft: var(--accent-soft);
  --color-border: var(--border);
  --color-border-strong: var(--border-strong);
  --color-ring: var(--ring-c);
  --color-success: var(--success);
  --color-warning: var(--warning);
  --color-danger: var(--danger);
  --color-danger-fill: var(--danger-fill);
  --color-on-danger: var(--on-danger);
  --color-scrim: var(--scrim);
  --color-strength-0: var(--strength-0);
  --color-strength-1: var(--strength-1);
  --color-strength-2: var(--strength-2);
  --color-strength-3: var(--strength-3);
  --color-strength-4: var(--strength-4);

  /* Typography — system stacks only (CSP: no external font origins) */
  --font-sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
  --font-mono: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas,
    "Liberation Mono", monospace;

  /* Radii */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 14px;

  /* Elevation */
  --shadow-1: 0 1px 2px rgb(15 23 42 / 0.06), 0 1px 3px rgb(15 23 42 / 0.08);
  --shadow-2: 0 4px 12px rgb(15 23 42 / 0.10), 0 2px 4px rgb(15 23 42 / 0.06);
  --shadow-3: 0 16px 40px rgb(15 23 42 / 0.18);

  /* Motion */
  --duration-fast: 120ms;
  --duration-base: 180ms;
  --duration-slow: 240ms;
  --duration-ring: 400ms;
  --ease-enter: cubic-bezier(0.2, 0, 0, 1);
  --ease-exit: cubic-bezier(0.4, 0, 1, 1);
}

/* Reduced motion: components inherit compliance from zeroed tokens */
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-fast: 1ms;
    --duration-base: 1ms;
    --duration-slow: 1ms;
    --duration-ring: 1ms;
  }
  html {
    scroll-behavior: auto;
  }
}

/* Base */
html {
  scroll-behavior: smooth;
}
body {
  background: var(--bg);
  color: var(--fg);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
:focus-visible {
  outline: 2px solid var(--ring-c);
  outline-offset: 2px;
}
[id] {
  scroll-margin-top: 72px; /* WCAG 2.2 Focus Not Obscured under sticky nav */
}
::selection {
  background: var(--accent-soft);
  color: var(--fg);
}
```

Notes for the build stage:

- Theme switching: inline no-flash script in `layout.tsx` `<head>` reads localStorage (`vaultpass:theme` = `light | dark | system`) and sets `data-theme` on `<html>` before paint; system value tracks `prefers-color-scheme` via listener.
- Use only token utilities (`bg-surface`, `text-fg-muted`, `border-border-strong`, `text-strength-2`, `shadow-2`, `rounded-md`, `duration-base`, `ease-enter`) — a grep for raw hex in `src/components` should return nothing.
- The entropy ring's SVG uses `var(--strength-N)` directly (not Tailwind classes) since the level is computed at runtime.
- Print stylesheet for recovery sheets lives beside globals (`@media print`): force black-on-white, hide nav/footer/toasts, mono codes.

## 12. Voice in UI copy

Per STANDARDS §9: concrete, plain, honest. Say "Generated on your device. Never sent anywhere." — not "military-grade encryption". State limits where they exist (clipboard auto-clear is best effort; entropy for pronounceable mode is an estimate). No exclamation-point enthusiasm. The tool explains; it doesn't sell.
