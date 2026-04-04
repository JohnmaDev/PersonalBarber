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
        <button @click="goToProducts" class="mt-6 w-full py-3 bg-neon-green text-black font-bold rounded-xl hover:bg-neon-green-dark transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)]">
          Ver Productos y Gorras Medellín
        </button>
      </div>

      <form v-else @submit.prevent="submitForm" class="space-y-6 fade-in">
        
        <!-- CALENDARIO VISUAL -->
        <div>
          <label class="block text-sm font-medium text-zinc-400 mb-3">1. Selecciona el Día</label>
        <div 
          class="flex overflow-x-auto space-x-3 py-4 snap-x custom-scrollbar select-none"
          ref="dateCarousel"
          @mousedown="startDragging($event, 'dateCarousel')"
          @mousemove="onDrag($event, 'dateCarousel')"
          @mouseup="stopDragging"
          @mouseleave="stopDragging"
        >
            <div 
              v-for="(day, index) in availableDays" :key="index"
              @click="!hasMoved && !isDiaLleno(day.rawDate) && selectDate(day.rawDate)"
              :class="[
                'snap-center shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl transition-all border outline-none relative',
                isDiaLleno(day.rawDate)
                  ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed opacity-60'
                  : selectedDate === day.rawDate 
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-110 cursor-pointer z-10' 
                    : 'bg-zinc-800 text-white border-zinc-700 hover:border-zinc-500 hover:bg-zinc-700 cursor-pointer'
              ]"
            >
              <span class="text-xs font-bold uppercase" :class="selectedDate === day.rawDate ? 'text-zinc-600' : isDiaLleno(day.rawDate) ? 'text-zinc-700' : 'text-zinc-400'">{{ day.name }}</span>
              <span class="text-xl font-bold mt-1">{{ day.number }}</span>
              <span class="text-[10px]" :class="selectedDate === day.rawDate ? 'text-zinc-500' : isDiaLleno(day.rawDate) ? 'text-zinc-700' : 'text-zinc-500'">{{ day.month }}</span>
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

            <!-- SELECTOR DE SERVICIOS - CAROUSEL INTERACTIVO -->
            <div class="service-selector-wrapper">
              <label class="block text-sm font-medium text-zinc-400 mb-3">Selecciona el Servicio</label>
              
              <!-- Track del carousel -->
              <div 
                class="service-carousel select-none" 
                ref="serviceCarousel"
                @mousedown="startDragging($event, 'serviceCarousel')"
                @mousemove="onDrag($event, 'serviceCarousel')"
                @mouseup="stopDragging"
                @mouseleave="stopDragging"
              >
                <div 
                  v-for="srv in servicios" 
                  :key="srv.value"
                  @click="!hasMoved && selectServicio(srv.value)"
                  :class="['service-card', form.servicio === srv.value ? 'service-card--active' : '']" 
                >
                  <!-- Icono SVG animado -->
                  <div class="service-icon-wrapper">
                    <div class="service-icon" v-html="srv.icon"></div>
                  </div>
                  <!-- Info -->
                  <div class="service-info">
                    <h3 class="service-name">{{ srv.label }}</h3>
                    <p class="service-desc">{{ srv.desc }}</p>
                  </div>
                  <!-- Check seleccionado -->
                  <div v-if="form.servicio === srv.value" class="service-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Indicador de puntos -->
              <div class="service-dots">
                <span 
                  v-for="(srv, idx) in servicios" :key="idx"
                  :class="['service-dot', form.servicio === srv.value ? 'service-dot--active' : '']"
                  @click="scrollToService(idx)"
                ></span>
              </div>

              <!-- Badge de servicio seleccionado -->
              <transition name="badge-fade">
                <div v-if="form.servicio" class="service-selected-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="badge-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  <span>{{ servicios.find(s => s.value === form.servicio)?.label }}</span>
                </div>
              </transition>
            </div>

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
              class="w-full mt-4 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-zinc-200 transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02]"
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
      isLoadingSlots: true,
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
      },
      isDragging: false,
      startX: 0,
      scrollLeft: 0,
      hasMoved: false,
      servicios: [
        {
          value: 'Corte Sencillo',
          label: 'Corte Sencillo',
          desc: 'Corte profesional con cualquier estilo del menú.',
          icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-scissors">
            <circle cx="18" cy="46" r="6" stroke="currentColor" stroke-width="2.5"/>
            <circle cx="18" cy="18" r="6" stroke="currentColor" stroke-width="2.5"/>
            <line x1="22.5" y1="21.5" x2="50" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="22.5" y1="42.5" x2="50" y2="52" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="35" y1="32" x2="50" y2="32" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>`
        },
        {
          value: 'Corte + Barba',
          label: 'Corte + Barba',
          desc: 'Corte completo con recorte y diseño de barba.',
          icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-cut-beard">
            <!-- Camisa/Cuerpo -->
            <path d="M16 60 V52 C16 45 22 40 28 40 H36 C42 40 48 45 48 52 V60" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M24 40 L24 60M40 40 L40 60" stroke="currentColor" stroke-width="2"/>
            <path d="M24 50 L16 52M40 50 L48 52" stroke="currentColor" stroke-width="2"/>
            <!-- Cara / Cabello -->
            <path d="M24 25 C24 16 28 14 32 14 C36 14 40 16 40 25 V30 C40 37 36 40 32 40 C28 40 24 37 24 30 V25Z" stroke="currentColor" stroke-width="2"/>
            <path d="M23 18 C23 12 26 8 32 8 C38 8 41 12 41 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <!-- Moño -->
            <circle cx="32" cy="7" r="3" stroke="currentColor" stroke-width="2"/>
            <!-- Barba -->
            <path d="M24 25 C20 32 20 40 32 46 C44 40 44 32 40 25" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <!-- Bigote -->
            <path d="M26 34 C28 32 30 32 32 33 C34 32 36 32 38 34 C36 35 34 36 32 35 C30 36 28 35 26 34Z" stroke="currentColor" stroke-width="2"/>
          </svg>`
        },
        {
          value: 'Solo Barba',
          label: 'Solo Barba',
          desc: 'Recorte, forma y estilo de barba profesional.',
          icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-beard">
            <!-- Bigote -->
            <path d="M14 26 C20 26 24 20 32 20 C40 20 44 26 50 26 C46 30 40 32 32 30 C24 32 18 30 14 26Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- Barba -->
            <path d="M16 28 C14 36 16 44 24 50 C28 53 32 54 32 54 C32 54 36 53 40 50 C48 44 50 36 48 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- Curvas internas de la barba -->
            <path d="M20 32 C20 40 26 48 32 50 C38 48 44 40 44 32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>`
        },
        {
          value: 'Depilación Nariz',
          label: 'Depilación Nariz',
          desc: 'Eliminación rápida y precisa de vellos nasales.',
          icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-nose">
            <!-- Puente de la nariz -->
            <path d="M32 14 C32 26 24 34 24 42 C24 48 28 50 32 50 C36 50 40 48 40 42 C40 34 32 26 32 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <!-- Fosas nasales -->
            <path d="M22 42 C18 42 16 46 18 48 C20 50 24 50 26 46" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M42 42 C46 42 48 46 46 48 C44 50 40 50 38 46" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <!-- Vellos nasales (destellos que serán removidos/animados) -->
            <path d="M22 52 L20 56 M26 52 L28 58" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="icon-spark"/>
            <path d="M42 52 L44 56 M38 52 L36 58" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="icon-spark"/>
          </svg>`
        },
        {
          value: 'Depilación Oídos',
          label: 'Depilación Oídos',
          desc: 'Tratamiento de vello en oídos limpio y sin dolor.',
          icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-ear">
            <path d="M24 18 C18 22 16 30 18 38 C20 44 26 50 30 50 C28 46 28 42 32 40 C36 38 40 34 40 28 C40 20 34 14 28 14 C22 14 18 18 18 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M28 26 C28 26 32 28 32 32 C32 36 28 38 28 42" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="40" y1="10" x2="46" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="icon-spark"/>
            <line x1="44" y1="16" x2="52" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="icon-spark"/>
          </svg>`
        }
      ]
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

      for (let i = 1; i <= 14; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        
        // Evitar domingos (0) si la barbería no abre:
        // if (nextDate.getDay() === 0) continue;

        days.push({
          rawDate: nextDate.toISOString().split('T')[0], // YYYY-MM-DD
          name: i === 1 ? 'Mañana' : dayNames[nextDate.getDay()],
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
        const response = await fetch('/api/reserve', {
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
    selectServicio(value) {
      this.form.servicio = value;
    },
    scrollToService(idx) {
      const carousel = this.$refs.serviceCarousel;
      if (!carousel) return;
      const card = carousel.children[idx];
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        this.form.servicio = this.servicios[idx].value;
      }
    },
    // Métodos para Arrastrar (Desktop Drag-to-scroll)
    startDragging(e, refName) {
      this.isDragging = true;
      this.hasMoved = false;
      const el = this.$refs[refName];
      this.startX = e.pageX - el.offsetLeft;
      this.scrollLeft = el.scrollLeft;
      el.style.scrollSnapType = 'none'; // Desactivar snap durante el drag
    },
    stopDragging() {
      this.isDragging = false;
      // Re-activar snap después de un pequeño delay
      setTimeout(() => {
        if (this.$refs.dateCarousel) this.$refs.dateCarousel.style.scrollSnapType = 'x mandatory';
        if (this.$refs.serviceCarousel) this.$refs.serviceCarousel.style.scrollSnapType = 'x mandatory';
      }, 100);
    },
    onDrag(e, refName) {
      if (!this.isDragging) return;
      e.preventDefault();
      const el = this.$refs[refName];
      const x = e.pageX - el.offsetLeft;
      const walk = (x - this.startX) * 1.5; // Velocidad de scroll
      if (Math.abs(walk) > 3) {
        this.hasMoved = true;
      }
      el.scrollLeft = this.scrollLeft - walk;
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
      this.$router.push('/tienda');
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
  background-color: #52525b;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #71717a;
}
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #52525b transparent;
}

/* ===== SERVICE SELECTOR CAROUSEL ===== */
.service-selector-wrapper {
  position: relative;
}

.service-carousel {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  padding: 8px 4px 16px;
  cursor: grab;
}
.service-carousel:active {
  cursor: grabbing;
}
.service-carousel::-webkit-scrollbar {
  display: none;
}

/* Tarjeta de servicio */
.service-card {
  scroll-snap-align: center;
  flex-shrink: 0;
  width: 140px;
  background: #18181b;
  border: 1.5px solid #3f3f46;
  border-radius: 20px;
  padding: 18px 12px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  position: relative;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease, background 0.3s ease;
  user-select: none;
}
.service-card:hover {
  border-color: #39FF14;
  transform: translateY(-3px);
  background: #0a1a08;
}
.service-card--active {
  border-color: #39FF14 !important;
  background: #071207 !important;
  box-shadow: 0 0 22px rgba(57, 255, 20, 0.35), inset 0 0 18px rgba(57, 255, 20, 0.07);
  transform: translateY(-4px) scale(1.03);
}

/* Icono contenedor */
.service-icon-wrapper {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #27272a;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
}
.service-card:hover .service-icon-wrapper,
.service-card--active .service-icon-wrapper {
  background: rgba(57, 255, 20, 0.12);
}
.service-icon {
  width: 30px;
  height: 30px;
  color: #a1a1aa;
  transition: color 0.3s ease;
}
.service-icon svg {
  width: 100%;
  height: 100%;
}
.service-card:hover .service-icon,
.service-card--active .service-icon {
  color: #39FF14;
}

/* Animaciones de los iconos SVG */
/* Tijeras - movimiento de corte */
:deep(.icon-scissors) {
  animation: scissorIdle 3s ease-in-out infinite;
  transform-origin: 35px 32px;
}
.service-card:hover :deep(.icon-scissors),
.service-card--active :deep(.icon-scissors) {
  animation: scissorCut 0.4s ease-in-out infinite alternate;
}
@keyframes scissorIdle {
  0%, 100% { transform: rotate(0deg); }
  50% { transform: rotate(5deg); }
}
@keyframes scissorCut {
  from { transform: rotate(-8deg); }
  to   { transform: rotate(8deg); }
}

/* Barba+corte - pulso suave */
:deep(.icon-cut-beard) {
  animation: beardPulse 2.5s ease-in-out infinite;
}
@keyframes beardPulse {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.06); }
}

/* Barba sola - balanceo */
:deep(.icon-beard) {
  animation: beardWave 3s ease-in-out infinite;
  transform-origin: 32px 40px;
}
.service-card:hover :deep(.icon-beard),
.service-card--active :deep(.icon-beard) {
  animation: beardWaveFast 1.2s ease-in-out infinite;
}
@keyframes beardWave {
  0%, 100% { transform: rotate(-4deg); }
  50%       { transform: rotate(4deg); }
}
@keyframes beardWaveFast {
  0%, 100% { transform: rotate(-6deg); }
  50%       { transform: rotate(6deg); }
}

/* Nariz - destellos parpadeantes */
:deep(.icon-spark) {
  animation: sparkle 1.5s ease-in-out infinite alternate;
  transform-origin: center;
}
:deep(.icon-spark:last-child) {
  animation-delay: 0.3s;
}
@keyframes sparkle {
  from { opacity: 0.3; transform: scale(0.8); }
  to   { opacity: 1;   transform: scale(1.15); }
}

/* Oído - ondas de sonido animadas */
:deep(.icon-ear) {
  animation: earWiggle 2s ease-in-out infinite;
}
.service-card:hover :deep(.icon-ear),
.service-card--active :deep(.icon-ear) {
  animation: earWiggleFast 0.8s ease-in-out infinite;
}
@keyframes earWiggle {
  0%, 100% { transform: translateX(0); }
  25%  { transform: translateX(2px); }
  75%  { transform: translateX(-2px); }
}
@keyframes earWiggleFast {
  0%, 100% { transform: translateX(0); }
  25%  { transform: translateX(3px); }
  75%  { transform: translateX(-3px); }
}

/* Texto de la tarjeta */
.service-info {
  text-align: center;
}
.service-name {
  font-size: 12px;
  font-weight: 700;
  color: #e4e4e7;
  line-height: 1.2;
  margin-bottom: 4px;
  transition: color 0.3s ease;
}
.service-card--active .service-name {
  color: #39FF14;
}
.service-desc {
  font-size: 10px;
  color: #71717a;
  line-height: 1.35;
}

/* Check de seleccionado */
.service-check {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 18px;
  height: 18px;
  background: #39FF14;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.service-check svg {
  width: 10px;
  height: 10px;
  color: black;
}
@keyframes popIn {
  from { transform: scale(0); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

/* Puntos indicadores */
.service-dots {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-top: 4px;
}
.service-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3f3f46;
  cursor: pointer;
  transition: background 0.3s ease, transform 0.2s ease, width 0.3s ease;
}
.service-dot--active {
  background: #39FF14;
  width: 18px;
  border-radius: 4px;
  transform: scale(1.1);
}

/* Badge de confirmación */
.service-selected-badge {
  margin-top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(57, 255, 20, 0.1);
  border: 1px solid rgba(57, 255, 20, 0.3);
  border-radius: 10px;
  padding: 6px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #39FF14;
}
.badge-icon {
  width: 14px;
  height: 14px;
}
.badge-fade-enter-active {
  animation: badgePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.badge-fade-leave-active {
  animation: badgePop 0.2s ease reverse;
}
@keyframes badgePop {
  from { opacity: 0; transform: translateY(6px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
