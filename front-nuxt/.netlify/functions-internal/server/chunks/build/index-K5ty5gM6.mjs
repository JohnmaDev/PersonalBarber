import { _ as __nuxt_component_0 } from './nuxt-link-BV0nTBEl.mjs';
import { o as optimizeImage } from './image-CVwycW5b.mjs';
import { f as formatPrice } from './format-CwTWAru-.mjs';
import { defineComponent, ref, withAsyncContext, computed, watch, resolveComponent, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderStyle, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useRoute, a as useRouter } from './server.mjs';
import { u as useCart } from './useCart-CWHG987f.mjs';
import { u as useCatalog } from './useCatalog-By0rmWLV.mjs';
import { _ as _export_sfc, u as useSeoMeta } from './_plugin-vue_export-helper-Bo5sx5t4.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    useRouter();
    const { isStockFull } = useCart();
    const { products, categories, isLoading, error: errorMessage, fetchCatalog } = useCatalog();
    useSeoMeta({
      title: "Tienda Online | PersonalBarber Medell\xEDn",
      ogTitle: "Tienda Online | PersonalBarber",
      description: "Descubre nuestros productos especializados para el cuidado de la barba y el cabello. Compra online en PersonalBarber.",
      ogDescription: "Productos premium de barber\xEDa en Medell\xEDn. Compra online."
    });
    const activeDepartment = ref("men");
    const activeFilter = ref("all");
    const justAdded = ref(null);
    const isFirstVisit = ref(true);
    [__temp, __restore] = withAsyncContext(() => fetchCatalog()), await __temp, __restore();
    const filters = computed(() => [
      { id: "all", label: "Todos" },
      ...categories.value.filter((c) => {
        if (c.comingSoon) return false;
        if (activeDepartment.value === "merch") return c.department === "unisex" || c.style === "premium";
        return c.department === activeDepartment.value;
      }).map((c) => ({ id: c.id, label: c.label }))
    ]);
    function syncFilter() {
      const cat = route.query.cat;
      const dept = route.query.dept;
      if (dept && ["men", "women", "merch"].includes(dept)) {
        activeDepartment.value = dept;
      }
      const categoryObj = categories.value.find((c) => c.id === cat);
      if ((categoryObj == null ? void 0 : categoryObj.department) && categoryObj.department !== "unisex") {
        activeDepartment.value = categoryObj.department;
      }
      activeFilter.value = cat && filters.value.find((f) => f.id === cat) ? cat : "all";
    }
    watch(() => route.query.cat, syncFilter);
    watch(() => route.query.dept, syncFilter);
    watch(activeDepartment, () => {
      activeFilter.value = "all";
    });
    watch(activeFilter, (newFilter) => {
      var _a;
      const label = ((_a = filters.value.find((f) => f.id === newFilter)) == null ? void 0 : _a.label) || "Tienda";
      useSeoMeta({ title: `${label} | PersonalBarber Medell\xEDn` });
    }, { immediate: false });
    const filteredProducts = computed(() => {
      const activeDeptCats = categories.value.filter((c) => {
        if (activeDepartment.value === "merch") return c.department === "unisex" || c.style === "premium";
        return c.department === activeDepartment.value;
      }).map((c) => c.id);
      let list = products.value.filter((p) => p.category && activeDeptCats.includes(p.category));
      if (activeFilter.value !== "all") {
        list = list.filter((p) => p.category === activeFilter.value);
      }
      return list;
    });
    const activeFilterLabel = computed(() => {
      var _a, _b;
      return (_b = (_a = filters.value.find((f) => f.id === activeFilter.value)) == null ? void 0 : _a.label) != null ? _b : "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_fa_icon = resolveComponent("fa-icon");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-barber-black min-h-screen text-white relative" }, _attrs))} data-v-bae88601>`);
      if (unref(isLoading)) {
        _push(`<div class="fixed top-0 left-0 w-full h-[2px] z-[100] overflow-hidden" data-v-bae88601><div class="${ssrRenderClass([{
          "bg-neon-green shadow-[0_0_10px_#39FF14]": unref(activeDepartment) === "men",
          "bg-cyan-400 shadow-[0_0_10px_#22d3ee]": unref(activeDepartment) === "merch",
          "bg-pink-500 shadow-[0_0_10px_#ec4899]": unref(activeDepartment) === "women"
        }, "h-full animate-progress-bar transition-colors duration-500"])}" data-v-bae88601></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="sticky top-0 z-30 bg-barber-black/80 backdrop-blur-md border-b border-white/10" data-v-bae88601><div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-2" data-v-bae88601>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex-shrink-0 flex items-center gap-1.5 text-gray-400 hover:text-neon-green transition-colors duration-300"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_fa_icon, {
              icon: ["fas", "arrow-left"],
              class: "text-xs"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-semibold" data-v-bae88601${_scopeId}>Inicio</span>`);
          } else {
            return [
              createVNode(_component_fa_icon, {
                icon: ["fas", "arrow-left"],
                class: "text-xs"
              }),
              createVNode("span", { class: "text-xs font-semibold" }, "Inicio")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-sm sm:text-lg font-bold tracking-tight sm:tracking-widest uppercase text-white truncate text-center flex-1 transition-colors duration-500" data-v-bae88601><span class="${ssrRenderClass({
        "text-neon-green": unref(activeDepartment) === "men",
        "text-cyan-400": unref(activeDepartment) === "merch",
        "text-pink-500": unref(activeDepartment) === "women"
      })}" data-v-bae88601>Personal</span>Barber \xB7 Tienda </h1><div class="w-10 sm:w-16 flex-shrink-0" data-v-bae88601></div></div></div><div class="max-w-6xl mx-auto px-4 pb-20 pt-8" data-v-bae88601><div class="flex justify-center mt-2 mb-8 fade-in" data-v-bae88601><div class="inline-flex bg-zinc-900 rounded-full p-1 border border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" data-v-bae88601><button class="${ssrRenderClass([
        "px-4 sm:px-6 py-2 rounded-full font-black tracking-widest text-[10px] sm:text-xs uppercase transition-all duration-300 flex items-center gap-2",
        unref(activeDepartment) === "men" ? "bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]" : "text-zinc-500 hover:text-white"
      ])}" data-v-bae88601>`);
      _push(ssrRenderComponent(_component_fa_icon, { icon: ["fas", "cut"] }, null, _parent));
      _push(` <span class="hidden xs:inline" data-v-bae88601>Para \xC9l</span><span class="xs:hidden" data-v-bae88601>\xC9l</span></button><button class="${ssrRenderClass([
        "px-4 sm:px-6 py-2 rounded-full font-black tracking-widest text-[10px] sm:text-xs uppercase transition-all duration-300 flex items-center gap-2",
        unref(activeDepartment) === "merch" ? "bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "text-zinc-500 hover:text-white"
      ])}" data-v-bae88601>`);
      _push(ssrRenderComponent(_component_fa_icon, { icon: ["fas", "tshirt"] }, null, _parent));
      _push(` <span class="hidden xs:inline" data-v-bae88601>Merch</span><span class="xs:hidden" data-v-bae88601>Ropa</span></button><button class="${ssrRenderClass([
        "px-4 sm:px-6 py-2 rounded-full font-black tracking-widest text-[10px] sm:text-xs uppercase transition-all duration-300 flex items-center gap-2",
        unref(activeDepartment) === "women" ? "bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]" : "text-zinc-500 hover:text-white"
      ])}" data-v-bae88601>`);
      _push(ssrRenderComponent(_component_fa_icon, { icon: ["fas", "spa"] }, null, _parent));
      _push(` <span class="hidden xs:inline" data-v-bae88601>Para Ella</span><span class="xs:hidden" data-v-bae88601>Ella</span></button></div></div><div class="flex flex-wrap gap-3 mb-10 justify-center" data-v-bae88601><!--[-->`);
      ssrRenderList(unref(filters), (f) => {
        _push(`<button class="${ssrRenderClass([
          "px-5 py-2 rounded-full text-sm font-bold tracking-wide border transition-all duration-300",
          unref(activeFilter) === f.id ? unref(activeDepartment) === "men" ? "bg-neon-green text-black border-neon-green" : unref(activeDepartment) === "merch" ? "bg-cyan-400 text-black border-cyan-400" : "bg-pink-500 text-white border-pink-500" : unref(activeDepartment) === "men" ? "glass border-white/20 text-gray-300 hover:border-neon-green/50 hover:text-white" : unref(activeDepartment) === "merch" ? "glass border-white/20 text-gray-300 hover:border-cyan-400/50 hover:text-white" : "glass border-white/20 text-gray-300 hover:border-pink-500/50 hover:text-white"
        ])}" data-v-bae88601>${ssrInterpolate(f.label)}</button>`);
      });
      _push(`<!--]--></div><div class="mb-6 text-center" data-v-bae88601><p class="text-gray-500 text-sm" data-v-bae88601> Mostrando <span class="${ssrRenderClass([{ "text-neon-green": unref(activeDepartment) === "men", "text-cyan-400": unref(activeDepartment) === "merch", "text-pink-500": unref(activeDepartment) === "women" }, "font-bold transition-colors duration-300"])}" data-v-bae88601>${ssrInterpolate(unref(filteredProducts).length)}</span> productos `);
      if (unref(activeFilter) !== "all") {
        _push(`<span data-v-bae88601> en <span class="text-white" data-v-bae88601>${ssrInterpolate(unref(activeFilterLabel))}</span></span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</p></div>`);
      if (unref(isLoading)) {
        _push(`<div class="flex flex-col items-center justify-center py-24" data-v-bae88601><div class="${ssrRenderClass([{ "border-neon-green": unref(activeDepartment) === "men", "border-cyan-400": unref(activeDepartment) === "merch", "border-pink-500": unref(activeDepartment) === "women" }, "animate-spin rounded-full h-12 w-12 border-b-2 mb-4 transition-colors duration-300"])}" data-v-bae88601></div><p class="text-gray-400 font-medium" data-v-bae88601>Cargando productos...</p></div>`);
      } else {
        _push(`<div${ssrRenderAttrs({
          name: "products-grid",
          class: ["grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 transition-opacity duration-500", { "opacity-40 pointer-events-none": unref(isLoading) }]
        })} data-v-bae88601>`);
        ssrRenderList(unref(filteredProducts), (product, index2) => {
          _push(`<div style="${ssrRenderStyle(unref(isFirstVisit) ? { "--i": index2 } : {})}" class="${ssrRenderClass([
            "group flex flex-col bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-500",
            unref(activeDepartment) === "men" ? "hover:border-neon-green/50" : unref(activeDepartment) === "merch" ? "hover:border-cyan-400/50" : "hover:border-pink-500/50"
          ])}" data-v-bae88601><div class="aspect-square overflow-hidden bg-white/5 relative cursor-pointer" data-v-bae88601><img${ssrRenderAttr("src", ("optimizeImage" in _ctx ? _ctx.optimizeImage : unref(optimizeImage))(product.images && product.images.length > 0 ? product.images[0] : product.image, 400))}${ssrRenderAttr("alt", product.name)} class="${ssrRenderClass([{ "grayscale opacity-50": product.stock <= 0 }, "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"])}" loading="lazy" data-v-bae88601>`);
          if (product.stock <= 0) {
            _push(`<div class="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]" data-v-bae88601><span class="bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg" data-v-bae88601>Agotado</span></div>`);
          } else if (product.stock <= 3) {
            _push(`<div class="absolute top-2 right-2" data-v-bae88601><span class="bg-yellow-400 text-black text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg animate-pulse" data-v-bae88601>\xA1\xDAltimas ${ssrInterpolate(product.stock)}!</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><div class="p-4 flex flex-col flex-grow justify-between" data-v-bae88601><div class="cursor-pointer" data-v-bae88601><span class="text-[10px] text-gray-500 uppercase tracking-widest" data-v-bae88601>${ssrInterpolate(product.brand)}</span><h3 class="${ssrRenderClass([{ "group-hover:text-neon-green": unref(activeDepartment) === "men", "group-hover:text-cyan-400": unref(activeDepartment) === "merch", "group-hover:text-pink-500": unref(activeDepartment) === "women" }, "text-sm font-bold text-white transition-colors duration-300 leading-tight mt-0.5"])}" data-v-bae88601>${ssrInterpolate(product.name)}</h3><p class="text-gray-500 text-xs mt-1.5 leading-relaxed line-clamp-2 italic" data-v-bae88601>${ssrInterpolate(product.description)}</p></div><div class="flex items-center justify-between mt-4" data-v-bae88601><span class="${ssrRenderClass([{ "text-neon-green": unref(activeDepartment) === "men", "text-cyan-400": unref(activeDepartment) === "merch", "text-pink-500": unref(activeDepartment) === "women" }, "font-bold text-sm transition-colors duration-300"])}" data-v-bae88601>${ssrInterpolate(("formatPrice" in _ctx ? _ctx.formatPrice : unref(formatPrice))(product.price))}</span>`);
          if (product.stock > 0) {
            _push(`<button${ssrIncludeBooleanAttr(unref(isStockFull)(product)) ? " disabled" : ""} class="${ssrRenderClass([
              "w-8 h-8 rounded-full glass flex items-center justify-center transition-all duration-300 text-sm text-white hover:text-black",
              unref(isStockFull)(product) ? "opacity-20 cursor-not-allowed border-transparent" : unref(justAdded) === product.id ? unref(activeDepartment) === "men" ? "bg-neon-green text-black" : unref(activeDepartment) === "merch" ? "bg-cyan-400 text-black" : "bg-pink-500 text-white" : unref(activeDepartment) === "men" ? "hover:bg-neon-green" : unref(activeDepartment) === "merch" ? "hover:bg-cyan-400" : "hover:bg-pink-500"
            ])}"${ssrRenderAttr("aria-label", unref(isStockFull)(product) ? "Stock m\xE1ximo alcanzado" : "Agregar al carrito")} data-v-bae88601>`);
            _push(ssrRenderComponent(_component_fa_icon, {
              icon: ["fas", unref(isStockFull)(product) ? "lock" : unref(justAdded) === product.id ? "check" : "plus"],
              class: "text-[10px]"
            }, null, _parent));
            _push(`</button>`);
          } else {
            _push(`<button disabled class="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-700 cursor-not-allowed" data-v-bae88601>`);
            _push(ssrRenderComponent(_component_fa_icon, { icon: ["fas", "times"] }, null, _parent));
            _push(`</button>`);
          }
          _push(`</div></div></div>`);
        });
        _push(`</div>`);
      }
      if (unref(errorMessage) && !unref(isLoading)) {
        _push(`<div class="flex flex-col items-center justify-center py-20 text-center px-4" data-v-bae88601><div class="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl max-w-md" data-v-bae88601>`);
        _push(ssrRenderComponent(_component_fa_icon, {
          icon: ["fas", "exclamation-triangle"],
          class: "text-red-500 text-3xl mb-4"
        }, null, _parent));
        _push(`<h3 class="text-white font-bold mb-2" data-v-bae88601>Error de Conexi\xF3n</h3><p class="text-zinc-400 text-sm mb-6" data-v-bae88601>${ssrInterpolate(unref(errorMessage))}</p><button class="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold uppercase transition-all" data-v-bae88601>Reintentar</button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isLoading) && unref(filteredProducts).length === 0 && !unref(errorMessage)) {
        _push(`<div class="text-center py-24" data-v-bae88601>`);
        _push(ssrRenderComponent(_component_fa_icon, {
          icon: ["fas", "box-open"],
          class: "text-4xl text-gray-600 mb-4"
        }, null, _parent));
        _push(`<p class="text-gray-500" data-v-bae88601>No hay productos en esta categor\xEDa a\xFAn.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tienda/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bae88601"]]);

export { index as default };
//# sourceMappingURL=index-K5ty5gM6.mjs.map
