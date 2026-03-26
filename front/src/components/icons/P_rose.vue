<template>
    <div class="flex flex-col items-center w-full">
        <!-- Logo con un hover más suave y tamaño consistente -->
        <img 
            src="./PersonalBarber.svg" 
            class="w-24 h-24 sm:w-32 sm:h-32 opacity-75 hover:opacity-100 transition-all duration-700 hover:scale-110" 
            alt="P_Rose"
        />
        
        <footer class="text-center text-[10px] sm:text-xs text-gray-500 py-10 tracking-widest uppercase">
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
