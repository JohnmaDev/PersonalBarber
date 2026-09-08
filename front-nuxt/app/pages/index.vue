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
          style="filter: brightness(0.22) saturate(0.8)"
          fetchpriority="high"
        />
      </picture>
      <!-- Vignette lateral izquierda -->
      <div class="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40"></div>
      <!-- Fade gradual hacia abajo conforme el usuario scrollea -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black"></div>
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
    <!-- Panel que sube sobre el fondo fijo -->
    <div class="relative z-10 bg-barber-black/85 backdrop-blur-sm rounded-t-[2rem] w-full pt-8 pb-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6">

      <!-- Selector de Universo — 2 niveles: protagonistas arriba, complementarios abajo -->
      <div class="flex flex-col items-center gap-2 mt-2 mb-8">

        <!-- Fila 1: Los protagonistas (Él y Ella) -->
        <div class="inline-flex rounded-xl bg-zinc-900/90 p-1 border border-zinc-800 gap-1 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
          <button
            @click="selectUniverse('grooming')"
            class="px-5 sm:px-7 py-2.5 rounded-lg font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shrink-0"
            :class="storeUniverse === 'grooming'
              ? 'bg-neon-green text-black shadow-[0_0_14px_rgba(57,255,20,0.25)]'
              : 'text-zinc-500 hover:text-white'"
          >
            <fa-icon :icon="['fas', 'cut']" />
            <span class="hidden sm:inline">Barbería</span>
            <span class="sm:hidden">Él</span>
          </button>
          <button
            @click="selectUniverse('beauty')"
            class="px-5 sm:px-7 py-2.5 rounded-lg font-black text-[11px] sm:text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 shrink-0"
            :class="storeUniverse === 'beauty'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-[0_0_14px_rgba(236,72,153,0.35)]'
              : 'text-zinc-500 hover:text-white'"
          >
            <fa-icon :icon="['fas', 'spa']" />
            <span class="hidden sm:inline">Beauty</span>
            <span class="sm:hidden">Ella</span>
          </button>
        </div>

        <!-- Divisor visual sutil -->
        <div class="flex items-center gap-3 text-zinc-700">
          <span class="h-px w-12 bg-zinc-800"></span>
          <span class="text-[9px] font-bold tracking-[0.2em] uppercase text-zinc-600">también</span>
          <span class="h-px w-12 bg-zinc-800"></span>
        </div>

        <!-- Fila 2: Complementarios (Ropa y Ver Todo) — más pequeños -->
        <div class="inline-flex rounded-lg bg-zinc-900/60 p-0.5 border border-zinc-800/60 gap-0.5">
          <button
            @click="selectUniverse('boutique')"
            class="px-4 sm:px-5 py-1.5 rounded-md font-bold text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 shrink-0"
            :class="storeUniverse === 'boutique'
              ? 'bg-cyan-400/20 text-cyan-400 border border-cyan-400/30 shadow-[0_0_10px_rgba(34,211,238,0.15)]'
              : 'text-zinc-600 hover:text-zinc-300'"
          >
            <fa-icon :icon="['fas', 'tshirt']" class="text-[8px]" />
            <span>Ropa & Merch</span>
          </button>
          <button
            @click="selectUniverse('all')"
            class="px-4 sm:px-5 py-1.5 rounded-md font-bold text-[9px] sm:text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-1.5 shrink-0"
            :class="storeUniverse === 'all'
              ? 'bg-neon-green text-black font-black shadow-[0_0_14px_rgba(57,255,20,0.3)]'
              : 'text-zinc-600 hover:text-zinc-300'"
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


      <!-- Buscador Rápido unificado -->
      <div class="mb-4 max-w-2xl mx-auto">
        <div class="relative group">
          <fa-icon :icon="['fas', 'search']" class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors pointer-events-none" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar por nombre, marca o características..." 
            class="w-full pl-11 pr-10 py-2.5 bg-zinc-900/90 border border-zinc-800 rounded-2xl text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]"
          />
          <button v-if="searchQuery" @click="searchQuery = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-1">
            <fa-icon :icon="['fas', 'times-circle']" />
          </button>
        </div>
      </div>

      <!-- Barra de Acción: Conteo de productos + Botón [Filtros] + [Ordenar: Recomendados ▾] -->
      <div id="catalogo-toolbar" class="flex items-center justify-between gap-3 mb-5 py-2.5 px-1 border-b border-zinc-800/60 scroll-mt-24">
        <!-- Conteo de productos encontrados -->
        <div class="flex items-center gap-2">
          <span class="text-xs sm:text-sm font-bold text-zinc-300">
            <span class="dept-text font-black">{{ filteredProducts.length }}</span>
            <span class="text-zinc-400 font-normal"> productos</span>
            <span v-if="activeCategoryLabel" class="text-zinc-500 font-normal hidden xs:inline"> en <strong class="text-zinc-200">{{ activeCategoryLabel }}</strong></span>
          </span>
        </div>

        <!-- Acciones: Botón [ Filtros ] + Dropdown [ Ordenar: ... ▾ ] -->
        <div class="flex items-center gap-2 sm:gap-3 ml-auto">
          <!-- Botón Filtros con contador activo -->
          <button 
            @click="drawerOpen = true" 
            class="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm group"
            aria-label="Abrir filtros"
          >
            <fa-icon :icon="['fas', 'sliders-h']" class="text-[11px] dept-text transition-transform group-hover:scale-110" />
            <span>Filtros</span>
            <span v-if="drawerFiltersActiveCount > 0" class="w-4 h-4 rounded-full dept-bg text-black font-black text-[10px] flex items-center justify-center">
              {{ drawerFiltersActiveCount }}
            </span>
          </button>

          <!-- Dropdown Ordenar separado -->
          <div class="relative flex items-center">
            <label for="sort-select" class="text-[11px] font-bold text-zinc-400 hidden sm:inline mr-1.5 whitespace-nowrap">Ordenar:</label>
            <div class="relative">
              <select
                id="sort-select"
                v-model="sortBy"
                class="appearance-none bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white text-xs font-bold rounded-xl pl-3 pr-8 py-2 focus:outline-none focus:border-zinc-500 transition-all cursor-pointer shadow-sm"
              >
                <option v-for="opt in sortOptions" :key="opt.id" :value="opt.id" class="bg-zinc-950 text-white">
                  {{ opt.label }}
                </option>
              </select>
              <fa-icon :icon="['fas', 'chevron-down']" class="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <!-- Chips de Filtros Activos -->
      <ActiveFilterChips :chips="activeChips" @remove="removeChip" @clear-all="resetAllFilters" />

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
          class="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-premium dept-hover-card product-card">

          <!-- Imagen -->
          <div class="aspect-square overflow-hidden bg-white relative cursor-pointer flex items-center justify-center p-3" @click="goToDetail(product)">
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

      <!-- Empty State con botón de restablecer -->
      <div v-if="!isLoading && filteredProducts.length === 0 && !errorMessage" class="text-center py-20 bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8 max-w-md mx-auto my-6">
        <fa-icon :icon="['fas', 'box-open']" class="text-4xl text-gray-500 mb-3" />
        <h3 class="text-base font-bold text-white mb-1">No se encontraron productos</h3>
        <p class="text-gray-400 text-xs mb-5">Prueba cambiando los términos de búsqueda o limpiando los filtros seleccionados.</p>
        <button
          @click="resetAllFilters"
          class="px-5 py-2.5 rounded-xl dept-bg text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:brightness-110 active:scale-95"
        >
          Restablecer todos los filtros
        </button>
      </div>

      <!-- Footer (integrado dentro del panel homogéneo de la tienda) -->
      <AppFooter class="mt-14 pt-8 border-t border-white/5" />
      </div><!-- /max-w-7xl -->
    </div><!-- /store panel -->

    <!-- Drawer lateral de Filtros -->
    <ClientOnly>
      <ShopFiltersDrawer 
        :is-open="drawerOpen"
        :categories-with-counts="categoriesWithCounts"
        :brands-with-counts="availableBrandsWithCounts"
        :subtypes-with-counts="availableSubtypesWithCounts"
        :selected-brands="selectedBrands"
        :selected-category="activeCategory"
        :selected-product-type="selectedProductType"
        :min-price="minPrice"
        :max-price="maxPrice"
        :price-bounds="priceBounds"
        :in-stock-only="inStockOnly"
        :total-matching-products="filteredProducts.length"
        @close="onDrawerClose"
        @update:filters="handleFilterUpdate"
        @reset="resetAllFilters"
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
import { useProductFilters, SORT_OPTIONS, type SortOptionId } from '~/composables/useProductFilters'
import { CANONICAL_CATEGORIES, type CanonicalCategoryId } from '~/utils/taxonomy'

const { activeDepartment, setDepartment } = useDepartment()
const storeUniverse = ref<'grooming' | 'beauty' | 'boutique' | 'all'>('grooming')
const drawerOpen = ref(false)
const justAdded = ref<string | number | null>(null)
const isFirstVisit = ref(true)

const sortOptions = SORT_OPTIONS

const trustBadges = computed(() => [
  t('tienda.badgeOriginal'),
  t('tienda.badgeShipping'),
  t('tienda.badgeSupport'),
])

// ─── Motor Centralizado de Filtros Facetados ───
const {
  activeCategory,
  searchQuery,
  selectedBrands,
  minPrice,
  maxPrice,
  inStockOnly,
  sortBy,
  selectedProductType,
  priceBounds,
  availableBrandsWithCounts,
  categoriesWithCounts,
  availableSubtypesWithCounts,
  filteredProducts,
  activeFiltersCount,
  activeChips,
  setCategory,
  toggleBrand,
  setPriceRange,
  setProductType,
  removeChip,
  resetAllFilters,
} = useProductFilters(products)

const activeCategoryLabel = computed(() => {
  if (activeCategory.value === 'all') return ''
  const cat = CANONICAL_CATEGORIES.find(c => c.id === activeCategory.value)
  return cat ? cat.label : ''
})

// Conteo de filtros aplicados dentro del drawer (categoría, marcas, precio, stock, subtipo)
const drawerFiltersActiveCount = computed(() => {
  let count = 0
  if (activeCategory.value !== 'all') count++
  if (selectedBrands.value.length > 0) count += selectedBrands.value.length
  if (minPrice.value !== null || maxPrice.value !== null) count++
  if (inStockOnly.value) count++
  if (selectedProductType.value !== null) count++
  return count
})

function handleFilterUpdate(payload: {
  selectedCategory: string
  selectedBrands: string[]
  selectedProductType: string | null
  minPrice: number | null
  maxPrice: number | null
  inStockOnly: boolean
}) {
  if (payload.selectedCategory !== activeCategory.value) {
    setCategory(payload.selectedCategory as CanonicalCategoryId | 'all')
  }
  selectedBrands.value = payload.selectedBrands
  selectedProductType.value = payload.selectedProductType
  minPrice.value = payload.minPrice
  maxPrice.value = payload.maxPrice
  inStockOnly.value = payload.inStockOnly
}

// Control de paginación progresiva ("Cargar Más")
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

watch(
  [activeCategory, searchQuery, selectedBrands, minPrice, maxPrice, inStockOnly, sortBy, selectedProductType],
  () => {
    displayLimit.value = 12
  }
)

function selectUniverse(universe: 'grooming' | 'beauty' | 'boutique' | 'all') {
  storeUniverse.value = universe
  if (universe === 'grooming') {
    setDepartment('men')
    if (activeCategory.value === 'planchas') {
      setCategory('all')
    }
  } else if (universe === 'beauty') {
    setDepartment('women')
    setCategory('planchas')
  } else if (universe === 'boutique') {
    setDepartment('merch')
    setCategory('all')
  } else {
    setDepartment('all')
    setCategory('all')
  }
}

// Sincronización de departamento y SEO dinámico por categoría
watch(
  activeCategory,
  (newCat) => {
    if (newCat === 'planchas') {
      setDepartment('women')
      storeUniverse.value = 'beauty'
      useSeoMeta({ title: 'Planchas | PersonalBarber Medellín' })
    } else if (newCat !== 'all') {
      setDepartment('men')
      storeUniverse.value = 'grooming'
      const cat = CANONICAL_CATEGORIES.find(c => c.id === newCat)
      if (cat) {
        useSeoMeta({ title: `${cat.label} | PersonalBarber Medellín` })
      }
    } else {
      useSeoMeta({ title: 'PersonalBarber — Tienda de Barbería Online | Medellín & Colombia' })
    }
  },
  { immediate: false }
)

// Helper para generar slug de producto
const generateProductSlug = (id: number | string, name: string) => {
  const cleanName = (name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${id}-${cleanName}`
}

async function fetchData() {
  await fetchCatalog(true)
  setTimeout(() => { isFirstVisit.value = false }, 1000)
}

onMounted(async () => {
  await fetchData()
  if (import.meta.client && (route.query.cat || route.query.brand || route.query.type || route.query.min || route.query.max || route.query.stock)) {
    setTimeout(() => {
      scrollToProductsToolbar()
    }, 300)
  }
})

function onDrawerClose() {
  drawerOpen.value = false
  if (import.meta.client) {
    setTimeout(() => {
      scrollToProductsToolbar()
    }, 50)
  }
}

function scrollToProductsToolbar() {
  if (!import.meta.client) return
  const el = document.getElementById('catalogo-toolbar')
  if (el) {
    const rect = el.getBoundingClientRect()
    // Si la barra del catálogo está fuera de la zona visible superior, desplazar suavemente
    if (rect.top < 60 || rect.top > 350) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

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
