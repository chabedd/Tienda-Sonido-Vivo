import { Link } from 'react-router-dom'
import { listar } from '../../data/db'
import { formatearCLP, formatearFecha } from '../../utils/formato'

/* Ordenes: tabla de boletas (más recientes primero). `table-responsive` = scroll horizontal en móvil. */
export default function Ordenes() {
  const ordenes = listar('ordenes').sort((a, b) => b.fecha.localeCompare(a.fecha))
  return (
    <>
      <h1 className="h3 mb-4">Órdenes / Boletas</h1>
      {ordenes.length === 0 ? (
        <p className="text-muted">Aún no hay compras registradas.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead><tr><th>N°</th><th>Fecha</th><th>Cliente</th><th>Estado</th><th className="text-end">Total</th><th /></tr></thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{formatearFecha(o.fecha)}</td>
                  <td>{o.cliente.nombre} {o.cliente.apellidos}</td>
                  <td><span className="badge text-bg-success">{o.estado}</span></td>
                  <td className="text-end">{formatearCLP(o.total)}</td>
                  <td className="text-end"><Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-outline-primary">Ver boleta</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
