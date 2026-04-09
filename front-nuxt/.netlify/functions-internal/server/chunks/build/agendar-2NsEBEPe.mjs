import { _ as __nuxt_component_0 } from './nuxt-link-BV0nTBEl.mjs';
import { defineComponent, ref, reactive, computed, resolveComponent, mergeProps, withCtx, openBlock, createBlock, createVNode, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrRenderAttr } from 'vue/server-renderer';
import { _ as _export_sfc, u as useSeoMeta } from './_plugin-vue_export-helper-Bo5sx5t4.mjs';
import { u as useRoute, a as useRouter } from './server.mjs';
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

const servicios = [
  {
    value: "Corte Sencillo",
    label: "Corte Sencillo",
    desc: "Corte profesional con cualquier estilo del men\xFA.",
    icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-scissors">
      <circle cx="18" cy="46" r="6" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="18" cy="18" r="6" stroke="currentColor" stroke-width="2.5"/>
      <line x1="22.5" y1="21.5" x2="50" y2="12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="22.5" y1="42.5" x2="50" y2="52" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="35" y1="32" x2="50" y2="32" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`
  },
  {
    value: "Corte + Barba",
    label: "Corte + Barba",
    desc: "Corte completo con recorte y dise\xF1o de barba.",
    icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-cut-beard">
      <path d="M16 60 V52 C16 45 22 40 28 40 H36 C42 40 48 45 48 52 V60" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M24 40 L24 60M40 40 L40 60" stroke="currentColor" stroke-width="2"/>
      <g class="head-group">
        <path d="M24 25 C24 16 28 14 32 14 C36 14 40 16 40 25 V30 C40 37 36 40 32 40 C28 40 24 37 24 30 V25Z" stroke="currentColor" stroke-width="2"/>
        <path d="M23 18 C23 12 26 8 32 8 C38 8 41 12 41 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <circle cx="32" cy="7" r="3" stroke="currentColor" stroke-width="2"/>
        <path d="M24 25 C20 32 20 40 32 46 C44 40 44 32 40 25" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
        <path d="M28 38 C28 41 30 42 32 42 C34 42 36 41 36 38" stroke="currentColor" stroke-width="1.2" opacity="0.6"/>
        <path d="M26 34 C28 32 30 32 32 33 C34 32 36 32 38 34 C36 35 34 36 32 35 C30 36 28 35 26 34Z" stroke="currentColor" stroke-width="2"/>
      </g>
    </svg>`
  },
  {
    value: "Solo Barba",
    label: "Solo Barba",
    desc: "Recorte, forma y estilo de barba profesional.",
    icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-beard">
      <path d="M14 26 C20 26 24 20 32 20 C40 20 44 26 50 26 C46 30 40 32 32 30 C24 32 18 30 14 26Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M16 28 C14 36 16 44 24 50 C28 53 32 54 32 54 C32 54 36 53 40 50 C48 44 50 36 48 28" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 32 C20 40 26 48 32 50 C38 48 44 40 44 32" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    </svg>`
  },
  {
    value: "Depilaci\xF3n Nariz",
    label: "Depilaci\xF3n Nariz",
    desc: "Eliminaci\xF3n r\xE1pida y precisa de vellos nasales.",
    icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-nose">
      <path d="M32 14 C32 26 24 34 24 42 C24 48 28 50 32 50 C36 50 40 48 40 42 C40 34 32 26 32 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 42 C18 42 16 46 18 48 C20 50 24 50 26 46" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M42 42 C46 42 48 46 46 48 C44 50 40 50 38 46" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      <path d="M22 52 L20 56 M26 52 L28 58" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="icon-spark"/>
      <path d="M42 52 L44 56 M38 52 L36 58" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="icon-spark"/>
    </svg>`
  },
  {
    value: "Depilaci\xF3n O\xEDdos",
    label: "Depilaci\xF3n O\xEDdos",
    desc: "Tratamiento de vello en o\xEDdos limpio y sin dolor.",
    icon: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-ear">
      <path d="M24 18 C18 22 16 30 18 38 C20 44 26 50 30 50 C28 46 28 42 32 40 C36 38 40 34 40 28 C40 20 34 14 28 14 C22 14 18 18 18 24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M28 26 C28 26 32 28 32 32 C32 36 28 38 28 42" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="40" y1="10" x2="46" y2="6" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="icon-spark"/>
      <line x1="44" y1="16" x2="52" y2="14" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="icon-spark"/>
    </svg>`
  }
];
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "agendar",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Agendar Cita | PersonalBarber Medell\xEDn",
      ogTitle: "Agendar Cita | PersonalBarber",
      description: "Reserva tu cita online en PersonalBarber. Selecciona tu barbero, servicio y horario preferido en Medell\xEDn."
    });
    useRoute();
    useRouter();
    const success = ref(false);
    const isSubmitting = ref(false);
    const isLoadingSlots = ref(false);
    const bookedSlots = ref([]);
    const selectedDate = ref(null);
    const selectedTime = ref(null);
    const form = reactive({ nombre: "", telefono: "", servicio: "", direccion: "" });
    const availableTimeSlots = [
      "07:00 AM",
      "08:30 AM",
      "10:00 AM",
      "11:30 AM",
      "01:30 PM",
      "03:00 PM",
      "04:30 PM",
      "06:00 PM",
      "07:30 PM",
      "09:00 PM"
    ];
    ref(false);
    ref(0);
    ref(0);
    ref(false);
    ref(null);
    ref(null);
    const availableDays = computed(() => {
      const days = [];
      const today = /* @__PURE__ */ new Date();
      const dayNames = ["Dom", "Lun", "Mar", "Mi\xE9", "Jue", "Vie", "S\xE1b"];
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
      for (let i = 1; i <= 14; i++) {
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + i);
        days.push({
          rawDate: nextDate.toISOString().split("T")[0],
          name: i === 1 ? "Ma\xF1ana" : dayNames[nextDate.getDay()],
          number: nextDate.getDate(),
          month: monthNames[nextDate.getMonth()]
        });
      }
      return days;
    });
    const isTelefonoValido = computed(() => {
      const soloDigitos = form.telefono.replace(/[\s\-+]/g, "");
      return /^(57)?3\d{9}$/.test(soloDigitos);
    });
    const visibleTimeSlots = computed(() => {
      if (!selectedDate.value) return availableTimeSlots;
      return availableTimeSlots.filter((t) => !isSlotPasado(selectedDate.value, t));
    });
    const isFormValid = computed(
      () => selectedDate.value && selectedTime.value && form.nombre && isTelefonoValido.value && form.servicio && form.direccion
    );
    function isSlotOcupado(fecha, hora) {
      return bookedSlots.value.some((s) => s.fecha === fecha && s.hora === hora);
    }
    function isDiaLleno(fecha) {
      if (!fecha) return false;
      return bookedSlots.value.filter((s) => s.fecha === fecha).length >= availableTimeSlots.length;
    }
    function isDiaAgotado(fecha) {
      if (!fecha) return false;
      return availableTimeSlots.every((t) => isSlotOcupado(fecha, t) || isSlotPasado(fecha, t));
    }
    function isSlotPasado(fecha, hora) {
      const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
      if (fecha !== today) return false;
      const ahora = /* @__PURE__ */ new Date();
      const minutosAhora = ahora.getHours() * 60 + ahora.getMinutes();
      return a24h(hora) < minutosAhora + 15;
    }
    function a24h(horaStr) {
      if (!horaStr) return 0;
      const [time, period] = horaStr.split(" ");
      let [h, m] = time.split(":").map(Number);
      if (period === "PM" && h !== 12) h += 12;
      if (period === "AM" && h === 12) h = 0;
      return h * 60 + m;
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_fa_icon = resolveComponent("fa-icon");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-black min-h-screen text-white flex flex-col items-center px-4 py-8" }, _attrs))} data-v-92b36624><div class="w-full max-w-md bg-zinc-900 rounded-2xl p-6 shadow-xl border border-zinc-800" data-v-92b36624><div class="flex items-center justify-between mb-6" data-v-92b36624><h1 class="text-2xl font-bold text-white" data-v-92b36624>Reserva tu Cita</h1>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-zinc-400 hover:text-white transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-92b36624${_scopeId}><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" data-v-92b36624${_scopeId}></path></svg>`);
          } else {
            return [
              (openBlock(), createBlock("svg", {
                xmlns: "http://www.w3.org/2000/svg",
                class: "h-6 w-6",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor"
              }, [
                createVNode("path", {
                  "stroke-linecap": "round",
                  "stroke-linejoin": "round",
                  "stroke-width": "2",
                  d: "M6 18L18 6M6 6l12 12"
                })
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (unref(success)) {
        _push(`<div class="bg-green-900/40 border border-green-500 rounded-xl p-6 text-center mb-6 fade-in" data-v-92b36624><div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4" data-v-92b36624><svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" data-v-92b36624><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" data-v-92b36624></path></svg></div><h2 class="text-xl font-bold text-white mb-2" data-v-92b36624>\xA1Cita Reservada con \xC9xito!</h2><p class="text-zinc-300 text-sm" data-v-92b36624>El barbero ha sido notificado. Nos pondremos en contacto contigo pronto.</p><button class="mt-6 w-full py-3 bg-neon-green text-black font-bold rounded-xl hover:bg-neon-green-dark transition-all shadow-[0_0_15px_rgba(57,255,20,0.3)]" data-v-92b36624> Ver Productos y Gorras Medell\xEDn </button></div>`);
      } else {
        _push(`<form class="space-y-6 fade-in" data-v-92b36624><div data-v-92b36624><label class="block text-sm font-medium text-zinc-400 mb-3" data-v-92b36624>1. Selecciona el D\xEDa</label><div class="flex overflow-x-auto space-x-3 py-4 snap-x custom-scrollbar select-none" data-v-92b36624><!--[-->`);
        ssrRenderList(unref(availableDays), (day, index) => {
          _push(`<div class="${ssrRenderClass([
            "snap-center shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-2xl transition-all border outline-none relative",
            isDiaLleno(day.rawDate) ? "bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed opacity-60" : unref(selectedDate) === day.rawDate ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.4)] scale-110 cursor-pointer z-10" : "bg-zinc-800 text-white border-zinc-700 hover:border-zinc-500 hover:bg-zinc-700 cursor-pointer"
          ])}" data-v-92b36624><span class="${ssrRenderClass([unref(selectedDate) === day.rawDate ? "text-zinc-600" : isDiaLleno(day.rawDate) ? "text-zinc-700" : "text-zinc-400", "text-xs font-bold uppercase"])}" data-v-92b36624>${ssrInterpolate(day.name)}</span><span class="text-xl font-bold mt-1" data-v-92b36624>${ssrInterpolate(day.number)}</span><span class="${ssrRenderClass([unref(selectedDate) === day.rawDate ? "text-zinc-500" : isDiaLleno(day.rawDate) ? "text-zinc-700" : "text-zinc-500", "text-[10px]"])}" data-v-92b36624>${ssrInterpolate(day.month)}</span>`);
          if (isDiaLleno(day.rawDate)) {
            _push(`<span class="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full text-[8px] flex items-center justify-center font-bold" data-v-92b36624>\u2715</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div></div><div class="fade-in" style="${ssrRenderStyle(unref(selectedDate) ? null : { display: "none" })}" data-v-92b36624><div class="flex items-center justify-between mb-3" data-v-92b36624><label class="block text-sm font-medium text-zinc-400" data-v-92b36624>2. Selecciona la Hora</label>`);
        if (unref(isLoadingSlots)) {
          _push(`<span class="text-xs text-zinc-500 animate-pulse" data-v-92b36624>Verificando disponibilidad...</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (!unref(isLoadingSlots) && isDiaAgotado(unref(selectedDate))) {
          _push(`<div class="bg-zinc-800/50 border border-zinc-700 rounded-xl p-4 text-center mt-2" data-v-92b36624><p class="text-orange-500 text-sm font-medium" data-v-92b36624>\u26A0\uFE0F No hay turnos disponibles para este d\xEDa.</p><p class="text-zinc-500 text-xs mt-1" data-v-92b36624>Por favor selecciona otra fecha cercana.</p></div>`);
        } else {
          _push(`<div class="grid grid-cols-3 gap-3" data-v-92b36624><!--[-->`);
          ssrRenderList(unref(visibleTimeSlots), (time, index) => {
            _push(`<button type="button"${ssrIncludeBooleanAttr(unref(isLoadingSlots) || isSlotOcupado(unref(selectedDate), time)) ? " disabled" : ""} class="${ssrRenderClass([
              "py-3 rounded-xl font-semibold text-sm transition-all border relative",
              unref(isLoadingSlots) ? "bg-zinc-900 text-zinc-700 border-zinc-800 cursor-wait animate-pulse" : isSlotOcupado(unref(selectedDate), time) ? "bg-zinc-900 text-zinc-600 border-zinc-800 cursor-not-allowed line-through" : unref(selectedTime) === time ? "bg-neon-green text-black border-neon-green shadow-[0_0_15px_rgba(57,255,20,0.3)]" : "bg-zinc-800 text-white border-zinc-700 hover:bg-zinc-700 hover:border-neon-green hover:text-neon-green"
            ])}" data-v-92b36624>${ssrInterpolate(time)} `);
            if (isSlotOcupado(unref(selectedDate), time) && !unref(isLoadingSlots)) {
              _push(`<span class="block text-[9px] font-normal no-underline text-zinc-600" data-v-92b36624>Ocupado</span>`);
            } else {
              _push(`<!---->`);
            }
            _push(`</button>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div><div class="space-y-4 fade-in mt-6 pt-6 border-t border-zinc-800" style="${ssrRenderStyle(unref(selectedDate) && unref(selectedTime) ? null : { display: "none" })}" data-v-92b36624><label class="block text-sm font-medium text-zinc-400 mb-1" data-v-92b36624>3. Tus Datos</label><input type="text"${ssrRenderAttr("value", unref(form).nombre)} placeholder="Nombre Completo" required class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder-zinc-500" data-v-92b36624><input type="tel"${ssrRenderAttr("value", unref(form).telefono)} placeholder="WhatsApp: 301 123 4567" required maxlength="15" class="${ssrRenderClass([
          "w-full px-4 py-3 bg-zinc-800 border rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder-zinc-500",
          unref(form).telefono && !unref(isTelefonoValido) ? "border-red-500 ring-1 ring-red-500" : "border-zinc-700"
        ])}" data-v-92b36624>`);
        if (unref(form).telefono && !unref(isTelefonoValido)) {
          _push(`<p class="text-red-400 text-xs mt-1 ml-1" data-v-92b36624>Ingresa un n\xFAmero colombiano v\xE1lido (Ej: 301 123 4567)</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="service-selector-wrapper" data-v-92b36624><label class="block text-sm font-medium text-zinc-400 mb-3" data-v-92b36624>Selecciona el Servicio</label><div class="service-carousel select-none" data-v-92b36624><!--[-->`);
        ssrRenderList(unref(servicios), (srv) => {
          var _a2;
          _push(`<div class="${ssrRenderClass(["service-card", unref(form).servicio === srv.value ? "service-card--active" : ""])}" data-v-92b36624><div class="service-icon-wrapper" data-v-92b36624><div class="service-icon" data-v-92b36624>${(_a2 = srv.icon) != null ? _a2 : ""}</div></div><div class="service-info" data-v-92b36624><h3 class="service-name" data-v-92b36624>${ssrInterpolate(srv.label)}</h3><p class="service-desc" data-v-92b36624>${ssrInterpolate(srv.desc)}</p></div>`);
          if (unref(form).servicio === srv.value) {
            _push(`<div class="service-check" data-v-92b36624><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" data-v-92b36624><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" data-v-92b36624></path></svg></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div><div class="service-dots" data-v-92b36624><!--[-->`);
        ssrRenderList(unref(servicios), (srv, idx) => {
          _push(`<span class="${ssrRenderClass(["service-dot", unref(form).servicio === srv.value ? "service-dot--active" : ""])}" data-v-92b36624></span>`);
        });
        _push(`<!--]--></div>`);
        if (unref(form).servicio) {
          _push(`<div class="service-selected-badge" data-v-92b36624><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="badge-icon" data-v-92b36624><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" data-v-92b36624></path></svg><span data-v-92b36624>${ssrInterpolate((_a = unref(servicios).find((s) => s.value === unref(form).servicio)) == null ? void 0 : _a.label)}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="relative group" data-v-92b36624><textarea placeholder="Direcci\xF3n Domiciliar (Ej. Calle 45 # 12-34, Piso 2, Apto 201)" rows="2" required class="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl focus:ring-2 focus:ring-white focus:border-transparent outline-none transition-all text-white placeholder-zinc-500 resize-none" data-v-92b36624>${ssrInterpolate(unref(form).direccion)}</textarea>`);
        if (unref(form).direccion.length > 5) {
          _push(`<a${ssrRenderAttr("href", `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(unref(form).direccion)}`)} target="_blank" rel="noopener noreferrer" class="absolute right-3 bottom-3 text-[10px] font-bold text-neon-green hover:underline flex items-center gap-1 bg-zinc-900/80 px-2 py-1 rounded-lg backdrop-blur-sm transition-all" data-v-92b36624>`);
          _push(ssrRenderComponent(_component_fa_icon, { icon: ["fas", "map-marker-alt"] }, null, _parent));
          _push(` Verificar mapa </a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting) || !unref(isFormValid)) ? " disabled" : ""} class="w-full mt-4 py-4 bg-white text-black font-bold text-lg rounded-xl hover:bg-zinc-200 transition-colors flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-[1.02]" data-v-92b36624>`);
        if (unref(isSubmitting)) {
          _push(`<span data-v-92b36624>Procesando...</span>`);
        } else {
          _push(`<span data-v-92b36624>Confirmar Reserva</span>`);
        }
        _push(`</button></div></form>`);
      }
      _push(`</div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/agendar.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const agendar = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-92b36624"]]);

export { agendar as default };
//# sourceMappingURL=agendar-2NsEBEPe.mjs.map
