<script setup lang="ts">
import { useVaultStore } from '@/stores/vaultStore'
import { History, Trash2, Clock, Shield, RefreshCcw } from 'lucide-vue-next'
import type { GeneratedHistory } from '@/types'

const store = useVaultStore()

const formatTime = (ts: number) => {
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(ts)
}

const restoreFromHistory = (item: GeneratedHistory) => {
  // Copy the password back to clipboard
  navigator.clipboard.writeText(item.value)
}

const clearHistory = () => {
  store.history = []
}
</script>

<template>
  <div class="retro-card p-6 space-y-6">
    <div class="flex items-center justify-between border-b-2 border-retro-border pb-4">
      <h3 class="pixel-text text-sm font-bold text-retro-gray tracking-widest flex items-center gap-2">
        <History :size="16" :stroke-width="2.5" /> [SESSION LOG]
      </h3>
      <button
        v-if="store.history.length"
        @click="clearHistory"
        class="pixel-text text-xs text-red-500 hover:text-red-400 uppercase"
        aria-label="Clear all history"
      >
        [CLEAR]
      </button>
    </div>

    <div class="space-y-3" role="list" aria-label="Password generation history">
      <div
        v-for="item in store.history"
        :key="item.id"
        class="p-3 bg-retro-dim border-2 border-retro-border flex items-center justify-between group hover:border-retro-gray transition-colors"
        role="listitem"
      >
        <div class="flex items-center gap-3">
           <div class="p-2 bg-retro-black border border-retro-border text-retro-gray" aria-hidden="true">
              <Shield :size="14" :stroke-width="2.5" />
           </div>
           <div class="space-y-1">
              <p class="pixel-text text-sm text-retro-white tracking-widest">••••••••••••</p>
              <div class="flex items-center gap-2 text-xs text-retro-gray pixel-text">
                 <Clock :size="10" :stroke-width="2.5" />
                 <span>{{ formatTime(item.timestamp) }}</span>
              </div>
           </div>
        </div>
        <button
          @click="restoreFromHistory(item)"
          class="p-2 text-retro-gray hover:text-retro-green transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Restore password from history"
          title="Copy to clipboard"
        >
           <RefreshCcw :size="14" :stroke-width="2.5" />
        </button>
      </div>

      <div v-if="!store.history.length" class="text-center py-8 border-2 border-dashed border-retro-border">
         <History :size="32" :stroke-width="1.5" class="mx-auto mb-3 text-retro-gray opacity-50" />
         <p class="pixel-text text-xs text-retro-gray uppercase tracking-widest">No passwords generated yet</p>
      </div>
    </div>
  </div>
</template>
