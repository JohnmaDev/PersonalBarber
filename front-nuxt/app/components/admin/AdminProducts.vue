<template>
  <div>
    <!-- Header de Filtros y Acciones Fijo (Sticky) -->
    <div class="sticky top-[72px] z-40 bg-black/95 backdrop-blur-md pt-2 pb-4 -mx-2 px-2 border-b border-zinc-800/80 mb-6 shadow-2xl transition-all">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h2 class="text-lg font-bold">Inventario de Productos</h2>
          <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Gestiona el catálogo de la tienda</p>
        </div>
        <div class="flex gap-2">
          <button @click="cargarProductos" :disabled="cargando" class="flex items-center justify-center w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all group">
            <span :class="{'animate-spin text-neon-green': cargando, 'text-zinc-500 group-hover:text-white transition-colors duration-300': !cargando}" class="flex items-center justify-center w-4 h-4">
              <fa-icon :icon="['fas', 'sync-alt']"  />
            </span>
          </button>
          <button @click="abrirModalProducto()" class="flex items-center gap-2 px-5 py-2.5 bg-neon-green text-black rounded-xl text-xs font-black uppercase hover:bg-neon-green-dark transition-all shadow-[0_0_15px_rgba(57,255,20,0.2)]">
            <fa-icon :icon="['fas', 'plus']"  />
            Nuevo Producto
          </button>
        </div>
      </div>

      <!-- Buscador y Filtros (5 columnas) -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <div class="relative group">
          <fa-icon :icon="['fas', 'search']" class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-green transition-colors pointer-events-none" />
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar por nombre o marca..." 
            class="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 transition-all placeholder:text-zinc-600"
          >
        </div>
        
        <!-- Selector de Categorías -->
        <div class="relative group">
          <fa-icon :icon="['fas', 'layer-group']" class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-green transition-colors pointer-events-none" />
          <select 
            v-model="filterCategory" 
            class="w-full pl-11 pr-10 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 appearance-none cursor-pointer group-hover:border-zinc-700 transition-all"
          >
            <option value="all">Todas las Categorías</option>
            <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
          </select>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <fa-icon :icon="['fas', 'chevron-down']" class="text-[10px] text-zinc-500 group-focus-within:text-neon-green transition-colors" />
          </div>
        </div>

        <!-- Selector de Marcas -->
        <div class="relative group">
          <fa-icon :icon="['fas', 'tag']" class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-green transition-colors pointer-events-none" />
          <select 
            v-model="filterBrand" 
            class="w-full pl-11 pr-10 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 appearance-none cursor-pointer group-hover:border-zinc-700 transition-all"
          >
            <option value="all">Todas las Marcas</option>
            <option v-for="b in availableBrands" :key="b" :value="b">{{ b }}</option>
          </select>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <fa-icon :icon="['fas', 'chevron-down']" class="text-[10px] text-zinc-500 group-focus-within:text-neon-green transition-colors" />
          </div>
        </div>

        <!-- Selector de Estado / Stock -->
        <div class="relative group">
          <fa-icon :icon="['fas', 'boxes']" class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-green transition-colors pointer-events-none" />
          <select 
            v-model="filterStock" 
            class="w-full pl-11 pr-10 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 appearance-none cursor-pointer group-hover:border-zinc-700 transition-all"
          >
            <option value="all">Cualquier Stock</option>
            <option value="in_stock">En Stock (> 0)</option>
            <option value="low_stock">Pocas Unidades (≤ 3)</option>
            <option value="out_of_stock">Agotados (0)</option>
          </select>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <fa-icon :icon="['fas', 'chevron-down']" class="text-[10px] text-zinc-500 group-focus-within:text-neon-green transition-colors" />
          </div>
        </div>

        <!-- Selector de Visibilidad (Publicado / Oculto) -->
        <div class="relative group">
          <fa-icon :icon="['fas', 'eye']" class="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-green transition-colors pointer-events-none" />
          <select 
            v-model="filterVisibility" 
            class="w-full pl-11 pr-10 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 appearance-none cursor-pointer group-hover:border-zinc-700 transition-all"
          >
            <option value="all">Todas las Visibilidades</option>
            <option value="visible">Solo Visibles</option>
            <option value="hidden">Solo Ocultos (Borrador)</option>
          </select>
          <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <fa-icon :icon="['fas', 'chevron-down']" class="text-[10px] text-zinc-500 group-focus-within:text-neon-green transition-colors" />
          </div>
        </div>
      </div>
    </div>

    <div :class="{'opacity-40 pointer-events-none transition-opacity duration-500': cargando}">
      <!-- Error State Tienda -->
      <div v-if="errorMessage" class="text-center py-20 bg-red-500/5 rounded-3xl border border-dashed border-red-500/20">
        <fa-icon :icon="['fas', 'exclamation-circle']" class="text-4xl text-red-500/50 mb-4" />
        <p class="text-red-400 font-medium mb-2">Error de Conexión</p>
        <p class="text-zinc-500 text-xs">{{ errorMessage }}</p>
        <button @click="cargarProductos" class="mt-4 text-neon-green text-xs font-bold uppercase hover:underline">Reintentar</button>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
        <fa-icon :icon="['fas', 'search']" class="text-4xl text-zinc-700 mb-4" />
        <p class="text-zinc-500 font-medium">No se encontraron productos que coincidan con los filtros.</p>
        <button v-if="searchQuery || filterCategory !== 'all' || filterBrand !== 'all' || filterStock !== 'all' || filterVisibility !== 'all'" @click="searchQuery = ''; filterCategory = 'all'; filterBrand = 'all'; filterStock = 'all'; filterVisibility = 'all'" class="mt-4 text-neon-green text-xs font-bold uppercase hover:underline">Limpiar todos los filtros</button>
      </div>

      <div v-else class="grid grid-cols-1 overflow-hidden border border-zinc-800 rounded-2xl bg-zinc-900/50">
      <div v-for="p in filteredProducts" :key="p.id" class="flex items-center p-4 gap-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors">
        <div class="w-12 h-12 bg-black rounded-lg overflow-hidden border border-zinc-800 shrink-0 uppercase flex items-center justify-center text-[8px] font-bold text-zinc-700">
          <img v-if="p.images && p.images.length > 0 && p.images[0]" :src="optimizeImage(p.images[0])" :alt="p.name" class="w-full h-full object-cover">
          <span v-else>Sin foto</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <p class="font-bold text-sm truncate">{{ p.name }}</p>
            <span 
              v-if="p.is_active === false" 
              class="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700 shrink-0 flex items-center gap-1"
            >
              <fa-icon :icon="['fas', 'eye-slash']" class="text-[8px]" /> Oculto
            </span>
          </div>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-[9px] font-black text-neon-green uppercase px-1.5 py-0.5 bg-neon-green/10 rounded border border-neon-green/20">{{ p.category }}</span>
            <span class="text-zinc-500 text-[10px] font-bold">{{ formatPrice(p.price) }}</span>
            <span 
              class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border"
              :class="p.stock > 3 ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : p.stock > 0 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'"
            >{{ p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado' }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <!-- Botón Rápido de Visibilidad (Interruptor instantáneo) -->
          <button 
            @click="toggleVisibilidad(p)" 
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border shrink-0"
            :class="p.is_active !== false ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white'"
            :title="p.is_active !== false ? 'Producto Visible. Haz clic para ocultar de la tienda.' : 'Producto Oculto. Haz clic para publicar en la tienda.'"
          >
            <fa-icon :icon="['fas', p.is_active !== false ? 'eye' : 'eye-slash']" class="text-xs" />
            <span class="hidden sm:inline text-[10px] uppercase font-black">{{ p.is_active !== false ? 'Visible' : 'Oculto' }}</span>
          </button>
          <button @click="abrirModalProducto(p)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all" title="Editar">
            <fa-icon :icon="['fas', 'edit']" class="text-xs" />
          </button>
          <button @click="borrarProducto(p.id)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Eliminar">
            <fa-icon :icon="['fas', 'trash-alt']" class="text-xs" />
          </button>
        </div>
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
              <fa-icon :icon="['fas', 'times']"  />
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
                <input v-model="prodForm.brand" list="brands-datalist" type="text" class="input-modern" placeholder="Ej: Wahl, Babyliss, Nishman">
                <datalist id="brands-datalist">
                  <option v-for="b in availableBrands" :key="b" :value="b" />
                </datalist>
              </div>
              <div class="space-y-1">
                <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Categoría</label>
                <select v-model="prodForm.category" class="input-modern appearance-none">
                  <option v-for="cat in sortedCategorias" :key="cat.id" :value="cat.id">
                    {{ cat.department === 'women' ? '👩 [Para Ella]' : cat.department === 'unisex' ? '⚡ [Unisex]' : '🧔 [Para Él]' }} — {{ cat.label }}
                  </option>
                </select>
              </div>
            </div>

            <div class="space-y-3">
              <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Imágenes (URLs)</label>
              <div v-for="(img, index) in prodForm.images" :key="index" class="space-y-2">
                <div class="flex gap-2">
                  <input v-model="prodForm.images[index]" type="text" class="input-modern flex-1" placeholder="/products/ejemplo.webp">
                  <button @click="abrirCloudinaryWidget(index)" class="px-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-neon-green hover:bg-zinc-700 transition" title="Subir Imagen">
                    <fa-icon :icon="['fas', 'cloud-upload-alt']"  />
                  </button>
                  <button v-if="prodForm.images.length > 1" @click="prodForm.images.splice(index, 1)" class="p-2 text-zinc-500 hover:text-red-400">
                    <fa-icon :icon="['fas', 'minus-circle']"  />
                  </button>
                </div>
                <!-- Preview de imagen del producto -->
                <div v-if="img && isImageUrl(img)" class="mt-1 pl-1 fade-in">
                  <img :src="optimizeImage(img)" class="w-20 h-20 object-cover rounded-xl border border-zinc-800 shadow-lg" alt="Preview">
                </div>
              </div>
              <button @click="prodForm.images.push('')" class="text-xs font-bold text-neon-green hover:underline flex items-center gap-2 pl-1">
                <fa-icon :icon="['fas', 'plus-circle']"  /> Añadir otra imagen
              </button>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Descripción</label>
              <textarea v-model="prodForm.description" rows="3" class="input-modern resize-none" placeholder="Breve descripción del producto..."></textarea>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Modo de Uso</label>
              <textarea v-model="prodForm.usage" rows="3" class="input-modern resize-none" placeholder="Instrucciones sobre cómo usar el producto..."></textarea>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Stock disponible</label>
              <input v-model.number="prodForm.stock" type="number" min="0" class="input-modern" placeholder="10">
            </div>

            <!-- Visibilidad en la Tienda (Switch) -->
            <div class="flex items-center justify-between p-4 bg-zinc-950 border border-zinc-800 rounded-2xl mt-4">
              <div>
                <p class="text-xs font-bold text-white flex items-center gap-2">
                  <fa-icon :icon="['fas', prodForm.is_active ? 'eye' : 'eye-slash']" :class="prodForm.is_active ? 'text-neon-green' : 'text-zinc-500'" />
                  Visibilidad en la Tienda
                </p>
                <p class="text-[10px] text-zinc-500 font-medium mt-0.5">
                  {{ prodForm.is_active ? 'El producto aparecerá visible en el catálogo de clientes.' : 'El producto estará OCULTO del catálogo (Modo borrador).' }}
                </p>
              </div>
              <label class="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                <input type="checkbox" v-model="prodForm.is_active" class="sr-only peer">
                <div class="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green"></div>
              </label>
            </div>
          </div>

          <button @click="guardarProducto" :disabled="guardando" class="w-full mt-8 py-4 bg-neon-green text-black font-black uppercase rounded-2xl hover:bg-neon-green-dark transition-all flex items-center justify-center gap-2">
            <fa-icon v-if="guardando" :icon="['fas', 'spinner']" class="animate-spin mr-2" />
            {{ guardando ? 'Guardando...' : 'Guardar Producto' }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { formatPrice } from '~/utils/format.js'
import { optimizeImage } from '~/utils/image.js'
import { useCatalog } from '~/composables/useCatalog'

export default {
  name: 'AdminProducts',
  props: {
    adminPin: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      cargando: false,
      guardando: false,
      productos: [],
      categorias: [],
      searchQuery: '',
      filterCategory: 'all',
      filterBrand: 'all',
      filterStock: 'all',
      filterVisibility: 'all',
      errorMessage: null,
      showModal: false,
      editando: false,
      prodForm: {
        id: null,
        name: '',
        brand: '',
        category: '',
        description: '',
        usage: '',
        price: '',
        images: [''],
        stock: 0,
        is_active: true
      }
    }
  },
  mounted() {
    this.cargarCategorias()
    this.cargarProductos()
  },
  computed: {
    sortedCategorias() {
      if (!this.categorias || !this.categorias.length) return [];
      const deptOrder = { men: 1, unisex: 2, women: 3 };
      return [...this.categorias].sort((a, b) => {
        const orderA = deptOrder[a.department] || 99;
        const orderB = deptOrder[b.department] || 99;
        if (orderA !== orderB) return orderA - orderB;
        return (a.label || '').localeCompare(b.label || '');
      });
    },
    availableBrands() {
      const brands = this.productos.map(p => p.brand ? p.brand.trim() : '').filter(Boolean);
      return [...new Set(brands)].sort();
    },
    filteredProducts() {
      return this.productos.filter(p => {
        const matchesSearch = !this.searchQuery || p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                             (p.brand && p.brand.toLowerCase().includes(this.searchQuery.toLowerCase()));
        const matchesCategory = this.filterCategory === 'all' || p.category === this.filterCategory;
        const matchesBrand = this.filterBrand === 'all' || (p.brand && p.brand.trim() === this.filterBrand);
        
        let matchesStock = true;
        if (this.filterStock === 'in_stock') matchesStock = (p.stock || 0) > 0;
        else if (this.filterStock === 'low_stock') matchesStock = (p.stock || 0) > 0 && (p.stock || 0) <= 3;
        else if (this.filterStock === 'out_of_stock') matchesStock = (p.stock || 0) <= 0;

        let matchesVisibility = true;
        const isActive = p.is_active !== false;
        if (this.filterVisibility === 'visible') matchesVisibility = isActive;
        else if (this.filterVisibility === 'hidden') matchesVisibility = !isActive;

        return matchesSearch && matchesCategory && matchesBrand && matchesStock && matchesVisibility;
      });
    }
  },
  methods: {
    formatPrice,
    optimizeImage,
    async cargarCategorias() {
      try {
        const url = '/api/get_categories';
        const res = await fetch(url);
        const data = await res.json();
        if (data.ok) this.categorias = data.categories;
      } catch (e) {
        console.error('Error cargando categorías:', e);
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
          this.errorMessage = 'El servidor devolvió HTML en lugar de datos';
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
        this.prodForm = { 
          ...p, 
          usage: p.usage || '',
          specs: p.specs || '',
          benefits: p.benefits ? [...p.benefits] : [],
          is_active: p.is_active !== false,
          images: p.images && p.images.length > 0 ? [...p.images] : [''] 
        };
      } else {
        this.editando = false;
        const nextId = this.productos.length > 0 ? Math.max(...this.productos.map(pr => pr.id)) : 1;
        const defaultCat = this.sortedCategorias.length ? this.sortedCategorias[0].id : (this.categorias.length ? this.categorias[0].id : '');
        this.prodForm = { 
          id: nextId + 1, 
          name: '', 
          brand: '', 
          category: defaultCat, 
          description: '', 
          usage: '', 
          specs: '',
          benefits: [],
          price: '', 
          stock: 0, 
          is_active: true,
          images: [''] 
        };
      }
      this.showModal = true;
    },
    async toggleVisibilidad(p) {
      const nuevoEstado = p.is_active === false ? true : false;
      const originalState = p.is_active;
      p.is_active = nuevoEstado;
      try {
        const url = `/api/manage_products`;
        const payload = {
          ...p,
          brand: p.brand ? p.brand.trim() : '',
          is_active: nuevoEstado
        };
        const res = await fetch(url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.adminPin}` 
          },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.ok) {
          useCatalog().invalidateCatalog();
        } else {
          p.is_active = originalState;
          alert('Error cambiando visibilidad: ' + (data.error || 'Desconocido'));
        }
      } catch (e) {
        p.is_active = originalState;
        alert('Error de conexión');
      }
    },
    async guardarProducto() {
      this.guardando = true;
      try {
        if (this.prodForm.brand) {
          this.prodForm.brand = this.prodForm.brand.trim();
        }
        this.prodForm.price = Number(this.prodForm.price) || 0;
        this.prodForm.stock = Number(this.prodForm.stock) || 0;

        const url = `/api/manage_products`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.adminPin}` 
          },
          body: JSON.stringify(this.prodForm)
        });
        const data = await res.json();
        if (data.ok) {
          this.showModal = false;
          this.cargarProductos();
          await useCatalog().invalidateCatalog();
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
        const url = `/api/manage_products?id=${encodeURIComponent(id)}`;
        const res = await fetch(url, { 
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${this.adminPin}`
          }
        });
        const data = await res.json();
        if (data.ok) {
          this.cargarProductos();
          useCatalog().invalidateCatalog();
        }
      } catch (e) {
        alert('Error al eliminar');
      }
    },
    isImageUrl(url) {
      if (!url) return false;
      const u = url.toLowerCase();
      return u.startsWith('/') || u.startsWith('http') || u.endsWith('.svg') || u.endsWith('.png') || u.endsWith('.webp') || u.endsWith('.jpg') || u.endsWith('.jpeg');
    },
    abrirCloudinaryWidget(index) {
      const openWidget = () => {
        window.cloudinary.createUploadWidget({
          cloudName: 'dtgjwuclv',
          uploadPreset: 'imagesPersonalBarber',
          sources: ['local', 'camera', 'url'],
          multiple: false,
          folder: 'personalbarber_assets/products'
        }, (error, result) => {
          if (!error && result && result.event === "success") {
            this.prodForm.images[index] = result.info.secure_url;
          }
        }).open();
      };

      if (window.cloudinary) {
        openWidget();
      } else {
        window.loadCloudinaryWidget && window.loadCloudinaryWidget();
        const poll = setInterval(() => {
          if (window.cloudinary) {
            clearInterval(poll);
            openWidget();
          }
        }, 200);
      }
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
