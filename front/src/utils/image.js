/**
 * Utilidad para optimizar imágenes de Cloudinary dinámicamente
 * Inyecta parámetros de transformación como f_auto (formato automático) 
 * y q_auto (calidad automática) para mejorar el rendimiento.
 */
export function optimizeImage(url, transform = 'f_auto,q_auto') {
  if (!url) return '/placeholder-product.webp';
  
  // Si no es un enlace de Cloudinary, lo devolvemos tal cual
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  // Si ya tiene parámetros de transformación, no hacemos nada
  if (url.includes('/f_auto') || url.includes('/q_auto')) {
    return url;
  }

  // Inyectamos los parámetros después de '/upload/'
  const parts = url.split('/upload/');
  if (parts.length === 2) {
    return `${parts[0]}/upload/${transform}/${parts[1]}`;
  }

  return url;
}
