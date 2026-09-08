// composables/useProductFilters.ts
// Motor unificado de navegación facetada, filtros y persistencia en URL para PersonalBarber

import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalog, type Product } from '~/composables/useCatalog'
import {
  type CanonicalCategoryId,
  CANONICAL_CATEGORIES,
  normalizeProductCategory,
  normalizeCategorySlug,
  extractProductType,
  getCategorySubtypes,
} from '~/utils/taxonomy'

export type SortOptionId = 'default' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

export interface SortOption {
  id: SortOptionId
  label: string
}

export interface ActiveChip {
  id: string
  key: 'category' | 'brand' | 'price' | 'stock' | 'sort' | 'search' | 'type'
  label: string
  value?: string
}

export const SORT_OPTIONS: SortOption[] = [
  { id: 'default', label: 'Recomendados' },
  { id: 'price-asc', label: 'Precio: menor a mayor' },
  { id: 'price-desc', label: 'Precio: mayor a menor' },
  { id: 'name-asc', label: 'Nombre: A - Z' },
  { id: 'name-desc', label: 'Nombre: Z - A' },
]

export function useProductFilters(productsRef: Ref<Product[]>) {
  const route = useRoute()
  const router = useRouter()

  // ─── Estado reactivo principal de filtros ───
  const activeCategory = ref<CanonicalCategoryId | 'all'>('all')
  const searchQuery = ref('')
  const selectedBrands = ref<string[]>([])
  const minPrice = ref<number | null>(null)
  const maxPrice = ref<number | null>(null)
  const inStockOnly = ref(false)
  const sortBy = ref<SortOptionId>('default')
  const selectedProductType = ref<string | null>(null)

  // Flag interno para evitar loops reactivos entre router.replace y watchers
  let isSyncingFromRoute = false

  // ─── Límites reales de precios del catálogo ───
  const priceBounds = computed(() => {
    const list = productsRef.value.filter(p => p.is_active !== false)
    if (list.length === 0) return { min: 0, max: 500000 }
    let min = Infinity
    let max = 0
    for (const p of list) {
      const price = Number(p.price) || 0
      if (price < min) min = price
      if (price > max) max = price
    }
    return {
      min: min === Infinity ? 0 : min,
      max: max === 0 ? 500000 : max,
    }
  })

  // ─── Productos filtrados básicos (sin ordenar) ───
  // Helper que aplica filtros con posibilidad de excluir una dimensión específica (para facetas disjuntivas)
  function filterProductsExcluding(excludeDimension?: 'brand' | 'type' | 'category' | 'price' | 'stock' | 'search'): Product[] {
    return productsRef.value.filter(p => {
      if (p.is_active === false) return false

      // 1. Categoría
      if (excludeDimension !== 'category' && activeCategory.value !== 'all') {
        const normCat = normalizeProductCategory(p)
        if (normCat !== activeCategory.value) return false
      }

      // 2. Búsqueda por texto (nombre, marca, descripción)
      if (excludeDimension !== 'search' && searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase().trim()
        const pName = (p.name || '').toLowerCase()
        const pBrand = (p.brand || '').toLowerCase()
        const pDesc = (p.description || '').toLowerCase()
        if (!pName.includes(query) && !pBrand.includes(query) && !pDesc.includes(query)) {
          return false
        }
      }

      // 3. Marca (multi-select)
      if (excludeDimension !== 'brand' && selectedBrands.value.length > 0) {
        const pBrand = (p.brand || '').trim()
        if (!selectedBrands.value.includes(pBrand)) return false
      }

      // 4. Rango de precio
      if (excludeDimension !== 'price') {
        const price = Number(p.price) || 0
        if (minPrice.value !== null && price < minPrice.value) return false
        if (maxPrice.value !== null && price > maxPrice.value) return false
      }

      // 5. Stock
      if (excludeDimension !== 'stock' && inStockOnly.value) {
        if ((p.stock || 0) <= 0) return false
      }

      // 6. Subtipo específico según categoría
      if (excludeDimension !== 'type' && selectedProductType.value !== null) {
        const type = extractProductType(p)
        if (type !== selectedProductType.value) return false
      }

      return true
    })
  }

  // ─── Facetas de Marcas con Conteo Disjuntivo ───
  // Para calcular el conteo de una marca, se aplican todos los filtros EXCEPTO la marca
  // para que seleccionar una marca no haga desaparecer las otras (estilo marketplace)
  const availableBrandsWithCounts = computed(() => {
    const listWithoutBrandFilter = filterProductsExcluding('brand')
    const countMap: Record<string, number> = {}

    for (const p of listWithoutBrandFilter) {
      const b = (p.brand || '').trim()
      if (b) {
        countMap[b] = (countMap[b] || 0) + 1
      }
    }

    return Object.keys(countMap)
      .sort((a, b) => a.localeCompare(b))
      .map(brand => ({
        brand,
        count: countMap[brand],
        selected: selectedBrands.value.includes(brand),
      }))
  })

  const { categories: catalogCategories } = useCatalog()

  // ─── Facetas de Categorías con Conteo ───
  const categoriesWithCounts = computed(() => {
    const listWithoutCategoryFilter = filterProductsExcluding('category')
    const countMap: Record<string, number> = {}

    for (const p of listWithoutCategoryFilter) {
      const cat = normalizeProductCategory(p)
      if (cat) {
        countMap[cat] = (countMap[cat] || 0) + 1
      }
    }

    const totalCount = listWithoutCategoryFilter.length

    // Categorías base canónicas
    const knownCats: { id: any; label: string; icon: string; description: string }[] = [...CANONICAL_CATEGORIES]

    // Si en las categorías de MongoDB hay categorías adicionales con productos activos, añadirlas
    if (catalogCategories.value && catalogCategories.value.length > 0) {
      for (const dbCat of catalogCategories.value) {
        if (!knownCats.some(c => c.id === dbCat.id) && countMap[dbCat.id] > 0) {
          knownCats.push({
            id: dbCat.id,
            label: dbCat.label || dbCat.id,
            icon: dbCat.icon || 'fas fa-tag',
            description: (dbCat.subtitle as string) || '',
          })
        }
      }
    }

    // Regla inteligente: Solo mostrar categorías que tengan al menos 1 producto (count > 0)
    const activeCats = knownCats.filter(c => (countMap[c.id] || 0) > 0)

    return {
      all: totalCount,
      categories: activeCats.map(c => ({
        id: c.id,
        label: c.label,
        icon: c.icon,
        description: c.description,
        count: countMap[c.id] || 0,
        active: activeCategory.value === c.id,
      })),
    }
  })

  // ─── Facetas de Subtipos de Producto con Conteo ───
  const availableSubtypesWithCounts = computed(() => {
    if (activeCategory.value === 'all') return []
    const staticTypes = getCategorySubtypes(activeCategory.value as any)

    const listWithoutTypeFilter = filterProductsExcluding('type')
    const countMap: Record<string, number> = {}

    for (const p of listWithoutTypeFilter) {
      const type = extractProductType(p)
      if (type) {
        countMap[type] = (countMap[type] || 0) + 1
      }
    }

    // Unir tipos estáticos con cualquier tipo dinámico presente en los productos
    const allTypes = [...new Set([...staticTypes, ...Object.keys(countMap)])]

    return allTypes
      .filter(type => (countMap[type] || 0) > 0)
      .map(type => ({
        type,
        count: countMap[type] || 0,
        selected: selectedProductType.value === type,
      }))
  })

  // ─── Catálogo Filtrado Final ───
  const filteredProducts = computed(() => {
    let list = filterProductsExcluding()

    // Ordenamiento
    switch (sortBy.value) {
      case 'price-asc':
        return [...list].sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0))
      case 'price-desc':
        return [...list].sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0))
      case 'name-asc':
        return [...list].sort((a, b) => (a.name || '').localeCompare(b.name || ''))
      case 'name-desc':
        return [...list].sort((a, b) => (b.name || '').localeCompare(a.name || ''))
      case 'default':
      default:
        return list
    }
  })

  // ─── Conteo de Filtros Activos ───
  const activeFiltersCount = computed(() => {
    let count = 0
    if (activeCategory.value !== 'all') count++
    if (searchQuery.value.trim()) count++
    if (selectedBrands.value.length > 0) count += selectedBrands.value.length
    if (minPrice.value !== null || maxPrice.value !== null) count++
    if (inStockOnly.value) count++
    if (sortBy.value !== 'default') count++
    if (selectedProductType.value !== null) count++
    return count
  })

  // ─── Chips de Filtros Activos para la UI ───
  const activeChips = computed<ActiveChip[]>(() => {
    const chips: ActiveChip[] = []

    if (activeCategory.value !== 'all') {
      const cat = CANONICAL_CATEGORIES.find(c => c.id === activeCategory.value)
      chips.push({
        id: `cat-${activeCategory.value}`,
        key: 'category',
        label: `Categoría: ${cat ? cat.label : activeCategory.value}`,
        value: activeCategory.value,
      })
    }

    if (searchQuery.value.trim()) {
      chips.push({
        id: 'search',
        key: 'search',
        label: `Búsqueda: "${searchQuery.value.trim()}"`,
      })
    }

    for (const brand of selectedBrands.value) {
      chips.push({
        id: `brand-${brand}`,
        key: 'brand',
        label: brand,
        value: brand,
      })
    }

    if (selectedProductType.value !== null) {
      chips.push({
        id: `type-${selectedProductType.value}`,
        key: 'type',
        label: selectedProductType.value,
        value: selectedProductType.value,
      })
    }

    if (minPrice.value !== null || maxPrice.value !== null) {
      let priceLabel = ''
      if (minPrice.value !== null && maxPrice.value !== null) {
        priceLabel = `$${minPrice.value.toLocaleString('es-CO')} - $${maxPrice.value.toLocaleString('es-CO')}`
      } else if (minPrice.value !== null) {
        priceLabel = `Desde $${minPrice.value.toLocaleString('es-CO')}`
      } else if (maxPrice.value !== null) {
        priceLabel = `Hasta $${maxPrice.value.toLocaleString('es-CO')}`
      }
      chips.push({
        id: 'price',
        key: 'price',
        label: priceLabel,
      })
    }

    if (inStockOnly.value) {
      chips.push({
        id: 'stock',
        key: 'stock',
        label: 'Solo disponibles',
      })
    }

    return chips
  })

  // ─── Acciones de Mutación de Filtros ───
  function setCategory(cat: CanonicalCategoryId | 'all') {
    activeCategory.value = cat
    // Si cambia de categoría, se resetea el subtipo específico para evitar estados inválidos
    selectedProductType.value = null
  }

  function toggleBrand(brand: string) {
    const idx = selectedBrands.value.indexOf(brand)
    if (idx === -1) {
      selectedBrands.value.push(brand)
    } else {
      selectedBrands.value.splice(idx, 1)
    }
  }

  function setPriceRange(min: number | null, max: number | null) {
    minPrice.value = min
    maxPrice.value = max
  }

  function setProductType(type: string | null) {
    selectedProductType.value = selectedProductType.value === type ? null : type
  }

  function removeChip(chip: ActiveChip) {
    switch (chip.key) {
      case 'category':
        activeCategory.value = 'all'
        selectedProductType.value = null
        break
      case 'brand':
        if (chip.value) {
          selectedBrands.value = selectedBrands.value.filter(b => b !== chip.value)
        }
        break
      case 'price':
        minPrice.value = null
        maxPrice.value = null
        break
      case 'stock':
        inStockOnly.value = false
        break
      case 'type':
        selectedProductType.value = null
        break
      case 'search':
        searchQuery.value = ''
        break
      case 'sort':
        sortBy.value = 'default'
        break
    }
  }

  function resetAllFilters() {
    activeCategory.value = 'all'
    searchQuery.value = ''
    selectedBrands.value = []
    minPrice.value = null
    maxPrice.value = null
    inStockOnly.value = false
    sortBy.value = 'default'
    selectedProductType.value = null
  }

  // ─── Sincronización Bidireccional con URL (Query Params) ───
  function syncFiltersFromRoute() {
    isSyncingFromRoute = true
    const q = route.query

    // 1. Categoría
    const catParam = (q.cat as string) || (q.categoria as string)
    activeCategory.value = normalizeCategorySlug(catParam)

    // 2. Marcas
    if (q.brand) {
      const brandsRaw = Array.isArray(q.brand) ? q.brand.join(',') : String(q.brand)
      selectedBrands.value = brandsRaw
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
    } else {
      selectedBrands.value = []
    }

    // 3. Precios
    minPrice.value = q.min ? parseInt(String(q.min), 10) || null : null
    maxPrice.value = q.max ? parseInt(String(q.max), 10) || null : null

    // 4. Stock
    inStockOnly.value = q.stock === '1' || q.stock === 'true'

    // 5. Ordenamiento
    const sortParam = String(q.sort || 'default') as SortOptionId
    if (SORT_OPTIONS.some(o => o.id === sortParam)) {
      sortBy.value = sortParam
    } else {
      sortBy.value = 'default'
    }

    // 6. Búsqueda
    searchQuery.value = q.q ? String(q.q).trim() : ''

    // 7. Subtipo
    selectedProductType.value = q.type ? String(q.type).trim() : null

    nextTick(() => {
      isSyncingFromRoute = false
    })
  }

  function updateRouteFromFilters() {
    if (isSyncingFromRoute) return

    const query: Record<string, string> = {}

    // Preservar query params no relacionados si los hubiera
    for (const [k, v] of Object.entries(route.query)) {
      if (!['cat', 'categoria', 'brand', 'min', 'max', 'stock', 'sort', 'q', 'type'].includes(k) && v) {
        query[k] = String(v)
      }
    }

    if (activeCategory.value !== 'all') {
      query.cat = activeCategory.value
    }
    if (selectedBrands.value.length > 0) {
      query.brand = selectedBrands.value.join(',')
    }
    if (minPrice.value !== null) {
      query.min = String(minPrice.value)
    }
    if (maxPrice.value !== null) {
      query.max = String(maxPrice.value)
    }
    if (inStockOnly.value) {
      query.stock = '1'
    }
    if (sortBy.value !== 'default') {
      query.sort = sortBy.value
    }
    if (searchQuery.value.trim()) {
      query.q = searchQuery.value.trim()
    }
    if (selectedProductType.value) {
      query.type = selectedProductType.value
    }

    router.replace({ query })
  }

  // Vigilar cambios en los filtros para actualizar la URL
  watch(
    [activeCategory, searchQuery, selectedBrands, minPrice, maxPrice, inStockOnly, sortBy, selectedProductType],
    () => {
      updateRouteFromFilters()
    },
    { deep: true }
  )

  // Vigilar cambios en route.query (ej. botón atrás/adelante del navegador)
  watch(
    () => route.query,
    () => {
      syncFiltersFromRoute()
    }
  )

  // Inicializar al montar
  syncFiltersFromRoute()

  return {
    // Estado
    activeCategory,
    searchQuery,
    selectedBrands,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
    selectedProductType,
    priceBounds,

    // Facetas y conteos
    availableBrandsWithCounts,
    categoriesWithCounts,
    availableSubtypesWithCounts,
    filteredProducts,
    activeFiltersCount,
    activeChips,

    // Acciones
    setCategory,
    toggleBrand,
    setPriceRange,
    setProductType,
    removeChip,
    resetAllFilters,
    syncFiltersFromRoute,
  }
}
