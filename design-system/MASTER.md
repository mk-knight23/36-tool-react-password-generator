# VaultPass — Retro Pixel Design System

## Theme Identity: 90s Utility / Pixel Art

A nostalgic tribute to 90s shareware utilities, DOS applications, and early password managers. Blocky interfaces, pixel-perfect corners, and terminal-inspired aesthetics.

---

## Color Palette (CGA/EGA Inspired)

### Primary Colors (Terminal Green)

| Token | Value | Usage |
|-------|-------|-------|
| `--retro-green` | `#33ff33` | Primary text, success states |
| `--retro-green-dim` | `#22cc22` | Dimmed green |
| `--retro-amber` | `#ffb000` | Warnings, secondary actions |
| `--retro-cyan` | `#00ffff` | Info, hints |

### Background Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--retro-black` | `#0a0a0a` | Primary background |
| `--retro-dark` | `#111111` | Card backgrounds |
| `--retro-dim` | `#1a1a1a` | Input backgrounds |
| `--retro-border` | `#333333` | Borders, dividers |

### Text Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--retro-white` | `#e0e0e0` | Primary text |
| `--retro-gray` | `#888888` | Secondary text |
| `--retro-dim-gray` | `#555555` | Muted text |

---

## Typography

### Font Families

```css
--font-pixel: "Press Start 2P", "VT323", monospace;
--font-mono: "Courier New", "Consolas", monospace;
--font-system: "MS Sans Serif", system-ui, sans-serif;
```

### Type Scale

| Size | rem | px | Usage |
|------|-----|-----|-------|
| XL | 1.25rem | 20px | Headings |
| LG | 1rem | 16px | Subheadings |
| MD | 0.875rem | 14px | Body text |
| SM | 0.75rem | 12px | Labels |
| XS | 0.625rem | 10px | Tiny text |

### Typography Rules

- All text uppercase for headers
- Pixel font for headings and UI elements
- Monospace for passwords and data
- No font smoothing (crisp pixels)

---

## Spacing System

Based on 4px pixel grid:

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight spacing |
| `--space-2` | 8px | Icon gaps |
| `--space-3` | 12px | Small padding |
| `--space-4` | 16px | Default padding |
| `--space-6` | 24px | Section gaps |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-none` | 0px | Default (no rounding) |
| `--radius-sm` | 0px | Always square |

**Rule:** Sharp corners only. No rounded buttons or inputs.

---

## Borders

| Token | Value | Usage |
|-------|-------|-------|
| `--border-thin` | 1px | Default borders |
| `--border-thick` | 2px | Emphasis borders |
| `--border-raised` | 4px solid (light+dark) | 3D button effect |

### 3D Border Effect (Beveled)

```
Top/Left:  2px solid #444
Bottom/Right: 2px solid #000
```

For pressed state (inset):

```
Top/Left:  2px solid #000
Bottom/Right: 2px solid #444
```

---

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-none` | none | No shadows |
| `--shadow-retro` | `4px 4px 0 #000` | Block offset shadow |

**Note:** Hard shadows only, no blur.

---

## Components

### Buttons (3D Beveled)

```css
background: #222;
border-top: 2px solid #555;
border-left: 2px solid #555;
border-right: 2px solid #000;
border-bottom: 2px solid #000;
padding: 8px 16px;
font-family: var(--font-pixel);
text-transform: uppercase;
letter-spacing: 1px;
```

**Pressed State:**
```css
border-top: 2px solid #000;
border-left: 2px solid #000;
border-right: 2px solid #555;
border-bottom: 2px solid #555;
transform: translate(1px, 1px);
```

### Inputs (Terminal Style)

```css
background: var(--retro-dim);
border: 2px solid var(--retro-border);
padding: 8px 12px;
font-family: var(--font-mono);
font-size: 14px;
color: var(--retro-green);
text-transform: uppercase;
```

### Checkboxes (Square)

```css
width: 16px;
height: 16px;
background: var(--retro-dim);
border: 2px solid var(--retro-border);
border-radius: 0;
```

**Checked State:**
```css
background: var(--retro-green);
border-color: var(--retro-green);
```

Add X mark using pseudo-element.

### Sliders (Blocky)

```css
-webkit-appearance: none;
height: 8px;
background: var(--retro-dim);
border: 2px solid var(--retro-border);
border-radius: 0;
```

**Thumb:**
```css
width: 16px;
height: 20px;
background: var(--retro-green);
border: 2px solid var(--retro-white);
cursor: pointer;
```

---

## Layout

### Container Widths

| Breakpoint | Max Width | Usage |
|------------|-----------|-------|
| Mobile | 100% | Default |
| Desktop | 800px | Max content |

### Grid System

- Fixed pixel widths where possible
- 8px gutters
- Sharp grid alignment

---

## Motion & Transitions

### Timing Functions

```css
--ease-retro: steps(4, end);  /* Stepped animation */
--ease-linear: linear;
```

### Durations

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-fast` | 100ms | Instant feedback |
| `--duration-base` | 200ms | Default |
| `--duration-slow` | 0ms | No animation (snappy) |

**Note:** Prefer instant state changes over smooth animations.

---

## Iconography

- Use Lucide icons with stroke-width: 2.5
- Size: 16px, 20px
- Render as pixel-art where possible
- Block cursor character instead of smooth pointer

---

## Scanline Effect (Optional)

```css
.scanlines::after {
  content: '';
  position: fixed;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.1) 2px,
    rgba(0, 0, 0, 0.1) 4px
  );
  pointer-events: none;
}
```

---

## ASCII Art Headers

Use ASCII art for logo/headers:

```
███████╗██╗   ██╗███████╗███╗   ██╗████████╗
██╔════╝██║   ██║██╔════╝████╗  ██║╚══██╔══╝
█████╗  ██║   ██║███████╗██╔██╗ ██║   ██║
██╔══╝  ██║   ██║╚════██║██║╚██╗██║   ██║
██║     ╚██████╔╝███████║██║ ╚████║   ██║
╚═╝      ╚═════╝ ╚══════╝╚═╝  ╚═══╝   ╚═╝
```

---

## Accessibility

- Minimum contrast ratio: 4.5:1
- Focus visible: 2px solid var(--retro-green)
- Keyboard navigation: Visible outline
- Reduced motion: Disable all animations

---

## Anti-Patterns

### Don't Use

- Rounded corners (radius > 0)
- Smooth gradients
- Box shadows with blur
- Translucent/opacity effects
- Smooth easing functions
- Modern sans-serif fonts
- Colorful gradients

### Use Instead

- Sharp corners
- Solid colors
- Hard shadows
- Opaque backgrounds
- Stepped or instant animations
- Pixel/monospace fonts
- High contrast borders

---

## Cursor Styles

```css
.cursor-retro {
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><rect x="0" y="0" width="2" height="2" fill="%2333ff33"/><rect x="2" y="2" width="2" height="2" fill="%2333ff33"/><rect x="4" y="4" width="2" height="2" fill="%2333ff33"/><rect x="6" y="6" width="2" height="2" fill="%2333ff33"/><rect x="8" y="8" width="2" height="2" fill="%2333ff33"/></svg>'), auto;
}
```

---

## Print Styles

```css
@media print {
  background: white;
  color: black;
  box-shadow: none;
  border: 1px solid #000;
}
```
