<template>
  <section id="tienda" class="mt-24 w-full scroll-mt-24 relative">
    <!-- Barra de carga global discreta -->
    <Transition name="fade">
      <div v-if="isLoading" class="fixed top-0 left-0 w-full h-[2px] z-[100] overflow-hidden">
        <div class="h-full animate-progress-bar dept-bg shadow-[0_0_10px_var(--dept-glow)] transition-colors duration-500"></div>
      </div>
    </Transition>
    <div class="text-center mb-16 px-4">
      <!-- Headline: diferente para women (no hereda el "NUESTRA BARBERÍA") -->
      <h2 v-if="activeDepartment === 'women'"
        class="text-[3.5rem] leading-tight sm:text-[6rem] lg:text-[100px] font-black lg:leading-tight tracking-tighter italic uppercase text-shadow-premium">
        <span class="block sm:inline dept-text drop-shadow-[0_0_15px_var(--dept-glow)] transition-colors duration-500">{{ t('tienda.depts.women') }}</span>
      </h2>
      <h2 v-else class="text-[3.5rem] leading-tight sm:text-[6rem] lg:text-[100px] font-black lg:leading-tight tracking-tighter italic uppercase text-shadow-premium">
        {{ t('tienda.nuestra') }} <span class="block sm:inline dept-text drop-shadow-[0_0_15px_var(--dept-glow)] transition-colors duration-500">{{ t(`tienda.depts.${activeDepartment}`) }}</span>
      </h2>
      <p class="text-gray-400 text-lg sm:text-2xl mt-4 max-w-xl mx-auto italic font-bold tracking-wide transition-colors duration-500">
        {{ t(`tienda.subtitles.${activeDepartment}`) }}
      </p>
      <!-- Selector de Universo — 2 niveles: protagonistas arriba, complementarios abajo -->
      <div class="flex flex-col items-center gap-2 mt-8 mb-12 fade-in">

        <!-- Fila 1: Los protagonistas (Él y Ella) -->
        <div class="inline-flex rounded-xl bg-zinc-900/90 p-1 border border-zinc-800 gap-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
          <button
            @click="setDepartment('men')"
            class="px-5 sm:px-7 py-2.5 rounded-lg font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shrink-0"
            :class="activeDepartment !== 'merch' && activeDepartment !== 'women' && activeDepartment !== 'all'
              ? 'bg-neon-green text-black shadow-[0_0_14px_rgba(57,255,20,0.25)]'
              : 'text-zinc-500 hover:text-white'"
          >
            <fa-icon :icon="['fas', 'cut']" />
            <span class="hidden sm:inline">Barbería</span>
            <span class="sm:hidden">Él</span>
          </button>
          <button
            @click="setDepartment('women')"
            class="px-5 sm:px-7 py-2.5 rounded-lg font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shrink-0"
            :class="activeDepartment === 'women'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-[0_0_14px_rgba(236,72,153,0.35)]'
              : 'text-zinc-500 hover:text-white'"
          >
            <fa-icon :icon="['fas', 'spa']" />
            <span class="hidden sm:inline">Beauty</span>
            <span class="sm:hidden">Ella</span>
          </button>
        </div>

        <!-- Divisor visual sutil -->
        <div class="flex items-center gap-3">
          <span class="h-px w-12 bg-zinc-800"></span>
          <span class="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-600">también</span>
          <span class="h-px w-12 bg-zinc-800"></span>
        </div>

        <!-- Fila 2: Complementarios (Ropa y Ver Todo) — más pequeños -->
        <div class="inline-flex rounded-lg bg-zinc-900/60 p-0.5 border border-zinc-800/60 gap-0.5">
          <button
            @click="setDepartment('merch')"
            class="px-4 sm:px-5 py-1.5 rounded-md font-bold text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 shrink-0"
            :class="activeDepartment === 'merch'
              ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]'
              : 'text-zinc-600 hover:text-zinc-300'"
          >
            <fa-icon :icon="['fas', 'tshirt']" class="text-[8px]" />
            <span>Ropa & Merch</span>
          </button>
          <button
            @click="setDepartment('all')"
            class="px-4 sm:px-5 py-1.5 rounded-md font-bold text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 shrink-0"
            :class="activeDepartment === 'all'
              ? 'bg-neon-green/15 text-neon-green border border-neon-green/40 shadow-[0_0_10px_rgba(57,255,20,0.12)]'
              : 'text-zinc-600 hover:text-zinc-300'"
          >
            <fa-icon :icon="['fas', 'border-all']" class="text-[8px]" />
            <span>Ver Todo</span>
          </button>
        </div>

        <!-- Subtexto contextual -->
        <p v-if="activeDepartment === 'women'" class="text-[10px] sm:text-xs font-bold tracking-widest uppercase" style="color: #ec4899">
          ✨ Tu mundo de belleza · Maquillaje, skincare & más
        </p>
        <p v-else-if="activeDepartment === 'merch'" class="text-[10px] sm:text-xs text-cyan-600/80 uppercase tracking-widest font-bold">
          🔥 Viste con actitud · Colección exclusiva hombre & mujer
        </p>
        <p v-else-if="activeDepartment === 'all'" class="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-bold">
          Catálogo completo · Sin filtros · Todo en un solo lugar
        </p>
        <p v-else class="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-bold">
          Productos de barbería & cuidado masculino
        </p>
      </div>
    </div>

    <!-- Tarjetas de Categorías -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 transition-opacity duration-500" :class="{'opacity-40 pointer-events-none': isLoading}">
      <template v-for="cat in [...activeCategories, ...otherComingSoonCategories]" :key="cat.id">
        <!-- Tarjeta de Categoría Disponible -->
        <NuxtLink
          v-if="!cat.comingSoon"
          :to="{ path: '/', query: { cat: cat.id, dept: cat.department === 'unisex' ? 'merch' : cat.department } }"
          class="group relative h-56 sm:h-72 rounded-3xl overflow-hidden border border-white/10 transition-premium flex flex-col items-center justify-center p-6 text-center bg-zinc-900 hover:scale-[1.02]"
          :style="{ borderColor: `${cat.accent}30` }"
        >
          <!-- Fondo -->
          <div v-if="cat.cover" class="absolute inset-0 z-0">
            <img
              :src="optimizeImage(cat.cover, 400)"
              :srcset="optimizeSrcSet(cat.cover, [160, 320, 400])"
              sizes="(max-width: 640px) calc(50vw - 1rem), (max-width: 1024px) calc(33vw - 1rem), 280px"
              :alt="getCategoryLabel(cat)"
              class="w-full h-full object-cover opacity-20 blur-sm grayscale group-hover:opacity-40 group-hover:blur-none group-hover:grayscale-0 transition-premium"
              width="400"
              height="288"
              loading="lazy"
              decoding="async"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
          </div>
          <div v-else class="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 z-0"
            :style="{ background: `radial-gradient(circle at 50% 50%, ${cat.accent} 0%, transparent 70%)` }">
          </div>
          <div class="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl z-0"
            :style="{ background: `radial-gradient(circle at 50% 50%, ${cat.accent}20 0%, transparent 60%)` }">
          </div>

          <!-- Contenido Central -->
          <div class="relative z-10 flex flex-col items-center gap-4">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center transition-premium group-hover:scale-110 shadow-lg"
              :style="{ borderColor: `${cat.accent}60`, background: `${cat.accent}15`, boxShadow: `0 0 20px ${cat.accent}20`, color: cat.accent }">
              <div v-if="isImageUrl(cat.icon)"
                class="w-10 h-10 sm:w-12 sm:h-12 transition-premium-fast"
                :style="{ 
                  backgroundColor: cat.accent, 
                  mask: `url('${cat.icon.replace('.png', '.webp')}') no-repeat center / contain`, 
                  WebkitMask: `url('${cat.icon.replace('.png', '.webp')}') no-repeat center / contain` 
                }">
              </div>
              <fa-icon v-else :icon="['fas', (cat.icon || 'tag').replace('fas fa-', '')]" class="text-2xl sm:text-3xl transition-premium-fast" />
            </div>

            <div class="flex flex-col items-center">
              <span class="text-[10px] font-black tracking-[0.2em] uppercase mb-1 opacity-60 group-hover:opacity-100 transition-opacity" :style="{ color: cat.accent }">
                {{ getCategoryCount(cat.id) }} {{ t('tienda.products').toUpperCase() }}
              </span>
              <h3 class="text-lg sm:text-xl font-black text-white tracking-tighter uppercase italic italic-heavy drop-shadow-md">
                {{ getCategoryLabel(cat) }}
              </h3>
              <div class="mt-2">
                <span class="text-[9px] px-3 py-1 rounded-full font-black tracking-widest uppercase border transition-all duration-300"
                  :style="{ color: cat.accent, borderColor: `${cat.accent}40`, background: `${cat.accent}10` }">
                  {{ t('tienda.available') }}
                </span>
              </div>
            </div>
          </div>
        </NuxtLink>

        <!-- Tarjeta de Categoría Próximamente -->
        <div
          v-else
          class="group relative h-56 sm:h-72 rounded-3xl overflow-hidden border border-white/10 transition-premium flex flex-col items-center justify-center p-6 text-center cursor-default bg-white/3"
          :style="{ borderColor: `${cat.accent}15` }"
        >
          <div class="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 z-0"
            :style="{ background: `radial-gradient(circle at 50% 50%, ${cat.accent} 0%, transparent 70%)` }">
          </div>

          <!-- Contenido Central -->
          <div class="relative z-10 flex flex-col items-center gap-4">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center transition-premium group-hover:scale-110 shadow-lg"
              :style="{ borderColor: `${cat.accent}60`, background: `${cat.accent}15`, boxShadow: `0 0 20px ${cat.accent}20`, color: cat.accent }">
              <div v-if="isImageUrl(cat.icon)"
                class="w-10 h-10 sm:w-12 sm:h-12 transition-premium-fast"
                :style="{ 
                  backgroundColor: cat.accent, 
                  mask: `url('${cat.icon.replace('.png', '.webp')}') no-repeat center / contain`, 
                  WebkitMask: `url('${cat.icon.replace('.png', '.webp')}') no-repeat center / contain` 
                }">
              </div>
              <fa-icon v-else :icon="['fas', (cat.icon || 'tag').replace('fas fa-', '')]" class="text-2xl sm:text-3xl transition-premium-fast" />
            </div>

            <div class="flex flex-col items-center">
              <h3 class="text-lg sm:text-xl font-black text-white tracking-tighter uppercase italic italic-heavy drop-shadow-md">
                {{ getCategoryLabel(cat) }}
              </h3>
              <div class="mt-2">
                <span class="text-[9px] px-3 py-1 rounded-full font-black tracking-widest uppercase border border-white/10 bg-white/5 text-white/40">
                  {{ t('tienda.comingSoon') }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <!-- SECCIÓN BOUTIQUE DESTACADO -->
    <div v-for="cat in boutiqueCategories" :key="cat.id" class="mt-12 relative pt-4">
      <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black px-4 py-1 rounded-full border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]">
        <span class="text-[10px] font-black tracking-[0.2em] text-pink-500 uppercase">Premium Merch</span>
      </div>
      <div class="group relative h-48 sm:h-56 rounded-3xl overflow-hidden border border-pink-500/20 bg-gradient-to-r from-pink-900/20 via-black to-zinc-900/40 p-1 flex items-center justify-center transition-all duration-700 hover:border-pink-500/50 shadow-2xl">
        <div class="relative flex flex-col items-center text-center p-6 sm:p-10 z-10 w-full border border-white/5 rounded-[22px] bg-black/60 backdrop-blur-sm">
          <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
              <fa-icon :icon="['fas', 'tshirt']" class="text-3xl sm:text-4xl text-pink-500" />
            </div>
            <div class="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h3 class="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase italic italic-heavy">{{ getCategoryLabel(cat) }}</h3>
              <p class="text-zinc-400 text-sm sm:text-base font-medium mt-1 max-w-sm">
                {{ t('tienda.boutiqueDesc') }}
              </p>
            </div>
          </div>
          <div class="mt-6 flex items-center gap-4">
            <span class="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-pink-500"></span>
            <span class="text-xs font-bold tracking-widest text-pink-500 uppercase whitespace-nowrap">{{ t('tienda.verySoon') }}</span>
            <span class="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-pink-500"></span>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA ver toda la tienda -->
    <div class="flex justify-center mt-12 mb-20">
      <NuxtLink
        :to="{ path: '/', query: { dept: activeDepartment } }"
        class="group relative inline-flex items-center justify-center px-12 py-5 font-black italic uppercase tracking-[0.2em] text-white transition-all duration-300 ease-out border-2 dept-border hover:opacity-90"
      >
        <div class="absolute inset-0 w-full h-full translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300 bg-white/5"></div>
        <div class="relative flex items-center gap-3">
          <fa-icon :icon="['fas', 'store']" class="transition-transform duration-300 group-hover:scale-125 dept-text" />
          <span class="text-xl sm:text-2xl transition-colors duration-300 group-hover:dept-text">
            {{ t(`tienda.exploreBtn.${activeDepartment}`) }}
          </span>
        </div>
      </NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useLanguage } from '~/composables/useLanguage'
import { useDepartment } from '~/composables/useDepartment'

const NuxtLinkResolved = resolveComponent('NuxtLink')

const { t, lang } = useLanguage()
const { products, categories, isLoading } = useCatalog()
const { activeDepartment, setDepartment } = useDepartment()

// Helper: identifica categorías de ropa/merch/boutique (excluye servicios como micropigmentación)
function isMerchCategory(c: { department: string; style?: string; id: string }) {
  if (c.style === 'premium') return true
  if (c.id === 'boutique') return true
  const clothingIds = ['camisetas', 'gorras', 'shorts', 'accesorios-merch', 'hoodies', 'pantalones']
  if (c.department === 'merch') return true
  if (c.department === 'unisex' && clothingIds.includes(c.id)) return true
  return false
}

const activeCategories = computed(() => {
  if (activeDepartment.value === 'all') {
    return categories.value.filter(c => !c.comingSoon && c.style !== 'premium')
  }
  if (activeDepartment.value === 'merch') {
    return categories.value.filter(c => !c.comingSoon && isMerchCategory(c) && c.style !== 'premium')
  }
  return categories.value.filter(c => !c.comingSoon && c.style !== 'premium' && c.department === activeDepartment.value)
})

const boutiqueCategories = computed(() => {
  if (activeDepartment.value === 'merch') return []
  return categories.value.filter(c => c.style === 'premium')
})

const otherComingSoonCategories = computed(() => {
  if (activeDepartment.value === 'all') {
    return categories.value.filter(c => c.comingSoon)
  }
  if (activeDepartment.value === 'merch') {
    return categories.value.filter(c => c.comingSoon && isMerchCategory(c))
  }
  return categories.value.filter(c => c.comingSoon && c.style !== 'premium' && c.department === activeDepartment.value)
})

function getCategoryLabel(cat: { id: string; label: string }) {
  const key = `tienda.categorias.${cat.id}`
  const translated = t(key)
  return translated === key ? cat.label : translated
}

function getCategoryCount(catId: string) {
  return products.value.filter(p => p.category === catId).length
}

function isImageUrl(icon?: string) {
  if (!icon) return false
  return icon.startsWith('/') || icon.startsWith('http')
}
</script>

<style scoped>
.italic-heavy {
  font-style: italic;
  filter: skewX(-5deg);
}
</style>
