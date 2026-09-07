<template>
  <div class="flex flex-col items-center w-full">
    <!-- Logo SVG con enlace de regreso al inicio (accesibilidad + SEO) -->
    <NuxtLink to="/" aria-label="PersonalBarber — Ir al inicio">
      <img
        src="/PersonalBarber.svg"
        class="w-24 h-24 sm:w-32 sm:h-32 opacity-75 hover:opacity-100 transition-all duration-700 hover:scale-110"
        alt="PersonalBarber — Barbería Premium Medellín"
        width="128"
        height="128"
        loading="lazy"
        decoding="async"
      />
    </NuxtLink>

    <!-- Footer con NAP (Name + Address + Phone) + Email + Links Legales Wompi -->
    <footer class="text-center text-[10px] sm:text-xs text-gray-400 py-8 tracking-widest uppercase w-full">
      
      <!-- Datos contacto barbero — Schema NAP para SEO local de Google -->
      <address class="not-italic flex flex-col items-center gap-1.5 mb-4 text-gray-400 text-[11px] sm:text-xs">
        <span>📍 La 4 Sur · Medellín, Antioquia, Colombia</span>
        <div class="flex flex-wrap items-center justify-center gap-3">
          <a
            href="tel:+573337518070"
            class="hover:text-neon-green transition duration-300 cursor-pointer"
            aria-label="Llamar a PersonalBarber"
          >
            📞 +57 333 751 8070
          </a>
          <span class="opacity-50">·</span>
          <a
            href="mailto:ayuda@personalbarber.co"
            class="hover:text-neon-green transition duration-300 cursor-pointer text-gray-300 font-semibold"
            aria-label="Enviar correo a PersonalBarber"
          >
            ✉️ ayuda@personalbarber.co
          </a>
        </div>
      </address>

      <!-- Redes sociales del barbero -->
      <nav class="flex items-center justify-center gap-4 mb-5" :aria-label="t('footer.socialLabel')">
        <a
          href="https://www.instagram.com/personalbarber.co/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-400 hover:text-pink-500 transition duration-300 text-sm"
          aria-label="Instagram de PersonalBarber"
        >
          <fa-icon :icon="['fab', 'instagram']" />
        </a>
        <a
          href="https://www.tiktok.com/@pipehpbarber"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-400 hover:text-white transition duration-300 text-sm"
          aria-label="TikTok de PersonalBarber"
        >
          <fa-icon :icon="['fab', 'tiktok']" />
        </a>
        <a
          href="https://wa.me/573337518070"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-400 hover:text-neon-green transition duration-300 text-sm"
          aria-label="WhatsApp de PersonalBarber"
        >
          <fa-icon :icon="['fab', 'whatsapp']" />
        </a>
      </nav>

      <!-- Enlaces Legales (Cumplimiento Wompi / Estatuto del Consumidor Colombia) -->
      <nav class="flex flex-wrap items-center justify-center gap-3 sm:gap-5 mb-6 text-[10px] sm:text-[11px] font-bold text-gray-400 normal-case tracking-normal">
        <button @click="openModal('terminos')" class="hover:text-neon-green transition-colors duration-200 cursor-pointer">
          📜 Términos y Condiciones
        </button>
        <span class="opacity-50">·</span>
        <button @click="openModal('privacidad')" class="hover:text-neon-green transition-colors duration-200 cursor-pointer">
          🔒 Política de Privacidad
        </button>
        <span class="opacity-50">·</span>
        <button @click="openModal('envios')" class="hover:text-neon-green transition-colors duration-200 cursor-pointer">
          🚚 Garantías & Envíos
        </button>
      </nav>

      <!-- Créditos del desarrollador -->
      <p class="flex flex-col sm:flex-row items-center justify-center gap-2 text-[10px] text-gray-400">
        <span class="opacity-80">
          &lt;/&gt; 2026 — Built with ❤️ by
        </span>
        <a
          href="https://www.linkedin.com/in/john-mario-echavarria-bermudez/"
          target="_blank"
          rel="noopener noreferrer"
          class="text-neon-green font-bold hover:text-white transition duration-500 cursor-pointer"
          aria-label="Perfil de LinkedIn de JohnmaDev"
        >
          JohnmaDev
        </a>
        <span class="hidden sm:inline opacity-50">·</span>
        <span class="opacity-80">{{ t('footer.rights') }}</span>
      </p>
    </footer>

    <!-- Modal de Políticas Legales -->
    <ClientOnly>
      <Teleport to="body">
        <Transition name="fade">
          <div v-if="activePolicy" class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" @click.self="activePolicy = null">
            <div class="relative w-full max-w-2xl bg-[#121212] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh] text-left">
              <!-- Header modal -->
              <div class="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div class="flex items-center gap-3">
                  <span class="text-xl">{{ policyTitle.icon }}</span>
                  <h3 class="text-white font-bold text-base sm:text-lg tracking-wide">{{ policyTitle.title }}</h3>
                </div>
                <button @click="activePolicy = null" class="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all">
                  ✕
                </button>
              </div>

              <!-- Cuerpo del modal -->
              <div class="p-6 overflow-y-auto space-y-4 text-xs text-gray-300 leading-relaxed font-sans">
                <!-- Términos -->
                <template v-if="activePolicy === 'terminos'">
                  <p class="text-gray-400">Al utilizar nuestro sitio web y comprar en <strong>PersonalBarber</strong>, aceptas las siguientes condiciones de servicio:</p>
                  
                  <h4 class="font-bold text-white text-sm mt-3 mb-1 text-neon-green">1. Titularidad y Emprendimiento Independiente</h4>
                  <p><strong>PersonalBarber</strong> es una iniciativa independiente y un emprendimiento local colombiano en Medellín, operado directamente por sus propios fundadores y barberos apasionados. No somos una gran corporación masiva; somos emprendedores locales que trabajamos día a día con honestidad, esfuerzo y vocación para ofrecer productos de barbería y cuidado personal de alta calidad a nuestra comunidad. Cada compra realizada respalda el trabajo directo y el crecimiento de nuestro equipo.</p>

                  <h4 class="font-bold text-white text-sm mt-3 mb-1 text-neon-green">2. Envíos y Tiempos de Entrega</h4>
                  <p>Operamos envíos en todo el territorio colombiano. En Medellín y Valle de Aburrá, las entregas con PersonalBarber Express toman entre 24 y 48 horas hábiles.</p>

                  <h4 class="font-bold text-white text-sm mt-3 mb-1 text-neon-green">3. Garantía y Respaldo</h4>
                  <p>Nos hacemos 100% responsables por la entrega de tu pedido. Si tu paquete sufre daños o pérdida durante el transporte, gestionaremos el reenvío de tus productos para que tu dinero siempre esté protegido.</p>

                  <h4 class="font-bold text-white text-sm mt-3 mb-1 text-neon-green">4. Atención al Cliente</h4>
                  <p>Para cualquier solicitud, estamos disponibles en WhatsApp (+57 333 751 8070) y correo electrónico (ayuda@personalbarber.co).</p>
                </template>

                <!-- Privacidad -->
                <template v-if="activePolicy === 'privacidad'">
                  <p class="text-gray-400">En <strong>PersonalBarber</strong> respetamos y protegemos tus datos personales conforme a la <strong>Ley 1581 de 2012 (Habeas Data)</strong> de Colombia.</p>

                  <h4 class="font-bold text-white text-sm mt-3 mb-1 text-neon-green">1. Uso de la Información</h4>
                  <p>Los datos solicitados (nombre, teléfono, dirección y correo) se utilizan exclusivamente para procesar tu pedido, coordinar la entrega y enviarte el recibo de tu compra.</p>

                  <h4 class="font-bold text-white text-sm mt-3 mb-1 text-neon-green">2. Confidencialidad</h4>
                  <p>No vendemos, alquilamos ni compartimos tus datos personales con terceros para fines publicitarios.</p>

                  <h4 class="font-bold text-white text-sm mt-3 mb-1 text-neon-green">3. Tus Derechos</h4>
                  <p>Puedes solicitar en cualquier momento la actualización o eliminación de tus datos escribiéndonos a <strong>ayuda@personalbarber.co</strong>.</p>
                </template>

                <!-- Envíos -->
                <template v-if="activePolicy === 'envios'">
                  <h4 class="font-bold text-white text-sm mb-1 text-neon-green">Cobertura y Tarifas</h4>
                  <p>¡Envíos <strong>100% GRATIS a toda Colombia</strong>! Despachamos a Medellín, Valle de Aburrá y a nivel nacional mediante PersonalBarber Express y transportadoras aliadas certificadas.</p>

                  <h4 class="font-bold text-white text-sm mt-3 mb-1 text-neon-green">Nuestra Garantía</h4>
                  <p>Si el empaque o producto llega defectuoso o dañado de fábrica, contáctanos dentro de los primeros 3 días hábiles tras recibirlo para coordinar el cambio sin costo adicional.</p>
                </template>
              </div>

              <!-- Footer modal -->
              <div class="px-6 py-3 border-t border-white/10 bg-white/5 flex justify-end">
                <button @click="activePolicy = null" class="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs transition-all">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useLanguage } from '~/composables/useLanguage'

const { t } = useLanguage()

const activePolicy = ref<string | null>(null)

function openModal(type: string) {
  activePolicy.value = type
}

const policyTitle = computed(() => {
  switch (activePolicy.value) {
    case 'terminos':
      return { title: 'Términos y Condiciones', icon: '📜' }
    case 'privacidad':
      return { title: 'Política de Privacidad', icon: '🔒' }
    case 'envios':
      return { title: 'Garantías & Envíos', icon: '🚚' }
    default:
      return { title: 'Información Legal', icon: '📄' }
  }
})
</script>
