// utils/taxonomy.ts
// Taxonomía definitiva aprobada de PersonalBarber (58 productos en 7 categorías canónicas)
// y extractor determinístico de características y tipos de producto.

export type CanonicalCategoryId =
  | 'ceras'
  | 'maquinas'
  | 'planchas'
  | 'afeitado'
  | 'insumos'
  | 'tratamientos'
  | 'bienestar'

export interface CanonicalCategory {
  id: CanonicalCategoryId
  label: string
  icon: string
  description: string
}

export const CANONICAL_CATEGORIES: CanonicalCategory[] = [
  { id: 'ceras', label: 'Ceras', icon: 'fas fa-spray-can', description: 'Ceras, pomadas, polvos voluminizadores y geles' },
  { id: 'maquinas', label: 'Máquinas', icon: 'fas fa-plug', description: 'Clippers, trimmers, shavers y kits profesionales' },
  { id: 'planchas', label: 'Planchas', icon: 'fas fa-fire', description: 'Planchas alisadoras profesionales Remington' },
  { id: 'afeitado', label: 'Afeitado', icon: 'fas fa-cut', description: 'Geles para afeitar y colonias after shave' },
  { id: 'insumos', label: 'Insumos', icon: 'fas fa-box', description: 'Aceites lubricantes y suministros para barbería' },
  { id: 'tratamientos', label: 'Tratamientos', icon: 'fas fa-pump-soap', description: 'Minoxidil y tratamientos capilares' },
  { id: 'bienestar', label: 'Bienestar', icon: 'fas fa-spa', description: 'Pistolas de masaje y relajación ocular' },
]

// Mapeo determinístico de reasignaciones auditadas (16 IDs) antes y después de migración física
const AUDITED_PRODUCT_CATEGORY_MAP: Record<number, CanonicalCategoryId> = {
  16: 'bienestar',
  17: 'bienestar',
  18: 'insumos',
  19: 'insumos',
  20: 'insumos',
  30: 'ceras',
  45: 'planchas',
  46: 'planchas',
  47: 'planchas',
  48: 'planchas',
  49: 'planchas',
  50: 'planchas',
  51: 'planchas',
  56: 'maquinas',
  62: 'maquinas',
  64: 'maquinas',
}

// Aliases de categorías legadas
const CATEGORY_ALIASES: Record<string, CanonicalCategoryId> = {
  'insumos-barberia': 'insumos',
  'capilar-mujer': 'planchas',
}

/**
 * Normaliza la categoría de un producto considerando:
 * 1. Reasignaciones auditadas por ID de producto (máxima prioridad)
 * 2. Aliases de categorías legadas ('insumos-barberia' -> 'insumos', 'capilar-mujer' -> 'planchas')
 * 3. Categoría propia del producto si ya es canónica
 */
export function normalizeProductCategory(product: { id: number; category?: string; name?: string }): CanonicalCategoryId {
  if (AUDITED_PRODUCT_CATEGORY_MAP[product.id]) {
    return AUDITED_PRODUCT_CATEGORY_MAP[product.id]
  }
  const rawCat = (product.category || '').toLowerCase().trim()
  if (CATEGORY_ALIASES[rawCat]) {
    return CATEGORY_ALIASES[rawCat]
  }
  if (CANONICAL_CATEGORIES.some(c => c.id === rawCat)) {
    return rawCat as CanonicalCategoryId
  }
  return 'ceras'
}

/**
 * Normaliza cualquier slug o ID de categoría que provenga de la URL o estado legado
 */
export function normalizeCategorySlug(slug: string | null | undefined): CanonicalCategoryId | 'all' {
  if (!slug || slug === 'all') return 'all'
  const clean = slug.toLowerCase().trim()
  if (CATEGORY_ALIASES[clean]) {
    return CATEGORY_ALIASES[clean]
  }
  if (CANONICAL_CATEGORIES.some(c => c.id === clean)) {
    return clean as CanonicalCategoryId
  }
  return 'all'
}

/**
 * Extracción determinística del tipo de producto basada en el nombre y categoría normalizada.
 * Utiliza un orden estricto de precedencia para evitar cualquier colisión.
 */
export function extractProductType(product: { id: number; name: string; category?: string }): string | null {
  const cat = normalizeProductCategory(product)
  const nameLower = (product.name || '').toLowerCase()

  switch (cat) {
    case 'ceras':
      if (nameLower.includes('polvo') || nameLower.includes('powder')) {
        return 'Polvo Voluminizador'
      }
      if (nameLower.includes('gel')) {
        return 'Gel en Crema'
      }
      if (nameLower.includes('fibra') || nameLower.includes('fiber')) {
        return 'Crema de Fibra'
      }
      return 'Cera / Pomada clásica'

    case 'maquinas':
      if (nameLower.includes('kit de corte') || nameLower.includes('grooming kit')) {
        return 'Kit de corte'
      }
      // Trimmer/Patillera DEBE evaluarse antes de Cortadora para capturar correctamente ID 55
      // "Cortadora Personal Indestructible Remington (Kit Patillera)"
      if (nameLower.includes('patillera') || nameLower.includes('trimmer')) {
        return 'Trimmer (Patillera)'
      }
      if (nameLower.includes('afeitadora') || nameLower.includes('rasuradora')) {
        return 'Shaver (Rasuradora)'
      }
      if (
        nameLower.includes('máquina de corte') ||
        nameLower.includes('cortadora') ||
        nameLower.includes('clipper') ||
        nameLower.includes('ng-8088') ||
        nameLower.includes('ng-v2') ||
        nameLower.includes('ng-x1')
      ) {
        return 'Clipper (Máquina de corte)'
      }
      return 'Clipper (Máquina de corte)'

    case 'afeitado':
      if (nameLower.includes('after shave') || nameLower.includes('aftershave') || nameLower.includes('colonia')) {
        return 'After Shave'
      }
      if (nameLower.includes('gel para afeitar') || nameLower.includes('shaving gel') || nameLower.includes('gel')) {
        return 'Gel de Afeitar'
      }
      return null

    case 'insumos':
      if (nameLower.includes('30 ml') || nameLower.includes('30ml')) {
        return '30 ml'
      }
      if (nameLower.includes('60 ml') || nameLower.includes('60ml')) {
        return '60 ml'
      }
      if (nameLower.includes('118') || nameLower.includes('118.3')) {
        return '118 ml'
      }
      return null

    case 'tratamientos':
      if (product.id === 11 || nameLower.includes('x1')) {
        return '1 Frasco (60 ml)'
      }
      if (product.id === 12 || nameLower.includes('x3')) {
        return 'Pack x3 (180 ml)'
      }
      if (product.id === 58 || nameLower.includes('aplicador')) {
        return 'Con Aplicador'
      }
      return null

    case 'bienestar':
      if (nameLower.includes('masaje muscular') || nameLower.includes('pistola')) {
        return 'Masaje Muscular'
      }
      if (nameLower.includes('ocular') || nameLower.includes('ojos')) {
        return 'Relajación Ocular'
      }
      return null

    case 'planchas':
    default:
      return null
  }
}

/**
 * Retorna las opciones de subtipo disponibles para una categoría dada
 */
export function getCategorySubtypes(cat: CanonicalCategoryId): string[] {
  switch (cat) {
    case 'ceras':
      return ['Cera / Pomada clásica', 'Polvo Voluminizador', 'Gel en Crema', 'Crema de Fibra']
    case 'maquinas':
      return ['Clipper (Máquina de corte)', 'Trimmer (Patillera)', 'Shaver (Rasuradora)', 'Kit de corte']
    case 'afeitado':
      return ['Gel de Afeitar', 'After Shave']
    case 'insumos':
      return ['30 ml', '60 ml', '118 ml']
    case 'tratamientos':
      return ['1 Frasco (60 ml)', 'Pack x3 (180 ml)', 'Con Aplicador']
    case 'bienestar':
      return ['Masaje Muscular', 'Relajación Ocular']
    case 'planchas':
    default:
      return []
  }
}
