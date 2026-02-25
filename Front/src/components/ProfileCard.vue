<!-- Componente Profile imagen y sus redes sociales -->
<template>
  <div class="bg-black text-white min-h-screen flex flex-col items-center p-6">
    <div class="flex flex-col items-center">
      <div class="group relative w-76 h-80 rounded-xl overflow-hidden bg-black">
        <img
          src="@/assets/profile_andres.jpg"
          alt="Andres Felipe Hernandez"
          class="w-full h-full object-cover mask-fade"
        />
      </div>
      <h1 class="text-2xl font-bold mt-4">Andres Felipe Hernandez</h1>
      <p class="text-md text-gray-300 mt-2">REFLEJÁ TU MEJOR VERSIÓN ⭐</p>
      <br>
      <p class="text-sm text-gray-300 italic tracking-wide">Tu look habla por vos. Asegurate de que diga lo correcto.</p>

      <div class="flex space-x-4 mt-4 text-xl text-white">
        <a href="https://api.whatsapp.com/send?phone=573045840264&text=Hola,%20quiero%20agendar%20una%20cita%20con%20Andres%20el%20barbero.%20¿Podrías%20ayudarme%20con%20la%20disponibilidad?" target="_blank" rel="noopener noreferrer" class="hover:text-green-500 transition duration-300">
          <i class="fab fa-whatsapp text-white text-2xl transition-transform duration-300 hover:scale-125 hover:text-green-500"></i>
        </a>
        <a href="#" target="#" rel="#" class="transition-transform duration-300 hover:scale-125 group">
          <i class="fab fa-tiktok text-white fab fa-tiktok text-white text-2xl group-hover:text-pink-500"></i>
        </a>
        <a href="https://www.instagram.com/pipehp_/" target="_blank" rel="noopener noreferrer" class="rounded-full transition-transform duration-300 hover:scale-125 group">
          <i class="fab fa-instagram text-white text-2xl group-hover:text-pink-500"></i>
        </a>
        <a href="#" target="#" rel="#" class="rounded-full transition-transform duration-300 hover:scale-125 group">
          <i class="fab fa-facebook text-white text-2xl group-hover:text-blue-500"></i>
        </a>
        <a href="#" target="#" rel="#" class="rounded-full transition-transform duration-300 hover:scale-125 group">
          <i class="fab fa-x-twitter text-white text-2xl group-hover:text-neutral-400"></i>
        </a>
        <a href="#" target="#" rel="#" class="rounded-full transition-transform duration-300 hover:scale-125 group">
          <i class="fab fa-pinterest text-white text-2xl group-hover:text-red-500"></i>
        </a>
      </div>
    </div>

    <div class="mt-10 w-full max-w-md">
      <!-- <h2 class="text-center text-yellow-500 font-bold text-lg mb-2">SERVICIOS DESTACADOS</h2> -->
      <h2 class="text-center text-yellow-500 font-bold text-lg mb-2 hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer">
              SERVICIOS DESTACADOS
      </h2>
      <!-- <div class="flex justify-center text-yellow-500 mb-6">
        <span>⭐⭐⭐⭐⭐</span>
      </div> -->
        <div class="flex justify-center text-yellow-500 mb-6 space-x-1">
          <span class="text-2xl star-bounce" style="animation-delay: 0s;">⭐</span>
          <span class="text-2xl star-bounce" style="animation-delay: 0.1s;">⭐</span>
          <span class="text-2xl star-bounce" style="animation-delay: 0.2s;">⭐</span>
          <span class="text-2xl star-bounce" style="animation-delay: 0.3s;">⭐</span>
          <span class="text-2xl star-bounce" style="animation-delay: 0.4s;">⭐</span>
        </div>

        <div class="space-y-4">
          <!-- Botón Principal hacia la nueva vista -->
          <div 
            @click="goToAgendarCita('')"
            class="w-full bg-white text-black font-bold text-center rounded-full py-4 text-lg mb-6 cursor-pointer hover:bg-zinc-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          >
            🔥 RESERVAR CITA AHORA 🔥
          </div>

          <ServiceButton title="CORTE" priceCOP="40.000" priceUSD="10.00" @click="() => goToAgendarCita('Corte Sencillo')" />
          <ServiceButton title="CORTE Y BARBA" priceCOP="50.000" priceUSD="13.00" @click="() => goToAgendarCita('Corte + Barba')" />
          <ServiceButton title="SOLO BARBA" priceCOP="25.000" priceUSD="7.00" @click="() => goToAgendarCita('Solo Barba')" />
          <ServiceButton title="DEPILACIÓN DE NARIZ" priceCOP="20.000" priceUSD="5.00" @click="() => goToAgendarCita('Depilación Nariz')" />
          <ServiceButton title="DEPILACIÓN DE OIDOS" priceCOP="20.000" priceUSD="5.00" @click="() => goToAgendarCita('Depilación Oídos')" />
        </div>
    </div>
  </div>
</template>

<script>
import ServiceButton from './ServiceButton.vue'

export default {
  components: {
    ServiceButton
  },
  methods: {
    goToAgendarCita(serviceName) {
      // Navegamos a la vista de reservar. Podríamos pasar el servicio por Query o Params si quisiéramos auto-llenarlo.
      this.$router.push({ name: 'ReservaCita', query: { service: serviceName } })
    },
    goToWhatsApp(serviceName) {
      const barberName = 'Andrés'
      const phone = '573045840264'
      const mensaje = `Hola ${barberName}, estoy interesado en agendar una cita para un ${serviceName}.`
      const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(mensaje)}`
      window.open(url, '_blank')
    }
  }
}
</script>

<style scoped>

/* animación a las estrellas en profile */
@keyframes wave-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.star-bounce {
  display: inline-block;
  animation: wave-bounce 1s ease-in-out infinite;
}

</style>