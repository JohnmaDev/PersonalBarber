<template>
    <div class="bg-barber-black min-h-screen text-white flex flex-col items-center">
        <HeroSection @reserve="goToReserva" />
        <div class="w-full max-w-6xl px-4 flex flex-col items-center pb-20">
          <ShopCategories />
          <MasonryGallery />
          <PRose class="mt-14" />
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  document.title = 'PersonalBarber | Barbería Premium & Reservas'
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