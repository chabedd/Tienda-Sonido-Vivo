import { NavLink } from 'react-router-dom'

/*
  AdminSidebar: menú lateral del panel. Recibe `usuario` solo para mostrar quién
  está conectado. Bootstrap: `nav flex-column nav-pills` apila los enlaces.
*/
const SECCIONES = [
  ['/admin', 'Dashboard'],
  ['/admin/ordenes', 'Órdenes / Boletas'],
  ['/admin/productos', 'Productos'],
  ['/admin/productos/criticos', 'Productos críticos'],
  ['/admin/categorias', 'Categorías'],
  ['/admin/usuarios', 'Usuarios'],
  ['/admin/reportes', 'Reportes'],
  ['/admin/perfil', 'Perfil'],
  ['/', 'Volver a la tienda'],
]

export default function AdminSidebar({ usuario }) {
  return (
    <aside className="sv-sidebar p-3 h-100">
      <p className="sv-display text-light fs-5 mb-1">Sonido Vivo</p>
      {usuario && <p className="small text-secondary mb-3">{usuario.nombre} · {usuario.tipoUsuario}</p>}
      <ul className="nav nav-pills flex-column gap-1">
        {SECCIONES.map(([ruta, texto]) => (
          <li className="nav-item" key={ruta}>
            <NavLink className="nav-link" to={ruta} end>{texto}</NavLink>
          </li>
        ))}
      </ul>
    </aside>
  )
}
