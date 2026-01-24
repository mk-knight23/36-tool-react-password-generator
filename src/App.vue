<script setup lang="ts">
import GeneratorCore from './components/generator/GeneratorCore.vue'
import AuditLog from './components/history/AuditLog.vue'
import { ShieldCheck, Github, Zap } from 'lucide-vue-next'
</script>

<template>
  <div class="max-w-6xl mx-auto px-6 py-12 lg:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
    <!-- Header/Intro -->
    <div class="lg:col-span-12 space-y-4 mb-8">
       <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
             <div class="w-12 h-12 bg-vault-primary rounded-2xl flex items-center justify-center text-black shadow-xl shadow-vault-primary/20 rotate-3">
                <ShieldCheck :size="28" />
             </div>
             <h1 class="text-3xl font-display font-black tracking-tighter uppercase">Vault<span class="text-vault-primary font-light italic">Pass</span></h1>
          </div>
          <div class="flex items-center space-x-6">
             <a href="https://github.com/mk-knight23/51-Password-Generator-React" target="_blank" class="text-slate-500 hover:text-white transition-colors">
                <Github :size="20" />
             </a>
          </div>
       </div>
    </div>

    <!-- Main Content -->
    <div class="lg:col-span-8 space-y-12">
       <div class="space-y-4">
          <h2 class="text-5xl md:text-7xl font-display font-black tracking-tighter leading-none uppercase text-white">
             Secure Your <br />
             <span class="text-vault-primary italic underline decoration-8 decoration-vault-primary/10">Presence</span>
          </h2>
          <p class="text-slate-500 font-medium text-lg max-w-xl">Cryptographically secure password generation with entropy-driven security assessment.</p>
       </div>

       <GeneratorCore />
    </div>

    <!-- Sidebar -->
    <div class="lg:col-span-4 space-y-12">
       <div class="p-8 bg-indigo-600 rounded-[2.5rem] text-white space-y-6 shadow-2xl shadow-indigo-600/20 relative overflow-hidden group">
          <div class="absolute -top-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full group-hover:scale-150 transition-transform duration-1000"></div>
          <div class="relative z-10 space-y-4">
             <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap :size="20" />
             </div>
             <h4 class="text-xl font-display font-black uppercase tracking-tight">Security Protocol</h4>
             <p class="text-sm font-medium text-indigo-100 leading-relaxed italic">Generated locally in your browser. No data ever leaves your device. Perfect for enterprise-grade security.</p>
          </div>
       </div>

       <AuditLog />
    </div>

    <!-- Footer -->
    <footer class="lg:col-span-12 pt-20 border-t border-vault-border flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">
       <p>© 2026 VaultPass Systems. Architecture by Staff Engineering.</p>
       <div class="flex gap-10">
          <a href="#" class="hover:text-vault-primary transition-colors">Crypto Algorithm</a>
          <a href="#" class="hover:text-vault-primary transition-colors">Privacy Shield</a>
       </div>
    </footer>
  </div>
</template>
