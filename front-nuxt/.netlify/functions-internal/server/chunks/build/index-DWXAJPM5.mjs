import { defineComponent, withAsyncContext, mergeProps, resolveComponent, ref, computed, unref, createVNode, resolveDynamicComponent, withCtx, openBlock, createBlock, toDisplayString, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderVNode } from 'vue/server-renderer';
import { p as publicAssetsURL } from '../routes/renderer.mjs';
import { u as useSeoMeta, a as useHead, _ as _export_sfc } from './_plugin-vue_export-helper-Bo5sx5t4.mjs';
import { _ as __nuxt_component_0$1 } from './nuxt-link-BV0nTBEl.mjs';
import { o as optimizeImage } from './image-CVwycW5b.mjs';
import { u as useCatalog } from './useCatalog-By0rmWLV.mjs';
import { a as useRouter, b as useFetch } from './server.mjs';
import 'vue-bundle-renderer/runtime';
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
import 'unhead/server';
import 'devalue';
import 'unhead/plugins';
import 'unhead/utils';
import 'vue-router';
import 'perfect-debounce';
import '@vue/shared';

const _imports_0 = publicAssetsURL("/bg_horizontal.webp");
const _imports_1 = publicAssetsURL("/bg_vertical.webp");
const _imports_2 = publicAssetsURL("/Profile_Andres_H.webp");
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "HeroSection",
  __ssrInlineRender: true,
  emits: ["reserve"],
  setup(__props, { emit: __emit }) {
    const socials = [
      { name: "WhatsApp", icon: ["fab", "whatsapp"], link: "https://api.whatsapp.com/send?phone=573045840264" },
      { name: "TikTok", icon: ["fab", "tiktok"], link: "https://www.tiktok.com/@pipehpbarber" },
      { name: "Instagram", icon: ["fab", "instagram"], link: "https://www.instagram.com/pipehp_/" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_fa_icon = resolveComponent("fa-icon");
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "relative w-full min-h-[100svh] flex items-center justify-center overflow-hidden bg-barber-black py-20 lg:py-0" }, _attrs))} data-v-7d0b1223><div class="absolute inset-0 z-0" data-v-7d0b1223><picture data-v-7d0b1223><source media="(orientation: landscape)"${ssrRenderAttr("srcset", _imports_0)} data-v-7d0b1223><img${ssrRenderAttr("src", _imports_1)} alt="Fondo de la barber\xEDa PersonalBarber" class="w-full h-full object-cover object-top filter brightness-50" fetchpriority="high" data-v-7d0b1223></picture><div class="absolute inset-0 bg-gradient-to-b from-transparent via-barber-black/60 to-barber-black" data-v-7d0b1223></div></div><div class="relative z-10 container mx-auto px-6 h-full flex flex-col lg:flex-row items-center justify-center lg:justify-between pt-10 lg:pt-0" data-v-7d0b1223><div class="w-full lg:w-3/5 text-center lg:text-left z-20 mt-12 lg:mt-0 flex flex-col items-center lg:items-start" data-v-7d0b1223><h1 class="text-[3rem] leading-tight sm:text-[4.5rem] lg:text-[120px] xl:text-[145px] font-black lg:leading-tight tracking-tighter italic uppercase animate-fade-in-up opacity-0 text-shadow-premium" data-v-7d0b1223><span class="text-neon-green block drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]" data-v-7d0b1223>TU ESTILO.</span><span class="text-white block" data-v-7d0b1223>TU BARBERO.</span><span class="text-white block" data-v-7d0b1223>MEDELL\xCDN.</span></h1><p class="text-lg sm:text-2xl lg:text-3xl text-gray-300 mt-8 mb-10 font-bold max-w-2xl mx-auto lg:mx-0 animate-fade-in-up opacity-0" style="${ssrRenderStyle({ "animation-delay": "0.2s" })}" data-v-7d0b1223><span class="text-white" data-v-7d0b1223>PersonalBarber</span> \u2014 Donde la excelencia es el est\xE1ndar. Reserva tu cita y <span class="text-neon-green" data-v-7d0b1223>refleja tu mejor versi\xF3n</span>. </p><div class="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start animate-fade-in-up opacity-0" style="${ssrRenderStyle({ "animation-delay": "0.4s" })}" data-v-7d0b1223><button class="px-10 py-5 bg-neon-green hover:bg-neon-green-dark text-black text-xl lg:text-2xl font-black italic tracking-wider rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(57,255,20,0.3)] hover:shadow-[0_0_60px_rgba(46,255,46,0.8)] hover:-translate-y-1 hover:scale-105 uppercase flex items-center justify-center gap-3" data-v-7d0b1223> RESERVAR AHORA `);
      _push(ssrRenderComponent(_component_fa_icon, { icon: ["fas", "calendar-check"] }, null, _parent));
      _push(`</button><button class="px-10 py-5 bg-transparent border-4 border-white/20 hover:border-white text-white text-xl lg:text-2xl font-black italic tracking-wider rounded-2xl transition-all duration-300 hover:bg-white hover:text-black hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.4)] uppercase flex items-center justify-center gap-3" data-v-7d0b1223> LA TIENDA `);
      _push(ssrRenderComponent(_component_fa_icon, { icon: ["fas", "shopping-bag"] }, null, _parent));
      _push(`</button></div></div><div class="mt-16 lg:mt-0 w-full max-w-sm lg:max-w-md relative animate-fade-in-up opacity-0 z-20" style="${ssrRenderStyle({ "animation-delay": "0.6s" })}" data-v-7d0b1223><div class="absolute inset-0 bg-neon-green rounded-[40px] translate-x-4 translate-y-4 opacity-30 blur-sm" data-v-7d0b1223></div><div class="relative bg-barber-charcoal/90 backdrop-blur-2xl p-8 lg:p-12 rounded-[40px] border border-white/10 flex flex-col items-center gap-6 shadow-2xl" data-v-7d0b1223><div class="w-40 h-40 lg:w-48 lg:h-48 rounded-[30px] border-4 border-neon-green p-1.5 overflow-hidden shadow-[0_0_30px_rgba(57,255,20,0.2)] bg-black" data-v-7d0b1223><img${ssrRenderAttr("src", _imports_2)} alt="Andr\xE9s Hern\xE1ndez \u2014 Master Barber Medell\xEDn" class="w-full h-full object-cover rounded-[22px]" data-v-7d0b1223></div><div class="text-center" data-v-7d0b1223><h2 class="sr-only" data-v-7d0b1223>Barber\xEDa Premium en Medell\xEDn \u2014 Cortes Exclusivos y Reservas Online</h2><p class="text-4xl lg:text-5xl font-black italic text-white tracking-wide uppercase" aria-hidden="true" data-v-7d0b1223>ANDR\xC9S H.</p><p class="text-neon-green text-lg lg:text-xl font-bold tracking-widest uppercase mt-2" data-v-7d0b1223>Master Barber \xB7 Medell\xEDn</p></div><div class="flex gap-4 w-full justify-center" data-v-7d0b1223><!--[-->`);
      ssrRenderList(socials, (social) => {
        _push(`<a${ssrRenderAttr("href", social.link)} target="_blank" rel="noopener noreferrer" class="w-14 h-14 lg:w-16 lg:h-16 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-neon-green hover:border-neon-green text-white hover:text-black font-bold text-2xl lg:text-3xl transition-all duration-300"${ssrRenderAttr("aria-label", social.name)} data-v-7d0b1223>`);
        _push(ssrRenderComponent(_component_fa_icon, {
          icon: social.icon
        }, null, _parent));
        _push(`</a>`);
      });
      _push(`<!--]--></div></div></div></div><div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce" data-v-7d0b1223>`);
      _push(ssrRenderComponent(_component_fa_icon, {
        icon: ["fas", "chevron-down"],
        class: "text-white/50 text-2xl"
      }, null, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeroSection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$3, [["__scopeId", "data-v-7d0b1223"]]), { __name: "HeroSection" });
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ShopCategories",
  __ssrInlineRender: true,
  setup(__props) {
    const { products, categories, isLoading } = useCatalog();
    const activeDepartment = ref("men");
    const activeCategories = computed(() => {
      if (activeDepartment.value === "merch") {
        return categories.value.filter((c) => !c.comingSoon && c.department === "unisex" && c.style !== "premium");
      }
      return categories.value.filter((c) => !c.comingSoon && c.style !== "premium" && c.department === activeDepartment.value);
    });
    const boutiqueCategories = computed(() => {
      if (activeDepartment.value === "merch") return [];
      return categories.value.filter((c) => c.style === "premium");
    });
    const otherComingSoonCategories = computed(() => {
      if (activeDepartment.value === "merch") {
        return categories.value.filter((c) => c.comingSoon && (c.department === "unisex" || c.style === "premium"));
      }
      return categories.value.filter((c) => c.comingSoon && c.style !== "premium" && c.department === activeDepartment.value);
    });
    function getCategoryCount(catId) {
      return products.value.filter((p) => p.category === catId).length;
    }
    function isImageUrl(icon) {
      if (!icon) return false;
      return icon.startsWith("/") || icon.startsWith("http");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_fa_icon = resolveComponent("fa-icon");
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "tienda",
        class: "mt-24 w-full scroll-mt-24 relative"
      }, _attrs))} data-v-efb0a74c>`);
      if (unref(isLoading)) {
        _push(`<div class="fixed top-0 left-0 w-full h-[2px] z-[100] overflow-hidden" data-v-efb0a74c><div class="${ssrRenderClass([{
          "bg-neon-green shadow-[0_0_10px_#39FF14]": unref(activeDepartment) === "men",
          "bg-cyan-400 shadow-[0_0_10px_#22d3ee]": unref(activeDepartment) === "merch",
          "bg-pink-500 shadow-[0_0_10px_#ec4899]": unref(activeDepartment) === "women"
        }, "h-full animate-progress-bar transition-colors duration-500"])}" data-v-efb0a74c></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="text-center mb-16 px-4" data-v-efb0a74c><h2 class="text-[3.5rem] leading-tight sm:text-[6rem] lg:text-[100px] font-black lg:leading-tight tracking-tighter italic uppercase text-shadow-premium" data-v-efb0a74c> NUESTRA <span class="${ssrRenderClass([{
        "text-neon-green drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]": unref(activeDepartment) === "men",
        "text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.3)]": unref(activeDepartment) === "merch",
        "text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]": unref(activeDepartment) === "women"
      }, "block sm:inline transition-colors duration-500"])}" data-v-efb0a74c>${ssrInterpolate(unref(activeDepartment) === "men" ? "TIENDA" : unref(activeDepartment) === "merch" ? "BOUTIQUE" : "BEAUTY")}</span></h2><p class="text-gray-400 text-lg sm:text-2xl mt-4 max-w-xl mx-auto italic font-bold tracking-wide transition-colors duration-500" data-v-efb0a74c>${ssrInterpolate(unref(activeDepartment) === "men" ? "Productos de calidad profesional, directo a tus manos" : unref(activeDepartment) === "merch" ? "Prendas exclusivas y accesorios con el sello de la casa" : "Belleza, maquillaje y cuidado integral para ti")}</p><div class="flex justify-center mt-8 mb-16 fade-in" data-v-efb0a74c><div class="inline-flex bg-zinc-900 rounded-full p-1 border border-zinc-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)]" data-v-efb0a74c><button class="${ssrRenderClass([
        "px-4 sm:px-6 py-3 rounded-full font-black tracking-widest text-[10px] sm:text-xs uppercase transition-all duration-300 flex items-center gap-2",
        unref(activeDepartment) === "men" ? "bg-neon-green text-black shadow-[0_0_15px_rgba(57,255,20,0.3)]" : "text-zinc-500 hover:text-white"
      ])}" data-v-efb0a74c>`);
      _push(ssrRenderComponent(_component_fa_icon, { icon: ["fas", "cut"] }, null, _parent));
      _push(` <span class="hidden xs:inline" data-v-efb0a74c>Para \xC9l</span><span class="xs:hidden" data-v-efb0a74c>\xC9l</span></button><button class="${ssrRenderClass([
        "px-4 sm:px-6 py-3 rounded-full font-black tracking-widest text-[10px] sm:text-xs uppercase transition-all duration-300 flex items-center gap-2",
        unref(activeDepartment) === "merch" ? "bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]" : "text-zinc-500 hover:text-white"
      ])}" data-v-efb0a74c>`);
      _push(ssrRenderComponent(_component_fa_icon, { icon: ["fas", "tshirt"] }, null, _parent));
      _push(` <span class="hidden xs:inline" data-v-efb0a74c>Merch</span><span class="xs:hidden" data-v-efb0a74c>Ropa</span></button><button class="${ssrRenderClass([
        "px-4 sm:px-6 py-3 rounded-full font-black tracking-widest text-[10px] sm:text-xs uppercase transition-all duration-300 flex items-center gap-2",
        unref(activeDepartment) === "women" ? "bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.3)]" : "text-zinc-500 hover:text-white"
      ])}" data-v-efb0a74c>`);
      _push(ssrRenderComponent(_component_fa_icon, { icon: ["fas", "spa"] }, null, _parent));
      _push(` <span class="hidden xs:inline" data-v-efb0a74c>Para Ella</span><span class="xs:hidden" data-v-efb0a74c>Ella</span></button></div></div></div><div class="${ssrRenderClass([{ "opacity-40 pointer-events-none": unref(isLoading) }, "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 transition-opacity duration-500"])}" data-v-efb0a74c><!--[-->`);
      ssrRenderList([...unref(activeCategories), ...unref(otherComingSoonCategories)], (cat) => {
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent(cat.comingSoon ? "div" : "NuxtLink"), {
          key: cat.id,
          to: cat.comingSoon ? void 0 : `/tienda?cat=${cat.id}`,
          class: ["group relative h-56 sm:h-72 rounded-3xl overflow-hidden border transition-all duration-500 flex flex-col items-center justify-center p-6 text-center", [cat.comingSoon ? "cursor-default bg-white/3" : "cursor-pointer hover:scale-[1.02] bg-zinc-900"]],
          style: { borderColor: `${cat.accent}${cat.comingSoon ? "15" : "30"}` }
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (!cat.comingSoon && cat.cover) {
                _push2(`<div class="absolute inset-0 z-0" data-v-efb0a74c${_scopeId}><img${ssrRenderAttr("src", ("optimizeImage" in _ctx ? _ctx.optimizeImage : unref(optimizeImage))(cat.cover, 600))}${ssrRenderAttr("alt", cat.label)} class="w-full h-full object-cover opacity-20 blur-sm grayscale group-hover:opacity-40 group-hover:blur-none group-hover:grayscale-0 transition-all duration-700" data-v-efb0a74c${_scopeId}><div class="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" data-v-efb0a74c${_scopeId}></div></div>`);
              } else {
                _push2(`<div class="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 z-0" style="${ssrRenderStyle({ background: `radial-gradient(circle at 50% 50%, ${cat.accent} 0%, transparent 70%)` })}" data-v-efb0a74c${_scopeId}></div>`);
              }
              _push2(`<div class="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl z-0" style="${ssrRenderStyle({ background: `radial-gradient(circle at 50% 50%, ${cat.accent}20 0%, transparent 60%)` })}" data-v-efb0a74c${_scopeId}></div><div class="relative z-10 flex flex-col items-center gap-4" data-v-efb0a74c${_scopeId}><div class="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg" style="${ssrRenderStyle({ borderColor: `${cat.accent}60`, background: `${cat.accent}15`, boxShadow: `0 0 20px ${cat.accent}20` })}" data-v-efb0a74c${_scopeId}>`);
              if (isImageUrl(cat.icon)) {
                _push2(`<div class="w-10 h-10 sm:w-12 sm:h-12 transition-all duration-500" style="${ssrRenderStyle({ backgroundColor: cat.accent, mask: `url('${cat.icon}') no-repeat center / contain`, WebkitMask: `url('${cat.icon}') no-repeat center / contain` })}" data-v-efb0a74c${_scopeId}></div>`);
              } else {
                _push2(ssrRenderComponent(_component_fa_icon, {
                  icon: ["fas", (cat.icon || "tag").replace("fas fa-", "")],
                  class: "text-2xl sm:text-3xl transition-all duration-500",
                  style: { color: cat.accent }
                }, null, _parent2, _scopeId));
              }
              _push2(`</div><div class="flex flex-col items-center" data-v-efb0a74c${_scopeId}>`);
              if (!cat.comingSoon) {
                _push2(`<span class="text-[10px] font-black tracking-[0.2em] uppercase mb-1 opacity-60 group-hover:opacity-100 transition-opacity" style="${ssrRenderStyle({ color: cat.accent })}" data-v-efb0a74c${_scopeId}>${ssrInterpolate(getCategoryCount(cat.id))} PRODUCTOS </span>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`<h3 class="text-lg sm:text-xl font-black text-white tracking-tighter uppercase italic italic-heavy drop-shadow-md" data-v-efb0a74c${_scopeId}>${ssrInterpolate(cat.label)}</h3><div class="mt-2" data-v-efb0a74c${_scopeId}>`);
              if (cat.comingSoon) {
                _push2(`<span class="text-[9px] px-3 py-1 rounded-full font-black tracking-widest uppercase border border-white/10 bg-white/5 text-white/40" data-v-efb0a74c${_scopeId}> Pr\xF3ximamente </span>`);
              } else {
                _push2(`<span class="text-[9px] px-3 py-1 rounded-full font-black tracking-widest uppercase border transition-all duration-300" style="${ssrRenderStyle({ color: cat.accent, borderColor: `${cat.accent}40`, background: `${cat.accent}10` })}" data-v-efb0a74c${_scopeId}> Disponible </span>`);
              }
              _push2(`</div></div></div>`);
            } else {
              return [
                !cat.comingSoon && cat.cover ? (openBlock(), createBlock("div", {
                  key: 0,
                  class: "absolute inset-0 z-0"
                }, [
                  createVNode("img", {
                    src: ("optimizeImage" in _ctx ? _ctx.optimizeImage : unref(optimizeImage))(cat.cover, 600),
                    alt: cat.label,
                    class: "w-full h-full object-cover opacity-20 blur-sm grayscale group-hover:opacity-40 group-hover:blur-none group-hover:grayscale-0 transition-all duration-700"
                  }, null, 8, ["src", "alt"]),
                  createVNode("div", { class: "absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" })
                ])) : (openBlock(), createBlock("div", {
                  key: 1,
                  class: "absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500 z-0",
                  style: { background: `radial-gradient(circle at 50% 50%, ${cat.accent} 0%, transparent 70%)` }
                }, null, 4)),
                createVNode("div", {
                  class: "absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl z-0",
                  style: { background: `radial-gradient(circle at 50% 50%, ${cat.accent}20 0%, transparent 60%)` }
                }, null, 4),
                createVNode("div", { class: "relative z-10 flex flex-col items-center gap-4" }, [
                  createVNode("div", {
                    class: "w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg",
                    style: { borderColor: `${cat.accent}60`, background: `${cat.accent}15`, boxShadow: `0 0 20px ${cat.accent}20` }
                  }, [
                    isImageUrl(cat.icon) ? (openBlock(), createBlock("div", {
                      key: 0,
                      class: "w-10 h-10 sm:w-12 sm:h-12 transition-all duration-500",
                      style: { backgroundColor: cat.accent, mask: `url('${cat.icon}') no-repeat center / contain`, WebkitMask: `url('${cat.icon}') no-repeat center / contain` }
                    }, null, 4)) : (openBlock(), createBlock(_component_fa_icon, {
                      key: 1,
                      icon: ["fas", (cat.icon || "tag").replace("fas fa-", "")],
                      class: "text-2xl sm:text-3xl transition-all duration-500",
                      style: { color: cat.accent }
                    }, null, 8, ["icon", "style"]))
                  ], 4),
                  createVNode("div", { class: "flex flex-col items-center" }, [
                    !cat.comingSoon ? (openBlock(), createBlock("span", {
                      key: 0,
                      class: "text-[10px] font-black tracking-[0.2em] uppercase mb-1 opacity-60 group-hover:opacity-100 transition-opacity",
                      style: { color: cat.accent }
                    }, toDisplayString(getCategoryCount(cat.id)) + " PRODUCTOS ", 5)) : createCommentVNode("", true),
                    createVNode("h3", { class: "text-lg sm:text-xl font-black text-white tracking-tighter uppercase italic italic-heavy drop-shadow-md" }, toDisplayString(cat.label), 1),
                    createVNode("div", { class: "mt-2" }, [
                      cat.comingSoon ? (openBlock(), createBlock("span", {
                        key: 0,
                        class: "text-[9px] px-3 py-1 rounded-full font-black tracking-widest uppercase border border-white/10 bg-white/5 text-white/40"
                      }, " Pr\xF3ximamente ")) : (openBlock(), createBlock("span", {
                        key: 1,
                        class: "text-[9px] px-3 py-1 rounded-full font-black tracking-widest uppercase border transition-all duration-300",
                        style: { color: cat.accent, borderColor: `${cat.accent}40`, background: `${cat.accent}10` }
                      }, " Disponible ", 4))
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 2
        }), _parent);
      });
      _push(`<!--]--></div><!--[-->`);
      ssrRenderList(unref(boutiqueCategories), (cat) => {
        _push(`<div class="mt-12 relative pt-4" data-v-efb0a74c><div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 bg-black px-4 py-1 rounded-full border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.3)]" data-v-efb0a74c><span class="text-[10px] font-black tracking-[0.2em] text-pink-500 uppercase" data-v-efb0a74c>Premium Merch</span></div><div class="group relative h-48 sm:h-56 rounded-3xl overflow-hidden border border-pink-500/20 bg-gradient-to-r from-pink-900/20 via-black to-zinc-900/40 p-1 flex items-center justify-center transition-all duration-700 hover:border-pink-500/50 shadow-2xl" data-v-efb0a74c><div class="relative flex flex-col items-center text-center p-6 sm:p-10 z-10 w-full border border-white/5 rounded-[22px] bg-black/60 backdrop-blur-sm" data-v-efb0a74c><div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-6" data-v-efb0a74c><div class="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center transform rotate-3 group-hover:rotate-0 transition-transform duration-500" data-v-efb0a74c>`);
        _push(ssrRenderComponent(_component_fa_icon, {
          icon: ["fas", "tshirt"],
          class: "text-3xl sm:text-4xl text-pink-500"
        }, null, _parent));
        _push(`</div><div class="flex flex-col items-center sm:items-start text-center sm:text-left" data-v-efb0a74c><h3 class="text-2xl sm:text-4xl font-black text-white tracking-tighter uppercase italic italic-heavy" data-v-efb0a74c>${ssrInterpolate(cat.label)}</h3><p class="text-zinc-400 text-sm sm:text-base font-medium mt-1 max-w-sm" data-v-efb0a74c>Dise\xF1os exclusivos, gorras y prendas con el sello PersonalBarber.</p></div></div><div class="mt-6 flex items-center gap-4" data-v-efb0a74c><span class="h-[1px] w-8 sm:w-16 bg-gradient-to-r from-transparent to-pink-500" data-v-efb0a74c></span><span class="text-xs font-bold tracking-widest text-pink-500 uppercase whitespace-nowrap" data-v-efb0a74c>Muy Pronto</span><span class="h-[1px] w-8 sm:w-16 bg-gradient-to-l from-transparent to-pink-500" data-v-efb0a74c></span></div></div></div></div>`);
      });
      _push(`<!--]--><div class="flex justify-center mt-12 mb-20" data-v-efb0a74c>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: { path: "/tienda", query: { dept: unref(activeDepartment) } },
        class: [
          "group relative inline-flex items-center justify-center px-12 py-5 font-black italic uppercase tracking-[0.2em] text-white transition-all duration-300 ease-out border-2",
          unref(activeDepartment) === "men" ? "border-neon-green/40 hover:border-neon-green" : unref(activeDepartment) === "merch" ? "border-cyan-400/40 hover:border-cyan-400" : "border-pink-500/40 hover:border-pink-500"
        ]
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="${ssrRenderClass([
              "absolute inset-0 w-full h-full translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300",
              unref(activeDepartment) === "men" ? "bg-neon-green/10" : unref(activeDepartment) === "merch" ? "bg-cyan-400/10" : "bg-pink-500/10"
            ])}" data-v-efb0a74c${_scopeId}></div><div class="relative flex items-center gap-3" data-v-efb0a74c${_scopeId}>`);
            _push2(ssrRenderComponent(_component_fa_icon, {
              icon: ["fas", "store"],
              class: ["transition-transform duration-300 group-hover:scale-125", unref(activeDepartment) === "men" ? "text-neon-green" : unref(activeDepartment) === "merch" ? "text-cyan-400" : "text-pink-500"]
            }, null, _parent2, _scopeId));
            _push2(`<span class="${ssrRenderClass([unref(activeDepartment) === "men" ? "group-hover:text-neon-green" : unref(activeDepartment) === "merch" ? "group-hover:text-cyan-400" : "group-hover:text-pink-500", "text-xl sm:text-2xl transition-colors duration-300"])}" data-v-efb0a74c${_scopeId}>${ssrInterpolate(unref(activeDepartment) === "men" ? "Explorar Tienda" : unref(activeDepartment) === "merch" ? "Ver Colecci\xF3n" : "Explorar Beauty Hub")}</span></div>`);
          } else {
            return [
              createVNode("div", {
                class: [
                  "absolute inset-0 w-full h-full translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300",
                  unref(activeDepartment) === "men" ? "bg-neon-green/10" : unref(activeDepartment) === "merch" ? "bg-cyan-400/10" : "bg-pink-500/10"
                ]
              }, null, 2),
              createVNode("div", { class: "relative flex items-center gap-3" }, [
                createVNode(_component_fa_icon, {
                  icon: ["fas", "store"],
                  class: ["transition-transform duration-300 group-hover:scale-125", unref(activeDepartment) === "men" ? "text-neon-green" : unref(activeDepartment) === "merch" ? "text-cyan-400" : "text-pink-500"]
                }, null, 8, ["class"]),
                createVNode("span", {
                  class: ["text-xl sm:text-2xl transition-colors duration-300", unref(activeDepartment) === "men" ? "group-hover:text-neon-green" : unref(activeDepartment) === "merch" ? "group-hover:text-cyan-400" : "group-hover:text-pink-500"]
                }, toDisplayString(unref(activeDepartment) === "men" ? "Explorar Tienda" : unref(activeDepartment) === "merch" ? "Ver Colecci\xF3n" : "Explorar Beauty Hub"), 3)
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ShopCategories.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ Object.assign(_export_sfc(_sfc_main$2, [["__scopeId", "data-v-efb0a74c"]]), { __name: "ShopCategories" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "MasonryGallery",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data, pending } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/get_cuts",
      {
        key: "gallery-cuts",
        default: () => ({ ok: false, cuts: [] })
      },
      "$bB6yHYoqJL"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const cuts = computed(() => {
      var _a;
      return ((_a = data.value) == null ? void 0 : _a.cuts) || [];
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_fa_icon = resolveComponent("fa-icon");
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "cortes",
        class: "mt-24 w-full scroll-mt-24"
      }, _attrs))}><div class="text-center mb-16 px-4"><h2 class="text-[3.5rem] leading-tight sm:text-[5rem] lg:text-[100px] font-black lg:leading-tight tracking-tighter italic uppercase text-shadow-premium"> NUESTROS <span class="text-neon-green block sm:inline drop-shadow-[0_0_15px_rgba(57,255,20,0.3)]">CORTES</span></h2><p class="text-gray-400 text-lg sm:text-2xl mt-4 max-w-xl mx-auto italic font-bold tracking-wide"> El trabajo habla por s\xED solo </p><div class="flex justify-center gap-2 opacity-80 mt-6 mb-8"><!--[-->`);
      ssrRenderList(3, (i) => {
        _push(`<span class="w-3 h-3 bg-neon-green rounded-full shadow-[0_0_10px_rgba(57,255,20,0.5)]"></span>`);
      });
      _push(`<!--]--></div></div>`);
      if (!unref(pending) && unref(cuts).length > 0) {
        _push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full px-2 sm:px-0"><!--[-->`);
        ssrRenderList(unref(cuts), (cut) => {
          _push(`<div class="group relative overflow-hidden rounded-2xl border border-white/10 transition-colors duration-700 bg-zinc-900/50"><div class="aspect-[3/4] w-full overflow-hidden"><img${ssrRenderAttr("src", ("optimizeImage" in _ctx ? _ctx.optimizeImage : unref(optimizeImage))(cut.image, 400))}${ssrRenderAttr("alt", cut.alt || cut.style)} class="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110" loading="lazy"></div><div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-3 sm:p-4"><span class="text-white font-bold tracking-widest text-[9px] sm:text-[10px] uppercase bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">${ssrInterpolate(cut.style)}</span></div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (unref(pending)) {
        _push(`<div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 w-full"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="aspect-[3/4] w-full rounded-2xl bg-zinc-900 animate-pulse border border-white/5"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="text-center py-20 bg-zinc-900/30 rounded-3xl border border-dashed border-white/10">`);
        _push(ssrRenderComponent(_component_fa_icon, {
          icon: ["fas", "camera-retro"],
          class: "text-3xl text-zinc-700 mb-4"
        }, null, _parent));
        _push(`<p class="text-zinc-500 font-bold italic">Pr\xF3ximamente m\xE1s trabajos...</p></div>`);
      }
      _push(`</section>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MasonryGallery.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_2 = Object.assign(_sfc_main$1, { __name: "MasonryGallery" });
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    useSeoMeta({
      title: "PersonalBarber \u2014 Barber\xEDa Premium en Medell\xEDn | Reserva tu Cita Online",
      ogTitle: "PersonalBarber \u2014 Barber\xEDa Premium en Medell\xEDn",
      description: "Barber\xEDa premium en Medell\xEDn con el mejor estilo. Cortes exclusivos, barba profesional y productos especializados. Reserva tu cita online al instante.",
      ogDescription: "Barber\xEDa premium en Medell\xEDn. Cortes exclusivos y reservas online.",
      ogUrl: "https://personalbarber.vip"
    });
    useHead({
      script: [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HairSalon",
          name: "PersonalBarber",
          description: "Barber\xEDa premium a domicilio en Medell\xEDn. Cortes exclusivos, barba profesional y productos especializados.",
          url: "https://personalbarber.vip",
          telephone: "+573045840264",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Medell\xEDn",
            addressRegion: "Antioquia",
            addressCountry: "CO"
          },
          servesCuisine: void 0,
          sameAs: [
            "https://www.instagram.com/pipehp_/",
            "https://www.tiktok.com/@pipehpbarber"
          ],
          openingHoursSpecification: {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
          }
        })
      }]
    });
    const router = useRouter();
    const { fetchCatalog } = useCatalog();
    [__temp, __restore] = withAsyncContext(() => fetchCatalog()), await __temp, __restore();
    function goToReserva() {
      router.push({ name: "agendar" });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_HeroSection = __nuxt_component_0;
      const _component_ShopCategories = __nuxt_component_1;
      const _component_MasonryGallery = __nuxt_component_2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-barber-black min-h-screen text-white flex flex-col items-center" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_HeroSection, {
        onReserve: goToReserva,
        class: "animate-on-scroll opacity-0 translate-y-8 transition-all duration-1000 ease-out"
      }, null, _parent));
      _push(`<div class="w-full max-w-6xl px-4 flex flex-col items-center pb-20 overflow-hidden">`);
      _push(ssrRenderComponent(_component_ShopCategories, { class: "animate-on-scroll w-full opacity-0 translate-y-12 transition-all duration-1000 ease-out" }, null, _parent));
      _push(ssrRenderComponent(_component_MasonryGallery, { class: "animate-on-scroll w-full mt-8 opacity-0 translate-y-12 transition-all duration-1000 ease-out" }, null, _parent));
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DWXAJPM5.mjs.map
