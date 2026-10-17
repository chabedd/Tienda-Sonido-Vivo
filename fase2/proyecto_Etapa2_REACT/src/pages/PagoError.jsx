import { Link } from 'react-router-dom'

/* PagoError: el carrito NO se vacía al fallar, así que "Volver a realizar el pago" lleva de nuevo al checkout. */
export default function PagoError() {
  return (
    <div className="text-center py-5">
      <h1 className="h3 text-danger">No se pudo realizar el pago</h1>
      <p className="text-muted">Ocurrió un problema al procesar el pago. Tu carrito sigue guardado.</p>
      <Link to="/checkout" className="btn btn-primary">Volver a realizar el pago</Link>
    </div>
  )
}
