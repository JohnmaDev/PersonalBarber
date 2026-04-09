import { _ as __nuxt_component_0 } from './nuxt-link-BV0nTBEl.mjs';
import { o as optimizeImage } from './image-CVwycW5b.mjs';
import { g as getIdFromSlug, f as formatPrice, a as generateProductSlug } from './format-CwTWAru-.mjs';
import { defineComponent, withAsyncContext, computed, watchEffect, ref, watch, resolveComponent, mergeProps, unref, withCtx, createTextVNode, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { u as useRoute, a as useRouter } from './server.mjs';
import { u as useCart } from './useCart-CWHG987f.mjs';
import { u as useCatalog } from './useCatalog-By0rmWLV.mjs';
import { _ as _export_sfc, u as useSeoMeta, a as useHead } from './_plugin-vue_export-helper-Bo5sx5t4.mjs';
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
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import 'perfect-debounce';
import '@vue/shared';

const _imports_0 = publicAssetsURL("/hero_barber.webp");
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const route = useRoute();
    useRouter();
    const { getProductQty, isStockFull } = useCart();
    const { products, categories, isLoading, fetchCatalog } = useCatalog();
    [__temp, __restore] = withAsyncContext(() => fetchCatalog()), await __temp, __restore();
    const slug = computed(() => route.params.slug);
    const productId = computed(() => getIdFromSlug(slug.value));
    const product = computed(() => products.value.find((p) => p.id === productId.value));
    const activeDepartment = computed(() => {
      if (!product.value || categories.value.length === 0) return "men";
      const cat = categories.value.find((c) => c.id === product.value.category);
      return cat ? cat.department : "men";
    });
    watchEffect(() => {
      var _a;
      if (product.value) {
        const title = `${product.value.name} | PersonalBarber`;
        const description = `${product.value.name} de ${product.value.brand}. ${String(product.value.description).substring(0, 150)}...`;
        const image = ((_a = product.value.images) == null ? void 0 : _a[0]) || product.value.image || "/og-image.webp";
        useSeoMeta({
          title,
          ogTitle: title,
          description,
          ogDescription: description,
          ogImage: image
        });
        useHead({
          script: [{
            key: "product-ld",
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: product.value.name,
              description: product.value.description,
              brand: { "@type": "Brand", name: product.value.brand },
              image: product.value.images || [product.value.image],
              url: `https://personalbarber.vip/tienda/producto/${slug.value}`,
              offers: {
                "@type": "Offer",
                priceCurrency: "COP",
                price: String(product.value.price).replace(/\D/g, ""),
                availability: product.value.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
                seller: { "@type": "Organization", name: "PersonalBarber" }
              }
            })
          }]
        });
      }
    });
    const qty = ref(1);
    const showConfirm = ref(false);
    const carouselRef = ref(null);
    const activeIdx = ref(0);
    watch(() => route.params.slug, () => {
      qty.value = 1;
      activeIdx.value = 0;
      if (carouselRef.value) carouselRef.value.scrollLeft = 0;
      (void 0).scrollTo({ top: 0, behavior: "smooth" });
    });
    const recommendedProducts = computed(() => {
      if (!product.value || products.value.length === 0) return [];
      const sameCategory = products.value.filter((p) => p.category === product.value.category && p.id !== product.value.id).sort(() => 0.5 - Math.random()).slice(0, 2);
      const otherCategories = products.value.filter((p) => p.category !== product.value.category).sort(() => 0.5 - Math.random()).slice(0, 2);
      return [...sameCategory, ...otherCategories];
    });
    const availableCategories = computed(() => categories.value.filter((c) => c.id !== "all"));
    function getCategoryLabel(catId) {
      var _a, _b;
      return (_b = (_a = categories.value.find((c) => c.id === catId)) == null ? void 0 : _a.label) != null ? _b : catId;
    }
    const badges = [
      { icon: ["fas", "shield-alt"], label: "Productos originales" },
      { icon: ["fas", "truck"], label: "Env\xEDo disponible" },
      { icon: ["fas", "comments"], label: "Soporte directo" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_fa_icon = resolveComponent("fa-icon");
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-barber-black min-h-screen text-white relative" }, _attrs))} data-v-7916a7f3>`);
      if (unref(isLoading)) {
        _push(`<div class="fixed top-0 left-0 w-full h-[2px] z-[100] overflow-hidden" data-v-7916a7f3><div class="${ssrRenderClass([{
          "bg-neon-green shadow-[0_0_10px_#39FF14]": unref(activeDepartment) === "men",
          "bg-cyan-400 shadow-[0_0_10px_#22d3ee]": unref(activeDepartment) === "merch",
          "bg-pink-500 shadow-[0_0_10px_#ec4899]": unref(activeDepartment) === "women"
        }, "h-full animate-progress-bar"])}" data-v-7916a7f3></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="sticky top-0 z-30 bg-barber-black/80 backdrop-blur-md border-b border-white/10" data-v-7916a7f3><div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between gap-2" data-v-7916a7f3><button class="flex-shrink-0 flex items-center gap-1.5 text-gray-400 hover:text-neon-green transition-colors" data-v-7916a7f3>`);
      _push(ssrRenderComponent(_component_fa_icon, {
        icon: ["fas", "arrow-left"],
        class: "text-xs"
      }, null, _parent));
      _push(`<span class="text-xs font-semibold" data-v-7916a7f3>Volver</span></button><h1 class="text-sm sm:text-lg font-bold tracking-tight sm:tracking-widest uppercase text-white truncate text-center flex-1" data-v-7916a7f3><span class="text-neon-green" data-v-7916a7f3>Personal</span>Barber \xB7 Tienda </h1><div class="w-10 sm:w-16 flex-shrink-0" data-v-7916a7f3></div></div></div>`);
      if (unref(isLoading) && !unref(product)) {
        _push(`<div class="flex flex-col items-center justify-center min-h-[60vh]" data-v-7916a7f3><div class="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green mb-4" data-v-7916a7f3></div><p class="text-gray-400 font-medium" data-v-7916a7f3>Cargando detalles...</p></div>`);
      } else if (unref(product)) {
        _push(`<div class="${ssrRenderClass([{ "opacity-40 pointer-events-none": unref(isLoading) }, "max-w-5xl mx-auto px-4 py-6 md:py-10 pb-56 transition-opacity duration-500"])}" data-v-7916a7f3><div class="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 items-start" data-v-7916a7f3><div class="md:sticky md:top-24 flex flex-col gap-4" data-v-7916a7f3><div class="w-full aspect-square rounded-3xl overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth hide-scrollbar border border-white/10 bg-white/5 shadow-2xl flex items-center" data-v-7916a7f3><!--[-->`);
        ssrRenderList(unref(product).images, (img, idx) => {
          _push(`<div class="w-full h-full flex-shrink-0 snap-center flex items-center justify-center p-2" data-v-7916a7f3><img${ssrRenderAttr("src", ("optimizeImage" in _ctx ? _ctx.optimizeImage : unref(optimizeImage))(img, 800))}${ssrRenderAttr("alt", `${unref(product).name} ${idx + 1}`)} class="w-full h-full object-contain sm:object-cover rounded-2xl" loading="lazy" data-v-7916a7f3></div>`);
        });
        _push(`<!--]-->`);
        if (!unref(product).images || unref(product).images.length === 0) {
          _push(`<div class="w-full h-full flex items-center justify-center" data-v-7916a7f3><img${ssrRenderAttr("src", _imports_0)} alt="Sin imagen" class="w-full h-full object-cover" data-v-7916a7f3></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(product).images && unref(product).images.length > 1) {
          _push(`<div class="flex justify-center gap-2 sm:hidden mt-[-10px] pb-2" data-v-7916a7f3><!--[-->`);
          ssrRenderList(unref(product).images, (_, idx) => {
            _push(`<div class="${ssrRenderClass([unref(activeIdx) === idx ? "bg-neon-green w-4" : "bg-white/20", "w-1.5 h-1.5 rounded-full transition-all duration-300"])}" data-v-7916a7f3></div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(product).images && unref(product).images.length > 1) {
          _push(`<div class="hidden sm:flex flex-wrap gap-3" data-v-7916a7f3><!--[-->`);
          ssrRenderList(unref(product).images, (img, idx) => {
            _push(`<button class="${ssrRenderClass([unref(activeIdx) === idx ? "border-neon-green scale-105" : "border-transparent opacity-60 hover:opacity-100", "w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0"])}" data-v-7916a7f3><img${ssrRenderAttr("src", ("optimizeImage" in _ctx ? _ctx.optimizeImage : unref(optimizeImage))(img, 100))}${ssrRenderAttr("alt", `${unref(product).name} ${idx + 1}`)} class="w-full h-full object-cover" data-v-7916a7f3></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex flex-col gap-6" data-v-7916a7f3><div class="flex items-center gap-2 text-xs text-gray-500" data-v-7916a7f3>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/",
          class: "hover:text-neon-green transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Inicio`);
            } else {
              return [
                createTextVNode("Inicio")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span data-v-7916a7f3>/</span>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/tienda",
          class: "hover:text-neon-green transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Tienda`);
            } else {
              return [
                createTextVNode("Tienda")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<span data-v-7916a7f3>/</span><span class="text-gray-400" data-v-7916a7f3>${ssrInterpolate(unref(product).name)}</span></div><div data-v-7916a7f3><span class="text-neon-green text-xs font-bold tracking-widest uppercase" data-v-7916a7f3>${ssrInterpolate(unref(product).brand)}</span><h1 class="text-3xl font-black text-white mt-1 leading-tight tracking-tight" data-v-7916a7f3>${ssrInterpolate(unref(product).name)}</h1></div><div class="flex items-baseline gap-3" data-v-7916a7f3><span class="text-4xl font-black text-neon-green" data-v-7916a7f3>${ssrInterpolate(("formatPrice" in _ctx ? _ctx.formatPrice : unref(formatPrice))(unref(product).price))}</span></div><div class="bg-white/5 rounded-2xl p-5 border border-white/10" data-v-7916a7f3><h3 class="text-xs font-bold tracking-widest uppercase text-gray-400 mb-2" data-v-7916a7f3>Descripci\xF3n</h3><p class="text-gray-300 leading-relaxed text-sm" data-v-7916a7f3>${ssrInterpolate(unref(product).description)}</p></div><div class="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-3" data-v-7916a7f3><h3 class="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3" data-v-7916a7f3>Detalles</h3><div class="flex justify-between text-sm" data-v-7916a7f3><span class="text-gray-500" data-v-7916a7f3>Marca</span><span class="text-white font-semibold" data-v-7916a7f3>${ssrInterpolate(unref(product).brand)}</span></div><div class="flex justify-between text-sm" data-v-7916a7f3><span class="text-gray-500" data-v-7916a7f3>Categor\xEDa</span><span class="text-white font-semibold capitalize" data-v-7916a7f3>${ssrInterpolate(getCategoryLabel(unref(product).category))}</span></div><div class="flex justify-between text-sm" data-v-7916a7f3><span class="text-gray-500 font-bold" data-v-7916a7f3>Estado</span>`);
        if (unref(product).stock > 3) {
          _push(`<span class="text-neon-green font-black italic uppercase tracking-tighter" data-v-7916a7f3>\u2713 Disponible</span>`);
        } else if (unref(product).stock > 0) {
          _push(`<span class="text-amber-500 font-black animate-pulse italic uppercase tracking-tighter" data-v-7916a7f3>\u26A1 Solo quedan ${ssrInterpolate(unref(product).stock)}</span>`);
        } else {
          _push(`<span class="text-red-500 font-black uppercase tracking-widest bg-red-500/10 px-2 rounded" data-v-7916a7f3>\u2717 Agotado</span>`);
        }
        _push(`</div></div><div class="flex items-center gap-4" data-v-7916a7f3><span class="text-sm text-gray-400 font-semibold" data-v-7916a7f3>Cantidad</span><div class="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2" data-v-7916a7f3><button class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white font-bold" data-v-7916a7f3>\u2212</button><span class="text-white font-bold w-6 text-center" data-v-7916a7f3>${ssrInterpolate(unref(qty))}</span><button${ssrIncludeBooleanAttr(unref(qty) >= unref(product).stock - unref(getProductQty)(unref(product).id)) ? " disabled" : ""} class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white font-bold disabled:opacity-30 disabled:cursor-not-allowed" data-v-7916a7f3>+</button></div></div><div class="flex flex-col sm:flex-row gap-3" data-v-7916a7f3><button${ssrIncludeBooleanAttr(unref(product).stock <= 0 || unref(isStockFull)(unref(product))) ? " disabled" : ""} class="flex-1 py-4 glass border border-neon-green/50 hover:border-neon-green text-neon-green font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-30 disabled:border-white/10 disabled:text-gray-500 disabled:cursor-not-allowed" data-v-7916a7f3>`);
        _push(ssrRenderComponent(_component_fa_icon, { icon: ["fas", "shopping-bag"] }, null, _parent));
        _push(` ${ssrInterpolate(unref(product).stock <= 0 ? "Sin Stock" : unref(isStockFull)(unref(product)) ? "L\xEDmite en Carrito" : "Agregar al Carrito")}</button><button${ssrIncludeBooleanAttr(unref(product).stock <= 0 || unref(isStockFull)(unref(product))) ? " disabled" : ""} class="flex-1 py-4 bg-neon-green hover:bg-neon-green-dark text-black font-black rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed" data-v-7916a7f3>`);
        _push(ssrRenderComponent(_component_fa_icon, { icon: ["fas", "bolt"] }, null, _parent));
        _push(` ${ssrInterpolate(unref(isStockFull)(unref(product)) ? "L\xEDmite Alcanzado" : "Comprar Ahora")}</button></div>`);
        if (unref(showConfirm)) {
          _push(`<div class="flex items-center gap-2 text-green-400 text-sm font-semibold bg-green-400/10 border border-green-400/20 rounded-xl px-4 py-3" data-v-7916a7f3>`);
          _push(ssrRenderComponent(_component_fa_icon, { icon: ["fas", "check-circle"] }, null, _parent));
          _push(` \xA1Producto agregado al carrito! </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-3 gap-2 sm:gap-3 mt-4" data-v-7916a7f3><!--[-->`);
        ssrRenderList(badges, (badge) => {
          _push(`<div class="flex flex-col items-center gap-1 text-center p-2 sm:p-3 glass rounded-xl border border-white/5" data-v-7916a7f3>`);
          _push(ssrRenderComponent(_component_fa_icon, {
            icon: badge.icon,
            class: "text-neon-green text-base sm:text-lg"
          }, null, _parent));
          _push(`<span class="text-gray-400 text-[9px] sm:text-[10px] leading-tight" data-v-7916a7f3>${ssrInterpolate(badge.label)}</span></div>`);
        });
        _push(`<!--]--></div></div></div>`);
        if (unref(recommendedProducts).length > 0) {
          _push(`<div class="mt-20" data-v-7916a7f3><div class="flex items-center justify-between mb-8" data-v-7916a7f3><div data-v-7916a7f3><h2 class="text-xl font-black uppercase tracking-tight text-white" data-v-7916a7f3>Recomendados para ti</h2><p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1" data-v-7916a7f3>Completa tu kit de barber\xEDa</p></div><div class="h-px flex-1 bg-white/10 mx-6 hidden sm:block" data-v-7916a7f3></div>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            to: "/tienda",
            class: "text-neon-green text-sm font-bold hover:underline"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`Tienda \u2192`);
              } else {
                return [
                  createTextVNode("Tienda \u2192")
                ];
              }
            }),
            _: 1
          }, _parent));
          _push(`</div><div class="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6" data-v-7916a7f3><!--[-->`);
          ssrRenderList(unref(recommendedProducts), (item) => {
            _push(ssrRenderComponent(_component_NuxtLink, {
              key: item.id,
              to: { name: "tienda-producto-slug", params: { slug: ("generateProductSlug" in _ctx ? _ctx.generateProductSlug : unref(generateProductSlug))(item.id, item.name) } },
              class: "group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-neon-green/50 transition-all duration-300"
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(`<div class="aspect-square overflow-hidden bg-white/5" data-v-7916a7f3${_scopeId}><img${ssrRenderAttr("src", ("optimizeImage" in _ctx ? _ctx.optimizeImage : unref(optimizeImage))(item.images && item.images.length > 0 ? item.images[0] : item.image, 400))}${ssrRenderAttr("alt", item.name)} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" data-v-7916a7f3${_scopeId}></div><div class="p-4" data-v-7916a7f3${_scopeId}><h4 class="text-xs font-bold text-white group-hover:text-neon-green transition-colors line-clamp-1" data-v-7916a7f3${_scopeId}>${ssrInterpolate(item.name)}</h4><p class="text-neon-green font-bold text-xs mt-1" data-v-7916a7f3${_scopeId}>${ssrInterpolate(("formatPrice" in _ctx ? _ctx.formatPrice : unref(formatPrice))(item.price))}</p></div>`);
                } else {
                  return [
                    createVNode("div", { class: "aspect-square overflow-hidden bg-white/5" }, [
                      createVNode("img", {
                        src: ("optimizeImage" in _ctx ? _ctx.optimizeImage : unref(optimizeImage))(item.images && item.images.length > 0 ? item.images[0] : item.image, 400),
                        alt: item.name,
                        class: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      }, null, 8, ["src", "alt"])
                    ]),
                    createVNode("div", { class: "p-4" }, [
                      createVNode("h4", { class: "text-xs font-bold text-white group-hover:text-neon-green transition-colors line-clamp-1" }, toDisplayString(item.name), 1),
                      createVNode("p", { class: "text-neon-green font-bold text-xs mt-1" }, toDisplayString(("formatPrice" in _ctx ? _ctx.formatPrice : unref(formatPrice))(item.price)), 1)
                    ])
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push(`<!--]--></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="mt-20 pt-10 border-t border-white/10" data-v-7916a7f3><h2 class="text-xl font-black uppercase tracking-tight text-white mb-6" data-v-7916a7f3>Explorar por categor\xEDa</h2><div class="flex flex-wrap gap-3" data-v-7916a7f3><!--[-->`);
        ssrRenderList(unref(availableCategories), (cat) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: cat.id,
            to: { path: "/tienda", query: { cat: cat.id } },
            class: "px-5 py-3 rounded-2xl glass border border-white/10 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-neon-green hover:border-neon-green/50 transition-all duration-300"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(cat.label)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(cat.label), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></div></div>`);
      } else {
        _push(`<div class="flex flex-col items-center justify-center min-h-[60vh] gap-4" data-v-7916a7f3>`);
        _push(ssrRenderComponent(_component_fa_icon, {
          icon: ["fas", "box-open"],
          class: "text-4xl text-gray-600"
        }, null, _parent));
        _push(`<p class="text-gray-500" data-v-7916a7f3>Producto no encontrado.</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/tienda",
          class: "text-neon-green hover:underline text-sm font-bold"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`\u2190 Volver a la tienda`);
            } else {
              return [
                createTextVNode("\u2190 Volver a la tienda")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/tienda/producto/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug_ = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7916a7f3"]]);

export { _slug_ as default };
//# sourceMappingURL=_slug_-ByemM2Ey.mjs.map
