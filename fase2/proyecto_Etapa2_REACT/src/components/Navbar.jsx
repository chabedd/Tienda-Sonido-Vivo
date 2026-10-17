import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { tieneAccesoAlPanel } from '../utils/roles'

/*
  Navbar: SOLO presenta. Recibe todo por props (usuario, cantidadCarrito,
  onCerrarSesion) en vez de leer los contextos: así es reutilizable y fácil de probar.
  Bootstrap: `navbar-expand-lg` + `navbar-toggler` + `collapse` = menú colapsable en móvil.
  Estado local `abierto`: React (no el JS de Bootstrap) abre y cierra el menú, para poder
  cerrarlo cuando el usuario elige una opción (al navegar la página no se recarga).

  Carrito e Iniciar/Cerrar sesión van FUERA del `collapse`, en `.sv-acciones`: así están
  visibles en todos los tamaños y existen una sola vez. En móvil quedan junto al botón del
  menú; desde `lg`, `order-lg-last` las lleva al extremo derecho. Solo se ve el ícono
  cuando falta espacio: < 576 px y entre 992 y 1199 px, donde además están todos los
  enlaces (`d-none d-sm-inline d-lg-none d-xl-inline` en el texto). El `aria-label`
  conserva el nombre accesible.
*/
const ENLACES = [
  ['/', 'Inicio'],
  ['/productos', 'Productos'],
  ['/categorias', 'Categorías'],
  ['/ofertas', 'Ofertas'],
  ['/blogs', 'Blogs'],
  ['/nosotros', 'Nosotros'],
  ['/contacto', 'Contacto'],
]

// Íconos SVG en línea (sin dependencias extra). `aria-hidden`: el nombre lo da el botón.
function Icono({ children }) {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
      {children}
    </svg>
  )
}
const IconoCarrito = () => (
  <Icono><path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2" /></Icono>
)
const IconoUsuario = () => (
  <Icono><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" /></Icono>
)
const IconoSalir = () => (
  <Icono>
    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z" />
    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z" />
  </Icono>
)

export default function Navbar({ usuario, cantidadCarrito = 0, onCerrarSesion }) {
  const [abierto, setAbierto] = useState(false)

  // cualquier clic en un enlace o botón de la barra cierra el menú desplegado
  const cerrarAlElegir = (e) => {
    if (e.target.closest('a, button')) setAbierto(false)
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sv-navbar sticky-top">
      <div className="container">
        <Link className="navbar-brand sv-logo py-0" to="/">
          <img src="/img/logo-sonido-vivo.png" alt="Sonido Vivo" width="162" height="40" />
        </Link>

        {/* Acciones fijas: siempre visibles, fuera del menú colapsable */}
        <div className="sv-acciones d-flex align-items-center gap-2 ms-auto order-lg-last" onClick={cerrarAlElegir}>
          <Link
            to="/carrito"
            className="btn btn-outline-primary btn-sm sv-accion"
            aria-label={`Carrito, ${cantidadCarrito} ${cantidadCarrito === 1 ? 'unidad' : 'unidades'}`}
          >
            <IconoCarrito />
            <span className="d-none d-sm-inline d-lg-none d-xl-inline ms-1">Carrito</span>
            <span className="badge bg-primary text-dark ms-1" data-testid="contador-carrito">{cantidadCarrito}</span>
          </Link>
          {/* Renderizado condicional según la sesión */}
          {usuario ? (
            <button type="button" className="btn btn-sm btn-outline-light sv-accion" aria-label="Cerrar sesión" onClick={onCerrarSesion}>
              <IconoSalir />
              <span className="d-none d-sm-inline d-lg-none d-xl-inline ms-1">Cerrar sesión</span>
            </button>
          ) : (
            <Link to="/login" className="btn btn-sm btn-primary sv-accion" aria-label="Iniciar sesión">
              <IconoUsuario />
              <span className="d-none d-sm-inline d-lg-none d-xl-inline ms-1">Iniciar sesión</span>
            </Link>
          )}
        </div>

        <button
          className="navbar-toggler ms-2"
          type="button"
          aria-controls="menuPrincipal"
          aria-expanded={abierto}
          aria-label="Mostrar u ocultar menú"
          onClick={() => setAbierto(!abierto)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`collapse navbar-collapse${abierto ? ' show' : ''}`} id="menuPrincipal" onClick={cerrarAlElegir}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {ENLACES.map(([ruta, texto]) => (
              <li className="nav-item" key={ruta}>
                <NavLink className="nav-link" to={ruta} end={ruta === '/'}>{texto}</NavLink>
              </li>
            ))}
          </ul>
          <div className="d-flex align-items-center gap-3 me-lg-3 pb-2 pb-lg-0">
            {usuario ? (
              <>
                <span className="text-light small">{usuario.nombre}</span>
                {tieneAccesoAlPanel(usuario) && (
                  <Link to="/admin" className="btn btn-sm btn-outline-light">Admin</Link>
                )}
              </>
            ) : (
              <Link to="/registro" className="btn btn-sm btn-outline-light">Registrarse</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
