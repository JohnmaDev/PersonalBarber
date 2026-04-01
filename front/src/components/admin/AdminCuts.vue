<template>
  <div>
    <div class="flex items-center justify-between mb-6 text-center sm:text-left flex-col sm:flex-row gap-4">
      <div>
        <h2 class="text-lg font-bold">Galería de Cortes</h2>
        <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Muestra tus mejores trabajos a los clientes</p>
      </div>
      <div class="flex gap-2">
        <button @click="cargarCortes" :disabled="cargando" class="flex items-center justify-center w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all group">
          <span :class="{'animate-spin text-neon-green': cargando, 'text-zinc-500 group-hover:text-white transition-colors duration-300': !cargando}" class="flex items-center justify-center w-4 h-4">
            <i class="fas fa-sync-alt"></i>
          </span>
        </button>
        <button @click="abrirModalCorte()" class="flex items-center gap-2 px-5 py-2.5 bg-neon-green text-black rounded-xl text-xs font-black uppercase hover:bg-neon-green-dark transition-all shadow-[0_5px_15px_rgba(57,255,20,0.2)]">
          <i class="fas fa-plus"></i>
          Nuevo Corte
        </button>
      </div>
    </div>

    <div :class="{'opacity-40 pointer-events-none transition-opacity duration-500': cargando}">
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div v-for="c in cortes" :key="c.id" class="group relative aspect-[3/4] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-neon-green/50 transition-all duration-300 shadow-lg">
          <img :src="optimizeImage(c.image)" :alt="c.style" class="w-full h-full object-cover">
          <div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
            <p class="text-[9px] font-black uppercase text-white truncate tracking-wider">{{ c.style }}</p>
          </div>
          <!-- Acciones Over -->
          <div class="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="abrirModalCorte(c)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-md text-white hover:text-neon-green transition-colors border border-white/5">
              <i class="fas fa-edit text-[10px]"></i>
            </button>
            <button @click="borrarCorte(c.id)" class="w-8 h-8 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-md text-white hover:text-red-400 transition-colors border border-white/5">
              <i class="fas fa-trash-alt text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>
      <div v-if="!cargando && cortes.length === 0" class="flex flex-col items-center justify-center py-24 text-center bg-zinc-900/50 rounded-[2.5rem] border border-dashed border-zinc-800">
        <div class="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
          <i class="fas fa-camera-retro text-4xl text-zinc-700"></i>
        </div>
        <h3 class="text-white font-bold mb-1">Tu galería está vacía</h3>
        <p class="text-zinc-500 font-bold uppercase text-[10px] tracking-widest">Añade fotos de tus trabajos para atraer más clientes</p>
      </div>
    </div>

    <!-- Modal Corte -->
    <transition name="fade">
      <div v-if="showCutModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
        <div class="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-md p-8 overflow-y-auto max-h-[90vh] shadow-2xl relative">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h3 class="text-2xl font-black uppercase tracking-tight">{{ editandoCut ? 'Editar' : 'Nuevo' }} Trabajo</h3>
              <p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">Configura los detalles de la foto</p>
            </div>
            <button @click="showCutModal = false" class="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-500 hover:text-white transition-colors">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="space-y-6">
            <div class="space-y-2">
              <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Foto del Trabajo (Cloudinary)</label>
              <div class="flex gap-2">
                <input v-model="cutForm.image" type="text" class="input-modern flex-1" placeholder="URL de la foto">
                <button @click="abrirCloudinaryWidget()" class="px-4 bg-zinc-800 rounded-2xl text-zinc-400 hover:text-neon-green hover:bg-zinc-700 transition" title="Subir Imagen">
                  <i class="fas fa-cloud-upload-alt"></i>
                </button>
              </div>
              <!-- Preview -->
              <div v-if="cutForm.image && isImageUrl(cutForm.image)" class="mt-4 aspect-[3/4] w-40 mx-auto rounded-3xl overflow-hidden border-2 border-zinc-800 shadow-2xl relative group">
                <img :src="optimizeImage(cutForm.image)" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <i class="fas fa-check-circle text-neon-green text-3xl"></i>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
              <div class="space-y-1">
                <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">Estilo / Título</label>
                <input v-model="cutForm.style" type="text" class="input-modern" placeholder="Ej: Buzz Cut · High Fade">
              </div>
              <div class="space-y-1">
                <label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1">TAG SEO (Opcional)</label>
                <input v-model="cutForm.alt" type="text" class="input-modern" placeholder="Ej: Degradado alto con barbero">
              </div>
            </div>
          </div>

          <button @click="guardarCorte" :disabled="guardandoCut" class="w-full mt-10 py-4 bg-neon-green text-black font-black uppercase rounded-2xl hover:bg-neon-green-dark shadow-[0_10px_30px_rgba(57,255,20,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-3 group">
            <i v-if="guardandoCut" class="fas fa-spinner animate-spin text-lg"></i>
            <i v-else class="fas fa-save text-lg group-hover:scale-110 transition-transform"></i>
            <span class="text-sm tracking-widest">{{ guardandoCut ? 'Guardando...' : 'Publicar en Galería' }}</span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { optimizeImage } from '@/utils/image.js'

export default {
  name: 'AdminCuts',
  props: {
    adminPin: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      cargando: false,
      showCutModal: false,
      editandoCut: false,
      guardandoCut: false,
      cortes: [],
      cutForm: {
        id: null,
        image: '',
        style: '',
        alt: ''
      }
    }
  },
  mounted() {
    this.cargarCortes()
  },
  methods: {
    optimizeImage,
    cargarCortes() {
      this.cargando = true;
      fetch('/api/get_cuts')
        .then(r => r.json())
        .then(data => {
          if (data.ok) this.cortes = data.cuts;
        })
        .finally(() => this.cargando = false);
    },
    abrirModalCorte(c = null) {
      if (c) {
        this.editandoCut = true;
        this.cutForm = { ...c };
      } else {
        this.editandoCut = false;
        this.cutForm = { 
          id: Date.now(), 
          image: '', 
          style: '', 
          alt: '' 
        };
      }
      this.showCutModal = true;
    },
    async guardarCorte() {
      if (!this.cutForm.image || !this.cutForm.style) return alert('Imagen y estilo son obligatorios');
      this.guardandoCut = true;
      try {
        const url = `/api/manage_cuts?token=${this.adminPin}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.cutForm)
        });
        const data = await res.json();
        if (data.ok) {
          this.showCutModal = false;
          this.cargarCortes();
        } else {
          alert('Error: ' + data.error);
        }
      } catch (e) {
        alert('Error conectando con el servidor');
      } finally {
        this.guardandoCut = false;
      }
    },
    async borrarCorte(id) {
      if (!confirm('¿Seguro que quieres eliminar esta foto de la galería?')) return;
      try {
        const url = `/api/manage_cuts?id=${id}&token=${this.adminPin}`;
        const res = await fetch(url, { method: 'DELETE' });
        const data = await res.json();
        if (data.ok) this.cargarCortes();
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
          folder: 'personalbarber_assets/customers'
        }, (error, result) => {
          if (!error && result && result.event === "success") {
            this.cutForm.image = result.info.secure_url;
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
