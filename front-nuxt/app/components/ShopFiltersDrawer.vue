<template>
  <Transition name="drawer">
    <div v-if="isOpen" class="fixed inset-0 z-[80] flex justify-end">
      <!-- Backdrop con blur táctil -->
      <div 
        @click="close" 
        class="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity cursor-pointer"
        aria-hidden="true"
      ></div>

      <!-- Panel del Drawer -->
      <div 
        class="relative w-full max-w-md bg-zinc-950 border-l border-zinc-800/80 h-full flex flex-col z-10 shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filters-title"
      >
        <!-- ─── Header ─── -->
        <div class="p-5 sm:p-6 border-b border-zinc-800/80 flex items-center justify-between bg-zinc-900/60 backdrop-blur-sm">
          <div class="flex items-center gap-3">
            <span class="w-2.5 h-2.5 rounded-full dept-bg shadow-[0_0_8px_var(--dept-color)]"></span>
            <h2 id="filters-title" class="text-base font-black uppercase tracking-tight text-white">Filtros</h2>
            <span v-if="activeDrawerFiltersCount > 0" class="px-2.5 py-0.5 rounded-full text-[10px] font-black dept-bg text-black shadow-sm">
              {{ activeDrawerFiltersCount }} activos
            </span>
          </div>
          <button 
            @click="close" 
            class="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            aria-label="Cerrar filtros"
          >
            <fa-icon :icon="['fas', 'times']" class="text-sm" />
          </button>
        </div>

        <!-- ─── Body Scrollable (Touch-First & Visual Pills) ─── -->
        <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 no-scrollbar">

          <!-- 1. CATEGORÍA (Jerarquía Nivel 1) -->
          <div class="space-y-2.5">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-black uppercase tracking-wider text-zinc-400">Categoría</label>
              <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Navegación</span>
            </div>

            <div class="flex flex-wrap gap-2">
              <!-- Botón Todas -->
              <button
                type="button"
                @click="selectCategory('all')"
                class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer select-none"
                :class="localCategory === 'all'
                  ? 'dept-bg text-black font-black border-transparent shadow-[0_0_12px_var(--dept-glow)] scale-[1.02]'
                  : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'"
              >
                <span>Todas</span>
                <span v-if="localCategory === 'all'" class="text-[11px] font-black">✓</span>
              </button>

              <!-- Categorías canónicas -->
              <button
                v-for="cat in categoriesWithCounts.categories"
                :key="cat.id"
                type="button"
                @click="selectCategory(cat.id)"
                class="px-3.5 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer select-none"
                :class="localCategory === cat.id
                  ? 'dept-bg text-black font-black border-transparent shadow-[0_0_12px_var(--dept-glow)] scale-[1.02]'
                  : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'"
              >
                <span>{{ cat.label }}</span>
                <span v-if="localCategory === cat.id" class="text-[11px] font-black">✓</span>
              </button>
            </div>
          </div>

          <!-- 2. TIPO DE PRODUCTO (Jerarquía Nivel 2 dinámico, aparece según categoría) -->
          <Transition name="fade">
            <div 
              v-if="subtypesWithCounts.length > 0" 
              class="space-y-2.5 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 shadow-inner"
            >
              <div class="flex items-center justify-between">
                <label class="text-[11px] font-black uppercase tracking-wider dept-text flex items-center gap-1.5">
                  <fa-icon :icon="['fas', 'layer-group']" class="text-[10px]" />
                  <span>{{ specificFilterLabel }}</span>
                </label>
                <button 
                  v-if="localProductType" 
                  @click="localProductType = null; emitUpdate()" 
                  class="text-[11px] font-bold text-red-400 hover:underline cursor-pointer"
                >
                  Limpiar tipo
                </button>
              </div>

              <div class="flex flex-wrap gap-2">
                <button
                  v-for="st in subtypesWithCounts"
                  :key="st.type"
                  type="button"
                  @click="toggleSubtype(st.type)"
                  class="px-3 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer select-none"
                  :class="localProductType === st.type
                    ? 'dept-bg text-black font-black border-transparent shadow-[0_0_12px_var(--dept-glow)] scale-[1.02]'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'"
                >
                  <span>{{ st.type }}</span>
                  <span v-if="localProductType === st.type" class="text-[11px] font-black">✓</span>
                </button>
              </div>
            </div>
          </Transition>

          <!-- 3. MARCA (Jerarquía Nivel 3 - Cloud de Píldoras Multi-Select) -->
          <div v-if="brandsWithCounts.length > 0" class="space-y-2.5 pt-1 border-t border-zinc-900">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-black uppercase tracking-wider text-zinc-400">Marca</label>
              <button 
                v-if="localBrands.length > 0" 
                @click="localBrands = []; emitUpdate()" 
                class="text-[11px] font-bold text-red-400 hover:underline cursor-pointer"
              >
                Limpiar marcas ({{ localBrands.length }})
              </button>
            </div>

            <!-- Píldoras táctiles solo con nombre de la marca (0 escritura requerida) -->
            <div class="flex flex-wrap gap-2">
              <button
                v-for="b in brandsWithCounts"
                :key="b.brand"
                type="button"
                @click="toggleBrand(b.brand)"
                class="px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer select-none"
                :class="localBrands.includes(b.brand)
                  ? 'dept-bg text-black font-black border-transparent shadow-[0_0_10px_var(--dept-glow)] scale-[1.02]'
                  : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'"
              >
                <span>{{ b.brand }}</span>
                <span v-if="localBrands.includes(b.brand)" class="text-[11px] font-black">✓</span>
              </button>
            </div>
          </div>

          <!-- 4. PRECIO (Jerarquía Nivel 4 - Píldoras de Rango Rápido de 1 Click) -->
          <div class="space-y-2.5 pt-1 border-t border-zinc-900">
            <div class="flex items-center justify-between">
              <label class="text-[11px] font-black uppercase tracking-wider text-zinc-400">Precio</label>
              <button 
                v-if="localMinPrice !== null || localMaxPrice !== null" 
                @click="localMinPrice = null; localMaxPrice = null; emitUpdate()" 
                class="text-[11px] font-bold text-red-400 hover:underline cursor-pointer"
              >
                Limpiar precio
              </button>
            </div>

            <!-- Trío de píldoras de 1 solo toque -->
            <div class="grid grid-cols-3 gap-2">
              <button
                type="button"
                @click="togglePricePreset(null, 50000)"
                class="py-2.5 px-2 rounded-xl text-xs font-bold text-center border transition-all truncate cursor-pointer select-none"
                :class="localMinPrice === null && localMaxPrice === 50000
                  ? 'dept-bg text-black font-black border-transparent shadow-[0_0_10px_var(--dept-glow)]'
                  : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'"
              >
                <span>&lt; $50.000</span>
              </button>
              <button
                type="button"
                @click="togglePricePreset(50000, 150000)"
                class="py-2.5 px-2 rounded-xl text-xs font-bold text-center border transition-all truncate cursor-pointer select-none"
                :class="localMinPrice === 50000 && localMaxPrice === 150000
                  ? 'dept-bg text-black font-black border-transparent shadow-[0_0_10px_var(--dept-glow)]'
                  : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'"
              >
                <span>$50k – $150k</span>
              </button>
              <button
                type="button"
                @click="togglePricePreset(150000, null)"
                class="py-2.5 px-2 rounded-xl text-xs font-bold text-center border transition-all truncate cursor-pointer select-none"
                :class="localMinPrice === 150000 && localMaxPrice === null
                  ? 'dept-bg text-black font-black border-transparent shadow-[0_0_10px_var(--dept-glow)]'
                  : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'"
              >
                <span>&gt; $150.000</span>
              </button>
            </div>

            <!-- Rango numérico opcional / colapsable -->
            <div class="pt-1">
              <button
                type="button"
                @click="showCustomPrice = !showCustomPrice"
                class="text-[10px] font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <fa-icon :icon="['fas', showCustomPrice ? 'chevron-up' : 'chevron-down']" class="text-[8px]" />
                <span>{{ showCustomPrice ? 'Ocultar rango personalizado' : 'Rango personalizado en pesos...' }}</span>
              </button>

              <div v-if="showCustomPrice" class="grid grid-cols-2 gap-3 mt-2">
                <div>
                  <span class="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">Mínimo</span>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                    <input 
                      v-model.number="localMinPrice" 
                      @change="emitUpdate"
                      type="number" 
                      placeholder="0"
                      min="0"
                      step="5000"
                      class="w-full pl-7 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>
                <div>
                  <span class="text-[9px] text-zinc-500 uppercase font-bold tracking-wider block mb-1">Máximo</span>
                  <div class="relative">
                    <span class="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-xs">$</span>
                    <input 
                      v-model.number="localMaxPrice" 
                      @change="emitUpdate"
                      type="number" 
                      placeholder="500.000"
                      min="0"
                      step="5000"
                      class="w-full pl-7 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 5. DISPONIBILIDAD (Jerarquía Nivel 5 - Píldora Toggle de Estado) -->
          <div class="space-y-2 pt-1 border-t border-zinc-900">
            <label class="text-[11px] font-black uppercase tracking-wider text-zinc-400 block mb-1">Disponibilidad</label>
            <button
              type="button"
              @click="localInStock = !localInStock; emitUpdate()"
              class="w-full py-3 px-4 rounded-2xl text-xs font-bold transition-all border flex items-center justify-between cursor-pointer select-none"
              :class="localInStock
                ? 'dept-bg text-black font-black border-transparent shadow-[0_0_12px_var(--dept-glow)]'
                : 'bg-zinc-900/90 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'"
            >
              <div class="flex items-center gap-2.5">
                <fa-icon :icon="['fas', 'box-open']" class="text-xs" />
                <span>Solo productos disponibles con stock</span>
              </div>
              <span class="text-xs font-black">
                {{ localInStock ? '✓ Activo' : '○ Todo' }}
              </span>
            </button>
          </div>

        </div>

        <!-- ─── Footer Flotante con Acciones ─── -->
        <div class="p-5 sm:p-6 border-t border-zinc-800/80 bg-zinc-900/95 flex items-center gap-3 shadow-lg">
          <button 
            type="button"
            @click="resetAll" 
            class="flex-1 py-3 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-center cursor-pointer"
          >
            Restablecer
          </button>
          <button 
            type="button"
            @click="close" 
            class="flex-[2] py-3.5 px-5 dept-bg text-black rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-lg hover:brightness-110 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Ver {{ totalMatchingProducts }} productos</span>
            <fa-icon :icon="['fas', 'arrow-right']" class="text-[10px]" />
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  isOpen: boolean
  categoriesWithCounts: { all: number; categories: { id: string; label: string; count: number; active: boolean }[] }
  brandsWithCounts: { brand: string; count: number; selected: boolean }[]
  subtypesWithCounts: { type: string; count: number; selected: boolean }[]
  selectedCategory: string
  selectedBrands: string[]
  selectedProductType: string | null
  minPrice: number | null
  maxPrice: number | null
  priceBounds: { min: number; max: number }
  inStockOnly: boolean
  totalMatchingProducts: number
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (
    e: 'update:filters',
    payload: {
      selectedCategory: string
      selectedBrands: string[]
      selectedProductType: string | null
      minPrice: number | null
      maxPrice: number | null
      inStockOnly: boolean
    }
  ): void
  (e: 'reset'): void
}>()

const localCategory = ref('all')
const localBrands = ref<string[]>([])
const localProductType = ref<string | null>(null)
const localMinPrice = ref<number | null>(null)
const localMaxPrice = ref<number | null>(null)
const localInStock = ref(false)
const showCustomPrice = ref(false)

// Conteo total de filtros activos reflejados en el badge del drawer
const activeDrawerFiltersCount = computed(() => {
  let count = 0
  if (localCategory.value !== 'all') count++
  if (localBrands.value.length > 0) count += localBrands.value.length
  if (localMinPrice.value !== null || localMaxPrice.value !== null) count++
  if (localInStock.value) count++
  if (localProductType.value !== null) count++
  return count
})

// Etiqueta del filtro específico según categoría activa
const specificFilterLabel = computed(() => {
  switch (localCategory.value) {
    case 'ceras':
      return 'Tipo de fijador / producto'
    case 'maquinas':
      return 'Tipo de máquina'
    case 'afeitado':
      return 'Tipo de producto'
    case 'insumos':
      return 'Presentación / volumen'
    case 'tratamientos':
      return 'Formato'
    case 'bienestar':
      return 'Zona / función'
    default:
      return 'Tipo específico'
  }
})

// Sincronizar estado local con props al abrir el drawer
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      localCategory.value = props.selectedCategory || 'all'
      localBrands.value = [...(props.selectedBrands || [])]
      localProductType.value = props.selectedProductType || null
      localMinPrice.value = props.minPrice
      localMaxPrice.value = props.maxPrice
      localInStock.value = props.inStockOnly
      showCustomPrice.value = (props.minPrice !== null && props.minPrice !== 50000 && props.minPrice !== 150000) ||
                              (props.maxPrice !== null && props.maxPrice !== 50000 && props.maxPrice !== 150000)
    }
  }
)

// También sincronizar categoría si cambia externamente (ej. navegación superior)
watch(
  () => props.selectedCategory,
  (newCat) => {
    localCategory.value = newCat || 'all'
  }
)

function emitUpdate() {
  emit('update:filters', {
    selectedCategory: localCategory.value,
    selectedBrands: [...localBrands.value],
    selectedProductType: localProductType.value,
    minPrice: localMinPrice.value,
    maxPrice: localMaxPrice.value,
    inStockOnly: localInStock.value,
  })
}

function selectCategory(catId: string) {
  localCategory.value = catId
  localProductType.value = null // resetear subtipo al cambiar categoría
  emitUpdate()
}

function toggleBrand(brand: string) {
  const index = localBrands.value.indexOf(brand)
  if (index === -1) {
    localBrands.value.push(brand)
  } else {
    localBrands.value.splice(index, 1)
  }
  emitUpdate()
}

function toggleSubtype(type: string) {
  localProductType.value = localProductType.value === type ? null : type
  emitUpdate()
}

function togglePricePreset(min: number | null, max: number | null) {
  if (localMinPrice.value === min && localMaxPrice.value === max) {
    localMinPrice.value = null
    localMaxPrice.value = null
  } else {
    localMinPrice.value = min
    localMaxPrice.value = max
  }
  emitUpdate()
}

function resetAll() {
  localCategory.value = 'all'
  localBrands.value = []
  localProductType.value = null
  localMinPrice.value = null
  localMaxPrice.value = null
  localInStock.value = false
  emit('reset')
}

function close() {
  emit('close')
}

// Cerrar con tecla Escape
function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.isOpen) {
    close()
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeydown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<style scoped>
.dept-bg {
  background-color: var(--dept-color);
  transition: background-color 0.5s ease;
}
.dept-text {
  color: var(--dept-color);
  transition: color 0.5s ease;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.3s ease;
}
.drawer-enter-active > div:last-child,
.drawer-leave-active > div:last-child {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-from > div:last-child,
.drawer-leave-to > div:last-child {
  transform: translateX(100%);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
