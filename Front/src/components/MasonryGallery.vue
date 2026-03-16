<!-- Galería de cortes – grid responsivo simple sin huecos -->
<template>
  <section id="cortes" class="mt-24 w-full scroll-mt-24">
    <!-- Encabezado -->
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-white mb-2 tracking-tighter">
        NUESTROS <span class="text-barber-gold">CORTES</span>
      </h2>
      <p class="text-gray-400 text-sm italic mt-3">El trabajo habla por sí solo</p>
      <div class="flex justify-center gap-1 opacity-50 mt-3">
        <span v-for="i in 3" :key="i" class="w-1.5 h-1.5 bg-barber-gold rounded-full"></span>
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
