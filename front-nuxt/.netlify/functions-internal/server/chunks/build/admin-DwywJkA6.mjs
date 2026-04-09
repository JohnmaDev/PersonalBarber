import { _ as __nuxt_component_1 } from './server.mjs';
import { defineComponent, ref, computed, useSSRContext } from 'vue';
import { ssrRenderComponent, ssrRenderAttrs, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrRenderStyle, ssrLooseContain, ssrLooseEqual } from 'vue/server-renderer';
import { _ as _export_sfc, u as useSeoMeta } from './_plugin-vue_export-helper-Bo5sx5t4.mjs';
import { f as formatPrice } from './format-CwTWAru-.mjs';
import { o as optimizeImage } from './image-CVwycW5b.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'consola';
import 'nuxtseo-shared/utils';
import 'fast-xml-parser';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import 'perfect-debounce';
import '@vue/shared';

const _sfc_main$4 = {
  name: "AdminReservations",
  props: {
    adminPin: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      cargando: false,
      reservas: [],
      showHistorial: false
    };
  },
  mounted() {
    this.cargarReservas();
  },
  computed: {
    proximasPorFecha() {
      const hoy = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const grupos = {};
      const ordenadas = [...this.reservas].filter((r) => (r.fechaRaw || "") >= hoy).sort((a, b) => {
        if (a.fechaRaw < b.fechaRaw) return -1;
        if (a.fechaRaw > b.fechaRaw) return 1;
        return this.a24h(a.horaRaw) - this.a24h(b.horaRaw);
      });
      ordenadas.forEach((r) => {
        const f = r.fechaRaw || "Sin fecha";
        if (!grupos[f]) grupos[f] = [];
        grupos[f].push(r);
      });
      return grupos;
    },
    historialPorFecha() {
      const hoy = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      const grupos = {};
      const ordenadas = [...this.reservas].filter((r) => (r.fechaRaw || "") < hoy).sort((a, b) => {
        if (a.fechaRaw > b.fechaRaw) return -1;
        if (a.fechaRaw < b.fechaRaw) return 1;
        return this.a24h(b.horaRaw) - this.a24h(a.horaRaw);
      });
      ordenadas.forEach((r) => {
        const f = r.fechaRaw || "Sin fecha";
        if (!grupos[f]) grupos[f] = [];
        grupos[f].push(r);
      });
      return grupos;
    },
    proximasCount() {
      const hoy = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      return this.reservas.filter((r) => (r.fechaRaw || "") >= hoy).length;
    },
    historialCount() {
      const hoy = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      return this.reservas.filter((r) => (r.fechaRaw || "") < hoy).length;
    }
  },
  methods: {
    async cargarReservas() {
      this.cargando = true;
      try {
        const url = `/api/list_reservations?token=${this.adminPin}`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.ok) this.reservas = data.reservas;
      } catch (e) {
        console.error("Error cargando reservas:", e);
      } finally {
        this.cargando = false;
      }
    },
    cleanPhone(tel) {
      if (!tel) return "";
      return tel.replace(/[\s\-+]/g, "").replace(/^57/, "");
    },
    estadoClase(estado) {
      const mapa = {
        pendiente: "bg-orange-500/10 text-orange-400 border border-orange-500/20",
        confirmada: "bg-green-500/10 text-green-500 border border-green-500/20",
        cancelada: "bg-red-500/10 text-red-500 border border-red-500/20"
      };
      return mapa[estado] || "bg-zinc-800 text-zinc-400";
    },
    a24h(horaStr) {
      if (!horaStr) return 0;
      const [time, period] = horaStr.split(" ");
      let [h, m] = time.split(":").map(Number);
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      return h * 60 + m;
    }
  }
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-13bdacfb><div class="flex items-center justify-between mb-6" data-v-13bdacfb><div data-v-13bdacfb><h2 class="text-lg font-bold" data-v-13bdacfb>Agenda de Citas</h2><p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-0.5" data-v-13bdacfb>${ssrInterpolate($options.proximasCount)} pr\xF3xima${ssrInterpolate($options.proximasCount !== 1 ? "s" : "")} \xB7 ${ssrInterpolate($options.historialCount)} en historial </p></div><button${ssrIncludeBooleanAttr($data.cargando) ? " disabled" : ""} class="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-bold hover:border-neon-green/50 transition-all group" data-v-13bdacfb><span class="${ssrRenderClass([{ "animate-spin text-neon-green": $data.cargando, "text-zinc-500 group-hover:text-white transition-colors duration-300": !$data.cargando }, "flex items-center justify-center w-4 h-4"])}" data-v-13bdacfb><i class="fas fa-sync-alt" data-v-13bdacfb></i></span><span data-v-13bdacfb>${ssrInterpolate($data.cargando ? "Cargando..." : "Actualizar")}</span></button></div><div class="${ssrRenderClass({ "opacity-40 pointer-events-none transition-opacity duration-500": $data.cargando })}" data-v-13bdacfb>`);
  if ($data.reservas.length === 0) {
    _push(`<div class="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800" data-v-13bdacfb><i class="fas fa-calendar-times text-4xl text-zinc-700 mb-4" data-v-13bdacfb></i><p class="text-zinc-500 font-medium" data-v-13bdacfb>No hay reservas registradas a\xFAn.</p></div>`);
  } else {
    _push(`<div data-v-13bdacfb><div class="mb-10" data-v-13bdacfb><div class="flex items-center gap-3 mb-5" data-v-13bdacfb><span class="w-2 h-2 rounded-full bg-neon-green shadow-[0_0_8px_rgba(57,255,20,0.6)]" data-v-13bdacfb></span><h3 class="text-sm font-black uppercase tracking-wider text-white" data-v-13bdacfb>Pr\xF3ximas Citas</h3><span class="text-[10px] bg-neon-green/10 text-neon-green border border-neon-green/20 px-2 py-0.5 rounded-full font-black" data-v-13bdacfb>${ssrInterpolate($options.proximasCount)}</span></div>`);
    if ($options.proximasCount === 0) {
      _push(`<div class="text-center py-12 bg-zinc-900/30 rounded-2xl border border-dashed border-zinc-800" data-v-13bdacfb><i class="fas fa-calendar-check text-3xl text-zinc-700 mb-3" data-v-13bdacfb></i><p class="text-zinc-500 text-sm" data-v-13bdacfb>Nada en agenda. \xA1Disfruta el d\xEDa!</p></div>`);
    } else {
      _push(`<div data-v-13bdacfb><!--[-->`);
      ssrRenderList($options.proximasPorFecha, (grupo, fecha) => {
        _push(`<div class="mb-8" data-v-13bdacfb><div class="flex items-center gap-4 mb-3" data-v-13bdacfb><span class="bg-neon-green text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter" data-v-13bdacfb>${ssrInterpolate(fecha)}</span><div class="flex-1 h-px bg-neon-green/20" data-v-13bdacfb></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-4" data-v-13bdacfb><!--[-->`);
        ssrRenderList(grupo, (r) => {
          _push(`<div class="bg-zinc-900 border border-zinc-800 hover:border-neon-green/30 rounded-2xl p-4 flex gap-4 transition-all" data-v-13bdacfb><div class="w-16 h-16 bg-zinc-800 rounded-xl flex flex-col items-center justify-center border border-neon-green/20 shrink-0" data-v-13bdacfb><span class="text-xs font-black text-neon-green leading-none" data-v-13bdacfb>${ssrInterpolate((r.horaRaw || "00:00 AM").split(" ")[0])}</span><span class="text-[8px] font-bold text-zinc-500 uppercase" data-v-13bdacfb>${ssrInterpolate((r.horaRaw || "00:00 AM").split(" ")[1])}</span></div><div class="flex-1 min-w-0" data-v-13bdacfb><p class="font-bold text-sm truncate" data-v-13bdacfb>${ssrInterpolate(r.nombre)}</p><p class="text-[10px] text-zinc-400 uppercase tracking-widest mt-0.5" data-v-13bdacfb>${ssrInterpolate(r.servicio)}</p>`);
          if (r.direccion) {
            _push(`<p class="text-[9px] text-zinc-500 italic mt-1 line-clamp-1" data-v-13bdacfb>\u{1F4CD} ${ssrInterpolate(r.direccion)}</p>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<div class="flex items-center gap-3 mt-3" data-v-13bdacfb><a${ssrRenderAttr("href", `https://wa.me/57${$options.cleanPhone(r.telefono)}`)} target="_blank" class="text-[10px] font-black text-green-500 hover:text-green-400 flex items-center gap-1.5 uppercase" data-v-13bdacfb><i class="fab fa-whatsapp text-xs" data-v-13bdacfb></i> WhatsApp </a>`);
          if (r.direccion) {
            _push(`<a${ssrRenderAttr("href", `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.direccion)}`)} target="_blank" class="text-[10px] font-black text-neon-green hover:text-neon-green-dark flex items-center gap-1.5 uppercase" data-v-13bdacfb><i class="fas fa-map-marker-alt text-xs" data-v-13bdacfb></i> Maps </a>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span class="${ssrRenderClass([$options.estadoClase(r.estado), "text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter"])}" data-v-13bdacfb>${ssrInterpolate(r.estado)}</span></div></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      });
      _push(`<!--]--></div>`);
    }
    _push(`</div>`);
    if ($options.historialCount > 0) {
      _push(`<div data-v-13bdacfb><button class="w-full flex items-center justify-between gap-3 mb-4 px-4 py-3 bg-zinc-900/60 border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-all group" data-v-13bdacfb><div class="flex items-center gap-3" data-v-13bdacfb><span class="w-2 h-2 rounded-full bg-zinc-600" data-v-13bdacfb></span><span class="text-xs font-black uppercase tracking-wider text-zinc-500 group-hover:text-zinc-400" data-v-13bdacfb>Historial de Citas Pasadas</span><span class="text-[10px] bg-zinc-800 text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded-full font-black" data-v-13bdacfb>${ssrInterpolate($options.historialCount)}</span></div><i class="${ssrRenderClass([$data.showHistorial ? "fa-chevron-up" : "fa-chevron-down", "fas text-zinc-600 text-xs transition-transform duration-300"])}" data-v-13bdacfb></i></button>`);
      if ($data.showHistorial) {
        _push(`<div class="opacity-60" data-v-13bdacfb><!--[-->`);
        ssrRenderList($options.historialPorFecha, (grupo, fecha) => {
          _push(`<div class="mb-6" data-v-13bdacfb><div class="flex items-center gap-4 mb-3" data-v-13bdacfb><span class="bg-zinc-700 text-zinc-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter" data-v-13bdacfb>${ssrInterpolate(fecha)}</span><div class="flex-1 h-px bg-zinc-800" data-v-13bdacfb></div></div><div class="grid grid-cols-1 md:grid-cols-2 gap-3" data-v-13bdacfb><!--[-->`);
          ssrRenderList(grupo, (r) => {
            _push(`<div class="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex gap-4" data-v-13bdacfb><div class="w-16 h-16 bg-zinc-800/50 rounded-xl flex flex-col items-center justify-center border border-zinc-700 shrink-0" data-v-13bdacfb><span class="text-xs font-black text-zinc-500 leading-none" data-v-13bdacfb>${ssrInterpolate((r.horaRaw || "00:00 AM").split(" ")[0])}</span><span class="text-[8px] font-bold text-zinc-600 uppercase" data-v-13bdacfb>${ssrInterpolate((r.horaRaw || "00:00 AM").split(" ")[1])}</span></div><div class="flex-1 min-w-0" data-v-13bdacfb><p class="font-bold text-sm truncate text-zinc-400" data-v-13bdacfb>${ssrInterpolate(r.nombre)}</p><p class="text-[10px] text-zinc-600 uppercase tracking-widest mt-0.5" data-v-13bdacfb>${ssrInterpolate(r.servicio)}</p><div class="flex items-center gap-3 mt-3" data-v-13bdacfb><a${ssrRenderAttr("href", `https://wa.me/57${$options.cleanPhone(r.telefono)}`)} target="_blank" class="text-[10px] font-black text-zinc-600 hover:text-zinc-400 flex items-center gap-1.5 uppercase" data-v-13bdacfb><i class="fab fa-whatsapp text-xs" data-v-13bdacfb></i> WhatsApp </a></div></div></div>`);
          });
          _push(`<!--]--></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  }
  _push(`</div></div>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminReservations.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const AdminReservations = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$3], ["__scopeId", "data-v-13bdacfb"]]), { __name: "AdminReservations" });
const intervalError = "[nuxt] `setInterval` should not be used on the server. Consider wrapping it with an `onNuxtReady`, `onBeforeMount` or `onMounted` lifecycle hook, or ensure you only call it in the browser by checking `false`.";
const setInterval = (() => {
  console.error(intervalError);
});
const _sfc_main$3 = {
  name: "AdminProducts",
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
      searchQuery: "",
      filterCategory: "all",
      errorMessage: null,
      showModal: false,
      editando: false,
      prodForm: {
        id: null,
        name: "",
        brand: "",
        category: "",
        description: "",
        price: "",
        images: [""],
        stock: 0
      }
    };
  },
  mounted() {
    this.cargarCategorias();
    this.cargarProductos();
  },
  computed: {
    filteredProducts() {
      return this.productos.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || p.brand && p.brand.toLowerCase().includes(this.searchQuery.toLowerCase());
        const matchesCategory = this.filterCategory === "all" || p.category === this.filterCategory;
        return matchesSearch && matchesCategory;
      });
    }
  },
  methods: {
    formatPrice,
    optimizeImage,
    async cargarCategorias() {
      try {
        const url = "/api/get_categories";
        const res = await fetch(url);
        const data = await res.json();
        if (data.ok) this.categorias = data.categories;
      } catch (e) {
        console.error("Error cargando categor\xEDas:", e);
      }
    },
    async cargarProductos() {
      this.cargando = true;
      this.errorMessage = null;
      try {
        const url = "/api/get_products";
        const res = await fetch(url);
        const contentType = res.headers.get("content-type");
        if (!res.ok) {
          const text = await res.text();
          this.errorMessage = `Error ${res.status}: ${text.substring(0, 40)}`;
          return;
        }
        if (!contentType || !contentType.includes("application/json")) {
          this.errorMessage = "El servidor devolvi\xF3 HTML en lugar de datos";
          return;
        }
        const data = await res.json();
        if (data.ok) {
          this.productos = (data.products || []).sort((a, b) => (a.id || 0) - (b.id || 0));
        } else {
          this.errorMessage = data.error || "Error al obtener productos";
        }
      } catch (e) {
        this.errorMessage = "No se pudo conectar con el servidor";
        console.error("Error cargando productos:", e);
      } finally {
        this.cargando = false;
      }
    },
    abrirModalProducto(p = null) {
      if (p) {
        this.editando = true;
        this.prodForm = { ...p, images: p.images && p.images.length > 0 ? [...p.images] : [""] };
      } else {
        this.editando = false;
        const nextId = this.productos.length > 0 ? Math.max(...this.productos.map((pr) => pr.id)) : 1;
        this.prodForm = { id: nextId + 1, name: "", brand: "", category: this.categorias.length ? this.categorias[0].id : "", description: "", price: "", stock: 0, images: [""] };
      }
      this.showModal = true;
    },
    async guardarProducto() {
      this.guardando = true;
      try {
        const url = `/api/manage_products?token=${this.adminPin}`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": this.adminPin
          },
          body: JSON.stringify(this.prodForm)
        });
        const data = await res.json();
        if (data.ok) {
          this.showModal = false;
          this.cargarProductos();
        } else {
          alert("Error: " + data.error);
        }
      } catch (e) {
        alert("Error conectando con el servidor");
      } finally {
        this.guardando = false;
      }
    },
    async borrarProducto(id) {
      if (!confirm("\xBFSeguro que quieres eliminar este producto?")) return;
      try {
        const url = `/api/manage_products?id=${id}&token=${this.adminPin}`;
        const res = await fetch(url, { method: "DELETE" });
        const data = await res.json();
        if (data.ok) this.cargarProductos();
      } catch (e) {
        alert("Error al eliminar");
      }
    },
    isImageUrl(url) {
      if (!url) return false;
      const u = url.toLowerCase();
      return u.startsWith("/") || u.startsWith("http") || u.endsWith(".svg") || u.endsWith(".png") || u.endsWith(".webp") || u.endsWith(".jpg") || u.endsWith(".jpeg");
    },
    abrirCloudinaryWidget(index) {
      const openWidget = () => {
        (void 0).cloudinary.createUploadWidget({
          cloudName: "dtgjwuclv",
          uploadPreset: "imagesPersonalBarber",
          sources: ["local", "camera", "url"],
          multiple: false,
          folder: "personalbarber_assets/products"
        }, (error, result) => {
          if (!error && result && result.event === "success") {
            this.prodForm.images[index] = result.info.secure_url;
          }
        }).open();
      };
      if ((void 0).cloudinary) {
        openWidget();
      } else {
        (void 0).loadCloudinaryWidget && (void 0).loadCloudinaryWidget();
        setInterval();
      }
    }
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-b2757cea><div class="flex items-center justify-between mb-6" data-v-b2757cea><div data-v-b2757cea><h2 class="text-lg font-bold" data-v-b2757cea>Inventario de Productos</h2><p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest" data-v-b2757cea>Gestiona el cat\xE1logo de la tienda</p></div><div class="flex gap-2" data-v-b2757cea><button${ssrIncludeBooleanAttr($data.cargando) ? " disabled" : ""} class="flex items-center justify-center w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all group" data-v-b2757cea><span class="${ssrRenderClass([{ "animate-spin text-neon-green": $data.cargando, "text-zinc-500 group-hover:text-white transition-colors duration-300": !$data.cargando }, "flex items-center justify-center w-4 h-4"])}" data-v-b2757cea><i class="fas fa-sync-alt" data-v-b2757cea></i></span></button><button class="flex items-center gap-2 px-5 py-2.5 bg-neon-green text-black rounded-xl text-xs font-black uppercase hover:bg-neon-green-dark transition-all" data-v-b2757cea><i class="fas fa-plus" data-v-b2757cea></i> Nuevo Producto </button></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8" data-v-b2757cea><div class="relative group" data-v-b2757cea><i class="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-green transition-colors pointer-events-none" data-v-b2757cea></i><input${ssrRenderAttr("value", $data.searchQuery)} type="text" placeholder="Buscar productos..." class="w-full pl-11 pr-4 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 transition-all placeholder:text-zinc-600" data-v-b2757cea></div><div class="relative group" data-v-b2757cea><i class="fas fa-layer-group absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-neon-green transition-colors pointer-events-none" data-v-b2757cea></i><select class="w-full pl-11 pr-10 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-neon-green/50 focus:ring-1 focus:ring-neon-green/20 appearance-none cursor-pointer group-hover:border-zinc-700 transition-all" data-v-b2757cea><option value="all" data-v-b2757cea${ssrIncludeBooleanAttr(Array.isArray($data.filterCategory) ? ssrLooseContain($data.filterCategory, "all") : ssrLooseEqual($data.filterCategory, "all")) ? " selected" : ""}>Todas las Secciones</option><!--[-->`);
  ssrRenderList($data.categorias, (cat) => {
    _push(`<option${ssrRenderAttr("value", cat.id)} data-v-b2757cea${ssrIncludeBooleanAttr(Array.isArray($data.filterCategory) ? ssrLooseContain($data.filterCategory, cat.id) : ssrLooseEqual($data.filterCategory, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.label)}</option>`);
  });
  _push(`<!--]--></select><div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" data-v-b2757cea><i class="fas fa-chevron-down text-[10px] text-zinc-500 group-focus-within:text-neon-green transition-colors" data-v-b2757cea></i></div></div></div><div class="${ssrRenderClass({ "opacity-40 pointer-events-none transition-opacity duration-500": $data.cargando })}" data-v-b2757cea>`);
  if ($data.errorMessage) {
    _push(`<div class="text-center py-20 bg-red-500/5 rounded-3xl border border-dashed border-red-500/20" data-v-b2757cea><i class="fas fa-exclamation-circle text-4xl text-red-500/50 mb-4" data-v-b2757cea></i><p class="text-red-400 font-medium mb-2" data-v-b2757cea>Error de Conexi\xF3n</p><p class="text-zinc-500 text-xs" data-v-b2757cea>${ssrInterpolate($data.errorMessage)}</p><button class="mt-4 text-neon-green text-xs font-bold uppercase hover:underline" data-v-b2757cea>Reintentar</button></div>`);
  } else if ($options.filteredProducts.length === 0) {
    _push(`<div class="text-center py-20 bg-zinc-900/50 rounded-3xl border border-dashed border-zinc-800" data-v-b2757cea><i class="fas fa-search text-4xl text-zinc-700 mb-4" data-v-b2757cea></i><p class="text-zinc-500 font-medium" data-v-b2757cea>No se encontraron productos que coincidan.</p>`);
    if ($data.searchQuery || $data.filterCategory !== "all") {
      _push(`<button class="mt-4 text-neon-green text-xs font-bold uppercase hover:underline" data-v-b2757cea>Limpiar filtros</button>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div>`);
  } else {
    _push(`<div class="grid grid-cols-1 overflow-hidden border border-zinc-800 rounded-2xl bg-zinc-900/50" data-v-b2757cea><!--[-->`);
    ssrRenderList($options.filteredProducts, (p) => {
      _push(`<div class="flex items-center p-4 gap-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors" data-v-b2757cea><div class="w-12 h-12 bg-black rounded-lg overflow-hidden border border-zinc-800 shrink-0 uppercase flex items-center justify-center text-[8px] font-bold text-zinc-700" data-v-b2757cea>`);
      if (p.images && p.images.length > 0 && p.images[0]) {
        _push(`<img${ssrRenderAttr("src", $options.optimizeImage(p.images[0]))}${ssrRenderAttr("alt", p.name)} class="w-full h-full object-cover" data-v-b2757cea>`);
      } else {
        _push(`<span data-v-b2757cea>Sin foto</span>`);
      }
      _push(`</div><div class="flex-1 min-w-0" data-v-b2757cea><p class="font-bold text-sm truncate" data-v-b2757cea>${ssrInterpolate(p.name)}</p><div class="flex items-center gap-2 mt-0.5" data-v-b2757cea><span class="text-[9px] font-black text-neon-green uppercase px-1.5 py-0.5 bg-neon-green/10 rounded border border-neon-green/20" data-v-b2757cea>${ssrInterpolate(p.category)}</span><span class="text-zinc-500 text-[10px] font-bold" data-v-b2757cea>${ssrInterpolate($options.formatPrice(p.price))}</span><span class="${ssrRenderClass([p.stock > 3 ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" : p.stock > 0 ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" : "text-red-400 bg-red-400/10 border-red-400/20", "text-[9px] font-black uppercase px-1.5 py-0.5 rounded border"])}" data-v-b2757cea>${ssrInterpolate(p.stock > 0 ? `Stock: ${p.stock}` : "Agotado")}</span></div></div><div class="flex gap-2" data-v-b2757cea><button class="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all" data-v-b2757cea><i class="fas fa-edit text-xs" data-v-b2757cea></i></button><button class="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all" data-v-b2757cea><i class="fas fa-trash-alt text-xs" data-v-b2757cea></i></button></div></div>`);
    });
    _push(`<!--]--></div>`);
  }
  _push(`</div>`);
  if ($data.showModal) {
    _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" data-v-b2757cea><div class="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]" data-v-b2757cea><div class="flex items-center justify-between mb-6" data-v-b2757cea><h3 class="text-xl font-black uppercase tracking-tight" data-v-b2757cea>${ssrInterpolate($data.editando ? "Editar" : "Nuevo")} Producto</h3><button class="text-zinc-500 hover:text-white" data-v-b2757cea><i class="fas fa-times" data-v-b2757cea></i></button></div><div class="space-y-4" data-v-b2757cea><div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-v-b2757cea><div class="space-y-1" data-v-b2757cea><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-b2757cea>Nombre</label><input${ssrRenderAttr("value", $data.prodForm.name)} type="text" class="input-modern" placeholder="Cera Nishman Gold" data-v-b2757cea></div><div class="space-y-1" data-v-b2757cea><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-b2757cea>Precio (Solo n\xFAmeros)</label><input${ssrRenderAttr("value", $data.prodForm.price)} type="number" class="input-modern" placeholder="45000" data-v-b2757cea></div></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-4" data-v-b2757cea><div class="space-y-1" data-v-b2757cea><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-b2757cea>Marca</label><input${ssrRenderAttr("value", $data.prodForm.brand)} type="text" class="input-modern" placeholder="Nishman" data-v-b2757cea></div><div class="space-y-1" data-v-b2757cea><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-b2757cea>Categor\xEDa</label><select class="input-modern appearance-none" data-v-b2757cea><!--[-->`);
    ssrRenderList($data.categorias, (cat) => {
      _push(`<option${ssrRenderAttr("value", cat.id)} data-v-b2757cea${ssrIncludeBooleanAttr(Array.isArray($data.prodForm.category) ? ssrLooseContain($data.prodForm.category, cat.id) : ssrLooseEqual($data.prodForm.category, cat.id)) ? " selected" : ""}>${ssrInterpolate(cat.label)}</option>`);
    });
    _push(`<!--]--></select></div></div><div class="space-y-3" data-v-b2757cea><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-b2757cea>Im\xE1genes (URLs)</label><!--[-->`);
    ssrRenderList($data.prodForm.images, (img, index) => {
      _push(`<div class="space-y-2" data-v-b2757cea><div class="flex gap-2" data-v-b2757cea><input${ssrRenderAttr("value", $data.prodForm.images[index])} type="text" class="input-modern flex-1" placeholder="/products/ejemplo.webp" data-v-b2757cea><button class="px-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-neon-green hover:bg-zinc-700 transition" title="Subir Imagen" data-v-b2757cea><i class="fas fa-cloud-upload-alt" data-v-b2757cea></i></button>`);
      if ($data.prodForm.images.length > 1) {
        _push(`<button class="p-2 text-zinc-500 hover:text-red-400" data-v-b2757cea><i class="fas fa-minus-circle" data-v-b2757cea></i></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (img && $options.isImageUrl(img)) {
        _push(`<div class="mt-1 pl-1 fade-in" data-v-b2757cea><img${ssrRenderAttr("src", $options.optimizeImage(img))} class="w-20 h-20 object-cover rounded-xl border border-zinc-800 shadow-lg" alt="Preview" data-v-b2757cea></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    });
    _push(`<!--]--><button class="text-xs font-bold text-neon-green hover:underline flex items-center gap-2 pl-1" data-v-b2757cea><i class="fas fa-plus-circle" data-v-b2757cea></i> A\xF1adir otra imagen </button></div><div class="space-y-1" data-v-b2757cea><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-b2757cea>Descripci\xF3n</label><textarea rows="3" class="input-modern resize-none" placeholder="Breve descripci\xF3n del producto..." data-v-b2757cea>${ssrInterpolate($data.prodForm.description)}</textarea></div><div class="space-y-1" data-v-b2757cea><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-b2757cea>Stock disponible</label><input${ssrRenderAttr("value", $data.prodForm.stock)} type="number" min="0" class="input-modern" placeholder="10" data-v-b2757cea></div></div><button${ssrIncludeBooleanAttr($data.guardando) ? " disabled" : ""} class="w-full mt-8 py-4 bg-neon-green text-black font-black uppercase rounded-2xl hover:bg-neon-green-dark transition-all flex items-center justify-center gap-2" data-v-b2757cea>`);
    if ($data.guardando) {
      _push(`<i class="fas fa-spinner animate-spin" data-v-b2757cea></i>`);
    } else {
      _push(`<!---->`);
    }
    _push(` ${ssrInterpolate($data.guardando ? "Guardando..." : "Guardar Producto")}</button></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminProducts.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const AdminProducts = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-b2757cea"]]), { __name: "AdminProducts" });
const _sfc_main$2 = {
  name: "AdminCategories",
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
        id: "",
        label: "",
        subtitle: "",
        cover: "",
        accent: "#39FF14",
        comingSoon: false,
        icon: "fas fa-tag",
        style: "default",
        department: "men"
      }
    };
  },
  mounted() {
    this.cargarCategorias();
  },
  methods: {
    optimizeImage,
    async cargarCategorias() {
      this.cargando = true;
      try {
        const url = "/api/get_categories";
        const res = await fetch(url);
        const data = await res.json();
        if (data.ok) this.categorias = data.categories;
      } catch (e) {
        console.error("Error cargando categor\xEDas:", e);
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
        this.catForm = { id: "", label: "", subtitle: "", cover: "", accent: "#39FF14", comingSoon: false, icon: "fas fa-tag", style: "default", department: "men" };
      }
      this.showCatModal = true;
    },
    async guardarCategoria() {
      if (!this.catForm.id || !this.catForm.label) return alert("ID y Etiqueta son obligatorios");
      this.guardandoCat = true;
      try {
        const url = `/api/manage_categories?token=${this.adminPin}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.catForm)
        });
        const data = await res.json();
        if (data.ok) {
          this.showCatModal = false;
          this.cargarCategorias();
        } else {
          alert("Error: " + data.error);
        }
      } catch (e) {
        alert("Error conectando con el servidor");
      } finally {
        this.guardandoCat = false;
      }
    },
    async borrarCategoria(id) {
      if (!confirm("\xBFSeguro que quieres eliminar esta categor\xEDa? Esto no borrar\xE1 los productos, pero quedar\xE1n sin categor\xEDa asignada.")) return;
      try {
        const url = `/api/manage_categories?id=${id}&token=${this.adminPin}`;
        const res = await fetch(url, { method: "DELETE" });
        const data = await res.json();
        if (data.ok) this.cargarCategorias();
      } catch (e) {
        alert("Error al eliminar");
      }
    },
    isImageUrl(url) {
      if (!url) return false;
      const u = url.toLowerCase();
      return u.startsWith("/") || u.startsWith("http") || u.endsWith(".svg") || u.endsWith(".png") || u.endsWith(".webp") || u.endsWith(".jpg") || u.endsWith(".jpeg");
    },
    abrirCloudinaryWidget() {
      const openWidget = () => {
        (void 0).cloudinary.createUploadWidget({
          cloudName: "dtgjwuclv",
          uploadPreset: "imagesPersonalBarber",
          sources: ["local", "camera", "url"],
          multiple: false,
          folder: "personalbarber_assets/categories"
        }, (error, result) => {
          if (!error && result && result.event === "success") {
            this.catForm.cover = result.info.secure_url;
          }
        }).open();
      };
      if ((void 0).cloudinary) {
        openWidget();
      } else {
        (void 0).loadCloudinaryWidget && (void 0).loadCloudinaryWidget();
        setInterval();
      }
    }
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-7fff42cc><div class="flex items-center justify-between mb-6" data-v-7fff42cc><div data-v-7fff42cc><h2 class="text-lg font-bold" data-v-7fff42cc>Gesti\xF3n de Categor\xEDas</h2><p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest" data-v-7fff42cc>Administra las secciones de la tienda</p></div><button class="flex items-center gap-2 px-5 py-2.5 bg-neon-green text-black rounded-xl text-xs font-black uppercase hover:bg-neon-green-dark transition-all" data-v-7fff42cc><i class="fas fa-plus" data-v-7fff42cc></i> Nueva Categor\xEDa </button></div><div class="${ssrRenderClass({ "opacity-40 pointer-events-none transition-opacity duration-500": $data.cargando })}" data-v-7fff42cc><div class="grid grid-cols-1 overflow-hidden border border-zinc-800 rounded-2xl bg-zinc-900/50" data-v-7fff42cc><!--[-->`);
  ssrRenderList($data.categorias, (c) => {
    _push(`<div class="flex items-center p-4 gap-4 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/30 transition-colors" data-v-7fff42cc><div class="w-10 h-10 rounded-lg flex items-center justify-center border border-zinc-800 shrink-0 overflow-hidden relative" style="${ssrRenderStyle({ background: c.accent + "10", borderColor: c.accent + "30" })}" data-v-7fff42cc>`);
    if ($options.isImageUrl(c.icon)) {
      _push(`<div class="w-full h-full" style="${ssrRenderStyle({
        backgroundColor: c.accent,
        mask: `url('${c.icon.replace(".png", ".webp")}') no-repeat center / contain`,
        WebkitMask: `url('${c.icon.replace(".png", ".webp")}') no-repeat center / contain`
      })}" data-v-7fff42cc></div>`);
    } else {
      _push(`<i class="${ssrRenderClass(c.icon || "fas fa-tag")}" style="${ssrRenderStyle({ color: c.accent })}" data-v-7fff42cc></i>`);
    }
    if ($options.isImageUrl(c.icon)) {
      _push(`<div class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none" data-v-7fff42cc><i class="fas fa-image text-[8px]" data-v-7fff42cc></i></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div><div class="flex-1 min-w-0" data-v-7fff42cc><p class="font-bold text-sm" data-v-7fff42cc>${ssrInterpolate(c.label)}</p><div class="flex items-center gap-2 mt-0.5" data-v-7fff42cc><span class="text-[9px] text-zinc-500 uppercase font-bold" data-v-7fff42cc>${ssrInterpolate(c.id)}</span>`);
    if (c.comingSoon) {
      _push(`<span class="text-[8px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5 rounded uppercase font-black" data-v-7fff42cc>Pr\xF3ximamente</span>`);
    } else {
      _push(`<!---->`);
    }
    if (c.style === "premium") {
      _push(`<span class="text-[8px] bg-pink-500/10 text-pink-500 px-1.5 py-0.5 rounded uppercase font-black border border-pink-500/20" data-v-7fff42cc>Premium</span>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div><div class="flex gap-2" data-v-7fff42cc><button class="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all" data-v-7fff42cc><i class="fas fa-edit text-xs" data-v-7fff42cc></i></button><button class="w-8 h-8 flex items-center justify-center rounded-lg bg-zinc-800 text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all" data-v-7fff42cc><i class="fas fa-trash-alt text-xs" data-v-7fff42cc></i></button></div></div>`);
  });
  _push(`<!--]--></div></div>`);
  if ($data.showCatModal) {
    _push(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" data-v-7fff42cc><div class="bg-zinc-900 border border-zinc-800 rounded-3xl w-full max-w-md p-6 overflow-y-auto max-h-[90vh]" data-v-7fff42cc><div class="flex items-center justify-between mb-6" data-v-7fff42cc><h3 class="text-xl font-black uppercase tracking-tight" data-v-7fff42cc>${ssrInterpolate($data.editandoCat ? "Editar" : "Nueva")} Categor\xEDa</h3><button class="text-zinc-500 hover:text-white" data-v-7fff42cc><i class="fas fa-times" data-v-7fff42cc></i></button></div><div class="space-y-4" data-v-7fff42cc><div class="grid grid-cols-2 gap-4" data-v-7fff42cc><div class="space-y-1" data-v-7fff42cc><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-7fff42cc>ID (Slug)</label><input${ssrRenderAttr("value", $data.catForm.id)} type="text" class="input-modern" placeholder="ceras"${ssrIncludeBooleanAttr($data.editandoCat) ? " disabled" : ""} data-v-7fff42cc></div><div class="space-y-1" data-v-7fff42cc><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-7fff42cc>Etiqueta</label><input${ssrRenderAttr("value", $data.catForm.label)} type="text" class="input-modern" placeholder="Ceras &amp; Pomadas" data-v-7fff42cc></div></div><div class="grid grid-cols-2 gap-4" data-v-7fff42cc><div class="space-y-1" data-v-7fff42cc><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-7fff42cc>Color Acento</label><div class="flex gap-2" data-v-7fff42cc><input${ssrRenderAttr("value", $data.catForm.accent)} type="color" class="w-10 h-10 bg-transparent border-0 cursor-pointer p-0" data-v-7fff42cc><input${ssrRenderAttr("value", $data.catForm.accent)} type="text" class="input-modern text-center" placeholder="#facc15" data-v-7fff42cc></div></div><div class="space-y-1" data-v-7fff42cc><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-7fff42cc>Icono (FA o URL)</label><div class="flex gap-2" data-v-7fff42cc><input${ssrRenderAttr("value", $data.catForm.icon)} type="text" class="input-modern" placeholder="fas fa-tag o /icons/gorra.webp" data-v-7fff42cc>`);
    if ($data.catForm.icon) {
      _push(`<div class="w-10 h-10 rounded-lg border border-zinc-800 flex items-center justify-center shrink-0 overflow-hidden bg-black" data-v-7fff42cc>`);
      if ($options.isImageUrl($data.catForm.icon)) {
        _push(`<div class="w-6 h-6" style="${ssrRenderStyle({
          backgroundColor: $data.catForm.accent,
          mask: `url('${$data.catForm.icon.replace(".png", ".webp")}') no-repeat center / contain`,
          WebkitMask: `url('${$data.catForm.icon.replace(".png", ".webp")}') no-repeat center / contain`
        })}" data-v-7fff42cc></div>`);
      } else {
        _push(`<i class="${ssrRenderClass($data.catForm.icon)}" style="${ssrRenderStyle({ color: $data.catForm.accent })}" data-v-7fff42cc></i>`);
      }
      _push(`</div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div></div></div><div class="space-y-1" data-v-7fff42cc><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-7fff42cc>Imagen de Portada (URL)</label><div class="flex gap-2" data-v-7fff42cc><input${ssrRenderAttr("value", $data.catForm.cover)} type="text" class="input-modern flex-1" placeholder="/products/portada.webp" data-v-7fff42cc><button class="px-4 bg-zinc-800 rounded-xl text-zinc-400 hover:text-neon-green hover:bg-zinc-700 transition" title="Subir Imagen" data-v-7fff42cc><i class="fas fa-cloud-upload-alt" data-v-7fff42cc></i></button></div>`);
    if ($data.catForm.cover && $options.isImageUrl($data.catForm.cover)) {
      _push(`<div class="mt-2 pl-1 fade-in" data-v-7fff42cc><img${ssrRenderAttr("src", $options.optimizeImage($data.catForm.cover))} class="w-full h-32 object-cover rounded-2xl border border-zinc-800 shadow-lg mt-1" alt="Preview" data-v-7fff42cc></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div><div class="space-y-1" data-v-7fff42cc><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-7fff42cc>Subt\xEDtulo (Opcional)</label><input${ssrRenderAttr("value", $data.catForm.subtitle)} type="text" class="input-modern" placeholder="Pr\xF3ximamente" data-v-7fff42cc></div><div class="space-y-1" data-v-7fff42cc><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-7fff42cc>Departamento</label><select class="input-modern bg-zinc-800 text-white cursor-pointer w-full" data-v-7fff42cc><option value="men" data-v-7fff42cc${ssrIncludeBooleanAttr(Array.isArray($data.catForm.department) ? ssrLooseContain($data.catForm.department, "men") : ssrLooseEqual($data.catForm.department, "men")) ? " selected" : ""}>\u{1F9D4} Para \xC9l</option><option value="women" data-v-7fff42cc${ssrIncludeBooleanAttr(Array.isArray($data.catForm.department) ? ssrLooseContain($data.catForm.department, "women") : ssrLooseEqual($data.catForm.department, "women")) ? " selected" : ""}>\u{1F469} Para Ella</option><option value="unisex" data-v-7fff42cc${ssrIncludeBooleanAttr(Array.isArray($data.catForm.department) ? ssrLooseContain($data.catForm.department, "unisex") : ssrLooseEqual($data.catForm.department, "unisex")) ? " selected" : ""}>\u26A7\uFE0F Unisex / Global</option></select></div><div class="flex gap-6 pt-2" data-v-7fff42cc><label class="flex items-center gap-3 cursor-pointer group" data-v-7fff42cc><div class="${ssrRenderClass([{ "bg-cyan-500/20 ring-2 ring-cyan-500/50": $data.catForm.comingSoon }, "relative w-12 h-6 bg-zinc-800 rounded-full transition-all duration-300 group-hover:bg-zinc-700 shadow-inner"])}" data-v-7fff42cc><div class="${ssrRenderClass([{ "translate-x-6 bg-neon-green-dark shadow-[0_0_10px_rgba(250,204,21,0.5)]": $data.catForm.comingSoon }, "absolute top-1 left-1 w-4 h-4 bg-zinc-400 rounded-full transition-all duration-300 shadow-md"])}" data-v-7fff42cc></div></div><input type="checkbox"${ssrIncludeBooleanAttr(Array.isArray($data.catForm.comingSoon) ? ssrLooseContain($data.catForm.comingSoon, null) : $data.catForm.comingSoon) ? " checked" : ""} class="hidden" data-v-7fff42cc><span class="${ssrRenderClass([$data.catForm.comingSoon ? "text-cyan-400" : "text-zinc-500", "text-[10px] font-black uppercase tracking-widest transition-colors duration-300"])}" data-v-7fff42cc>Pr\xF3ximamente</span></label><label class="flex items-center gap-3 cursor-pointer group" data-v-7fff42cc><div class="${ssrRenderClass([{ "bg-pink-500/20 ring-2 ring-pink-500/50": $data.catForm.style === "premium" }, "relative w-12 h-6 bg-zinc-800 rounded-full transition-all duration-300 group-hover:bg-zinc-700 shadow-inner"])}" data-v-7fff42cc><div class="${ssrRenderClass([{ "translate-x-6 bg-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)]": $data.catForm.style === "premium" }, "absolute top-1 left-1 w-4 h-4 bg-zinc-400 rounded-full transition-all duration-300 shadow-md"])}" data-v-7fff42cc></div></div><input type="checkbox"${ssrIncludeBooleanAttr($data.catForm.style === "premium") ? " checked" : ""} class="hidden" data-v-7fff42cc><span class="${ssrRenderClass([$data.catForm.style === "premium" ? "text-pink-500" : "text-zinc-500", "text-[10px] font-black uppercase tracking-widest transition-colors duration-300"])}" data-v-7fff42cc>Estilo Premium</span></label></div></div><button${ssrIncludeBooleanAttr($data.guardandoCat) ? " disabled" : ""} class="w-full mt-8 py-4 bg-neon-green text-black font-black uppercase rounded-2xl hover:bg-neon-green-dark transition-all flex items-center justify-center gap-2" data-v-7fff42cc>`);
    if ($data.guardandoCat) {
      _push(`<i class="fas fa-spinner animate-spin" data-v-7fff42cc></i>`);
    } else {
      _push(`<!---->`);
    }
    _push(` ${ssrInterpolate($data.guardandoCat ? "Guardando..." : "Guardar Categor\xEDa")}</button></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminCategories.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AdminCategories = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-7fff42cc"]]), { __name: "AdminCategories" });
const _sfc_main$1 = {
  name: "AdminCuts",
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
        image: "",
        style: "",
        alt: ""
      }
    };
  },
  mounted() {
    this.cargarCortes();
  },
  methods: {
    optimizeImage,
    cargarCortes() {
      this.cargando = true;
      fetch("/api/get_cuts").then((r) => r.json()).then((data) => {
        if (data.ok) this.cortes = data.cuts;
      }).finally(() => this.cargando = false);
    },
    abrirModalCorte(c = null) {
      if (c) {
        this.editandoCut = true;
        this.cutForm = { ...c };
      } else {
        this.editandoCut = false;
        this.cutForm = {
          id: Date.now(),
          image: "",
          style: "",
          alt: ""
        };
      }
      this.showCutModal = true;
    },
    async guardarCorte() {
      if (!this.cutForm.image || !this.cutForm.style) return alert("Imagen y estilo son obligatorios");
      this.guardandoCut = true;
      try {
        const url = `/api/manage_cuts?token=${this.adminPin}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.cutForm)
        });
        const data = await res.json();
        if (data.ok) {
          this.showCutModal = false;
          this.cargarCortes();
        } else {
          alert("Error: " + data.error);
        }
      } catch (e) {
        alert("Error conectando con el servidor");
      } finally {
        this.guardandoCut = false;
      }
    },
    async borrarCorte(id) {
      if (!confirm("\xBFSeguro que quieres eliminar esta foto de la galer\xEDa?")) return;
      try {
        const url = `/api/manage_cuts?id=${id}&token=${this.adminPin}`;
        const res = await fetch(url, { method: "DELETE" });
        const data = await res.json();
        if (data.ok) this.cargarCortes();
      } catch (e) {
        alert("Error al eliminar");
      }
    },
    isImageUrl(url) {
      if (!url) return false;
      const u = url.toLowerCase();
      return u.startsWith("/") || u.startsWith("http") || u.endsWith(".svg") || u.endsWith(".png") || u.endsWith(".webp") || u.endsWith(".jpg") || u.endsWith(".jpeg");
    },
    abrirCloudinaryWidget() {
      const openWidget = () => {
        (void 0).cloudinary.createUploadWidget({
          cloudName: "dtgjwuclv",
          uploadPreset: "imagesPersonalBarber",
          sources: ["local", "camera", "url"],
          multiple: false,
          folder: "personalbarber_assets/customers"
        }, (error, result) => {
          if (!error && result && result.event === "success") {
            this.cutForm.image = result.info.secure_url;
          }
        }).open();
      };
      if ((void 0).cloudinary) {
        openWidget();
      } else {
        (void 0).loadCloudinaryWidget && (void 0).loadCloudinaryWidget();
        setInterval();
      }
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<div${ssrRenderAttrs(_attrs)} data-v-2abfceef><div class="flex items-center justify-between mb-6 text-center sm:text-left flex-col sm:flex-row gap-4" data-v-2abfceef><div data-v-2abfceef><h2 class="text-lg font-bold" data-v-2abfceef>Galer\xEDa de Cortes</h2><p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest" data-v-2abfceef>Muestra tus mejores trabajos a los clientes</p></div><div class="flex gap-2" data-v-2abfceef><button${ssrIncludeBooleanAttr($data.cargando) ? " disabled" : ""} class="flex items-center justify-center w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all group" data-v-2abfceef><span class="${ssrRenderClass([{ "animate-spin text-neon-green": $data.cargando, "text-zinc-500 group-hover:text-white transition-colors duration-300": !$data.cargando }, "flex items-center justify-center w-4 h-4"])}" data-v-2abfceef><i class="fas fa-sync-alt" data-v-2abfceef></i></span></button><button class="flex items-center gap-2 px-5 py-2.5 bg-neon-green text-black rounded-xl text-xs font-black uppercase hover:bg-neon-green-dark transition-all shadow-[0_5px_15px_rgba(57,255,20,0.2)]" data-v-2abfceef><i class="fas fa-plus" data-v-2abfceef></i> Nuevo Corte </button></div></div><div class="${ssrRenderClass({ "opacity-40 pointer-events-none transition-opacity duration-500": $data.cargando })}" data-v-2abfceef><div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4" data-v-2abfceef><!--[-->`);
  ssrRenderList($data.cortes, (c) => {
    _push(`<div class="group relative aspect-[3/4] bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-neon-green/50 transition-all duration-300 shadow-lg" data-v-2abfceef><img${ssrRenderAttr("src", $options.optimizeImage(c.image))}${ssrRenderAttr("alt", c.style)} class="w-full h-full object-cover" data-v-2abfceef><div class="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/90 to-transparent" data-v-2abfceef><p class="text-[9px] font-black uppercase text-white truncate tracking-wider" data-v-2abfceef>${ssrInterpolate(c.style)}</p></div><div class="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity" data-v-2abfceef><button class="w-8 h-8 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-md text-white hover:text-neon-green transition-colors border border-white/5" data-v-2abfceef><i class="fas fa-edit text-[10px]" data-v-2abfceef></i></button><button class="w-8 h-8 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-md text-white hover:text-red-400 transition-colors border border-white/5" data-v-2abfceef><i class="fas fa-trash-alt text-[10px]" data-v-2abfceef></i></button></div></div>`);
  });
  _push(`<!--]--></div>`);
  if (!$data.cargando && $data.cortes.length === 0) {
    _push(`<div class="flex flex-col items-center justify-center py-24 text-center bg-zinc-900/50 rounded-[2.5rem] border border-dashed border-zinc-800" data-v-2abfceef><div class="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6" data-v-2abfceef><i class="fas fa-camera-retro text-4xl text-zinc-700" data-v-2abfceef></i></div><h3 class="text-white font-bold mb-1" data-v-2abfceef>Tu galer\xEDa est\xE1 vac\xEDa</h3><p class="text-zinc-500 font-bold uppercase text-[10px] tracking-widest" data-v-2abfceef>A\xF1ade fotos de tus trabajos para atraer m\xE1s clientes</p></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
  if ($data.showCutModal) {
    _push(`<div class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md" data-v-2abfceef><div class="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] w-full max-w-md p-8 overflow-y-auto max-h-[90vh] shadow-2xl relative" data-v-2abfceef><div class="flex items-center justify-between mb-8" data-v-2abfceef><div data-v-2abfceef><h3 class="text-2xl font-black uppercase tracking-tight" data-v-2abfceef>${ssrInterpolate($data.editandoCut ? "Editar" : "Nuevo")} Trabajo</h3><p class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1" data-v-2abfceef>Configura los detalles de la foto</p></div><button class="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800 text-zinc-500 hover:text-white transition-colors" data-v-2abfceef><i class="fas fa-times" data-v-2abfceef></i></button></div><div class="space-y-6" data-v-2abfceef><div class="space-y-2" data-v-2abfceef><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-2abfceef>Foto del Trabajo (Cloudinary)</label><div class="flex gap-2" data-v-2abfceef><input${ssrRenderAttr("value", $data.cutForm.image)} type="text" class="input-modern flex-1" placeholder="URL de la foto" data-v-2abfceef><button class="px-4 bg-zinc-800 rounded-2xl text-zinc-400 hover:text-neon-green hover:bg-zinc-700 transition" title="Subir Imagen" data-v-2abfceef><i class="fas fa-cloud-upload-alt" data-v-2abfceef></i></button></div>`);
    if ($data.cutForm.image && $options.isImageUrl($data.cutForm.image)) {
      _push(`<div class="mt-4 aspect-[3/4] w-40 mx-auto rounded-3xl overflow-hidden border-2 border-zinc-800 shadow-2xl relative group" data-v-2abfceef><img${ssrRenderAttr("src", $options.optimizeImage($data.cutForm.image))} class="w-full h-full object-cover" data-v-2abfceef><div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" data-v-2abfceef><i class="fas fa-check-circle text-neon-green text-3xl" data-v-2abfceef></i></div></div>`);
    } else {
      _push(`<!---->`);
    }
    _push(`</div><div class="grid grid-cols-1 gap-4" data-v-2abfceef><div class="space-y-1" data-v-2abfceef><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-2abfceef>Estilo / T\xEDtulo</label><input${ssrRenderAttr("value", $data.cutForm.style)} type="text" class="input-modern" placeholder="Ej: Buzz Cut \xB7 High Fade" data-v-2abfceef></div><div class="space-y-1" data-v-2abfceef><label class="text-[10px] text-zinc-500 font-bold uppercase tracking-widest pl-1" data-v-2abfceef>TAG SEO (Opcional)</label><input${ssrRenderAttr("value", $data.cutForm.alt)} type="text" class="input-modern" placeholder="Ej: Degradado alto con barbero" data-v-2abfceef></div></div></div><button${ssrIncludeBooleanAttr($data.guardandoCut) ? " disabled" : ""} class="w-full mt-10 py-4 bg-neon-green text-black font-black uppercase rounded-2xl hover:bg-neon-green-dark shadow-[0_10px_30px_rgba(57,255,20,0.3)] disabled:opacity-50 transition-all flex items-center justify-center gap-3 group" data-v-2abfceef>`);
    if ($data.guardandoCut) {
      _push(`<i class="fas fa-spinner animate-spin text-lg" data-v-2abfceef></i>`);
    } else {
      _push(`<i class="fas fa-save text-lg group-hover:scale-110 transition-transform" data-v-2abfceef></i>`);
    }
    _push(`<span class="text-sm tracking-widest" data-v-2abfceef>${ssrInterpolate($data.guardandoCut ? "Guardando..." : "Publicar en Galer\xEDa")}</span></button></div></div>`);
  } else {
    _push(`<!---->`);
  }
  _push(`</div>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/admin/AdminCuts.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const AdminCuts = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-2abfceef"]]), { __name: "AdminCuts" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "admin",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Panel de Administraci\xF3n | PersonalBarber" });
    ref(false);
    ref("");
    ref(false);
    const activeTab = ref("reservas");
    computed(() => {
      const map = {
        reservas: AdminReservations,
        tienda: AdminProducts,
        categorias: AdminCategories,
        cortes: AdminCuts
      };
      return map[activeTab.value];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_1;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const admin = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-ab2ccb49"]]);

export { admin as default };
//# sourceMappingURL=admin-DwywJkA6.mjs.map
