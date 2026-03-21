<template>
  <div class="bg-barber-black min-h-screen text-white">

    <!-- Header -->
    <div class="sticky top-0 z-30 bg-barber-black/80 backdrop-blur-md border-b border-white/10">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
        <router-link to="/tienda" class="flex-shrink-0 flex items-center gap-1.5 text-gray-400 hover:text-neon-green transition-colors">
          <i class="fas fa-arrow-left text-xs"></i>
          <span class="text-xs font-semibold hidden sm:inline">Tienda</span>
          <span class="text-[10px] font-semibold sm:hidden">Tienda</span>
        </router-link>
        <h1 class="text-sm sm:text-lg font-bold tracking-tight sm:tracking-widest uppercase text-white truncate text-center flex-1">
          <span class="text-neon-green">Personal</span>Barber · Checkout
        </h1>
        <div class="w-10 sm:w-16 flex-shrink-0"></div>
      </div>
    </div>

    <!-- Carrito vacío -->
    <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <i class="fas fa-shopping-bag text-5xl text-white/10"></i>
      <p class="text-gray-500">Tu carrito está vacío</p>
      <router-link to="/tienda" class="text-neon-green hover:underline text-sm font-bold">← Explorar productos</router-link>
    </div>

    <div v-else class="max-w-4xl mx-auto px-4 py-10 pb-40">
      <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

        <!-- Columna izquierda: Formulario + Pago -->
        <div class="lg:col-span-3 space-y-6">

          <!-- Datos del comprador -->
          <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 class="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span class="w-6 h-6 bg-neon-green text-black text-xs font-black rounded-full flex items-center justify-center">1</span>
              Tus datos
            </h2>
            <div class="space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-1">
                  <label class="text-xs text-gray-400 font-semibold block mb-1">Nombre</label>
                  <input 
                    v-model="form.firstName" 
                    @blur="touched.firstName = true"
                    type="text" placeholder="Juan" 
                    class="input-field" 
                    :class="{ 'border-red-500/50': touched.firstName && !form.firstName.trim() }"
                  />
                  <p v-if="touched.firstName && !form.firstName.trim()" class="text-[10px] text-red-400">El nombre es obligatorio</p>
                </div>
                <div class="space-y-1">
                  <label class="text-xs text-gray-400 font-semibold block mb-1">Apellido</label>
                  <input 
                    v-model="form.lastName" 
                    @blur="touched.lastName = true"
                    type="text" placeholder="García" 
                    class="input-field"
                    :class="{ 'border-red-500/50': touched.lastName && !form.lastName.trim() }"
                  />
                  <p v-if="touched.lastName && !form.lastName.trim()" class="text-[10px] text-red-400">El apellido es obligatorio</p>
                </div>
              </div>
              <div class="space-y-1">
                <label class="text-xs text-gray-400 font-semibold block mb-1">Email</label>
                <input 
                  v-model="form.email" 
                  @blur="touched.email = true"
                  type="email" placeholder="juan@email.com" 
                  class="input-field"
                  :class="{ 'border-red-500/50': touched.email && !isEmailValid }"
                />
                <p v-if="touched.email && !isEmailValid" class="text-[10px] text-red-400">Ingresa un correo válido</p>
              </div>
              <div class="space-y-1">
                <label class="text-xs text-gray-400 font-semibold block mb-1">Teléfono / WhatsApp</label>
                <input 
                  v-model="form.phone" 
                  @input="form.phone = form.phone.replace(/[^0-9+]/g, '')"
                  @blur="touched.phone = true"
                  type="tel" 
                  inputmode="numeric"
                  placeholder="+57 300 123 4567" 
                  class="input-field"
                  :class="{ 'border-red-500/50': touched.phone && !form.phone.trim() }"
                />
                <p v-if="touched.phone && !form.phone.trim()" class="text-[10px] text-red-400">El teléfono es necesario para coordinar</p>
              </div>
              <div class="space-y-1">
                <label class="text-xs text-gray-400 font-semibold block mb-1">Ciudad</label>
                <input v-model="form.city" type="text" placeholder="Medellín, Bogotá..." class="input-field" />
              </div>
              <div class="space-y-1">
                <label class="text-xs text-gray-400 font-semibold block mb-1">Dirección (para envío)</label>
                <input v-model="form.address" type="text" placeholder="Calle 50 # 30-10 Apto 201" class="input-field" />
              </div>
            </div>
          </div>

          <!-- Método de pago -->
          <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
            <h2 class="text-lg font-bold text-white mb-5 flex items-center gap-2">
              <span class="w-6 h-6 bg-neon-green text-black text-xs font-black rounded-full flex items-center justify-center">2</span>
              Método de pago
            </h2>

            <!-- Opciones de pago -->
            <div class="space-y-3">
              <label
                v-for="method in paymentMethods"
                :key="method.id"
                class="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300"
                :class="selectedPayment === method.id
                  ? 'border-neon-green bg-neon-green/10'
                  : 'border-white/10 hover:border-white/20 bg-white/3'"
              >
                <input
                  type="radio"
                  v-model="selectedPayment"
                  :value="method.id"
                  class="hidden"
                />
                <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                     :class="selectedPayment === method.id ? 'border-neon-green' : 'border-gray-600'"
                >
                  <div v-if="selectedPayment === method.id" class="w-2.5 h-2.5 rounded-full bg-neon-green"></div>
                </div>
                <div class="flex items-center gap-3 flex-1">
                  <div class="text-2xl">{{ method.emoji }}</div>
                  <div>
                    <p class="text-white font-bold text-sm">{{ method.label }}</p>
                    <p class="text-gray-500 text-xs">{{ method.desc }}</p>
                  </div>
                </div>
                <span v-if="method.badge" class="text-[10px] bg-neon-green/20 text-neon-green border border-neon-green/30 px-2 py-0.5 rounded-full font-bold">{{ method.badge }}</span>
              </label>
            </div>

            <!-- Nota de integración (MVP) -->
            <div class="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <p class="text-blue-300 text-xs leading-relaxed">
                <i class="fas fa-info-circle mr-1"></i>
                <strong>Modo Demo:</strong> El botón de pago está listo. Para activar cobros reales, conecta tu cuenta <strong>Wompi</strong> y agrega tu llave pública. Los pagos se procesarán directamente desde Wompi (Nequi, PSE, tarjetas).
              </p>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Resumen del pedido -->
        <div class="lg:col-span-2 sticky top-24">
          <div class="bg-white/5 rounded-2xl p-5 border border-white/10">
            <h2 class="text-sm font-bold text-white mb-4 tracking-wide uppercase">Resumen del pedido</h2>

            <!-- Items -->
            <div class="space-y-3 mb-5">
              <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                  <img :src="item.image" :alt="item.name" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-white text-xs font-semibold leading-tight truncate">{{ item.name }}</p>
                  <p class="text-gray-500 text-xs">× {{ item.qty }}</p>
                </div>
                <span class="text-neon-green text-xs font-bold flex-shrink-0">
                  {{ formatPrice(parsePrice(item.price) * item.qty) }}
                </span>
              </div>
            </div>

            <div class="border-t border-white/10 pt-4 space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Subtotal</span>
                <span class="text-white font-semibold">{{ cartTotalFormatted }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400">Envío</span>
                <span class="text-gray-400">A coordinar</span>
              </div>
              <div class="flex justify-between text-base font-black border-t border-white/10 pt-3 mt-2">
                <span class="text-white">TOTAL</span>
                <span class="text-neon-green">{{ cartTotalFormatted }}</span>
              </div>
            </div>

            <!-- Botón de pago final -->
            <button
              @click="handleCheckout"
              :disabled="!formValid"
              class="mt-5 w-full py-4 font-black text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              :class="formValid
                ? 'bg-neon-green hover:bg-neon-green-dark text-black'
                : 'bg-white/10 text-gray-600 cursor-not-allowed'"
            >
              <i class="fas fa-lock text-xs"></i>
              PAGAR {{ cartTotalFormatted }}
            </button>

            <p class="text-center text-gray-600 text-[10px] mt-3">
              <i class="fas fa-shield-alt mr-1"></i>Pago seguro procesado por Wompi
            </p>

            <!-- Logos de métodos de pago -->
            <div class="flex items-center justify-center gap-3 mt-4 flex-wrap">
              <span v-for="logo in paymentLogos" :key="logo" class="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-md text-gray-500 font-bold">{{ logo }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal / Alerta Custom para Pago próximamente -->
    <transition name="fade">
      <div v-if="showSoonAlert" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="bg-barber-black border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div class="w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6 text-neon-green">
            <i class="fas fa-tools text-3xl"></i>
          </div>
          <h3 class="text-xl font-black text-white mb-2 uppercase tracking-tight">¡Próximamente disponible!</h3>
          <p class="text-gray-400 text-sm leading-relaxed mb-8">
            Estamos integrando los pagos automáticos. Por ahora, selecciona 
            <span class="text-neon-green font-bold">"WhatsApp"</span> 
            para coordinar tu pedido directamente con nosotros.
          </p>
          <button 
            @click="showSoonAlert = false"
            class="w-full py-4 bg-neon-green hover:bg-neon-green-dark text-black font-black rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-neon-green/20 tracking-wide uppercase text-sm"
          >
            Entendido
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart.js'

const router = useRouter()
const { cartItems, cartTotalFormatted, formatPrice, parsePrice, clearCart } = useCart()

onMounted(() => {
  document.title = 'Finalizar Compra | PersonalBarber'
})

const form = ref({
  firstName: '', lastName: '', email: '', phone: '', city: '', address: ''
})

const touched = ref({
  firstName: false, lastName: false, email: false, phone: false
})

const selectedPayment = ref('wompi')
const showSoonAlert = ref(false)

const paymentMethods = [
  { id: 'wompi', emoji: '💳', label: 'Wompi', desc: 'Nequi, PSE, tarjetas débito/crédito', badge: 'Recomendado' },
  { id: 'nequi', emoji: '💜', label: 'Nequi', desc: 'Pago directo desde tu app Nequi' },
  { id: 'pse', emoji: '🏦', label: 'PSE', desc: 'Débito bancario en línea' },
  { id: 'whatsapp', emoji: '💬', label: 'Coordinar por WhatsApp', desc: 'Contacta directamente al barber para acordar el pago' },
]

const paymentLogos = ['Nequi', 'PSE', 'Visa', 'Mastercard', 'Amex']

const isEmailValid = computed(() => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(form.value.email)
})

const formValid = computed(() =>
  form.value.firstName.trim() &&
  form.value.lastName.trim() &&
  isEmailValid.value &&
  form.value.phone.trim()
)

function handleCheckout() {
  if (!formValid.value) {
    // Marcar todo como tocado para mostrar errores
    Object.keys(touched.value).forEach(k => touched.value[k] = true)
    return
  }

  if (selectedPayment.value === 'whatsapp') {
    const phone = '573045840264'
    const items = cartItems.map(i => `• ${i.name} x${i.qty} = ${formatPrice(parsePrice(i.price) * i.qty)}`).join('\n')
    const msg = `Hola Andrés, quiero hacer un pedido:\n\n${items}\n\nTOTAL: ${cartTotalFormatted.value}\n\nNombre: ${form.value.firstName} ${form.value.lastName}\nCiudad: ${form.value.city}\nDirección: ${form.value.address}`
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank')
    clearCart()
    router.push('/tienda')
  } else {
    showSoonAlert.value = true
  }
}
</script>

<style scoped>
.input-field {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
}
.input-field::placeholder { color: #4b5563; }
.input-field:focus { border-color: rgba(212, 175, 55, 0.5); background: rgba(255, 255, 255, 0.08); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
