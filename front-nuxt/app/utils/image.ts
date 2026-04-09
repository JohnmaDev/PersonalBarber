/**
 * Optimiza imágenes de Cloudinary dinámicamente.
 * Inyecta f_auto, q_auto y opcionalmente w_{width} con c_limit.
 *
 * @param url   - URL de Cloudinary u otra fuente
 * @param width - Ancho máximo en píxeles (0 = sin resize)
 *   Valores recomendados:
 *     100  → thumbnails en carrito/checkout
 *     400  → tarjetas de tienda
 *     800  → detalle de producto
 *     1200 → hero/headers
 */
export function optimizeImage(url: string | undefined, width = 0): string {
  if (!url) return '/hero_barber.webp'

  // Si no es Cloudinary, lo devolvemos tal cual
  if (!url.includes('cloudinary.com')) {
    return url
  }

  // Si ya tiene transformaciones, no duplicamos
  if (url.includes('/f_auto') || url.includes('/q_auto')) {
    return url
  }

  const transform = width > 0
    ? `f_auto,q_auto,w_${width},c_limit`
    : 'f_auto,q_auto'

  const parts = url.split('/upload/')
  if (parts.length === 2) {
    return `${parts[0]}/upload/${transform}/${parts[1]}`
  }

  return url
}
