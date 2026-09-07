<template>
  <div class="bg-barber-black min-h-screen text-white flex flex-col">

    <!-- Header -->
    <header class="w-full border-b border-white/8 bg-barber-black">
      <div class="max-w-5xl mx-auto px-6 py-5 flex flex-col items-center gap-3">
        <NuxtLink to="/">
          <img src="/favicon.svg" alt="PersonalBarber" class="h-14 w-auto opacity-90 hover:opacity-100 transition-opacity" width="56" height="56" decoding="async" />
        </NuxtLink>
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-xs font-semibold tracking-wide">
          <button @click="goToStep(1)" :class="step >= 1 ? 'dept-text font-bold' : 'text-white/30'" class="hover:underline">Información y Entrega</button>
          <span class="text-white/20">›</span>
          <button @click="goToStep(2)" :class="step === 2 ? 'dept-text font-bold' : 'text-white/30'" :disabled="step < 2" class="disabled:cursor-not-allowed hover:underline">Pago</button>
        </nav>
      </div>
    </header>

    <main class="flex-1">
      <ClientOnly>
        <!-- Carrito vacío -->
        <div v-if="cartItems.length === 0" class="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <fa-icon :icon="['fas', 'shopping-bag']" class="text-5xl text-white/10" />
          <p class="text-gray-500">Tu carrito está vacío</p>
          <NuxtLink to="/" class="dept-text hover:underline text-sm font-bold">← Explorar productos</NuxtLink>
        </div>

        <div v-else class="max-w-5xl mx-auto px-4 py-10">
          <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

            <!-- Columna principal -->
            <div class="lg:col-span-3 space-y-6">

              <!-- ═══ PASO 1: INFORMACIÓN Y ENTREGA ═══ -->
              <div v-if="step === 1" class="space-y-6">
                <!-- Información de contacto -->
                <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h2 class="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <span class="w-6 h-6 dept-bg text-black text-xs font-black rounded-full flex items-center justify-center">1</span>
                    Información de contacto
                  </h2>
                  <div class="space-y-4">
                    <div>
                      <label class="label-xs">Nombre completo *</label>
                      <input v-model="form.fullName" @blur="touched.fullName=true" type="text" placeholder="Carlos Gómez" class="input-field" :class="{'border-red-500/50': touched.fullName && !form.fullName.trim()}" />
                      <p v-if="touched.fullName && !form.fullName.trim()" class="err">El nombre completo es obligatorio</p>
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label class="label-xs">Email *</label>
                        <input v-model="form.email" @blur="touched.email=true" type="email" placeholder="juan@email.com" class="input-field" :class="{'border-red-500/50': touched.email && !isEmailValid}" />
                        <p v-if="touched.email && !isEmailValid" class="err">Ingresa un correo válido</p>
                      </div>
                      <div>
                        <label class="label-xs">Teléfono / WhatsApp *</label>
                        <input v-model="form.phone" @input="form.phone=form.phone.replace(/[^0-9+]/g,'')" @blur="touched.phone=true" type="tel" placeholder="+57 300 123 4567" class="input-field" :class="{'border-red-500/50': touched.phone && !isPhoneValid}" />
                        <p v-if="touched.phone && !isPhoneValid" class="err">Número colombiano inválido (10 dígitos)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Datos de entrega -->
                <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h2 class="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <span class="w-6 h-6 dept-bg text-black text-xs font-black rounded-full flex items-center justify-center">2</span>
                    Datos de entrega
                  </h2>

                  <div class="space-y-4">
                    <div>
                      <label class="label-xs">¿En qué ciudad deseas recibir tu pedido? *</label>
                      <input v-model="form.city" @blur="touched.city=true" list="colombian-cities" type="text" placeholder="Medellín, Bogotá, Cali, Barranquilla, Pereira..." class="input-field" :class="{'border-red-500/50': touched.city && !form.city.trim()}" />
                      <datalist id="colombian-cities">
                        <option value="Medellín" />
                        <option value="Bogotá" />
                        <option value="Cali" />
                        <option value="Barranquilla" />
                        <option value="Bucaramanga" />
                        <option value="Pereira" />
                        <option value="Envigado" />
                        <option value="Bello" />
                        <option value="Itagüí" />
                        <option value="Sabaneta" />
                        <option value="Rionegro" />
                        <option value="Cartagena" />
                        <option value="Manizales" />
                        <option value="Cúcuta" />
                        <option value="Ibagué" />
                        <option value="Santa Marta" />
                        <option value="Villavicencio" />
                        <option value="Pasto" />
                        <option value="Montería" />
                        <option value="Valledupar" />
                        <option value="Armenia" />
                        <option value="Popayán" />
                        <option value="Neiva" />
                        <option value="Tunja" />
                        <option value="Girardota" />
                        <option value="Copacabana" />
                        <option value="Guarne" />
                        <option value="Marinilla" />
                        <option value="La Ceja" />
                        <option value="La Estrella" />
                        <option value="Caldas" />
                        <option value="El Retiro" />
                      </datalist>
                      <p v-if="touched.city && !form.city.trim()" class="err">La ciudad es obligatoria</p>
                      <p class="text-xs text-neon-green font-bold flex items-center gap-1.5 mt-2">
                        <fa-icon :icon="['fas', 'truck']" /> Envío 100% GRATIS a todo Colombia 🇨🇴
                      </p>
                    </div>

                    <div>
                      <label class="label-xs">Dirección completa *</label>
                      <input v-model="form.address" @blur="touched.address=true" type="text" placeholder="Calle 50 # 30-10, Carrera 43A # 1-50..." class="input-field" :class="{'border-red-500/50': touched.address && !form.address.trim()}" />
                      <p v-if="touched.address && !form.address.trim()" class="err">La dirección es obligatoria</p>
                    </div>

                    <div>
                      <label class="label-xs">Piso, apartamento, casa o referencia <span class="text-gray-500 font-normal">(opcional)</span></label>
                      <input v-model="form.apartment" type="text" placeholder="Apto 201, Torre B, Casa 14, timbre blanco..." class="input-field" />
                    </div>
                  </div>

                  <div class="mt-8 flex items-center justify-between">
                    <NuxtLink to="/" class="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
                      <fa-icon :icon="['fas', 'arrow-left']" class="text-xs" /> Volver a la tienda
                    </NuxtLink>
                    <button @click="nextStep" :disabled="!step1Valid"
                      class="px-8 py-3 font-black text-sm rounded-xl transition-all duration-300 flex items-center gap-2"
                      :class="step1Valid ? 'dept-bg hover:opacity-90 text-black shadow-[0_0_20px_var(--dept-glow)]' : 'bg-white/10 text-gray-600 cursor-not-allowed'">
                      Continuar al pago <fa-icon :icon="['fas', 'arrow-right']" class="text-xs" />
                    </button>
                  </div>
                </div>
              </div>

              <!-- ═══ PASO 2: PAGO ═══ -->
              <div v-if="step === 2">
                <!-- Resumen de contacto y entrega en modo lectura -->
                <div class="bg-white/5 rounded-2xl p-5 border border-white/10 mb-6 divide-y divide-white/8">
                  <div class="flex items-center justify-between text-sm pb-3">
                    <div class="flex gap-4">
                      <span class="text-gray-500 w-20">Contacto</span>
                      <span class="text-white">{{ form.fullName }} · {{ form.email }} · {{ form.phone }}</span>
                    </div>
                    <button @click="step = 1" class="dept-text text-xs hover:underline font-semibold">Cambiar</button>
                  </div>
                  <div class="flex items-center justify-between text-sm py-3">
                    <div class="flex gap-4">
                      <span class="text-gray-500 w-20">Enviar a</span>
                      <span class="text-white">{{ form.address }}<span v-if="form.apartment">, {{ form.apartment }}</span>, {{ form.city }}</span>
                    </div>
                    <button @click="step = 1" class="dept-text text-xs hover:underline font-semibold">Cambiar</button>
                  </div>
                  <div class="flex items-center justify-between text-sm pt-3">
                    <div class="flex gap-4">
                      <span class="text-gray-500 w-20">Envío</span>
                      <span class="text-neon-green font-semibold flex items-center gap-1.5">
                        ⚡ Envío 100% GRATIS a todo Colombia 🇨🇴
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Métodos de pago -->
                <div class="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <h2 class="text-lg font-bold text-white mb-5 flex items-center gap-2">
                    <span class="w-6 h-6 dept-bg text-black text-xs font-black rounded-full flex items-center justify-center">2</span>
                    Método de pago
                  </h2>
                  <div class="space-y-3">
                    <label v-for="method in paymentMethods" :key="method.id"
                      class="flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300"
                      :class="selectedPayment === method.id ? 'dept-border bg-white/10' : 'border-white/10 hover:border-white/20'">
                      <input type="radio" v-model="selectedPayment" :value="method.id" class="hidden" />
                      <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                        :class="selectedPayment === method.id ? 'dept-border' : 'border-gray-600'">
                        <div v-if="selectedPayment === method.id" class="w-2.5 h-2.5 rounded-full dept-bg"></div>
                      </div>
                      <div class="flex items-center gap-3 flex-1">
                        <div class="text-2xl">{{ method.emoji }}</div>
                        <div>
                          <p class="text-white font-bold text-sm">{{ method.label }}</p>
                          <p class="text-gray-500 text-xs">{{ method.desc }}</p>
                        </div>
                      </div>
                      <span v-if="method.badge" class="text-[10px] dept-badge dept-text px-2 py-0.5 rounded-full font-bold">{{ method.badge }}</span>
                    </label>
                  </div>
                  <div v-if="selectedPayment === 'wompi'" class="mt-4 p-4 bg-neon-green/5 border border-neon-green/20 rounded-xl">
                    <p class="text-neon-green/80 text-xs leading-relaxed">
                      <fa-icon :icon="['fas', 'shield-alt']" class="mr-1" />
                      Pago 100% seguro con <strong>Wompi</strong> · Nequi, PSE, Visa, Mastercard, Bancolombia y más.
                    </p>
                  </div>
                  <div v-if="paymentError" class="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                    <p class="text-red-400 text-xs leading-relaxed">
                      <fa-icon :icon="['fas', 'exclamation-triangle']" class="mr-1" />
                      {{ paymentError }}
                    </p>
                  </div>

                  <div class="mt-6 flex items-center justify-between">
                    <button @click="step = 1" class="text-gray-400 hover:text-white text-sm flex items-center gap-1 transition-colors">
                      <fa-icon :icon="['fas', 'arrow-left']" class="text-xs" /> Volver
                    </button>
                    <button @click="handleCheckout" :disabled="isProcessing"
                      class="px-8 py-3 dept-bg hover:opacity-90 text-black font-black text-sm rounded-xl transition-all duration-300 shadow-[0_0_20px_var(--dept-glow)] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      <fa-icon v-if="isProcessing" :icon="['fas', 'spinner']" class="fa-spin" />
                      <fa-icon v-else :icon="['fas', 'lock']" class="text-xs" />
                      {{ isProcessing ? 'Procesando...' : `Pagar ${grandTotalFormatted}` }}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Resumen del pedido (sticky) -->
            <div class="lg:col-span-2 sticky top-6">
              <div class="bg-white/5 rounded-2xl p-5 border border-white/10">
                <h2 class="text-sm font-bold text-white mb-4 tracking-wide uppercase">Resumen del pedido</h2>
                <div class="space-y-3 mb-5">
                  <div v-for="item in cartItems" :key="item.id" class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                      <img :src="optimizeImage(item.images?.[0] || item.image, 100)" :alt="item.name" class="w-full h-full object-cover" width="40" height="40" loading="lazy" decoding="async" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-white text-xs font-semibold leading-tight truncate">{{ item.name }}</p>
                      <p class="text-gray-500 text-xs">× {{ item.qty }}</p>
                    </div>
                    <span class="dept-text text-xs font-bold flex-shrink-0">{{ formatPrice(parsePrice(item.price) * item.qty) }}</span>
                  </div>
                </div>
                <div class="border-t border-white/10 pt-4 space-y-2">
                  <div class="flex justify-between text-sm"><span class="text-gray-400">Subtotal</span><span class="text-white font-semibold">{{ cartTotalFormatted }}</span></div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-400">Envío</span>
                    <span class="dept-text font-bold">GRATIS</span>
                  </div>
                  <div class="flex justify-between text-base font-black border-t border-white/10 pt-3 mt-2">
                    <span class="text-white">TOTAL</span>
                    <span class="dept-text">{{ grandTotalFormatted }}</span>
                  </div>
                </div>
                <p class="text-center text-gray-600 text-[10px] mt-4">
                  <fa-icon :icon="['fas', 'shield-alt']" class="mr-1" />Pago seguro · SSL encriptado
                </p>
                <div class="flex items-center justify-center gap-2 mt-3 flex-wrap">
                  <span v-for="logo in ['Nequi', 'PSE', 'Visa', 'Mastercard']" :key="logo" class="text-[10px] bg-white/5 border border-white/10 px-2 py-1 rounded-md text-gray-500 font-bold">{{ logo }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>
    </main>

    <!-- Footer de políticas -->
    <footer class="w-full border-t border-white/8 mt-auto">
      <div class="max-w-5xl mx-auto px-6 py-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
        <NuxtLink to="/" class="checkout-footer-link">Tienda</NuxtLink>
        <button @click="openPolicy('envios')" class="checkout-footer-link">Política de Envíos</button>
        <button @click="openPolicy('reembolsos')" class="checkout-footer-link">Reembolsos</button>
        <button @click="openPolicy('privacidad')" class="checkout-footer-link">Privacidad</button>
        <button @click="openPolicy('terminos')" class="checkout-footer-link">Términos</button>
        <button @click="openPolicy('contacto')" class="checkout-footer-link">Contacto</button>
      </div>
    </footer>



    <!-- ═══ MODAL DE POLÍTICAS ═══ -->
    <Transition name="fade">
      <div v-if="activePolicy" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-md" @click.self="activePolicy = null">
        <div class="policy-modal bg-[#0d0d0d] border border-white/10 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg shadow-2xl flex flex-col max-h-[90vh]">

          <!-- Header del modal -->
          <div class="flex items-center justify-between px-6 py-5 border-b border-white/8 flex-shrink-0">
            <div class="flex items-center gap-3">
              <div v-if="policies[activePolicy]?.icon" class="w-8 h-8 rounded-xl flex items-center justify-center text-sm" :class="policies[activePolicy]?.iconBg">
                {{ policies[activePolicy]?.icon }}
              </div>
              <h3 class="text-white font-black text-base tracking-tight">{{ policies[activePolicy]?.title }}</h3>
            </div>
            <button @click="activePolicy = null" class="w-8 h-8 rounded-full bg-white/8 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200">
              <fa-icon :icon="['fas', 'xmark']" class="text-sm" />
            </button>
          </div>

          <!-- Cuerpo scrolleable -->
          <div class="overflow-y-auto px-6 py-5 space-y-4 flex-1 policy-scroll">
            
            <!-- Política de Reembolsos -->
            <div v-if="activePolicy === 'reembolsos'" class="policy-body flex flex-col items-center justify-center py-6 text-center space-y-4">
              <p class="text-white/90 font-bold text-base tracking-wide uppercase">
                Todas las ventas son definitivas.
              </p>
              <p class="text-gray-400 text-sm leading-relaxed max-w-sm">
                Sin devoluciones. Sin cancelaciones. Sin cambios.
              </p>
              <div class="border-t border-white/10 w-full pt-4 mt-2 space-y-3">
                <p class="text-xs text-gray-500 leading-relaxed text-left">
                  <strong>Productos de cuidado e higiene:</strong> Por razones de seguridad sanitaria, no aceptamos cambios ni devoluciones en ceras, tratamientos o productos de uso directo una vez confirmada la compra.
                </p>
                <p class="text-xs text-gray-500 leading-relaxed text-left">
                  <strong>Equipos eléctricos:</strong> Las máquinas de corte, secadoras y barberas cuentan con garantía de fábrica por defectos. En caso de fallas, el equipo estará sujeto a un diagnóstico técnico para autorizar su reparación o reemplazo.
                </p>
              </div>
            </div>

            <!-- Política de Envíos -->
            <div v-if="activePolicy === 'envios'" class="policy-body">
              <p class="policy-lead">En <strong>PersonalBarber</strong> todos nuestros envíos son <strong>100% GRATIS a todo Colombia</strong> 🇨🇴. Sin tarifas ocultas ni montos mínimos de compra.</p>
              
              <div class="space-y-3 my-4">
                <div class="policy-alert-box !bg-neon-green/10 !border-neon-green/30" style="--alert-color: #39ff14;">
                  <div class="text-xl flex-shrink-0 mt-0.5">📦</div>
                  <div>
                    <p class="policy-alert-title !text-neon-green">Envío GRATIS a nivel nacional</p>
                    <p class="policy-alert-sub">Cubrimos todas las ciudades y municipios del territorio colombiano con costo de envío $0 COP.</p>
                  </div>
                </div>
              </div>

              <h4 class="policy-section-title">Detalles y tiempos de despacho</h4>
              <ul class="policy-list">
                <li>Los pedidos son despachados dentro de las <strong>24 horas hábiles</strong> siguientes a la confirmación del pago.</li>
                <li>El tiempo de entrega puede variar según la ciudad de destino y la transportadora (generalmente entre 1 y 5 días hábiles a nivel nacional).</li>
                <li>Te compartiremos el número de guía por WhatsApp y correo electrónico para que puedas realizar el seguimiento de tu paquete.</li>
              </ul>

              <h4 class="policy-section-title">Dirección de entrega</h4>
              <p class="policy-note">Por favor verifica que tu ciudad, dirección y referencias sean exactas y completas para garantizar una entrega sin contratiempos.</p>
            </div>

            <!-- Política de Privacidad -->
            <div v-if="activePolicy === 'privacidad'" class="policy-body">
              <p class="policy-lead">En <strong>PersonalBarber</strong>, respetamos su privacidad y protegemos su información personal bajo los más altos estándares de seguridad y la normativa colombiana vigente (Ley 1581 de 2012).</p>
              
              <h4 class="policy-section-title">1. Información que recopilamos</h4>
              <p class="text-xs text-gray-400 leading-relaxed mb-3">
                Al realizar una compra o agendar una cita, recopilamos información personal necesaria para procesar su solicitud, como su nombre, dirección de envío, correo electrónico y número de teléfono o WhatsApp. Al navegar por nuestra tienda, también podemos recibir automáticamente su dirección IP para fines analíticos de rendimiento y seguridad.
              </p>

              <h4 class="policy-section-title">2. Consentimiento y Uso</h4>
              <p class="text-xs text-gray-400 leading-relaxed mb-3">
                Al proporcionarnos sus datos para completar una transacción, coordinar un envío o agendar un servicio, usted acepta que recopilemos y utilicemos dicha información exclusivamente para ese fin. Podremos comunicarnos con usted vía WhatsApp o correo electrónico para enviarle actualizaciones de su pedido, recordatorios de citas o soporte técnico.
              </p>

              <h4 class="policy-section-title">3. Pagos y Seguridad</h4>
              <p class="text-xs text-gray-400 leading-relaxed mb-3">
                Su información de pago es procesada de forma segura mediante pasarelas certificadas que cumplen con el estándar internacional PCI-DSS. PersonalBarber no almacena ni tiene acceso a los datos completos de sus tarjetas. Toda la transferencia de información en nuestro sitio web está protegida mediante encriptación SSL.
              </p>

              <h4 class="policy-section-title">4. Terceros</h4>
              <p class="text-xs text-gray-400 leading-relaxed mb-3">
                No venderemos ni alquilaremos su información a terceros. Solo compartiremos sus datos básicos con proveedores de servicios estrictamente necesarios, como las empresas de mensajería encargadas de entregar su pedido.
              </p>

              <div class="border-t border-white/10 mt-6 pt-5">
                <p class="text-sm text-white font-bold mb-3">Contacto y Derechos</p>
                <p class="text-xs text-gray-400 leading-relaxed mb-4">
                  Si desea acceder, corregir o eliminar su información, o si necesita ayuda, comuníquese con nosotros por cualquiera de estos canales:
                </p>
                <div class="flex flex-col gap-3">
                  <a href="https://api.whatsapp.com/send?phone=573337518070" target="_blank" class="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all text-[#25D366]">
                    <fa-icon :icon="['fab', 'whatsapp']" class="text-lg" />
                    <div class="flex flex-col">
                      <span class="text-xs font-bold uppercase tracking-wider">Chat WhatsApp</span>
                      <span class="text-[10px] opacity-80">+57 333 751 8070</span>
                    </div>
                  </a>
                  <a href="mailto:ayuda@personalbarber.co" class="flex items-center gap-3 p-3 rounded-xl bg-neon-green/10 border border-neon-green/20 hover:bg-neon-green/20 transition-all text-neon-green">
                    <fa-icon :icon="['fas', 'envelope']" class="text-lg" />
                    <div class="flex flex-col">
                      <span class="text-xs font-bold uppercase tracking-wider">Correo Electrónico</span>
                      <span class="text-[10px] opacity-80">ayuda@personalbarber.co</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <!-- Términos y Condiciones -->
            <div v-if="activePolicy === 'terminos'" class="policy-body">
              <p class="policy-lead">Al utilizar nuestro sitio web y realizar compras en <strong>PersonalBarber</strong>, usted acepta los siguientes términos y condiciones de servicio.</p>

              <h4 class="policy-section-title">1. Titularidad y Filosofía del Emprendimiento</h4>
              <p class="text-xs text-gray-400 leading-relaxed mb-3">
                <strong>PersonalBarber</strong> es una iniciativa independiente y un emprendimiento local colombiano en Medellín, operado directamente por sus propios fundadores y barberos apasionados. No somos una gran corporación masiva; somos emprendedores locales que trabajamos día a día con honestidad, esfuerzo y vocación para ofrecer productos de barbería y cuidado personal de alta calidad a nuestra comunidad. Cada compra realizada respalda el trabajo directo y el crecimiento de nuestro equipo.
              </p>

              <h4 class="policy-section-title">2. Tiempos y Detalles de Envío</h4>
              <p class="text-xs text-gray-400 leading-relaxed mb-3">
                Los envíos operan exclusivamente a nivel nacional (Colombia) con cobertura 100% gratuita. Los tiempos de entrega son gestionados con transportadoras certificadas y pueden variar según la ciudad de destino y la temporada.
              </p>

              <h4 class="policy-section-title">3. Direcciones de Envío</h4>
              <p class="text-xs text-gray-400 leading-relaxed mb-3">
                Por favor, verifique cuidadosamente su dirección antes de enviar el pedido. Si requiere una modificación, haremos lo posible por ayudarle antes del despacho, pero no es garantizado. Si un paquete debe ser reenviado por problemas en la dirección proporcionada, el cliente es responsable del 100% de las tarifas logísticas adicionales.
              </p>

              <h4 class="policy-section-title">4. Responsabilidad y Garantía de Entrega</h4>
              <p class="text-xs text-gray-400 leading-relaxed mb-3">
                Nosotros respaldamos tu compra. Si un paquete se extravía, sufre daños severos o es robado mientras está en poder de la transportadora, PersonalBarber asumirá el inconveniente. Gestionaremos el reclamo directamente con la empresa logística y nos aseguraremos de enviarte un reemplazo o procesar una solución para que tu inversión siempre esté protegida. (Nota: Las demoras por fuerza mayor en las vías pueden ocurrir, pero siempre te acompañaremos hasta que recibas tu pedido).
              </p>

              <h4 class="policy-section-title">5. Artículos Defectuosos o Dañados</h4>
              <p class="text-xs text-gray-400 leading-relaxed mb-3">
                Si recibe un artículo dañado o defectuoso de fábrica (especialmente equipos eléctricos), debe contactarnos en un plazo máximo de <strong>2 a 3 días</strong> tras la entrega. Incluya su número de orden, fotografías y videos claros del artículo y su empaque original. Revisaremos su caso y haremos todo lo posible por resolver el problema. No se aceptarán reclamos presentados fuera de este periodo.
              </p>

              <div class="border-t border-white/10 mt-6 pt-5">
                <p class="text-sm text-white font-bold mb-3">Soporte y Reclamos</p>
                <p class="text-xs text-gray-400 leading-relaxed mb-4">
                  Para cualquier duda relacionada con su pedido, comuníquese con nosotros por cualquiera de estos canales:
                </p>
                <div class="flex flex-col gap-3">
                  <a href="https://api.whatsapp.com/send?phone=573337518070" target="_blank" class="flex items-center gap-3 p-3 rounded-xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all text-[#25D366]">
                    <fa-icon :icon="['fab', 'whatsapp']" class="text-lg" />
                    <div class="flex flex-col">
                      <span class="text-xs font-bold uppercase tracking-wider">Chat WhatsApp</span>
                      <span class="text-[10px] opacity-80">+57 333 751 8070</span>
                    </div>
                  </a>
                  <a href="mailto:ayuda@personalbarber.co" class="flex items-center gap-3 p-3 rounded-xl bg-neon-green/10 border border-neon-green/20 hover:bg-neon-green/20 transition-all text-neon-green">
                    <fa-icon :icon="['fas', 'envelope']" class="text-lg" />
                    <div class="flex flex-col">
                      <span class="text-xs font-bold uppercase tracking-wider">Correo Electrónico</span>
                      <span class="text-[10px] opacity-80">ayuda@personalbarber.co</span>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            <!-- Modal de Contacto Global -->
            <div v-if="activePolicy === 'contacto'" class="policy-body flex flex-col items-center justify-center py-4 text-center">
              <div class="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                <img src="/favicon.svg" alt="PersonalBarber" class="w-8 h-8 opacity-80" width="32" height="32" loading="lazy" decoding="async" />
              </div>
              <h3 class="text-white font-black text-lg mb-2">¿Necesitas ayuda?</h3>
              <p class="text-gray-400 text-xs leading-relaxed max-w-sm mb-6">
                Nuestro equipo de soporte está listo para ayudarte con tu pedido, reservas o cualquier duda que tengas. Selecciona tu canal preferido:
              </p>
              
              <div class="w-full flex flex-col gap-3">
                <a href="https://api.whatsapp.com/send?phone=573337518070" target="_blank" class="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] transition-all text-black font-black text-sm shadow-[0_0_15px_rgba(37,211,102,0.3)]">
                  <fa-icon :icon="['fab', 'whatsapp']" class="text-lg" />
                  Escribir por WhatsApp
                </a>
                <a href="mailto:ayuda@personalbarber.co" class="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-white/10 hover:bg-white/15 transition-all text-white font-bold text-sm border border-white/10">
                  <fa-icon :icon="['fas', 'envelope']" class="text-lg text-neon-green" />
                  ayuda@personalbarber.co
                </a>
              </div>
              
              <p class="text-[10px] text-gray-500 mt-6 uppercase tracking-widest font-semibold leading-relaxed">
                Respuesta usual en menos de 2 horas<br>
                <span class="opacity-70 normal-case tracking-normal">(Dentro de nuestro horario: 11:00 AM - 7:00 PM)</span>
              </p>
            </div>

          </div>

          <!-- Footer del modal -->
          <div class="px-6 py-4 border-t border-white/8 flex-shrink-0">
            <button @click="activePolicy = null" class="w-full py-3 bg-white/8 hover:bg-white/12 text-white/70 hover:text-white font-semibold text-sm rounded-xl transition-all duration-200">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Finalizar Compra | PersonalBarber',
  robots: 'noindex, nofollow',
})

const router = useRouter()
const { cartItems, cartTotal, cartTotalFormatted, formatPrice, parsePrice, clearCart } = useCart()

const step = ref(1)
const form = reactive({
  fullName: '',
  email: '',
  phone: '',
  city: '',
  address: '',
  apartment: '',
})
const touched = reactive({
  fullName: false,
  email: false,
  phone: false,
  city: false,
  address: false,
})
const selectedShipping = ref('express_valle')
const selectedPayment = ref('wompi')
const isProcessing = ref(false)
const paymentError = ref('')
const wompiScriptLoaded = ref(false)

// ── Políticas ──────────────────────────────────────────────
const activePolicy = ref<string | null>(null)
function openPolicy(id: string) { activePolicy.value = id }

const policies: Record<string, { title: string; icon?: string; iconBg?: string }> = {
  reembolsos: { title: 'Política de Reembolsos', icon: '💸', iconBg: 'bg-red-500/20 text-red-400' },
  envios: { title: 'Política de Envíos', icon: '🚚', iconBg: 'bg-neon-green/20 text-neon-green' },
  privacidad: { title: 'Aviso de Privacidad', icon: '🔒', iconBg: 'bg-blue-500/20 text-blue-400' },
  terminos: { title: 'Términos y Condiciones', icon: '📜', iconBg: 'bg-purple-500/20 text-purple-400' },
  contacto: { title: 'Atención al Cliente', icon: '💬', iconBg: 'bg-yellow-500/20 text-yellow-400' },
}

// ── Detección interna y silenciosa de zona logística ───────
function detectShippingZone(cityStr: string): string {
  if (!cityStr) return 'express_valle'
  const norm = cityStr.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
  
  const valleKeywords = ['medellin', 'bello', 'envigado', 'itagui', 'sabaneta', 'la estrella', 'estrella', 'san antonio de prado', 'poblado', 'laureles']
  if (valleKeywords.some(k => norm.includes(k))) return 'express_valle'
  
  const alrededoresKeywords = ['girardota', 'copacabana', 'caldas', 'guarne', 'rionegro', 'marinilla', 'la ceja', 'ceja', 'el retiro', 'retiro', 'barbosa', 'santa elena', 'carmen de viboral', 'santuario']
  if (alrededoresKeywords.some(k => norm.includes(k))) return 'express_alrededores'
  
  return 'express_nacional'
}

watch(() => form.city, (newCity) => {
  if (newCity.trim()) {
    selectedShipping.value = detectShippingZone(newCity)
  }
}, { immediate: true })

const paymentMethods = [
  { id: 'wompi', emoji: '💳', label: 'Pago Online', desc: 'Nequi, PSE, tarjetas Visa/Mastercard, Bancolombia', badge: 'Recomendado' },
  { id: 'whatsapp', emoji: '💬', label: 'Coordinar por WhatsApp', desc: 'Contacta al barber para acordar el pago' },
]

const shippingCost = computed(() => 0)
const grandTotal = computed(() => cartTotal.value)
const grandTotalFormatted = computed(() => formatPrice(grandTotal.value))

const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
const isPhoneValid = computed(() => /^(57)?3\d{9}$/.test(form.phone.replace(/[\s\-+]/g, '')))

// Paso 1: contacto + entrega obligatorios
const step1Valid = computed(() =>
  form.fullName.trim().length >= 3 &&
  isEmailValid.value &&
  isPhoneValid.value &&
  form.city.trim().length >= 2 &&
  form.address.trim().length >= 4
)

function nextStep() {
  touched.fullName = true
  touched.email = true
  touched.phone = true
  touched.city = true
  touched.address = true
  if (!step1Valid.value) return
  step.value = 2
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goToStep(n: number) {
  if (n === 1) {
    step.value = 1
  } else if (n === 2 && step1Valid.value) {
    step.value = 2
  }
}

// ── Cargar script del Widget Wompi dinámicamente ──
function loadWompiScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (wompiScriptLoaded.value || (window as any).WidgetCheckout) {
      wompiScriptLoaded.value = true
      resolve()
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.wompi.co/widget.js'
    script.async = true
    script.onload = () => {
      wompiScriptLoaded.value = true
      resolve()
    }
    script.onerror = () => reject(new Error('No se pudo cargar Wompi'))
    document.head.appendChild(script)
  })
}

// ── Crear orden base en backend ──
async function createBackendOrder(paymentMethod: string) {
  const parts = form.fullName.trim().split(/\s+/)
  const firstName = parts[0] || ''
  const lastName = parts.slice(1).join(' ') || parts[0] || ''
  const fullAddress = form.apartment.trim()
    ? `${form.address.trim()} (${form.apartment.trim()})`
    : form.address.trim()

  const payload = {
    customer: {
      firstName,
      lastName,
      email: form.email.trim(),
      phone: form.phone.replace(/[\s\-+]/g, ''),
      city: form.city.trim(),
      address: fullAddress,
    },
    items: cartItems.map(i => ({ id: i.id, qty: i.qty })),
    paymentMethod,
    shippingMethod: selectedShipping.value || 'express_nacional',
  }
  return await $fetch<{ ok: boolean; order: { id: string; total: number; total_format: string; subtotal_format?: string; orderToken?: string } }>('/api/create_order', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload,
  })
}

async function handleCheckout() {
  paymentError.value = ''
  isProcessing.value = true

  try {
    if (selectedPayment.value === 'whatsapp') {
      // ── Flujo WhatsApp ──
      const data = await createBackendOrder('whatsapp')
      if (!data.ok) throw new Error('Error creando orden')
      const phone = '573337518070'
      const itemsList = cartItems.map(i => `• ${i.name} x${i.qty}`).join('\n')
      const addressDisplay = form.apartment.trim() ? `${form.address.trim()} (${form.apartment.trim()})` : form.address.trim()
      const msg = `¡Hola! Acabo de hacer un pedido en PersonalBarber:\n\n*ID:* ${data.order.id}\n\n${itemsList}\n\n*Subtotal:* $${data.order.subtotal_format || data.order.total_format} COP\n*Envío:* GRATIS a todo Colombia 🇨🇴\n*TOTAL A PAGAR:* ${grandTotalFormatted.value}\n\n*Cliente:* ${form.fullName.trim()}\n*Ciudad:* ${form.city.trim()}\n*Dirección:* ${addressDisplay}\n*Teléfono:* ${form.phone}`
      window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`, '_blank')
      clearCart()
      router.push('/')
    } else {
      // ── Flujo Wompi ──
      const orderData = await createBackendOrder('wompi')
      if (!orderData.ok) throw new Error('Error creando orden')

      const txData = await $fetch<{
        ok: boolean; publicKey: string; amountInCents: number;
        currency: string; reference: string; integrityHash: string;
        redirectUrl: string; wompiEnvironment: string;
        orderToken?: string;
      }>('/api/create_transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: { orderId: orderData.order.id },
      })
      if (!txData.ok) throw new Error('Error preparando pago')

      const token = txData.orderToken || orderData.order?.orderToken || ''
      if (token) {
        try {
          sessionStorage.setItem(`pb_order_token_${txData.reference}`, token)
        } catch {}
      }

      await loadWompiScript()

      const checkout = new (window as any).WidgetCheckout({
        currency: txData.currency,
        amountInCents: txData.amountInCents,
        reference: txData.reference,
        publicKey: txData.publicKey,
        signature: { integrity: txData.integrityHash },
        redirectUrl: `${txData.redirectUrl}?id=${txData.reference}&token=${encodeURIComponent(token)}`,
        customerData: {
          email: form.email.trim(),
          fullName: form.fullName.trim(),
          phoneNumber: form.phone.replace(/[\s\-+]/g, ''),
          phoneNumberPrefix: '+57',
        },
      })

      checkout.open(function (result: any) {
        const txRef = result?.transaction?.reference || txData.reference
        router.push(`/checkout/resultado?id=${txRef}&token=${encodeURIComponent(token)}`)
      })
    }
  } catch (e: any) {
    console.error('Error en checkout:', e)
    paymentError.value = e?.message || 'Error procesando tu orden. Intenta de nuevo.'
  } finally {
    isProcessing.value = false
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
.label-xs { display: block; font-size: 0.75rem; color: #9ca3af; font-weight: 600; margin-bottom: 0.25rem; }
.err { font-size: 0.625rem; color: #f87171; margin-top: 0.25rem; }
.checkout-footer-link { font-size: 0.7rem; font-weight: 600; color: #6b7280; text-decoration: none; background: none; border: none; cursor: pointer; letter-spacing: 0.05em; transition: color 0.2s; padding: 0; }
.checkout-footer-link:hover { color: #fff; }

/* ── Policy Modal ── */
.policy-modal { animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
@keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
.policy-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.1) transparent; }
.policy-scroll::-webkit-scrollbar { width: 4px; }
.policy-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }

/* Policy body styles (used inside dynamic components) */
:deep(.policy-body) { font-size: 0.8rem; line-height: 1.6; color: #9ca3af; }
:deep(.policy-lead) { font-size: 0.85rem; color: #d1d5db; line-height: 1.7; }
:deep(.policy-lead strong) { color: #fff; }
:deep(.policy-alert-box) {
  display: flex; gap: 0.75rem; align-items: flex-start;
  background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.2);
  border-radius: 0.75rem; padding: 1rem; margin: 0.75rem 0;
}
:deep(.policy-alert-icon) { font-size: 1.25rem; flex-shrink: 0; margin-top: 0.1rem; }
:deep(.policy-alert-title) { font-size: 0.8rem; font-weight: 700; color: #fca5a5; margin-bottom: 0.25rem; }
:deep(.policy-alert-sub) { font-size: 0.72rem; color: #9ca3af; }
:deep(.policy-section-title) { font-size: 0.78rem; font-weight: 700; color: #e5e7eb; text-transform: uppercase; letter-spacing: 0.08em; margin-top: 1rem; margin-bottom: 0.4rem; padding-bottom: 0.3rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
:deep(.policy-list) { padding-left: 1.2rem; space-y: 0.25rem; }
:deep(.policy-list li) { margin-bottom: 0.35rem; }
:deep(.policy-list li strong) { color: #e5e7eb; }
:deep(.policy-list--ol) { list-style-type: decimal; }
:deep(.policy-note) { font-size: 0.75rem; color: #9ca3af; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 0.5rem; padding: 0.75rem; margin-top: 0.5rem; }
:deep(.policy-footer-note) { font-size: 0.72rem; color: #6b7280; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 0.75rem; margin-top: 0.75rem; }

/* Fade transition */
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
