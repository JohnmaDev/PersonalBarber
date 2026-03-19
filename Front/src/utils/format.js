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
