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
        v-for="cat in otherComingSoonCategories"
        :key="cat.id"
        class="group relative h-52 sm:h-64 rounded-2xl overflow-hidden border border-white/10 bg-white/3 transition-all duration-300 cursor-default"
        :style="{ borderColor: `${cat.accent}18` }"
      >
        <!-- Glow sutil de fondo -->
        <div
          class="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500"
          :style="{ background: `radial-gradient(circle at 50% 50%, ${cat.accent} 0%, transparent 70%)` }"
        ></div>

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
    
    <!-- SECCIÓN BOUTIQUE (DESTACADO CENTRAL) -->
    <div v-for="cat in boutiqueCategories" :key="cat.id" class="mt-12 relative pt-4">
      <!-- Badge Premium -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black px-4 py-1 rounded-full border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
        <span class="text-[10px] font-black tracking-[0.2em] text-pink-500 uppercase">{{ cat.comingSoon ? 'Próximamente' : 'Edición Premium' }}</span>
      </div>

      <component 
        :is="cat.comingSoon ? 'div' : 'router-link'"
        :to="cat.comingSoon ? null : `/tienda?cat=${cat.id}`"
        class="group relative h-48 sm:h-56 rounded-3xl overflow-hidden border border-pink-500/20 bg-gradient-to-r from-pink-900/20 via-black to-zinc-900/40 p-1 flex items-center justify-center transition-all duration-700 hover:border-pink-500/50 shadow-2xl block"
        :class="cat.comingSoon ? 'cursor-default' : 'cursor-pointer hover:scale-[1.01]'"
      >
        <!-- Fondo animado -->
        <div class="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/5 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
        
        <div class="relative flex flex-col items-center text-center p-6 sm:p-10 z-10 w-full border border-white/5 rounded-[22px] bg-black/60 backdrop-blur-sm">
          <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
               <i :class="cat.icon" class="text-3xl sm:text-4xl text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]"></i>
            </div>
            <div class="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h3 class="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase italic italic-heavy">
                {{ cat.label }}
              </h3>
              <p class="text-zinc-400 text-sm sm:text-base font-medium mt-1 max-w-sm">
                {{ cat.subtitle || 'Diseños exclusivos y piezas premium con el sello PersonalBarber.' }}
              </p>
            </div>
          </div>
          
          <div class="mt-6 flex items-center gap-4">
            <span class="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-pink-500"></span>
            <span class="text-xs font-bold tracking-widest text-pink-500 uppercase whitespace-nowrap">
              {{ cat.comingSoon ? 'Muy Pronto' : 'Explorar Colección' }}
            </span>
            <span class="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-pink-500"></span>
          </div>
        </div>
      </component>
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

const products = ref([])
const categories = ref([])

const activeCategories = computed(() => categories.value.filter(c => !c.comingSoon && c.style !== 'premium'))
const boutiqueCategories = computed(() => categories.value.filter(c => c.style === 'premium'))
const otherComingSoonCategories = computed(() => categories.value.filter(c => c.comingSoon && c.style !== 'premium'))

async function fetchData() {
  try {
    // Cargar Productos (para conteos)
    const resProd = await fetch('/api/get_products')
    const dataProd = await resProd.json()
    if (dataProd.ok) products.value = dataProd.products

    // Cargar Categorías
    const resCat = await fetch('/api/get_categories')
    const dataCat = await resCat.json()
    if (dataCat.ok) {
      categories.value = dataCat.categories
    }
  } catch (err) {
    console.error('Error cargando datos de la tienda:', err)
  }
}

function getCategoryCount(catId) {
  return products.value.filter(p => p.category === catId).length
}

onMounted(fetchData)
</script>
