import { formatearCLP } from '../utils/formato'

/*
  CartTable: tabla (Bootstrap `table`) del carrito. Presentacional: recibe los ítems y
  el total ya calculado, y avisa los cambios con callbacks (onCambiarCantidad, onQuitar).
  El estado real vive en CartContext. `table-responsive` permite scroll horizontal en móvil.
*/
export default function CartTable({ items, total, subtotal = total, descuento = 0, cupon = null, onCambiarCantidad, onQuitar }) {
  if (items.length === 0) {
    return <p className="text-muted text-center py-5">Tu carrito está vacío</p>
  }
  return (
    <div className="table-responsive">
      <table className="table align-middle">
        <thead>
          <tr>
            <th>Producto</th>
            <th className="text-end">Precio</th>
            <th className="text-center">Cantidad</th>
            <th className="text-end">Subtotal</th>
            <th><span className="visually-hidden">Acciones</span></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.codigo}>
              <td>{item.nombre}</td>
              <td className="text-end">{formatearCLP(item.precio)}</td>
              <td className="text-center">
                <div className="btn-group btn-group-sm" role="group" aria-label={`Cantidad de ${item.nombre}`}>
                  <button type="button" className="btn btn-outline-secondary" aria-label={`Disminuir ${item.nombre}`}
                    onClick={() => onCambiarCantidad(item.codigo, item.cantidad - 1)}>−</button>
                  <span className="btn btn-light disabled" data-testid={`cantidad-${item.codigo}`}>{item.cantidad}</span>
                  <button type="button" className="btn btn-outline-secondary" aria-label={`Aumentar ${item.nombre}`}
                    onClick={() => onCambiarCantidad(item.codigo, item.cantidad + 1)}>+</button>
                </div>
              </td>
              <td className="text-end">{formatearCLP(item.precio * item.cantidad)}</td>
              <td className="text-end">
                <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onQuitar(item.codigo)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          {descuento > 0 && (
            <>
              <tr>
                <td colSpan={3} className="text-end">Subtotal</td>
                <td className="text-end" data-testid="subtotal-carrito">{formatearCLP(subtotal)}</td>
                <td />
              </tr>
              <tr>
                <td colSpan={3} className="text-end">Descuento ({cupon})</td>
                <td className="text-end text-success" data-testid="descuento-carrito">−{formatearCLP(descuento)}</td>
                <td />
              </tr>
            </>
          )}
          <tr>
            <th colSpan={3} className="text-end">Total</th>
            <th className="text-end" data-testid="total-carrito">{formatearCLP(total)}</th>
            <td />
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
