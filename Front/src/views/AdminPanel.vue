<template>
  <div class="bg-black min-h-screen text-white flex flex-col items-center px-4 py-8">

    <!-- PIN de acceso -->
    <div v-if="!autenticado" class="w-full max-w-xs mt-20 bg-zinc-900 rounded-2xl p-8 shadow-xl border border-zinc-800 text-center">
      <h1 class="text-2xl font-bold mb-2">Panel Admin</h1>
      <p class="text-zinc-300 text-sm mb-6">Ingresa el PIN de acceso</p>
      <input
        v-model="pinIngresado"
        type="password"
        maxlength="6"
        placeholder="••••••"
        class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-center text-2xl tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
        @keyup.enter="verificarPin"
      >
      <p v-if="pinError" class="text-red-400 text-xs mb-3">PIN incorrecto</p>
      <button @click="verificarPin" class="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors">
        Entrar
      </button>
    </div>

    <!-- Panel principal -->
    <div v-else class="w-full max-w-3xl">

      <!-- Header -->
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-2xl font-bold">💈 Panel de Reservas</h1>
          <p class="text-zinc-300 text-sm mt-1">{{ reservas.length }} reserva(s) registrada(s)</p>
        </div>
        <div class="flex gap-3">
          <button @click="cargarReservas" :disabled="cargando" class="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm hover:bg-zinc-700 transition-colors disabled:opacity-50">
            {{ cargando ? 'Cargando...' : '🔄 Actualizar' }}
          </button>
          <button @click="salir" class="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-sm hover:bg-zinc-700 transition-colors">
            Salir
          </button>
        </div>
      </div>

      <!-- Estado vacío -->
      <div v-if="!cargando && reservas.length === 0" class="text-center py-20 text-zinc-500">
        <p class="text-4xl mb-4">📭</p>
        <p>No hay reservas registradas aún.</p>
      </div>

      <!-- Cargando -->
      <div v-if="cargando" class="text-center py-20 text-zinc-500">
        <p class="text-3xl mb-4 animate-spin inline-block">⚙️</p>
        <p>Cargando reservas...</p>
      </div>

      <!-- Tarjetas por fecha -->
      <div v-if="!cargando && reservas.length > 0">
        <div v-for="(grupo, fecha) in reservasPorFecha" :key="fecha" class="mb-8">
          <!-- Cabecera de fecha -->
          <div class="flex items-center gap-3 mb-3">
            <span class="text-yellow-400 font-bold text-sm uppercase tracking-wider">📅 {{ fecha }}</span>
            <div class="flex-1 h-px bg-zinc-800"></div>
            <span class="text-zinc-500 text-xs">{{ grupo.length }} reserva(s)</span>
          </div>

          <!-- Reservas del día -->
          <div class="space-y-3">
            <div
              v-for="r in grupo" :key="r.fecha + r.hora + r.nombre"
              class="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              <!-- Hora -->
              <div class="shrink-0 w-24 text-center bg-zinc-800 rounded-xl py-2 px-3">
                <span class="text-lg font-bold text-yellow-400">{{ r.hora }}</span>
              </div>

              <!-- Info -->
              <div class="flex-1 space-y-1">
                <p class="font-semibold text-white">{{ r.nombre }}</p>
                <p class="text-zinc-300 text-sm">✂️ {{ r.servicio }}</p>
                <p class="text-zinc-400 text-xs">📍 {{ r.direccion }}</p>
              </div>

              <!-- Tel + Estado -->
              <div class="flex flex-col items-end gap-2 shrink-0">
                <a
                  :href="`https://wa.me/57${r.telefono.replace(/[\s\-+]/g,'').replace(/^57/,'')}`"
                  target="_blank"
                  class="text-green-400 text-sm hover:text-green-300 transition-colors flex items-center gap-1"
                >
                  💬 {{ r.telefono }}
                </a>
                <span :class="estadoClase(r.estado)" class="text-xs font-semibold px-3 py-1 rounded-full">
                  {{ r.estado }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
// El PIN ahora se maneja vía variables de entorno VUE_APP_ADMIN_PIN

export default {
  name: 'AdminPanel',
  data() {
    return {
      autenticado: false,
      pinIngresado: '',
      pinError: false,
      cargando: false,
      reservas: []
    }
  },
  mounted() {
    // Restaurar sesión si existe
    const pinSesion = sessionStorage.getItem('admin_pin');
    if (pinSesion) {
      this.pinIngresado = pinSesion;
      this.verificarPin();
    }
  },
  computed: {
    reservasPorFecha() {
      // Agrupa las reservas por fecha y las ordena por hora dentro de cada día
      const grupos = {};
      const ordenadas = [...this.reservas].sort((a, b) => {
        if (a.fecha < b.fecha) return -1;
        if (a.fecha > b.fecha) return 1;
        // Misma fecha: ordenar por hora (convertimos a 24h para comparar)
        return this.a24h(a.hora) - this.a24h(b.hora);
      });
      ordenadas.forEach(r => {
        if (!grupos[r.fecha]) grupos[r.fecha] = [];
        grupos[r.fecha].push(r);
      });
      return grupos;
    }
  },
  methods: {
    verificarPin() {
      if (this.pinIngresado === process.env.VUE_APP_ADMIN_PIN) {
        this.autenticado = true;
        this.pinError = false;
        // Guardar en sesión
        sessionStorage.setItem('admin_pin', this.pinIngresado);
        this.cargarReservas();
      } else {
        this.pinError = true;
        this.pinIngresado = '';
        sessionStorage.removeItem('admin_pin');
      }
    },
    salir() {
      this.autenticado = false;
      this.pinIngresado = '';
      sessionStorage.removeItem('admin_pin');
    },
    async cargarReservas() {
      if (!process.env.VUE_APP_SLOTS_API) {
        alert('Configura VUE_APP_SLOTS_API en .env.local');
        return;
      }
      this.cargando = true;
      try {
        const url = new URL(process.env.VUE_APP_SLOTS_API);
        url.searchParams.append('token', this.pinIngresado);
        
        const res = await fetch(url);
        const data = await res.json();
        if (data.ok) {
          this.reservas = data.reservas;
        }
      } catch (e) {
        console.error('Error cargando reservas:', e);
      } finally {
        this.cargando = false;
      }
    },
    estadoClase(estado) {
      const mapa = {
        pendiente: 'bg-yellow-900/60 text-yellow-400',
        confirmada: 'bg-green-900/60 text-green-400',
        cancelada: 'bg-red-900/60 text-red-400'
      };
      return mapa[estado] || 'bg-zinc-800 text-zinc-400';
    },
    a24h(horaStr) {
      // Convierte "02:00 PM" a minutos totales para ordenar
      if (!horaStr) return 0;
      const [time, period] = horaStr.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    }
  }
}
</script>
