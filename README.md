# VaultPass - Professional Password Generator

<div align="center">

![Vue 3](https://img.shields.io/badge/Vue_3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Cryptographically secure password generation with enterprise-grade security analysis**

[Live Demo](https://vaultpass.vercel.app) | [GitHub](https://github.com/mk-knight23/51-Password-Generator-React)

</div>

---

## Overview

VaultPass is a professional-grade password generator built with Vue 3, TypeScript, and Tailwind CSS. Unlike basic password generators that use pseudo-random number generators, VaultPass leverages the browser's `window.crypto` API for cryptographically secure random values.

### Problem Statement

Most password generators use `Math.random()`, which is predictable and unsuitable for security-critical applications. Additionally, they lack real-time security analysis, making it difficult for users to understand password strength.

### Solution

VaultPass provides:
- **True Cryptographic Randomness**: Uses `window.crypto.getRandomValues()` for all generation
- **Entropy Analysis**: Real-time bits-of-entropy calculation with visual strength meter
- **Persistence**: Configurations and history survive page refreshes
- **Dark/Light Mode**: Full theme support with system preference detection
- **Keyboard Shortcuts**: Power-user focused workflow optimizations

---

## Features Comparison

| Feature | Basic Generators | VaultPass |
| :--- | :--- | :--- |
| **Randomness** | `Math.random()` | `window.crypto.getRandomValues()` |
| **Strength Analysis** | Simple bar | **Entropy calculation (bits)** |
| **Theme** | Dark only | **Dark + Light mode** |
| **Persistence** | None | **Pinia + LocalStorage** |
| **Export** | Copy only | **Copy + Download as file** |
| **Keyboard Shortcuts** | None | **Full support** |
| **Accessibility** | Basic | **ARIA labels, keyboard nav** |

---

## Tech Stack

- **Framework**: Vue 3.5+ with Composition API
- **Build Tool**: Vite 6
- **State Management**: Pinia with persistence
- **Styling**: Tailwind CSS 3.4
- **Icons**: Lucide Vue
- **Utilities**: VueUse Core
- **TypeScript**: Strict mode enabled

---

## Architecture

```
src/
├── components/
│   ├── generator/
│   │   └── GeneratorCore.vue    # Main password generation UI
│   └── history/
│       └── AuditLog.vue         # Session history panel
├── composables/
│   ├── useGenerator.ts          # Cryptographic generation logic
│   ├── useStrength.ts           # Entropy calculation
│   ├── useTheme.ts              # Light/dark mode management
│   └── useKeyboard.ts           # Keyboard shortcuts
├── stores/
│   └── vaultStore.ts            # Pinia store with persistence
├── types/
│   └── index.ts                 # TypeScript interfaces
├── App.vue                      # Root component
├── main.ts                      # App entry point
└── style.css                    # Global styles & theme variables
```

---

## Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `⌘ + Enter` | Generate new password |
| `⌘ + C` | Copy to clipboard |
| `Space` | Toggle password visibility |
| `⌘ + D` | Toggle dark/light mode |

---

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm 10.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/mk-knight23/51-Password-Generator-React.git
cd 51-Password-Generator-React

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Deployment

The app is optimized for deployment on:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag & drop `dist` folder
- **GitHub Pages**: `npm run preview`

---

## Security Details

### Cryptographic Randomness

All passwords are generated using `window.crypto.getRandomValues()`, which provides cryptographically secure random values suitable for security applications:

```typescript
const array = new Uint32Array(length);
window.crypto.getRandomValues(array);
```

### Entropy Calculation

Password strength is measured in bits of entropy, calculated based on:

- Character set size (uppercase, lowercase, numbers, symbols)
- Password length

| Entropy Range | Strength |
| :--- | :--- |
| < 40 bits | Weak |
| 40-60 bits | Fair |
| 60-80 bits | Good |
| 80-100 bits | Strong |
| > 100 bits | Secure |

### Privacy

- All generation happens **client-side**
- No data is transmitted to any server
- History is stored locally in your browser

---

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

---

<div align="center">

**Built with Vue 3 + TypeScript + Tailwind CSS**

</div>
