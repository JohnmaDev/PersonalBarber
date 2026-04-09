<template>
  <!-- Admin panel — completamente client-side (no necesita SSR/indexación) -->
  <ClientOnly>
    <div class="bg-black min-h-screen text-white flex flex-col items-center px-4 py-8">

      <!-- PIN de acceso -->
      <div v-if="!autenticado" class="w-full max-w-xs mt-20 bg-zinc-900 rounded-2xl p-8 shadow-xl border border-zinc-800 text-center">
        <h1 class="text-2xl font-bold mb-2">Panel Admin</h1>
        <p class="text-zinc-300 text-sm mb-6">Ingresa el PIN de acceso</p>
        <input v-model="pinIngresado" type="password" maxlength="6" placeholder="••••••"
          class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-center text-2xl tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-neon-green mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
          @keyup.enter="verificarPin" />
        <p v-if="pinError" class="text-red-400 text-xs mb-3">PIN incorrecto</p>
        <button @click="verificarPin" class="w-full py-3 bg-neon-green text-black font-black italic tracking-widest uppercase rounded-xl hover:bg-neon-green-dark hover:scale-105 transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)]">
          Entrar
        </button>
        <NuxtLink to="/" class="mt-8 flex items-center justify-center gap-2 text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all group">
          <fa-icon :icon="['fas', 'arrow-left']" class="text-[8px] group-hover:-translate-x-1 transition-transform" />
          Volver al Inicio
        </NuxtLink>
      </div>

      <!-- Panel principal -->
      <div v-else class="max-w-6xl mx-auto px-4 py-12 w-full">
        <div class="flex flex-col items-center mb-16 text-center">
          <h1 class="text-[3.5rem] leading-tight sm:text-[5rem] lg:text-[80px] font-black lg:leading-tight tracking-tighter italic uppercase">
            <span class="text-neon-green block sm:inline drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">ADMIN</span> PANEL
          </h1>
          <p class="text-zinc-500 font-bold tracking-[0.3em] text-sm lg:text-base uppercase mt-4">Gestión Central de Barbería (v2)</p>
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <div class="flex flex-wrap lg:flex-nowrap bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
              :class="['px-6 py-2 rounded-xl text-xs font-black uppercase transition-all duration-300',
                activeTab === tab.id ? 'bg-neon-green text-black' : 'text-zinc-400 hover:text-white']">
              {{ tab.label }}
            </button>
          </div>
          <button @click="salir" class="p-2 w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-red-400 transition-colors">
            <fa-icon :icon="['fas', 'sign-out-alt']" />
          </button>
        </div>

        <!-- Componentes Dinámicos de Pestañas -->
        <Transition name="fade" mode="out-in">
          <KeepAlive>
            <component :is="activeComponent" :admin-pin="pinIngresado" />
          </KeepAlive>
        </Transition>
      </div>
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import AdminReservations from '~/components/admin/AdminReservations.vue'
import AdminProducts from '~/components/admin/AdminProducts.vue'
import AdminCategories from '~/components/admin/AdminCategories.vue'
import AdminCuts from '~/components/admin/AdminCuts.vue'

useSeoMeta({ title: 'Panel de Administración | PersonalBarber' })

const config = useRuntimeConfig()

// PIN validado contra ENV var (Nuxt runtimeConfig)
const autenticado = ref(false)
const pinIngresado = ref('')
const pinError = ref(false)
const activeTab = ref('reservas')

const tabs = [
  { id: 'reservas', label: 'Reservas' },
  { id: 'tienda', label: 'Tienda' },
  { id: 'categorias', label: 'Categorías' },
  { id: 'cortes', label: 'Cortes' },
]

const activeComponent = computed(() => {
  const map: Record<string, ReturnType<typeof defineComponent>> = {
    reservas: AdminReservations,
    tienda: AdminProducts,
    categorias: AdminCategories,
    cortes: AdminCuts,
  }
  return map[activeTab.value]
})

function verificarPin() {
  // Comparar contra variable de entorno pública de Nuxt (NUXT_PUBLIC_ADMIN_PIN en Netlify)
  const correctPin = config.public.adminPin
  if (pinIngresado.value === correctPin) {
    autenticado.value = true
    pinError.value = false
    sessionStorage.setItem('admin_pin', pinIngresado.value)
  } else {
    pinError.value = true
    pinIngresado.value = ''
    sessionStorage.removeItem('admin_pin')
  }
}

function salir() {
  autenticado.value = false
  pinIngresado.value = ''
  sessionStorage.removeItem('admin_pin')
}

onMounted(() => {
  const pinSesion = sessionStorage.getItem('admin_pin')
  if (pinSesion) {
    pinIngresado.value = pinSesion
    verificarPin()
  }
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
