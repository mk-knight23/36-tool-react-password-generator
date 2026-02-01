<script setup lang="ts">
import GeneratorCore from './components/generator/GeneratorCore.vue'
import AuditLog from './components/history/AuditLog.vue'
import SettingsPanel from './components/ui/SettingsPanel.vue'
import ToastContainer from './components/ui/ToastContainer.vue'
import { Shield, Github, Keyboard } from 'lucide-vue-next'
import { useSettingsStore } from './stores/settings'
import { useStatsStore } from './stores/stats'
import { useAudio } from './composables/useAudio'
import { useToast } from './composables/useToast'

const settingsStore = useSettingsStore()
const statsStore = useStatsStore()
const audio = useAudio()
const toast = useToast()

function openSettings() {
  audio.playClick()
  statsStore.recordSettingsOpen()
}

function recordClick() {
  statsStore.recordClick()
}
</script>

<template>
  <div
    class="max-w-4xl mx-auto px-4 py-8 scanlines"
    :class="{ 'dark': settingsStore.isDarkMode, 'light': !settingsStore.isDarkMode }"
  >
    <!-- Retro Header -->
    <header class="mb-8 pb-6 border-b-2 border-retro">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <!-- ASCII-style Logo -->
          <div class="retro-card p-3 bg-retro-green">
            <Shield :size="24" :stroke-width="2.5" class="text-retro-black" />
          </div>
          <div>
            <h1 class="pixel-text text-3xl font-bold tracking-wider">
              VAULT<span class="text-retro-green">PASS</span>
            </h1>
            <p class="pixel-text text-xs text-retro-gray tracking-widest mt-1">
              PASSWORD GENERATOR v2.0
            </p>
          </div>
        </div>

        <!-- Header Actions -->
        <div class="flex items-center gap-3">
          <button
            @click="openSettings"
            @click.capture="recordClick"
            class="retro-btn"
            aria-label="Settings"
          >
            <Keyboard :size="18" :stroke-width="2.5" />
          </button>
          <a
            href="https://github.com/mk-knight23/36-tool-react-password-generator"
            target="_blank"
            rel="noopener noreferrer"
            class="retro-btn"
            aria-label="View source on GitHub"
          >
            <Github :size="18" :stroke-width="2.5" />
          </a>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <div class="mb-8 text-center retro-card p-6">
      <h2 class="pixel-text text-4xl md:text-5xl font-bold mb-4">
        <span class="text-retro-green">></span> SECURE PASSWORD
        <span class="cursor-blink">_</span>
      </h2>
      <p class="pixel-text text-base text-retro-gray max-w-md mx-auto">
        Cryptographically secure generation using browser's native crypto API.
        No data transmitted. No storage. PURE SECURITY.
      </p>
    </div>

    <!-- Main Content -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Generator (Main) -->
      <div class="lg:col-span-2 space-y-6">
        <GeneratorCore @click.capture="recordClick" />
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Security Notice -->
        <div class="retro-card p-4">
          <h3 class="pixel-text text-sm font-bold text-retro-green mb-3 flex items-center gap-2">
            <span class="text-retro-green">[+]</span> SECURITY PROTOCOL
          </h3>
          <p class="pixel-text text-sm leading-relaxed text-retro-gray">
            Generated locally using Web Crypto API. Nothing leaves your browser.
            No cookies. No tracking. Just math.
          </p>
        </div>

        <!-- History -->
        <AuditLog @click.capture="recordClick" />
      </div>
    </div>

    <!-- Footer -->
    <footer class="mt-12 pt-6 border-t-2 border-retro text-center">
      <p class="pixel-text text-xs text-retro-gray tracking-widest">
        Made by MK — Musharraf Kazi
      </p>
      <p class="pixel-text text-xs text-retro-gray tracking-widest mt-1">
        (C) 2026 VAULTPASS SYSTEMS
      </p>
    </footer>

    <SettingsPanel />
    <ToastContainer />
  </div>
</template>

<style>
kbd {
  @apply px-2 py-1 text-xs pixel-text bg-retro-dim border-2 border-retro;
}
</style>
