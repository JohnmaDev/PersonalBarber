<!-- Ícono flotante del carrito con badge de cantidad -->
<template>
  <transition name="fade">
    <button
      @click="$emit('open')"
      aria-label="Abrir carrito"
      class="fixed bottom-24 right-5 z-50 w-14 h-14 rounded-full bg-barber-gold text-black flex items-center justify-center shadow-lg shadow-barber-gold/30 hover:bg-yellow-400 transition-all duration-300 hover:scale-110 active:scale-95"
    >
      <i class="fas fa-shopping-bag text-lg"></i>
      <!-- Badge de cantidad -->
      <transition name="badge-pop">
        <span
          v-if="cartCount > 0"
          class="absolute -top-1 -right-1 bg-black text-barber-gold text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-barber-gold/50"
        >
          {{ cartCount > 9 ? '9+' : cartCount }}
        </span>
      </transition>
    </button>
  </transition>
</template>

<script setup>
/* global defineEmits */
import { useCart } from '@/composables/useCart.js'

defineEmits(['open'])
const { cartCount } = useCart()
</script>

<style scoped>
.badge-pop-enter-active { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.badge-pop-leave-active { transition: all 0.15s ease-in; }
.badge-pop-enter-from, .badge-pop-leave-to { opacity: 0; transform: scale(0); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
