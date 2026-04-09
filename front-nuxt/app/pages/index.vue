<template>
  <div class="bg-barber-black min-h-screen text-white flex flex-col items-center">
    <!-- Hero section -->
    <HeroSection @reserve="goToReserva" class="animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out" />

    <div class="w-full max-w-6xl px-4 flex flex-col items-center pb-20 overflow-hidden">
      <ShopCategories class="animate-on-scroll w-full opacity-0 translate-y-12 transition-all duration-1000 ease-out" />
      <MasonryGallery class="animate-on-scroll w-full mt-8 opacity-0 translate-y-12 transition-all duration-1000 ease-out" />
    </div>
  </div>
</template>

<script setup lang="ts">
// SEO — renderizado en servidor, Google lo indexa directamente
useSeoMeta({
  title: 'PersonalBarber — Barbería Premium en Medellín | Reserva tu Cita Online',
  ogTitle: 'PersonalBarber — Barbería Premium en Medellín',
  description: 'Barbería premium en Medellín con el mejor estilo. Cortes exclusivos, barba profesional y productos especializados. Reserva tu cita online al instante.',
  ogDescription: 'Barbería premium en Medellín. Cortes exclusivos y reservas online.',
  ogUrl: 'https://personalbarber.vip',
})

// JSON-LD LocalBusiness — para Google Knowledge Panel
useHead({
  script: [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'HairSalon',
      name: 'PersonalBarber',
      description: 'Barbería premium a domicilio en Medellín. Cortes exclusivos, barba profesional y productos especializados.',
      url: 'https://personalbarber.vip',
      telephone: '+573045840264',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Medellín',
        addressRegion: 'Antioquia',
        addressCountry: 'CO',
      },
      servesCuisine: undefined,
      sameAs: [
        'https://www.instagram.com/pipehp_/',
        'https://www.tiktok.com/@pipehpbarber',
      ],
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      }
    })
  }]
})

const router = useRouter()

// Precargar catálogo desde server para que ShopCategories tenga datos
const { fetchCatalog } = useCatalog()
await fetchCatalog()

function goToReserva() {
  router.push({ name: 'agendar' })
}

// Scroll reveal animations — solo en cliente
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('opacity-0', 'translate-y-8', 'translate-y-12')
        entry.target.classList.add('opacity-100', 'translate-y-0')
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' })

  document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el))

  onUnmounted(() => observer.disconnect())
})
</script>
