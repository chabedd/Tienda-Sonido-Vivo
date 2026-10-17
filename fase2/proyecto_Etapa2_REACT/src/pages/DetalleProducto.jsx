import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import CriticalBadge from '../components/CriticalBadge'
import { obtener } from '../data/db'
import { useCart } from '../context/CartContext'
import { formatearCLP } from '../utils/formato'
import { precioVigente } from '../utils/productos'

/*
  DetalleProducto: ficha de un producto (código en la URL: useParams).
  Estado local: `cantidad` elegida y `agregado` (para confirmar al usuario).
  La cantidad se limita al stock disponible.
*/
export default function DetalleProducto() {
  const { codigo } = useParams()
  const { agregar } = useCart()
  const [cantidad, setCantidad] = useState(1)
  const [agregado, setAgregado] = useState(false)

  const producto = obtener('productos', codigo)
  if (!producto) {
    return (
      <>
        <AlertMessage tipo="warning" mensaje="No se encontró el producto solicitado." />
        <Link to="/productos">Volver al catálogo</Link>
      </>
    )
  }

  const confirmar = () => {
    agregar(producto, cantidad)
    setAgregado(true)
  }

  return (
    <div className="row g-4">
      <div className="col-12 col-md-5">
        <img src={producto.imagen} alt={producto.nombre} className="img-fluid rounded w-100 bg-white p-2" style={{ maxHeight: 420, objectFit: 'contain' }} />
      </div>
      <div className="col-12 col-md-7">
        <p className="text-muted mb-1">{producto.categoria} · {producto.marca} {producto.modelo}</p>
        <h1 className="h3">{producto.nombre} <CriticalBadge producto={producto} /></h1>
        <p>{producto.descripcion}</p>
        <p className="fs-4">
          {producto.oferta && <del className="text-muted fs-6 me-2">{formatearCLP(producto.precio)}</del>}
          <strong>{formatearCLP(precioVigente(producto))}</strong>
        </p>
        <p className="small text-muted">Stock disponible: {producto.stock}</p>

        <div className="d-flex align-items-center gap-3 mb-3">
          <label htmlFor="cantidad" className="form-label mb-0">Cantidad</label>
          <input
            id="cantidad"
            type="number"
            min="1"
            max={producto.stock}
            className="form-control w-auto"
            value={cantidad}
            onChange={(e) => {
              const n = parseInt(e.target.value, 10)
              setCantidad(Number.isNaN(n) ? 1 : Math.min(Math.max(n, 1), Math.max(producto.stock, 1)))
              setAgregado(false)
            }}
          />
        </div>
        <button type="button" className="btn btn-carrito" disabled={producto.stock <= 0} onClick={confirmar}>
          {producto.stock <= 0 ? 'Sin stock' : 'Añadir al carrito'}
        </button>
        <div className="mt-3">
          <AlertMessage tipo="success" mensaje={agregado ? `Se añadieron ${cantidad} unidad(es) al carrito.` : ''} />
        </div>
        <Link to="/productos">← Volver al catálogo</Link>
      </div>
    </div>
  )
}
