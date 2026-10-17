import StatCard from '../../components/StatCard'
import { listar } from '../../data/db'
import { formatearCLP } from '../../utils/formato'
import { resumenVentas } from '../../utils/reportes'

/* Reportes: la lógica de cálculo está en utils/reportes.js (pura); esta página solo la presenta. */
export default function Reportes() {
  const ordenes = listar('ordenes')
  const productos = listar('productos')
  const r = resumenVentas(ordenes, productos)

  return (
    <>
      <h1 className="h3 mb-4">Reportes</h1>
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4"><StatCard titulo="Ventas" valor={formatearCLP(r.totalVendido)} detalle={`${r.cantidadOrdenes} compra(s)`} /></div>
        <div className="col-12 col-md-4"><StatCard titulo="Ticket promedio" valor={formatearCLP(r.ticketPromedio)} /></div>
        <div className="col-12 col-md-4"><StatCard titulo="Unidades en stock" valor={productos.reduce((a, p) => a + p.stock, 0)} /></div>
      </div>
      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <h2 className="h5">Productos más vendidos</h2>
          {r.topProductos.length === 0 ? <p className="text-muted">Sin ventas todavía.</p> : (
            <table className="table table-sm">
              <thead><tr><th>Producto</th><th className="text-end">Unidades</th><th className="text-end">Monto</th></tr></thead>
              <tbody>{r.topProductos.map((p) => (
                <tr key={p.codigo}><td>{p.nombre}</td><td className="text-end">{p.unidades}</td><td className="text-end">{formatearCLP(p.monto)}</td></tr>
              ))}</tbody>
            </table>
          )}
        </div>
        <div className="col-12 col-lg-6">
          <h2 className="h5">Ventas por categoría</h2>
          {r.porCategoria.length === 0 ? <p className="text-muted">Sin ventas todavía.</p> : (
            <table className="table table-sm">
              <thead><tr><th>Categoría</th><th className="text-end">Monto</th></tr></thead>
              <tbody>{r.porCategoria.map((c) => (
                <tr key={c.categoria}><td>{c.categoria}</td><td className="text-end">{formatearCLP(c.monto)}</td></tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
    </>
  )
}
