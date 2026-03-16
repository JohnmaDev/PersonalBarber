<template>
  <main id="app-container">
    <router-view />

    <!-- Carrito Drawer + Ícono flotante -->
    <CartDrawer :isOpen="cartOpen" @close="cartOpen = false" />
    <CartIcon v-if="!cartOpen" @open="cartOpen = true" />

    <!-- Botón volver arriba -->
    <button
      v-if="showScrollTop"
      @click="scrollToTop"
      aria-label="Volver arriba"
      class="fixed bottom-10 sm:bottom-6 right-6 z-50 bg-yellow-400 text-black px-4 py-2 rounded-full shadow-lg hover:bg-yellow-300 transition focus:outline-none focus:ring-2 focus:ring-yellow-500"
    >
      ↑ Top
    </button>
  </main>
</template>

<script>
import CartDrawer from '@/components/CartDrawer.vue'
import CartIcon from '@/components/CartIcon.vue'

export default {
  components: { CartDrawer, CartIcon },
  data() {
    return {
      showScrollTop: false,
      cartOpen: false,
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleScroll() {
      const shouldShow = window.scrollY > 200;
      if (this.showScrollTop !== shouldShow) {
        this.showScrollTop = shouldShow;
      }
    },
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
