/**
 * Formatea un número como moneda colombiana (COP)
 * Ejemplo: 45000 → $45.000 COP
 */
export function formatPrice(value: string | number): string {
  let num: number
  if (typeof value === 'string') {
    const digits = value.replace(/\D/g, '')
    num = parseInt(digits, 10) || 0
  } else {
    num = value
  }

  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  })

  return `${formatter.format(num)} COP`
}

/**
 * Genera un slug SEO-friendly combinando id y nombre
 * Ejemplo: (1, 'NishMan Wax') → '1-nishman-wax'
 */
export function generateProductSlug(id: number | string, name: string): string {
  if (!name) return String(id)
  const cleanName = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return `${id}-${cleanName}`
}

/**
 * Extrae el ID numérico de un slug "id-nombre-producto"
 */
export function getIdFromSlug(slug: string): number {
  const parts = slug.split('-')
  return parseInt(parts[0], 10) || 0
}
