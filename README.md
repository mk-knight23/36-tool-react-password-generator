# VaultPass - Professional Password Generator

A high-security, professional-grade password generation utility built with **Vue 3**, **TypeScript**, and **Tailwind CSS**. Designed for technical users who prioritize entropy and cryptographically secure randomness.

## Overview
VaultPass replaces standard pseudo-random generators with a robust implementation leveraging the `window.crypto` API. It features a sophisticated UI focused on security auditing, entropy visualization, and persistent user preferences.

## Features Comparison

| Feature | Legacy (React) | VaultPass (v2.0) |
| :--- | :--- | :--- |
| **Randomness** | `Math.random()` | **`window.crypto.getRandomValues()`** |
| **Analysis** | None | **Real-time Bits of Entropy Calculation** |
| **UI Aesthetic** | Basic Web | **Premium "Vault" Dark System** |
| **Persistence** | None | **Pinia + LocalStorage state recovery** |
| **Audit Log** | None | **Secure session history (masked values)** |
| **Tech Stack** | React (JS) | **Vue 3 + Composition API + TS + Vite** |

## Tech Stack
- **Framework:** Vue 3.5+
- **Build Tool:** Vite 6
- **State:** Pinia (with persistence)
- **Icons:** Lucide Vue
- **Animations:** Motion One for Vue
- **Utilities:** @vueuse/core

## Setup & Build Instructions

### Prerequisites
- Node.js 20.x or higher
- npm 10.x or higher

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## Deployment
Optimized for deployment on Vercel, Netlify, or GitHub Pages.

---

**Security Note:** All generation logic is client-side. No sensitive data is transmitted or stored on any server.
**License:** MIT
**Architect:** mk-knight23
