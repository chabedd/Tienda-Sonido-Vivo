/* Regiones y comunas (portado de JS/regiones-comunas.js, ahora como módulo puro). */

export const REGIONES_COMUNAS = {
  'Región Metropolitana de Santiago': ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú', 'Puente Alto'],
  'Región de Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'San Antonio', 'Quillota'],
  'Región del Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles', 'Coronel', 'San Pedro de la Paz'],
  'Región de Ñuble': ['Chillán', 'Chillán Viejo', 'San Carlos', 'Bulnes'],
  'Región de la Araucanía': ['Temuco', 'Padre Las Casas', 'Villarrica', 'Angol'],
  'Región de Los Lagos': ['Puerto Montt', 'Osorno', 'Castro', 'Puerto Varas'],
}

/** Nombres de región, en el orden definido arriba. */
export function obtenerListaRegiones() {
  return Object.keys(REGIONES_COMUNAS)
}

/** Comunas de una región; lista vacía si la región no existe. */
export function obtenerComunasPorRegion(region) {
  return REGIONES_COMUNAS[region] || []
}
