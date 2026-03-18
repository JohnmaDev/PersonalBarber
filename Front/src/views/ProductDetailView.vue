<template>
  <div class="bg-barber-black min-h-screen text-white">

    <!-- Header con back -->
    <div class="sticky top-0 z-30 bg-barber-black/80 backdrop-blur-md border-b border-white/10">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
        <button @click="$router.back()" class="flex-shrink-0 flex items-center gap-1.5 text-gray-400 hover:text-barber-gold transition-colors">
          <i class="fas fa-arrow-left text-xs"></i>
          <span class="text-xs font-semibold hidden sm:inline">Volver</span>
          <span class="text-[10px] font-semibold sm:hidden">Volver</span>
        </button>
        <h1 class="text-sm sm:text-lg font-bold tracking-tight sm:tracking-widest uppercase text-white truncate text-center flex-1">
          <span class="text-barber-gold">Personal</span>Barber · Tienda
        </h1>
        <div class="w-10 sm:w-16 flex-shrink-0"></div>
      </div>
    </div>

    <!-- Estado de carga -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[60vh]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-barber-gold mb-4"></div>
      <p class="text-gray-400 font-medium">Cargando detalles...</p>
    </div>

    <!-- Contenido principal -->
    <div v-else-if="product" class="max-w-5xl mx-auto px-4 py-6 md:py-10 pb-56">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start">

        <!-- Imagen del producto -->
        <div class="md:sticky md:top-24 flex justify-center">
          <div class="w-full max-w-[320px] md:max-w-none aspect-square rounded-3xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
            <img
              :src="product.image"
              :alt="product.name"
              class="w-full h-full object-cover"
            />
          </div>
        </div>

        <!-- Info del producto -->
        <div class="flex flex-col gap-6">
          <!-- Breadcrumb -->
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <router-link to="/" class="hover:text-barber-gold transition-colors">Inicio</router-link>
            <span>/</span>
            <router-link to="/tienda" class="hover:text-barber-gold transition-colors">Tienda</router-link>
            <span>/</span>
            <span class="text-gray-400">{{ product.name }}</span>
          </div>

          <!-- Marca y nombre -->
          <div>
            <span class="text-barber-gold text-xs font-bold tracking-widest uppercase">{{ product.brand }}</span>
            <h1 class="text-3xl font-black text-white mt-1 leading-tight tracking-tight">{{ product.name }}</h1>
          </div>

          <!-- Precio -->
          <div class="flex items-baseline gap-3">
            <span class="text-4xl font-black text-barber-gold">{{ product.price }}</span>
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
              <span class="text-gray-500">Disponibilidad</span>
              <span class="text-green-400 font-semibold">✓ En stock</span>
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
                @click="qty++"
                class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white font-bold"
              >+</button>
            </div>
          </div>

          <!-- CTAs -->
          <div class="flex flex-col sm:flex-row gap-3">
            <button
              @click="handleAddToCart"
              class="flex-1 py-4 glass border border-barber-gold/50 hover:border-barber-gold text-barber-gold font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <i class="fas fa-shopping-bag"></i>
              Agregar al Carrito
            </button>
            <button
              @click="handleBuyNow"
              class="flex-1 py-4 bg-barber-gold hover:bg-yellow-400 text-black font-black rounded-xl transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <i class="fas fa-bolt"></i>
              Comprar Ahora
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
              <i :class="badge.icon" class="text-barber-gold text-base sm:text-lg"></i>
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
          <router-link to="/tienda" class="text-barber-gold text-sm font-bold hover:underline">Tienda →</router-link>
        </div>
        
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <router-link
            v-for="item in recommendedProducts"
            :key="item.id"
            :to="{ name: 'ProductDetail', params: { id: item.id } }"
            class="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-barber-gold/50 transition-all duration-300"
          >
            <div class="aspect-square overflow-hidden bg-white/5">
              <img :src="item.image" :alt="item.name" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div class="p-4">
              <h4 class="text-xs font-bold text-white group-hover:text-barber-gold transition-colors line-clamp-1">{{ item.name }}</h4>
              <p class="text-barber-gold font-bold text-xs mt-1">{{ item.price }}</p>
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
            class="px-5 py-3 rounded-2xl glass border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-barber-gold hover:border-barber-gold/50 transition-all duration-300"
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
      <router-link to="/tienda" class="text-barber-gold hover:underline text-sm font-bold">← Volver a la tienda</router-link>
    </div>
  </div>
</template>

<script setup>
const products = ref([])
const isLoading = ref(true)

async function fetchProducts() {
  isLoading.value = true
  try {
    const res = await fetch('/.netlify/functions/get_products')
    const data = await res.json()
    if (data.ok) {
      products.value = data.products
    }
  } catch (err) {
    console.error('Error cargando detalles del producto:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchProducts()
})

// Producto reactivo basado en el ID de la URL
const product = computed(() => products.value.find(p => p.id === Number(route.params.id)))
const qty = ref(1)
const showConfirm = ref(false)

// Resetear cantidad cuando cambia el producto
watch(() => route.params.id, () => {
  qty.value = 1
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

const availableCategories = computed(() => categories.filter(c => c.id !== 'all'))

function getCategoryLabel(catId) {
  return categories.find(c => c.id === catId)?.label ?? catId
}

function handleAddToCart() {
  if (!product.value) return
  addToCart(product.value, qty.value)
  showConfirm.value = true
  setTimeout(() => { showConfirm.value = false }, 2500)
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
</style>
