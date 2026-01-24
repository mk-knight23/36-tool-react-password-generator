import { onMounted, onUnmounted } from 'vue'

export interface KeyboardActions {
  onGenerate?: () => void
  onCopy?: () => void
  onToggleVisibility?: () => void
  onToggleTheme?: () => void
}

export function useKeyboard(actions: KeyboardActions) {
  const handleKeydown = (e: KeyboardEvent) => {
    // Ignore if user is typing in an input
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
      return
    }

    // Cmd/Ctrl + Enter = Generate new password
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      actions.onGenerate?.()
    }

    // Cmd/Ctrl + C = Copy password
    if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
      if (document.activeElement instanceof HTMLInputElement) {
        return // Let native copy happen
      }
      e.preventDefault()
      actions.onCopy?.()
    }

    // Ctrl/Cmd + D = Toggle dark/light mode
    if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
      e.preventDefault()
      actions.onToggleTheme?.()
    }

    // Space = Toggle visibility
    if (e.key === ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault()
      actions.onToggleVisibility?.()
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
  })
}
