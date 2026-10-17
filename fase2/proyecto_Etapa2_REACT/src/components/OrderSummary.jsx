import { formatearCLP } from '../utils/formato'

/*
  OrderSummary: resumen de compra (lista de ítems + total) dentro de una `card`.
  Se reutiliza en Checkout, PagoCorrecto y en la boleta del admin. Solo recibe props.
*/
export default function OrderSummary({ items, total, descuento = 0, cupon = null, titulo = 'Resumen de la compra' }) {
  return (
    <div className="card">
      <div className="card-header fw-semibold">{titulo}</div>
      <ul className="list-group list-group-flush">
        {items.map((i) => (
          <li className="list-group-item d-flex justify-content-between" key={i.codigo}>
            <span>{i.nombre} <small className="text-muted">× {i.cantidad}</small></span>
            <span>{formatearCLP(i.precio * i.cantidad)}</span>
          </li>
        ))}
        {descuento > 0 && (
          <li className="list-group-item d-flex justify-content-between text-success">
            <span>Descuento ({cupon})</span>
            <span data-testid="descuento-resumen">−{formatearCLP(descuento)}</span>
          </li>
        )}
        <li className="list-group-item d-flex justify-content-between fw-bold">
          <span>Total</span>
          <span data-testid="total-resumen">{formatearCLP(total)}</span>
        </li>
      </ul>
    </div>
  )
}
