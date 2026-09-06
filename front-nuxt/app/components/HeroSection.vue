<template>
  <section class="relative w-full min-h-[520px] flex flex-col items-center justify-between overflow-hidden bg-barber-black">

    <!-- Background Image with Multi-layer Overlay -->
    <div class="absolute inset-0 z-0">
      <picture>
        <source media="(max-width: 640px) and (orientation: portrait)" srcset="/bg_vertical_mobile.webp">
        <source media="(orientation: landscape)" srcset="/bg_horizontal.webp">
        <img
          src="/bg_vertical.webp"
          alt="Fondo de la barbería PersonalBarber"
          class="w-full h-full object-cover object-top filter brightness-40"
          fetchpriority="high"
          width="1920"
          height="1080"
          decoding="async"
        />
      </picture>
      <!-- Deep vignette bottom fade into the rest of the page -->
      <div class="absolute inset-0 bg-gradient-to-b from-barber-black/30 via-transparent to-barber-black"></div>
      <!-- Side vignettes for depth -->
      <div class="absolute inset-0 bg-gradient-to-r from-barber-black/60 via-transparent to-barber-black/40"></div>
    </div>

    <!-- Ambient neon glow -->
    <div class="absolute top-1/2 left-1/4 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[500px] bg-neon-green/8 rounded-full blur-[120px] pointer-events-none z-0"></div>

    <!-- ─── Main Content ─── -->
    <div class="relative z-10 w-full flex-1 container mx-auto px-6 pt-20 pb-8 lg:pt-20 flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 lg:gap-16">

      <!-- Left Column: Massive Typography -->
      <div class="w-full lg:w-3/5 text-center lg:text-left z-20 flex flex-col items-center lg:items-start">

        <!-- Live badge -->
        <div class="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-neon-green/30 bg-neon-green/5 backdrop-blur-sm animate-fade-in-up opacity-0" style="animation-delay:0.05s">
          <span class="w-2 h-2 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.8)]"></span>
          <span class="text-neon-green text-[10px] font-black tracking-[0.22em] uppercase">{{ t('hero.badge') }}</span>
        </div>

        <h1 class="text-[3rem] leading-[0.9] sm:text-[4.5rem] lg:text-[110px] xl:text-[135px] font-black lg:leading-[0.9] tracking-tighter italic animate-fade-in-up opacity-0 text-shadow-premium" style="animation-delay:0.1s">
          <span class="text-neon-green block drop-shadow-[0_0_20px_rgba(57,255,20,0.4)]">{{ t('hero.line1') }}</span>
          <span class="text-white block">{{ t('hero.line2') }}</span>
          <span class="text-white block pt-4">{{ t('hero.line3') }}</span>
        </h1>

        <p class="text-base sm:text-xl lg:text-2xl text-gray-400 mt-6 mb-10 font-medium max-w-xl mx-auto lg:mx-0 animate-fade-in-up opacity-0 leading-relaxed" style="animation-delay: 0.2s;">
          <span class="text-white font-bold">PersonalBarber</span> — {{ t('hero.subtitle') }}
          <span class="text-neon-green font-bold"> {{ t('hero.subtitleHighlight') }}</span>.
        </p>

        <!-- CTAs -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up opacity-0" style="animation-delay: 0.35s;">
          <button
            @click="$emit('reserve')"
            class="group px-10 py-4 bg-neon-green hover:bg-neon-green-dark text-black text-base lg:text-lg font-black italic tracking-wider rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(57,255,20,0.35)] hover:shadow-[0_0_60px_rgba(46,255,46,0.75)] hover:-translate-y-1 hover:scale-105 uppercase flex items-center justify-center gap-3"
          >
            {{ t('hero.cta1') }}
            <fa-icon :icon="['fas', 'calendar-check']" class="transition-transform duration-300 group-hover:rotate-12" />
          </button>
          <button
            @click="scrollToProducts"
            class="group px-10 py-4 bg-white/5 backdrop-blur-sm border-2 border-white/25 hover:border-white/70 text-white text-base lg:text-lg font-black italic tracking-wider rounded-2xl transition-all duration-300 hover:bg-white/10 hover:scale-105 uppercase flex items-center justify-center gap-3"
          >
            {{ t('hero.cta2') }}
            <fa-icon :icon="['fas', 'shopping-bag']" class="transition-transform duration-300 group-hover:scale-110" />
          </button>
        </div>

        <!-- Trust bar -->
        <div class="flex flex-wrap items-center gap-3 mt-10 animate-fade-in-up opacity-0" style="animation-delay:0.5s">
          <!-- Clients pill -->
          <div class="flex items-center gap-2 px-4 py-2 rounded-full border border-neon-green/25 bg-neon-green/5">
            <span class="text-neon-green font-black text-sm">+50</span>
            <span class="text-gray-400 text-xs font-medium tracking-wide">{{ t('hero.trustClients') }}</span>
          </div>
          <!-- Divider dot -->
          <span class="text-white/15 text-xs">•</span>
          <!-- Rating pill -->
          <div class="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
            <span class="text-yellow-400 text-xs tracking-tight">★★★★★</span>
            <span class="text-white text-xs font-black">5.0</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Profile Card (Redesigned) -->
      <div class="hidden lg:block w-full max-w-[320px] lg:max-w-[380px] relative animate-fade-in-up opacity-0 z-20 flex-shrink-0" style="animation-delay: 0.55s;">
        <!-- Multi-layer glow -->
        <div class="absolute -inset-6 bg-neon-green/10 rounded-[50px] blur-3xl"></div>
        <div class="absolute inset-0 bg-neon-green rounded-[40px] translate-x-3 translate-y-3 opacity-20 blur-md"></div>

        <div class="relative bg-zinc-900/70 backdrop-blur-2xl p-7 lg:p-10 rounded-[40px] border border-white/10 flex flex-col items-center gap-5 shadow-2xl">

          <!-- Top stats bar -->
          <div class="w-full flex items-center justify-between text-[10px] font-black tracking-widest uppercase pb-4 border-b border-white/8">
            <span class="text-gray-500">Master Barber</span>
            <span class="text-neon-green bg-neon-green/10 border border-neon-green/20 px-3 py-1 rounded-full">Premium</span>
          </div>

          <!-- Photo -->
          <div class="w-36 h-36 lg:w-44 lg:h-44 rounded-[28px] border-[3px] border-neon-green p-1 overflow-hidden shadow-[0_0_40px_rgba(57,255,20,0.25)] bg-black">
            <img src="/Profile_Andres_H.webp" alt="Andrés Hernández — Master Barber Medellín" class="w-full h-full object-cover rounded-[22px]" />
          </div>

          <div class="text-center">
            <h2 class="sr-only">{{ t('hero.srHeadline') }}</h2>
            <p class="text-3xl lg:text-4xl font-black italic text-white tracking-wide uppercase" aria-hidden="true">ANDRÉS H.</p>
            <p class="text-neon-green text-sm font-bold tracking-widest uppercase mt-1">Master Barber · Medellín</p>
          </div>

          <!-- Social icons -->
          <div class="flex gap-3 w-full justify-center">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.link"
              target="_blank"
              rel="noopener noreferrer"
              class="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-neon-green hover:border-neon-green text-white hover:text-black text-xl transition-all duration-300 hover:scale-110"
              :aria-label="social.name"
            >
              <fa-icon :icon="social.icon" />
            </a>
          </div>

          <!-- Bottom availability -->
          <div class="w-full flex items-center gap-3 bg-neon-green/5 border border-neon-green/20 rounded-2xl px-4 py-3">
            <span class="w-2.5 h-2.5 rounded-full bg-neon-green animate-pulse shadow-[0_0_8px_rgba(57,255,20,0.8)] flex-shrink-0"></span>
            <p class="text-[11px] text-gray-300 font-medium tracking-wide">
              <span class="text-neon-green font-black">{{ t('hero.available') }}</span> {{ t('hero.availableText') }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Scroll Indicator — flows at the BOTTOM of the flex column, never overlaps buttons ─── -->
    <div class="relative z-10 w-full flex justify-center pb-5 pt-2 pointer-events-none">
      <div class="flex flex-col items-center gap-1.5 animate-bounce">
        <span class="text-[9px] text-white/25 font-black tracking-[0.3em] uppercase">Scroll</span>
        <div class="w-[1px] h-8 bg-gradient-to-b from-white/25 to-transparent rounded-full"></div>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { useLanguage } from '~/composables/useLanguage'

const { t } = useLanguage()

const socials = [
  { name: 'WhatsApp', icon: ['fab', 'whatsapp'], link: 'https://api.whatsapp.com/send?phone=573337518070' },
  { name: 'TikTok', icon: ['fab', 'tiktok'], link: 'https://www.tiktok.com/@pipehpbarber' },
  { name: 'Instagram', icon: ['fab', 'instagram'], link: 'https://www.instagram.com/personalbarber.co/' },
]

const emit = defineEmits<{ reserve: [] }>()

function scrollToProducts() {
  const el = document.getElementById('tienda')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
}
</style>
