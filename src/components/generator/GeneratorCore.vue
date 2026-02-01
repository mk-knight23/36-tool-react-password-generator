<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import { useVaultStore } from '@/stores/vaultStore'
import { useGenerator } from '@/composables/useGenerator'
import { usePassphrase } from '@/composables/usePassphrase'
import { usePronounceable } from '@/composables/usePronounceable'
import { useStrength } from '@/composables/useStrength'
import { useTheme } from '@/composables/useTheme'
import { useKeyboard } from '@/composables/useKeyboard'
import { useToast } from '@/composables/useToast'
import { checkCompromisedPassword, analyzeWeakPatterns, getPasswordRecommendations } from '@/services/backendService'
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
  Keyboard,
  Layers,
  FileText
} from 'lucide-vue-next'

const store = useVaultStore()
const { generate } = useGenerator()
const { generate: generatePassphrase } = usePassphrase()
const { generate: generatePronounceable } = usePronounceable()
const { calculate } = useStrength()
const { isDark, toggleTheme } = useTheme()
const toast = useToast()

const password = ref('')
const isVisible = ref(true)
const strength = ref(calculate(''))
const showShortcuts = ref(false)
const passwordNote = ref('')
const batchMode = ref(false)
const batchSize = ref(5)
const generatedBatch = ref<string[]>([])
const showBatchResults = ref(false)
const compromisedCheck = ref<{ count: number; loading: boolean }>({ count: -1, loading: false })
const showRecommendations = ref(false)

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

  // Check for compromised password
  compromisedCheck.value = { count: -1, loading: true }
  checkCompromisedPassword(password.value).then(count => {
    compromisedCheck.value = { count, loading: false }
  })

  // Store note with password (if provided)
  store.addToHistory(password.value, passwordNote.value || undefined)
  // Clear note after generation
  passwordNote.value = ''
}

const handleCopy = async () => {
  if (password.value) {
    try {
      await navigator.clipboard.writeText(password.value)
      toast.success('Password copied to clipboard!')
    } catch {
      toast.error('Failed to copy password')
    }
  }
}

const handleToggleVisibility = () => {
  isVisible.value = !isVisible.value
}

// Batch generation
const handleBatchGenerate = () => {
  generatedBatch.value = []
  showBatchResults.value = true

  for (let i = 0; i < batchSize.value; i++) {
    let generated = ''
    switch (currentMode.value) {
      case 'passphrase':
        generated = generatePassphrase(store.config)
        break
      case 'pronounceable':
        const syllableCount = Math.max(3, Math.floor(store.config.length / 6))
        generated = generatePronounceable(store.config.length, syllableCount)
        break
      default:
        generated = generate(store.config)
    }
    generatedBatch.value.push(generated)
    store.addToHistory(generated, `Batch ${i + 1}/${batchSize.value}`)
  }

  // Set first password as main password
  password.value = generatedBatch.value[0]
  strength.value = calculate(password.value)
}

const copyAllBatch = async () => {
  const allPasswords = generatedBatch.value.join('\n')
  try {
    await navigator.clipboard.writeText(allPasswords)
    toast.success('All passwords copied to clipboard!')
  } catch {
    toast.error('Failed to copy passwords')
  }
}

const downloadBatch = () => {
  const content = generatedBatch.value.map((pwd, i) =>
    `Password ${i + 1}: ${pwd}`
  ).join('\n')
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `vaultpass-batch-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

const copyPassword = async (pwd: string) => {
  try {
    await navigator.clipboard.writeText(pwd)
    toast.success('Password copied!')
  } catch {
    toast.error('Failed to copy')
  }
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

// Password recommendations
const recommendations = computed(() => {
  if (!password.value) return []
  return getPasswordRecommendations(password.value, strength.value.entropy)
})

const weakPatterns = computed(() => {
  if (!password.value) return null
  return analyzeWeakPatterns(password.value)
})

// Compromised password status
const compromisedStatus = computed(() => {
  if (compromisedCheck.value.loading) return 'loading'
  if (compromisedCheck.value.count === -1) return 'unknown'
  if (compromisedCheck.value.count === 0) return 'safe'
  if (compromisedCheck.value.count > 0) return 'compromised'
  return 'unknown'
})

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
      <!-- Password Note Input -->
      <div class="space-y-2">
        <label class="pixel-text text-xs text-retro-gray tracking-widest">
          [OPTIONAL NOTE] - Remind yourself where you'll use this
        </label>
        <input
          v-model="passwordNote"
          type="text"
          placeholder="e.g., for GitHub, work email, router admin..."
          class="retro-input w-full text-sm"
          maxlength="50"
          aria-label="Password note"
        >
      </div>

      <div class="relative">
        <input
          :type="isVisible ? 'text' : 'password'"
          :value="password"
          readonly
          aria-label="Generated password"
          class="retro-input w-full text-center text-xl md:text-2xl tracking-widest"
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
            class="retro-btn p-2 retro-btn-primary"
            aria-label="Copy password to clipboard"
          >
            <Copy :size="16" :stroke-width="2.5" />
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

      <!-- Security Check -->
      <div class="space-y-3" role="status" aria-live="polite">
        <div class="flex justify-between items-center">
          <span class="pixel-text text-xs text-retro-gray tracking-widest">
            [SECURITY CHECK]
          </span>
          <button
            @click="showRecommendations = !showRecommendations"
            class="pixel-text text-xs text-retro-cyan hover:text-retro-white"
          >
            [{{ showRecommendations ? 'HIDE' : 'SHOW' }} ANALYSIS]
          </button>
        </div>

        <!-- Compromised Status -->
        <div class="p-3 border-2 border-retro-border flex items-center justify-between"
             :class="{
               'bg-red-900/20 border-red-500': compromisedStatus === 'compromised',
               'bg-green-900/20 border-green-500': compromisedStatus === 'safe',
               'bg-retro-dim': compromisedStatus === 'loading' || compromisedStatus === 'unknown'
             }"
        >
          <div class="flex items-center gap-2">
            <Shield :size="14" :stroke-width="2.5" />
            <span class="pixel-text text-sm">
              <template v-if="compromisedStatus === 'loading'">Checking...</template>
              <template v-else-if="compromisedStatus === 'safe'">Not found in breaches</template>
              <template v-else-if="compromisedStatus === 'compromised'">
                Found in {{ compromisedCheck.count }} breach(es)!
              </template>
              <template v-else>Check unavailable</template>
            </span>
          </div>
        </div>

        <!-- Recommendations -->
        <div v-if="showRecommendations && recommendations.length" class="space-y-2">
          <div class="pixel-text text-xs text-retro-gray tracking-widest">
            [RECOMMENDATIONS]
          </div>
          <div class="space-y-1">
            <div
              v-for="(rec, index) in recommendations"
              :key="index"
              class="p-2 bg-retro-dim border border-retro-border pixel-text text-xs flex items-start gap-2"
            >
              <span class="text-retro-amber">▸</span>
              <span>{{ rec }}</span>
            </div>
          </div>
        </div>

        <!-- Weak Pattern Alerts -->
        <div v-if="showRecommendations && weakPatterns && (weakPatterns.isSequential || weakPatterns.isRepeated || weakPatterns.isCommon)"
             class="space-y-2">
          <div class="pixel-text text-xs text-retro-gray tracking-widest">
            [WEAK PATTERNS DETECTED]
          </div>
          <div v-if="weakPatterns.isSequential" class="p-2 bg-red-900/20 border-2 border-red-500 pixel-text text-xs text-red-400">
            ⚠ Sequential characters detected (abc, 123)
          </div>
          <div v-if="weakPatterns.isRepeated" class="p-2 bg-red-900/20 border-2 border-red-500 pixel-text text-xs text-red-400">
            ⚠ Repeated characters detected (aaa, 111)
          </div>
          <div v-if="weakPatterns.isCommon" class="p-2 bg-red-900/20 border-2 border-red-500 pixel-text text-xs text-red-400">
            ⚠ Common password detected
          </div>
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

    <!-- Batch Mode Section -->
    <div class="retro-card p-6 space-y-6">
      <div class="flex items-center justify-between border-b-2 border-retro-border pb-4">
        <h3 class="pixel-text text-sm font-bold text-retro-gray tracking-widest flex items-center gap-2">
          <Layers :size="16" :stroke-width="2.5" /> [BATCH GENERATION]
        </h3>
        <button
          @click="batchMode = !batchMode"
          class="retro-btn pixel-text text-xs"
          :class="batchMode ? 'retro-btn-primary' : ''"
          aria-label="Toggle batch mode"
        >
          {{ batchMode ? '[ENABLED]' : '[DISABLED]' }}
        </button>
      </div>

      <div v-if="batchMode" class="space-y-4">
        <div class="space-y-3">
          <div class="flex justify-between items-center">
            <span class="pixel-text text-sm text-retro-gray">QUANTITY</span>
            <span class="pixel-text text-sm text-retro-green">{{ batchSize }} passwords</span>
          </div>
          <input
            type="range"
            min="2"
            max="20"
            v-model.number="batchSize"
            class="custom-slider"
            aria-label="Batch size"
          >
        </div>

        <button
          @click="handleBatchGenerate"
          class="retro-btn-primary pixel-text py-3 w-full flex items-center justify-center gap-2"
          aria-label="Generate batch of passwords"
        >
          <RefreshCw :size="16" :stroke-width="2.5" />
          <span>[GENERATE {{ batchSize }} PASSWORDS]</span>
        </button>

        <!-- Batch Results -->
        <div v-if="showBatchResults && generatedBatch.length" class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="pixel-text text-xs text-retro-gray tracking-widest">
              [GENERATED PASSWORDS]
            </span>
            <div class="flex gap-2">
              <button
                @click="copyAllBatch"
                class="retro-btn pixel-text text-xs p-2"
                title="Copy all passwords"
              >
                [COPY ALL]
              </button>
              <button
                @click="downloadBatch"
                class="retro-btn pixel-text text-xs p-2"
                title="Download as file"
              >
                [DOWNLOAD]
              </button>
            </div>
          </div>

          <div class="max-h-60 overflow-y-auto space-y-2 editorial-scrollbar">
            <div
              v-for="(pwd, index) in generatedBatch"
              :key="index"
              class="p-3 bg-retro-dim border-2 border-retro-border flex items-center justify-between group hover:border-retro-gray transition-colors"
            >
              <div class="flex items-center gap-3 flex-1 min-w-0">
                <span class="pixel-text text-xs text-retro-gray shrink-0">{{ index + 1 }}.</span>
                <code class="text-sm text-retro-white tracking-widest truncate flex-1">{{ pwd }}</code>
              </div>
              <button
                @click="copyPassword(pwd)"
                class="p-2 text-retro-gray hover:text-retro-green opacity-0 group-hover:opacity-100 focus:opacity-100"
                :aria-label="`Copy password ${index + 1}`"
              >
                <Copy :size="14" :stroke-width="2.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
