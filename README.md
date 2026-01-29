# VaultPass — Password Generator

A cryptographically secure password generator with a retro 90s terminal aesthetic. Built with Vue 3, TypeScript, and the browser's native Web Crypto API.

---

## What It Does

VaultPass generates strong, random passwords using cryptographically secure randomness (`window.crypto.getRandomValues()`). Unlike basic generators that use predictable `Math.random()`, this tool provides true randomness suitable for security-critical applications.

**When to use this tool:**
- Creating new passwords for online accounts
- Generating API keys or tokens
- Testing password strength requirements
- Educational demonstration of cryptography concepts

---

## Inputs

| Input | Type | Range | Description |
|-------|------|-------|-------------|
| Length | Number | 4-64 | Password character count |
| Uppercase | Boolean | - | Include A-Z characters |
| Lowercase | Boolean | - | Include a-z characters |
| Numbers | Boolean | - | Include 0-9 digits |
| Symbols | Boolean | - | Include special characters (!@#$%) |

---

## Outputs

| Output | Type | Description |
|--------|------|-------------|
| Password | String | Generated random password |
| Strength | Score | Entropy-based security rating (0-4) |
| Entropy | Number | Bits of entropy calculated |
| Label | String | Visual strength label (Weak to Secure) |

---

## Workflow Steps

1. **Configure Options** — Set password length and character types
2. **Generate** — Click [GENERATE] or press CMD+ENTER
3. **Review** — Check strength meter and entropy rating
4. **Copy** — Click copy button or press CMD+C
5. **Optional** — Download as .txt file or view history

---

## Stack Choice Rationale

| Technology | Purpose |
|------------|---------|
| Vue 3 (Composition API) | Reactive state with minimal boilerplate |
| TypeScript | Type safety for password configuration |
| Vite | Fast HMR and optimized builds |
| Tailwind CSS | Utility styling with custom retro classes |
| Pinia | Persistent state for settings and history |
| VueUse | Clipboard and browser utilities |
| Web Crypto API | Cryptographically secure randomness |

---

## Setup Steps

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

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `CMD + Enter` | Generate new password |
| `CMD + C` | Copy to clipboard |
| `Space` | Toggle password visibility |
| `CMD + D` | Toggle dark/light mode |

---

## Security Details

### Cryptographic Randomness

All passwords are generated using `window.crypto.getRandomValues()`, which provides cryptographically secure random values:

```typescript
const array = new Uint32Array(length);
window.crypto.getRandomValues(array);
```

### Entropy Calculation

Password strength is measured in bits of entropy:

| Entropy Range | Strength |
|:-------------|:---------|
| < 40 bits | Weak |
| 40-60 bits | Fair |
| 60-80 bits | Good |
| 80-100 bits | Strong |
| > 100 bits | Secure |

### Privacy

- All generation happens **client-side**
- No data transmitted to any server
- History stored locally in browser
- No cookies or tracking

---

## Limitations

- **Browser Dependency**: Requires modern browser with Web Crypto API support
- **Local Storage**: History cleared when browser data is deleted
- **No Sync**: Settings don't sync across devices
- **Character Set**: Limited to standard ASCII printable characters

---

## Project Structure

```
36-tool-react-password-generator/
├── design-system/
│   └── MASTER.md              # Retro Pixel theme specification
├── src/
│   ├── components/
│   │   ├── generator/
│   │   │   └── GeneratorCore.vue  # Main generation UI
│   │   ├── history/
│   │   │   └── AuditLog.vue       # Password history panel
│   │   └── ui/
│   │       └── SettingsPanel.vue  # Theme and audio settings
│   ├── composables/
│   │   ├── useGenerator.ts       # Crypto generation logic
│   │   ├── useStrength.ts        # Entropy calculation
│   │   ├── useTheme.ts           # Theme management
│   │   ├── useAudio.ts           # Sound effects
│   │   └── useKeyboard.ts        # Keyboard shortcuts
│   ├── stores/
│   │   ├── vaultStore.ts         # Password history state
│   │   ├── settings.ts           # User preferences
│   │   └── stats.ts              # Usage statistics
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── App.vue                   # Root component
│   ├── main.ts                   # Entry point
│   └── style.css                 # Retro theme styles
├── package.json
├── tailwind.config.js
└── README.md
```

---

## Design System

This application follows a **Retro Pixel / 90s Utility** design theme:
- VT323 pixel font for headers and UI
- Terminal green (#33ff33) primary color
- Sharp corners (no border-radius)
- 3D beveled buttons
- Scanline overlay effect
- Blocky scrollbars and inputs

See `design-system/MASTER.md` for complete design specifications.

---

## Deployment

This project is configured for deployment on three platforms:

### GitHub Pages
- **Workflow**: `.github/workflows/deploy.yml`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Trigger**: Push to `main` branch
- **Action**: `actions/deploy-page@v4` with Vite static site generator

### Vercel
- **Config**: `vercel.json`
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Rewrites**: SPA fallback to `/index.html`

### Netlify
- **Config**: `netlify.toml`
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Redirects**: All paths to `/index.html` (SPA support)

---

## Live Links

| Platform | URL |
|----------|-----|
| **GitHub Pages** | https://mk-knight23.github.io/36-tool-react-password-generator/ |
| **Vercel** | https://36-tool-react-password-generator.vercel.app/ |
| **Netlify** | https://36-tool-react-password-generator.netlify.app/ |

---

## License

MIT License — see [LICENSE](LICENSE) for details.
