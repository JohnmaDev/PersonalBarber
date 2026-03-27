<template>
    <div class="flex flex-col items-center w-full">
        <img 
            src="./PersonalBarber.svg" 
            class="w-24 h-24 sm:w-32 sm:h-32 opacity-75 hover:opacity-100 transition-all duration-700 hover:scale-110" 
            alt="PersonalBarber — Barbería Premium Medellín"
        />
        
        <footer class="text-center text-[10px] sm:text-xs text-gray-500 py-10 tracking-widest uppercase">
            <!-- NAP: Name + Address + Phone — señal de SEO local -->
            <address class="not-italic flex flex-col items-center gap-1 mb-4 text-gray-600 text-[10px]">
              <span>📍 La 4 Sur · Medellín, Antioquia, Colombia</span>
              <a href="tel:+573045840264" class="hover:text-neon-green transition duration-300">📞 +57 304 584 0264</a>
            </address>
            <p class="flex flex-col sm:flex-row items-center justify-center gap-2">
              <span class="opacity-50">
                &lt;/&gt; 2026 — Built with ❤️ by
              </span>
              <a
                href="https://www.linkedin.com/in/john-mario-echavarria-bermudez/"
                target="_blank"
                rel="noopener noreferrer"
                class="text-neon-green font-bold hover:text-white transition duration-500"
              >
                JohnmaDev
              </a>
              <span class="hidden sm:inline opacity-30">·</span>
              <span class="opacity-50">All rights reserved.</span>
            </p>
        </footer>
    </div>
</template>

<script setup>
// Componente decorativo de pie de página
</script>
