import { ref } from 'vue'

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export function useToast() {
  const toasts = ref<Toast[]>([])
  let toastIdCounter = 0

  const show = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${++toastIdCounter}`
    toasts.value.push({ id, message, type })

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 3000)
  }

  const success = (message: string) => show(message, 'success')
  const error = (message: string) => show(message, 'error')
  const info = (message: string) => show(message, 'info')

  const remove = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    show,
    success,
    error,
    info,
    remove
  }
}
