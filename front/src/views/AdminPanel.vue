<template>
  <div class="bg-black min-h-screen text-white flex flex-col items-center px-4 py-8">

    <!-- PIN de acceso -->
    <div v-if="!autenticado" class="w-full max-w-xs mt-20 bg-zinc-900 rounded-2xl p-8 shadow-xl border border-zinc-800 text-center">
      <h1 class="text-2xl font-bold mb-2">Panel Admin</h1>
      <p class="text-zinc-300 text-sm mb-6">Ingresa el PIN de acceso</p>
      <input
        v-model="pinIngresado"
        type="password"
        maxlength="6"
        placeholder="••••••"
        class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-center text-2xl tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-neon-green mb-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]"
        @keyup.enter="verificarPin"
      >
      <p v-if="pinError" class="text-red-400 text-xs mb-3">PIN incorrecto</p>
      <button @click="verificarPin" class="w-full py-3 bg-neon-green text-black font-black italic tracking-widest uppercase rounded-xl hover:bg-neon-green-dark transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)] hover:shadow-[0_0_25px_rgba(57,255,20,0.6)]">
        Entrar
      </button>
    </div>

    <!-- Panel principal -->
    <div v-else class="max-w-6xl mx-auto px-4 py-12">
      
      <!-- Encabezado Brutalista -->
      <div class="flex flex-col items-center mb-16 text-center">
        <h1 class="text-[3.5rem] leading-tight sm:text-[5rem] lg:text-[80px] font-black lg:leading-tight tracking-tighter italic uppercase text-shadow-premium">
          <span class="text-neon-green block sm:inline drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">ADMIN</span> PANEL
        </h1>
        <p class="text-zinc-500 font-bold tracking-[0.3em] text-sm lg:text-base uppercase mt-4">Gestión Central de Barbería</p>
      </div>
        
      <div class="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div class="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
          <button 
            @click="activeTab = 'reservas'"
            :class="activeTab === 'reservas' ? 'bg-neon-green text-black' : 'text-zinc-400 hover:text-white'"
            class="px-6 py-2 rounded-xl text-xs font-black uppercase transition-all duration-300"
          >
            Reservas
          </button>
          <button 
            @click="activeTab = 'tienda'"
            :class="activeTab === 'tienda' ? 'bg-neon-green text-black' : 'text-zinc-400 hover:text-white'"
            class="px-6 py-2 rounded-xl text-xs font-black uppercase transition-all duration-300"
          >
            Tienda
          </button>
          <button 
            @click="activeTab = 'categorias'"
            :class="activeTab === 'categorias' ? 'bg-neon-green text-black' : 'text-zinc-400 hover:text-white'"
            class="px-6 py-2 rounded-xl text-xs font-black uppercase transition-all duration-300"
          >
            Categorías
          </button>
        </div>

        <div class="flex gap-3">
          <button @click="salir" class="p-2 w-10 h-10 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-red-400 transition-colors">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>

      <!-- SECCIÓN RESERVAS -->
      <div v-if="activeTab === 'reservas'">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-bold">Agenda de Citas</h2>
          <button @click="cargarReservas" :disabled="cargando" class="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold hover:border-neon-green/50 transition-all">
            <i class="fas fa-sync-alt" :class="{'animate-spin': cargando}"></i>
            {{ cargando ? 'Cargando...' : 'Actualizar' }}
          </button>
        </div>

        <!-- Estado vacío Reservas -->
        <div v-if="!cargando && reservas.length === 0" class="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
          <i class="fas fa-calendar-times text-4xl text-zinc-700 mb-4"></i>
          <p class="text-zinc-500 font-medium">No hay reservas registradas aún.</p>
        </div>

        <!-- Lista de Reservas -->
        <div v-if="!cargando && reservas.length > 0">
          <div v-for="(grupo, fecha) in reservasPorFecha" :key="fecha" class="mb-10">
            <div class="flex items-center gap-4 mb-4">
              <span class="bg-neon-green text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">{{ fecha }}</span>
              <div class="flex-1 h-px bg-zinc-800"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="r in grupo" :key="(r.fechaRaw || '') + (r.horaRaw || '') + (r.nombre || '')" class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4 hover:border-zinc-700 transition-all">
                <div class="w-16 h-16 bg-zinc-800 rounded-xl flex flex-col items-center justify-center border border-zinc-700 shrink-0">
                  <span class="text-xs font-black text-neon-green leading-none">{{ (r.horaRaw || '00:00 AM').split(' ')[0] }}</span>
                  <span class="text-[8px] font-bold text-zinc-500 uppercase">{{ (r.horaRaw || '00:00 AM').split(' ')[1] }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="font-bold text-sm truncate">{{ r.nombre }}</p>
                  <p class="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5">{{ r.servicio }}</p>
                  <p v-if="r.direccion" class="text-[9px] text-zinc-500 italic mt-1 line-clamp-1">📍 {{ r.direccion }}</p>
                  <div class="flex items-center gap-3 mt-3">
                    <a :href="`https://wa.me/57${cleanPhone(r.telefono)}`" target="_blank" class="text-[10px] font-black text-green-500 hover:text-green-400 flex items-center gap-1.5 uppercase">
                      <i class="fab fa-whatsapp text-xs"></i> WhatsApp
                    </a>
                    <a v-if="r.direccion" :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.direccion)}`" target="_blank" class="text-[10px] font-black text-neon-green hover:text-neon-green-dark flex items-center gap-1.5 uppercase">
                      <i class="fas fa-map-marker-alt text-xs"></i> Maps
                    </a>
                    <span :class="estadoClase(r.estado)" class="text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">
                      {{ r.estado }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN TIENDA -->
      <div v-if="activeTab === 'tienda'">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-lg font-bold">Inventario de Productos</h2>
            <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Gestiona el catálogo de la tienda</p>
          </div>
          <div class="flex gap-2">
            <button @click="cargarProductos" :disabled="cargando" class="flex items-center justify-center w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all">
              <i class="fas fa-sync-alt" :class="{'animate-spin': cargando}"></i>
            </button>
            <button @click="abrirModalProducto()" class="flex items-center gap-2 px-5 py-2.5 bg-neon-green text-black rounded-xl text-xs font-black uppercase hover:bg-neon-green-dark transition-all">
              <i class="fas fa-plus"></i>
              Nuevo Producto
            </button>
          </div>
        </div>

        <!-- Buscador y Filtro -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div class="relative group">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-green transition-colors"></i>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Buscar por nombre o marca..." 
              class="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-neon-green/50 transition-all"
            >
          </div>
          <div class="relative">
            <select 
              v-model="filterCategory" 
              class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-neon-green/50 appearance-none cursor-pointer"
            >
              <option value="all">Todas las categorías</option>
              <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
            </select>
            <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none text-xs"></i>
          </div>
        </div>

        <div v-if="cargando" class="flex flex-col items-center justify-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-neon-green mb-4"></div>
          <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest">Cargando catálogo...</p>
        </div>

        <!-- Error State Tienda -->
        <div v-if="errorMessage && !cargando" class="text-center py-20 bg-red-500/5 rounded-3xl border border-dashed border-red-500/20">
          <i class="fas fa-exclamation-circle text-4xl text-red-500/50 mb-4"></i>
          <p class="text-red-400 font-medium mb-2">Error de Conexión</p>
          <p class="text-zinc-500 text-xs">{{ errorMessage }}</p>
          <button @click="cargarProductos" class="mt-4 text-neon-green text-xs font-bold uppercase hover:underline">Reintentar</button>
        </div>

        <div v-else-if="filteredProducts.length === 0 && !cargando" class="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
          <i class="fas fa-search text-4xl text-zinc-700 mb-4"></i>
          <p class="text-zinc-500 font-medium">No se encontraron productos que coincidan.</p>
          <button v-if="searchQuery || filterCategory !== 'all'" @click="searchQuery = ''; filterCategory = 'all'" class="mt-4 text-neon-green text-xs font-bold uppercase hover:underline">Limpiar filtros</button>
        </div>

        <div v-else class="grid grid-cols-1 overflow-hidden border border-zinc-800 rounded-2xl bg-zinc-900/50">
          <div v-for="p in filteredProducts" :key="p.id" class="flex items-center p-4 gap-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors">
            <div class="w-12 h-12 bg-black rounded-lg overflow-hidden border border-zinc-800 shrink-0 uppercase flex items-center justify-center text-[8px] font-bold text-zinc-700">
              <img v-if="p.images && p.images.length > 0" :src="p.images[0]" :alt="p.name" class="w-full h-full object-cover">
              <span v-else>Sin foto</span>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-sm truncate">{{ p.name }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[9px] font-black text-neon-green uppercase px-1.5 py-0.5 bg-neon-green/10 rounded border border-neon-green/20">{{ p.category }}</span>
                <span class="text-zinc-500 text-[10px] font-bold">{{ formatPrice(p.price) }}</span>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="abrirModalProducto(p)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
                <i class="fas fa-edit text-xs"></i>
              </button>
              <button @click="borrarProducto(p.id)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                <i class="fas fa-trash-alt text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Agregar/Editar -->
        <transition name="fade">
          <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div class="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-black uppercase tracking-tight">{{ editando ? 'Editar' : 'Nuevo' }} Producto</h3>
                <button @click="showModal = false" class="text-zinc-500 hover:text-white">
                  <i class="fas fa-times"></i>
                </button>
              </div>

              <div class="space-y-4">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Nombre</label>
                    <input v-model="prodForm.name" type="text" class="input-modern" placeholder="Cera Nishman Gold">
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Precio (Solo números)</label>
                    <input v-model.number="prodForm.price" type="number" class="input-modern" placeholder="45000">
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Marca</label>
                    <input v-model="prodForm.brand" type="text" class="input-modern" placeholder="Nishman">
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Categoría</label>
                    <select v-model="prodForm.category" class="input-modern appearance-none">
                      <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
                    </select>
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Imágenes (URLs)</label>
                  <div v-for="(img, index) in prodForm.images" :key="index" class="flex gap-2">
                    <input v-model="prodForm.images[index]" type="text" class="input-modern flex-1" placeholder="/products/ejemplo.webp">
                    <button @click="abrirCloudinaryWidget('product', index)" class="px-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-neon-green hover:bg-zinc-700 transition" title="Subir Imagen">
                      <i class="fas fa-cloud-upload-alt"></i>
                    </button>
                    <button @click="prodForm.images.splice(index, 1)" class="p-2 text-zinc-500 hover:text-red-400">
                      <i class="fas fa-minus-circle"></i>
                    </button>
                  </div>
                  <button @click="prodForm.images.push('')" class="text-xs font-bold text-neon-green hover:underline flex items-center gap-2 pl-1">
                    <i class="fas fa-plus-circle"></i> Añadir otra imagen
                  </button>
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Descripción</label>
                  <textarea v-model="prodForm.description" rows="3" class="input-modern resize-none" placeholder="Breve descripción del producto..."></textarea>
                </div>
              </div>

              <button @click="guardarProducto" :disabled="guardando" class="w-full mt-8 py-4 bg-neon-green text-black font-black uppercase rounded-2xl hover:bg-neon-green-dark transition-all flex items-center justify-center gap-2">
                <i v-if="guardando" class="fas fa-spinner animate-spin"></i>
                {{ guardando ? 'Guardando...' : 'Guardar Producto' }}
              </button>
            </div>
          </div>
        </transition>
      </div>

      <!-- SECCIÓN CATEGORÍAS -->
      <div v-if="activeTab === 'categorias'">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-lg font-bold">Gestión de Categorías</h2>
            <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Administra las secciones de la tienda</p>
          </div>
          <button @click="abrirModalCategoria()" class="flex items-center gap-2 px-5 py-2.5 bg-neon-green text-black rounded-xl text-xs font-black uppercase hover:bg-neon-green-dark transition-all">
            <i class="fas fa-plus"></i>
            Nueva Categoría
          </button>
        </div>

        <div v-if="cargando" class="flex flex-col items-center justify-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-neon-green mb-4"></div>
          <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest">Cargando categorías...</p>
        </div>

        <div v-else class="grid grid-cols-1 overflow-hidden border border-zinc-800 rounded-2xl bg-zinc-900/50">
          <div v-for="c in categorias" :key="c.id" class="flex items-center p-4 gap-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors">
            <div class="w-10 h-10 rounded-lg flex items-center justify-center border border-zinc-800 shrink-0 overflow-hidden" :style="{ background: c.accent + '10', borderColor: c.accent + '30' }">
              <div v-if="isImageUrl(c.icon)" 
                   class="w-10 h-10"
                   :style="{ 
                     backgroundColor: c.accent, 
                     mask: `url('${c.icon}') no-repeat center / contain`,
                     WebkitMask: `url('${c.icon}') no-repeat center / contain`
                   }">
              </div>
              <i v-else :class="c.icon || 'fas fa-tag'" :style="{ color: c.accent }"></i>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-bold text-sm">{{ c.label }}</p>
              <div class="flex items-center gap-2 mt-0.5">
                <span class="text-[9px] text-zinc-500 uppercase font-bold">{{ c.id }}</span>
                <span v-if="c.comingSoon" class="text-[8px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded uppercase font-black">Próximamente</span>
                <span v-if="c.style === 'premium'" class="text-[8px] bg-pink-500/10 text-pink-500 px-1.5 py-0.5 rounded uppercase font-black border border-pink-500/20">Premium</span>
              </div>
            </div>
            <div class="flex gap-2">
              <button @click="abrirModalCategoria(c)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all">
                <i class="fas fa-edit text-xs"></i>
              </button>
              <button @click="borrarCategoria(c.id)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                <i class="fas fa-trash-alt text-xs"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Modal Categoría -->
        <transition name="fade">
          <div v-if="showCatModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <div class="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-black uppercase tracking-tight">{{ editandoCat ? 'Editar' : 'Nueva' }} Categoría</h3>
                <button @click="showCatModal = false" class="text-zinc-500 hover:text-white">
                  <i class="fas fa-times"></i>
                </button>
              </div>

              <div class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">ID (Slug)</label>
                    <input v-model="catForm.id" type="text" class="input-modern" placeholder="ceras" :disabled="editandoCat">
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Etiqueta</label>
                    <input v-model="catForm.label" type="text" class="input-modern" placeholder="Ceras & Pomadas">
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-1">
                    <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Color Acento</label>
                    <div class="flex gap-2">
                       <input v-model="catForm.accent" type="color" class="w-10 h-10 bg-transparent border-0 cursor-pointer p-0">
                       <input v-model="catForm.accent" type="text" class="input-modern text-center" placeholder="#facc15">
                    </div>
                  </div>
                  <div class="space-y-1">
                    <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Icono (FontAwesome)</label>
                    <input v-model="catForm.icon" type="text" class="input-modern" placeholder="fas fa-tag">
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Imagen de Portada (URL)</label>
                  <div class="flex gap-2">
                    <input v-model="catForm.cover" type="text" class="input-modern flex-1" placeholder="/products/portada.webp">
                    <button @click="abrirCloudinaryWidget('category')" class="px-4 bg-zinc-800 rounded-xl text-zinc-400 hover:text-neon-green hover:bg-zinc-700 transition" title="Subir Imagen">
                      <i class="fas fa-cloud-upload-alt"></i>
                    </button>
                  </div>
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Subtítulo (Opcional)</label>
                  <input v-model="catForm.subtitle" type="text" class="input-modern" placeholder="Próximamente">
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Departamento</label>
                  <select v-model="catForm.department" class="input-modern bg-zinc-800 text-white cursor-pointer w-full">
                    <option value="men">🧔 Para Él</option>
                    <option value="women">👩 Para Ella</option>
                    <option value="unisex">⚧️ Unisex / Global</option>
                  </select>
                </div>

                <div class="flex gap-6 pt-2">
                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div class="relative w-12 h-6 bg-zinc-800 rounded-full transition-all duration-300 group-hover:bg-zinc-700 shadow-inner" 
                         :class="{'bg-cyan-500/20 ring-2 ring-cyan-500/50': catForm.comingSoon}">
                      <div class="absolute top-1 left-1 w-4 h-4 bg-zinc-400 rounded-full transition-all duration-300 shadow-md" 
                           :class="{'translate-x-6 bg-neon-green-dark shadow-[0_0_10px_rgba(250,204,21,0.5)]': catForm.comingSoon}"></div>
                    </div>
                    <input type="checkbox" v-model="catForm.comingSoon" class="hidden">
                    <span class="text-[10px] font-black uppercase tracking-widest transition-colors duration-300"
                          :class="catForm.comingSoon ? 'text-cyan-400' : 'text-zinc-500'">Próximamente</span>
                  </label>

                  <label class="flex items-center gap-3 cursor-pointer group">
                    <div class="relative w-12 h-6 bg-zinc-800 rounded-full transition-all duration-300 group-hover:bg-zinc-700 shadow-inner" 
                         :class="{'bg-pink-500/20 ring-2 ring-pink-500/50': catForm.style === 'premium'}">
                      <div class="absolute top-1 left-1 w-4 h-4 bg-zinc-400 rounded-full transition-all duration-300 shadow-md" 
                           :class="{'translate-x-6 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]': catForm.style === 'premium'}"></div>
                    </div>
                    <input type="checkbox" :checked="catForm.style === 'premium'" @change="catForm.style = $event.target.checked ? 'premium' : 'default'" class="hidden">
                    <span class="text-[10px] font-black uppercase tracking-widest transition-colors duration-300"
                          :class="catForm.style === 'premium' ? 'text-pink-500' : 'text-zinc-500'">Estilo Premium</span>
                  </label>
                </div>
              </div>

              <button @click="guardarCategoria" :disabled="guardandoCat" class="w-full mt-8 py-4 bg-neon-green text-black font-black uppercase rounded-2xl hover:bg-neon-green-dark transition-all flex items-center justify-center gap-2">
                <i v-if="guardandoCat" class="fas fa-spinner animate-spin"></i>
                {{ guardandoCat ? 'Guardando...' : 'Guardar Categoría' }}
              </button>
            </div>
          </div>
        </transition>
      </div>

    </div>
  </div>
</template>

<script>
import { formatPrice } from '@/utils/format.js'

// El PIN ahora se maneja vía variables de entorno VUE_APP_ADMIN_PIN

export default {
  name: 'AdminPanel',
  data() {
    return {
      autenticado: false,
      pinIngresado: '',
      activeTab: 'reservas',
      pinError: false,
      cargando: false,
      guardando: false,
      reservas: [],
      productos: [],
      categorias: [],
      searchQuery: '',
      filterCategory: 'all',
      errorMessage: null,
      showModal: false,
      editando: false,
      showCatModal: false,
      editandoCat: false,
      guardandoCat: false,
      prodForm: {
        id: null,
        name: '',
        brand: '',
        category: '',
        description: '',
        price: '',
        images: ['']
      },
      catForm: {
        id: '',
        label: '',
        subtitle: '',
        cover: '',
        accent: '#39FF14',
        comingSoon: false,
        icon: 'fas fa-tag',
        style: 'default',
        department: 'men'
      }
    }
  },
  mounted() {
    const pinSesion = sessionStorage.getItem('admin_pin');
    if (pinSesion) {
      this.pinIngresado = pinSesion;
      this.verificarPin();
    }
  },
  watch: {
    activeTab(newTab) {
      if (this.autenticado) {
        if (newTab === 'tienda') this.cargarProductos();
        else if (newTab === 'reservas') this.cargarReservas();
        else if (newTab === 'categorias') this.cargarCategorias();
      }
    }
  },
  computed: {
    reservasPorFecha() {
      const grupos = {};
      const ordenadas = [...this.reservas].sort((a, b) => {
        if (a.fechaRaw < b.fechaRaw) return -1;
        if (a.fechaRaw > b.fechaRaw) return 1;
        return this.a24h(a.horaRaw) - this.a24h(b.horaRaw);
      });
      ordenadas.forEach(r => {
        const f = r.fechaRaw || 'Sin fecha';
        if (!grupos[f]) grupos[f] = [];
        grupos[f].push(r);
      });
      return grupos;
    },
    filteredProducts() {
      return this.productos.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                             (p.brand && p.brand.toLowerCase().includes(this.searchQuery.toLowerCase()));
        const matchesCategory = this.filterCategory === 'all' || p.category === this.filterCategory;
        return matchesSearch && matchesCategory;
      });
    }
  },
  methods: {
    formatPrice,
    verificarPin() {
      if (this.pinIngresado === process.env.VUE_APP_ADMIN_PIN) {
        this.autenticado = true;
        this.pinError = false;
        sessionStorage.setItem('admin_pin', this.pinIngresado);
        if (this.activeTab === 'reservas') this.cargarReservas();
        else if (this.activeTab === 'tienda') this.cargarProductos();
        else if (this.activeTab === 'categorias') this.cargarCategorias();
        
        // Cargar categorías siempre para los dropdowns
        if (this.activeTab !== 'categorias') this.cargarCategorias();
      } else {
        this.pinError = true;
        this.pinIngresado = '';
        sessionStorage.removeItem('admin_pin');
      }
    },
    salir() {
      this.autenticado = false;
      this.pinIngresado = '';
      sessionStorage.removeItem('admin_pin');
    },
    async cargarReservas() {
      this.cargando = true;
      try {
        const url = `/api/list_reservations?token=${this.pinIngresado}`;
        
        const res = await fetch(url);
        const data = await res.json();
        if (data.ok) this.reservas = data.reservas;
      } catch (e) {
        console.error('Error cargando reservas:', e);
      } finally {
        this.cargando = false;
      }
    },
    async cargarProductos() {
      this.cargando = true;
      this.errorMessage = null;
      try {
        const url = '/api/get_products';

        const res = await fetch(url);
        const contentType = res.headers.get('content-type');

        if (!res.ok) {
          const text = await res.text();
          this.errorMessage = `Error ${res.status}: ${text.substring(0, 40)}`;
          return;
        }

        if (!contentType || !contentType.includes('application/json')) {
          this.errorMessage = 'El servidor devolvió HTML en lugar de datos (Posible error de despliegue)';
          return;
        }

        const data = await res.json();
        if (data.ok) {
          this.productos = (data.products || []).sort((a, b) => (a.id || 0) - (b.id || 0));
        } else {
          this.errorMessage = data.error || 'Error al obtener productos';
        }
      } catch (e) {
        this.errorMessage = 'No se pudo conectar con el servidor';
        console.error('Error cargando productos:', e);
      } finally {
        this.cargando = false;
      }
    },
    abrirModalProducto(p = null) {
      if (p) {
        this.editando = true;
        this.prodForm = { ...p, images: p.images && p.images.length > 0 ? [...p.images] : [''] };
      } else {
        this.editando = false;
        const nextId = this.productos.length > 0 ? Math.max(...this.productos.map(pr => pr.id)) : 1;
        this.prodForm = { id: nextId + 1, name: '', brand: '', category: 'ceras', description: '', price: '', images: [''] };
      }
      this.showModal = true;
    },
    async guardarProducto() {
      this.guardando = true;
      try {
        const url = `/api/manage_products?token=${this.pinIngresado}`;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': this.pinIngresado 
          },
          body: JSON.stringify(this.prodForm)
        });
        const data = await res.json();
        if (data.ok) {
          this.showModal = false;
          this.cargarProductos();
        } else {
          alert('Error: ' + data.error);
        }
      } catch (e) {
        alert('Error conectando con el servidor');
      } finally {
        this.guardando = false;
      }
    },
    async borrarProducto(id) {
      if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
      try {
        const url = `/api/manage_products?id=${id}&token=${this.pinIngresado}`;

        const res = await fetch(url, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (data.ok) this.cargarProductos();
      } catch (e) {
        alert('Error al eliminar');
      }
    },
    async cargarCategorias() {
      this.cargando = true;
      try {
        const url = '/api/get_categories';
        const res = await fetch(url);
        const data = await res.json();
        if (data.ok) this.categorias = data.categories;
      } catch (e) {
        console.error('Error cargando categorías:', e);
      } finally {
        this.cargando = false;
      }
    },
    abrirCloudinaryWidget(tipo, index = null) {
      window.cloudinary.createUploadWidget({
        cloudName: 'dtgjwuclv',
        uploadPreset: 'imagesPersonalBarber',
        sources: ['local', 'camera', 'url'],
        multiple: false,
        folder: 'personalbarber_assets'
      }, (error, result) => {
        if (!error && result && result.event === "success") {
          const imageUrl = result.info.secure_url;
          if (tipo === 'product') {
            this.prodForm.images[index] = imageUrl;
          } else if (tipo === 'category') {
            this.catForm.cover = imageUrl;
          }
        }
      }).open();
    },
    abrirModalCategoria(c = null) {
      if (c) {
        this.editandoCat = true;
        this.catForm = { ...c };
      } else {
        this.editandoCat = false;
        this.catForm = { id: '', label: '', subtitle: '', cover: '', accent: '#39FF14', comingSoon: false, icon: 'fas fa-tag', style: 'default', department: 'men' };
      }
      this.showCatModal = true;
    },
    async guardarCategoria() {
      if (!this.catForm.id || !this.catForm.label) return alert('ID y Etiqueta son obligatorios');
      this.guardandoCat = true;
      try {
        const url = `/api/manage_categories?token=${this.pinIngresado}`;

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.catForm)
        });
        const data = await res.json();
        if (data.ok) {
          this.showCatModal = false;
          this.cargarCategorias();
        } else {
          alert('Error: ' + data.error);
        }
      } catch (e) {
        alert('Error conectando con el servidor');
      } finally {
        this.guardandoCat = false;
      }
    },
    async borrarCategoria(id) {
      if (!confirm('¿Seguro que quieres eliminar esta categoría? Esto no borrará los productos, pero quedarán sin categoría asignada.')) return;
      try {
        const url = `/api/manage_categories?id=${id}&token=${this.pinIngresado}`;

        const res = await fetch(url, { method: 'DELETE' });
        const data = await res.json();
        if (data.ok) this.cargarCategorias();
      } catch (e) {
        alert('Error al eliminar');
      }
    },
    cleanPhone(tel) {
      return tel.replace(/[\s\-+]/g,'').replace(/^57/,'');
    },
    estadoClase(estado) {
      const mapa = {
        pendiente: 'bg-orange-500/10 text-orange-400 border border-orange-500/20',
        confirmada: 'bg-green-500/10 text-green-500 border border-green-500/20',
        cancelada: 'bg-red-500/10 text-red-500 border border-red-500/20'
      };
      return mapa[estado] || 'bg-zinc-800 text-zinc-400';
    },
    a24h(horaStr) {
      if (!horaStr) return 0;
      const [time, period] = horaStr.split(' ');
      let [h, m] = time.split(':').map(Number);
      if (period === 'PM' && h !== 12) h += 12;
      if (period === 'AM' && h === 12) h = 0;
      return h * 60 + m;
    }
  }
}
</script>

<style scoped>
.input-modern {
  width: 100%;
  background: #18181b;
  border: 1px solid #27272a;
  border-radius: 1rem;
  padding: 0.75rem 1rem;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  outline: none;
  transition: all 0.3s;
}
.input-modern:focus {
  border-color: #d4af37;
  background: #27272a;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
