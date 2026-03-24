<!-- Drawer del carrito – se desliza desde la derecha -->
<template>
  <!-- Backdrop -->
  <transition name="backdrop-fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
      @click="$emit('close')"
    />
  </transition>

  <!-- Panel -->
  <transition name="drawer-slide">
    <div
      v-if="isOpen"
      class="fixed top-0 right-0 h-full w-full max-w-md z-50 bg-barber-black border-l border-white/10 flex flex-col shadow-2xl"
    >
      <!-- Header -->
      <div class="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <div class="flex items-center gap-3">
          <i class="fas fa-shopping-bag text-neon-green"></i>
          <h2 class="text-lg font-bold text-white tracking-tight">Tu Carrito</h2>
          <span class="text-xs bg-neon-green text-black font-black px-2 py-0.5 rounded-full">{{ cartCount }}</span>
        </div>
        <button
          @click="$emit('close')"
          class="w-9 h-9 rounded-full glass flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Cerrar carrito"
        >
          <i class="fas fa-times text-sm text-white"></i>
        </button>
      </div>

      <!-- Lista de items -->
      <div class="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        <!-- Carrito vacío -->
        <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center h-full gap-4 text-center">
          <i class="fas fa-shopping-bag text-5xl text-white/10"></i>
          <p class="text-gray-500 text-sm">Tu carrito está vacío</p>
          <button
            @click="$emit('close')"
            class="text-neon-green text-sm font-bold hover:underline"
          >Ver productos →</button>
        </div>

        <!-- Items -->
        <transition-group name="cart-item" tag="div" class="space-y-3">
          <div
            v-for="item in cartItems"
            :key="item.id"
            class="flex gap-3 bg-white/5 rounded-2xl p-3 border border-white/10"
          >
            <!-- Imagen -->
            <div class="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-white/5">
              <img :src="optimizeImage(item.image)" :alt="item.name" class="w-full h-full object-cover" loading="lazy" />
            </div>
            <!-- Info -->
            <div class="flex-1 min-w-0">
              <p class="text-white text-xs font-bold leading-tight truncate">{{ item.name }}</p>
              <p class="text-neon-green text-xs font-bold mt-1">{{ formatPrice(item.price) }}</p>
              <!-- Selector de cantidad -->
              <div class="flex items-center gap-2 mt-2">
                <button
                  @click="updateQuantity(item.id, item.qty - 1)"
                  class="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white text-xs"
                >−</button>
                <span class="text-white text-xs font-bold w-4 text-center">{{ item.qty }}</span>
                <button
                  @click="updateQuantity(item.id, item.qty + 1)"
                  class="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white text-xs"
                >+</button>
              </div>
            </div>
            <!-- Eliminar + subtotal -->
            <div class="flex flex-col items-end justify-between flex-shrink-0">
              <button
                @click="removeFromCart(item.id)"
                class="text-gray-600 hover:text-red-400 transition-colors text-xs"
                aria-label="Eliminar"
              ><i class="fas fa-trash-alt"></i></button>
              <span class="text-white text-xs font-bold">
                {{ formatPrice(parsePrice(item.price) * item.qty) }}
              </span>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- Footer con total y CTA -->
      <div v-if="cartItems.length > 0" class="border-t border-white/10 p-5 space-y-4">
        <!-- Desglose -->
        <div class="flex justify-between items-center">
          <span class="text-gray-400 text-sm">Subtotal</span>
          <span class="text-white font-bold">{{ cartTotalFormatted }}</span>
        </div>
        <p class="text-gray-600 text-[10px] text-center">Envío y descuentos se calculan en el checkout</p>
        <!-- CTA -->
        <router-link
          to="/checkout"
          @click="$emit('close')"
          class="block w-full py-4 bg-neon-green hover:bg-neon-green-dark text-black font-black text-center rounded-xl transition-colors duration-300 tracking-wide"
        >
          PROCEDER AL CHECKOUT →
        </router-link>
        <button
          @click="$emit('close')"
          class="block w-full py-3 glass border border-white/10 hover:border-white/30 text-gray-400 hover:text-white text-sm text-center rounded-xl transition-colors duration-300"
        >
          Seguir comprando
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
/* global defineProps, defineEmits */
import { useCart } from '@/composables/useCart.js'
import { optimizeImage } from '@/utils/image.js'

defineProps({ isOpen: Boolean })
defineEmits(['close'])

const { cartItems, cartCount, cartTotalFormatted, removeFromCart, updateQuantity, formatPrice, parsePrice } = useCart()
</script>

<style scoped>
.backdrop-fade-enter-active, .backdrop-fade-leave-active { transition: opacity 0.3s ease; }
.backdrop-fade-enter-from, .backdrop-fade-leave-to { opacity: 0; }

.drawer-slide-enter-active, .drawer-slide-leave-active { transition: transform 0.35s cubic-bezier(0.4, 0, 0.2, 1); }
.drawer-slide-enter-from, .drawer-slide-leave-to { transform: translateX(100%); }

.cart-item-enter-active { transition: all 0.3s ease; }
.cart-item-leave-active { transition: all 0.25s ease; position: absolute; width: 100%; }
.cart-item-enter-from, .cart-item-leave-to { opacity: 0; transform: translateX(20px); }
</style>
