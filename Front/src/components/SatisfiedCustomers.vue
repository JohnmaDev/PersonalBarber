<!-- Componente para pintar los clientes satisfechos en el Home -->
<template>
<div id="clientes" class="mt-24 w-full scroll-mt-24">
       <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white mb-2 tracking-tighter uppercase">
              CLIENTES <span class="text-barber-gold">SATISFECHOS</span>
          </h2>
          <div class="flex justify-center gap-1 opacity-50">
            <span v-for="i in 3" :key="i" class="w-1.5 h-1.5 bg-barber-gold rounded-full"></span>
          </div>
        </div>

    <!-- Swiper con navegación -->
    <div class="relative w-full py-10 overflow-hidden">
      
      <!-- Swiper -->
      <Swiper
        class="!overflow-visible"
        :modules="[Navigation]"
        :navigation="{
          nextEl: '.clientes-next',
          prevEl: '.clientes-prev'
        }"
        :slides-per-view="1.2"
        :space-between="24"
        :centeredSlides="true"
        :loop="true"
        :breakpoints="{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 }
        }"
      >
        <SwiperSlide
          v-for="services in SatisfiedCustomers"
          :key="services.id"
          class="pb-12"
        >
          <div class="group relative aspect-square glass-dark rounded-3xl overflow-hidden hover:border-barber-gold transition-all duration-500 cursor-crosshair">
            <img
              :src="services.image"
              :alt="'Cliente satisfecho: ' + services.name"
              class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            <!-- Gradient Overlay -->
            <div class="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent flex items-bottom p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span class="text-white font-bold tracking-wider text-lg uppercase">{{ services.name }}</span>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <!-- Custom Navigation Buttons -->
      <div class="flex justify-center gap-4 mt-8">
        <button aria-label="Anterior cliente" class="clientes-prev w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-barber-gold hover:text-black transition-all duration-300">
          <i class="fas fa-arrow-left" aria-hidden="true"></i>
        </button>
        <button aria-label="Siguiente cliente" class="clientes-next w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-barber-gold hover:text-black transition-all duration-300">
          <i class="fas fa-arrow-right" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const SatisfiedCustomers = [
  { id: 10, name: 'Liam Torres', image: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/a321a2a3-4cd5-4b8c-853c-ade4d6e2a330/Derivates/885d4ee3-4751-4921-a6d5-7f0f0c9638a3.jpg' },
  { id: 11, name: 'Matías Rivas', image: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/a321a2a3-4cd5-4b8c-853c-ade4d6e2a330/Derivates/885d4ee3-4751-4921-a6d5-7f0f0c9638a3.jpg' },
  { id: 12, name: 'Matías Rivas', image: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/a321a2a3-4cd5-4b8c-853c-ade4d6e2a330/Derivates/885d4ee3-4751-4921-a6d5-7f0f0c9638a3.jpg' },
  { id: 13, name: 'Renzo Calderón', image: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/a321a2a3-4cd5-4b8c-853c-ade4d6e2a330/Derivates/885d4ee3-4751-4921-a6d5-7f0f0c9638a3.jpg' },
  { id: 14, name: 'Simón Aranda', image: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/a321a2a3-4cd5-4b8c-853c-ade4d6e2a330/Derivates/885d4ee3-4751-4921-a6d5-7f0f0c9638a3.jpg' },
  { id: 15, name: 'Iván Gallardo', image: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/a321a2a3-4cd5-4b8c-853c-ade4d6e2a330/Derivates/885d4ee3-4751-4921-a6d5-7f0f0c9638a3.jpg' },
  { id: 16, name: 'Tomás Villamil', image: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/a321a2a3-4cd5-4b8c-853c-ade4d6e2a330/Derivates/885d4ee3-4751-4921-a6d5-7f0f0c9638a3.jpg' },
  { id: 17, name: 'Dante Salazar', image: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/a321a2a3-4cd5-4b8c-853c-ade4d6e2a330/Derivates/885d4ee3-4751-4921-a6d5-7f0f0c9638a3.jpg' },
  { id: 18, name: 'Álex Carvajal', image: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/a321a2a3-4cd5-4b8c-853c-ade4d6e2a330/Derivates/885d4ee3-4751-4921-a6d5-7f0f0c9638a3.jpg' },
  { id: 19, name: 'Marioso', image: 'https://assets.tmecosys.com/image/upload/t_web_rdp_recipe_584x480/img/recipe/ras/Assets/a321a2a3-4cd5-4b8c-853c-ade4d6e2a330/Derivates/885d4ee3-4751-4921-a6d5-7f0f0c9638a3.jpg' },
]

onMounted(async () => {
  requestAnimationFrame(async () => {
    await nextTick()
    // Esto asegura que Swiper pueda encontrar los botones personalizados despues de que el layout inicial se haya asentado
  })
})

</script>

<style scoped>


/* Efectos para el separador */

@keyframes glitch-gold {
  0% {
    transform: translate(0);
    opacity: 1;
    color: #facc15; /* Amarillo dorado */
  }
  10% {
    transform: translate(-1px, 1px);
    color: #fde68a; /* Amarillo más claro */
  }
  20% {
    transform: translate(1px, -1px);
    color: #fbbf24; /* Otro dorado */
  }
  30% {
    transform: translate(-0.5px, 0.5px);
    opacity: 0.95;
  }
  40% {
    transform: translate(0.5px, -0.5px);
    opacity: 1;
  }
  50% {
    transform: translate(0, 0);
    color: #facc15;
  }
  100% {
    transform: none;
    opacity: 1;
    color: #facc15;
  }
}

.glitch-gold {
  animation: glitch-gold 1.2s infinite;
  display: inline-block;
  font-weight: bold;
  text-shadow: 1px 1px #00000066;
}

</style>
