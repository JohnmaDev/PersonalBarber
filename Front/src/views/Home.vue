<template>
    <div class="bg-barber-black min-h-screen text-white flex flex-col items-center">
        <HeroSection @reserve="goToReserva" />
        <div class="w-full max-w-6xl px-4 flex flex-col items-center pb-20">
          <ProductsList />
          <SatisfiedCustomers />
          <PRose class="mt-20 opacity-50 hover:opacity-100 transition-opacity" />
        </div>
    </div>
</template>

<script>
import HeroSection from '@/components/HeroSection.vue'
import ProductsList from '@/components/ProductsList.vue'
import SatisfiedCustomers from '@/components/SatisfiedCustomers.vue'
import PRose from '@/components/icons/P_rose.vue'

export default {
  name: 'HomeView',
  components: {
    HeroSection,
    ProductsList,
    SatisfiedCustomers,
    PRose,
  },
  methods: {
    goToReserva() {
      this.$router.push({ name: 'ReservaCita' })
    }
  }
}
</script>