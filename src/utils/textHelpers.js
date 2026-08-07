/**
 * Calcula el tiempo de lectura estimado en minutos (promedio 200 palabras/minuto)
 */
export function calculateReadingTime(text = '') {
  if (!text) return 1;
  const cleanText = text.replace(/<[^>]*>/g, ' ').trim();
  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.ceil(wordCount / 200);
  return Math.max(1, minutes);
}

/**
 * Genera un slug limpio y legible para URLs a partir del título
 */
export function generateSlug(text = '') {
  if (!text) return 'publicacion-sin-titulo';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
    .replace(/[^a-z0-9 -]/g, '') // Eliminar caracteres especiales
    .replace(/\s+/g, '-') // Reemplazar espacios por guiones
    .replace(/-+/g, '-'); // Eliminar guiones duplicados
}

/**
 * Extrae un resumen plano de hasta N caracteres eliminando HTML
 */
export function extractExcerpt(text = '', maxLength = 160) {
  if (!text) return '';
  const cleanText = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.slice(0, maxLength).trim() + '...';
}

/**
 * Formatea una fecha ISO a español legible
 */
export function formatDate(isoDateString) {
  if (!isoDateString) return '';
  try {
    const date = new Date(isoDateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    return isoDateString;
  }
}
