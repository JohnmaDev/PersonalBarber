<template>
  <section class="relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden bg-barber-black py-20 lg:py-0">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <picture>
        <!-- Landscape -->
        <source media="(orientation: landscape)" srcset="/bg_horizontal.webp">
        <!-- Default portrait -->
        <img
          src="/bg_vertical.webp"
          alt="Fondo de la barbería PersonalBarber"
          class="w-full h-full object-cover object-top filter brightness-50"
          fetchpriority="high"
        />
      </picture>
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-barber-black/60 to-barber-black"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-6 h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between pt-10 lg:pt-0">

      <!-- Massive Typography Left Column -->
      <div class="w-full lg:w-3/5 text-center lg:text-left z-20 mt-12 lg:mt-0 flex flex-col items-center lg:items-start">
        <h1 class="text-[3rem] leading-tight sm:text-[4.5rem] lg:text-[120px] xl:text-[145px] font-black lg:leading-tight tracking-tighter italic uppercase animate-fade-in-up opacity-0 text-shadow-premium">
          <span class="text-neon-green block drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">TU ESTILO.</span>
          <span class="text-white block">TU BARBERO.</span>
          <span class="text-white block">MEDELLÍN.</span>
        </h1>
        <p class="text-lg sm:text-2xl lg:text-3xl text-gray-300 mt-8 mb-10 font-bold max-w-2xl mx-auto lg:mx-0 animate-fade-in-up opacity-0" style="animation-delay: 0.2s;">
          <span class="text-white">PersonalBarber</span> — Donde la excelencia es el estándar. Reserva tu cita y <span class="text-neon-green">refleja tu mejor versión</span>.
        </p>

        <div class="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-fade-in-up opacity-0" style="animation-delay: 0.4s;">
          <button
            @click="$emit('reserve')"
            class="px-10 py-5 bg-neon-green hover:bg-neon-green-dark text-black text-xl lg:text-2xl font-black italic tracking-wider rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:shadow-[0_0_60px_rgba(46,255,46,0.8)] hover:-translate-y-1 hover:scale-105 uppercase flex items-center justify-center gap-3"
          >
            RESERVAR AHORA <fa-icon :icon="['fas', 'calendar-check']" />
          </button>
          <button
            @click="scrollToProducts"
            class="px-10 py-5 bg-transparent border-4 border-white/20 hover:border-white text-white text-xl lg:text-2xl font-black italic tracking-wider rounded-2xl transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] uppercase flex items-center justify-center gap-3"
          >
            LA TIENDA <fa-icon :icon="['fas', 'shopping-bag']" />
          </button>
        </div>
      </div>

      <!-- Brutalist Profile Card Right Column -->
      <div class="mt-16 lg:mt-0 w-full max-w-sm lg:max-w-md relative animate-fade-in-up opacity-0 z-20" style="animation-delay: 0.6s;">
        <!-- Brutalist offset border effect -->
        <div class="absolute inset-0 bg-neon-green rounded-[40px] translate-x-4 translate-y-4 opacity-30 blur-sm"></div>

        <div class="relative bg-barber-charcoal/90 backdrop-blur-2xl p-8 lg:p-12 rounded-[40px] border border-white/10 flex flex-col items-center gap-6 shadow-2xl">
          <div class="w-40 h-40 lg:w-48 lg:h-48 rounded-[30px] border-4 border-neon-green p-1.5 overflow-hidden shadow-[0_0_30px_rgba(57,255,20,0.2)] bg-black">
            <img src="/Profile_Andres_H.webp" alt="Andrés Hernández — Master Barber Medellín" class="w-full h-full object-cover rounded-[22px]" />
          </div>
          <div class="text-center">
            <!-- H2 oculto visualmente para SEO -->
            <h2 class="sr-only">Barbería Premium en Medellín — Cortes Exclusivos y Reservas Online</h2>
            <p class="text-4xl lg:text-5xl font-black italic text-white tracking-wide uppercase" aria-hidden="true">ANDRÉS H.</p>
            <p class="text-neon-green text-lg lg:text-xl font-bold tracking-widest uppercase mt-2">Master Barber · Medellín</p>
          </div>
          <div class="flex gap-4 w-full justify-center">
            <a
              v-for="social in socials"
              :key="social.name"
              :href="social.link"
              target="_blank"
              rel="noopener noreferrer"
              class="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-neon-green hover:border-neon-green text-white hover:text-black font-bold text-2xl lg:text-3xl transition-all duration-300"
              :aria-label="social.name"
            >
              <fa-icon :icon="social.icon" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
      <fa-icon :icon="['fas', 'chevron-down']" class="text-white/50 text-2xl" />
    </div>
  </section>
</template>

<script setup lang="ts">
const socials = [
  { name: 'WhatsApp', icon: ['fab', 'whatsapp'], link: 'https://api.whatsapp.com/send?phone=573045840264' },
  { name: 'TikTok', icon: ['fab', 'tiktok'], link: 'https://www.tiktok.com/@pipehpbarber' },
  { name: 'Instagram', icon: ['fab', 'instagram'], link: 'https://www.instagram.com/pipehp_/' },
]

const emit = defineEmits<{ reserve: [] }>()

function scrollToProducts() {
  const el = document.getElementById('tienda')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style scoped>
@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out both;
}
</style>
