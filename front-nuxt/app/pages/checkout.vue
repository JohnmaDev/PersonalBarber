<template>
  <div class="bg-barber-black min-h-screen text-white">
    <!-- Header -->
    <div class="sticky top-0 z-30 bg-barber-black/80 backdrop-blur-md border-b border-white/10">
      <div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
        <NuxtLink to="/tienda" class="flex-shrink-0 flex items-center gap-1.5 text-gray-400 hover:text-neon-green transition-colors">
          <fa-icon :icon="['fas', 'arrow-left']" class="text-xs" />
          <span class="text-xs font-semibold">Tienda</span>
        </NuxtLink>
        <h1 class="text-sm sm:text-lg font-bold tracking-tight sm:tracking-widest uppercase text-white truncate text-center flex-1">
          <span class="text-neon-green">Personal</span>Barber · Checkout
        </h1>
        <div class="w-10 sm:w-16 flex-shrink-0"></div>
      </div>
    </div>

    <!-- Carrito vacío -->
    <ClientOnly>
      <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <fa-icon :icon="['fas', 'shopping-bag']" class="text-5xl text-white/10" />
        <p class="text-gray-500">Tu carrito está vacío</p>
        <NuxtLink to="/tienda" class="text-neon-green hover:underline text-sm font-bold">← Explorar productos</NuxtLink>
      </div>

      <div v-else class="max-w-4xl mx-auto px-4 py-10 pb-40">
        <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          <!-- Columna izquierda: Formulario -->
          <div class="lg:col-span-3 space-y-6">
            <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 class="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <span class="w-6 h-6 bg-neon-green text-black text-xs font-black rounded-full flex items-center justify-center">1</span>
                Tus datos
              </h2>
              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-xs text-gray-400 font-semibold block mb-1">Nombre</label>
                    <input v-model="form.firstName" @blur="touched.firstName = true" type="text" placeholder="Juan" class="input-field"
                      :class="{ 'border-red-500/50': touched.firstName && !form.firstName.trim() }" />
                    <p v-if="touched.firstName && !form.firstName.trim()" class="text-[10px] text-red-400">El nombre es obligatorio</p>
                  </div>
                  <div class="space-y-1">
                    <label class="text-xs text-gray-400 font-semibold block mb-1">Apellido</label>
                    <input v-model="form.lastName" @blur="touched.lastName = true" type="text" placeholder="García" class="input-field"
                      :class="{ 'border-red-500/50': touched.lastName && !form.lastName.trim() }" />
                    <p v-if="touched.lastName && !form.lastName.trim()" class="text-[10px] text-red-400">El apellido es obligatorio</p>
                  </div>
                </div>
                <div class="space-y-1">
                  <label class="text-xs text-gray-400 font-semibold block mb-1">Email <span class="text-neon-green ml-1">*</span></label>
                  <input v-model="form.email" @blur="touched.email = true" type="email" placeholder="juan@email.com" class="input-field"
                    :class="{ 'border-red-500/50': touched.email && !isEmailValid }" />
                  <p v-if="touched.email && !isEmailValid" class="text-[10px] text-red-400">Ingresa un correo válido</p>
                </div>
                <div class="space-y-1">
                  <label class="text-xs text-gray-400 font-semibold block mb-1">Teléfono / WhatsApp</label>
                  <input v-model="form.phone" @input="form.phone = form.phone.replace(/[^0-9+]/g, '')" @blur="touched.phone = true"
                    type="tel" inputmode="numeric" placeholder="+57 300 123 4567" class="input-field"
                    :class="{ 'border-red-500/50': touched.phone && !isPhoneValid }" />
                  <p v-if="touched.phone && !isPhoneValid" class="text-[10px] text-red-400 mt-1">Ingresa un número colombiano válido</p>
                </div>
                <div><label class="text-xs text-gray-400 font-semibold block mb-1">Ciudad</label>
                  <input v-model="form.city" type="text" placeholder="Medellín, Bogotá..." class="input-field" /></div>
                <div><label class="text-xs text-gray-400 font-semibold block mb-1">Dirección (para envío)</label>
                  <input v-model="form.address" type="text" placeholder="Calle 50 # 30-10 Apto 201" class="input-field" /></div>
              </div>
            </div>

            <!-- Método de pago -->
            <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 class="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <span class="w-6 h-6 bg-neon-green text-black text-xs font-black rounded-full flex items-center justify-center">2</span>
                Método de pago
              </h2>
              <div class="space-y-3">
                <label v-for="method in paymentMethods" :key="method.id"
                  class="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300"
                  :class="selectedPayment === method.id ? 'border-neon-green bg-neon-green/10' : 'border-white/10 hover:border-white/20'">
                  <input type="radio" v-model="selectedPayment" :value="method.id" class="hidden" />
                  <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                    :class="selectedPayment === method.id ? 'border-neon-green' : 'border-gray-600'">
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
              <div class="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <p class="text-blue-300 text-xs leading-relaxed">
                  <fa-icon :icon="['fas', 'info-circle']" class="mr-1" />
                  <strong>Modo Demo:</strong> Para activar cobros reales, conecta tu cuenta <strong>Wompi</strong> y agrega tu llave pública.
                </p>
              </div>
            </div>
          </div>

          <!-- Resumen del pedido -->
          <div class="lg:col-span-2 sticky top-24">
            <div class="bg-white/5 rounded-2xl p-5 border border-white/10">
              <h2 class="text-sm font-bold text-white mb-4 tracking-wide uppercase">Resumen del pedido</h2>
              <div class="space-y-3 mb-5">
                <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                    <img :src="optimizeImage(item.images?.[0] || item.image, 100)" :alt="item.name" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-white text-xs font-semibold leading-tight truncate">{{ item.name }}</p>
                    <p class="text-gray-500 text-xs">× {{ item.qty }}</p>
                  </div>
                  <span class="text-neon-green text-xs font-bold flex-shrink-0">{{ formatPrice(parsePrice(item.price) * item.qty) }}</span>
                </div>
              </div>
              <div class="border-t border-white/10 pt-4 space-y-2">
                <div class="flex justify-between text-sm"><span class="text-gray-400">Subtotal</span><span class="text-white font-semibold">{{ cartTotalFormatted }}</span></div>
                <div class="flex justify-between text-sm"><span class="text-gray-400">Envío</span><span class="text-gray-400">A coordinar</span></div>
                <div class="flex justify-between text-base font-black border-t border-white/10 pt-3 mt-2">
                  <span class="text-white">TOTAL</span><span class="text-neon-green">{{ cartTotalFormatted }}</span>
                </div>
              </div>
              <button @click="handleCheckout" :disabled="!formValid || isProcessing"
                class="mt-5 w-full py-4 font-black text-sm rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                :class="formValid && !isProcessing ? 'bg-neon-green hover:bg-neon-green-dark text-black' : 'bg-white/10 text-gray-600 cursor-not-allowed'">
                <template v-if="isProcessing">
                  <fa-icon :icon="['fas', 'spinner']" class="fa-spin" /> CREANDO ORDEN...
                </template>
                <template v-else>
                  <fa-icon :icon="['fas', 'lock']" class="text-xs" /> PAGAR {{ cartTotalFormatted }}
                </template>
              </button>
              <p class="text-center text-gray-600 text-[10px] mt-3">
                <fa-icon :icon="['fas', 'shield-alt']" class="mr-1" />Pago seguro procesado por Wompi
              </p>
              <div class="flex items-center justify-center gap-3 mt-4 flex-wrap">
                <span v-for="logo in paymentLogos" :key="logo" class="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-md text-gray-500 font-bold">{{ logo }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- Modal 'Próximamente' -->
    <Transition name="fade">
      <div v-if="showSoonAlert" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div class="bg-barber-black border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div class="w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6 text-neon-green">
            <fa-icon :icon="['fas', 'tools']" class="text-3xl" />
          </div>
          <h3 class="text-xl font-black text-white mb-2 uppercase tracking-tight">¡Próximamente disponible!</h3>
          <p class="text-gray-400 text-sm leading-relaxed mb-8">
            Estamos integrando los pagos automáticos. Por ahora, selecciona <span class="text-neon-green font-bold">"WhatsApp"</span> para coordinar directamente.
          </p>
          <button @click="showSoonAlert = false" class="w-full py-4 bg-neon-green hover:bg-neon-green-dark text-black font-black rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] uppercase text-sm">
            Entendido
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Finalizar Compra | PersonalBarber' })

const router = useRouter()
const { cartItems, cartTotalFormatted, formatPrice, parsePrice, clearCart } = useCart()

const form = reactive({ firstName: '', lastName: '', email: '', phone: '', city: '', address: '' })
const touched = reactive({ firstName: false, lastName: false, email: false, phone: false })
const selectedPayment = ref('wompi')
const showSoonAlert = ref(false)
const isProcessing = ref(false)

const paymentMethods = [
  { id: 'wompi', emoji: '💳', label: 'Wompi', desc: 'Nequi, PSE, tarjetas débito/crédito', badge: 'Recomendado' },
  { id: 'nequi', emoji: '💜', label: 'Nequi', desc: 'Pago directo desde tu app Nequi' },
  { id: 'pse', emoji: '🏦', label: 'PSE', desc: 'Débito bancario en línea' },
  { id: 'whatsapp', emoji: '💬', label: 'Coordinar por WhatsApp', desc: 'Contacta directamente al barber para acordar el pago' },
]

const paymentLogos = ['Nequi', 'PSE', 'Visa', 'Mastercard', 'Amex']

const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
const isPhoneValid = computed(() => /^(57)?3\d{9}$/.test(form.phone.replace(/[\s\-+]/g, '')))
const formValid = computed(() => form.firstName.trim() && form.lastName.trim() && isEmailValid.value && isPhoneValid.value)

async function handleCheckout() {
  if (!formValid.value) { Object.keys(touched).forEach(k => (touched as Record<string, boolean>)[k] = true); return }

  if (selectedPayment.value === 'whatsapp') {
    isProcessing.value = true
    try {
      const payload = {
        customer: { firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, city: form.city, address: form.address },
        items: cartItems.map(i => ({ id: i.id, qty: i.qty })),
        paymentMethod: 'whatsapp',
      }

      const data = await $fetch<{ ok: boolean; order: { id: string; total_format: string } }>('/api/create_order', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload,
      })

      if (!data.ok) throw new Error('Error procesando orden')

      const phone = '573045840264'
      const itemsList = cartItems.map(i => `• ${i.name} x${i.qty}`).join('\n')
      const msg = `Hola Andrés, acabo de realizar un pedido:\n\n*ID Orden:* ${data.order.id}\n\n${itemsList}\n\n*TOTAL VERIFICADO:* $${data.order.total_format} COP\n\nNombre: ${form.firstName} ${form.lastName}\nCiudad: ${form.city}\nDirección: ${form.address}`

      window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank')
      clearCart()
      router.push('/tienda')
    } catch (e) {
      console.error(e)
      alert('Error procesando tu orden. Por favor intenta de nuevo.')
    } finally {
      isProcessing.value = false
    }
  } else {
    showSoonAlert.value = true
  }
}
</script>

<style scoped>
.input-field {
  width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0.75rem; padding: 0.75rem 1rem; color: white; font-size: 0.875rem;
  outline: none; transition: all 0.2s;
}
.input-field::placeholder { color: #4b5563; }
.input-field:focus { border-color: rgba(57,255,20,0.5); background: rgba(255,255,255,0.08); }
</style>
