import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { CartProvider, CLAVE_CARRITO } from '../context/CartContext'
import { CLAVE_SESION, SessionProvider } from '../context/SessionContext'

/* Utilidades compartidas por las pruebas (esta carpeta está excluida de la cobertura). */

export const ADMIN = { run: '11111111-1', nombre: 'María', apellidos: 'Pérez Soto', correo: 'maria.perez@gmail.com', tipoUsuario: 'Administrador', region: 'Región de Valparaíso', comuna: 'Viña del Mar', direccion: 'Av. Libertad 1234' }

export function iniciarSesionComo(usuario) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(usuario))
}

export function cargarCarrito(items) {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items))
}

/** Renderiza la app completa (router + sesión + carrito) en una ruta dada. */
export function renderApp(ruta = '/') {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      <SessionProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </SessionProvider>
    </MemoryRouter>,
  )
}

/** Renderiza un componente suelto dentro de un router (para los que usan <Link>). */
export function renderConRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}
