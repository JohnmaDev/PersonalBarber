<template>
  <div class="bg-barber-black min-h-screen text-white">
    <!-- Header fijo con back -->
    <div class="sticky top-0 z-30 bg-barber-black/80 backdrop-blur-md border-b border-white/10">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
        <router-link to="/" class="flex-shrink-0 flex items-center gap-1.5 text-gray-400 hover:text-barber-gold transition-colors duration-300">
          <i class="fas fa-arrow-left text-xs"></i>
          <span class="text-xs font-semibold hidden sm:inline">Inicio</span>
          <span class="text-[10px] font-semibold sm:hidden">Inicio</span>
        </router-link>
        <h1 class="text-sm sm:text-lg font-bold tracking-tight sm:tracking-widest uppercase text-white truncate text-center flex-1">
          <span class="text-barber-gold">Personal</span>Barber · Tienda
        </h1>
        <div class="w-10 sm:w-16 flex-shrink-0"></div><!-- spacer -->
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 pb-20 pt-8">

      <!-- Filtros de categoría -->
      <div class="flex flex-wrap gap-3 mb-10 justify-center">
        <button
          v-for="f in filters"
          :key="f.id"
          @click="activeFilter = f.id"
          :class="[
            'px-5 py-2 rounded-full text-sm font-bold tracking-wide border transition-all duration-300',
            activeFilter === f.id
              ? 'bg-barber-gold text-black border-barber-gold'
              : 'glass border-white/20 text-gray-300 hover:border-barber-gold/50 hover:text-white'
          ]"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Contador + título -->
      <div class="mb-6 text-center">
        <p class="text-gray-500 text-sm">
          Mostrando <span class="text-barber-gold font-bold">{{ filteredProducts.length }}</span> productos
          <span v-if="activeFilter !== 'all'"> en <span class="text-white">{{ activeFilterLabel }}</span></span>
        </p>
      </div>

      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-24">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-barber-gold mb-4"></div>
        <p class="text-gray-400 font-medium">Cargando productos...</p>
      </div>

      <!-- Grid de productos -->
      <transition-group v-else name="products-grid" tag="div" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        <div
          v-for="(product, index) in filteredProducts"
          :key="product.id"
          :style="isFirstVisit ? { '--i': index } : {}"
          class="group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-barber-gold/50 transition-all duration-500"
        >
          <!-- Imagen – clic navega al detalle -->
          <div class="aspect-square overflow-hidden bg-white/5 cursor-pointer" @click="goToDetail(product)">
            <img
              :src="product.images && product.images.length > 0 ? product.images[0] : '/placeholder-product.webp'"
              :alt="product.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          </div>

          <!-- Info -->
          <div class="p-4 flex flex-col flex-grow justify-between">
            <div class="cursor-pointer" @click="goToDetail(product)">
              <span class="text-[10px] text-gray-500 uppercase tracking-widest">{{ product.brand }}</span>
              <h3 class="text-sm font-bold text-white group-hover:text-barber-gold transition-colors duration-300 leading-tight mt-0.5">
                {{ product.name }}
              </h3>
              <p class="text-gray-500 text-xs mt-1.5 leading-relaxed line-clamp-2 italic">
                {{ product.description }}
              </p>
            </div>
            <div class="flex items-center justify-between mt-4">
              <span class="text-barber-gold font-bold text-sm">{{ product.price }}</span>
              <!-- Botón agregar al carrito rápido -->
              <button
                @click.stop="quickAddToCart(product)"
                class="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-barber-gold hover:text-black transition-all duration-300 text-sm"
                :class="justAdded === product.id ? 'bg-barber-gold text-black' : ''"
                :aria-label="'Agregar ' + product.name + ' al carrito'"
              >
                <i :class="justAdded === product.id ? 'fas fa-check' : 'fas fa-plus'"></i>
              </button>
            </div>
          </div>
        </div>
      </transition-group>

      <!-- Error State -->
      <div v-if="errorMessage && !isLoading" class="flex flex-col items-center justify-center py-20 text-center px-4">
        <div class="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl max-w-md">
          <i class="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
          <h3 class="text-white font-bold mb-2">Error de Conexión</h3>
          <p class="text-zinc-400 text-sm mb-6">{{ errorMessage }}</p>
          <button @click="fetchProducts" class="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase transition-all">
            Reintentar
          </button>
        </div>
      </div>

      <!-- Estado vacío (por si acaso) -->
      <div v-if="!isLoading && filteredProducts.length === 0 && !errorMessage" class="text-center py-24">
        <i class="fas fa-box-open text-4xl text-gray-600 mb-4"></i>
        <p class="text-gray-500">No hay productos en esta categoría aún.</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StoreView'
}
</script>

<script setup>
import { ref, computed, onMounted, watch, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categories } from '@/data/products.js'
import { useCart } from '@/composables/useCart.js'

const products = ref([])
const isLoading = ref(true)
const errorMessage = ref(null)

const route = useRoute()
const router = useRouter()
const { addToCart } = useCart()

const filters = [
  { id: 'all', label: 'Todos' },
  ...categories.filter(c => !c.comingSoon).map(c => ({ id: c.id, label: c.label }))
]

const activeFilter = ref('all')
const justAdded = ref(null)
const isFirstVisit = ref(true)

function syncFilter() {
  const cat = route.query.cat
  activeFilter.value = (cat && filters.find(f => f.id === cat)) ? cat : 'all'
}

async function fetchProducts() {
  isLoading.value = true
  errorMessage.value = null
  try {
    const res = await fetch('/api/get_products')
    const contentType = res.headers.get('content-type')
    
    if (!res.ok) {
      const text = await res.text()
      errorMessage.value = `Error ${res.status}: ${text.substring(0, 50)}...`
      return
    }

    if (!contentType || !contentType.includes('application/json')) {
      const text = await res.text()
      errorMessage.value = `Respuesta no válida (no es JSON): ${text.substring(0, 50)}...`
      return
    }

    const data = await res.json()
    if (data.ok) {
      products.value = data.products
    } else {
      errorMessage.value = data.error || 'Error desconocido'
    }
  } catch (err) {
    errorMessage.value = 'Fallo la conexión o error de red'
    console.error('Error:', err)
  } finally {
    isLoading.value = false
  }
  // Marcamos que ya pasó la primera carga después de un breve delay
  setTimeout(() => {
    isFirstVisit.value = false
  }, 1000)
}

onMounted(() => {
  syncFilter()
  fetchProducts()
})

// SEO: Título dinámico por categoría
watch(activeFilter, (newFilter) => {
  const label = filters.find(f => f.id === newFilter)?.label || 'Tienda';
  document.title = `${label} | PersonalBarber`;
}, { immediate: true })

onActivated(() => {
  // Aseguramos que el filtro esté sincronizado al volver del caché
  syncFilter()
})

watch(() => route.query.cat, syncFilter)

const filteredProducts = computed(() => {
  if (activeFilter.value === 'all') return products.value
  return products.value.filter(p => p.category === activeFilter.value)
})

const activeFilterLabel = computed(() => {
  return filters.find(f => f.id === activeFilter.value)?.label ?? ''
})

function goToDetail(product) {
  router.push({ name: 'ProductDetail', params: { id: product.id } })
}

function quickAddToCart(product) {
  addToCart(product, 1)
  justAdded.value = product.id
  setTimeout(() => { justAdded.value = null }, 1500)
}
</script>

<style scoped>
/* 
  Efecto Optimizado: Máximo Rendimiento (60fps)
  Eliminamos 'all', 'blur' y 'rotateX' que consumen mucha CPU/GPU.
  Limitamos a 'transform' y 'opacity' que son acelerados por hardware.
*/

.products-grid-move,
.products-grid-enter-active,
.products-grid-leave-active {
  /* Solo animamos propiedades que no activan "layout" ni "paint" */
  transition: opacity 0.5s ease-out, transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  will-change: transform, opacity;
}

.products-grid-enter-active {
  /* Retraso secuencial sutil */
  transition-delay: calc(var(--i) * 0.04s);
  z-index: 10;
}

.products-grid-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.products-grid-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.products-grid-leave-active {
  position: absolute;
  width: calc(50% - 1rem); 
  z-index: 0;
  /* Evitamos que el elemento que sale siga procesando animaciones de hover */
  pointer-events: none;
}

@media (min-width: 768px) {
  .products-grid-leave-active { width: calc(33.333% - 1.5rem); }
}

@media (min-width: 1024px) {
  .products-grid-leave-active { width: calc(25% - 2rem); }
}
</style>
