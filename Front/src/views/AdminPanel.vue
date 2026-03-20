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
        class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-center text-2xl tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 mb-4"
        @keyup.enter="verificarPin"
      >
      <p v-if="pinError" class="text-red-400 text-xs mb-3">PIN incorrecto</p>
      <button @click="verificarPin" class="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl hover:bg-yellow-400 transition-colors">
        Entrar
      </button>
    </div>

    <!-- Panel principal -->
    <div v-else class="w-full max-w-5xl">

      <!-- Header & Tabs -->
      <div class="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-black uppercase tracking-tighter">
            <span class="text-barber-gold">Admin</span> Panel
          </h1>
          <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Gestión Central de Barbería</p>
        </div>
        
        <div class="flex bg-zinc-900 p-1 rounded-2xl border border-zinc-800">
          <button 
            @click="activeTab = 'reservas'"
            :class="activeTab === 'reservas' ? 'bg-barber-gold text-black' : 'text-zinc-400 hover:text-white'"
            class="px-6 py-2 rounded-xl text-xs font-black uppercase transition-all duration-300"
          >
            Reservas
          </button>
          <button 
            @click="activeTab = 'tienda'"
            :class="activeTab === 'tienda' ? 'bg-barber-gold text-black' : 'text-zinc-400 hover:text-white'"
            class="px-6 py-2 rounded-xl text-xs font-black uppercase transition-all duration-300"
          >
            Tienda
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
          <button @click="cargarReservas" :disabled="cargando" class="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold hover:border-barber-gold/50 transition-all">
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
              <span class="bg-barber-gold text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">{{ fecha }}</span>
              <div class="flex-1 h-px bg-zinc-800"></div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-for="r in grupo" :key="(r.fechaRaw || '') + (r.horaRaw || '') + (r.nombre || '')" class="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex gap-4 hover:border-zinc-700 transition-all">
                <div class="w-16 h-16 bg-zinc-800 rounded-xl flex flex-col items-center justify-center border border-zinc-700 shrink-0">
                  <span class="text-xs font-black text-barber-gold leading-none">{{ (r.horaRaw || '00:00 AM').split(' ')[0] }}</span>
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
                    <a v-if="r.direccion" :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.direccion)}`" target="_blank" class="text-[10px] font-black text-barber-gold hover:text-yellow-400 flex items-center gap-1.5 uppercase">
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
            <button @click="abrirModalProducto()" class="flex items-center gap-2 px-5 py-2.5 bg-barber-gold text-black rounded-xl text-xs font-black uppercase hover:bg-yellow-400 transition-all">
              <i class="fas fa-plus"></i>
              Nuevo Producto
            </button>
          </div>
        </div>

        <!-- Buscador y Filtro -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div class="relative group">
            <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-barber-gold transition-colors"></i>
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Buscar por nombre o marca..." 
              class="w-full pl-10 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-barber-gold/50 transition-all"
            >
          </div>
          <div class="relative">
            <select 
              v-model="filterCategory" 
              class="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-barber-gold/50 appearance-none cursor-pointer"
            >
              <option value="all">Todas las categorías</option>
              <option value="ceras">Ceras & Pomadas</option>
              <option value="tratamientos">Tratamientos</option>
              <option value="maquinas">Equipos & Tecnología</option>
              <option value="combos">Combos</option>
              <option value="boutique">Boutique (Merch)</option>
            </select>
            <i class="fas fa-chevron-down absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none text-xs"></i>
          </div>
        </div>

        <div v-if="cargando" class="flex flex-col items-center justify-center py-20 bg-zinc-900/50 rounded-3xl border border-zinc-800">
          <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-barber-gold mb-4"></div>
          <p class="text-zinc-500 text-xs font-bold uppercase tracking-widest">Cargando catálogo...</p>
        </div>

        <!-- Error State Tienda -->
        <div v-if="errorMessage && !cargando" class="text-center py-20 bg-red-500/5 rounded-3xl border border-dashed border-red-500/20">
          <i class="fas fa-exclamation-circle text-4xl text-red-500/50 mb-4"></i>
          <p class="text-red-400 font-medium mb-2">Error de Conexión</p>
          <p class="text-zinc-500 text-xs">{{ errorMessage }}</p>
          <button @click="cargarProductos" class="mt-4 text-barber-gold text-xs font-bold uppercase hover:underline">Reintentar</button>
        </div>

        <div v-else-if="filteredProducts.length === 0 && !cargando" class="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
          <i class="fas fa-search text-4xl text-zinc-700 mb-4"></i>
          <p class="text-zinc-500 font-medium">No se encontraron productos que coincidan.</p>
          <button v-if="searchQuery || filterCategory !== 'all'" @click="searchQuery = ''; filterCategory = 'all'" class="mt-4 text-barber-gold text-xs font-bold uppercase hover:underline">Limpiar filtros</button>
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
                <span class="text-[9px] font-black text-barber-gold uppercase px-1.5 py-0.5 bg-barber-gold/10 rounded border border-barber-gold/20">{{ p.category }}</span>
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
                      <option value="ceras">Ceras</option>
                      <option value="tratamientos">Tratamientos</option>
                      <option value="maquinas">Equipos & Tecnología</option>
                      <option value="combos">Combos</option>
                      <option value="boutique">Boutique (Merch)</option>
                    </select>
                  </div>
                </div>

                <div class="space-y-3">
                  <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Imágenes (URLs)</label>
                  <div v-for="(img, index) in prodForm.images" :key="index" class="flex gap-2">
                    <input v-model="prodForm.images[index]" type="text" class="input-modern" placeholder="/products/ejemplo.webp">
                    <button @click="prodForm.images.splice(index, 1)" class="p-2 text-zinc-500 hover:text-red-400">
                      <i class="fas fa-minus-circle"></i>
                    </button>
                  </div>
                  <button @click="prodForm.images.push('')" class="text-xs font-bold text-barber-gold hover:underline flex items-center gap-2 pl-1">
                    <i class="fas fa-plus-circle"></i> Añadir otra imagen
                  </button>
                </div>

                <div class="space-y-1">
                  <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Descripción</label>
                  <textarea v-model="prodForm.description" rows="3" class="input-modern resize-none" placeholder="Breve descripción del producto..."></textarea>
                </div>
              </div>

              <button @click="guardarProducto" :disabled="guardando" class="w-full mt-8 py-4 bg-barber-gold text-black font-black uppercase rounded-2xl hover:bg-yellow-400 transition-all flex items-center justify-center gap-2">
                <i v-if="guardando" class="fas fa-spinner animate-spin"></i>
                {{ guardando ? 'Guardando...' : 'Guardar Producto' }}
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
      searchQuery: '',
      filterCategory: 'all',
      errorMessage: null,
      showModal: false,
      editando: false,
      prodForm: {
        id: null,
        name: '',
        brand: '',
        category: 'ceras',
        description: '',
        price: '',
        images: ['']
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
        else this.cargarProductos();
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
        const url = window.location.hostname === 'localhost' 
          ? `https://personalbarber.netlify.app/api/list_reservations?token=${this.pinIngresado}`
          : `/api/list_reservations?token=${this.pinIngresado}`;
        
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
        const url = window.location.hostname === 'localhost'
          ? 'https://personalbarber.netlify.app/api/get_products'
          : '/api/get_products';

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
        const url = window.location.hostname === 'localhost'
          ? `https://personalbarber.netlify.app/api/manage_products?token=${this.pinIngresado}`
          : `/api/manage_products?token=${this.pinIngresado}`;

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
        const url = window.location.hostname === 'localhost'
          ? `https://personalbarber.netlify.app/api/manage_products?id=${id}&token=${this.pinIngresado}`
          : `/api/manage_products?id=${id}&token=${this.pinIngresado}`;

        const res = await fetch(url, {
          method: 'DELETE'
        });
        const data = await res.json();
        if (data.ok) this.cargarProductos();
      } catch (e) {
        alert('Error al eliminar');
      }
    },
    cleanPhone(tel) {
      return tel.replace(/[\s\-+]/g,'').replace(/^57/,'');
    },
    estadoClase(estado) {
      const mapa = {
        pendiente: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20',
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
