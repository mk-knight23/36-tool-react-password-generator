# Transformation Audit: MK VaultPass

## Current Architecture
* **Framework**: Next.js 16 (App Router), React 19, Tailwind CSS v4, Lucide Icons.
* **Storage**: Local preferences in localStorage (e.g. history toggles). Plaintext history persisted locally in IndexedDB (opt-in, off by default).
* **Security & Crypto**: Standard Web Crypto API (`crypto.getRandomValues` and rejection sampling) for all generation tasks.
* **Analysis**: Client-side password analysis (pattern checks, entropy bits, HIBPSHA-1 client lookup).

## Existing Working Features
* Password generators: Password (character options), Passphrase (EFF wordlist), Pronounceable, PIN, UUID, String, Token, Wi-Fi key, and Recovery Codes sheet.
* Interactive visual strength gauges: `EntropyRing` and `StrengthBar` with plain labels.
* Keyboard shortcuts (Cmd+Enter to regenerate; `.` to copy/generate).
* Spaced printable sheet layout for recovery codes.
* Opt-in local history tracking with mask/unmask controls, clear library function, and filter options.

## Current User Journey
1. User lands on `/` and reads explanation.
2. User clicks "Open the generator" primary CTA to navigate to `/generate`.
3. User picks a mode using the SegmentedControl header tabs.
4. User selects character sets, length, and options, then clicks "Generate".
5. User copies the generated value and reviews the entropy visual ring.

## Friction Points
1. **Tool Redundancy**: Users land on the homepage and have to click through to `/generate` just to get a simple password.
2. **Dashboard Clutter**: Displays all nine generators (PIN, UUID, Token, etc.) and bulk options simultaneously. This overwhelms someone who just wants to create a secure password quickly.
3. **Empty Initial State**: The tool initially mounts in a blank state, forcing the visitor to select options and click "Generate" before seeing any result.

## Features to Preserve
* All offline generator algorithms (Web Crypto rejection sampling).
* Spaced printable recovery sheets layout.
* Local opt-in history logs and storage.
* HIBP local checker logic and password analyzer.

## Features to Simplify (Basic Mode)
* Auto-generate a strong password immediately on load (no empty state).
* Show only the generated password, copy/regenerate button, length slider, and simple strength label by default.
* Collapse all secondary generators (PIN, UUID, Wifi, token, etc.) under "Advanced Generator Options".
* Embed this workspace directly into the homepage (`src/app/page.tsx`).

## Proposed Implementation Order
1. **Auditing**: Baseline state checked.
2. **Navigation Split**: Edit `src/lib/nav.ts` to separate primary and secondary groups.
3. **Collapsible Generator Options**: Hide secondary tabs, bulk settings, and option panels in `Workspace.tsx` behind a toggle.
4. **Homepage Embedding**: Update `/` to render the workspace component inside a Suspense container.
5. **QA & Testing**: Execute typechecks, builds, and tests.
