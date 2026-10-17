import {
  BLOGS_SEMILLA,
  CATEGORIAS_SEMILLA,
  ORDENES_SEMILLA,
  PRODUCTOS_SEMILLA,
  USUARIOS_SEMILLA,
} from './seed'

/*
  Base de datos SIMULADA sobre localStorage.
  Cada colección (productos, categorias, usuarios, ordenes, blogs) se guarda como un
  arreglo JSON bajo su propia clave. Es la migración de productos-data.js,
  admin-productos.js y admin-usuarios.js, unificada en un solo CRUD genérico:

    crear(col, item)            -> agrega; error si la clave primaria ya existe
    obtener(col, id)            -> un registro (o null si no existe)
    listar(col)                 -> todos los registros
    actualizar(col, id, cambios)-> mezcla cambios; error si no existe
    eliminar(col, id)           -> borra; error si no existe

  Las páginas leen con listar()/obtener() cada vez que se dibujan, así siempre ven
  los datos actuales. Las que modifican datos (borrar) vuelven a leer la lista y
  la guardan en su estado para que la pantalla se actualice.
*/

export const PREFIJO_DB = 'sonidoVivoDB_'

// clave = campo que identifica a cada registro (como el código o el RUN de la Etapa 1)
export const COLECCIONES = {
  productos: { clave: 'codigo', semilla: PRODUCTOS_SEMILLA },
  categorias: { clave: 'id', semilla: CATEGORIAS_SEMILLA },
  usuarios: { clave: 'run', semilla: USUARIOS_SEMILLA },
  ordenes: { clave: 'id', semilla: ORDENES_SEMILLA },
  blogs: { clave: 'id', semilla: BLOGS_SEMILLA },
}

function configuracion(coleccion) {
  const config = COLECCIONES[coleccion]
  if (!config) throw new Error(`La colección "${coleccion}" no existe.`)
  return config
}

const copiar = (valor) => JSON.parse(JSON.stringify(valor))

function guardar(coleccion, lista) {
  localStorage.setItem(PREFIJO_DB + coleccion, JSON.stringify(lista))
}

/**
 * Lee la colección. Si no existe o el JSON está corrupto, la vuelve a sembrar
 * con los datos iniciales (así la app nunca queda rota por datos dañados).
 */
export function listar(coleccion) {
  const { semilla } = configuracion(coleccion)
  let datos = null
  try {
    datos = JSON.parse(localStorage.getItem(PREFIJO_DB + coleccion))
  } catch {
    datos = null
  }
  if (!Array.isArray(datos)) {
    datos = copiar(semilla)
    guardar(coleccion, datos)
  }
  return datos
}

export function obtener(coleccion, id) {
  const { clave } = configuracion(coleccion)
  const encontrado = listar(coleccion).find((r) => String(r[clave]) === String(id))
  return encontrado ?? null
}

/** Identificadores automáticos: órdenes desde 1001, el resto = máximo numérico + 1. */
function generarId(coleccion, lista) {
  const { clave } = configuracion(coleccion)
  const numeros = lista.map((r) => Number(r[clave])).filter((n) => Number.isFinite(n))
  const base = coleccion === 'ordenes' ? 1000 : 0
  return String(Math.max(base, ...numeros) + 1)
}

export function crear(coleccion, item) {
  const { clave } = configuracion(coleccion)
  const lista = listar(coleccion)
  const nuevo = { ...item }
  if (nuevo[clave] === undefined || nuevo[clave] === '') nuevo[clave] = generarId(coleccion, lista)
  if (lista.some((r) => String(r[clave]) === String(nuevo[clave]))) {
    throw new Error(`Ya existe un registro en "${coleccion}" con ${clave} "${nuevo[clave]}".`)
  }
  lista.push(nuevo)
  guardar(coleccion, lista)
  return copiar(nuevo)
}

export function actualizar(coleccion, id, cambios) {
  const { clave } = configuracion(coleccion)
  const lista = listar(coleccion)
  const indice = lista.findIndex((r) => String(r[clave]) === String(id))
  if (indice < 0) throw new Error(`No existe un registro en "${coleccion}" con ${clave} "${id}".`)
  // la clave primaria no se puede cambiar al actualizar
  lista[indice] = { ...lista[indice], ...cambios, [clave]: lista[indice][clave] }
  guardar(coleccion, lista)
  return copiar(lista[indice])
}

export function eliminar(coleccion, id) {
  const { clave } = configuracion(coleccion)
  const lista = listar(coleccion)
  const filtrada = lista.filter((r) => String(r[clave]) !== String(id))
  if (filtrada.length === lista.length) {
    throw new Error(`No existe un registro en "${coleccion}" con ${clave} "${id}".`)
  }
  guardar(coleccion, filtrada)
}

/** Restaura una colección (o todas) a los datos iniciales. Útil en desarrollo y pruebas. */
export function reiniciar(coleccion) {
  const nombres = coleccion ? [coleccion] : Object.keys(COLECCIONES)
  nombres.forEach((nombre) => guardar(nombre, copiar(configuracion(nombre).semilla)))
}

/* ---------- Consultas de negocio ---------- */

/** Busca un usuario por correo y contraseña (login simulado, sin servidor). */
export function autenticar(correo, password) {
  const c = String(correo).trim().toLowerCase()
  return listar('usuarios').find((u) => u.correo.toLowerCase() === c && u.password === password) ?? null
}

/** Historial de compras de un usuario (por RUN), más recientes primero. */
export function ordenesDeUsuario(run) {
  return listar('ordenes')
    .filter((o) => o.cliente?.run === run)
    .sort((a, b) => b.fecha.localeCompare(a.fecha))
}
