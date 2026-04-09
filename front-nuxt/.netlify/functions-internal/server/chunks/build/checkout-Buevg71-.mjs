import { _ as __nuxt_component_0 } from './nuxt-link-BV0nTBEl.mjs';
import { a as useRouter, _ as __nuxt_component_1 } from './server.mjs';
import { defineComponent, reactive, ref, computed, resolveComponent, mergeProps, withCtx, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "checkout",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({ title: "Finalizar Compra | PersonalBarber" });
    useRouter();
    const form = reactive({ firstName: "", lastName: "", email: "", phone: "", city: "", address: "" });
    reactive({ firstName: false, lastName: false, email: false, phone: false });
    ref("wompi");
    const showSoonAlert = ref(false);
    ref(false);
    const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email));
    const isPhoneValid = computed(() => /^(57)?3\d{9}$/.test(form.phone.replace(/[\s\-+]/g, "")));
    computed(() => form.firstName.trim() && form.lastName.trim() && isEmailValid.value && isPhoneValid.value);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_fa_icon = resolveComponent("fa-icon");
      const _component_ClientOnly = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-barber-black min-h-screen text-white" }, _attrs))} data-v-e3f9f3b1><div class="sticky top-0 z-30 bg-barber-black/80 backdrop-blur-md border-b border-white/10" data-v-e3f9f3b1><div class="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between gap-2" data-v-e3f9f3b1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/tienda",
        class: "flex-shrink-0 flex items-center gap-1.5 text-gray-400 hover:text-neon-green transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_fa_icon, {
              icon: ["fas", "arrow-left"],
              class: "text-xs"
            }, null, _parent2, _scopeId));
            _push2(`<span class="text-xs font-semibold" data-v-e3f9f3b1${_scopeId}>Tienda</span>`);
          } else {
            return [
              createVNode(_component_fa_icon, {
                icon: ["fas", "arrow-left"],
                class: "text-xs"
              }),
              createVNode("span", { class: "text-xs font-semibold" }, "Tienda")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-sm sm:text-lg font-bold tracking-tight sm:tracking-widest uppercase text-white truncate text-center flex-1" data-v-e3f9f3b1><span class="text-neon-green" data-v-e3f9f3b1>Personal</span>Barber \xB7 Checkout </h1><div class="w-10 sm:w-16 flex-shrink-0" data-v-e3f9f3b1></div></div></div>`);
      _push(ssrRenderComponent(_component_ClientOnly, null, {}, _parent));
      if (unref(showSoonAlert)) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" data-v-e3f9f3b1><div class="bg-barber-black border border-white/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl" data-v-e3f9f3b1><div class="w-20 h-20 bg-neon-green/10 rounded-full flex items-center justify-center mx-auto mb-6 text-neon-green" data-v-e3f9f3b1>`);
        _push(ssrRenderComponent(_component_fa_icon, {
          icon: ["fas", "tools"],
          class: "text-3xl"
        }, null, _parent));
        _push(`</div><h3 class="text-xl font-black text-white mb-2 uppercase tracking-tight" data-v-e3f9f3b1>\xA1Pr\xF3ximamente disponible!</h3><p class="text-gray-400 text-sm leading-relaxed mb-8" data-v-e3f9f3b1> Estamos integrando los pagos autom\xE1ticos. Por ahora, selecciona <span class="text-neon-green font-bold" data-v-e3f9f3b1>&quot;WhatsApp&quot;</span> para coordinar directamente. </p><button class="w-full py-4 bg-neon-green hover:bg-neon-green-dark text-black font-black rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] uppercase text-sm" data-v-e3f9f3b1> Entendido </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/checkout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const checkout = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e3f9f3b1"]]);

export { checkout as default };
//# sourceMappingURL=checkout-Buevg71-.mjs.map
