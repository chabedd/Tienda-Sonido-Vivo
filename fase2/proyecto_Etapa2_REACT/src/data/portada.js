/*
  Contenido visual de la portada: foto del hero y foto + lema de cada categoría.
  Va aparte de la semilla (seed.js) para no cambiar los datos que guarda db.js:
  una categoría creada desde el panel admin simplemente no tiene foto y la
  tarjeta usa su color de marca.

  Fotos: Unsplash (licencia libre) y fotos del propio catálogo, guardadas en
  public/img/portada para no depender de servidores externos.
*/
export const IMAGEN_HERO = '/img/portada/hero-concierto.jpg'

export const PORTADA_CATEGORIAS = {
  'guitarras-acusticas': { imagen: '/img/portada/guitarras-acusticas.jpg', lema: 'Cuerdas que cuentan historias' },
  'guitarras-electricas': { imagen: '/img/portada/guitarras-electricas.jpg', lema: 'Energía en cada riff' },
  'bajos-electricos': { imagen: '/img/portada/bajos-electricos.jpg', lema: 'El pulso de tu música' },
  baterias: { imagen: '/img/portada/baterias.jpg', lema: 'Marca el ritmo' },
  'teclados-y-pianos': { imagen: '/img/portada/teclados-y-pianos.jpg', lema: 'Ideas que cobran vida' },
  amplificadores: { imagen: '/img/portada/amplificadores.jpg', lema: 'Hazte escuchar' },
  microfonos: { imagen: '/img/portada/microfonos.jpg', lema: 'Captura cada detalle' },
  'pedales-de-efectos': { imagen: '/img/portada/pedales-de-efectos.jpg', lema: 'Experimenta sin límites' },
  accesorios: { imagen: '/img/portada/accesorios.jpg', lema: 'Los pequeños esenciales' },
  'estudio-y-grabacion': { imagen: '/img/portada/estudio-y-grabacion.jpg', lema: 'De la idea a la mezcla' },
}
