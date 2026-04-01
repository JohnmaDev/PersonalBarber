<template>
  <div>
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
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div class="relative group">
        <i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-green transition-colors pointer-events-none"></i>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Buscar productos..." 
          class="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 transition-all placeholder:text-zinc-600"
        >
      </div>
      
      <!-- Selector de Categorías Desplegable -->
      <div class="relative group">
        <i class="fas fa-layer-group absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-green transition-colors pointer-events-none"></i>
        <select 
          v-model="filterCategory" 
          class="w-full pl-11 pr-10 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 appearance-none cursor-pointer group-hover:border-zinc-700 transition-all"
        >
          <option value="all">Todas las Secciones</option>
          <option v-for="cat in categorias" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
        </select>
        <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <i class="fas fa-chevron-down text-[10px] text-zinc-500 group-focus-within:text-neon-green transition-colors"></i>
        </div>
      </div>
    </div>

    <div :class="{'opacity-40 pointer-events-none transition-opacity duration-500': cargando}">
      <!-- Error State Tienda -->
      <div v-if="errorMessage" class="text-center py-20 bg-red-500/5 rounded-3xl border border-dashed border-red-500/20">
        <i class="fas fa-exclamation-circle text-4xl text-red-500/50 mb-4"></i>
        <p class="text-red-400 font-medium mb-2">Error de Conexión</p>
        <p class="text-zinc-500 text-xs">{{ errorMessage }}</p>
        <button @click="cargarProductos" class="mt-4 text-neon-green text-xs font-bold uppercase hover:underline">Reintentar</button>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800">
        <i class="fas fa-search text-4xl text-zinc-700 mb-4"></i>
        <p class="text-zinc-500 font-medium">No se encontraron productos que coincidan.</p>
        <button v-if="searchQuery || filterCategory !== 'all'" @click="searchQuery = ''; filterCategory = 'all'" class="mt-4 text-neon-green text-xs font-bold uppercase hover:underline">Limpiar filtros</button>
      </div>

      <div v-else class="grid grid-cols-1 overflow-hidden border border-zinc-800 rounded-2xl bg-zinc-900/50">
      <div v-for="p in filteredProducts" :key="p.id" class="flex items-center p-4 gap-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors">
        <div class="w-12 h-12 bg-black rounded-lg overflow-hidden border border-zinc-800 shrink-0 uppercase flex items-center justify-center text-[8px] font-bold text-zinc-700">
          <img v-if="p.images && p.images.length > 0 && p.images[0]" :src="optimizeImage(p.images[0])" :alt="p.name" class="w-full h-full object-cover">
          <span v-else>Sin foto</span>
        </div>
        <div class="flex-1 min-w-0">
          <p class="font-bold text-sm truncate">{{ p.name }}</p>
          <div class="flex items-center gap-2 mt-0.5">
            <span class="text-[9px] font-black text-neon-green uppercase px-1.5 py-0.5 bg-neon-green/10 rounded border border-neon-green/20">{{ p.category }}</span>
            <span class="text-zinc-500 text-[10px] font-bold">{{ formatPrice(p.price) }}</span>
            <span 
              class="text-[9px] font-black uppercase px-1.5 py-0.5 rounded border"
              :class="p.stock > 3 ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20' : p.stock > 0 ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' : 'text-red-400 bg-red-400/10 border-red-400/20'"
            >{{ p.stock > 0 ? `Stock: ${p.stock}` : 'Agotado' }}</span>
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
              <div v-for="(img, index) in prodForm.images" :key="index" class="space-y-2">
                <div class="flex gap-2">
                  <input v-model="prodForm.images[index]" type="text" class="input-modern flex-1" placeholder="/products/ejemplo.webp">
                  <button @click="abrirCloudinaryWidget(index)" class="px-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-neon-green hover:bg-zinc-700 transition" title="Subir Imagen">
                    <i class="fas fa-cloud-upload-alt"></i>
                  </button>
                  <button v-if="prodForm.images.length > 1" @click="prodForm.images.splice(index, 1)" class="p-2 text-zinc-500 hover:text-red-400">
                    <i class="fas fa-minus-circle"></i>
                  </button>
                </div>
                <!-- Preview de imagen del producto -->
                <div v-if="img && isImageUrl(img)" class="mt-1 pl-1 fade-in">
                  <img :src="optimizeImage(img)" class="w-20 h-20 object-cover rounded-xl border border-zinc-800 shadow-lg" alt="Preview">
                </div>
              </div>
              <button @click="prodForm.images.push('')" class="text-xs font-bold text-neon-green hover:underline flex items-center gap-2 pl-1">
                <i class="fas fa-plus-circle"></i> Añadir otra imagen
              </button>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Descripción</label>
              <textarea v-model="prodForm.description" rows="3" class="input-modern resize-none" placeholder="Breve descripción del producto..."></textarea>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Stock disponible</label>
              <input v-model.number="prodForm.stock" type="number" min="0" class="input-modern" placeholder="10">
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
</template>

<script>
import { formatPrice } from '@/utils/format.js'
import { optimizeImage } from '@/utils/image.js'

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
      errorMessage: null,
      showModal: false,
      editando: false,
      prodForm: {
        id: null,
        name: '',
        brand: '',
        category: '',
        description: '',
        price: '',
        images: [''],
        stock: 0
      }
    }
  },
  mounted() {
    this.cargarCategorias()
    this.cargarProductos()
  },
  computed: {
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
        this.prodForm = { ...p, images: p.images && p.images.length > 0 ? [...p.images] : [''] };
      } else {
        this.editando = false;
        const nextId = this.productos.length > 0 ? Math.max(...this.productos.map(pr => pr.id)) : 1;
        this.prodForm = { id: nextId + 1, name: '', brand: '', category: this.categorias.length ? this.categorias[0].id : '', description: '', price: '', stock: 0, images: [''] };
      }
      this.showModal = true;
    },
    async guardarProducto() {
      this.guardando = true;
      try {
        const url = `/api/manage_products?token=${this.adminPin}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': this.adminPin 
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
        const url = `/api/manage_products?id=${id}&token=${this.adminPin}`;
        const res = await fetch(url, { method: 'DELETE' });
        const data = await res.json();
        if (data.ok) this.cargarProductos();
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
