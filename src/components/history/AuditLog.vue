<script setup lang="ts">
import { useVaultStore } from '@/stores/vaultStore'
import { History, Trash2, Clock, Shield } from 'lucide-vue-next'

const store = useVaultStore()

const formatTime = (ts: number) => {
  return new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(ts)
}
</script>

<template>
  <div class="glass-morphism p-8 space-y-8">
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-black uppercase tracking-[0.2em] text-slate-400 flex items-center">
        <History class="mr-2" :size="16" /> Audit Log
      </h3>
      <button 
        v-if="store.history.length" 
        @click="store.history = []"
        class="text-[10px] font-black uppercase text-red-500 hover:underline"
      >
        Purge
      </button>
    </div>

    <div class="space-y-4">
      <div v-for="item in store.history" :key="item.id" class="p-4 bg-vault-bg/40 rounded-2xl border border-vault-border flex items-center justify-between group transition-all hover:bg-vault-bg">
        <div class="flex items-center space-x-4">
           <div class="p-2 bg-slate-800 rounded-lg text-slate-500">
              <Shield :size="14" />
           </div>
           <div class="space-y-0.5">
              <p class="text-sm font-mono tracking-wider text-slate-300">••••••••••••</p>
              <div class="flex items-center space-x-2 text-[10px] text-slate-600 font-bold uppercase tracking-tighter">
                 <Clock :size="10" />
                 <span>{{ formatTime(item.timestamp) }}</span>
              </div>
           </div>
        </div>
        <button class="p-2 text-slate-700 hover:text-vault-primary transition-colors opacity-0 group-hover:opacity-100">
           <RefreshCcw :size="14" />
        </button>
      </div>

      <div v-if="!store.history.length" class="text-center py-10 space-y-4 opacity-30">
         <History :size="48" class="mx-auto text-slate-600" />
         <p class="text-[10px] font-black uppercase tracking-[0.3em]">No keys generated in this session</p>
      </div>
    </div>
  </div>
</template>
