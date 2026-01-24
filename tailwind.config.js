/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        vault: {
          bg: 'var(--vault-bg)',
          card: 'var(--vault-card)',
          primary: 'var(--vault-primary)',
          danger: '#ef4444',
          warning: '#f59e0b',
          border: 'var(--vault-border)'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
