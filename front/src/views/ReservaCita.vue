<template>
  <div class="bg-black min-h-screen text-white flex flex-col items-center px-4 py-8">
    <div class="w-full max-w-md bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-800">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-white">Reserva tu Cita</h1>
        <router-link to="/" class="text-zinc-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </router-link>
      </div>

      <div v-if="success" class="bg-green-900/40 border border-green-500 rounded-xl p-6 text-center mb-6 fade-in">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
          <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-white mb-2">¡Cita Reservada con Éxito!</h2>
        <p class="text-zinc-300 text-sm">El barbero ha sido notificado. Nos pondremos en contacto contigo pronto.</p>
        <button @click="goToProducts" class="mt-6 w-full py-3 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors">
          Volver al Inicio y ver Productos
        </button>
      </div>

      <form v-else @submit.prevent="submitForm" class="space-y-6 fade-in">
        
        <!-- CALENDARIO VISUAL -->
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-3">1. Selecciona el Día</label>
        <div class="flex overflow-x-auto space-x-3 pb-4 snap-x custom-scrollbar">
            <div 
              v-for="(day, index) in availableDays" :key="index"
              @click="!isDiaLleno(day.rawDate) && selectDate(day.rawDate)"
              :class="[
                'snap-center shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl transition-all border outline-none relative',
                isDiaLleno(day.rawDate)
                  ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed opacity-60'
                  : selectedDate === day.rawDate 
                    ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.4)] scale-105 cursor-pointer' 
                    : 'bg-zinc-800 text-white border-zinc-700 hover:border-zinc-500 hover:bg-zinc-700 cursor-pointer'
              ]"
            >
              <span class="text-xs font-bold uppercase" :class="selectedDate === day.rawDate ? 'text-zinc-600' : isDiaLleno(day.rawDate) ? 'text-zinc-700' : 'text-zinc-400'">{{ day.name }}</span>
              <span class="text-xl font-bold mt-1">{{ day.number }}</span>
              <span class="text-[10px]" :class="selectedDate === day.rawDate ? 'text-zinc-600' : isDiaLleno(day.rawDate) ? 'text-zinc-700' : 'text-zinc-500'">{{ day.month }}</span>
              <!-- Indicador de lleno -->
              <span v-if="isDiaLleno(day.rawDate)" class="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[8px] flex items-center justify-center font-bold">✕</span>
            </div>
          </div>
        </div>

        <!-- FRANJAS HORARIAS -->
        <div v-show="selectedDate" class="fade-in">
          <div class="flex items-center justify-between mb-3">
            <label class="block text-sm font-medium text-zinc-400">2. Selecciona la Hora</label>
            <span v-if="isLoadingSlots" class="text-xs text-zinc-500 animate-pulse">Verificando disponibilidad...</span>
          </div>
          <div v-if="!isLoadingSlots && isDiaAgotado(selectedDate)" class="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center mt-2">
            <p class="text-orange-500 text-sm font-medium">⚠️ No hay turnos disponibles para este día.</p>
            <p class="text-zinc-500 text-xs mt-1">Por favor selecciona otra fecha cercana.</p>
          </div>
          <div v-else class="grid grid-cols-3 gap-3">
             <button 
                v-for="(time, index) in visibleTimeSlots" :key="index"
                type="button"
                :disabled="isLoadingSlots || isSlotOcupado(selectedDate, time)"
                @click="!isLoadingSlots && !isSlotOcupado(selectedDate, time) && (selectedTime = time)"
                :class="[
                  'py-3 rounded-xl font-semibold text-sm transition-all border relative',
                  isLoadingSlots
                    ? 'bg-zinc-900 text-zinc-700 border-zinc-800 cursor-wait animate-pulse'
                    : isSlotOcupado(selectedDate, time)
                      ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed line-through'
                      : selectedTime === time
                        ? 'bg-neon-green text-black border-neon-green shadow-[0_0_15px_rgba(57,255,20,0.3)]'
                        : 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:border-neon-green hover:text-neon-green'
                ]"
             >
               {{ time }}
               <span v-if="isSlotOcupado(selectedDate, time) && !isLoadingSlots" class="block text-[9px] font-normal no-underline text-zinc-600">Ocupado</span>
             </button>
          </div>
        </div>

        <!-- DATOS PERSONALES -->
        <div v-show="selectedDate && selectedTime" class="space-y-4 fade-in mt-6 pt-6 border-t border-zinc-800">
            <label class="block text-sm font-medium text-zinc-400 mb-1">3. Tus Datos</label>
            
            <input 
              type="text" 
              v-model="form.nombre"
              placeholder="Nombre Completo"
              required
              class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder-zinc-500"
            >
            
            <input 
              type="tel" 
              v-model="form.telefono"
              placeholder="WhatsApp: 301 123 4567"
              required
              maxlength="15"
              :class="[
                'w-full px-4 py-3 bg-zinc-800 border rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder-zinc-500',
                form.telefono && !isTelefonoValido ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-700'
              ]"
            >
            <!-- Mensaje de error de teléfono -->
            <p v-if="form.telefono && !isTelefonoValido" class="text-red-400 text-xs mt-1 ml-1">
              Ingresa un número colombiano válido (Ej: 301 123 4567)
            </p>

            <select 
              v-model="form.servicio" 
              required
              class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white"
            >
              <option value="" disabled>Selecciona un servicio</option>
              <option value="Corte Sencillo">Corte Sencillo</option>
              <option value="Corte + Barba">Corte + Barba</option>
              <option value="Solo Barba">Solo Barba</option>
              <option value="Depilación Nariz">Depilación Nariz</option>
              <option value="Depilación Oídos">Depilación Oídos</option>
            </select>

            <div class="relative group">
              <textarea 
                v-model="form.direccion"
                placeholder="Dirección Domicilar (Ej. Calle 45 # 12-34, Piso 2, Apto 201)"
                rows="2"
                required
                class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder-zinc-500 resize-none"
              ></textarea>
              <a 
                v-if="form.direccion.length > 5"
                :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.direccion)}`"
                target="_blank"
                class="absolute right-3 bottom-3 text-[10px] font-bold text-neon-green hover:underline flex items-center gap-1 bg-zinc-900/80 px-2 py-1 rounded-lg backdrop-blur-sm transition-all"
              >
                <i class="fas fa-map-marker-alt"></i> Verificar mapa
              </a>
            </div>

            <button 
              type="submit" 
              :disabled="isSubmitting || !isFormValid"
              class="w-full mt-4 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-zinc-200 transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.2)]"
            >
              <span v-if="isSubmitting">Procesando...</span>
              <span v-else>Confirmar Reserva</span>
            </button>
        </div>

      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReservaCita',
  data() {
    return {
      success: false,
      isSubmitting: false,
      isLoadingSlots: true,  // Arranca en true hasta que el API responda
      bookedSlots: [],
      availableDays: [],
      availableTimeSlots: [
        '07:00 AM', '08:30 AM', '10:00 AM', '11:30 AM', 
        '01:30 PM', '03:00 PM', '04:30 PM', 
        '06:00 PM', '07:30 PM', '09:00 PM',
      ],
      selectedDate: null,
      selectedTime: null,
      form: {
        nombre: '',
        telefono: '',
        servicio: '',
        direccion: ''
      }
    }
  },
  computed: {
    isFormValid() {
      return this.selectedDate && this.selectedTime && 
             this.form.nombre && this.isTelefonoValido && 
             this.form.servicio && this.form.direccion;
    },
    isTelefonoValido() {
      // Acepta formatos: 3011234567 | 301 123 4567 | 301-123-4567 | +573011234567
      const soloDigitos = this.form.telefono.replace(/[\s\-+]/g, '');
      // Número colombiano: empieza en 3 y tiene 10 dígitos, o 57 + 10 dígitos
      return /^(57)?3\d{9}$/.test(soloDigitos);
    },
    visibleTimeSlots() {
      if (!this.selectedDate) return this.availableTimeSlots;
      // Filtramos dinámicamente: solo mostramos si NO ha pasado (o si no es hoy)
      return this.availableTimeSlots.filter(time => !this.isSlotPasado(this.selectedDate, time));
    }
  },
  mounted() {
    document.title = 'Reservar Cita | PersonalBarber Medellín'
    this.generateDays();
    this.cargarSlotsOcupados();

    if (this.$route.query.service) {
      this.form.servicio = this.$route.query.service;
    }
  },
  methods: {
    async cargarSlotsOcupados(fecha = null) {
      this.isLoadingSlots = true;
      const targetDate = fecha || this.selectedDate;
      if (!targetDate) {
        this.isLoadingSlots = false;
        return;
      }
      try {
        // Usamos el nuevo endpoint público get_slots: devuelve solo horas, sin datos privados
        const res = await fetch(`/api/get_slots?date=${targetDate}`);
        const data = await res.json();
        if (data.ok) {
          // Merge: mantener slots de otras fechas ya cargadas, reemplazar los de targetDate
          this.bookedSlots = [
            ...this.bookedSlots.filter(s => s.fecha !== targetDate),
            ...(data.horas || []).map(h => ({ fecha: targetDate, hora: h }))
          ];
        }
      } catch (e) {
        console.warn('No se pudo cargar disponibilidad:', e);
      } finally {
        this.isLoadingSlots = false;
      }
    },
    isSlotOcupado(fecha, hora) {
      return this.bookedSlots.some(s => s.fecha === fecha && s.hora === hora);
    },
    isDiaLleno(fecha) {
      if (!fecha) return false;
      // Un día está "Lleno" si todas sus franjas están ocupadas en el sheet
      const ocupados = this.bookedSlots.filter(s => s.fecha === fecha).length;
      return ocupados >= this.availableTimeSlots.length;
    },
    isDiaAgotado(fecha) {
      if (!fecha) return false;
      // Un día está "Agotado" si cada slot está o bien OCUPADO o bien ya PASÓ (si es hoy)
      return this.availableTimeSlots.every(time => 
        this.isSlotOcupado(fecha, time) || this.isSlotPasado(fecha, time)
      );
    },
    isSlotPasado(fecha, hora) {
      const today = new Date().toISOString().split('T')[0];
      if (fecha !== today) return false;

      const ahora = new Date();
      const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
      const minutosSlot = this.a24h(hora);

      // Bloqueamos si ya pasaron o si faltan menos de 30 min (opcional, da margen)
      return minutosSlot < (minutosAhora + 15); 
    },
    a24h(horaStr) {
      if (!horaStr) return 0;
      const [time, period] = horaStr.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    },
    generateDays() {
      // Generamos los próximos 14 días a partir de hoy
      const days = [];
      const today = new Date();
      
      const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

      for (let i = 0; i < 14; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        
        // Evitar domingos (0) si la barbería no abre, de ser así descomentar la siguiente línea:
        // if (nextDate.getDay() === 0) continue;

        days.push({
          rawDate: nextDate.toISOString().split('T')[0], // YYYY-MM-DD
          name: i === 0 ? 'Hoy' : dayNames[nextDate.getDay()],
          number: nextDate.getDate(),
          month: monthNames[nextDate.getMonth()]
        });
      }
      this.availableDays = days;
    },
    selectDate(date) {
      this.selectedDate = date;
      this.selectedTime = null;
      // Cargar slots ocupados para la fecha seleccionada
      this.cargarSlotsOcupados(date);
    },
    async submitForm() {
      if(this.isSubmitting || !this.isFormValid) return;
      this.isSubmitting = true;

      // Limpiamos el número para garantizar formato internacional para WhatsApp
      const soloDigitos = this.form.telefono.replace(/[\s\-+]/g, '');
      const numeroWA = soloDigitos.startsWith('57') ? soloDigitos : `57${soloDigitos}`;

      // 1. Armamos el paquete de datos estructurado que Make.com va a recibir
      const payload = {
        nombre: this.form.nombre,
        servicio: this.form.servicio,
        fechaRaw: this.selectedDate,
        horaRaw: this.selectedTime,
        fechaCompleta: `${this.selectedDate} a las ${this.selectedTime}`,
        direccion: this.form.direccion,
        telefono: this.form.telefono,
        // Link directo para que el barbero abra WhatsApp con el cliente con un solo clic
        whatsappUrl: `https://wa.me/${numeroWA}`
      };

      try {
        // 2. Enviamos los datos a nuestra nueva API en Go (Netlify Functions)
        const response = await fetch('/.netlify/functions/reserve', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          this.success = true;
          setTimeout(() => {
            this.goToProducts();
          }, 3000);
        } else if (response.status === 409) {
          // Turno ya reservado: recargar slots y mostrar alerta amigable
          await this.cargarSlotsOcupados(this.selectedDate);
          this.selectedTime = null;
          alert('⚠️ Este turno ya fue reservado mientras completabas el formulario. Por favor elige otro horario.');
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error en el servidor');
        }

      } catch (error) {
        console.error("Hubo un error enviando la reserva:", error);
        alert(error.message || "Ocurrió un problema enviando tu reserva. Por favor intenta de nuevo.");
        // Si falló, recargamos los slots por si acaso alguien tomó el turno mientras el usuario llenaba el formulario
        this.cargarSlotsOcupados();
      } finally {
        this.isSubmitting = false;
      }
    },
    resetForm() {
      this.success = false;
      this.selectedDate = null;
      this.selectedTime = null;
      this.form = {
        nombre: '',
        telefono: '',
        servicio: '',
        direccion: ''
      };
      this.$router.replace({ query: {} });
    },
    goToProducts() {
      this.$router.push('/#productos');
    }
  }
}
</script>

<style scoped>
/* Animaciones suaves */
.fade-in {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scrollbar personalizada para desktop */
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #52525b; /* zinc-600 */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #71717a; /* zinc-500 */
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #52525b transparent;
}
</style>
