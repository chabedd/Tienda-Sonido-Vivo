/* Reglas de negocio puras sobre productos (reutilizadas por la tienda y el admin). */

export const STOCK_CRITICO_DEFAULT = 3

/** Un producto es crítico cuando su stock es menor o igual a su stock crítico. */
export function esStockCritico(producto) {
  const limite = producto.stockCritico ?? STOCK_CRITICO_DEFAULT
  return producto.stock <= limite
}

/** Precio que realmente se cobra: el de oferta si está en oferta. */
export function precioVigente(producto) {
  return producto.oferta && producto.precioOferta != null ? producto.precioOferta : producto.precio
}

/**
 * Filtra por texto (nombre, marca, modelo, código) y por categoría.
 * categoria '' o 'todas' = sin filtro de categoría.
 */
export function filtrarProductos(productos, { texto = '', categoria = '' } = {}) {
  const busca = texto.trim().toLowerCase()
  return productos.filter((p) => {
    const coincideCategoria = !categoria || categoria === 'todas' || p.categoria === categoria
    const coincideTexto =
      !busca || [p.nombre, p.marca, p.modelo, p.codigo].some((c) => String(c ?? '').toLowerCase().includes(busca))
    return coincideCategoria && coincideTexto
  })
}

/**
 * Convierte los valores (todo texto) del formulario de producto en un producto real
 * con los tipos correctos. Si el stock crítico viene vacío se usa el valor por defecto.
 */
export function valoresAProducto(v) {
  const enOferta = Boolean(v.oferta)
  return {
    codigo: String(v.codigo).trim(),
    nombre: String(v.nombre).trim(),
    categoria: v.categoria,
    marca: String(v.marca ?? '').trim(),
    modelo: String(v.modelo ?? '').trim(),
    descripcion: String(v.descripcion ?? '').trim(),
    imagen: String(v.imagen ?? '').trim(),
    precio: parseFloat(v.precio),
    stock: parseInt(v.stock, 10),
    stockCritico: String(v.stockCritico ?? '').trim() === '' ? STOCK_CRITICO_DEFAULT : parseInt(v.stockCritico, 10),
    oferta: enOferta,
    precioOferta: enOferta ? parseFloat(v.precioOferta) : null,
  }
}

/** Operación inversa: producto -> valores de texto para rellenar el formulario. */
export function productoAValores(p) {
  return {
    codigo: p.codigo,
    nombre: p.nombre,
    categoria: p.categoria,
    marca: p.marca ?? '',
    modelo: p.modelo ?? '',
    descripcion: p.descripcion ?? '',
    imagen: p.imagen ?? '',
    precio: String(p.precio),
    stock: String(p.stock),
    stockCritico: p.stockCritico == null ? '' : String(p.stockCritico),
    oferta: Boolean(p.oferta),
    precioOferta: p.precioOferta == null ? '' : String(p.precioOferta),
  }
}
