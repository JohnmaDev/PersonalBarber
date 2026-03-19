<!-- Sección de categorías de la tienda para el Home -->
<template>
  <section id="tienda" class="mt-24 w-full scroll-mt-24">
    <!-- Encabezado -->
    <div class="text-center mb-12">
      <h2 class="text-4xl font-bold text-white mb-2 tracking-tighter">
        NUESTRA <span class="text-barber-gold">TIENDA</span>
      </h2>
      <p class="text-gray-400 text-sm italic mt-3">Productos de calidad profesional, directo a tus manos</p>
      <div class="flex justify-center gap-1 opacity-50 mt-3">
        <span v-for="i in 3" :key="i" class="w-1.5 h-1.5 bg-barber-gold rounded-full"></span>
      </div>
    </div>

    <!-- Grid de categorías: activas + próximamente -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

      <!-- Tarjetas activas (con imagen) -->
      <router-link
        v-for="cat in activeCategories"
        :key="cat.id"
        :to="`/tienda?cat=${cat.id}`"
        class="group relative h-52 sm:h-64 rounded-2xl overflow-hidden border border-white/10 hover:border-barber-gold/60 transition-all duration-500 cursor-pointer block"
      >
        <!-- Imagen de fondo -->
        <img
          :src="cat.cover"
          :alt="cat.label"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        <!-- Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

        <!-- Glow accent on hover -->
        <div
          class="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          :style="{ background: `radial-gradient(circle at 50% 110%, ${cat.accent} 0%, transparent 70%)` }"
        ></div>

        <!-- Contenido -->
        <div class="absolute inset-0 flex flex-col justify-end p-4 sm:p-5">
          <span
            class="text-[10px] font-bold tracking-widest uppercase mb-1"
            :style="{ color: cat.accent }"
          >{{ cat.subtitle || `${getCategoryCount(cat.id)} productos` }}</span>
          <h3 class="text-base sm:text-xl font-bold text-white tracking-tight group-hover:text-barber-gold transition-colors duration-300 leading-tight">
            {{ cat.label }}
          </h3>
          <div class="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
            <span class="text-xs text-white font-semibold">Ver productos</span>
            <i class="fas fa-arrow-right text-xs text-barber-gold"></i>
          </div>
        </div>
      </router-link>

      <!-- Tarjetas próximamente (sin imagen) -->
      <div
        v-for="cat in comingSoonCategories"
        :key="cat.id"
        class="group relative h-52 sm:h-64 rounded-2xl overflow-hidden border border-white/10 bg-white/3 transition-all duration-500 cursor-default"
        :class="{ 'sm:col-span-2': cat.id === 'boutique' }"
        :style="{ borderColor: `${cat.accent}25` }"
      >
        <!-- Glow sutil de fondo -->
        <div
          class="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700"
          :style="{ background: `radial-gradient(circle at 50% 50%, ${cat.accent} 0%, transparent 70%)` }"
        ></div>
        
        <!-- Animación de brillo extra para Boutique -->
        <div v-if="cat.id === 'boutique'" class="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer"></div>

        <!-- Contenido centrado -->
        <div class="absolute inset-0 flex flex-col items-center justify-center p-5 text-center gap-3">
          <div
            class="w-12 h-12 rounded-full flex items-center justify-center border"
            :style="{ borderColor: `${cat.accent}40`, background: `${cat.accent}12` }"
          >
            <i :class="cat.icon" class="text-lg" :style="{ color: cat.accent }"></i>
          </div>
          <h3 class="text-sm sm:text-base font-bold text-white/70 leading-tight">{{ cat.label }}</h3>
          <span
            class="text-xs px-3 py-1 rounded-full font-bold tracking-widest uppercase border"
            :style="{ color: cat.accent, borderColor: `${cat.accent}40`, background: `${cat.accent}12` }"
          >Próximamente</span>
        </div>
      </div>

    </div>

    <!-- CTA ver toda la tienda -->
    <div class="flex justify-center mt-8">
      <router-link
        to="/tienda"
        class="group flex items-center gap-3 px-8 py-3 glass border border-barber-gold/30 hover:border-barber-gold hover:bg-barber-gold hover:text-black text-white font-bold rounded-full transition-all duration-300"
      >
        <i class="fas fa-store text-barber-gold group-hover:text-black transition-colors duration-300"></i>
        Ver toda la tienda
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { categories } from '@/data/products.js'

const products = ref([])
const activeCategories = computed(() => categories.filter(c => !c.comingSoon))
const comingSoonCategories = computed(() => categories.filter(c => c.comingSoon))

async function fetchCounts() {
  try {
    const res = await fetch('/api/get_products')
    const data = await res.json()
    if (data.ok) {
      products.value = data.products
    }
  } catch (err) {
    console.error('Error cargando conteos:', err)
  }
}

function getCategoryCount(catId) {
  return products.value.filter(p => p.category === catId).length
}

onMounted(fetchCounts)
</script>
