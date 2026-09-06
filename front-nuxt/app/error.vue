<template>
  <div class="min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden selection:bg-[#39FF14] selection:text-black">
    <!-- Glow ambiental de fondo -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#39FF14]/10 rounded-full blur-[140px] pointer-events-none"></div>

    <!-- Contenido Central -->
    <div class="relative z-10 max-w-lg w-full text-center flex flex-col items-center py-12">
      <!-- Logo -->
      <NuxtLink to="/" @click="handleClearError('/')" class="inline-block mb-8 transition-transform duration-300 hover:scale-105">
        <img
          src="/PersonalBarber.svg"
          alt="PersonalBarber Medellín"
          class="h-16 w-auto mx-auto opacity-90 hover:opacity-100"
          width="64"
          height="64"
        />
      </NuxtLink>

      <!-- Badge de Estado -->
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
        <span class="w-2 h-2 rounded-full" :class="is404 ? 'bg-amber-400' : 'bg-red-500 animate-pulse'"></span>
        <span class="text-xs font-mono tracking-widest text-zinc-400 uppercase">
          {{ is404 ? 'Error 404 · Ruta no encontrada' : `Código de Estado ${error?.statusCode || 500}` }}
        </span>
      </div>

      <!-- Título Principal -->
      <h1 class="text-4xl sm:text-5xl font-black italic tracking-tight font-oswald uppercase mb-4 text-white">
        <template v-if="is404">
          Esta página <span class="text-[#39FF14]">no existe</span>
        </template>
        <template v-else>
          Tuvimos un <span class="text-red-400">inconveniente</span>
        </template>
      </h1>

      <!-- Descripción amigable -->
      <p class="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8 max-w-md">
        <template v-if="is404">
          El enlace que intentaste abrir no está disponible o ha sido reubicado. Te invitamos a explorar nuestro catálogo de productos o agendar tu cita.
        </template>
        <template v-else>
          Estamos ajustando detalles en la plataforma. Tu carrito y tus datos están a salvo. Puedes regresar a la tienda o escribirnos si necesitas ayuda inmediata.
        </template>
      </p>

      <!-- Botones de Acción Rápida -->
      <div class="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
        <button
          @click="handleClearError('/')"
          class="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-[#39FF14] text-black font-black uppercase text-xs tracking-widest hover:bg-[#32e012] transition-all duration-300 shadow-[0_0_20px_rgba(57,255,20,0.3)] hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
        >
          <fa-icon :icon="['fas', 'store']" class="text-xs" />
          <span>Ir a la Tienda</span>
        </button>

        <a
          href="https://wa.me/573337518070?text=Hola%20PersonalBarber,%20estaba%20en%20la%20web%20y%20tuve%20un%20inconveniente"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-white/5 border border-white/15 text-white font-bold uppercase text-xs tracking-widest hover:bg-white/10 hover:border-white/30 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <fa-icon :icon="['fab', 'whatsapp']" class="text-sm text-[#25D366]" />
          <span>Soporte WhatsApp</span>
        </a>
      </div>

      <!-- Enlace alternativo a Agendar -->
      <button
        @click="handleClearError('/agendar')"
        class="mt-8 text-xs text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-widest font-mono cursor-pointer"
      >
        ← O agendar cita con el barbero
      </button>
    </div>

    <!-- Footer minimalista -->
    <footer class="absolute bottom-6 text-center text-[10px] text-zinc-600 uppercase tracking-widest">
      PersonalBarber Medellín · Todos los derechos reservados
    </footer>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const is404 = computed(() => props.error?.statusCode === 404)

// Directiva crítica para SEO: NUNCA indexar páginas de error
useHead({
  title: is404.value
    ? 'Página no encontrada | PersonalBarber Medellín'
    : 'Inconveniente temporal | PersonalBarber Medellín',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' },
    { name: 'googlebot', content: 'noindex, nofollow' },
  ],
})

function handleClearError(redirectPath: string) {
  clearError({ redirect: redirectPath })
}
</script>
