<template>
  <div class="min-h-screen text-white relative">

    <!-- ─── Fondo fijo global — toda la web navega sobre él ─── -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <picture>
        <source media="(max-width: 640px) and (orientation: portrait)" srcset="/bg_vertical_mobile.webp">
        <source media="(orientation: landscape)" srcset="/bg_horizontal.webp">
        <img
          src="/bg_vertical.webp"
          alt=""
          aria-hidden="true"
          class="w-full h-full object-cover object-top"
          style="filter: brightness(0.30) saturate(0.85)"
          fetchpriority="high"
        />
      </picture>
      <!-- Vignette lateral izquierda sutil -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/30"></div>
      <!-- Fade gradual hacia abajo hacia el fondo gris suave (#181818) -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-[#181818]"></div>
    </div>

    <!-- ─── Barra de carga top ─── -->
    <Transition name="fade">
      <div v-if="isLoading" class="fixed top-0 left-0 w-full h-[2px] z-[100] overflow-hidden">
        <div class="h-full animate-progress-bar dept-bg" style="box-shadow: 0 0 10px var(--dept-color)"></div>
      </div>
    </Transition>

    <!-- ─── STORE HERO — texto top-left, fondo viene del layer fijo ─── -->
    <div class="relative w-full flex flex-col overflow-hidden">

      <!-- Glow ambiental — cambia con el departamento -->
      <div
        class="fixed top-0 left-0 w-[60vw] h-[60vw] max-w-[500px] rounded-full blur-[160px] pointer-events-none z-[1] transition-all duration-700"
        style="background-color: var(--dept-color); opacity: 0.05"
      ></div>

      <!-- Contenido hero — alineado arriba izquierda, compacto -->
      <div class="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24 pb-10 sm:pt-28 sm:pb-14 flex flex-col gap-5">

        <!-- Badge live — color dinámico -->
        <div class="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full backdrop-blur-sm dept-badge transition-all duration-500">
          <span class="w-1.5 h-1.5 rounded-full animate-pulse dept-bg" style="box-shadow: 0 0 6px var(--dept-color)"></span>
          <span class="text-[9px] sm:text-[10px] font-black tracking-[0.25em] uppercase dept-text">
            <template v-if="activeDepartment === 'women'">{{ t('store.heroBadgeWomen') }}</template>
            <template v-else-if="activeDepartment === 'merch'">{{ t('store.heroBadgeMerch') }}</template>
            <template v-else-if="activeDepartment === 'all'">{{ t('store.heroBadgeAll') }}</template>
            <template v-else>Medellín · Tienda de Barbería Premium</template>
          </span>
        </div>

        <!-- Título masivo -->
        <div class="flex flex-col gap-0">
          <div class="w-12 h-[3px] dept-bg rounded-full mb-3 transition-all duration-500"></div>
          <!-- Hero Ropa & Merch -->
          <template v-if="activeDepartment === 'merch'">
            <h1 class="font-black tracking-tighter italic leading-[0.92] text-shadow-premium">
              <span
                class="dept-text block text-[2.4rem] xs:text-[2.9rem] sm:text-[4.5rem] lg:text-[6rem] xl:text-[7.5rem] transition-all duration-500"
                style="filter: drop-shadow(0 0 24px var(--dept-glow))"
              >{{ t('store.heroTitleMerch1') }}</span>
              <span class="text-white block text-[2rem] xs:text-[2.4rem] sm:text-[3.5rem] lg:text-[5rem] xl:text-[6rem] leading-none pt-1 sm:pt-3">
                {{ t('store.heroTitleMerch2') }}
              </span>
            </h1>
          </template>
          <!-- Hero femenino -->
          <template v-else-if="activeDepartment === 'women'">
            <h1 class="font-black tracking-tighter italic leading-[0.92] text-shadow-premium">
              <span
                class="dept-text block text-[2.4rem] xs:text-[2.9rem] sm:text-[4.5rem] lg:text-[6rem] xl:text-[7.5rem] transition-all duration-500"
                style="filter: drop-shadow(0 0 24px var(--dept-glow))"
              >{{ t('store.heroTitleWomen1') }}</span>
              <span class="text-white block text-[2rem] xs:text-[2.4rem] sm:text-[3.5rem] lg:text-[5rem] xl:text-[6rem] leading-none pt-1 sm:pt-3">
                {{ t('store.heroTitleWomen2') }}
              </span>
            </h1>
          </template>
          <!-- Hero Ver Todo (Unificado) -->
          <template v-else-if="activeDepartment === 'all'">
            <h1 class="font-black tracking-tighter italic leading-[0.92] text-shadow-premium">
              <span
                class="dept-text block text-[2.8rem] xs:text-[3.2rem] sm:text-[5rem] lg:text-[7rem] xl:text-[8.5rem] transition-all duration-500"
                style="filter: drop-shadow(0 0 24px var(--dept-glow))"
              >{{ t('store.heroTitleAll1') }}</span>
              <span class="text-white block text-[2.2rem] xs:text-[2.7rem] sm:text-[4rem] lg:text-[5.5rem] xl:text-[7rem] leading-none pt-1 sm:pt-3">
                {{ t('store.heroTitleAll2') }}
              </span>
            </h1>
          </template>
          <!-- Hero Barbería (Men) -->
          <template v-else>
            <h1 class="font-black tracking-tighter italic leading-[0.92] text-shadow-premium">
              <span
                class="dept-text block text-[2.8rem] xs:text-[3.2rem] sm:text-[5rem] lg:text-[7rem] xl:text-[8.5rem] transition-all duration-500"
                style="filter: drop-shadow(0 0 24px var(--dept-glow))"
              >{{ t('store.heroTitle1') }}</span>
              <span class="text-white block text-[2.2rem] xs:text-[2.7rem] sm:text-[4rem] lg:text-[5.5rem] xl:text-[7rem] leading-none pt-1 sm:pt-3">
                {{ t('store.heroTitle2') }}
              </span>
            </h1>
          </template>
        </div>

        <!-- Subtítulo -->
        <p class="text-gray-400 text-sm sm:text-base max-w-md leading-relaxed">
          <template v-if="activeDepartment === 'merch'">{{ t('store.heroSubMerch') }}</template>
          <template v-else-if="activeDepartment === 'women'">{{ t('store.heroSubWomen') }}</template>
          <template v-else-if="activeDepartment === 'all'">{{ t('store.heroSubAll') }}</template>
          <template v-else>{{ t('store.heroSub') }}</template>
        </p>

        <!-- Trust badges -->
        <div class="flex flex-wrap gap-x-4 gap-y-2">
          <span v-for="badge in trustBadges" :key="badge"
            class="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-gray-400 font-semibold">
            <fa-icon :icon="['fas', 'circle-check']" class="dept-text text-[9px]" />
            {{ badge }}
          </span>
        </div>
      </div>
    </div>

    <!-- ─── CONTENIDO TIENDA ─── -->
    <!-- Panel que sube sobre el fondo fijo con paleta gris YouTube elevada (#181818) -->
    <div class="relative z-10 bg-[#181818] border-t border-[#303030] rounded-t-[2.5rem] w-full pt-10 pb-12 shadow-[0_-15px_40px_rgba(0,0,0,0.3)]">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">

      <!-- Selector de Universo — 2 niveles: protagonistas arriba, complementarios abajo -->
      <div class="flex flex-col items-center gap-2 mt-2 mb-8">

        <!-- Fila 1: Los protagonistas (Él y Ella) -->
        <div class="inline-flex rounded-xl bg-[#272727] p-1 border border-[#3c3c3c] gap-1 shadow-sm">
          <button
            @click="storeUniverse = 'grooming'; activeDepartment = 'men'; activeFilter = 'all'"
            class="px-5 sm:px-7 py-2.5 rounded-lg font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shrink-0"
            :class="storeUniverse === 'grooming'
              ? 'bg-neon-green text-black shadow-[0_0_14px_rgba(57,255,20,0.25)]'
              : 'text-[#bbbbbb] hover:text-white'"
          >
            <fa-icon :icon="['fas', 'cut']" />
            <span class="hidden sm:inline">Barbería</span>
            <span class="sm:hidden">Él</span>
          </button>
          <button
            @click="storeUniverse = 'beauty'; activeDepartment = 'women'; activeFilter = 'all'"
            class="px-5 sm:px-7 py-2.5 rounded-lg font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shrink-0"
            :class="storeUniverse === 'beauty'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-[0_0_14px_rgba(236,72,153,0.35)]'
              : 'text-[#bbbbbb] hover:text-white'"
          >
            <fa-icon :icon="['fas', 'spa']" />
            <span class="hidden sm:inline">Beauty</span>
            <span class="sm:hidden">Ella</span>
          </button>
        </div>

        <!-- Divisor visual sutil -->
        <div class="flex items-center gap-3 text-[#888888]">
          <span class="h-px w-12 bg-[#3a3a3a]"></span>
          <span class="text-[9px] font-bold tracking-[0.2em] uppercase text-[#b0b0b0]">también</span>
          <span class="h-px w-12 bg-[#3a3a3a]"></span>
        </div>

        <!-- Fila 2: Complementarios (Ropa y Ver Todo) — más pequeños -->
        <div class="inline-flex rounded-lg bg-[#272727] p-0.5 border border-[#3c3c3c] gap-0.5">
          <button
            @click="storeUniverse = 'boutique'; activeDepartment = 'merch'; activeFilter = 'all'"
            class="px-4 sm:px-5 py-1.5 rounded-md font-bold text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 shrink-0"
            :class="storeUniverse === 'boutique'
              ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]'
              : 'text-[#bbbbbb] hover:text-white'"
          >
            <fa-icon :icon="['fas', 'tshirt']" class="text-[8px]" />
            <span>Ropa & Merch</span>
          </button>
          <button
            @click="storeUniverse = 'all'; activeDepartment = 'all'; activeFilter = 'all'"
            class="px-4 sm:px-5 py-1.5 rounded-md font-bold text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 shrink-0"
            :class="storeUniverse === 'all'
              ? 'bg-neon-green text-black font-black shadow-[0_0_14px_rgba(57,255,20,0.3)]'
              : 'text-[#bbbbbb] hover:text-white'"
          >
            <fa-icon :icon="['fas', 'border-all']" class="text-[8px]" />
            <span>Ver Todo</span>
          </button>
        </div>

        <!-- Subtexto contextual -->
        <p v-if="storeUniverse === 'beauty'" class="text-[10px] sm:text-xs font-bold tracking-widest uppercase" style="color: #ec4899">
          ✨ Tu mundo de belleza · Maquillaje, skincare & más
        </p>
        <p v-else-if="storeUniverse === 'boutique'" class="text-[10px] sm:text-xs text-cyan-600/80 uppercase tracking-widest font-bold">
          🔥 Viste con actitud · Colección exclusiva hombre & mujer
        </p>
        <p v-else-if="storeUniverse === 'all'" class="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-bold">
          Catálogo completo · Sin filtros · Todo en un solo lugar
        </p>
        <p v-else class="text-[10px] sm:text-xs text-zinc-500 uppercase tracking-widest font-bold">
          Productos de barbería & cuidado masculino
        </p>
      </div>

      <!-- Buscador Rápido y Botón de Filtros Avanzados -->
      <div class="flex items-center justify-between gap-3 mb-6 max-w-2xl mx-auto">
        <div class="relative flex-1 group">
          <fa-icon :icon="['fas', 'search']" class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-white transition-colors pointer-events-none" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar por nombre o marca..." 
            class="w-full pl-11 pr-10 py-2.5 bg-[#202020] border border-[#383838] rounded-full text-xs sm:text-sm text-[#f1f1f1] placeholder:text-[#999999] focus:outline-none focus:border-[#3ea6ff] transition-all"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-[#bbbbbb] hover:text-white">
            <fa-icon :icon="['fas', 'times-circle']" />
          </button>
        </div>
        <button 
          @click="drawerOpen = true" 
          class="flex items-center gap-2 px-5 py-2.5 bg-[#2c2c2c] hover:bg-[#383838] border border-[#424242] text-[#f1f1f1] rounded-full text-xs font-black uppercase tracking-wider transition-all shadow-sm shrink-0 group"
        >
          <span class="w-5 h-5 rounded-lg dept-bg flex items-center justify-center text-black font-black text-[10px]">⚡</span>
          <span>Filtros</span>
          <span v-if="activeFilterCount > 0" class="w-5 h-5 rounded-full dept-bg text-black font-black text-[10px] flex items-center justify-center animate-pulse">
            {{ activeFilterCount }}
          </span>
        </button>
      </div>



      <!-- Contador -->
      <div class="mb-6 text-center">
        <p class="text-gray-400 text-sm">
          {{ t('tienda.showing') }} <span class="font-bold transition-all duration-500 dept-text">{{ filteredProducts.length }}</span> {{ t('tienda.products') }}
          <span v-if="activeFilter !== 'all'"> {{ t('tienda.in') }} <span class="text-white">{{ activeFilterLabel }}</span></span>
        </p>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-24">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 mb-4 transition-all duration-500 dept-border"></div>
        <p class="text-gray-400 font-medium">{{ t('tienda.loading') }}</p>
      </div>

      <!-- Grid de productos -->
      <TransitionGroup v-else name="products-grid" tag="div"
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
        :class="{'opacity-40 pointer-events-none': isLoading}">
        <div v-for="(product, index) in displayedProducts" :key="product.id"
          :style="isFirstVisit ? { '--i': index } : {}"
          class="group flex flex-col bg-[#252525] border border-[#383838] hover:border-[#525252] rounded-2xl overflow-hidden transition-premium dept-hover-card product-card shadow-[0_4px_16px_rgba(0,0,0,0.22)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.38)] hover:-translate-y-1">

          <!-- Imagen con marco suave y separación elegante -->
          <div class="aspect-square overflow-hidden bg-white relative cursor-pointer flex items-center justify-center p-3.5 border-b border-[#333333]" @click="goToDetail(product)">
            <img
              :src="optimizeImage(product.images && product.images.length > 0 ? product.images[0] : product.image, 400)"
              :srcset="optimizeSrcSet(product.images && product.images.length > 0 ? product.images[0] : product.image, [200, 400])"
              sizes="(max-width: 640px) 200px, 400px"
              :alt="product.name"
              class="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-105"
              :class="{'grayscale opacity-50': product.stock <= 0}"
              width="400"
              height="400"
              :loading="index < 2 ? 'eager' : 'lazy'"
              :fetchpriority="index < 2 ? 'high' : 'auto'"
              decoding="async"
            />
            <div v-if="product.stock <= 0" class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
              <span class="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">{{ t('tienda.soldOut') }}</span>
            </div>
            <div v-else-if="product.stock <= 3" class="absolute top-2 right-2 z-10">
              <span class="bg-yellow-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg animate-pulse">{{ t('tienda.lastItems').replace('{n}', String(product.stock)) }}</span>
            </div>
          </div>

          <!-- Info -->
          <div class="p-4 flex flex-col flex-grow justify-between">
            <div class="cursor-pointer" @click="goToDetail(product)">
              <span class="text-[10px] text-gray-400 uppercase tracking-widest">{{ product.brand }}</span>
              <h2 class="text-sm font-bold text-white transition-colors duration-300 leading-tight mt-0.5 dept-hover-text">
                {{ product.name }}
              </h2>
            </div>
            <div class="flex items-center justify-between mt-4">
              <span class="font-bold text-sm transition-all duration-500 dept-text">
                {{ formatPrice(product.price) }}
              </span>
              <button v-if="product.stock > 0" @click.stop="quickAddToCart(product)"
                :disabled="isStockFull(product)"
                class="w-8 h-8 rounded-full glass flex items-center justify-center transition-all duration-300 text-sm text-white dept-hover-btn"
                :class="isStockFull(product) ? 'opacity-20 cursor-not-allowed' : (justAdded === product.id ? 'dept-bg !text-black' : '')"
                :aria-label="isStockFull(product) ? t('tienda.maxStock') : t('tienda.addToCart')">
                <fa-icon :icon="['fas', isStockFull(product) ? 'lock' : (justAdded === product.id ? 'check' : 'plus')]" class="text-[10px]" />
              </button>
              <button v-else disabled :aria-label="t('tienda.soldOut')" class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-700 cursor-not-allowed">
                <fa-icon :icon="['fas', 'times']" />
              </button>
            </div>
          </div>
        </div>
      </TransitionGroup>

      <!-- Botón Cargar Más Productos (Carga Progresiva) -->
      <div v-if="hasMoreProducts" class="mt-12 flex flex-col items-center justify-center gap-3">
        <div class="text-[11px] text-zinc-400 font-bold uppercase tracking-widest">
          Viendo <span class="dept-text font-black">{{ displayedProducts.length }}</span> de <span class="text-white font-black">{{ filteredProducts.length }}</span> productos
        </div>
        <div class="w-48 h-1 bg-white/10 rounded-full overflow-hidden mb-2">
          <div class="h-full dept-bg transition-all duration-500 rounded-full"
            :style="{ width: `${(displayedProducts.length / filteredProducts.length) * 100}%` }"></div>
        </div>
        <button @click="loadMoreProducts"
          class="px-8 py-3 bg-white/5 border border-white/15 dept-hover-btn text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all duration-300 shadow-lg flex items-center gap-2.5 group"
          style="--hover-border: var(--dept-color)">
          <span>Cargar Más Productos</span>
          <fa-icon :icon="['fas', 'chevron-down']" class="text-[10px] group-hover:translate-y-0.5 transition-transform" />
        </button>
      </div>

      <!-- Error State -->
      <div v-if="errorMessage && !isLoading" class="flex flex-col items-center justify-center py-20 text-center px-4">
        <div class="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl max-w-md">
          <fa-icon :icon="['fas', 'exclamation-triangle']" class="text-red-500 text-3xl mb-4" />
          <h3 class="text-white font-bold mb-2">{{ t('tienda.connError') }}</h3>
          <p class="text-zinc-400 text-sm mb-6">{{ errorMessage }}</p>
          <button @click="fetchData" class="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase transition-all">{{ t('tienda.retry') }}</button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && filteredProducts.length === 0 && !errorMessage" class="text-center py-24">
        <fa-icon :icon="['fas', 'box-open']" class="text-4xl text-gray-600 mb-4" />
        <p class="text-gray-500">{{ t('tienda.emptySub') }}</p>
      </div>

      <!-- Footer (integrado dentro del panel homogéneo de la tienda) -->
      <AppFooter class="mt-14 pt-8 border-t border-white/5" />
      </div><!-- /max-w-7xl -->
    </div><!-- /store panel -->

    <!-- Drawer lateral de Filtros Avanzados -->
    <ClientOnly>
      <ShopFiltersDrawer 
        :is-open="drawerOpen"
        :brands="availableBrands"
        :categories="filters"
        :search-query="searchQuery"
        :selected-brands="selectedBrands"
        :selected-category="activeFilter"
        :sort-by="sortBy"
        @close="drawerOpen = false"
        @update:filters="handleFilterUpdate"
      />
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { useLanguage } from '~/composables/useLanguage'

const route = useRoute()
const router = useRouter()
const { t } = useLanguage()

const { addToCart, isStockFull } = useCart()
const { products, categories, isLoading, error: errorMessage, fetchCatalog } = useCatalog()

const catFilterContainer = ref<HTMLElement | null>(null)

function scrollCategoryFilter(direction: 'left' | 'right') {
  if (!catFilterContainer.value) return
  const amount = 220
  catFilterContainer.value.scrollBy({
    left: direction === 'left' ? -amount : amount,
    behavior: 'smooth'
  })
}

// SEO — tienda como home
useSeoMeta({
  title: 'PersonalBarber — Tienda de Barbería Online | Medellín & Colombia',
  ogTitle: 'PersonalBarber — Tienda de Barbería Online | Medellín & Colombia',
  description: 'Tienda de barbería líder en Medellín y Colombia. Compra productos profesionales para barberos: máquinas WMark, ceras para peinar, minoxidil kirkland, tijeras y servicio de barbería a domicilio. Envíos rápidos a toda Colombia.',
  ogDescription: 'Tienda de barbería profesional en Medellín. Ceras, máquinas, cuidado de barba, minoxidil y skincare. Compra online con envíos a toda Colombia.',
  ogUrl: 'https://personalbarber.co',
})

// JSON-LD — Store + BarberShop + WebSite (Schema unificado)
useHead({
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': ['Store', 'BarberShop'],
          '@id': 'https://personalbarber.co/#store',
          name: 'PersonalBarber — Tienda de Barbería',
          alternateName: ['Personal Barber', 'PersonalBarber Medellín', 'Tienda de Barbería PersonalBarber'],
          description: 'Tienda de barbería líder en Medellín y barbería a domicilio. Productos profesionales e insumos para barberos con envíos a toda Colombia.',
          url: 'https://personalbarber.co',
          telephone: '+573337518070',
          image: 'https://personalbarber.co/og-image.webp',
          priceRange: '$$',
          currenciesAccepted: 'COP',
          paymentAccepted: 'Cash, Transferencia, Nequi, PSE, Wompi',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'La Candelaria',
            addressLocality: 'Medellín',
            addressRegion: 'Antioquia',
            addressCountry: 'CO',
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: 6.2442,
            longitude: -75.5812,
          },
          openingHoursSpecification: [
            {
              '@type': 'OpeningHoursSpecification',
              dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
              opens: '00:00',
              closes: '23:59',
            },
          ],
          sameAs: [
            'https://www.instagram.com/personalbarber.co/',
            'https://www.tiktok.com/@pipehpbarber',
          ],
        },
        {
          '@type': 'WebSite',
          '@id': 'https://personalbarber.co/#website',
          url: 'https://personalbarber.co',
          name: 'PersonalBarber',
          description: 'Tienda de Barbería Online en Medellín y Colombia',
          publisher: {
            '@id': 'https://personalbarber.co/#store',
          },
        }
      ]
    })
  }]
})

import { useDepartment } from '~/composables/useDepartment'

const { activeDepartment, setDepartment } = useDepartment()
const storeUniverse = ref<'grooming' | 'beauty' | 'boutique' | 'all'>('grooming')
const activeFilter = ref('all')
const searchQuery = ref('')
const selectedBrands = ref<string[]>([])
const sortBy = ref('default')
const drawerOpen = ref(false)
const justAdded = ref<string | number | null>(null)
const isFirstVisit = ref(true)

const trustBadges = computed(() => [
  t('tienda.badgeOriginal'),
  t('tienda.badgeShipping'),
  t('tienda.badgeSupport'),
])

function getCategoryLabel(catId: string) {
  const cat = categories.value.find(c => c.id === catId)
  const label = cat ? cat.label : catId
  const key = `tienda.categorias.${catId}`
  const translated = t(key)
  return translated === key ? label : translated
}

// Helper: identifica categorías de ropa/merch/boutique (excluye servicios como micropigmentación)
function isMerchCategory(c: { department: string; style?: string; id: string }) {
  if (c.style === 'premium') return true
  if (c.id === 'boutique') return true
  // Solo prendas de vestir con department 'unisex' o 'merch'
  const clothingIds = ['camisetas', 'gorras', 'shorts', 'accesorios-merch', 'hoodies', 'pantalones']
  if (c.department === 'merch') return true
  if (c.department === 'unisex' && clothingIds.includes(c.id)) return true
  return false
}

const filters = computed(() => [
  { id: 'all', label: t('tienda.all') },
  ...categories.value
    .filter(c => {
      if (c.comingSoon) return false
      if (activeDepartment.value === 'all') return true
      if (activeDepartment.value === 'merch') return isMerchCategory(c)
      return c.department === activeDepartment.value
    })
    .map(c => ({ id: c.id, label: getCategoryLabel(c.id) }))
])

let syncingFromRoute = false

function syncFilter() {
  const cat = route.query.cat as string
  const dept = route.query.dept as string
  syncingFromRoute = true
  if (dept && ['all', 'men', 'women', 'merch'].includes(dept)) {
    activeDepartment.value = dept as 'all' | 'men' | 'merch' | 'women'
  }
  const categoryObj = categories.value.find(c => c.id === cat)
  if (categoryObj) {
    if (categoryObj.department === 'unisex' || categoryObj.style === 'premium' || categoryObj.department === 'merch' || categoryObj.id === 'boutique') {
      activeDepartment.value = 'merch'
    } else if (categoryObj.department && ['men', 'women'].includes(categoryObj.department)) {
      activeDepartment.value = categoryObj.department as 'men' | 'women'
    }
  }
  storeUniverse.value = activeDepartment.value === 'merch' ? 'boutique' : (activeDepartment.value === 'women' ? 'beauty' : activeDepartment.value === 'all' ? 'all' : 'grooming')
  activeFilter.value = (cat && filters.value.find(f => f.id === cat)) ? cat : 'all'
  nextTick(() => { syncingFromRoute = false })
}

function shuffleProducts() {
  if (products.value.length > 0) {
    const shuffled = [...products.value]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    products.value = shuffled
  }
}

async function fetchData() {
  await fetchCatalog(true)
  shuffleProducts()
  syncFilter()
  setTimeout(() => { isFirstVisit.value = false }, 1000)
}

onMounted(async () => {
  await fetchData()
})

watch(categories, syncFilter)

watch(() => route.query.cat, syncFilter)
watch(() => route.query.dept, syncFilter)
watch(activeDepartment, (newDept) => {
  storeUniverse.value = newDept === 'merch' ? 'boutique' : (newDept === 'women' ? 'beauty' : newDept === 'all' ? 'all' : 'grooming')
  if (!syncingFromRoute) activeFilter.value = 'all'
})
watch(activeFilter, (newFilter) => {
  const label = filters.value.find(f => f.id === newFilter)?.label || 'Tienda'
  useSeoMeta({ title: `${label} | PersonalBarber Medellín` })
}, { immediate: false })

const availableBrands = computed(() => {
  const activeDeptCats = categories.value
    .filter(c => {
      if (activeDepartment.value === 'all') return true
      if (activeDepartment.value === 'merch') return isMerchCategory(c)
      return c.department === activeDepartment.value
    })
    .map(c => c.id)
  const list = products.value.filter(p => activeDepartment.value === 'all' || (p.category && activeDeptCats.includes(p.category)))
  const brands = list.map(p => p.brand ? p.brand.trim() : '').filter(Boolean)
  return [...new Set(brands)].sort()
})

const activeFilterCount = computed(() => {
  let count = 0
  if (searchQuery.value) count++
  if (selectedBrands.value.length > 0) count += selectedBrands.value.length
  if (sortBy.value !== 'default') count++
  if (activeFilter.value !== 'all') count++
  return count
})

function handleFilterUpdate(payload: { searchQuery: string; selectedBrands: string[]; selectedCategory: string; sortBy: string }) {
  searchQuery.value = payload.searchQuery
  selectedBrands.value = payload.selectedBrands
  activeFilter.value = payload.selectedCategory
  sortBy.value = payload.sortBy
}

const filteredProducts = computed(() => {
  const activeDeptCats = categories.value
    .filter(c => {
      if (activeDepartment.value === 'all') return true
      if (activeDepartment.value === 'merch') return isMerchCategory(c)
      if (activeDepartment.value === 'women') return c.department === 'women'
      return !c.department || c.department === 'men' || c.department === 'unisex'
    })
    .map(c => c.id)

  let list = products.value.filter(p => {
    if (p.is_active === false) return false
    if (activeDepartment.value === 'all') return true
    if (!p.category) return true
    if (categories.value.length === 0) return true
    return activeDeptCats.includes(p.category)
  })
  
  if (activeFilter.value !== 'all') {
    list = list.filter(p => p.category === activeFilter.value)
  }
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(p => p.name.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)))
  }
  if (selectedBrands.value.length > 0) {
    list = list.filter(p => p.brand && selectedBrands.value.includes(p.brand.trim()))
  }
  
  if (sortBy.value === 'price-asc') {
    list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0))
  } else if (sortBy.value === 'price-desc') {
    list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0))
  }
  
  return list
})

const displayLimit = ref(12)

const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, displayLimit.value)
})

const hasMoreProducts = computed(() => {
  return displayedProducts.value.length < filteredProducts.value.length
})

function loadMoreProducts() {
  displayLimit.value += 12
}

watch([activeFilter, activeDepartment, searchQuery, selectedBrands, sortBy], () => {
  displayLimit.value = 12
})

const activeFilterLabel = computed(() => filters.value.find(f => f.id === activeFilter.value)?.label ?? '')

function goToDetail(product: { id: number; name: string }) {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  router.push({ name: 'tienda-producto-slug', params: { slug: generateProductSlug(product.id, product.name) } })
}

function quickAddToCart(product: Parameters<typeof addToCart>[0]) {
  if (isStockFull(product)) return
  const res = addToCart(product)
  if (res.success) {
    justAdded.value = product.id
    setTimeout(() => { justAdded.value = null }, 2000)
  }
}

if (import.meta.server) {
  await fetchCatalog()
} else {
  fetchCatalog()
}
</script>

<style scoped>
/* Transiciones del grid */
.products-grid-move,
.products-grid-enter-active,
.products-grid-leave-active {
  transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform, opacity;
}
.products-grid-enter-active { transition-delay: calc(var(--i, 0) * 0.04s); z-index: 10; }
.products-grid-enter-from { opacity: 0; transform: translateY(20px) scale(0.95); }
.products-grid-leave-to { opacity: 0; transform: scale(0.9); }
.products-grid-leave-active { position: absolute; width: calc(50% - 1rem); z-index: 0; pointer-events: none; }
@media (min-width: 768px) { .products-grid-leave-active { width: calc(33.333% - 1.5rem); } }
@media (min-width: 1024px) { .products-grid-leave-active { width: calc(25% - 2rem); } }

/* Efecto hover premium en tarjetas de producto */
.product-card {
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
              box-shadow 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
              border-color 0.35s ease;
}
.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45),
              0 0 0 1px rgba(255, 255, 255, 0.08);
}

</style>
