/* Formateo de valores para mostrar en pantalla (puro). */

/**
 * Formatea un número como pesos chilenos. Ej: formatearCLP(129990) -> "$129.990"
 * (se fija el separador de miles con un regex para que el resultado no dependa
 * de los datos de idioma del entorno, p. ej. en las pruebas).
 */
export function formatearCLP(valor) {
  const entero = Math.round(Number(valor) || 0)
  return '$' + String(entero).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

/** Fecha ISO -> "08-10-2026 22:30" (zona local). */
export function formatearFecha(iso) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const dos = (n) => String(n).padStart(2, '0')
  return `${dos(d.getDate())}-${dos(d.getMonth() + 1)}-${d.getFullYear()} ${dos(d.getHours())}:${dos(d.getMinutes())}`
}

/** "Guitarras Acústicas" -> "guitarras-acusticas" (ids de categoría y URLs). */
export function slug(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
