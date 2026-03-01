<!-- Componente para pintar los productos en el Home -->
<template>
<div id="productos" class="mt-24 w-full scroll-mt-24">
       <div class="text-center mb-12">
          <h2 class="text-4xl font-bold text-white mb-2 tracking-tighter">
              NUESTROS <span class="text-barber-gold">PRODUCTOS</span>
          </h2>
          <div class="flex justify-center gap-1 opacity-50">
            <span v-for="i in 3" :key="i" class="w-1.5 h-1.5 bg-barber-gold rounded-full"></span>
          </div>
        </div>

    <!-- Swiper con navegación -->
    <div class="relative w-full py-10 overflow-visible">

      <!-- Swiper -->
      <Swiper
        class="!overflow-visible"
        :modules="[Navigation]"
        :navigation="{
          nextEl: '.productos-next',
          prevEl: '.productos-prev'
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
          v-for="product in products"
          :key="product.id"
          class="pb-12"
        >
          <div
              class="group relative h-[500px] glass-dark rounded-3xl overflow-hidden hover:border-barber-gold transition-all duration-500 flex flex-col cursor-pointer"
              @click="enviarMensajeWhatsApp(product.name, product.price)"
          >
              <div class="h-3/5 w-full overflow-hidden">
                <img :src="product.image" alt="" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              </div>

              <div class="p-6 flex flex-col flex-grow justify-between">
                  <div> 
                      <h3 class="text-2xl font-bold text-white group-hover:text-barber-gold transition-colors duration-300">{{ product.name }}</h3>
                      <p class="text-gray-400 mt-2 text-sm leading-relaxed line-clamp-2 italic">{{ product.description }}</p>
                  </div>
                  
                  <div class="flex items-center justify-between mt-4">
                    <span class="text-xl text-barber-gold font-bold">{{ product.price }}</span>
                    <div class="w-10 h-10 rounded-full glass flex items-center justify-center group-hover:bg-barber-gold group-hover:text-black transition-all duration-300">
                      <i class="fab fa-whatsapp"></i>
                    </div>
                  </div>
              </div>

              <!-- Decorative Overlay -->
              <div class="absolute inset-0 border-2 border-transparent group-hover:border-barber-gold/30 rounded-3xl pointer-events-none transition-all duration-500"></div>
          </div>
        </SwiperSlide>
      </Swiper>

      <!-- Custom Navigation Buttons -->
      <div class="flex justify-center gap-4 mt-8">
        <button class="productos-prev w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-barber-gold hover:text-black transition-all duration-300">
          <i class="fas fa-arrow-left"></i>
        </button>
        <button class="productos-next w-12 h-12 rounded-full glass flex items-center justify-center hover:bg-barber-gold hover:text-black transition-all duration-300">
          <i class="fas fa-arrow-right"></i>
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

