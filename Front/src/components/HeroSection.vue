<template>
  <section class="relative w-full h-screen flex items-center justify-center overflow-hidden bg-barber-black">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <img 
        src="@/assets/hero_barber.png" 
        alt="Barber Hero" 
        class="w-full h-full object-cover filter brightness-50"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-barber-black/60 to-barber-black"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-6 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between">
      <div class="max-w-2xl">
        <h1 class="text-5xl lg:text-7xl font-bold text-white mb-4 tracking-tighter animate-fade-in-up">
          <span class="text-barber-gold">Barbel</span>Col
        </h1>
        <p class="text-xl lg:text-2xl text-gray-300 mb-8 italic tracking-wide animate-fade-in-up" style="animation-delay: 0.2s;">
          REFLEJÁ TU MEJOR VERSIÓN
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up" style="animation-delay: 0.4s;">
          <button 
            @click="$emit('reserve')"
            class="px-8 py-4 bg-barber-gold hover:bg-yellow-600 text-black font-bold rounded-lg transition-all duration-300 shadow-lg shadow-barber-gold/20"
          >
            RESERVAR CITA AHORA
          </button>
          <button 
            @click="scrollToProducts"
            class="px-8 py-4 glass text-white font-bold rounded-lg hover:bg-white/20 transition-all duration-300"
          >
            VER PRODUCTOS
          </button>
        </div>
      </div>

      <!-- Social Floating Card (Glassmorphism) -->
      <div class="mt-12 lg:mt-0 glass-dark p-8 rounded-2xl animate-fade-in-up" style="animation-delay: 0.6s;">
        <div class="flex flex-col items-center gap-6">
          <div class="w-24 h-24 rounded-full border-2 border-barber-gold overflow-hidden">
            <img src="@/assets/profile_andres.jpg" alt="Andres" class="w-full h-full object-cover" />
          </div>
          <div class="text-center">
            <h3 class="text-xl font-bold text-white">Andrés Hernández</h3>
            <p class="text-barber-gold text-sm font-semibold tracking-widest uppercase mt-1">Master Barber</p>
          </div>
          <div class="flex gap-4">
            <a v-for="social in socials" :key="social.icon" :href="social.link" target="_blank" class="w-10 h-10 flex items-center justify-center rounded-full glass hover:text-barber-gold transition-colors">
              <i :class="social.icon"></i>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
      <i class="fas fa-chevron-down text-white/50 text-2xl"></i>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
  data() {
    return {
      socials: [
        { icon: 'fab fa-whatsapp', link: 'https://api.whatsapp.com/send?phone=573045840264' },
        { icon: 'fab fa-tiktok', link: 'https://www.tiktok.com/@pipehpbarber' },
        { icon: 'fab fa-instagram', link: 'https://www.instagram.com/pipehp_/' }
      ]
    }
  },
  methods: {
    scrollToProducts() {
      const el = document.getElementById('productos');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.8s ease-out forwards;
}
</style>
