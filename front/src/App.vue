<template>
  <main id="app-container">
    <router-view v-slot="{ Component }">
      <keep-alive include="StoreView">
        <component :is="Component" :key="$route.path" />
      </keep-alive>
    </router-view>

    <!-- Carrito Drawer + Ícono flotante (Solo si no estamos en el Home) -->
    <template v-if="showCart && $route.name !== 'AdminPanel'">
      <CartDrawer :isOpen="cartOpen" @close="cartOpen = false" />
      <CartIcon v-if="!cartOpen" @open="cartOpen = true" />
    </template>

    <!-- Botón volver arriba (Solo si no estamos en Admin) -->
    <button
      v-if="showScrollTop && $route.name !== 'AdminPanel'"
      @click="scrollToTop"
      aria-label="Volver arriba"
      class="fixed bottom-10 sm:bottom-6 right-6 z-50 bg-neon-green text-black px-4 py-2 rounded-full shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:bg-neon-green-dark transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neon-green hover:scale-110"
    >
      ↑ Top
    </button>
  </main>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import CartDrawer from '@/components/CartDrawer.vue'
import CartIcon from '@/components/CartIcon.vue'

export default {
  components: { CartDrawer, CartIcon },
  setup() {
    const route = useRoute()
    const showCart = computed(() => route.name !== 'Home' && route.name !== 'AdminPanel')
    
    return { showCart }
  },
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
