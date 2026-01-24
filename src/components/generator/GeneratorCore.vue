<script setup lang="ts">
import { ref, watch } from 'vue'
import { useVaultStore } from '@/stores/vaultStore'
import { useGenerator } from '@/composables/useGenerator'
import { useStrength } from '@/composables/useStrength'
import { 
  Copy, 
  RefreshCcw, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  EyeOff,
  Check,
  Settings2
} from 'lucide-vue-next'
import { useClipboard } from '@vueuse/core'

const store = useVaultStore()
const { generate } = useGenerator()
const { calculate } = useStrength()

const password = ref('')
const isVisible = ref(true)
const strength = ref(calculate(''))

const { copy, copied } = useClipboard()

const handleGenerate = () => {
  password.value = generate(store.config)
  strength.value = calculate(password.value)
  store.addToHistory(password.value)
}

watch(() => store.config, handleGenerate, { deep: true, immediate: true })
</script>

<template>
  <div class="space-y-8">
    <!-- Main Display Card -->
    <div class="glass-morphism p-8 space-y-6">
      <div class="relative group">
        <input 
          :type="isVisible ? 'text' : 'password'" 
          :value="password"
          readonly
          class="w-full bg-vault-bg/50 border-2 border-vault-border rounded-2xl px-6 py-6 text-2xl md:text-3xl font-mono text-center tracking-wider focus:border-vault-primary outline-none transition-all"
        >
        <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
           <button @click="isVisible = !isVisible" class="p-2 text-slate-500 hover:text-white transition-colors">
              <Eye v-if="!isVisible" :size="20" />
              <EyeOff v-else :size="20" />
           </button>
           <button 
             @click="copy(password)" 
             class="p-3 bg-vault-primary text-black rounded-xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-vault-primary/20"
           >
              <Check v-if="copied" :size="20" />
              <Copy v-else :size="20" />
           </button>
        </div>
      </div>

      <!-- Strength Meter -->
      <div class="space-y-3">
        <div class="flex justify-between items-end">
          <span class="text-[10px] font-black uppercase tracking-widest text-slate-500">Security Analysis</span>
          <span class="text-xs font-bold" :class="strength.color.replace('bg-', 'text-')">
            {{ strength.label }} ({{ strength.entropy }} bits)
          </span>
        </div>
        <div class="h-1.5 w-full bg-vault-border rounded-full overflow-hidden flex space-x-1">
          <div 
            v-for="i in 4" :key="i"
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
                type="range" min="4" max="64" 
                v-model.number="store.config.length"
                class="custom-slider"
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
              <input type="checkbox" v-model="store.config.useUppercase" class="hidden peer">
              <div class="w-5 h-5 border-2 border-vault-border rounded-md peer-checked:bg-vault-primary peer-checked:border-vault-primary transition-all flex items-center justify-center">
                 <Check v-if="store.config.useUppercase" :size="12" class="text-black" stroke-width="4" />
              </div>
              <span class="text-xs font-medium text-slate-500 group-hover:text-slate-300">A-Z</span>
           </label>
           <label class="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" v-model="store.config.useLowercase" class="hidden peer">
              <div class="w-5 h-5 border-2 border-vault-border rounded-md peer-checked:bg-vault-primary peer-checked:border-vault-primary transition-all flex items-center justify-center">
                 <Check v-if="store.config.useLowercase" :size="12" class="text-black" stroke-width="4" />
              </div>
              <span class="text-xs font-medium text-slate-500 group-hover:text-slate-300">a-z</span>
           </label>
           <label class="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" v-model="store.config.useNumbers" class="hidden peer">
              <div class="w-5 h-5 border-2 border-vault-border rounded-md peer-checked:bg-vault-primary peer-checked:border-vault-primary transition-all flex items-center justify-center">
                 <Check v-if="store.config.useNumbers" :size="12" class="text-black" stroke-width="4" />
              </div>
              <span class="text-xs font-medium text-slate-500 group-hover:text-slate-300">0-9</span>
           </label>
           <label class="flex items-center space-x-3 cursor-pointer group">
              <input type="checkbox" v-model="store.config.useSymbols" class="hidden peer">
              <div class="w-5 h-5 border-2 border-vault-border rounded-md peer-checked:bg-vault-primary peer-checked:border-vault-primary transition-all flex items-center justify-center">
                 <Check v-if="store.config.useSymbols" :size="12" class="text-black" stroke-width="4" />
              </div>
              <span class="text-xs font-medium text-slate-500 group-hover:text-slate-300">#&!</span>
           </label>
        </div>
      </div>
    </div>

    <button 
      @click="handleGenerate"
      class="w-full bg-white text-black py-5 rounded-2xl font-black uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-vault-primary transition-all active:scale-[0.98]"
    >
       <RefreshCcw :size="20" />
       <span>Regenerate Vault Key</span>
    </button>
  </div>
</template>
