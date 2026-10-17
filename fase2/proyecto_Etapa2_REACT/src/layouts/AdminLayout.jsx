import { Link, Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'
import AlertMessage from '../components/AlertMessage'
import { useSession } from '../context/SessionContext'
import { tieneAccesoAlPanel } from '../utils/roles'

/*
  AdminLayout: sidebar fija a la izquierda (col-lg-2) y contenido a la derecha
  (col-lg-10). En móvil ambas columnas se apilan (grilla responsiva de Bootstrap).
  Acceso: solo Administrador o Vendedor con sesión iniciada (control de interfaz;
  al no haber servidor no es seguridad real, ver restricciones en el ERS).
*/
export default function AdminLayout() {
  const { usuario } = useSession()

  if (!tieneAccesoAlPanel(usuario)) {
    return (
      <div className="container py-5" style={{ maxWidth: 560 }}>
        <AlertMessage tipo="warning" mensaje="Esta zona es solo para administradores y vendedores. Inicia sesión con una cuenta autorizada." />
        <Link to="/login" state={{ desde: '/admin' }} className="btn btn-primary me-2">Iniciar sesión</Link>
        <Link to="/" className="btn btn-outline-secondary">Volver a la tienda</Link>
      </div>
    )
  }

  return (
    <div className="container-fluid">
      <div className="row min-vh-100">
        <div className="col-12 col-lg-2 p-0">
          <AdminSidebar usuario={usuario} />
        </div>
        <main className="col-12 col-lg-10 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
