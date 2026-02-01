<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useVaultStore } from '@/stores/vaultStore'
import { useGenerator } from '@/composables/useGenerator'
import { usePassphrase } from '@/composables/usePassphrase'
import { usePronounceable } from '@/composables/usePronounceable'
import { useStrength } from '@/composables/useStrength'
import { useTheme } from '@/composables/useTheme'
import { useKeyboard } from '@/composables/useKeyboard'
import {
  Copy,
  RefreshCw,
  Shield,
  Eye,
  EyeOff,
  Check,
  Settings,
  Sun,
  Moon,
  Download,
  Keyboard
} from 'lucide-vue-next'
import { useClipboard } from '@vueuse/core'

const store = useVaultStore()
const { generate } = useGenerator()
const { generate: generatePassphrase } = usePassphrase()
const { generate: generatePronounceable } = usePronounceable()
const { calculate } = useStrength()
const { isDark, toggleTheme } = useTheme()

const password = ref('')
const isVisible = ref(true)
const strength = ref(calculate(''))
const showShortcuts = ref(false)

const { copy, copied } = useClipboard()

type Mode = 'random' | 'passphrase' | 'pronounceable'
const currentMode = ref<Mode>('random')

const handleGenerate = () => {
  switch (currentMode.value) {
    case 'passphrase':
      password.value = generatePassphrase(store.config)
      break
    case 'pronounceable':
      // Use syllable count based on length (approximately length/6 syllables)
      const syllableCount = Math.max(3, Math.floor(store.config.length / 6))
      password.value = generatePronounceable(store.config.length, syllableCount)
      break
    default:
      password.value = generate(store.config)
  }
  strength.value = calculate(password.value)
  store.addToHistory(password.value)
}

const handleCopy = () => {
  if (password.value) {
    copy(password.value)
  }
}

const handleToggleVisibility = () => {
  isVisible.value = !isVisible.value
}

// Keyboard shortcuts
useKeyboard({
  onGenerate: handleGenerate,
  onCopy: handleCopy,
  onToggleVisibility: handleToggleVisibility,
  onToggleTheme: toggleTheme
})

// Generate on mount and config change
watchEffect(() => {
  if (!password.value) {
    handleGenerate()
  }
})

// Computed shortcuts help text
const shortcutsList = computed(() => [
  { key: 'CMD+ENTER', action: 'Generate password' },
  { key: 'CMD+C', action: 'Copy to clipboard' },
  { key: 'SPACE', action: 'Toggle visibility' },
  { key: 'CMD+D', action: 'Toggle theme' }
])

// Download as text file
const downloadPassword = () => {
  if (!password.value) return
  const blob = new Blob([password.value], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vaultpass-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

// Get strength color class
const getStrengthColor = (score: number) => {
  if (score <= 1) return 'text-retro-amber'
  if (score === 2) return 'text-retro-cyan'
  return 'text-retro-green'
}

const getStrengthBgColor = (score: number) => {
  if (score <= 1) return 'bg-retro-amber'
  if (score === 2) return 'bg-retro-cyan'
  return 'bg-retro-green'
}
</script>

<template>
  <div class="space-y-6" role="region" aria-label="Password Generator">
    <!-- Theme Toggle -->
    <div class="flex justify-end">
      <button
        @click="toggleTheme()"
        class="retro-btn"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      >
        <Sun v-if="!isDark" :size="18" :stroke-width="2.5" />
        <Moon v-else :size="18" :stroke-width="2.5" />
      </button>
    </div>

    <!-- Mode Toggle -->
    <div class="flex justify-center gap-2 md:gap-4">
      <button
        @click="currentMode = 'random'; handleGenerate()"
        class="retro-btn pixel-text text-xs md:text-sm"
        :class="currentMode === 'random' ? 'retro-btn-primary' : ''"
        aria-label="Random password mode"
      >
        [RANDOM]
      </button>
      <button
        @click="currentMode = 'pronounceable'; handleGenerate()"
        class="retro-btn pixel-text text-xs md:text-sm"
        :class="currentMode === 'pronounceable' ? 'retro-btn-primary' : ''"
        aria-label="Pronounceable password mode"
      >
        [PRONOUNCEABLE]
      </button>
      <button
        @click="currentMode = 'passphrase'; handleGenerate()"
        class="retro-btn pixel-text text-xs md:text-sm"
        :class="currentMode === 'passphrase' ? 'retro-btn-primary' : ''"
        aria-label="Passphrase mode"
      >
        [PASSPHRASE]
      </button>
    </div>

    <!-- Main Display Card -->
    <div class="retro-card p-6 space-y-6">
      <div class="relative">
        <input
          :type="isVisible ? 'text' : 'password'"
          :value="password"
          readonly
          aria-label="Generated password"
          class="retro-input w-full text-center text-xl md:text-2xl tracking-widest transition-all"
          :class="{ 'text-retro-green border-retro-green': copied }"
          style="font-family: 'Courier New', monospace;"
        >
        <div class="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <button
            @click="handleToggleVisibility"
            class="retro-btn p-2"
            :aria-label="isVisible ? 'Hide password' : 'Show password'"
          >
            <Eye v-if="!isVisible" :size="16" :stroke-width="2.5" />
            <EyeOff v-else :size="16" :stroke-width="2.5" />
          </button>
          <button
            @click="handleCopy"
            class="retro-btn p-2 relative"
            :class="copied ? 'bg-retro-green text-retro-black border-retro-green' : 'retro-btn-primary'"
            :aria-label="copied ? 'Password copied' : 'Copy password'"
          >
            <Check v-if="copied" :size="16" :stroke-width="2.5" />
            <Copy v-else :size="16" :stroke-width="2.5" />
          </button>
          <button
            @click="downloadPassword"
            class="retro-btn p-2"
            :aria-label="'Download password as file'"
          >
            <Download :size="16" :stroke-width="2.5" />
          </button>
        </div>
      </div>

      <!-- Strength Meter -->
      <div class="space-y-2" role="status" aria-live="polite">
        <div class="flex justify-between items-end">
          <span class="pixel-text text-xs text-retro-gray tracking-widest">
            [STRENGTH ANALYSIS]
          </span>
          <span class="pixel-text text-sm font-bold" :class="getStrengthColor(strength.score)">
            {{ strength.label }} ({{ strength.entropy }} bits)
          </span>
        </div>
        <div class="h-3 w-full bg-retro-dim border-2 border-retro-border flex" aria-hidden="true">
          <div
            v-for="i in 4"
            :key="i"
            class="h-full flex-1 border-r border-retro-border last:border-r-0"
            :class="i <= strength.score + 1 ? getStrengthBgColor(strength.score) : 'bg-retro-dim'"
          ></div>
        </div>
      </div>
    </div>

    <!-- Configuration -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Length Slider -->
      <div class="retro-card p-6 space-y-4">
        <h3 class="pixel-text text-sm font-bold text-retro-gray tracking-widest flex items-center">
          <Settings :size="14" :stroke-width="2.5" class="mr-2" />
          [LENGTH]
        </h3>

        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="pixel-text text-sm text-retro-gray">CHARACTERS</span>
            <span class="pixel-text text-sm text-retro-green">{{ store.config.length }}</span>
          </div>
          <input
            type="range"
            min="4"
            max="64"
            v-model.number="store.config.length"
            class="custom-slider"
            aria-label="Password length"
          >
        </div>
      </div>

      <!-- Complexity Options -->
      <div class="retro-card p-6 space-y-4">
        <h3 class="pixel-text text-sm font-bold text-retro-gray tracking-widest flex items-center">
          <Shield :size="14" :stroke-width="2.5" class="mr-2" />
          [COMPLEXITY]
        </h3>

        <div class="grid grid-cols-2 gap-3">
          <label class="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              v-model="store.config.useUppercase"
              class="retro-checkbox"
              aria-label="Include uppercase letters"
            >
            <span class="pixel-text text-sm text-retro-gray group-hover:text-retro-white">A-Z</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              v-model="store.config.useLowercase"
              class="retro-checkbox"
              aria-label="Include lowercase letters"
            >
            <span class="pixel-text text-sm text-retro-gray group-hover:text-retro-white">a-z</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              v-model="store.config.useNumbers"
              class="retro-checkbox"
              aria-label="Include numbers"
            >
            <span class="pixel-text text-sm text-retro-gray group-hover:text-retro-white">0-9</span>
          </label>
          <label class="flex items-center gap-3 cursor-pointer group">
            <input
              type="checkbox"
              v-model="store.config.useSymbols"
              class="retro-checkbox"
              aria-label="Include symbols"
            >
            <span class="pixel-text text-sm text-retro-gray group-hover:text-retro-white">#!@</span>
          </label>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        @click="handleGenerate"
        class="retro-btn-primary pixel-text text-lg py-4 flex items-center justify-center gap-3"
        aria-label="Generate new password"
      >
        <RefreshCw :size="18" :stroke-width="2.5" />
        <span>[GENERATE]</span>
      </button>

      <button
        @click="showShortcuts = !showShortcuts"
        class="retro-btn pixel-text text-lg py-4 flex items-center justify-center gap-3"
        :aria-expanded="showShortcuts"
        aria-controls="shortcuts-panel"
      >
        <Keyboard :size="18" :stroke-width="2.5" />
        <span>[SHORTCUTS]</span>
      </button>
    </div>

    <!-- Keyboard Shortcuts Panel -->
    <div
      v-if="showShortcuts"
      id="shortcuts-panel"
      class="retro-card p-4 space-y-3"
      role="region"
      aria-label="Keyboard shortcuts"
    >
      <h4 class="pixel-text text-sm font-bold text-retro-gray tracking-widest mb-4">
        [KEYBOARD SHORTCUTS]
      </h4>
      <div class="grid grid-cols-1 gap-2">
        <div
          v-for="shortcut in shortcutsList"
          :key="shortcut.key"
          class="flex items-center justify-between p-2 bg-retro-dim border border-retro-border"
        >
          <span class="pixel-text text-sm text-retro-gray">{{ shortcut.action }}</span>
          <kbd class="pixel-text">{{ shortcut.key }}</kbd>
        </div>
      </div>
    </div>
  </div>
</template>
