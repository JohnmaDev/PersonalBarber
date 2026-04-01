<template>
    <div class="bg-barber-black min-h-screen text-white flex flex-col items-center">
        <!-- Hero section con animación inicial más rapida -->
        <HeroSection @reserve="goToReserva" class="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out" />
        
        <div class="w-full max-w-6xl px-4 flex flex-col items-center pb-20 overflow-hidden">
          <!-- Secciones que aparecen al hacer scroll -->
          <ShopCategories class="animate-on-scroll w-full opacity-0 translate-y-12 transition-all duration-1000 ease-out" />
          <MasonryGallery class="animate-on-scroll w-full mt-8 opacity-0 translate-y-12 transition-all duration-1000 ease-out" />
          <PRose class="mt-14 animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'

let observer = null;

onMounted(() => {
  document.title = 'PersonalBarber — Barbería Premium en Medellín | Reserva tu Cita Online'

  // Crear el observador para animaciones de scroll
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Remover las clases iniciales y agregar las de estado visible
        entry.target.classList.remove('opacity-0', 'translate-y-8', 'translate-y-12');
        entry.target.classList.add('opacity-100', 'translate-y-0');
        // Dejar de observar para que la animación ocurra solo la primera vez y sea performante
        observer.unobserve(entry.target);
      }
    })
  }, { 
    threshold: 0.15, // Se activa cuando el 15% del elemento es visible
    rootMargin: '0px 0px -50px 0px' 
  })

  // Seleccionar y observar los elementos
  const elements = document.querySelectorAll('.animate-on-scroll');
  elements.forEach(el => observer.observe(el));
})

onUnmounted(() => {
  if (observer) observer.disconnect();
})
</script>

<script>
import HeroSection from '@/components/HeroSection.vue'
import ShopCategories from '@/components/ShopCategories.vue'
import MasonryGallery from '@/components/MasonryGallery.vue'
import PRose from '@/components/icons/P_rose.vue'

export default {
  name: 'HomeView',
  components: {
    HeroSection,
    ShopCategories,
    MasonryGallery,
    PRose,
  },
  methods: {
    goToReserva() {
      this.$router.push({ name: 'ReservaCita' })
    }
  }
}
</script>