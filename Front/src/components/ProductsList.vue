<!-- Componente para pintar los productos en el Home -->
<template>
<div id="productos" class="mt-10 w-full max-w-md scroll-mt-6">
       <div class="w-full max-w-md">
          <h2 class="text-center text-yellow-500 font-bold text-lg mb-2 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer">
              PRODUCTOS
          </h2>
          <!-- <div class="flex justify-center text-yellow-500 text-xl mb-6">
            <span>⋆⁺₊✧༚━━━༺✨༻━━━༚✧₊⁺⋆</span>
          </div> -->
          <div class="flex justify-center text-yellow-500 text-xl mb-6 text-ornament">
            <span class="glitch-gold" style="animation-delay: 0s;">⋆</span>
            <span class="glitch-gold" style="animation-delay: 0.1s;">⁺</span>
            <span class="glitch-gold" style="animation-delay: 0.2s;">₊</span>
            <span class="glitch-gold" style="animation-delay: 0.3s;">✧</span>
            <span class="glitch-gold" style="animation-delay: 0.4s;">༚</span>
            <span class="glitch-gold" style="animation-delay: 0.5s;">━</span>
            <span class="glitch-gold" style="animation-delay: 0.6s;">━</span>
            <span class="glitch-gold" style="animation-delay: 0.7s;">༺</span>
            <span class="glitch-gold" style="animation-delay: 0.8s;">✨</span>
            <span class="glitch-gold" style="animation-delay: 0.9s;">༻</span>
            <span class="glitch-gold" style="animation-delay: 1s;">━</span>
            <span class="glitch-gold" style="animation-delay: 1.1s;">━</span>
            <span class="glitch-gold" style="animation-delay: 1.2s;">༚</span>
            <span class="glitch-gold" style="animation-delay: 1.3s;">✧</span>
            <span class="glitch-gold" style="animation-delay: 1.4s;">₊</span>
            <span class="glitch-gold" style="animation-delay: 1.5s;">⁺</span>
            <span class="glitch-gold" style="animation-delay: 1.6s;">⋆</span>
          </div>
        </div>
    </div>

    <!-- Swiper con navegación -->
    <div class="relative w-full py-10 px-4 bg-black overflow-hidden">

      <!-- Botón Anterior (sin rotación, flecha real hacia la izquierda) -->
      <div class="productos-prev absolute top-1/2 left-0 z-30 w-12 h-12 bg-yellow-400 rounded-full shadow-xl flex items-center justify-center hover:bg-yellow-500 transition duration-300 -translate-y-1/2 group">
        <svg class="w-5 h-5 text-black group-hover:-translate-x-1 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M12.293 4.293a1 1 0 010 1.414L8.414 10l3.879 4.293a1 1 0 01-1.586 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.586 0z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Botón Siguiente -->
      <div class="productos-next absolute top-1/2 right-0 z-30 w-12 h-12 bg-yellow-400 rounded-full shadow-xl flex items-center justify-center hover:bg-yellow-500 transition duration-300 -translate-y-1/2 group">
        <svg class="w-5 h-5 text-black group-hover:translate-x-1 transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.707 15.707a1 1 0 010-1.414L11.586 10 7.707 6.707a1 1 0 011.586-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.586 0z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Swiper -->
      <Swiper
        class="z-10 !overflow-visible"
        :modules="[Navigation]"
        :navigation="{
          nextEl: '.productos-next',
          prevEl: '.productos-prev'
        }"
        :slides-per-view="1.2"
        :space-between="14"
        :centeredSlides="true"
        :loop="true"
        :breakpoints="{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 3 }
        }"
        :pagination="true"
      >
        <SwiperSlide
          v-for="product in products"
          :key="product.id"
          class="overflow-visible"
        >
          <div
              class="h-[460px] max-w-[420px] bg-gradient-to-b from-black via-gray-900 to-black border border-yellow-400 rounded-2xl shadow-lg text-white mx-auto overflow-hidden hover:scale-105 transition-transform duration-300 flex flex-col cursor-crosshair"
              @click="enviarMensajeWhatsApp(product.name, product.price)"
          >
              <img :src="product.image" alt="" class="h-[65%] w-full object-cover" />

              <div class="p-3 flex flex-col flex-grow justify-between">
                  <div> 
                      <h3 class="text-xl font-bold leading-tight">{{ product.name }}</h3>
                      <h2 class="text-sm font-bold text-gray-400 mt-1 line-clamp-3">{{ product.description }}</h2>
                  </div>
                  
                  <p class="text-lg text-yellow-300 font-semibold mt-2">{{ product.price }}</p>
              </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

// Importa la imagen como un módulo
//import ceraGold from '@/assets/products/cera_gold_nishman.webp'

const products = [
  { id: 1, name: 'Cera Naranja Nishman', description: 'Color naranja (Sport): Cera de fijación fuerte con brillo medio, ideal para un look dinámico y fresco.', price: '$45.000 COP', image: '/products/cera_naranja_nishman.webp'  },
  { id: 2, name: 'Cera Verde Nishman', description: 'Color verde (Keratin M2): A base de keratina, ofrece una fijación alta sin dejar residuos grasos.' , price: '$45.000 COP' , image: '/products/cera_verde_nishman.webp' },
  { id: 3, name: 'Cera Gold Nishman', description: 'Color negro/dorado: Modelo “Gold One” o edición especial, con brillo medio y formulación elaborada.', price: '$45.000 COP' , image: '/products/cera_gold_nishman.webp' },
  { id: 4, name: 'Cera Verde y Morado Nishman', description: 'Verde claro (Rugby o Keratin variante): Acabado mate a brillante, con fijación flexible y textura ligera.', price: '$45.000 COP', image: '/products/cera_verde_y_morado_nishman.webp' },
]

onMounted(async () => {
  await nextTick()
  // Esto asegura que Swiper pueda encontrar los botones personalizados
})

const phone = '573045840264'
const barberName = 'Andrés'

const enviarMensajeWhatsApp = (productName, productPrice) => {
  const mensaje = `Hola ${barberName}, estoy interesado en el producto "${productName}" que vale ${productPrice}. ¿Podrías darme más información?`
  const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(mensaje)}`
  window.open(url, '_blank')
}

</script>

<style scoped>

@keyframes glitch-gold {
  0% {
    transform: translate(0);
    opacity: 1;
    color: #facc15;
  }
  10% {
    transform: translate(-0.5px, 0.5px);
    color: #fde68a;
  }
  20% {
    transform: translate(0.5px, -0.5px);
    color: #fbbf24;
  }
  30% {
    transform: translate(-0.5px, 0.5px);
    opacity: 0.95;
  }
  40% {
    transform: translate(0.5px, -0.5px);
    opacity: 1;
  }
  100% {
    transform: none;
    opacity: 1;
    color: #facc15;
  }
}

.glitch-gold {
  animation: glitch-gold 1.4s infinite;
  display: inline-block;
  text-shadow: 1px 1px #00000033;
}


</style>

