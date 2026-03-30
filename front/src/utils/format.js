/**
 * Formatea un número como moneda colombiana (COP)
 * Ejemplo: 45000 -> $45.000 COP
 */
export function formatPrice(value) {
  if (typeof value === 'string') {
    // Si ya viene formateado (datos viejos), limpiamos y re-formateamos
    const digits = value.replace(/\D/g, '');
    value = parseInt(digits, 10) || 0;
  }
  
  const formatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });

  return `${formatter.format(value)} COP`;
}

/**
 * Genera un slug SEO-friendly combinando id y nombre
 * Ejemplo: (1, 'NishMan Wax') -> '1-nishman-wax'
 */
export function generateProductSlug(id, name) {
  if (!name) return String(id);
  const cleanName = name
    .toLowerCase()
    .normalize('NFD') // Separa acentos
    .replace(/[\u0300-\u036f]/g, '') // Elimina acentos
    .replace(/[^a-z0-9]+/g, '-') // Reemplaza espacios y símbolos con -
    .replace(/^-+|-+$/g, ''); // Quita guiones iniciales o finales
  
  return `${id}-${cleanName}`;
}
