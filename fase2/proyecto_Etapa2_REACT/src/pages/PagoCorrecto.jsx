import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import OrderSummary from '../components/OrderSummary'
import { obtener } from '../data/db'
import { formatearFecha } from '../utils/formato'

/*
  PagoCorrecto: confirmación de compra. El número de orden viaja en la URL
  (?orden=1001), así sobrevive a recargas. Estado local: `emailEnviado` (simulado).
  "Imprimir boleta" usa window.print(); el CSS de impresión oculta navbar y botones (.no-print).
*/
export default function PagoCorrecto() {
  const [params] = useSearchParams()
  const orden = obtener('ordenes', params.get('orden'))
  const [emailEnviado, setEmailEnviado] = useState(false)

  if (!orden) {
    return (
      <>
        <AlertMessage tipo="warning" mensaje="No se encontró la orden indicada." />
        <Link to="/">Volver al inicio</Link>
      </>
    )
  }

  return (
    <div className="mx-auto" style={{ maxWidth: 720 }}>
      <div className="text-center mb-4">
        <h1 className="h3 text-success">Se ha realizado la compra nro #{orden.id}</h1>
        <p className="text-muted mb-0">{formatearFecha(orden.fecha)}</p>
      </div>

      <div className="card mb-3">
        <div className="card-body">
          <h2 className="h6">Datos de entrega</h2>
          <p className="mb-0 small">
            {orden.cliente.nombre} {orden.cliente.apellidos} · {orden.cliente.correo}<br />
            {orden.direccion.calle}{orden.direccion.departamento ? `, depto. ${orden.direccion.departamento}` : ''}, {orden.direccion.comuna}, {orden.direccion.region}
            {orden.direccion.indicaciones && <><br />Indicaciones: {orden.direccion.indicaciones}</>}
          </p>
        </div>
      </div>

      <OrderSummary items={orden.items} total={orden.total} descuento={orden.descuento} cupon={orden.cupon} />

      <div className="mt-3">
        <AlertMessage tipo="success" mensaje={emailEnviado ? `Boleta enviada a ${orden.cliente.correo} (simulado).` : ''} />
      </div>
      <div className="d-flex flex-wrap gap-2 justify-content-center no-print">
        <button type="button" className="btn btn-primary" onClick={() => window.print()}>Imprimir boleta</button>
        <button type="button" className="btn btn-outline-primary" onClick={() => setEmailEnviado(true)}>Enviar por email</button>
        <Link to="/productos" className="btn btn-outline-secondary">Seguir comprando</Link>
      </div>
    </div>
  )
}
