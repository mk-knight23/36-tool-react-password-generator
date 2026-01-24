import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { STORAGE_KEYS } from '../utils/constants'

interface StatsState {
  visits: number
  lastVisit: string
  totalClicks: number
  passwordsGenerated: number
  totalPasswordsCopied: number
  themeSwitches: number
  settingsOpened: number
  keyboardShortcutsUsed: number
}

const INITIAL_STATS: StatsState = {
  visits: 0,
  lastVisit: '',
  totalClicks: 0,
  passwordsGenerated: 0,
  totalPasswordsCopied: 0,
  themeSwitches: 0,
  settingsOpened: 0,
  keyboardShortcutsUsed: 0
}

export const useStatsStore = defineStore('stats', () => {
  const stats = ref<StatsState>(INITIAL_STATS)

  const statsSummary = computed(() => {
    const s = stats.value
    return {
      totalVisits: s.visits,
      totalClicks: s.totalClicks,
      passwordsGenerated: s.passwordsGenerated,
      passwordsCopied: s.totalPasswordsCopied,
      themeSwitches: s.themeSwitches,
      shortcutsUsed: s.keyboardShortcutsUsed
    }
  })

  function loadStats() {
    const stored = localStorage.getItem(STORAGE_KEYS.STATS)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        stats.value = { ...INITIAL_STATS, ...parsed }
      } catch {
        stats.value = INITIAL_STATS
      }
    }
  }

  function recordVisit() {
    const now = new Date().toISOString()
    stats.value.visits++
    stats.value.lastVisit = now
  }

  function recordClick() {
    stats.value.totalClicks++
  }

  function recordPasswordGenerated() {
    stats.value.passwordsGenerated++
  }

  function recordPasswordCopied() {
    stats.value.totalPasswordsCopied++
  }

  function recordThemeSwitch() {
    stats.value.themeSwitches++
  }

  function recordSettingsOpen() {
    stats.value.settingsOpened++
  }

  function recordKeyboardShortcut() {
    stats.value.keyboardShortcutsUsed++
  }

  function exportStats() {
    return JSON.stringify(stats.value, null, 2)
  }

  function resetStats() {
    stats.value = INITIAL_STATS
  }

  watch(stats, (newStats) => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(newStats))
  }, { deep: true })

  return {
    stats,
    statsSummary,
    loadStats,
    recordVisit,
    recordClick,
    recordPasswordGenerated,
    recordPasswordCopied,
    recordThemeSwitch,
    recordSettingsOpen,
    recordKeyboardShortcut,
    exportStats,
    resetStats
  }
})
