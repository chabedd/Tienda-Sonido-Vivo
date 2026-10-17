import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { CartProvider } from '../context/CartContext'
import { CLAVE_SESION, SessionProvider } from '../context/SessionContext'

function renderEnRuta(ruta) {
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

describe('Enrutado y layouts', () => {
  it('la tienda muestra el navbar con "Iniciar sesión" cuando no hay sesión', () => {
    renderEnRuta('/')
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })

  it('/admin sin sesión de administrador pide iniciar sesión', () => {
    renderEnRuta('/admin')
    expect(screen.getByText(/solo para administradores/)).toBeInTheDocument()
  })

  it('/admin con sesión de vendedor también usa el AdminLayout', () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: 'Carlos', tipoUsuario: 'Vendedor' }))
    renderEnRuta('/admin')
    expect(screen.getByRole('link', { name: 'Volver a la tienda' })).toBeInTheDocument()
  })

  it('/admin con sesión de administrador usa el AdminLayout con su sidebar', () => {
    localStorage.setItem(CLAVE_SESION, JSON.stringify({ nombre: 'María', tipoUsuario: 'Administrador' }))
    renderEnRuta('/admin')
    expect(screen.getByRole('link', { name: 'Volver a la tienda' })).toBeInTheDocument()
  })
})
