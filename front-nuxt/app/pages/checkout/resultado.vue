<template>
  <div class="bg-barber-black min-h-screen text-white flex flex-col items-center justify-center px-4 overflow-hidden relative">

    <!-- Partículas de fondo (solo en APPROVED) -->
    <div v-if="orderStatus === 'APPROVED'" class="particles-bg" aria-hidden="true">
      <span v-for="n in 18" :key="n" class="particle" :style="particleStyle(n)" />
    </div>

    <!-- Header logo -->
    <header class="w-full border-b border-white/8 bg-barber-black/90 backdrop-blur-sm fixed top-0 z-10">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-center">
        <NuxtLink to="/">
          <img src="/favicon.svg" alt="PersonalBarber" class="h-12 w-auto opacity-90 hover:opacity-100 transition-opacity" width="48" height="48" decoding="async" />
        </NuxtLink>
      </div>
    </header>

    <!-- Contenido principal -->
    <div class="max-w-md w-full text-center pt-24 pb-12 relative z-10">

      <!-- ⏳ Procesando -->
      <div v-if="orderStatus === 'loading' || orderStatus === 'PENDING' || orderStatus === 'AWAITING_PAYMENT'" class="space-y-6">
        <div class="w-24 h-24 rounded-full bg-neon-green/10 flex items-center justify-center mx-auto animate-pulse">
          <fa-icon :icon="['fas', 'spinner']" class="text-4xl text-neon-green fa-spin" />
        </div>
        <h1 class="text-2xl font-black text-white tracking-tight">Verificando tu pago...</h1>
        <p class="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
          Estamos confirmando tu transacción con Wompi. Esto toma solo unos segundos.
        </p>
        <div class="flex items-center justify-center gap-2 text-xs text-gray-600">
          <div class="w-2 h-2 rounded-full bg-neon-green animate-ping"></div>
          Consultando estado...
        </div>
      </div>

      <!-- ✅ APROBADO — Pantalla de agradecimiento premium -->
      <Transition name="thank-you" appear>
        <div v-if="orderStatus === 'APPROVED'" class="space-y-6">

          <!-- Icono animado -->
          <div class="relative mx-auto w-28 h-28">
            <div class="w-28 h-28 rounded-full bg-neon-green/10 border border-neon-green/30 flex items-center justify-center success-ring">
              <fa-icon :icon="['fas', 'check']" class="text-5xl text-neon-green" />
            </div>
            <!-- Anillo pulsante exterior -->
            <div class="absolute inset-0 rounded-full border-2 border-neon-green/20 animate-ping" style="animation-duration: 1.5s;" />
          </div>

          <!-- Mensaje principal -->
          <div class="space-y-2">
            <p class="text-neon-green text-xs font-bold uppercase tracking-[0.25em]">¡Pago aprobado!</p>
            <h1 class="text-3xl font-black text-white tracking-tight leading-tight">
              Gracias por tu<br />compra 🖤✂️
            </h1>
            <p class="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto pt-1">
              Para nosotros es muy gratificante. Tu pedido
              <span class="text-white font-bold">{{ orderId }}</span>
              está confirmado y en camino a ser preparado.
            </p>
          </div>

          <!-- Info de seguimiento -->
          <div class="bg-white/5 border border-white/10 rounded-2xl p-5 text-left space-y-3">
            <p class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Detalles del pedido</p>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Orden</span>
              <span class="text-white font-bold">{{ orderId }}</span>
            </div>
            <div v-if="orderData?.total_format" class="flex justify-between text-sm">
              <span class="text-gray-500">Total pagado</span>
              <span class="text-neon-green font-black">${{ orderData.total_format }} COP</span>
            </div>
            <div v-if="shippingLabel" class="flex justify-between text-sm">
              <span class="text-gray-500">Envío</span>
              <span class="text-white text-xs">{{ shippingLabel }}</span>
            </div>
            <div class="pt-2 border-t border-white/8">
              <p class="text-xs text-gray-500 leading-relaxed">
                <fa-icon :icon="['fas', 'envelope']" class="mr-1.5 text-neon-green/60" />
                Recibirás el comprobante en tu correo. Puedes seguir el estado de tu compra por
                <span class="text-white font-semibold">WhatsApp</span> o al email registrado.
              </p>
            </div>
          </div>

          <!-- Botones de acción -->
          <div class="flex flex-col gap-3">
            <a :href="whatsappLink" target="_blank"
              class="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-black rounded-xl transition-all duration-300 uppercase text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,211,102,0.3)]">
              <fa-icon :icon="['fab', 'whatsapp']" class="text-lg" />
              Seguir mi pedido por WhatsApp
            </a>
            <NuxtLink to="/"
              class="w-full py-3.5 bg-white/8 hover:bg-white/12 text-white font-bold rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 border border-white/10">
              <fa-icon :icon="['fas', 'store']" class="text-xs" />
              Seguir explorando la tienda
            </NuxtLink>
          </div>

          <!-- Cuenta regresiva -->
          <div class="flex flex-col items-center gap-2 mt-2">
            <!-- Barra de progreso circular -->
            <div class="relative w-12 h-12">
              <svg class="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="3" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(163,230,53,0.6)" stroke-width="3"
                  stroke-linecap="round"
                  :stroke-dasharray="`${2 * Math.PI * 20}`"
                  :stroke-dashoffset="`${2 * Math.PI * 20 * (1 - countdown / redirectDelay)}`"
                  style="transition: stroke-dashoffset 1s linear;" />
              </svg>
              <span class="absolute inset-0 flex items-center justify-center text-xs font-black text-white">{{ countdown }}</span>
            </div>
            <p class="text-gray-600 text-[11px]">
              Volviendo a la tienda en <span class="text-gray-400 font-bold">{{ countdown }}s</span>
            </p>
          </div>

        </div>
      </Transition>

      <!-- ❌ Rechazado / Error -->
      <div v-if="orderStatus === 'DECLINED' || orderStatus === 'ERROR' || orderStatus === 'VOIDED'" class="space-y-6">
        <div class="w-24 h-24 rounded-full bg-red-500/15 flex items-center justify-center mx-auto result-icon">
          <fa-icon :icon="['fas', 'times-circle']" class="text-5xl text-red-400" />
        </div>
        <h1 class="text-2xl font-black text-white tracking-tight">Pago no completado</h1>
        <p class="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{{ declinedMessage }}</p>
        <div class="flex flex-col gap-3 mt-6">
          <NuxtLink to="/checkout"
            class="w-full py-4 bg-white/10 hover:bg-white/15 text-white font-black rounded-xl transition-all duration-300 uppercase text-sm text-center border border-white/10">
            Reintentar pago
          </NuxtLink>
          <a :href="whatsappLink" target="_blank"
            class="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-black rounded-xl transition-all duration-300 uppercase text-sm text-center flex items-center justify-center gap-2">
            <fa-icon :icon="['fab', 'whatsapp']" class="text-lg" />
            Contactar soporte
          </a>
        </div>
      </div>

      <!-- ⏱️ Timeout -->
      <div v-if="orderStatus === 'timeout'" class="space-y-6">
        <div class="w-24 h-24 rounded-full bg-yellow-500/15 flex items-center justify-center mx-auto result-icon">
          <fa-icon :icon="['fas', 'clock']" class="text-5xl text-yellow-400" />
        </div>
        <h1 class="text-2xl font-black text-white tracking-tight">Pago en proceso</h1>
        <p class="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
          Tu pago está siendo procesado. Te notificaremos cuando se confirme.
        </p>
        <p class="text-gray-600 text-xs">Orden: <span class="text-white font-bold">{{ orderId }}</span></p>
        <div class="flex flex-col gap-3 mt-4">
          <a :href="whatsappLink" target="_blank"
            class="w-full py-4 bg-[#25D366] hover:bg-[#20bd5a] text-black font-black rounded-xl transition-all duration-300 uppercase text-sm flex items-center justify-center gap-2">
            <fa-icon :icon="['fab', 'whatsapp']" class="text-lg" />
            Consultar estado
          </a>
          <NuxtLink to="/"
            class="w-full py-3 bg-white/8 hover:bg-white/12 text-white font-bold rounded-xl transition-all text-sm text-center border border-white/10">
            Volver a la tienda
          </NuxtLink>
        </div>
      </div>

      <!-- 🔍 Sin ID -->
      <div v-if="orderStatus === 'no_id'" class="space-y-6">
        <div class="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mx-auto">
          <fa-icon :icon="['fas', 'search']" class="text-4xl text-gray-600" />
        </div>
        <h1 class="text-xl font-black text-white tracking-tight">No encontramos tu orden</h1>
        <p class="text-gray-400 text-sm max-w-xs mx-auto">
          No se proporcionó un ID de orden. Si realizaste un pago, contáctanos.
        </p>
        <NuxtLink to="/"
          class="inline-block mt-4 px-8 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl transition-all text-sm border border-white/10">
          Ir a la tienda
        </NuxtLink>
      </div>

      <!-- Footer seguridad -->
      <p class="text-center text-gray-700 text-[10px] mt-10">
        <fa-icon :icon="['fas', 'shield-alt']" class="mr-1" />
        Transacción procesada de forma segura por Wompi · SSL encriptado
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Gracias por tu compra | PersonalBarber',
  robots: 'noindex, nofollow',
})

const route = useRoute()
const router = useRouter()

const orderId = ref('')
const orderStatus = ref<string>('loading')
const orderData = ref<any>(null)
const pollCount = ref(0)
const maxPolls = 20
let pollInterval: ReturnType<typeof setInterval> | null = null

// Cuenta regresiva para redirección
const redirectDelay = 30
const countdown = ref(redirectDelay)
let countdownInterval: ReturnType<typeof setInterval> | null = null

function startCountdown() {
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval!)
      router.push('/')
    }
  }, 1000)
}

// Mensaje de error descriptivo
const declinedMessage = computed(() => {
  switch (orderStatus.value) {
    case 'DECLINED': return 'Tu entidad financiera no aprobó la transacción. Verifica tus datos o intenta con otro método.'
    case 'VOIDED': return 'La transacción fue cancelada. Si no la cancelaste tú, contacta a tu banco.'
    case 'ERROR': return 'Error técnico durante el procesamiento. Por favor intenta de nuevo.'
    default: return 'No se pudo completar el pago. Intenta de nuevo o contacta soporte.'
  }
})

// Etiqueta de envío
const shippingLabel = computed(() => 'Envío 100% GRATIS a todo Colombia 🇨🇴')

// WhatsApp con contexto de la orden
const whatsappLink = computed(() => {
  const msg = orderId.value
    ? `¡Hola! Acabo de realizar un pedido en PersonalBarber. Mi orden es ${orderId.value}. ¿Me pueden confirmar el estado?`
    : 'Hola, necesito ayuda con mi pedido en PersonalBarber.'
  return `https://api.whatsapp.com/send?phone=573337518070&text=${encodeURIComponent(msg)}`
})

// Estilos aleatorios para las partículas de fondo
function particleStyle(n: number) {
  const colors = ['#a3e635', '#84cc16', '#ffffff', '#86efac']
  const size = 4 + (n % 5) * 3
  const x = (n * 37 + 13) % 100
  const delay = (n * 0.3) % 3
  const duration = 3 + (n % 4)
  const color = colors[n % colors.length]
  return {
    left: `${x}%`,
    width: `${size}px`,
    height: `${size}px`,
    background: color,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`,
  }
}

const orderToken = ref('')

// Consultar estado de la orden
async function checkOrderStatus() {
  if (!orderId.value) return
  try {
    const tokenQuery = orderToken.value ? `&token=${encodeURIComponent(orderToken.value)}` : ''
    const data = await $fetch<{ ok: boolean; order: any }>(`/api/order_status?id=${orderId.value}${tokenQuery}`, {
      headers: orderToken.value ? { 'X-Order-Token': orderToken.value } : {}
    })
    if (data.ok && data.order) {
      orderData.value = data.order
      const status = data.order.status
      if (['APPROVED', 'DECLINED', 'VOIDED', 'ERROR'].includes(status)) {
        orderStatus.value = status
        stopPolling()
        if (status === 'APPROVED') {
          try { const { clearCart } = useCart(); clearCart() } catch {}
          startCountdown()
        }
        return
      }
      orderStatus.value = status
    }
  } catch (err) {
    console.error('Error consultando estado:', err)
  }
  pollCount.value++
  if (pollCount.value >= maxPolls) {
    orderStatus.value = 'timeout'
    stopPolling()
  }
}

function stopPolling() {
  if (pollInterval) { clearInterval(pollInterval); pollInterval = null }
}

onMounted(() => {
  const id = route.query.id as string
  if (!id) { orderStatus.value = 'no_id'; return }
  orderId.value = id

  let tok = (route.query.token as string) || ''
  if (!tok && typeof window !== 'undefined') {
    try {
      tok = sessionStorage.getItem(`pb_order_token_${id}`) || ''
    } catch {}
  }
  orderToken.value = tok

  orderStatus.value = 'loading'
  checkOrderStatus()
  pollInterval = setInterval(checkOrderStatus, 3000)
})

onBeforeUnmount(() => {
  stopPolling()
  if (countdownInterval) clearInterval(countdownInterval)
})
</script>

<style scoped>
/* Animación de entrada del bloque de agradecimiento */
.thank-you-enter-active { animation: thankYouIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes thankYouIn {
  from { transform: scale(0.85) translateY(20px); opacity: 0; }
  to   { transform: scale(1) translateY(0); opacity: 1; }
}

/* Icono de check con brillo */
.success-ring {
  animation: successRing 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 0 40px rgba(163, 230, 53, 0.25);
}
@keyframes successRing {
  from { transform: scale(0.3); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}

/* Partículas flotantes de fondo */
.particles-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 0;
}
.particle {
  position: absolute;
  border-radius: 50%;
  top: -20px;
  opacity: 0;
  animation: floatUp linear infinite;
}
@keyframes floatUp {
  0%   { transform: translateY(0) rotate(0deg);    opacity: 0; }
  10%  { opacity: 0.6; }
  90%  { opacity: 0.3; }
  100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
}

/* Entrada de iconos en estados de error */
.result-icon {
  animation: resultBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes resultBounce {
  from { transform: scale(0.3); opacity: 0; }
  to   { transform: scale(1); opacity: 1; }
}
</style>
