import { Link, useParams } from 'react-router-dom'
import AlertMessage from '../../components/AlertMessage'
import OrderSummary from '../../components/OrderSummary'
import { obtener } from '../../data/db'
import { formatearFecha } from '../../utils/formato'

/* DetalleOrden: vista de boleta de una orden. Reutiliza OrderSummary; imprimible con window.print. */
export default function DetalleOrden() {
  const { id } = useParams()
  const orden = obtener('ordenes', id)

  if (!orden) {
    return (
      <>
        <AlertMessage tipo="warning" mensaje="No se encontró la orden." />
        <Link to="/admin/ordenes">Volver a órdenes</Link>
      </>
    )
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 className="h3">Boleta #{orden.id}</h1>
      <p className="text-muted">{formatearFecha(orden.fecha)} · {orden.estado}</p>
      <div className="card mb-3"><div className="card-body small">
        <strong>Cliente:</strong> {orden.cliente.nombre} {orden.cliente.apellidos} ({orden.cliente.correo})<br />
        <strong>Entrega:</strong> {orden.direccion.calle}{orden.direccion.departamento ? `, depto. ${orden.direccion.departamento}` : ''}, {orden.direccion.comuna}, {orden.direccion.region}
        {orden.direccion.indicaciones && <><br /><strong>Indicaciones:</strong> {orden.direccion.indicaciones}</>}
      </div></div>
      <OrderSummary items={orden.items} total={orden.total} descuento={orden.descuento} cupon={orden.cupon} titulo="Detalle" />
      <div className="mt-3 d-flex gap-2 no-print">
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>Imprimir boleta</button>
        <Link to="/admin/ordenes" className="btn btn-outline-secondary">Volver</Link>
      </div>
    </div>
  )
}
