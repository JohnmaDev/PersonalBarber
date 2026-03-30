<template>
  <div class="bg-barber-black min-h-screen text-white relative">
    <!-- Barra de carga global discreta -->
    <transition name="fade">
      <div v-if="isLoading" class="fixed top-0 left-0 w-full h-[2px] z-[100] overflow-hidden">
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

    <!-- Header con back -->
    <div class="sticky top-0 z-30 bg-barber-black/80 backdrop-blur-md border-b border-white/10">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
        <button @click="$router.back()" class="flex-shrink-0 flex items-center gap-1.5 text-gray-400 hover:text-neon-green transition-colors">
          <i class="fas fa-arrow-left text-xs"></i>
          <span class="text-xs font-semibold hidden sm:inline">Volver</span>
          <span class="text-[10px] font-semibold sm:hidden">Volver</span>
        </button>
        <h1 class="text-sm sm:text-lg font-bold tracking-tight sm:tracking-widest uppercase text-white truncate text-center flex-1">
          <span class="text-neon-green">Personal</span>Barber · Tienda
        </h1>
        <div class="w-10 sm:w-16 flex-shrink-0"></div>
      </div>
    </div>

    <!-- Estado de carga (Spinner legacy removido, ahora usa Neon Bar + Opacidad) -->
    <div v-if="isLoading && !product" class="flex flex-col items-center justify-center min-h-[60vh]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green mb-4"></div>
      <p class="text-gray-400 font-medium">Cargando detalles...</p>
    </div>

    <!-- Contenido principal -->
    <div 
      v-else-if="product" 
      class="max-w-5xl mx-auto px-4 py-6 md:py-10 pb-56 transition-opacity duration-500"
      :class="{'opacity-40 pointer-events-none': isLoading}"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">

        <!-- Galería de imágenes (Modo Carrusel para móvil) -->
        <div class="md:sticky md:top-24 flex flex-col gap-4">
          <div 
            ref="carouselRef"
            @scroll="handleScroll"
            class="w-full aspect-square rounded-3xl overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth hide-scrollbar border border-white/10 bg-white/5 shadow-2xl flex items-center"
          >
            <div 
              v-for="(img, idx) in product.images" 
              :key="idx"
              class="w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-2"
            >
              <img
                :src="optimizeImage(img, 800)"
                :alt="product.name + ' ' + idx"
                class="w-full h-full object-contain sm:object-cover rounded-2xl"
                loading="lazy"
              />
            </div>
            <!-- Fallback si no hay imágenes -->
            <div v-if="!product.images || product.images.length === 0" class="w-full h-full flex items-center justify-center">
              <img src="/placeholder-product.webp" alt="Sin imagen" class="w-full h-full object-cover">
            </div>
          </div>
          
          <!-- Dots indicadores (Solo móvil) -->
          <div v-if="product.images && product.images.length > 1" class="flex justify-center gap-2 sm:hidden mt-[-10px] pb-2">
            <div 
              v-for="(_, idx) in product.images" 
              :key="idx"
              class="w-1.5 h-1.5 rounded-full transition-all duration-300"
              :class="activeIdx === idx ? 'bg-neon-green w-4' : 'bg-white/20'"
            ></div>
          </div>
          
          <!-- Miniaturas (Desktop y Móvil alternativo) -->
          <div v-if="product.images && product.images.length > 1" class="hidden sm:flex flex-wrap gap-3">
            <button 
              v-for="(img, idx) in product.images" 
              :key="idx"
              @click="scrollToImage(idx)"
              class="w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0"
              :class="activeIdx === idx ? 'border-neon-green scale-105' : 'border-transparent opacity-60 hover:opacity-100'"
            >
              <img :src="optimizeImage(img, 100)" :alt="product.name + ' ' + idx" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Info del producto -->
        <div class="flex flex-col gap-6">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <router-link to="/" class="hover:text-neon-green transition-colors">Inicio</router-link>
            <span>/</span>
            <router-link to="/tienda" class="hover:text-neon-green transition-colors">Tienda</router-link>
            <span>/</span>
            <span class="text-gray-400">{{ product.name }}</span>
          </div>

          <!-- Marca y nombre -->
          <div>
            <span class="text-neon-green text-xs font-bold tracking-widest uppercase">{{ product.brand }}</span>
            <h1 class="text-3xl font-black text-white mt-1 leading-tight tracking-tight">{{ product.name }}</h1>
          </div>

          <!-- Precio -->
          <div class="flex items-baseline gap-3">
            <span class="text-4xl font-black text-neon-green">{{ formatPrice(product.price) }}</span>
          </div>

          <!-- Descripción -->
          <div class="bg-white/5 rounded-2xl p-5 border border-white/10">
            <h3 class="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2">Descripción</h3>
            <p class="text-gray-300 leading-relaxed text-sm">{{ product.description }}</p>
          </div>

          <!-- Detalles adicionales -->
          <div class="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3">
            <h3 class="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Detalles</h3>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Marca</span>
              <span class="text-white font-semibold">{{ product.brand }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Categoría</span>
              <span class="text-white font-semibold capitalize">{{ getCategoryLabel(product.category) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500 font-bold">Estado</span>
              <span v-if="product.stock > 3" class="text-neon-green font-black italic uppercase tracking-tighter">✓ Disponible</span>
              <span v-else-if="product.stock > 0" class="text-amber-500 font-black animate-pulse italic uppercase tracking-tighter">⚡ Solo quedan {{ product.stock }} en stock</span>
              <span v-else class="text-red-500 font-black uppercase tracking-widest bg-red-500/10 px-2 rounded">✗ Agotado</span>
            </div>
          </div>

          <!-- Selector de cantidad -->
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-400 font-semibold">Cantidad</span>
            <div class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <button
                @click="qty = Math.max(1, qty - 1)"
                class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white font-bold"
              >−</button>
              <span class="text-white font-bold w-6 text-center">{{ qty }}</span>
              <button
                @click="qty < (product.stock - getProductQty(product.id)) ? qty++ : null"
                :disabled="qty >= (product.stock - getProductQty(product.id))"
                class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed"
              >+</button>
            </div>
          </div>

          <!-- CTAs -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="handleAddToCart"
              :disabled="product.stock <= 0 || isStockFull(product)"
              class="flex-1 py-4 glass border border-neon-green/50 hover:border-neon-green text-neon-green font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-30 disabled:border-white/10 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <i class="fas fa-shopping-bag"></i>
              {{ product.stock <= 0 ? 'Sin Stock' : (isStockFull(product) ? 'Límite en Carrito' : 'Agregar al Carrito') }}
            </button>
            <button
              @click="handleBuyNow"
              :disabled="product.stock <= 0 || isStockFull(product)"
              class="flex-1 py-4 bg-neon-green hover:bg-neon-green-dark text-black font-black rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed"
            >
              <i class="fas fa-bolt"></i>
              {{ isStockFull(product) ? 'Límite Alcanzado' : 'Comprar Ahora' }}
            </button>
          </div>

          <!-- Confirmación de adición -->
          <transition name="confirm-fade">
            <div
              v-if="showConfirm"
              class="flex items-center gap-2 text-green-400 text-sm font-semibold bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3"
            >
              <i class="fas fa-check-circle"></i>
              ¡Producto agregado al carrito!
            </div>
          </transition>

          <!-- Garantías -->
          <div class="grid grid-cols-3 gap-2 sm:gap-3 mt-4">
            <div v-for="badge in badges" :key="badge.label" class="flex flex-col items-center gap-1 text-center p-2 sm:p-3 glass rounded-xl border border-white/5">
              <i :class="badge.icon" class="text-neon-green text-base sm:text-lg"></i>
              <span class="text-gray-400 text-[9px] sm:text-[10px] leading-tight">{{ badge.label }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Otros productos recomendados -->
      <div v-if="recommendedProducts.length > 0" class="mt-20">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h2 class="text-xl font-black uppercase tracking-tight text-white">Recomendados para ti</h2>
            <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Completa tu kit de barbería</p>
          </div>
          <div class="h-px flex-1 bg-white/10 mx-6 hidden sm:block"></div>
          <router-link to="/tienda" class="text-neon-green text-sm font-bold hover:underline">Tienda →</router-link>
        </div>
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <router-link
            v-for="item in recommendedProducts"
            :key="item.id"
            :to="{ name: 'ProductDetail', params: { slug: generateProductSlug(item.id, item.name) } }"
            class="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-neon-green/50 transition-all duration-300"
          >
            <div class="aspect-square overflow-hidden bg-white/5">
              <img :src="optimizeImage(item.images && item.images.length > 0 ? item.images[0] : item.image, 400)" :alt="item.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div class="p-4">
              <h4 class="text-xs font-bold text-white group-hover:text-neon-green transition-colors line-clamp-1">{{ item.name }}</h4>
              <p class="text-neon-green font-bold text-xs mt-1">{{ formatPrice(item.price) }}</p>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Explorar otras categorías -->
      <div class="mt-20 pt-10 border-t border-white/10">
        <h2 class="text-xl font-black uppercase tracking-tight text-white mb-6">Explorar por categoría</h2>
        <div class="flex flex-wrap gap-3">
          <router-link
            v-for="cat in availableCategories"
            :key="cat.id"
            :to="{ path: '/tienda', query: { cat: cat.id } }"
            class="px-5 py-3 rounded-2xl glass border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-neon-green hover:border-neon-green/50 transition-all duration-300"
          >
            {{ cat.label }}
          </router-link>
        </div>
      </div>
    </div>

    <!-- Producto no encontrado -->
    <div v-else class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <i class="fas fa-box-open text-4xl text-gray-600"></i>
      <p class="text-gray-500">Producto no encontrado.</p>
      <router-link to="/tienda" class="text-neon-green hover:underline text-sm font-bold">← Volver a la tienda</router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart.js'
import { useCatalog } from '@/composables/useCatalog.js'
import { formatPrice, generateProductSlug } from '@/utils/format.js'
import { optimizeImage } from '@/utils/image.js'

const route = useRoute()
const router = useRouter()
const { addToCart, getProductQty, isStockFull } = useCart()
const { products, categories, isLoading, fetchCatalog } = useCatalog()

async function fetchProducts() {
  await fetchCatalog()
}

onMounted(() => {
  fetchProducts()
})


// Producto reactivo basado en el slug de la URL
const product = computed(() => products.value.find(p => p.id === parseInt(route.params.slug, 10)))

const activeDepartment = computed(() => {
  if (!product.value || categories.value.length === 0) return 'men'
  const cat = categories.value.find(c => c.id === product.value.category)
  return cat ? cat.department : 'men'
})

// SEO: Actualizar título dinámicamente
watch(product, (newProd) => {
  if (newProd) {
    document.title = `${newProd.name} | PersonalBarber`;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", `${newProd.name} de ${newProd.brand}. ${newProd.description.substring(0, 150)}...`);
    }
  }
}, { immediate: true })
const qty = ref(1)
const showConfirm = ref(false)
const carouselRef = ref(null)
const activeIdx = ref(0)

function handleScroll(e) {
  const container = e.target
  const scrollLeft = container.scrollLeft
  const itemWidth = container.offsetWidth
  activeIdx.value = Math.round(scrollLeft / itemWidth)
}

function scrollToImage(idx) {
  if (!carouselRef.value) return
  const itemWidth = carouselRef.value.offsetWidth
  carouselRef.value.scrollTo({
    left: idx * itemWidth,
    behavior: 'smooth'
  })
  activeIdx.value = idx
}

// Resetear cantidad e imagen cuando cambia el producto
watch(() => route.params.slug, () => {
  qty.value = 1
  activeIdx.value = 0
  if (carouselRef.value) carouselRef.value.scrollLeft = 0
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

const recommendedProducts = computed(() => {
  if (!product.value || products.value.length === 0) return []
  
  // 2 del mismo tipo (Up-sell)
  const sameCategory = products.value
    .filter(p => p.category === product.value.category && p.id !== product.value.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)

  // 2 de otras categorías (Cross-sell)
  const otherCategories = products.value
    .filter(p => p.category !== product.value.category)
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)

  return [...sameCategory, ...otherCategories]
})

const availableCategories = computed(() => categories.value.filter(c => c.id !== 'all'))

function getCategoryLabel(catId) {
  return categories.value.find(c => c.id === catId)?.label ?? catId
}

const handleAddToCart = () => {
      const result = addToCart(product.value, qty.value)
      if (result.success) {
        showConfirm.value = true
        qty.value = 1 // Reseteamos cantidad tras agregar
        setTimeout(() => showConfirm.value = false, 3000)
      }
    }

function handleBuyNow() {
  if (!product.value) return
  addToCart(product.value, qty.value)
  router.push('/checkout')
}

const badges = [
  { icon: 'fas fa-shield-alt', label: 'Productos originales' },
  { icon: 'fas fa-truck', label: 'Envío disponible' },
  { icon: 'fas fa-comments', label: 'Soporte directo' },
]
</script>

<style scoped>
.confirm-fade-enter-active, .confirm-fade-leave-active { transition: all 0.3s ease; }
.confirm-fade-enter-from, .confirm-fade-leave-to { opacity: 0; transform: translateY(-6px); }

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
