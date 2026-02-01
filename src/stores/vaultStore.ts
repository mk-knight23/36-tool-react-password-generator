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
    batchSize: 1,
  }),
  actions: {
    updateConfig(newConfig: Partial<PasswordConfig>) {
      this.config = { ...this.config, ...newConfig }
    },
    addToHistory(password: string, note?: string) {
      this.history.unshift({
        id: crypto.randomUUID(),
        value: password,
        timestamp: Date.now(),
        note
      })
      if (this.history.length > 50) this.history.pop() // Increased from 10 to 50
    },
    updateNote(id: string, note: string) {
      const entry = this.history.find(h => h.id === id)
      if (entry) entry.note = note
    },
    clearHistory() {
      this.history = []
    },
    exportHistory() {
      const data = {
        version: '2.1.0',
        exportDate: new Date().toISOString(),
        passwords: this.history
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `vaultpass-backup-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    },
    setBatchSize(size: number) {
      this.batchSize = size
    }
  }
})
