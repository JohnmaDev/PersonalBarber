<template>
  <section id="tienda" class="mt-24 w-full scroll-mt-24 relative">
    <!-- Barra de carga global discreta -->
    <transition name="fade">
      <div v-if="loading" class="fixed top-0 left-0 w-full h-[2px] z-[100] overflow-hidden">
        <div 
          class="h-full animate-progress-bar transition-colors duration-500"
          :class="{
            'bg-neon-green shadow-[0_0_10px_#39FF14]': activeDepartment === 'men',
            'bg-cyan-400 shadow-[0_0_10px_#22d3ee]': activeDepartment === 'merch',
            'bg-pink-500 shadow-[0_0_10px_#ec4899]': activeDepartment === 'women'
          }"
        ></div>
      </div>
    </transition>
    <div class="text-center mb-16 px-4">
      <h2 class="text-[3.5rem] leading-tight sm:text-[6rem] lg:text-[100px] font-black lg:leading-tight tracking-tighter italic uppercase text-shadow-premium">
        NUESTRA <span class="block sm:inline transition-colors duration-500" :class="{
          'text-neon-green drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]': activeDepartment === 'men',
          'text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]': activeDepartment === 'merch',
          'text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]': activeDepartment === 'women'
        }">{{ activeDepartment === 'men' ? 'TIENDA' : (activeDepartment === 'merch' ? 'BOUTIQUE' : 'BEAUTY') }}</span>
      </h2>
      <p class="text-gray-400 text-lg sm:text-2xl mt-4 max-w-xl mx-auto italic font-bold tracking-wide transition-colors duration-500">
        {{ 
          activeDepartment === 'men' ? 'Productos de calidad profesional, directo a tus manos' : 
          (activeDepartment === 'merch' ? 'Prendas exclusivas y accesorios con el sello de la casa' : 'Belleza, maquillaje y cuidado integral para ti') 
        }}
      </p>
      <div class="flex justify-center mt-8 mb-16 fade-in">
        <div class="inline-flex bg-zinc-900 rounded-full p-1 border border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
          <button 
            @click="activeDepartment = 'men'"
            :class="[
              'px-4 sm:px-6 py-3 rounded-full font-black tracking-widest text-[10px] sm:text-xs uppercase transition-all duration-300 flex items-center gap-2',
              activeDepartment === 'men' ? 'bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'text-zinc-500 hover:text-white'
            ]"
          >
            <i class="fas fa-cut"></i> <span class="hidden xs:inline">Para Él</span><span class="xs:hidden">Él</span>
          </button>
          <button 
            @click="activeDepartment = 'merch'"
            :class="[
              'px-4 sm:px-6 py-3 rounded-full font-black tracking-widest text-[10px] sm:text-xs uppercase transition-all duration-300 flex items-center gap-2',
              activeDepartment === 'merch' ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'text-zinc-500 hover:text-white'
            ]"
          >
            <i class="fas fa-tshirt"></i> <span class="hidden xs:inline">Merch</span><span class="xs:hidden">Ropa</span>
          </button>
          <button 
            @click="activeDepartment = 'women'"
            :class="[
              'px-4 sm:px-6 py-3 rounded-full font-black tracking-widest text-[10px] sm:text-xs uppercase transition-all duration-300 flex items-center gap-2',
              activeDepartment === 'women' ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'text-zinc-500 hover:text-white'
            ]"
          >
            <i class="fas fa-spa"></i> <span class="hidden xs:inline">Para Ella</span><span class="xs:hidden">Ella</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Tarjetas de Categorías (Unificadas) -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 transition-opacity duration-500" :class="{'opacity-40 pointer-events-none': loading}">
      <component
        :is="cat.comingSoon ? 'div' : 'router-link'"
        v-for="cat in [...activeCategories, ...otherComingSoonCategories]"
        :key="cat.id"
        :to="cat.comingSoon ? null : `/tienda?cat=${cat.id}`"
        class="group relative h-56 sm:h-72 rounded-3xl overflow-hidden border transition-all duration-500 flex flex-col items-center justify-center p-6 text-center"
        :class="[
          cat.comingSoon ? 'cursor-default bg-white/3' : 'cursor-pointer hover:scale-[1.02] bg-zinc-900',
        ]"
        :style="{ borderColor: `${cat.accent}${cat.comingSoon ? '15' : '30'}` }"
      >
        <!-- Fondo: Imagen desenfocada para activas, Glow sutil para próximas -->
        <div v-if="!cat.comingSoon && cat.cover" class="absolute inset-0 z-0">
          <img
            :src="optimizeImage(cat.cover, 600)"
            :alt="cat.label"
            class="w-full h-full object-cover opacity-20 blur-sm grayscale group-hover:opacity-40 group-hover:blur-none group-hover:grayscale-0 transition-all duration-700"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        </div>
        <div
          v-else
          class="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 z-0"
          :style="{ background: `radial-gradient(circle at 50% 50%, ${cat.accent} 0%, transparent 70%)` }"
        ></div>

        <!-- Glow de acento dinámico -->
        <div 
          class="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl z-0"
          :style="{ background: `radial-gradient(circle at 50% 50%, ${cat.accent}20 0%, transparent 60%)` }"
        ></div>

        <!-- Contenido Central: Círculo + Icono -->
        <div class="relative z-10 flex flex-col items-center gap-4">
          <div 
            class="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg"
            :style="{ 
              borderColor: `${cat.accent}60`, 
              background: `${cat.accent}15`,
              boxShadow: `0 0 20px ${cat.accent}20`
            }"
          >
            <!-- Icono Personalizado (Imagen/SVG con Máscara) -->
            <div v-if="isImageUrl(cat.icon)" 
                 class="w-10 h-10 sm:w-12 sm:h-12 transition-all duration-500"
                 :style="{ 
                   backgroundColor: cat.accent, 
                   mask: `url('${cat.icon.replace('.png', '.webp')}') no-repeat center / contain`,
                   WebkitMask: `url('${cat.icon.replace('.png', '.webp')}') no-repeat center / contain`
                 }">
            </div>
            <!-- Icono FontAwesome -->
            <i v-else :class="cat.icon || 'fas fa-tag'" class="text-2xl sm:text-3xl transition-all duration-500" :style="{ color: cat.accent }"></i>
          </div>

          <!-- Textos -->
          <div class="flex flex-col items-center">
            <span v-if="!cat.comingSoon" class="text-[10px] font-black tracking-[0.2em] uppercase mb-1 opacity-60 group-hover:opacity-100 transition-opacity" :style="{ color: cat.accent }">
              {{ getCategoryCount(cat.id) }} PRODUCTOS
            </span>
            <h3 class="text-lg sm:text-xl font-black text-white tracking-tighter uppercase italic italic-heavy drop-shadow-md">
              {{ cat.label }}
            </h3>
            
            <!-- Badge Estado -->
            <div class="mt-2">
              <span v-if="cat.comingSoon" 
                    class="text-[9px] px-3 py-1 rounded-full font-black tracking-widest uppercase border border-white/10 bg-white/5 text-white/40">
                Próximamente
              </span>
              <span v-else 
                    class="text-[9px] px-3 py-1 rounded-full font-black tracking-widest uppercase border transition-all duration-300"
                    :style="{ color: cat.accent, borderColor: `${cat.accent}40`, background: `${cat.accent}10` }">
                Disponible
              </span>
            </div>
          </div>
        </div>
      </component>
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
        :to="{ path: '/tienda', query: { dept: activeDepartment } }"
        :class="[
          'group relative inline-flex items-center justify-center px-12 py-5 font-black italic uppercase tracking-[0.2em] text-white transition-all duration-300 ease-out border-2',
          activeDepartment === 'men' ? 'border-neon-green/40 hover:border-neon-green' : 
          (activeDepartment === 'merch' ? 'border-cyan-400/40 hover:border-cyan-400' : 'border-pink-500/40 hover:border-pink-500')
        ]"
      >
        <!-- Brutalist Offset Shadow -->
        <div :class="['absolute inset-0 w-full h-full translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300', 
          activeDepartment === 'men' ? 'bg-neon-green/10' : 
          (activeDepartment === 'merch' ? 'bg-cyan-400/10' : 'bg-pink-500/10')
        ]"></div>
        
        <!-- Shimmer Effect -->
        <div class="absolute inset-0 w-full h-full overflow-hidden">
          <div :class="['absolute inset-0 bg-gradient-to-r from-transparent to-transparent -translate-x-full group-hover:animate-shimmer-fast', 
            activeDepartment === 'men' ? 'via-neon-green/20' : 
            (activeDepartment === 'merch' ? 'via-cyan-400/20' : 'via-pink-500/20')
          ]"></div>
        </div>

        <div class="relative flex items-center gap-3">
          <i class="fas fa-store transition-transform duration-300 group-hover:scale-125" :class="
            activeDepartment === 'men' ? 'text-neon-green' : 
            (activeDepartment === 'merch' ? 'text-cyan-400' : 'text-pink-500')
          "></i>
          <span class="text-xl sm:text-2xl transition-colors duration-300" :class="
            activeDepartment === 'men' ? 'group-hover:text-neon-green' : 
            (activeDepartment === 'merch' ? 'group-hover:text-cyan-400' : 'group-hover:text-pink-500')
          ">
             {{ activeDepartment === 'men' ? 'Explorar Tienda' : (activeDepartment === 'merch' ? 'Ver Colección' : 'Explorar Beauty Hub') }}
          </span>
        </div>
        
        <!-- Corner Accents -->
        <div :class="['absolute -top-1 -left-1 w-2 h-2 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity', 
          activeDepartment === 'men' ? 'border-neon-green' : (activeDepartment === 'merch' ? 'border-cyan-400' : 'border-pink-500')
        ]"></div>
        <div :class="['absolute -bottom-1 -right-1 w-2 h-2 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity', 
          activeDepartment === 'men' ? 'border-neon-green' : (activeDepartment === 'merch' ? 'border-cyan-400' : 'border-pink-500')
        ]"></div>
      </router-link>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { optimizeImage } from '@/utils/image.js'
import { useCatalog } from '@/composables/useCatalog.js'

const { products, categories, isLoading: loading, fetchCatalog } = useCatalog()
const activeDepartment = ref('men')

const activeCategories = computed(() => {
  if (activeDepartment.value === 'merch') {
    // En Merch, mostramos solo las 4 categorías estándar (Gorras, Camisetas, etc.)
    // Excluimos la 'premium' para que no ensucie el grid si queremos dejarla aparte
    return categories.value.filter(c => !c.comingSoon && c.department === 'unisex' && c.style !== 'premium')
  }
  // En Él/Ella, grid normal de 8
  return categories.value.filter(c => !c.comingSoon && c.style !== 'premium' && c.department === activeDepartment.value)
})

const boutiqueCategories = computed(() => {
  // Si ya estamos viendo Merch arriba, no duplicamos el destacado abajo
  if (activeDepartment.value === 'merch') return []
  // Solo el ítem marcado como 'premium' se muestra como banner destacado abajo
  return categories.value.filter(c => c.style === 'premium')
})

const otherComingSoonCategories = computed(() => {
  if (activeDepartment.value === 'merch') {
    return categories.value.filter(c => c.comingSoon && (c.department === 'unisex' || c.style === 'premium'))
  }
  return categories.value.filter(c => c.comingSoon && c.style !== 'premium' && c.department === activeDepartment.value)
})

async function fetchData() {
  await fetchCatalog()
}

function getCategoryCount(catId) {
  return products.value.filter(p => p.category === catId).length
}

function isImageUrl(icon) {
  if (!icon) return false
  return icon.startsWith('/') || icon.startsWith('http')
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

</style>
