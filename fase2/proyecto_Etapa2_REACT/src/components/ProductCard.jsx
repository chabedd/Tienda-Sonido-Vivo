import { Link } from 'react-router-dom'
import CriticalBadge from './CriticalBadge'
import { formatearCLP } from '../utils/formato'
import { precioVigente } from '../utils/productos'

/*
  ProductCard: tarjeta (Bootstrap `card`) de un producto.
  Props: producto (datos a mostrar) y onAgregar(producto) (qué hacer al pulsar el botón;
  lo decide el padre, la tarjeta no conoce el carrito). Sin estado propio.
*/
export default function ProductCard({ producto, onAgregar }) {
  const sinStock = producto.stock <= 0
  return (
    <div className="card h-100 shadow-sm">
      <img src={producto.imagen} alt={producto.nombre} className="card-img-top sv-card-img" loading="lazy" />
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <small className="text-muted">{producto.categoria}</small>
          <span className="d-flex gap-1">
            {producto.oferta && <span className="badge text-bg-warning">Oferta</span>}
            <CriticalBadge producto={producto} />
          </span>
        </div>
        <h2 className="h6 card-title">
          <Link to={`/productos/${producto.codigo}`} className="text-decoration-none text-reset">
            {producto.nombre}
          </Link>
        </h2>
        <p className="mb-3 mt-auto">
          {producto.oferta && (
            <del className="text-muted me-2 small">{formatearCLP(producto.precio)}</del>
          )}
          <strong data-testid="precio">{formatearCLP(precioVigente(producto))}</strong>
        </p>
        <button
          type="button"
          className="btn btn-carrito w-100"
          disabled={sinStock}
          onClick={() => onAgregar(producto)}
        >
          {sinStock ? 'Sin stock' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  )
}
