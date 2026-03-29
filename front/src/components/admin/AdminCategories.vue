<template>
  <div>
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

    <div :class="{'opacity-40 pointer-events-none transition-opacity duration-500': cargando}">
      <div class="grid grid-cols-1 overflow-hidden border border-zinc-800 rounded-2xl bg-zinc-900/50">
      <div v-for="c in categorias" :key="c.id" class="flex items-center p-4 gap-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors">
        <div class="w-10 h-10 rounded-lg flex items-center justify-center border border-zinc-800 shrink-0 overflow-hidden relative" :style="{ background: c.accent + '10', borderColor: c.accent + '30' }">
          <div v-if="isImageUrl(c.icon)" 
               class="w-full h-full"
               :style="{ 
                 backgroundColor: c.accent, 
                 mask: `url('${c.icon.replace('.png', '.webp')}') no-repeat center / contain`,
                 WebkitMask: `url('${c.icon.replace('.png', '.webp')}') no-repeat center / contain`
               }">
          </div>
          <i v-else :class="c.icon || 'fas fa-tag'" :style="{ color: c.accent }"></i>
          <!-- Fallback si la máscara falla o no hay nada -->
          <div v-if="isImageUrl(c.icon)" class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
             <i class="fas fa-image text-[8px]"></i>
          </div>
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
                <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Icono (FA o URL)</label>
                <div class="flex gap-2">
                   <input v-model="catForm.icon" type="text" class="input-modern" placeholder="fas fa-tag o /icons/gorra.webp">
                   <div v-if="catForm.icon" class="w-10 h-10 rounded-lg border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden bg-black">
                      <div v-if="isImageUrl(catForm.icon)" 
                           class="w-6 h-6"
                           :style="{ 
                             backgroundColor: catForm.accent, 
                             mask: `url('${catForm.icon.replace('.png', '.webp')}') no-repeat center / contain`,
                             WebkitMask: `url('${catForm.icon.replace('.png', '.webp')}') no-repeat center / contain`
                           }">
                      </div>
                      <i v-else :class="catForm.icon" :style="{ color: catForm.accent }"></i>
                   </div>
                </div>
              </div>
            </div>

            <div class="space-y-1">
              <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Imagen de Portada (URL)</label>
              <div class="flex gap-2">
                <input v-model="catForm.cover" type="text" class="input-modern flex-1" placeholder="/products/portada.webp">
                <button @click="abrirCloudinaryWidget()" class="px-4 bg-zinc-800 rounded-xl text-zinc-400 hover:text-neon-green hover:bg-zinc-700 transition" title="Subir Imagen">
                  <i class="fas fa-cloud-upload-alt"></i>
                </button>
              </div>
              <!-- Preview de portada de categoría -->
              <div v-if="catForm.cover && isImageUrl(catForm.cover)" class="mt-2 pl-1 fade-in">
                <img :src="optimizeImage(catForm.cover)" class="w-full h-32 object-cover rounded-2xl border border-zinc-800 shadow-lg mt-1" alt="Preview">
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
</template>

<script>
import { optimizeImage } from '@/utils/image.js'

export default {
  name: 'AdminCategories',
  props: {
    adminPin: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      cargando: false,
      categorias: [],
      showCatModal: false,
      editandoCat: false,
      guardandoCat: false,
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
    this.cargarCategorias()
  },
  methods: {
    optimizeImage,
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
        const url = `/api/manage_categories?token=${this.adminPin}`;
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
        const url = `/api/manage_categories?id=${id}&token=${this.adminPin}`;
        const res = await fetch(url, { method: 'DELETE' });
        const data = await res.json();
        if (data.ok) this.cargarCategorias();
      } catch (e) {
        alert('Error al eliminar');
      }
    },
    isImageUrl(url) {
      if (!url) return false;
      const u = url.toLowerCase();
      return u.startsWith('/') || u.startsWith('http') || u.endsWith('.svg') || u.endsWith('.png') || u.endsWith('.webp') || u.endsWith('.jpg') || u.endsWith('.jpeg');
    },
    abrirCloudinaryWidget() {
      const openWidget = () => {
        window.cloudinary.createUploadWidget({
          cloudName: 'dtgjwuclv',
          uploadPreset: 'imagesPersonalBarber',
          sources: ['local', 'camera', 'url'],
          multiple: false,
          folder: 'personalbarber_assets/categories'
        }, (error, result) => {
          if (!error && result && result.event === "success") {
            this.catForm.cover = result.info.secure_url;
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
