<template>
  <div class="bg-barber-black min-h-screen text-white relative">
    <!-- Barra de carga global discreta -->
    <transition name="fade">
      <div v-if="isLoading" class="fixed top-0 left-0 w-full h-[2px] z-[100] overflow-hidden">
        <div 
          class="h-full animate-progress-bar transition-colors duration-500"
          :class="currentTheme.bar"
        ></div>
      </div>
    </transition>
    <!-- Header fijo con back -->
    <div class="sticky top-0 z-30 bg-barber-black/80 backdrop-blur-md border-b border-white/10">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
        <router-link to="/" class="flex-shrink-0 flex items-center gap-1.5 text-gray-400 hover:text-neon-green transition-colors duration-300">
          <i class="fas fa-arrow-left text-xs"></i>
          <span class="text-xs font-semibold hidden sm:inline">Inicio</span>
          <span class="text-[10px] font-semibold sm:hidden">Inicio</span>
        </router-link>
        <h1 class="text-sm sm:text-lg font-bold tracking-tight sm:tracking-widest uppercase text-white truncate text-center flex-1 transition-colors duration-500">
          <span :class="currentTheme.text">Personal</span>Barber · Tienda
        </h1>
        <div class="w-10 sm:w-16 flex-shrink-0"></div><!-- spacer -->
      </div>
    </div>

    <div class="max-w-6xl mx-auto px-4 pb-20 pt-8">

      <!-- Switch de Departamento -->
      <div class="flex justify-center mt-2 mb-8 fade-in">
        <div class="inline-flex bg-zinc-900 rounded-full p-1 border border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]">
          <button 
            @click="activeDepartment = 'men'; activeFilter = 'all'"
            :class="[
              'px-4 sm:px-6 py-2 rounded-full font-black tracking-widest text-[10px] sm:text-xs uppercase transition-all duration-300 flex items-center gap-2',
              activeDepartment === 'men' ? 'bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]' : 'text-zinc-500 hover:text-white'
            ]"
          >
            <i class="fas fa-cut"></i> <span class="hidden xs:inline">Para Él</span><span class="xs:hidden">Él</span>
          </button>
          <button 
            @click="activeDepartment = 'merch'; activeFilter = 'all'"
            :class="[
              'px-4 sm:px-6 py-2 rounded-full font-black tracking-widest text-[10px] sm:text-xs uppercase transition-all duration-300 flex items-center gap-2',
              activeDepartment === 'merch' ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'text-zinc-500 hover:text-white'
            ]"
          >
            <i class="fas fa-tshirt"></i> <span class="hidden xs:inline">Merch</span><span class="xs:hidden">Ropa</span>
          </button>
          <button 
            @click="activeDepartment = 'women'; activeFilter = 'all'"
            :class="[
              'px-4 sm:px-6 py-2 rounded-full font-black tracking-widest text-[10px] sm:text-xs uppercase transition-all duration-300 flex items-center gap-2',
              activeDepartment === 'women' ? 'bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'text-zinc-500 hover:text-white'
            ]"
          >
            <i class="fas fa-spa"></i> <span class="hidden xs:inline">Para Ella</span><span class="xs:hidden">Ella</span>
          </button>
        </div>
      </div>

      <!-- Filtros de categoría -->
      <div class="flex flex-wrap gap-3 mb-10 justify-center">
        <button
          v-for="f in filters"
          :key="f.id"
          @click="activeFilter = f.id"
          :class="[
            'px-5 py-2 rounded-full text-sm font-bold tracking-wide border transition-all duration-300',
            activeFilter === f.id
              ? (activeDepartment === 'men' ? 'bg-neon-green text-black border-neon-green' : (activeDepartment === 'merch' ? 'bg-cyan-400 text-black border-cyan-400' : 'bg-pink-500 text-white border-pink-500'))
              : (activeDepartment === 'men' ? 'glass border-white/20 text-gray-300 hover:border-neon-green/50 hover:text-white' : (activeDepartment === 'merch' ? 'glass border-white/20 text-gray-300 hover:border-cyan-400/50 hover:text-white' : 'glass border-white/20 text-gray-300 hover:border-pink-500/50 hover:text-white'))
          ]"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Contador + título -->
      <div class="mb-6 text-center">
        <p class="text-gray-500 text-sm">
          Mostrando <span class="font-bold transition-colors duration-300" :class="currentTheme.text">{{ filteredProducts.length }}</span> productos
          <span v-if="activeFilter !== 'all'"> en <span class="text-white">{{ activeFilterLabel }}</span></span>
        </p>
      </div>

      <!-- Estado de carga -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-24">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 mb-4 transition-colors duration-300" :class="currentTheme.border"></div>
        <p class="text-gray-400 font-medium">Cargando productos...</p>
      </div>

      <!-- Grid de productos -->
      <transition-group 
        v-else 
        name="products-grid" 
        tag="div" 
        class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-500"
        :class="{'opacity-40 pointer-events-none': isLoading}"
      >
        <div
          v-for="(product, index) in filteredProducts"
          :key="product.id"
          :style="isFirstVisit ? { '--i': index } : {}"
          :class="[
            'group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-500',
            currentTheme.hoverBorder
          ]"
        >
          <!-- Imagen – clic navega al detalle -->
          <div 
            class="aspect-square overflow-hidden bg-white/5 relative cursor-pointer"
            @click="goToDetail(product)"
          >
              <img 
                :src="optimizeImage(product.images?.[0] || product.image, 400)" 
                :alt="product.name" 134:                 class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                :class="{'grayscale opacity-50': product.stock <= 0}"
                loading="lazy" 
              />
              <!-- Stock Badges -->
              <div v-if="product.stock <= 0" class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <span class="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">Agotado</span>
              </div>
              <div v-else-if="product.stock <= 3" class="absolute top-2 right-2">
                <span class="bg-yellow-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg animate-pulse">¡Últimas {{ product.stock }}!</span>
              </div>
            </div>

          <!-- Info -->
          <div class="p-4 flex flex-col flex-grow justify-between">
            <div class="cursor-pointer" @click="goToDetail(product)">
              <span class="text-[10px] text-gray-500 uppercase tracking-widest">{{ product.brand }}</span>
              <h3 class="text-sm font-bold text-white transition-colors duration-300 leading-tight mt-0.5" :class="currentTheme.hoverText">
                {{ product.name }}
              </h3>
              <p class="text-gray-500 text-xs mt-1.5 leading-relaxed line-clamp-2 italic">
                {{ product.description }}
              </p>
            </div>
            <div class="flex items-center justify-between mt-4">
              <span class="font-bold text-sm transition-colors duration-300" :class="currentTheme.text">{{ formatPrice(product.price) }}</span>
              <!-- Botón agregar al carrito rápido -->
              <button
                v-if="product.stock > 0"
                @click.stop="quickAddToCart(product)"
                :disabled="isStockFull(product)"
                :class="[
                  'w-8 h-8 rounded-full glass flex items-center justify-center transition-all duration-300 text-sm text-white hover:text-black',
                  isStockFull(product)
                    ? 'opacity-20 cursor-not-allowed border-transparent'
                    : (justAdded === product.id ? `${currentTheme.bg} !text-black` : `hover:${currentTheme.bg}`)
                ]"
                :aria-label="isStockFull(product) ? 'Stock máximo alcanzado' : 'Agregar ' + product.name + ' al carrito'"
              >
                <i :class="isStockFull(product) ? 'fas fa-lock text-[10px]' : (justAdded === product.id ? 'fas fa-check' : 'fas fa-plus')"></i>
              </button>
              <button
                v-else
                disabled
                class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-700 cursor-not-allowed"
              >
                <i class="fas fa-times"></i>
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
          <button @click="fetchData" class="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase transition-all">
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
import { ref, computed, onMounted, watch, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart.js'
import { useCatalog } from '@/composables/useCatalog.js'
import { formatPrice, generateProductSlug } from '@/utils/format.js'
import { optimizeImage } from '@/utils/image.js'

export default {
  name: 'StoreView',
  setup() {
    const { products, categories, isLoading, error: errorMessage, fetchCatalog } = useCatalog()

    const route = useRoute()
    const router = useRouter()
    const { addToCart, isStockFull } = useCart()

    const activeDepartment = ref('men')

    const activeDeptCats = computed(() => {
      return categories.value.filter(c => {
        if (c.comingSoon) return false
        if (activeDepartment.value === 'merch') {
          return c.department === 'unisex' || c.style === 'premium'
        }
        return c.department === activeDepartment.value
      })
    })

    const filters = computed(() => [
      { id: 'all', label: 'Todos' },
      ...activeDeptCats.value.map(c => ({ id: c.id, label: c.label }))
    ])

    const activeFilter = ref('all')
    const justAdded = ref(null)
    const isFirstVisit = ref(true)

    // Si cambian de departamento, reseteamos el filtro a "Todos"
    watch(activeDepartment, () => {
      activeFilter.value = 'all'
    })

    function syncFilter() {
      const cat = route.query.cat
      const dept = route.query.dept

      // Sincronizar departamento si viene en la URL
      if (dept && (dept === 'men' || dept === 'women' || dept === 'merch')) {
        activeDepartment.value = dept
      }

      // Determinamos el departamento del filtro por categoría si vino uno
      const categoryObj = categories.value.find(c => c.id === cat)
      if (categoryObj && categoryObj.department) {
        if (categoryObj.department !== 'unisex') {
          activeDepartment.value = categoryObj.department
        }
      }
      activeFilter.value = (cat && filters.value.find(f => f.id === cat)) ? cat : 'all'
    }

    async function fetchData() {
      await fetchCatalog()
      syncFilter()
      setTimeout(() => {
        isFirstVisit.value = false
      }, 1000)
    }

    onMounted(() => {
      fetchData()
    })

    // SEO: Título dinámico por categoría
    watch(activeFilter, (newFilter) => {
      const label = filters.value.find(f => f.id === newFilter)?.label || 'Tienda';
      document.title = `${label} | PersonalBarber Medellín`;
    }, { immediate: true })

    onActivated(() => {
      // Aseguramos que el filtro esté sincronizado al volver del caché
      syncFilter()
    })

    watch(() => route.query.cat, syncFilter)
    watch(() => route.query.dept, syncFilter)

    const filteredProducts = computed(() => {
      const catIds = activeDeptCats.value.map(c => c.id)
      let list = products.value.filter(p => p.category && catIds.includes(p.category))

      if (activeFilter.value !== 'all') {
        list = list.filter(p => p.category === activeFilter.value)
      }
      return list
    })

    const activeFilterLabel = computed(() => {
      return filters.value.find(f => f.id === activeFilter.value)?.label ?? ''
    })

    function goToDetail(product) {
      router.push({ name: 'ProductDetail', params: { slug: generateProductSlug(product.id, product.name) } })
    }

    const quickAddToCart = (product) => {
      if (isStockFull(product)) return;
      const res = addToCart(product)
      if (res.success) {
        justAdded.value = product.id
        setTimeout(() => { justAdded.value = null }, 2000)
      }
    }

    const currentTheme = computed(() => {
      const themes = {
        men: { 
          text: 'text-neon-green', 
          bg: 'bg-neon-green', 
          border: 'border-neon-green', 
          shadow: 'shadow-[0_0_15px_rgba(57,255,20,0.3)]', 
          bar: 'bg-neon-green shadow-[0_0_10px_#39FF14]',
          hoverBorder: 'hover:border-neon-green/50',
          hoverText: 'group-hover:text-neon-green'
        },
        merch: { 
          text: 'text-cyan-400', 
          bg: 'bg-cyan-400', 
          border: 'border-cyan-400', 
          shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]', 
          bar: 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]',
          hoverBorder: 'hover:border-cyan-400/50',
          hoverText: 'group-hover:text-cyan-400'
        },
        women: { 
          text: 'text-pink-500', 
          bg: 'bg-pink-500', 
          border: 'border-pink-500', 
          shadow: 'shadow-[0_0_15px_rgba(236,72,153,0.3)]', 
          bar: 'bg-pink-500 shadow-[0_0_10px_#ec4899]',
          hoverBorder: 'hover:border-pink-500/50',
          hoverText: 'group-hover:text-pink-500'
        }
      }
      return themes[activeDepartment.value] || themes.men
    })

    const getThemeColor = (type = 'text', dept = activeDepartment.value) => {
      const themes = {
        men: { text: 'text-neon-green', bg: 'bg-neon-green', border: 'border-neon-green', shadow: 'shadow-[0_0_15px_rgba(57,255,20,0.3)]', bar: 'bg-neon-green shadow-[0_0_10px_#39FF14]' },
        merch: { text: 'text-cyan-400', bg: 'bg-cyan-400', border: 'border-cyan-400', shadow: 'shadow-[0_0_15px_rgba(34,211,238,0.3)]', bar: 'bg-cyan-400 shadow-[0_0_10px_#22d3ee]' },
        women: { text: 'text-pink-500', bg: 'bg-pink-500', border: 'border-pink-500', shadow: 'shadow-[0_0_15px_rgba(236,72,153,0.3)]', bar: 'bg-pink-500 shadow-[0_0_10px_#ec4899]' }
      }
      return themes[dept]?.[type] || ''
    }

    // Hacemos el setup retornando todo
    return {
      products,
      categories,
      isLoading,
      errorMessage,
      activeFilter,
      activeDepartment,
      filters,
      filteredProducts,
      activeFilterLabel,
      formatPrice,
      optimizeImage,
      goToDetail,
      quickAddToCart,
      isStockFull,
      justAdded,
      fetchData,
      getThemeColor,
      currentTheme
    }
  }
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
