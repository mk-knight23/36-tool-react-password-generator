# VaultPass — Secure Password Generator

A cryptographically secure, retro-themed password and passphrase generator built with Vue 3.

![VaultPass Banner](https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=1200&q=80)

## 🛡️ Security First

- **Zero-Trust Generation**: Uses `window.crypto.getRandomValues()` for all entropy.
- **Client-Side Only**: No data is ever transmitted or stored.
- **Open Source**: Auditable code for maximum transparency.

## 🚀 Features

- **Multiple Modes**: Generate standard passwords, XKCD-style passphrases, or pronounceable strings.
- **Retro Aesthetic**: High-contrast, pixel-perfect UI inspired by 80s terminal systems.
- **Accessibility**: Optimized for keyboard navigation and screen readers.
- **Resilient**: Global error handling and input validation for all generation parameters.
- **Performance**: Lightweight Vue 3 implementation with Pinia state management.

## 🛠️ Tech Stack

- **Framework**: Vue 3 (Composition API).
- **State**: Pinia.
- **Styling**: Tailwind CSS v3 (Custom Retro Theme).
- **Icons**: Lucide Vue Next.
- **Build**: Vite + TypeScript.

## 📦 Setup & Installation

```bash
git clone <repo-url>
cd 36-tool-vaultpass-secure-password-generator
npm install
npm run dev
```

## 📐 Architecture

- **Composables**: Modular generation logic separated by mode (`useGenerator`, `usePassphrase`, `usePronounceable`).
- **Stores**: Global settings (Dark Mode, Audio) and usage statistics.
- **Components**: Reusable UI primitives designed for a consistent retro feel.

## 🚀 Deployment

### Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/mk-knight23/36-tool-vaultpass-secure-password-generator)

1. Push to GitHub
2. Import to Vercel
3. Deploy

### Netlify

[![Netlify Deploy](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/mk-knight23/36-tool-vaultpass-secure-password-generator)

1. Push to GitHub
2. Import to Netlify
3. Deploy

### Local Build

```bash
npm run build
npm run preview
```

## 📁 Environment Variables

Create a `.env` file:

```env
VITE_ANALYTICS_ENABLED=false
VITE_EXPERIMENTAL_FEATURES=false
```

## 🖼️ Screenshots

### Main Interface
![Main Interface](https://images.unsplash.com/photo-1633265486064-086b219458ec?auto=format&fit=crop&w=800&q=80)

### Password Generation
![Password Generation](https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80)

### Retro Theme
![Retro Theme](https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80)

## 🤝 Roadmap

- [ ] Browser extension version.
- [ ] Offline-first PWA support.
- [ ] Customizable wordlists for passphrases.

## 📄 License

MIT License - See [LICENSE](LICENSE) for details.

---

Made by [Musharraf Kazi](https://github.com/mk-knight23)
