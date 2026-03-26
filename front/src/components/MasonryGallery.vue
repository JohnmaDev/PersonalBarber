<!-- Galería de cortes – grid responsivo simple sin huecos -->
<template>
  <section id="cortes" class="mt-24 w-full scroll-mt-24">
    <div class="text-center mb-16 px-4">
      <h2 class="text-[3.5rem] leading-tight sm:text-[5rem] lg:text-[100px] font-black lg:leading-tight tracking-tighter italic uppercase text-shadow-premium">
        NUESTROS <span class="text-neon-green block sm:inline drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">CORTES</span>
      </h2>
      <p class="text-gray-400 text-lg sm:text-2xl mt-4 max-w-xl mx-auto italic font-bold tracking-wide">
        El trabajo habla por sí solo
      </p>
      <div class="flex justify-center gap-2 opacity-80 mt-6 mb-8">
        <span v-for="i in 3" :key="i" class="w-3 h-3 bg-neon-green rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"></span>
      </div>
    </div>

    <!-- Grid: 2 cols en móvil, 4 en desktop -->
    <div v-if="!loading" class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full px-2 sm:px-0">
      <div
        v-for="cut in cuts"
        :key="cut.id"
        class="group relative overflow-hidden rounded-2xl border border-white/10 transition-colors duration-700 bg-zinc-900/50"
      >
        <!-- Imagen con aspect-ratio fijo -->
        <div class="aspect-[3/4] w-full overflow-hidden">
          <img
            :src="optimizeImage(cut.image, 400)"
            :alt="cut.alt || cut.style"
            class="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        <!-- Overlay - Unificado en una sola transición de opacidad -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-3 sm:p-4">
          <span class="text-white font-bold tracking-widest text-[9px] sm:text-[10px] uppercase bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
            {{ cut.style }}
          </span>
        </div>
      </div>
    </div>

    <!-- Skeleton / Loading State -->
    <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
      <div v-for="i in 4" :key="i" class="aspect-[3/4] w-full rounded-2xl bg-zinc-900 animate-pulse border border-white/5"></div>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && cuts.length === 0" class="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-white/10">
      <i class="fas fa-camera-retro text-3xl text-zinc-700 mb-4"></i>
      <p class="text-zinc-500 font-bold italic">Próximamente más trabajos...</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { optimizeImage } from '@/utils/image.js'

const cuts = ref([])
const loading = ref(true)

const fetchCuts = async () => {
  try {
    const res = await fetch('/api/get_cuts')
    const data = await res.json()
    if (data.ok) {
      cuts.value = data.cuts
    }
  } catch (e) {
    console.error('Error fetching cuts:', e)
  } finally {
    loading.value = false
  }
}

onMounted(fetchCuts)
</script>
