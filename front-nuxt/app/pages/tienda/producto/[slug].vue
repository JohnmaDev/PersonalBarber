<template>
  <div class="min-h-screen text-white relative pt-16 font-sans">
    <!-- Fondo fijo de piedra — consistencia con homepage -->
    <div class="fixed inset-0 z-0 pointer-events-none">
      <picture>
        <source media="(max-width: 640px) and (orientation: portrait)" srcset="/bg_vertical_mobile.webp">
        <source media="(orientation: landscape)" srcset="/bg_horizontal.webp">
        <img
          src="/bg_vertical.webp"
          alt=""
          aria-hidden="true"
          class="w-full h-full object-cover object-top"
          style="filter: brightness(0.2) saturate(0.7)"
          loading="eager"
        />
      </picture>
      <div class="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30"></div>
      <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
    </div>
    <!-- Barra de carga dinámica -->
    <Transition name="fade">
      <div v-if="isLoading" class="fixed top-0 left-0 w-full h-[2px] z-[100] overflow-hidden">
        <div class="h-full animate-progress-bar dept-bg dept-glow-sm"></div>
      </div>
    </Transition>

    <div v-if="isLoading && !product" class="relative z-10 flex flex-col items-center justify-center min-h-[70vh]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 dept-border mb-4"></div>
      <p class="text-[#A1A1AA] font-medium tracking-widest text-xs uppercase">{{ t('tienda.loading') }}</p>
    </div>

    <div v-else-if="product" class="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8 pb-36 lg:pb-16 transition-opacity duration-500" :class="{'opacity-40 pointer-events-none': isLoading}">
      
      <!-- 1. BREADCRUMB (minimalista) -->
      <nav class="flex items-center gap-2 text-[10px] md:text-[11px] text-[#555] uppercase tracking-[0.18em] font-bold mb-10">
        <NuxtLink to="/" class="hover:dept-text transition-colors duration-200">Tienda</NuxtLink>
        <span class="text-[#333]">›</span>
        <NuxtLink :to="{ path: '/', query: { cat: normalizedCategory } }" class="hover:dept-text transition-colors duration-200">{{ categoryLabel }}</NuxtLink>
        <span class="text-[#333]">›</span>
        <span class="text-[#A1A1AA] truncate max-w-[200px] sm:max-w-[400px]">{{ product.name }}</span>
      </nav>

      <!-- Main Grid: imagen izquierda + info derecha -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">

        <!-- Columna IZQUIERDA: Imagen + Miniaturas -->
        <div class="flex flex-col gap-4 md:col-span-6 lg:col-span-6 md:sticky md:top-24">
          <div class="relative w-full aspect-square sm:aspect-[4/4.5] bg-white rounded-3xl border border-white/10 overflow-hidden group shadow-[0_10px_40px_rgba(0,0,0,0.5)]">
            <div ref="carouselRef" @scroll="handleScroll" class="w-full h-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth hide-scrollbar flex">
              <div v-for="(img, idx) in (product.images?.length ? product.images : ['/hero_barber.webp'])" :key="idx" class="w-full h-full flex-shrink-0 snap-center bg-white p-3 sm:p-5 flex items-center justify-center">
                <img :src="optimizeImage(img, 800)" :alt="`${product.name} ${idx + 1}`" class="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-105" width="800" height="900" :loading="idx === 0 ? 'eager' : 'lazy'" :fetchpriority="idx === 0 ? 'high' : 'auto'" decoding="async" />
              </div>
            </div>
          </div>

          <!-- Carrusel de Miniaturas -->
          <div v-if="product.images && product.images.length > 1" class="flex gap-2 overflow-x-auto hide-scrollbar py-1">
            <button v-for="(img, idx) in product.images" :key="idx" @click="scrollToImage(idx)"
              class="relative w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 bg-white"
              :class="activeIdx === idx ? 'dept-border dept-glow-sm' : 'border-[#262626] opacity-50 hover:opacity-100 hover:border-gray-500'">
              <img :src="optimizeImage(img, 150)" :alt="`Thumb ${idx + 1}`" class="w-full h-full object-contain p-1" width="64" height="64" loading="lazy" decoding="async" />
            </button>
          </div>
        </div>

        <!-- Columna DERECHA: Información y compra -->
        <div class="flex flex-col gap-7 md:col-span-6 lg:col-span-6">
          <!-- Títulos y Precio -->
          <div>
            <div class="flex items-center gap-3 mb-3">
              <span class="dept-text text-[10px] font-black tracking-widest uppercase dept-badge px-2.5 py-1 rounded-md">{{ product.brand || 'Premium' }}</span>
              <span class="text-[#A1A1AA] text-[10px] font-bold tracking-widest uppercase">{{ getCategoryLabel(product.category) }}</span>
            </div>
            <h1 class="text-3xl lg:text-4xl font-black font-oswald tracking-tight leading-[1.1] mb-4 text-white drop-shadow-md">
              {{ product.name }}
            </h1>
            <div class="flex items-end gap-4 mt-2">
              <span class="text-4xl lg:text-5xl font-black dept-text tracking-tighter" style="filter: drop-shadow(0 0 12px var(--dept-glow))">
                {{ formatPrice(product.price) }}
              </span>
              <span v-if="product.comparePrice" class="text-xl text-[#A1A1AA] line-through font-bold mb-1">
                {{ formatPrice(product.comparePrice) }}
              </span>
            </div>
          </div>

          <!-- SELECTOR DE VARIANTES (Capsule Pills — estilo Sephora) -->
          <div v-if="product.variants && product.variants.length > 0" class="space-y-3">
            <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">Presentación</span>
            <div class="flex flex-wrap gap-2">
              <button v-for="(variant, vIdx) in product.variants" :key="vIdx"
                @click="selectedVariant = vIdx"
                class="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300"
                :class="selectedVariant === vIdx
                  ? 'border dept-border dept-glow-sm dept-text' + ' bg-[color-mix(in_srgb,var(--dept-color)_10%,transparent)]'
                  : 'border border-[#262626] bg-transparent text-[#A1A1AA] hover:border-[#555] hover:text-white'">
                {{ variant }}
              </button>
            </div>
          </div>

          <!-- SELECTOR DE CANTIDAD + STOCK (inline, limpio) -->
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <span class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#A1A1AA]">Cantidad</span>
              <div class="flex items-center border border-[#262626] rounded-full">
                <button @click="qty = Math.max(1, qty - 1)" class="w-9 h-9 rounded-full hover:bg-white/5 flex items-center justify-center transition-all text-[#A1A1AA] hover:text-white">−</button>
                <span class="text-white font-black w-8 text-center text-sm tabular-nums">{{ qty }}</span>
                <button @click="qty < (product.stock - getProductQty(product.id)) ? qty++ : null"
                  :disabled="qty >= (product.stock - getProductQty(product.id))"
                  class="w-9 h-9 rounded-full hover:bg-white/5 flex items-center justify-center transition-all dept-text disabled:opacity-30 disabled:cursor-not-allowed">+</button>
              </div>
            </div>
            <span v-if="product.stock > 5" class="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-wider">En Stock</span>
            <span v-else-if="product.stock > 0" class="text-[10px] text-amber-500 font-bold uppercase tracking-wider animate-pulse">¡Últimas {{ product.stock }} uds!</span>
            <span v-else class="text-[10px] text-red-500 font-bold uppercase tracking-wider">Agotado</span>
          </div>

          <!-- CTAs -->
          <div class="flex flex-col gap-3">
            <button @click="handleBuyNow" :disabled="product.stock <= 0 || isStockFull(product)"
              class="w-full py-4 dept-bg hover:opacity-90 text-black font-black uppercase tracking-widest text-sm rounded-2xl transition-all duration-300 dept-glow-md hover:dept-glow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed">
              <fa-icon :icon="['fas', 'bolt']" class="text-lg" />
              {{ product.stock <= 0 ? 'Agotado' : 'Comprar Ahora' }}
            </button>
            <button @click="handleAddToCart" :disabled="product.stock <= 0 || isStockFull(product)"
              class="w-full py-4 bg-transparent border-2 border-[#262626] hover:dept-border text-white hover:dept-text font-bold uppercase tracking-widest text-xs rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed group">
              <fa-icon :icon="['fas', 'shopping-bag']" class="group-hover:animate-bounce" />
              Agregar al Carrito
            </button>
            <Transition name="fade">
              <div v-if="showConfirm" class="text-center text-[10px] font-bold dept-text tracking-widest uppercase mt-1">
                ✓ Producto agregado exitosamente
              </div>
            </Transition>
          </div>

          <!-- WIDGET DE CONFIANZA Y LOGÍSTICA -->
          <div class="grid grid-cols-3 gap-3">
            <div class="bg-[#161616]/90 border border-[#262626] rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-2 group hover:dept-border/50 transition-colors">
              <div class="w-8 h-8 rounded-full bg-[#0D0D0D] flex items-center justify-center border border-[#262626] group-hover:dept-border transition-colors">
                <fa-icon :icon="['fas', 'shield-alt']" class="dept-text text-xs" />
              </div>
              <span class="text-[9px] text-[#A1A1AA] uppercase tracking-wider font-bold leading-tight">Garantía<br>Real</span>
            </div>
            <div class="bg-[#161616]/90 border border-[#262626] rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-2 group hover:dept-border/50 transition-colors">
              <div class="w-8 h-8 rounded-full bg-[#0D0D0D] flex items-center justify-center border border-[#262626] group-hover:dept-border transition-colors">
                <fa-icon :icon="['fas', 'truck-fast']" class="dept-text text-xs" />
              </div>
              <span class="text-[9px] text-[#A1A1AA] uppercase tracking-wider font-bold leading-tight">Despacho<br>Inmediato</span>
            </div>
            <div class="bg-[#161616]/90 border border-[#262626] rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-2 group hover:dept-border/50 transition-colors">
              <div class="w-8 h-8 rounded-full bg-[#0D0D0D] flex items-center justify-center border border-[#262626] group-hover:dept-border transition-colors">
                <fa-icon :icon="['fas', 'credit-card']" class="dept-text text-xs" />
              </div>
              <span class="text-[9px] text-[#A1A1AA] uppercase tracking-wider font-bold leading-tight">Pago<br>Seguro</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. SECCIÓN INFERIOR: Acordeones + Recomendados -->
      <div v-if="hasDescriptionContent || hasSpecsContent || recommendedProducts.length > 0" class="mt-16 lg:mt-24 space-y-10">

        <!-- Acordeones dinámicos (ancho completo) -->
        <div v-if="hasDescriptionContent || hasSpecsContent" class="space-y-4">
          <!-- Descripción & Beneficios -->
          <div v-if="hasDescriptionContent" class="bg-[#161616]/90 border border-[#262626] rounded-3xl overflow-hidden">
            <button @click="expandedAccordion = expandedAccordion === 'desc' ? '' : 'desc'" class="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors duration-300">
              <span class="font-oswald text-lg font-bold uppercase tracking-[0.08em] text-white">Descripción & Beneficios</span>
              <fa-icon :icon="['fas', expandedAccordion === 'desc' ? 'minus' : 'plus']" class="dept-text text-sm" />
            </button>
            <div v-show="expandedAccordion === 'desc'" class="px-6 pb-7 pt-3 border-t border-[#262626]/50">
              <p v-if="product.description" class="text-[#D4D4D8] text-[15px] leading-[1.9] whitespace-pre-line tracking-[0.01em]" style="font-family: 'Source Serif 4', Georgia, serif; font-weight: 300;">{{ product.description }}</p>
              <ul v-if="product.benefits && product.benefits.length > 0" class="mt-5 space-y-3">
                <li v-for="(benefit, bIdx) in product.benefits" :key="bIdx" class="flex items-start gap-3">
                  <span class="dept-text text-xs mt-1 shrink-0">✓</span>
                  <span class="text-[#D4D4D8] text-[15px] leading-[1.8]" style="font-family: 'Source Serif 4', Georgia, serif; font-weight: 300;">{{ benefit }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Modo de Uso / Especificaciones -->
          <div v-if="hasSpecsContent" class="bg-[#161616]/90 border border-[#262626] rounded-3xl overflow-hidden">
            <button @click="expandedAccordion = expandedAccordion === 'specs' ? '' : 'specs'" class="w-full px-6 py-5 flex items-center justify-between hover:bg-white/5 transition-colors duration-300">
              <span class="font-oswald text-lg font-bold uppercase tracking-[0.08em] text-white">Modo de Uso / Especificaciones</span>
              <fa-icon :icon="['fas', expandedAccordion === 'specs' ? 'minus' : 'plus']" class="dept-text text-sm" />
            </button>
            <div v-show="expandedAccordion === 'specs'" class="px-6 pb-7 pt-3 border-t border-[#262626]/50">
              <p v-if="product.usage" class="text-[#D4D4D8] text-[15px] leading-[1.9] whitespace-pre-line tracking-[0.01em]" style="font-family: 'Source Serif 4', Georgia, serif; font-weight: 300;">{{ product.usage }}</p>
              <p v-if="product.specs" class="text-[#D4D4D8] text-[15px] leading-[1.9] whitespace-pre-line tracking-[0.01em]" style="font-family: 'Source Serif 4', Georgia, serif; font-weight: 300;" :class="product.usage ? 'mt-5 pt-5 border-t border-[#262626]/30' : ''">{{ product.specs }}</p>
            </div>
          </div>
        </div>

        <!-- CARRUSEL: Explora el Catálogo (todos los productos de la tienda) -->
        <div v-if="exploreStoreProducts.length > 0" class="mt-2">
          <!-- Header -->
          <div class="flex items-center justify-between mb-5">
            <div>
              <p class="text-[10px] dept-text font-bold uppercase tracking-[0.2em] mb-0.5">Catálogo PersonalBarber</p>
              <h3 class="font-oswald text-2xl font-bold uppercase tracking-tight text-white">Explora Más Productos</h3>
            </div>
            <div class="flex items-center gap-3">
              <NuxtLink to="/" class="text-xs dept-text hover:text-white font-bold uppercase tracking-widest transition-colors flex items-center gap-1.5 bg-[#161616] border border-[#262626] hover:dept-border px-3.5 py-2 rounded-xl">
                <span>Ver Tienda Completa</span>
                <fa-icon :icon="['fas', 'arrow-right']" class="text-[10px]" />
              </NuxtLink>
              <!-- Flechas desktop -->
              <div class="hidden sm:flex gap-2">
                <button @click="scrollCarousel('related', -1)"
                  class="w-10 h-10 rounded-full border border-[#262626] bg-[#161616] hover:dept-border hover:dept-bg/10 flex items-center justify-center transition-all duration-200 group">
                  <fa-icon :icon="['fas', 'arrow-left']" class="text-[#A1A1AA] group-hover:dept-text text-xs" />
                </button>
                <button @click="scrollCarousel('related', 1)"
                  class="w-10 h-10 rounded-full border border-[#262626] bg-[#161616] hover:dept-border hover:dept-bg/10 flex items-center justify-center transition-all duration-200 group">
                  <fa-icon :icon="['fas', 'arrow-right']" class="text-[#A1A1AA] group-hover:dept-text text-xs" />
                </button>
              </div>
            </div>
          </div>
          <!-- Scroll track -->
          <div ref="relatedRef" class="flex gap-4 overflow-x-auto hide-scrollbar pb-2 scroll-smooth items-stretch">
            <NuxtLink v-for="item in exploreStoreProducts" :key="item.id"
              :to="{ name: 'tienda-producto-slug', params: { slug: generateProductSlug(item.id, item.name) } }"
              class="group flex-shrink-0 w-[200px] sm:w-[220px] bg-[#111] border border-[#1E1E1E] hover:dept-border/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,255,0,0.08)]">
              <!-- Imagen -->
              <div class="w-full aspect-square bg-white overflow-hidden">
                <img :src="optimizeImage(item.images?.[0] || item.image, 300)" :alt="item.name"
                  class="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105" width="300" height="300" loading="lazy" decoding="async" />
              </div>
              <!-- Info -->
              <div class="p-3">
                <p class="text-[9px] text-[#555] font-bold uppercase tracking-widest mb-1 truncate">{{ item.brand }}</p>
                <h4 class="text-xs font-semibold text-[#D4D4D8] group-hover:text-white transition-colors line-clamp-2 leading-snug mb-3" style="font-family: 'Source Serif 4', serif;">{{ item.name }}</h4>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-black dept-text">{{ formatPrice(item.price) }}</span>
                  <button @click.prevent="addToCart(item, 1)"
                    class="w-7 h-7 rounded-full bg-[#0D0D0D] border border-[#262626] hover:dept-border hover:dept-bg/10 flex items-center justify-center transition-all">
                    <fa-icon :icon="['fas', 'plus']" class="text-[#555] group-hover:dept-text text-[9px]" />
                  </button>
                </div>
              </div>
            </NuxtLink>

            <!-- Card final: Volver al inicio de la Tienda -->
            <NuxtLink to="/"
              class="group flex-shrink-0 w-[180px] sm:w-[200px] bg-[#161616] border border-[#262626] hover:dept-border rounded-2xl p-5 flex flex-col items-center justify-center text-center gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,255,0,0.12)] min-h-full">
              <div class="w-12 h-12 rounded-full bg-[#0D0D0D] border border-[#262626] group-hover:dept-border flex items-center justify-center dept-text transition-colors">
                <fa-icon :icon="['fas', 'store']" class="text-lg" />
              </div>
              <div>
                <p class="text-xs font-bold text-white group-hover:dept-text transition-colors uppercase font-oswald tracking-wider">Ver Todo el Catálogo</p>
                <p class="text-[10px] text-[#A1A1AA] mt-1">Ir a la página principal de la tienda</p>
              </div>
              <span class="text-[10px] font-black dept-text uppercase tracking-widest mt-1 group-hover:underline">Ver Todo →</span>
            </NuxtLink>
          </div>
        </div>

        <!-- CARRUSEL: De la misma marca -->
        <div v-if="sameBrandProducts.length > 0" class="mt-2">
          <!-- Header -->
          <div class="flex items-center justify-between mb-5">
            <div>
              <p class="text-[10px] dept-text font-bold uppercase tracking-[0.2em] mb-0.5">{{ product.brand }}</p>
              <h3 class="font-oswald text-2xl font-bold uppercase tracking-tight text-white">De la Misma Marca</h3>
            </div>
            <!-- Flechas desktop -->
            <div class="hidden sm:flex gap-2">
              <button @click="scrollCarousel('brand', -1)"
                class="w-10 h-10 rounded-full border border-[#262626] bg-[#161616] hover:dept-border hover:dept-bg/10 flex items-center justify-center transition-all duration-200 group">
                <fa-icon :icon="['fas', 'arrow-left']" class="text-[#A1A1AA] group-hover:dept-text text-xs" />
              </button>
              <button @click="scrollCarousel('brand', 1)"
                class="w-10 h-10 rounded-full border border-[#262626] bg-[#161616] hover:dept-border hover:dept-bg/10 flex items-center justify-center transition-all duration-200 group">
                <fa-icon :icon="['fas', 'arrow-right']" class="text-[#A1A1AA] group-hover:dept-text text-xs" />
              </button>
            </div>
          </div>
          <!-- Scroll track -->
          <div ref="brandRef" class="flex gap-4 overflow-x-auto hide-scrollbar pb-2 scroll-smooth">
            <NuxtLink v-for="item in sameBrandProducts" :key="item.id"
              :to="{ name: 'tienda-producto-slug', params: { slug: generateProductSlug(item.id, item.name) } }"
              class="group flex-shrink-0 w-[200px] sm:w-[220px] bg-[#111] border border-[#1E1E1E] hover:dept-border/30 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,255,0,0.08)]">
              <!-- Imagen -->
              <div class="w-full aspect-square bg-white overflow-hidden">
                <img :src="optimizeImage(item.images?.[0] || item.image, 300)" :alt="item.name"
                  class="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-105" width="300" height="300" loading="lazy" decoding="async" />
              </div>
              <!-- Info -->
              <div class="p-3">
                <p class="text-[9px] text-[#555] font-bold uppercase tracking-widest mb-1 truncate">{{ item.brand }}</p>
                <h4 class="text-xs font-semibold text-[#D4D4D8] group-hover:text-white transition-colors line-clamp-2 leading-snug mb-3" style="font-family: 'Source Serif 4', serif;">{{ item.name }}</h4>
                <div class="flex items-center justify-between">
                  <span class="text-sm font-black dept-text">{{ formatPrice(item.price) }}</span>
                  <button @click.prevent="addToCart(item, 1)"
                    class="w-7 h-7 rounded-full bg-[#0D0D0D] border border-[#262626] hover:dept-border hover:dept-bg/10 flex items-center justify-center transition-all">
                    <fa-icon :icon="['fas', 'plus']" class="text-[#555] group-hover:dept-text text-[9px]" />
                  </button>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>

      </div>
    </div>

    <!-- Producto no encontrado -->
    <div v-else class="relative z-10 flex flex-col items-center justify-center min-h-[70vh] gap-4">
      <fa-icon :icon="['fas', 'unlink']" class="text-5xl text-[#262626]" />
      <p class="text-[#A1A1AA] font-bold tracking-widest uppercase text-xs">{{ t('tienda.emptyTitle') }}</p>
      <NuxtLink to="/" class="dept-text hover:text-white border dept-border hover:dept-bg/10 rounded-xl px-6 py-2 transition-all text-xs font-black uppercase tracking-widest mt-2">← Volver al Catálogo</NuxtLink>
    </div>

    <!-- 5. COMPONENTE MÓVIL EXCLUSIVO (Sticky Bottom Bar) -->
    <Transition name="slide-up">
      <div v-if="product && !isLoading" class="lg:hidden fixed bottom-0 left-0 w-full z-50 bg-[#161616]/95 backdrop-blur-xl border-t border-[#262626] p-4 pb-safe flex items-center justify-between gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
        <div class="flex items-center gap-3 flex-1 min-w-0">
          <div class="w-10 h-10 rounded-lg overflow-hidden bg-[#0D0D0D] border border-[#262626] shrink-0 hidden sm:block">
            <img :src="optimizeImage(product.images?.[0] || product.image, 100)" :alt="product.name" class="w-full h-full object-cover" width="40" height="40" loading="lazy" decoding="async" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[10px] text-[#A1A1AA] font-bold uppercase tracking-widest truncate">{{ product.name }}</p>
            <p class="text-sm font-black dept-text">{{ formatPrice(product.price) }}</p>
          </div>
        </div>
        <button @click="handleBuyNow" :disabled="product.stock <= 0" class="shrink-0 dept-bg text-black font-black uppercase tracking-widest text-[10px] sm:text-xs px-5 py-3 rounded-xl dept-glow-sm disabled:bg-zinc-800 disabled:text-zinc-600 disabled:shadow-none transition-all">
          {{ product.stock > 0 ? 'Comprar' : 'Agotado' }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/composables/useCatalog'
import { useLanguage } from '~/composables/useLanguage'
import { useDepartment } from '~/composables/useDepartment'
import { formatPrice } from '~/utils/format'
import { optimizeImage } from '~/utils/image'
import { normalizeProductCategory, CANONICAL_CATEGORIES } from '~/utils/taxonomy'

const route = useRoute()
const router = useRouter()
const { addToCart, getProductQty, isStockFull } = useCart()
const { products, categories, isLoading, fetchCatalog } = useCatalog()
const { t, lang } = useLanguage()
const { setDepartment } = useDepartment()

// Helper simple para slug (puedes reemplazar con el tuyo de utils si existe)
const generateProductSlug = (id: number | string, name: string) => {
  return `${id}-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`
}

const getIdFromSlug = (s: string) => {
  const match = s.match(/^(\d+)-/)
  return match ? parseInt(match[1], 10) : parseInt(s, 10)
}

const slug = computed(() => route.params.slug as string)
const productId = computed(() => getIdFromSlug(slug.value))

const product = computed(() => products.value.find(p => p.id === productId.value) as Product | undefined)

const normalizedCategory = computed(() => {
  if (!product.value) return 'ceras'
  return normalizeProductCategory(product.value)
})

const categoryLabel = computed(() => {
  const cat = CANONICAL_CATEGORIES.find(c => c.id === normalizedCategory.value)
  return cat ? cat.label : normalizedCategory.value
})

watchEffect(() => {
  if (product.value && categories.value.length > 0) {
    const cat = categories.value.find(c => c.id === product.value!.category)
    if (cat && cat.department) {
      setDepartment(cat.department)
    }
  }
})

// SEO dinámico de alta conversión
watchEffect(() => {
  if (product.value) {
    const brand = product.value.brand ? ` — ${product.value.brand}` : ''
    const title = `${product.value.name}${brand} | Tienda de Barbería Medellín`
    const cleanDesc = String(product.value.description || '').replace(/\s+/g, ' ').trim()
    const description = `Compra ${product.value.name} en PersonalBarber Medellín. ${cleanDesc.substring(0, 130)}... Envíos a toda Colombia. 100% original.`
    const image = product.value.images?.[0] || product.value.image || 'https://personalbarber.co/og-image.webp'

    useSeoMeta({
      title,
      ogTitle: title,
      description,
      ogDescription: description,
      ogImage: image,
      keywords: `${product.value.name}, ${product.value.brand || 'PersonalBarber'}, comprar ${product.value.name} medellin, tienda de barberia medellin, productos de barberia colombia`,
    })

    useHead({
      link: [
        { rel: 'canonical', href: `https://personalbarber.co/tienda/producto/${slug.value}` }
      ],
      script: [{
        key: 'product-ld',
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.value.name,
          description: product.value.description,
          brand: { '@type': 'Brand', name: product.value.brand || 'PersonalBarber' },
          image: product.value.images || [product.value.image],
          url: `https://personalbarber.co/tienda/producto/${slug.value}`,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'COP',
            price: String(product.value.price).replace(/\D/g, ''),
            priceValidUntil: '2027-12-31',
            itemCondition: 'https://schema.org/NewCondition',
            availability: product.value.stock > 0
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
            seller: {
              '@type': 'Store',
              name: 'PersonalBarber',
              url: 'https://personalbarber.co'
            },
          }
        })
      }]
    })
  }
})

// UI State
const qty = ref(1)
const showConfirm = ref(false)
const carouselRef = ref<HTMLElement | null>(null)
const activeIdx = ref(0)
const selectedVariant = ref(0)
const expandedAccordion = ref('desc')

// Dynamic accordion visibility — only render if backend has content
const hasDescriptionContent = computed(() => {
  if (!product.value) return false
  return !!(product.value.description?.trim() || (product.value.benefits && product.value.benefits.length > 0))
})

const hasSpecsContent = computed(() => {
  if (!product.value) return false
  return !!(product.value.usage?.trim() || product.value.specs?.trim())
})

function handleScroll(e: Event) {
  const container = e.target as HTMLElement
  activeIdx.value = Math.round(container.scrollLeft / container.offsetWidth)
}

function scrollToImage(idx: number) {
  if (!carouselRef.value) return
  carouselRef.value.scrollTo({ left: idx * carouselRef.value.offsetWidth, behavior: 'smooth' })
  activeIdx.value = idx
}

onMounted(() => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
})

watch(() => route.params.slug, () => {
  qty.value = 1
  activeIdx.value = 0
  selectedVariant.value = 0
  expandedAccordion.value = 'desc'
  if (carouselRef.value) carouselRef.value.scrollLeft = 0
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'instant' })
})

// Refs para los carruseles
const relatedRef = ref<HTMLElement | null>(null)
const brandRef = ref<HTMLElement | null>(null)

function scrollCarousel(type: 'related' | 'brand', dir: 1 | -1) {
  const el = type === 'related' ? relatedRef.value : brandRef.value
  if (!el) return
  el.scrollBy({ left: dir * 240, behavior: 'smooth' })
}

// Todos los productos de la tienda (misma categoría primero, luego el resto)
const exploreStoreProducts = computed(() => {
  if (!product.value || products.value.length === 0) return []
  const sameCat = products.value.filter(p => p.category === product.value!.category && p.id !== product.value!.id)
  const otherCat = products.value.filter(p => p.category !== product.value!.category && p.id !== product.value!.id)
  return [...sameCat, ...otherCat]
})

// Productos de la misma marca (sin el actual)
const sameBrandProducts = computed(() => {
  if (!product.value || !product.value.brand || products.value.length === 0) return []
  return products.value
    .filter(p => p.brand && p.brand.toLowerCase() === product.value!.brand!.toLowerCase() && p.id !== product.value!.id)
    .slice(0, 12)
})

// Mantener backward-compat
const recommendedProducts = computed(() => exploreStoreProducts.value.slice(0, 3))

function getCategoryLabel(catId: string) {
  const cat = categories.value.find(c => c.id === catId)
  return cat ? cat.label : catId
}

function handleAddToCart() {
  if (!product.value) return
  const result = addToCart(product.value as Parameters<typeof addToCart>[0], qty.value)
  if (result.success) {
    showConfirm.value = true
    qty.value = 1
    setTimeout(() => { showConfirm.value = false }, 3000)
  }
}

function handleBuyNow() {
  if (!product.value) return
  addToCart(product.value as Parameters<typeof addToCart>[0], qty.value)
  router.push('/checkout')
}

if (import.meta.server) {
  await fetchCatalog()
} else {
  fetchCatalog()
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease; }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(100%); opacity: 0; }

.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

.pb-safe { padding-bottom: env(safe-area-inset-bottom, 1rem); }
</style>
