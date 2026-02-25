<template>
  <div id="app-container">
    <router-view />
    <div>
      <!-- Tu contenido -->

      <!-- Botón flotante -->
      <button
        v-if="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-10 sm:bottom-6 right-6 z-50 bg-yellow-400 text-black px-4 py-2 rounded-full shadow-lg hover:bg-yellow-300 transition"
      >
        ↑ Top
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showScrollTop: false,
    };
  },
  methods: {
    scrollToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    handleScroll() {
      this.showScrollTop = window.scrollY > 200; // Mostrar botón después de hacer scroll 200px
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
