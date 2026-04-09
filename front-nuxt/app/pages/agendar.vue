<template>
  <div class="bg-black min-h-screen text-white flex flex-col items-center px-4 py-8">
    <div class="w-full max-w-md bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-800">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-white">Reserva tu Cita</h1>
        <NuxtLink to="/" class="text-zinc-400 hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </NuxtLink>
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
          <div class="flex overflow-x-auto space-x-3 py-4 snap-x custom-scrollbar select-none"
            ref="dateCarouselRef"
            @mousedown="startDragging($event, 'dateCarousel')"
            @mousemove="onDrag($event, 'dateCarousel')"
            @mouseup="stopDragging"
            @mouseleave="stopDragging">
            <div v-for="(day, index) in availableDays" :key="index"
              @click="!hasMoved && !isDiaLleno(day.rawDate) && selectDate(day.rawDate)"
              :class="['snap-center shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl transition-all border outline-none relative',
                isDiaLleno(day.rawDate)
                  ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed opacity-60'
                  : selectedDate === day.rawDate
                    ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-110 cursor-pointer z-10'
                    : 'bg-zinc-800 text-white border-zinc-700 hover:border-zinc-500 hover:bg-zinc-700 cursor-pointer']">
              <span class="text-xs font-bold uppercase" :class="selectedDate === day.rawDate ? 'text-zinc-600' : isDiaLleno(day.rawDate) ? 'text-zinc-700' : 'text-zinc-400'">{{ day.name }}</span>
              <span class="text-xl font-bold mt-1">{{ day.number }}</span>
              <span class="text-[10px]" :class="selectedDate === day.rawDate ? 'text-zinc-500' : isDiaLleno(day.rawDate) ? 'text-zinc-700' : 'text-zinc-500'">{{ day.month }}</span>
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
          <div v-if="!isLoadingSlots && isDiaAgotado(selectedDate!)" class="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center mt-2">
            <p class="text-orange-500 text-sm font-medium">⚠️ No hay turnos disponibles para este día.</p>
            <p class="text-zinc-500 text-xs mt-1">Por favor selecciona otra fecha cercana.</p>
          </div>
          <div v-else class="grid grid-cols-3 gap-3">
            <button v-for="(time, index) in visibleTimeSlots" :key="index" type="button"
              :disabled="isLoadingSlots || isSlotOcupado(selectedDate!, time)"
              @click="!isLoadingSlots && !isSlotOcupado(selectedDate!, time) && (selectedTime = time)"
              :class="['py-3 rounded-xl font-semibold text-sm transition-all border relative',
                isLoadingSlots ? 'bg-zinc-900 text-zinc-700 border-zinc-800 cursor-wait animate-pulse'
                : isSlotOcupado(selectedDate!, time) ? 'bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed line-through'
                : selectedTime === time ? 'bg-neon-green text-black border-neon-green shadow-[0_0_15px_rgba(57,255,20,0.3)]'
                : 'bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:border-neon-green hover:text-neon-green']">
              {{ time }}
              <span v-if="isSlotOcupado(selectedDate!, time) && !isLoadingSlots" class="block text-[9px] font-normal no-underline text-zinc-600">Ocupado</span>
            </button>
          </div>
        </div>

        <!-- DATOS PERSONALES -->
        <div v-show="selectedDate && selectedTime" class="space-y-4 fade-in mt-6 pt-6 border-t border-zinc-800">
          <label class="block text-sm font-medium text-zinc-400 mb-1">3. Tus Datos</label>

          <input type="text" v-model="form.nombre" placeholder="Nombre Completo" required
            class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder-zinc-500" />

          <input type="tel" v-model="form.telefono" placeholder="WhatsApp: 301 123 4567" required maxlength="15"
            :class="['w-full px-4 py-3 bg-zinc-800 border rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder-zinc-500',
              form.telefono && !isTelefonoValido ? 'border-red-500 ring-1 ring-red-500' : 'border-zinc-700']" />
          <p v-if="form.telefono && !isTelefonoValido" class="text-red-400 text-xs mt-1 ml-1">Ingresa un número colombiano válido (Ej: 301 123 4567)</p>

          <!-- SELECTOR DE SERVICIOS -->
          <div class="service-selector-wrapper">
            <label class="block text-sm font-medium text-zinc-400 mb-3">Selecciona el Servicio</label>
            <div class="service-carousel select-none" ref="serviceCarouselRef"
              @mousedown="startDragging($event, 'serviceCarousel')"
              @mousemove="onDrag($event, 'serviceCarousel')"
              @mouseup="stopDragging"
              @mouseleave="stopDragging">
              <div v-for="srv in servicios" :key="srv.value"
                @click="!hasMoved && selectServicio(srv.value)"
                :class="['service-card', form.servicio === srv.value ? 'service-card--active' : '']">
                <div class="service-icon-wrapper">
                  <div class="service-icon" v-html="srv.icon"></div>
                </div>
                <div class="service-info">
                  <h3 class="service-name">{{ srv.label }}</h3>
                  <p class="service-desc">{{ srv.desc }}</p>
                </div>
                <div v-if="form.servicio === srv.value" class="service-check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Dots indicadores -->
            <div class="service-dots">
              <span v-for="(srv, idx) in servicios" :key="idx"
                :class="['service-dot', form.servicio === srv.value ? 'service-dot--active' : '']"
                @click="scrollToService(idx)"></span>
            </div>

            <!-- Badge servicio seleccionado -->
            <Transition name="badge-fade">
              <div v-if="form.servicio" class="service-selected-badge">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="badge-icon">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                <span>{{ servicios.find(s => s.value === form.servicio)?.label }}</span>
              </div>
            </Transition>
          </div>

          <div class="relative group">
            <textarea v-model="form.direccion" placeholder="Dirección Domiciliar (Ej. Calle 45 # 12-34, Piso 2, Apto 201)"
              rows="2" required
              class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder-zinc-500 resize-none">
            </textarea>
            <a v-if="form.direccion.length > 5"
              :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(form.direccion)}`"
              target="_blank" rel="noopener noreferrer"
              class="absolute right-3 bottom-3 text-[10px] font-bold text-neon-green hover:underline flex items-center gap-1 bg-zinc-900/80 px-2 py-1 rounded-lg backdrop-blur-sm transition-all">
              <fa-icon :icon="['fas', 'map-marker-alt']" /> Verificar mapa
            </a>
          </div>

          <button type="submit" :disabled="isSubmitting || !isFormValid"
            class="w-full mt-4 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-zinc-200 transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02]">
            <span v-if="isSubmitting">Procesando...</span>
            <span v-else>Confirmar Reserva</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { servicios } from '~/constants/servicios'

useSeoMeta({
  title: 'Agendar Cita | PersonalBarber Medellín',
  ogTitle: 'Agendar Cita | PersonalBarber',
  description: 'Reserva tu cita online en PersonalBarber. Selecciona tu barbero, servicio y horario preferido en Medellín.',
})

const route = useRoute()
const router = useRouter()

// Form state
const success = ref(false)
const isSubmitting = ref(false)
const isLoadingSlots = ref(false)
const bookedSlots = ref<{ fecha: string; hora: string }[]>([])
const selectedDate = ref<string | null>(null)
const selectedTime = ref<string | null>(null)
const form = reactive({ nombre: '', telefono: '', servicio: '', direccion: '' })

const availableTimeSlots = [
  '07:00 AM', '08:30 AM', '10:00 AM', '11:30 AM',
  '01:30 PM', '03:00 PM', '04:30 PM',
  '06:00 PM', '07:30 PM', '09:00 PM',
]

// Drag state
const isDragging = ref(false)
const startX = ref(0)
const scrollLeftVal = ref(0)
const hasMoved = ref(false)

// Refs
const dateCarouselRef = ref<HTMLElement | null>(null)
const serviceCarouselRef = ref<HTMLElement | null>(null)

const availableDays = computed(() => {
  const days = []
  const today = new Date()
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  for (let i = 1; i <= 14; i++) {
    const nextDate = new Date(today)
    nextDate.setDate(today.getDate() + i)
    days.push({
      rawDate: nextDate.toISOString().split('T')[0],
      name: i === 1 ? 'Mañana' : dayNames[nextDate.getDay()],
      number: nextDate.getDate(),
      month: monthNames[nextDate.getMonth()],
    })
  }
  return days
})

const isTelefonoValido = computed(() => {
  const soloDigitos = form.telefono.replace(/[\s\-+]/g, '')
  return /^(57)?3\d{9}$/.test(soloDigitos)
})

const visibleTimeSlots = computed(() => {
  if (!selectedDate.value) return availableTimeSlots
  return availableTimeSlots.filter(t => !isSlotPasado(selectedDate.value!, t))
})

const isFormValid = computed(() =>
  selectedDate.value && selectedTime.value &&
  form.nombre && isTelefonoValido.value &&
  form.servicio && form.direccion
)

async function cargarSlotsOcupados(fecha: string | null = null) {
  isLoadingSlots.value = true
  const targetDate = fecha || selectedDate.value
  if (!targetDate) { isLoadingSlots.value = false; return }
  try {
    const data = await $fetch<{ ok: boolean; horas: string[] }>(`/api/get_slots?date=${targetDate}`)
    if (data.ok) {
      bookedSlots.value = [
        ...bookedSlots.value.filter(s => s.fecha !== targetDate),
        ...(data.horas || []).map(h => ({ fecha: targetDate, hora: h })),
      ]
    }
  } catch (e) {
    console.warn('No se pudo cargar disponibilidad:', e)
  } finally {
    isLoadingSlots.value = false
  }
}

function isSlotOcupado(fecha: string, hora: string) {
  return bookedSlots.value.some(s => s.fecha === fecha && s.hora === hora)
}

function isDiaLleno(fecha: string) {
  if (!fecha) return false
  return bookedSlots.value.filter(s => s.fecha === fecha).length >= availableTimeSlots.length
}

function isDiaAgotado(fecha: string) {
  if (!fecha) return false
  return availableTimeSlots.every(t => isSlotOcupado(fecha, t) || isSlotPasado(fecha, t))
}

function isSlotPasado(fecha: string, hora: string) {
  const today = new Date().toISOString().split('T')[0]
  if (fecha !== today) return false
  const ahora = new Date()
  const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes()
  return a24h(hora) < (minutosAhora + 15)
}

function a24h(horaStr: string) {
  if (!horaStr) return 0
  const [time, period] = horaStr.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h !== 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  return h * 60 + m
}

function selectDate(date: string) {
  selectedDate.value = date
  selectedTime.value = null
  cargarSlotsOcupados(date)
}

function selectServicio(value: string) { form.servicio = value }

function scrollToService(idx: number) {
  const carousel = serviceCarouselRef.value
  if (!carousel) return
  const card = carousel.children[idx] as HTMLElement
  if (card) {
    card.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    form.servicio = servicios[idx].value
  }
}

function getRef(refName: string): HTMLElement | null {
  if (refName === 'dateCarousel') return dateCarouselRef.value
  if (refName === 'serviceCarousel') return serviceCarouselRef.value
  return null
}

function startDragging(e: MouseEvent, refName: string) {
  isDragging.value = true
  hasMoved.value = false
  const el = getRef(refName)
  if (!el) return
  startX.value = e.pageX - el.offsetLeft
  scrollLeftVal.value = el.scrollLeft
  el.style.scrollSnapType = 'none'
}

function stopDragging() {
  isDragging.value = false
  setTimeout(() => {
    if (dateCarouselRef.value) dateCarouselRef.value.style.scrollSnapType = 'x mandatory'
    if (serviceCarouselRef.value) serviceCarouselRef.value.style.scrollSnapType = 'x mandatory'
  }, 100)
}

function onDrag(e: MouseEvent, refName: string) {
  if (!isDragging.value) return
  e.preventDefault()
  const el = getRef(refName)
  if (!el) return
  const x = e.pageX - el.offsetLeft
  const walk = (x - startX.value) * 1.5
  if (Math.abs(walk) > 3) hasMoved.value = true
  el.scrollLeft = scrollLeftVal.value - walk
}

async function submitForm() {
  if (isSubmitting.value || !isFormValid.value) return
  isSubmitting.value = true

  const soloDigitos = form.telefono.replace(/[\s\-+]/g, '')
  const numeroWA = soloDigitos.startsWith('57') ? soloDigitos : `57${soloDigitos}`

  const payload = {
    nombre: form.nombre,
    servicio: form.servicio,
    fechaRaw: selectedDate.value,
    horaRaw: selectedTime.value,
    fechaCompleta: `${selectedDate.value} a las ${selectedTime.value}`,
    direccion: form.direccion,
    telefono: form.telefono,
    whatsappUrl: `https://wa.me/${numeroWA}`,
  }

  try {
    const response = await $fetch('/api/reserve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
    })
    success.value = true
    setTimeout(() => { goToProducts() }, 3000)
  } catch (error: unknown) {
    const httpError = error as { status?: number; data?: { error?: string } }
    if (httpError.status === 409) {
      await cargarSlotsOcupados(selectedDate.value)
      selectedTime.value = null
      alert('⚠️ Este turno ya fue reservado mientras completabas el formulario. Por favor elige otro horario.')
    } else {
      const msg = httpError.data?.error || 'Ocurrió un problema enviando tu reserva.'
      alert(msg)
      cargarSlotsOcupados()
    }
  } finally {
    isSubmitting.value = false
  }
}

function goToProducts() {
  router.push('/tienda')
}

onMounted(() => {
  cargarSlotsOcupados()
  if (route.query.service) {
    form.servicio = route.query.service as string
  }
})
</script>

<style scoped>
.fade-in { animation: fadeIn 0.4s ease-in-out; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* === SERVICE SELECTOR CAROUSEL === */
.service-selector-wrapper { position: relative; }
.service-carousel {
  display: flex; gap: 12px; overflow-x: auto;
  scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch;
  scrollbar-width: none; padding: 8px 4px 16px; cursor: grab;
}
.service-carousel:active { cursor: grabbing; }
.service-carousel::-webkit-scrollbar { display: none; }

.service-card {
  scroll-snap-align: center; flex-shrink: 0; width: 140px;
  background: #18181b; border: 1.5px solid #3f3f46; border-radius: 20px;
  padding: 18px 12px 14px; display: flex; flex-direction: column;
  align-items: center; gap: 10px; cursor: pointer; position: relative;
  transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.25s ease, background 0.3s ease;
  user-select: none;
}
.service-card:hover { border-color: #39FF14; transform: translateY(-3px); background: #0a1a08; }
.service-card--active {
  border-color: #39FF14 !important; background: #071207 !important;
  box-shadow: 0 0 22px rgba(57,255,20,0.35), inset 0 0 18px rgba(57,255,20,0.07);
  transform: translateY(-4px) scale(1.03);
}
.service-icon-wrapper {
  width: 54px; height: 54px; border-radius: 50%;
  background: #27272a; display: flex; align-items: center; justify-content: center; transition: background 0.3s ease;
}
.service-card:hover .service-icon-wrapper, .service-card--active .service-icon-wrapper { background: rgba(57,255,20,0.12); }
.service-icon { width: 30px; height: 30px; color: #a1a1aa; transition: color 0.3s ease; }
.service-icon :deep(svg) { width: 100%; height: 100%; }
.service-card:hover .service-icon, .service-card--active .service-icon { color: #39FF14; }

/* Icon animations */
.service-icon :deep(.icon-scissors) { animation: scissorIdle 3s ease-in-out infinite; transform-origin: 35px 32px; }
.service-card:hover .service-icon :deep(.icon-scissors),
.service-card--active .service-icon :deep(.icon-scissors) { animation: scissorCut 0.4s ease-in-out infinite alternate; }
.service-icon :deep(.icon-cut-beard) { animation: beardPulse 2.5s ease-in-out infinite; }
.service-icon :deep(.icon-beard) { animation: beardWave 3s ease-in-out infinite; transform-origin: 32px 40px; }
.service-card:hover .service-icon :deep(.icon-beard),
.service-card--active .service-icon :deep(.icon-beard) { animation: beardWaveFast 1.2s ease-in-out infinite; }
.service-icon :deep(.icon-spark) { animation: sparkle 1.5s ease-in-out infinite alternate; transform-origin: center; }
.service-icon :deep(.icon-spark:last-child) { animation-delay: 0.3s; }
.service-icon :deep(.icon-ear) { animation: earWiggle 2s ease-in-out infinite; }
.service-card:hover .service-icon :deep(.icon-ear),
.service-card--active .service-icon :deep(.icon-ear) { animation: earWiggleFast 0.8s ease-in-out infinite; }

.service-info { text-align: center; }
.service-name { font-size: 12px; font-weight: 700; color: #e4e4e7; line-height: 1.2; margin-bottom: 4px; transition: color 0.3s ease; }
.service-card--active .service-name { color: #39FF14; }
.service-desc { font-size: 10px; color: #71717a; line-height: 1.35; }

.service-check {
  position: absolute; top: 8px; right: 8px; width: 18px; height: 18px;
  background: #39FF14; border-radius: 50%; display: flex; align-items: center; justify-content: center;
  animation: popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.service-check svg { width: 10px; height: 10px; color: black; }

.service-dots { display: flex; justify-content: center; gap: 6px; margin-top: 4px; }
.service-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #3f3f46;
  cursor: pointer; transition: background 0.3s ease, transform 0.2s ease, width 0.3s ease;
}
.service-dot--active { background: #39FF14; width: 18px; border-radius: 4px; transform: scale(1.1); }

.service-selected-badge {
  margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 6px;
  background: rgba(57,255,20,0.1); border: 1px solid rgba(57,255,20,0.3);
  border-radius: 10px; padding: 6px 14px; font-size: 12px; font-weight: 600; color: #39FF14;
}
.badge-icon { width: 14px; height: 14px; }

.badge-fade-enter-active { animation: badgePop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.badge-fade-leave-active { animation: badgePop 0.2s ease reverse; }
</style>
