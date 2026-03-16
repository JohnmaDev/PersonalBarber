<template>
  <div class="bg-barber-black min-h-screen text-white">

    <!-- Header con back -->
    <div class="sticky top-0 z-30 bg-barber-black/80 backdrop-blur-md border-b border-white/10">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <button @click="$router.back()" class="flex items-center gap-2 text-gray-400 hover:text-barber-gold transition-colors">
          <i class="fas fa-arrow-left text-sm"></i>
          <span class="text-sm font-semibold">Volver</span>
        </button>
        <h1 class="text-sm font-bold tracking-widest uppercase text-white">
          <span class="text-barber-gold">Personal</span>Barber · Tienda
        </h1>
        <div class="w-16"></div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div v-if="product" class="max-w-5xl mx-auto px-4 py-6 md:py-10 pb-56">
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
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { products, categories } from '@/data/products.js'
import { useCart } from '@/composables/useCart.js'

const route = useRoute()
const router = useRouter()
const { addToCart } = useCart()

const product = products.find(p => p.id === Number(route.params.id))
const qty = ref(1)
const showConfirm = ref(false)

function getCategoryLabel(catId) {
  return categories.find(c => c.id === catId)?.label ?? catId
}

function handleAddToCart() {
  if (!product) return
  addToCart(product, qty.value)
  showConfirm.value = true
  setTimeout(() => { showConfirm.value = false }, 2500)
}

function handleBuyNow() {
  if (!product) return
  addToCart(product, qty.value)
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
