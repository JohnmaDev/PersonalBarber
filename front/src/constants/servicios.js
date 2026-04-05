export const servicios = [
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
      <!-- Camisa/Cuerpo (Base) -->
      <path d="M16 60 V52 C16 45 22 40 28 40 H36 C42 40 48 45 48 52 V60" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M24 40 L24 60M40 40 L40 60" stroke="currentColor" stroke-width="2"/>
      
      <!-- Grupo Cabeza (Animado) -->
      <g class="head-group">
        <!-- Cara / Cabello -->
        <path d="M24 25 C24 16 28 14 32 14 C36 14 40 16 40 25 V30 C40 37 36 40 32 40 C28 40 24 37 24 30 V25Z" stroke="currentColor" stroke-width="2"/>
        <path d="M23 18 C23 12 26 8 32 8 C38 8 41 12 41 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <!-- Moño -->
        <circle cx="32" cy="7" r="3" stroke="currentColor" stroke-width="2"/>
        <!-- Barba -->
        <path d="M24 25 C20 32 20 40 32 46 C44 40 44 32 40 25" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M28 38 C28 41 30 42 32 42 C34 42 36 41 36 38" stroke="currentColor" stroke-width="1.2" opacity="0.6"/>
        <!-- Bigote -->
        <path d="M26 34 C28 32 30 32 32 33 C34 32 36 32 38 34 C36 35 34 36 32 35 C30 36 28 35 26 34Z" stroke="currentColor" stroke-width="2"/>
      </g>
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
];
