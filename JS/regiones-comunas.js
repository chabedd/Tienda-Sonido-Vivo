/* =========================================================
   SONIDO VIVO — Regiones y Comunas
   Arreglo complementario para los selects dependientes de
   Región/Comuna (registro de usuario y mantenedor de usuarios
   en el administrador).
   ========================================================= */

const REGIONES_COMUNAS = {
  "Región Metropolitana de Santiago": [
    "Santiago", "Providencia", "Las Condes", "Ñuñoa", "Maipú", "Puente Alto"
  ],
  "Región de Valparaíso": [
    "Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "San Antonio", "Quillota"
  ],
  "Región del Biobío": [
    "Concepción", "Talcahuano", "Los Ángeles", "Coronel", "San Pedro de la Paz"
  ],
  "Región de Ñuble": [
    "Chillán", "Chillán Viejo", "San Carlos", "Bulnes"
  ],
  "Región de la Araucanía": [
    "Temuco", "Padre Las Casas", "Villarrica", "Angol"
  ],
  "Región de Los Lagos": [
    "Puerto Montt", "Osorno", "Castro", "Puerto Varas"
  ]
};

/**
 * Devuelve la lista de nombres de región, en el orden definido arriba.
 */
function obtenerListaRegiones() {
  return Object.keys(REGIONES_COMUNAS);
}

/**
 * Devuelve las comunas asociadas a una región. Si la región no
 * existe en el arreglo, devuelve una lista vacía.
 */
function obtenerComunasPorRegion(region) {
  return REGIONES_COMUNAS[region] || [];
}
