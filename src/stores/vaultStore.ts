import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import type { PasswordConfig } from '../types'

export const useVaultStore = defineStore('vault', {
  state: () => ({
    config: useLocalStorage<PasswordConfig>('vault-config', {
      length: 16,
      useUppercase: true,
      useLowercase: true,
      useNumbers: true,
      useSymbols: true,
      excludeSimilar: false,
    }),
    history: useLocalStorage<any[]>('vault-history', []),
  }),
  actions: {
    updateConfig(newConfig: Partial<PasswordConfig>) {
      this.config = { ...this.config, ...newConfig }
    },
    addToHistory(password: string) {
      this.history.unshift({
        id: crypto.randomUUID(),
        value: password,
        timestamp: Date.now()
      })
      if (this.history.length > 10) this.history.pop()
    }
  }
})
