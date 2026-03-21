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
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full">
      <div
        v-for="cut in cuts"
        :key="cut.id"
        class="group relative overflow-hidden rounded-2xl border border-white/10 transition-colors duration-700"
      >
        <!-- Imagen con aspect-ratio fijo -->
        <div class="aspect-[3/4] w-full overflow-hidden">
          <img
            :src="cut.image"
            :alt="cut.alt"
            class="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
            loading="lazy"
          />
        </div>

        <!-- Overlay - Unificado en una sola transición de opacidad -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
          <span class="text-white font-bold tracking-widest text-[10px] uppercase bg-white/20 px-3 py-1.5 rounded-full border border-white/10">
            {{ cut.style }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const cuts = [
  { id: 1, image: '/customers/BuzzCut_HighFade_Limpio_01.webp',      alt: 'Buzz Cut High Fade limpio',          style: 'Buzz Cut · High Fade' },
  { id: 2, image: '/customers/CropTop_MidFade_Lineas_01.webp',       alt: 'Crop Top con Mid Fade y líneas',     style: 'Crop Top · Mid Fade' },
  { id: 3, image: '/customers/SidePart_LowFade_Barba_Spa_01.webp',   alt: 'Side Part Low Fade con barba',       style: 'Side Part · Barba' },
  { id: 4, image: '/customers/SlickBack_TaperBajo_Brillo_01.webp',   alt: 'Slick Back Taper bajo con brillo',   style: 'Slick Back · Taper' },
]
</script>
