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

- **Framework**: Vue 3.5.13 (Composition API).
- **State**: Pinia 2.3.1.
- **Styling**: Tailwind CSS 3.4.19 (Custom Retro Theme).
- **Icons**: Lucide Vue Next 0.468.0.
- **Build**: Vite 6.0.5 + TypeScript 5.6.2.
- **Animations**: @motionone/vue 10.16.4.
- **Utilities**: @vueuse/core 11.3.0.

---

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Vue 3 Application Layer                      │
│  Vue 3.5.13 + TypeScript + Vite 6 + Tailwind CSS v3            │
│  + @motionone/vue + Lucide Vue Next + @vueuse/core              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                    State Management Layer                        │
│  Pinia Stores (settings, stats, vaultStore)                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Composables Layer                            │
│  useGenerator, usePassphrase, usePronounceable, useTheme, etc.  │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                     Components Layer                            │
│  GeneratorCore, SettingsPanel, ToastContainer, AuditLog        │
└─────────────────────────────────────────────────────────────────┘

                            ↓ (Client-Side Only)
┌─────────────────────────────────────────────────────────────────┐
│                    Browser Crypto API                           │
│  window.crypto.getRandomValues() for cryptographically         │
│  secure random number generation                               │
└─────────────────────────────────────────────────────────────────┘
```

### Project Structure

```
36-tool-react-password-generator/
├── src/
│   ├── main.ts                     # Vue entry point
│   ├── App.vue                     # Root component
│   ├── vite-env.d.ts              # Vite type definitions
│   │
│   ├── composables/                # Vue 3 Composables (Composition API)
│   │   ├── useGenerator.ts        # Standard password generation logic
│   │   ├── usePassphrase.ts      # XKCD-style passphrase generation
│   │   ├── usePronounceable.ts   # Pronounceable string generation
│   │   ├── useTheme.ts           # Dark/light theme management
│   │   ├── useAudio.ts           # Audio feedback
│   │   ├── useStrength.ts        # Password strength calculation
│   │   ├── useToast.ts           # Toast notifications
│   │   ├── useKeyboard.ts        # Keyboard navigation
│   │   └── useErrorBoundary.ts   # Error handling
│   │
│   ├── stores/                     # Pinia stores (State Management)
│   │   ├── settings.ts            # Global settings (theme, audio, etc.)
│   │   ├── stats.ts               # Usage statistics
│   │   └── vaultStore.ts          # Vault store for saved passwords
│   │
│   ├── components/
│   │   ├── generator/
│   │   │   └── GeneratorCore.vue  # Main password generator component
│   │   ├── history/
│   │   │   └── AuditLog.vue       # Password history/audit log
│   │   └── ui/
│   │       ├── SettingsPanel.vue  # Settings panel
│   │       └── ToastContainer.vue # Toast notifications
│   │
│   ├── services/
│   │   └── backendService.ts      # Backend service (optional)
│   │
│   ├── utils/
│   │   └── constants.ts           # Constants and utilities
│   │
│   └── types/
│       └── index.ts               # TypeScript definitions
│
├── design-system/                  # Design system tokens
├── public/                         # Static assets
├── .github/workflows/
│   ├── ci.yml                      # Lint and build workflow
│   └── deploy.yml                  # GitHub Pages deployment
├── .env.example                    # Environment variables example
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript config
├── vite.config.ts                  # Vite config
├── tailwind.config.js              # Tailwind CSS config
├── postcss.config.js               # PostCSS config
└── README.md                       # This file
```

### Composables Architecture

```typescript
{
  composables: {
    useGenerator: {
      purpose: "Standard password generation",
      features: [
        "Configurable length (8-128 characters)",
        "Character sets (uppercase, lowercase, numbers, symbols)",
        "Avoid ambiguous characters (0/O, 1/l/I, etc.)",
        "Exclude user-defined characters"
      ],
      crypto: "window.crypto.getRandomValues()"
    },
    usePassphrase: {
      purpose: "XKCD-style passphrase generation",
      features: [
        "Word-based passwords (4-12 words)",
        "Configurable separator (space, hyphen, camelCase)",
        "Optional capitalization",
        "Optional number suffix"
      ],
      security: "High entropy through word combinations"
    },
    usePronounceable: {
      purpose: "Pronounceable password generation",
      features: [
        "Alternating consonant-vowel patterns",
        "Configurable length",
        "Memory-friendly passwords"
      ],
      algorithm: "Syllable-based construction"
    },
    useTheme: {
      purpose: "Theme management",
      features: [
        "Dark/light mode toggle",
        "System preference detection",
        "Persistent storage (localStorage)"
      ]
    },
    useAudio: {
      purpose: "Audio feedback",
      features: [
        "Copy confirmation sound",
        "Error feedback sound",
        "Toggle on/off"
      ]
    },
    useStrength: {
      purpose: "Password strength calculation",
      metrics: [
        "Entropy calculation",
        "Common password detection",
        "Pattern detection",
        "Strength rating (weak/fair/good/strong)"
      ]
    },
    useToast: {
      purpose: "Toast notifications",
      features: [
        "Success/error/warning toasts",
        "Auto-dismissal",
        "Queue management"
      ]
    },
    useKeyboard: {
      purpose: "Keyboard navigation",
      features: [
        "Global hotkeys (Ctrl/Cmd+Enter to generate)",
        "Accessibility optimized",
        "Screen reader support"
      ]
    },
    useErrorBoundary: {
      purpose: "Error handling",
      features: [
        "Global error catching",
        "Graceful degradation",
        "User-friendly error messages"
      ]
    }
  }
}
```

### State Management Architecture

```typescript
{
  stores: {
    settings: {
      scope: "Global application settings",
      state: {
        theme: "dark/light",
        audio: "boolean",
        autoCopy: "boolean",
        showHistory: "boolean"
      },
      persistence: "localStorage"
    },
    stats: {
      scope: "Usage statistics",
      state: {
        passwordsGenerated: "number",
        passphrasesGenerated: "number",
        pronounceableGenerated: "number",
        totalCopied: "number"
      },
      persistence: "localStorage"
    },
    vaultStore: {
      scope: "Saved passwords vault",
      state: {
        vault: "Array of saved password entries",
        maxEntries: "number (default: 50)"
      },
      persistence: "localStorage",
      encryption: "Optional (client-side only)"
    }
  }
}
```

### Component Architecture

```typescript
{
  components: {
    GeneratorCore: {
      purpose: "Main password generation interface",
      features: [
        "Mode selection (password/passphrase/pronounceable)",
        "Configuration options",
        "Generated password display",
        "Copy button",
        "Strength indicator"
      ]
    },
    SettingsPanel: {
      purpose: "Application settings",
      settings: [
        "Theme toggle",
        "Audio toggle",
        "Auto-copy toggle",
        "History visibility",
        "Vault management"
      ]
    },
    ToastContainer: {
      purpose: "Notification system",
      features: [
        "Success toasts",
        "Error toasts",
        "Warning toasts",
        "Auto-dismissal"
      ]
    },
    AuditLog: {
      purpose: "Password history",
      features: [
        "List of recent passwords",
        "Timestamps",
        "Type indicator",
        "Copy functionality"
      ]
    }
  }
}
```

### Security Architecture

```typescript
{
  security: {
    randomGeneration: {
      method: "window.crypto.getRandomValues()",
      purpose: "Cryptographically secure random numbers",
      entropy: "Maximum possible entropy for given configuration"
    },
    dataPrivacy: {
      storage: "Client-side only (localStorage)",
      transmission: "No data is ever transmitted",
      persistence: "User-controlled (can clear vault/history)"
    },
    designPrinciples: [
      "Zero-Trust Generation",
      "Client-Side Only",
      "Open Source",
      "Auditable Code"
    ]
  }
}
```

### Design System Architecture

```typescript
{
  design: {
    theme: "Retro/Terminal Aesthetic",
    inspiration: "80s terminal systems",
    features: [
      "High-contrast colors",
      "Pixel-perfect UI",
      "Monospace fonts",
      "Terminal-style borders",
      "Scanline effects"
    ]
  },
  tailwind: {
    version: "3.4.19",
    configuration: "Custom retro theme",
    features: [
      "Custom color palette",
      "Retro animations",
      "Hover effects"
    ]
  }
}
```

### Performance Optimizations

- **Vue 3 Composition API**: Minimal re-renders with reactive dependencies
- **Pinia**: Lightweight state management (~1KB)
- **@motionone/vue**: GPU-accelerated animations
- **Tailwind CSS**: Utility-first CSS with JIT compiler
- **Vite**: Fast HMR and optimized production builds
- **Lazy Loading**: Components loaded on demand (if implemented)

### Accessibility Architecture

```typescript
{
  accessibility: {
    keyboardNavigation: {
      features: [
        "Tab navigation",
        "Global hotkeys (Ctrl/Cmd+Enter)",
        "Keyboard shortcuts for common actions"
      ]
    },
    screenReader: {
      features: [
        "ARIA labels",
        "Semantic HTML",
        "Live regions for toasts"
      ]
    },
    visual: {
      features: [
        "High contrast colors",
        "Clear typography",
        "Focus indicators"
      ]
    }
  }
}
```

### Data Flow Architecture

```
User Input → Component Event → Composable → Pinia Store → localStorage
     ↓              ↓              ↓           ↓              ↓
  Generate Button useGenerator settings Update Persist
  Theme Toggle   useTheme      stats      Re-render   Theme
  Copy Button    useToast      vaultStore  UI Update   History
```

### Animation Architecture

```typescript
{
  animations: {
    library: "@motionone/vue 10.16.4",
    features: [
      "Smooth transitions",
      "Button hover effects",
      "Toast animations",
      "Theme switch animations"
    ],
    performance: "GPU-accelerated for smooth 60fps"
  }
}
```

### Type System Architecture

```typescript
{
  types: {
    Password: {
      value: "string",
      strength: "weak/fair/good/strong",
      entropy: "number",
      generatedAt: "Date"
    },
    Passphrase: {
      words: "string[]",
      separator: "string",
      capitalizeWords: "boolean",
      addNumber: "boolean"
    },
    VaultEntry: {
      id: "string",
      label: "string",
      password: "string",
      createdAt: "Date"
    },
    Settings: {
      theme: "dark/light",
      audio: "boolean",
      autoCopy: "boolean",
      showHistory: "boolean"
    }
  }
}
```

### CI/CD Pipeline

```yaml
Push to main → CI Check → Build → Deploy
     ↓            ↓          ↓         ↓
  Trigger     Lint+Check   Production   GitHub Pages
              (Vite)       Build        Static Site
```

- **CI**: Linting and build checks
- **Build**: Production-optimized bundle with Vite
- **Deploy**: Automatic to GitHub Pages

### Multi-Platform Deployment

| Platform | URL | Type |
|----------|-----|------|
| GitHub Pages | github.io/36-tool-react-password-generator | Static Site |
| Vercel | vaultpass.vercel.app | Static Site |
| Netlify | vaultpass.netlify.app | Static Site |

### Extension Points

```typescript
{
  newFeatures: [
    "Add browser extension version",
    "Add PWA support for offline usage",
    "Add customizable wordlists for passphrases",
    "Add password vault sync (optional encryption)"
  ],
  newModes: [
    "Add Diceware passphrase mode",
    "Add entropy visualizer",
    "Add password expiration reminders"
  ],
  newServices: [
    "Add backend service for vault encryption",
    "Add analytics service (opt-in)",
    "Add password breach checking"
  ]
}
```

### Key Architectural Decisions

**Why Vue 3 Composition API?**
- Better TypeScript support than Options API
- Composable logic (reusable across components)
- Lightweight and performant
- Great developer experience

**Why Pinia for State Management?**
- Official Vue 3 state management library
- Simpler than Vuex
- TypeScript-first design
- Built-in localStorage persistence support

**Why Tailwind CSS v3?**
- Utility-first approach
- Custom retro theme
- Small bundle size with JIT compiler
- Consistent design system

**Why Client-Side Only?**
- Maximum security (no server to compromise)
- No data transmission
- Works offline
- No hosting costs

**Why window.crypto.getRandomValues()?**
- Cryptographically secure
- No external dependencies
- Maximum entropy
- Native browser API

### Design Philosophy

```typescript
{
  security: {
    principles: [
      "Zero-Trust Generation",
      "Client-Side Only",
      "No Data Transmission",
      "Maximum Transparency"
    ]
  },
  ui: {
    style: "Retro/Terminal Aesthetic",
    features: [
      "High contrast for readability",
      "Pixel-perfect design",
      "Smooth animations",
      "Accessibility first"
    ]
  },
  ux: {
    principles: [
      "Simple and intuitive",
      "Keyboard navigation",
      "Screen reader support",
      "Immediate feedback"
    ]
  }
}
```

## 📐 Architecture

The following notes summarize the key architectural principles:

- **Composables**: Modular generation logic separated by mode (`useGenerator`, `usePassphrase`, `usePronounceable`).
- **Stores**: Global settings (Dark Mode, Audio) and usage statistics.
- **Components**: Reusable UI primitives designed for a consistent retro feel.

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

*Last updated: 2026-03-01*

Made by [Musharraf Kazi](https://github.com/mk-knight23)
