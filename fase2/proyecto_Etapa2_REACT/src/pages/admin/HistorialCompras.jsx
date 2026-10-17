import { Link, useParams } from 'react-router-dom'
import AlertMessage from '../../components/AlertMessage'
import { obtener, ordenesDeUsuario } from '../../data/db'
import { formatearCLP, formatearFecha } from '../../utils/formato'

/* HistorialCompras: órdenes de un usuario (consulta ordenesDeUsuario de db.js). */
export default function HistorialCompras() {
  const { run } = useParams()
  const usuario = obtener('usuarios', run)
  if (!usuario) {
    return (
      <>
        <AlertMessage tipo="warning" mensaje="No se encontró el usuario." />
        <Link to="/admin/usuarios">Volver al listado</Link>
      </>
    )
  }
  const ordenes = ordenesDeUsuario(run)
  return (
    <>
      <h1 className="h3 mb-1">Historial de compras</h1>
      <p className="text-muted">{usuario.nombre} {usuario.apellidos} · {usuario.correo}</p>
      {ordenes.length === 0 ? (
        <p>Este usuario aún no tiene compras.</p>
      ) : (
        <div className="table-responsive">
          <table className="table align-middle">
            <thead><tr><th>N°</th><th>Fecha</th><th>Ítems</th><th className="text-end">Total</th><th /></tr></thead>
            <tbody>
              {ordenes.map((o) => (
                <tr key={o.id}>
                  <td>#{o.id}</td>
                  <td>{formatearFecha(o.fecha)}</td>
                  <td>{o.items.reduce((a, i) => a + i.cantidad, 0)}</td>
                  <td className="text-end">{formatearCLP(o.total)}</td>
                  <td className="text-end"><Link to={`/admin/ordenes/${o.id}`} className="btn btn-sm btn-outline-primary">Ver boleta</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Link to="/admin/usuarios">← Volver a usuarios</Link>
    </>
  )
}
