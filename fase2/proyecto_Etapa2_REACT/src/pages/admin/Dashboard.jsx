import { Link } from 'react-router-dom'
import StatCard from '../../components/StatCard'
import { listar } from '../../data/db'
import { formatearCLP } from '../../utils/formato'
import { esStockCritico } from '../../utils/productos'

/* Dashboard: métricas calculadas en vivo desde db.js + accesos rápidos (grilla row/col de Bootstrap). */
export default function Dashboard() {
  const ordenes = listar('ordenes')
  const productos = listar('productos')
  const usuarios = listar('usuarios')

  const criticos = productos.filter(esStockCritico).length
  const vendido = ordenes.reduce((acc, o) => acc + o.total, 0)

  return (
    <>
      <h1 className="h3 mb-4">Dashboard</h1>
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <StatCard titulo="Compras" valor={ordenes.length} detalle={`Total vendido: ${formatearCLP(vendido)}`} enlace="/admin/ordenes" />
        </div>
        <div className="col-12 col-md-4">
          <StatCard titulo="Productos" valor={productos.length} detalle={`${criticos} en stock crítico`} enlace="/admin/productos" />
        </div>
        <div className="col-12 col-md-4">
          <StatCard titulo="Usuarios" valor={usuarios.length} detalle="Administradores, vendedores y clientes" enlace="/admin/usuarios" />
        </div>
      </div>
      <h2 className="h5">Accesos rápidos</h2>
      <div className="d-flex flex-wrap gap-2">
        <Link to="/admin/productos/nuevo" className="btn btn-outline-primary">Nuevo producto</Link>
        <Link to="/admin/productos/criticos" className="btn btn-outline-primary">Productos críticos</Link>
        <Link to="/admin/categorias/nueva" className="btn btn-outline-primary">Nueva categoría</Link>
        <Link to="/admin/usuarios/nuevo" className="btn btn-outline-primary">Nuevo usuario</Link>
        <Link to="/admin/reportes" className="btn btn-outline-primary">Reportes</Link>
      </div>
    </>
  )
}
