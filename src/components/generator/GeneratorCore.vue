<script setup lang="ts">
import { ref, computed } from 'vue'
import { useVaultStore } from '@/stores/vaultStore'
import { useGenerator } from '@/composables/useGenerator'
import { useStrength } from '@/composables/useStrength'
import { useTheme } from '@/composables/useTheme'
import { useKeyboard } from '@/composables/useKeyboard'
import {
  Copy,
  RefreshCcw,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  Settings2,
  Moon,
  Sun,
  Download,
  Keyboard
} from 'lucide-vue-next'
import { useClipboard } from '@vueuse/core'

const store = useVaultStore()
const { generate } = useGenerator()
const { calculate } = useStrength()
const { isDark, toggleTheme } = useTheme()

const password = ref('')
const isVisible = ref(true)
const strength = ref(calculate(''))
const showShortcuts = ref(false)

const { copy, copied } = useClipboard()

const handleGenerate = () => {
  password.value = generate(store.config)
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
import { watchEffect } from 'vue'
watchEffect(() => {
  if (!password.value) {
    handleGenerate()
  }
})

// Computed shortcuts help text
const shortcutsList = computed(() => [
  { key: '⌘ + Enter', action: 'Generate new password' },
  { key: '⌘ + C', action: 'Copy to clipboard' },
  { key: 'Space', action: 'Toggle password visibility' },
  { key: '⌘ + D', action: 'Toggle dark/light mode' }
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
</script>

<template>
  <div class="space-y-8" role="region" aria-label="Password Generator">
    <!-- Theme Toggle -->
    <div class="flex justify-end">
      <button
        @click="toggleTheme()"
        class="p-3 rounded-xl bg-vault-card border border-vault-border hover:bg-vault-border transition-all"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        title="Toggle theme (⌘ + D)"
      >
        <Sun v-if="!isDark" :size="20" class="text-amber-500" />
        <Moon v-else :size="20" class="text-indigo-400" />
      </button>
    </div>

    <!-- Main Display Card -->
    <div class="glass-morphism p-8 space-y-6">
      <div class="relative group">
        <input
          :type="isVisible ? 'text' : 'password'"
          :value="password"
          readonly
          aria-label="Generated password"
          class="w-full bg-vault-bg/50 border-2 border-vault-border rounded-2xl px-6 py-6 text-2xl md:text-3xl font-mono text-center tracking-wider focus:border-vault-primary outline-none transition-all"
        >
        <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
           <button
             @click="handleToggleVisibility"
             class="p-2 text-slate-500 hover:text-white transition-colors"
             :aria-label="isVisible ? 'Hide password' : 'Show password'"
             title="Toggle visibility (Space)"
           >
              <Eye v-if="!isVisible" :size="20" />
              <EyeOff v-else :size="20" />
           </button>
           <button
             @click="handleCopy"
             class="p-3 bg-vault-primary text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-vault-primary/20"
             :aria-label="copied ? 'Password copied' : 'Copy password to clipboard'"
             title="Copy to clipboard (⌘ + C)"
           >
              <Check v-if="copied" :size="20" />
              <Copy v-else :size="20" />
           </button>
           <button
             @click="downloadPassword"
             class="p-3 bg-vault-card border border-vault-border rounded-xl hover:bg-vault-border transition-all"
             :aria-label="'Download password as file'"
             title="Download as file"
             :disabled="!password"
           >
              <Download :size="20" />
           </button>
        </div>
      </div>

      <!-- Strength Meter -->
      <div class="space-y-3" role="status" aria-live="polite">
        <div class="flex justify-between items-end">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Analysis</span>
          <span class="text-xs font-bold" :class="strength.color.replace('bg-', 'text-')">
            {{ strength.label }} ({{ strength.entropy }} bits)
          </span>
        </div>
        <div class="h-1.5 w-full bg-vault-border rounded-full overflow-hidden flex space-x-1" aria-hidden="true">
          <div
            v-for="i in 4"
            :key="i"
            class="h-full flex-1 transition-all duration-500"
            :class="i <= strength.score + 1 ? strength.color : 'bg-vault-border'"
          ></div>
        </div>
      </div>
    </div>

    <!-- Configuration -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div class="glass-morphism p-8 space-y-6">
        <h3 class="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center">
          <Settings2 class="mr-2" :size="16" /> Dimensions
        </h3>

        <div class="space-y-6">
           <div class="space-y-4">
              <div class="flex justify-between">
                <span class="text-xs font-bold text-slate-300">Length</span>
                <span class="text-xs font-mono text-vault-primary font-bold">{{ store.config.length }}</span>
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
      </div>

      <div class="glass-morphism p-8 space-y-6">
        <h3 class="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center">
          <ShieldCheck class="mr-2" :size="16" /> Complexity
        </h3>

        <div class="grid grid-cols-2 gap-4">
           <label class="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" v-model="store.config.useUppercase" class="sr-only peer" aria-label="Include uppercase letters">
              <div class="w-5 h-5 border-2 border-vault-border rounded-md peer-checked:bg-vault-primary peer-checked:border-vault-primary transition-all flex items-center justify-center">
                 <Check v-if="store.config.useUppercase" :size="12" class="text-black" stroke-width="4" />
              </div>
              <span class="text-xs font-medium text-slate-500 group-hover:text-slate-300">A-Z</span>
           </label>
           <label class="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" v-model="store.config.useLowercase" class="sr-only peer" aria-label="Include lowercase letters">
              <div class="w-5 h-5 border-2 border-vault-border rounded-md peer-checked:bg-vault-primary peer-checked:border-vault-primary transition-all flex items-center justify-center">
                 <Check v-if="store.config.useLowercase" :size="12" class="text-black" stroke-width="4" />
              </div>
              <span class="text-xs font-medium text-slate-500 group-hover:text-slate-300">a-z</span>
           </label>
           <label class="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" v-model="store.config.useNumbers" class="sr-only peer" aria-label="Include numbers">
              <div class="w-5 h-5 border-2 border-vault-border rounded-md peer-checked:bg-vault-primary peer-checked:border-vault-primary transition-all flex items-center justify-center">
                 <Check v-if="store.config.useNumbers" :size="12" class="text-black" stroke-width="4" />
              </div>
              <span class="text-xs font-medium text-slate-500 group-hover:text-slate-300">0-9</span>
           </label>
           <label class="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" v-model="store.config.useSymbols" class="sr-only peer" aria-label="Include symbols">
              <div class="w-5 h-5 border-2 border-vault-border rounded-md peer-checked:bg-vault-primary peer-checked:border-vault-primary transition-all flex items-center justify-center">
                 <Check v-if="store.config.useSymbols" :size="12" class="text-black" stroke-width="4" />
              </div>
              <span class="text-xs font-medium text-slate-500 group-hover:text-slate-300">#&!</span>
           </label>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <button
        @click="handleGenerate"
        class="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-vault-primary transition-all active:scale-[0.98]"
        aria-label="Generate new password (⌘ + Enter)"
      >
         <RefreshCcw :size="20" />
         <span>Regenerate</span>
      </button>

      <button
        @click="showShortcuts = !showShortcuts"
        class="w-full bg-vault-card border border-vault-border py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-vault-border transition-all"
        :aria-expanded="showShortcuts"
        aria-controls="shortcuts-panel"
      >
         <Keyboard :size="20" />
         <span>Shortcuts</span>
      </button>
    </div>

    <!-- Keyboard Shortcuts Panel -->
    <div
      v-if="showShortcuts"
      id="shortcuts-panel"
      class="glass-morphism p-6 space-y-4"
      role="region"
      aria-label="Keyboard shortcuts"
    >
      <h4 class="text-sm font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Keyboard Shortcuts</h4>
      <div class="grid grid-cols-2 gap-4">
        <div v-for="shortcut in shortcutsList" :key="shortcut.key" class="flex items-center justify-between p-3 bg-vault-bg/50 rounded-xl">
          <span class="text-xs font-mono text-slate-400">{{ shortcut.action }}</span>
          <kbd class="px-2 py-1 bg-vault-card border border-vault-border rounded text-xs font-mono">{{ shortcut.key }}</kbd>
        </div>
      </div>
    </div>
  </div>
</template>
