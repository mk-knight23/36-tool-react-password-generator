<script setup lang="ts">
import { useToast } from '@/composables/useToast'
import { Check, X, AlertCircle, Info } from 'lucide-vue-next'

const { toasts, remove } = useToast()

const getIcon = (type: string) => {
  switch (type) {
    case 'success': return Check
    case 'error': return X
    case 'info': return Info
    default: return Info
  }
}

const getColors = (type: string) => {
  switch (type) {
    case 'success': return 'border-retro-green text-retro-green bg-retro-green/10'
    case 'error': return 'border-red-500 text-red-500 bg-red-500/10'
    case 'info': return 'border-retro-cyan text-retro-cyan bg-retro-cyan/10'
    default: return 'border-retro-gray text-retro-gray bg-retro-dim'
  }
}
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <TransitionGroup
        name="toast"
        tag="div"
        class="flex flex-col gap-2"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="pointer-events-auto retro-card p-4 flex items-center gap-3 min-w-[300px] max-w-md"
          :class="getColors(toast.type)"
        >
          <component :is="getIcon(toast.type)" :size="18" :stroke-width="2.5" class="shrink-0" />
          <span class="pixel-text text-sm flex-1">{{ toast.message }}</span>
          <button
            @click="remove(toast.id)"
            class="p-1 hover:bg-retro-black/20 rounded transition-colors"
            :aria-label="'Dismiss notification'"
          >
            <X :size="14" :stroke-width="2.5" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>
