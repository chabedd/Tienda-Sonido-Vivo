import { Link } from 'react-router-dom'
import ConfirmButton from './ConfirmButton'
import CriticalBadge from './CriticalBadge'
import { formatearCLP } from '../utils/formato'

/*
  ProductosTabla: tabla de productos del admin, usada por el listado general y por el de
  críticos. Props: productos y onEliminar(codigo) (opcional: sin él no muestra "Eliminar").
*/
export default function ProductosTabla({ productos, onEliminar }) {
  if (productos.length === 0) return <p className="text-muted">No hay productos</p>
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead><tr><th>Código</th><th>Nombre</th><th>Categoría</th><th className="text-end">Precio</th><th className="text-end">Stock</th><th /></tr></thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.codigo}>
              <td>{p.codigo}</td>
              <td>{p.nombre} {p.oferta && <span className="badge text-bg-warning">Oferta</span>}</td>
              <td>{p.categoria}</td>
              <td className="text-end">{formatearCLP(p.precio)}</td>
              <td className="text-end">{p.stock} <CriticalBadge producto={p} /></td>
              <td className="text-end text-nowrap">
                <Link to={`/admin/productos/${p.codigo}/editar`} className="btn btn-sm btn-outline-primary me-1">Editar</Link>
                {onEliminar && <ConfirmButton mensaje="¿Eliminar?" onConfirm={() => onEliminar(p.codigo)} />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
