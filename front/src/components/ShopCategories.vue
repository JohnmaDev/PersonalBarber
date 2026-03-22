<!-- Sección de categorías de la tienda para el Home -->
<template>
  <section id="tienda" class="mt-24 w-full scroll-mt-24">
    <div class="text-center mb-16 px-4">
      <h2 class="text-[3.5rem] leading-tight sm:text-[6rem] lg:text-[100px] font-black lg:leading-tight tracking-tighter italic uppercase text-shadow-premium">
        NUESTRA <span class="block sm:inline transition-colors duration-500" :class="activeDepartment === 'men' ? 'text-neon-green drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]'">{{ activeDepartment === 'men' ? 'TIENDA' : 'BOUTIQUE' }}</span>
      </h2>
      <p class="text-gray-400 text-lg sm:text-2xl mt-4 max-w-xl mx-auto italic font-bold tracking-wide transition-colors duration-500">
        {{ activeDepartment === 'men' ? 'Productos de calidad profesional, directo a tus manos' : 'Belleza, maquillaje y cuidado integral para ti' }}
      </p>
      <div class="flex justify-center mt-8 mb-16 fade-in">
        <div class="inline-flex bg-zinc-900 rounded-full p-1 border border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
          <button 
            @click="activeDepartment = 'men'"
            :class="[
              'px-6 py-3 rounded-full font-black tracking-widest text-xs sm:text-sm uppercase transition-all duration-300 flex items-center gap-2',
              activeDepartment === 'men' ? 'bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'text-zinc-500 hover:text-white'
            ]"
          >
            <i class="fas fa-cut"></i> Para Él
          </button>
          <button 
            @click="activeDepartment = 'women'"
            :class="[
              'px-6 py-3 rounded-full font-black tracking-widest text-xs sm:text-sm uppercase transition-all duration-300 flex items-center gap-2',
              activeDepartment === 'women' ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'text-zinc-500 hover:text-white'
            ]"
          >
            <i class="fas fa-spa"></i> Para Ella
          </button>
        </div>
      </div>
    </div>

    <!-- Grid de categorías: activas + próximamente -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">

      <!-- Tarjetas activas (con imagen) -->
      <router-link
        v-for="cat in activeCategories"
        :key="cat.id"
        :to="`/tienda?cat=${cat.id}`"
        class="group relative h-52 sm:h-64 rounded-2xl overflow-hidden border border-white/10 hover:border-neon-green/60 transition-all duration-500 cursor-pointer block"
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
          <h3 class="text-base sm:text-xl font-bold text-white tracking-tight group-hover:text-neon-green transition-colors duration-300 leading-tight">
            {{ cat.label }}
          </h3>
          <div class="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
            <span class="text-xs text-white font-semibold">Ver productos</span>
            <i class="fas fa-arrow-right text-xs text-neon-green"></i>
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
    </div>

    <!-- SECCIÓN BOUTIQUE (DESTACADO CENTRAL) -->
    <div v-for="cat in boutiqueCategories" :key="cat.id" class="mt-12 relative pt-4">
      <!-- Badge Premium -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black px-4 py-1 rounded-full border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
        <span class="text-[10px] font-black tracking-[0.2em] text-pink-500 uppercase">Premium Merch</span>
      </div>

      <div
        class="group relative h-48 sm:h-56 rounded-3xl overflow-hidden border border-pink-500/20 bg-gradient-to-r from-pink-900/20 via-black to-zinc-900/40 p-1 flex items-center justify-center cursor-default transition-all duration-700 hover:border-pink-500/50 shadow-2xl"
      >
        <!-- Fondo animado -->
        <div class="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-transparent via-pink-500/5 to-transparent -translate-x-full group-hover:animate-shimmer"></div>

        <div class="relative flex flex-col items-center text-center p-6 sm:p-10 z-10 w-full border border-white/5 rounded-[22px] bg-black/60 backdrop-blur-sm">
          <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
               <i class="fas fa-tshirt text-3xl sm:text-4xl text-pink-500 drop-shadow-[0_0_10px_rgba(236,72_153,0.5)]"></i>
            </div>
            <div class="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h3 class="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase italic italic-heavy">
                {{ cat.label }}
              </h3>
              <p class="text-zinc-400 text-sm sm:text-base font-medium mt-1 max-w-sm">
                Diseños exclusivos, gorras y prendas con el sello PersonalBarber.
              </p>
            </div>
          </div>

          <div class="mt-6 flex items-center gap-4">
            <span class="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-pink-500"></span>
            <span class="text-xs font-bold tracking-widest text-pink-500 uppercase whitespace-nowrap">Muy Pronto</span>
            <span class="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-pink-500"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA ver toda la tienda -->
    <div class="flex justify-center mt-12 mb-20 animate-fade-in-up" style="animation-delay: 0.8s;">
      <router-link
        to="/tienda"
        :class="[
          'group relative inline-flex items-center justify-center px-12 py-5 font-black italic uppercase tracking-[0.2em] text-white transition-all duration-300 ease-out border-2',
          activeDepartment === 'men' ? 'border-neon-green/40 hover:border-neon-green' : 'border-pink-500/40 hover:border-pink-500'
        ]"
      >
        <!-- Brutalist Offset Shadow -->
        <div :class="['absolute inset-0 w-full h-full translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300', activeDepartment === 'men' ? 'bg-neon-green/10' : 'bg-pink-500/10']"></div>
        
        <!-- Shimmer Effect -->
        <div class="absolute inset-0 w-full h-full overflow-hidden">
          <div :class="['absolute inset-0 bg-gradient-to-r from-transparent to-transparent -translate-x-full group-hover:animate-shimmer-fast', activeDepartment === 'men' ? 'via-neon-green/20' : 'via-pink-500/20']"></div>
        </div>

        <div class="relative flex items-center gap-3">
          <i class="fas fa-store transition-transform duration-300 group-hover:scale-125" :class="activeDepartment === 'men' ? 'text-neon-green' : 'text-pink-500'"></i>
          <span class="text-xl sm:text-2xl transition-colors duration-300" :class="activeDepartment === 'men' ? 'group-hover:text-neon-green' : 'group-hover:text-pink-500'">
             {{ activeDepartment === 'men' ? 'Explorar Tienda' : 'Explorar Beauty Hub' }}
          </span>
        </div>
        
        <!-- Corner Accents -->
        <div :class="['absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity', activeDepartment === 'men' ? 'border-neon-green' : 'border-pink-500']"></div>
        <div :class="['absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity', activeDepartment === 'men' ? 'border-neon-green' : 'border-pink-500']"></div>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const products = ref([])
const categories = ref([])
const activeDepartment = ref('men')

const activeCategories = computed(() => categories.value.filter(c => !c.comingSoon && c.style !== 'premium' && (!c.department || c.department === 'unisex' || c.department === activeDepartment.value)))
const boutiqueCategories = computed(() => categories.value.filter(c => c.style === 'premium' || c.department === 'unisex'))
const otherComingSoonCategories = computed(() => categories.value.filter(c => c.comingSoon && c.style !== 'premium' && (!c.department || c.department === 'unisex' || c.department === activeDepartment.value)))

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

<style scoped>
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

@keyframes shimmer-fast {
  0% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}

.animate-shimmer {
  animation: shimmer 3s infinite;
}

.animate-shimmer-fast {
  animation: shimmer-fast 1.5s infinite;
}

.italic-heavy {
  font-style: italic;
  filter: skewX(-5deg);
}

.text-shadow-premium {
  text-shadow: 0 0 20px rgba(57, 255, 20, 0.3);
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out both;
}

/* Custom shadow utility if needed */
.shadow-neon-glow {
  box-shadow: 0 0 20px rgba(57, 255, 20, 0.2);
}
</style>
