<script setup lang="ts">
import { useVaultStore } from '@/stores/vaultStore'
import { History, Trash2, Clock, Shield, RefreshCcw, StickyNote, Search, Filter } from 'lucide-vue-next'
import type { GeneratedHistory } from '@/types'
import { ref, computed } from 'vue'

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

// Editing note state
const editingId = ref<string | null>(null)
const editingNote = ref('')

const startEdit = (item: GeneratedHistory) => {
  editingId.value = item.id
  editingNote.value = item.note || ''
}

const saveNote = (item: GeneratedHistory) => {
  store.updateNote(item.id, editingNote.value)
  editingId.value = null
}

const cancelEdit = () => {
  editingId.value = null
  editingNote.value = ''
}

// Search and filter state
const searchQuery = ref('')
const filterBy = ref<'all' | 'withNotes' | 'recent'>('all')

// Computed filtered history
const filteredHistory = computed(() => {
  let filtered = store.history

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(item =>
      (item.note && item.note.toLowerCase().includes(query)) ||
      item.value.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (filterBy.value === 'withNotes') {
    filtered = filtered.filter(item => item.note && item.note.length > 0)
  } else if (filterBy.value === 'recent') {
    // Last hour only
    const oneHourAgo = Date.now() - (60 * 60 * 1000)
    filtered = filtered.filter(item => item.timestamp > oneHourAgo)
  }

  return filtered
})

const historyCount = computed(() => filteredHistory.value.length)
</script>

<template>
  <div class="retro-card p-6 space-y-6">
    <div class="flex items-center justify-between border-b-2 border-retro-border pb-4">
      <h3 class="pixel-text text-sm font-bold text-retro-gray tracking-widest flex items-center gap-2">
        <History :size="16" :stroke-width="2.5" /> [SESSION LOG] ({{ historyCount }})
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

    <!-- Search and Filter Controls -->
    <div v-if="store.history.length" class="space-y-3">
      <div class="relative">
        <Search :size="14" :stroke-width="2.5" class="absolute left-3 top-1/2 -translate-y-1/2 text-retro-gray" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search passwords or notes..."
          class="retro-input w-full pl-10 text-sm"
          aria-label="Search password history"
        >
      </div>
      <div class="flex gap-2">
        <button
          @click="filterBy = 'all'"
          class="retro-btn pixel-text text-xs"
          :class="filterBy === 'all' ? 'retro-btn-primary' : ''"
          aria-label="Show all passwords"
        >
          [ALL]
        </button>
        <button
          @click="filterBy = 'withNotes'"
          class="retro-btn pixel-text text-xs"
          :class="filterBy === 'withNotes' ? 'retro-btn-primary' : ''"
          aria-label="Show passwords with notes"
        >
          [WITH NOTES]
        </button>
        <button
          @click="filterBy = 'recent'"
          class="retro-btn pixel-text text-xs"
          :class="filterBy === 'recent' ? 'retro-btn-primary' : ''"
          aria-label="Show recent passwords"
        >
          [RECENT]
        </button>
      </div>
    </div>

    <div class="space-y-3" role="list" aria-label="Password generation history">
      <div
        v-for="item in filteredHistory"
        :key="item.id"
        class="p-3 bg-retro-dim border-2 border-retro-border flex items-center justify-between group hover:border-retro-gray transition-colors"
        role="listitem"
      >
        <div class="flex items-center gap-3 flex-1 min-w-0">
           <div class="p-2 bg-retro-black border border-retro-border text-retro-gray shrink-0" aria-hidden="true">
              <Shield :size="14" :stroke-width="2.5" />
           </div>
           <div class="space-y-1 flex-1 min-w-0">
              <p class="pixel-text text-sm text-retro-white tracking-widest truncate">••••••••••••</p>

              <!-- Note display -->
              <div v-if="editingId === item.id" class="flex items-center gap-2">
                <input
                  v-model="editingNote"
                  @keyup.enter="saveNote(item)"
                  @keyup.escape="cancelEdit"
                  class="retro-input text-xs px-2 py-1 flex-1"
                  placeholder="Add note..."
                  maxlength="50"
                  autofocus
                >
                <button
                  @click="saveNote(item)"
                  class="pixel-text text-xs text-retro-green hover:text-retro-white"
                >
                  [SAVE]
                </button>
                <button
                  @click="cancelEdit"
                  class="pixel-text text-xs text-retro-gray hover:text-retro-white"
                >
                  [CANCEL]
                </button>
              </div>
              <div v-else-if="item.note" class="flex items-center gap-2 text-xs text-retro-cyan pixel-text">
                <StickyNote :size="10" :stroke-width="2.5" />
                <span class="truncate">{{ item.note }}</span>
              </div>

              <div class="flex items-center gap-3 text-xs text-retro-gray pixel-text">
                 <Clock :size="10" :stroke-width="2.5" />
                 <span>{{ formatTime(item.timestamp) }}</span>
                 <button
                   v-if="editingId !== item.id"
                   @click="startEdit(item)"
                   class="hover:text-retro-green transition-colors"
                   aria-label="Edit note"
                 >
                   [EDIT NOTE]
                 </button>
              </div>
           </div>
        </div>
        <button
          @click="restoreFromHistory(item)"
          class="p-2 text-retro-gray hover:text-retro-green transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
          aria-label="Restore password from history"
          title="Copy to clipboard"
        >
           <RefreshCcw :size="14" :stroke-width="2.5" />
        </button>
      </div>

      <div v-if="!filteredHistory.length && store.history.length" class="text-center py-8 border-2 border-dashed border-retro-border">
         <Search :size="32" :stroke-width="1.5" class="mx-auto mb-3 text-retro-gray opacity-50" />
         <p class="pixel-text text-xs text-retro-gray uppercase tracking-widest">No passwords match your search</p>
      </div>

      <div v-else-if="!store.history.length" class="text-center py-8 border-2 border-dashed border-retro-border">
         <History :size="32" :stroke-width="1.5" class="mx-auto mb-3 text-retro-gray opacity-50" />
         <p class="pixel-text text-xs text-retro-gray uppercase tracking-widest">No passwords generated yet</p>
      </div>
    </div>
  </div>
</template>
