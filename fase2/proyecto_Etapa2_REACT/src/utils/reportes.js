/* Cálculos puros para el panel de reportes y el dashboard del admin. */

/**
 * Resume las ventas a partir de las órdenes y el catálogo.
 * Devuelve totales, ticket promedio, top de productos y ventas por categoría.
 */
export function resumenVentas(ordenes, productos) {
  const totalVendido = ordenes.reduce((acc, o) => acc + o.total, 0)
  const porProducto = new Map()
  const porCategoria = new Map()

  for (const orden of ordenes) {
    for (const item of orden.items) {
      const previo = porProducto.get(item.codigo) ?? { codigo: item.codigo, nombre: item.nombre, unidades: 0, monto: 0 }
      previo.unidades += item.cantidad
      previo.monto += item.precio * item.cantidad
      porProducto.set(item.codigo, previo)

      const categoria = productos.find((p) => p.codigo === item.codigo)?.categoria ?? 'Sin categoría'
      porCategoria.set(categoria, (porCategoria.get(categoria) ?? 0) + item.precio * item.cantidad)
    }
  }

  return {
    cantidadOrdenes: ordenes.length,
    totalVendido,
    ticketPromedio: ordenes.length ? Math.round(totalVendido / ordenes.length) : 0,
    topProductos: [...porProducto.values()].sort((a, b) => b.unidades - a.unidades).slice(0, 5),
    porCategoria: [...porCategoria.entries()].map(([categoria, monto]) => ({ categoria, monto })).sort((a, b) => b.monto - a.monto),
  }
}
