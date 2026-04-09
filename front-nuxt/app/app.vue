<template>
  <main id="app-container">
    <NuxtPage :keepalive="{ include: ['tienda'] }" />

    <!-- Carrito: solo cuando no estamos en Home ni en páginas que no corresponde -->
    <ClientOnly>
      <template v-if="showCart">
        <CartDrawer :is-open="cartOpen" @close="cartOpen = false" />
        <CartIcon v-if="!cartOpen" @open="cartOpen = true" />
      </template>

      <button
        v-if="showScrollTop && !cartOpen"
        @click="scrollToTop"
        aria-label="Volver arriba"
        class="fixed bottom-10 sm:bottom-6 right-6 z-50 bg-neon-green text-black px-4 py-2 rounded-full shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:bg-neon-green-dark transition-all duration-300 focus:outline-none hover:scale-110"
      >
        ↑ Top
      </button>
    </ClientOnly>
  </main>
</template>

<script setup lang="ts">
const route = useRoute()

const cartOpen = ref(false)
const showScrollTop = ref(false)

// Mostrar carrito solo en páginas que lo necesitan
const showCart = computed(() =>
  route.name !== 'index' && route.name !== 'admin'
)

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleScroll() {
  const shouldShow = window.scrollY > 200
  if (showScrollTop.value !== shouldShow) {
    showScrollTop.value = shouldShow
  }
}

onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', handleScroll))
</script>
