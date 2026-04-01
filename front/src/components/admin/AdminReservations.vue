<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div>
        <h2 class="text-lg font-bold">Agenda de Citas</h2>
        <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5">
          {{ proximasCount }} próxima{{ proximasCount !== 1 ? 's' : '' }} · {{ historialCount }} en historial
        </p>
      </div>
      <button @click="cargarReservas" :disabled="cargando" class="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold hover:border-neon-green/50 transition-all group">
        <i v-if="cargando" class="fas fa-sync-alt animate-spin text-neon-green"></i>
        <i v-else class="fas fa-sync-alt text-zinc-500 group-hover:text-white transition-colors"></i>
        {{ cargando ? 'Cargando...' : 'Actualizar' }}
      </button>
    </div>

    <div :class="{'opacity-40 pointer-events-none transition-opacity duration-500': cargando}">
      <!-- Estado vacío Reservas -->
      <div v-if="reservas.length === 0" class="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
        <i class="fas fa-calendar-times text-4xl text-zinc-700 mb-4"></i>
        <p class="text-zinc-500 font-medium">No hay reservas registradas aún.</p>
      </div>

      <div v-else>
        <!-- ── PRÓXIMAS CITAS ── -->
        <div class="mb-10">
          <div class="flex items-center gap-3 mb-5">
            <span class="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_rgba(57,255,20,0.6)]"></span>
            <h3 class="text-sm font-black uppercase tracking-wider text-white">Próximas Citas</h3>
            <span class="text-[10px] bg-neon-green/10 text-neon-green border border-neon-green/20 px-2 py-0.5 rounded-full font-black">{{ proximasCount }}</span>
          </div>

          <div v-if="proximasCount === 0" class="text-center py-12 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800">
            <i class="fas fa-calendar-check text-3xl text-zinc-700 mb-3"></i>
            <p class="text-zinc-500 text-sm">Nada en agenda. ¡Disfruta el día!</p>
          </div>

          <div v-else>
            <div v-for="(grupo, fecha) in proximasPorFecha" :key="'p' + fecha" class="mb-8">
              <div class="flex items-center gap-4 mb-3">
                <span class="bg-neon-green text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">{{ fecha }}</span>
                <div class="flex-1 h-px bg-neon-green/20"></div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="r in grupo" :key="'pr' + (r.fechaRaw || '') + (r.horaRaw || '')" class="bg-zinc-900 border border-zinc-800 hover:border-neon-green/30 rounded-2xl p-4 flex gap-4 transition-all">
                  <div class="w-16 h-16 bg-zinc-800 rounded-xl flex flex-col items-center justify-center border border-neon-green/20 shrink-0">
                    <span class="text-xs font-black text-neon-green leading-none">{{ (r.horaRaw || '00:00 AM').split(' ')[0] }}</span>
                    <span class="text-[8px] font-bold text-zinc-500 uppercase">{{ (r.horaRaw || '00:00 AM').split(' ')[1] }}</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="font-bold text-sm truncate">{{ r.nombre }}</p>
                    <p class="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">{{ r.servicio }}</p>
                    <p v-if="r.direccion" class="text-[9px] text-zinc-500 italic mt-1 line-clamp-1">📍 {{ r.direccion }}</p>
                    <div class="flex items-center gap-3 mt-3">
                      <a :href="`https://wa.me/57${cleanPhone(r.telefono)}`" target="_blank" class="text-[10px] font-black text-green-500 hover:text-green-400 flex items-center gap-1.5 uppercase">
                        <i class="fab fa-whatsapp text-xs"></i> WhatsApp
                      </a>
                      <a v-if="r.direccion" :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.direccion)}`" target="_blank" class="text-[10px] font-black text-neon-green hover:text-neon-green-dark flex items-center gap-1.5 uppercase">
                        <i class="fas fa-map-marker-alt text-xs"></i> Maps
                      </a>
                      <span :class="estadoClase(r.estado)" class="text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">{{ r.estado }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ── HISTORIAL ── -->
        <div v-if="historialCount > 0">
          <button @click="showHistorial = !showHistorial" class="w-full flex items-center justify-between gap-3 mb-4 px-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all group">
            <div class="flex items-center gap-3">
              <span class="w-2 h-2 rounded-full bg-zinc-600"></span>
              <span class="text-xs font-black uppercase tracking-wider text-zinc-500 group-hover:text-zinc-400">Historial de Citas Pasadas</span>
              <span class="text-[10px] bg-zinc-800 text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded-full font-black">{{ historialCount }}</span>
            </div>
            <i class="fas text-zinc-600 text-xs transition-transform duration-300" :class="showHistorial ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
          </button>

          <transition name="fade">
            <div v-if="showHistorial" class="opacity-60">
              <div v-for="(grupo, fecha) in historialPorFecha" :key="'h' + fecha" class="mb-6">
                <div class="flex items-center gap-4 mb-3">
                  <span class="bg-zinc-700 text-zinc-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">{{ fecha }}</span>
                  <div class="flex-1 h-px bg-zinc-800"></div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div v-for="r in grupo" :key="'hr' + (r.fechaRaw || '') + (r.horaRaw || '')" class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex gap-4">
                    <div class="w-16 h-16 bg-zinc-800/50 rounded-xl flex flex-col items-center justify-center border border-zinc-700 shrink-0">
                      <span class="text-xs font-black text-zinc-500 leading-none">{{ (r.horaRaw || '00:00 AM').split(' ')[0] }}</span>
                      <span class="text-[8px] font-bold text-zinc-600 uppercase">{{ (r.horaRaw || '00:00 AM').split(' ')[1] }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="font-bold text-sm truncate text-zinc-400">{{ r.nombre }}</p>
                      <p class="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5">{{ r.servicio }}</p>
                      <div class="flex items-center gap-3 mt-3">
                        <a :href="`https://wa.me/57${cleanPhone(r.telefono)}`" target="_blank" class="text-[10px] font-black text-zinc-600 hover:text-zinc-400 flex items-center gap-1.5 uppercase">
                          <i class="fab fa-whatsapp text-xs"></i> WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminReservations',
  props: {
    adminPin: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      cargando: false,
      reservas: [],
      showHistorial: false
    }
  },
  mounted() {
    this.cargarReservas()
  },
  computed: {
    proximasPorFecha() {
      const hoy = new Date().toISOString().split('T')[0];
      const grupos = {};
      const ordenadas = [...this.reservas]
        .filter(r => (r.fechaRaw || '') >= hoy)
        .sort((a, b) => {
          if (a.fechaRaw < b.fechaRaw) return -1;
          if (a.fechaRaw > b.fechaRaw) return 1;
          return this.a24h(a.horaRaw) - this.a24h(b.horaRaw);
        });
      ordenadas.forEach(r => {
        const f = r.fechaRaw || 'Sin fecha';
        if (!grupos[f]) grupos[f] = [];
        grupos[f].push(r);
      });
      return grupos;
    },
    historialPorFecha() {
      const hoy = new Date().toISOString().split('T')[0];
      const grupos = {};
      const ordenadas = [...this.reservas]
        .filter(r => (r.fechaRaw || '') < hoy) 
        .sort((a, b) => {
          // Descendente: las más recientes primero
          if (a.fechaRaw > b.fechaRaw) return -1;
          if (a.fechaRaw < b.fechaRaw) return 1;
          return this.a24h(b.horaRaw) - this.a24h(a.horaRaw);
        });
      ordenadas.forEach(r => {
        const f = r.fechaRaw || 'Sin fecha';
        if (!grupos[f]) grupos[f] = [];
        grupos[f].push(r);
      });
      return grupos;
    },
    proximasCount() {
      const hoy = new Date().toISOString().split('T')[0];
      return this.reservas.filter(r => (r.fechaRaw || '') >= hoy).length;
    },
    historialCount() {
      const hoy = new Date().toISOString().split('T')[0];
      return this.reservas.filter(r => (r.fechaRaw || '') < hoy).length;
    }
  },
  methods: {
    async cargarReservas() {
      this.cargando = true;
      try {
        const url = `/api/list_reservations?token=${this.adminPin}`;
        
        const res = await fetch(url);
        const data = await res.json();
        if (data.ok) this.reservas = data.reservas;
      } catch (e) {
        console.error('Error cargando reservas:', e);
      } finally {
        this.cargando = false;
      }
    },
    cleanPhone(tel) {
      if (!tel) return '';
      return tel.replace(/[\s\-+]/g,'').replace(/^57/,'');
    },
    estadoClase(estado) {
      const mapa = {
        pendiente: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
        confirmada: 'bg-green-500/10 text-green-500 border border-green-500/20',
        cancelada: 'bg-red-500/10 text-red-500 border border-red-500/20'
      };
      return mapa[estado] || 'bg-zinc-800 text-zinc-400';
    },
    a24h(horaStr) {
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

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
