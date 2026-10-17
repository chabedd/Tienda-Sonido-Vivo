import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import App from '../App'
import { CartProvider, CLAVE_CARRITO } from '../context/CartContext'
import { CLAVE_SESION, SessionProvider } from '../context/SessionContext'
import { listar, obtener } from '../data/db'

function renderApp(ruta) {
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

function prepararCarritoYSesion() {
  localStorage.setItem(
    CLAVE_CARRITO,
    JSON.stringify([{ codigo: 'GA001', nombre: 'Guitarra Acústica Folk', precio: 129990, imagen: '', cantidad: 2 }]),
  )
  // sesión iniciada: el checkout debe autocompletar los datos
  localStorage.setItem(
    CLAVE_SESION,
    JSON.stringify({
      run: '33333333-3', nombre: 'Camila', apellidos: 'Rojas Vera', correo: 'camila.rojas@gmail.com',
      region: 'Región Metropolitana de Santiago', comuna: 'Providencia', direccion: 'Av. Providencia 100', tipoUsuario: 'Cliente',
    }),
  )
}

describe('Flujo de pago', () => {
  it('Checkout autocompleta los datos del usuario con sesión iniciada', () => {
    prepararCarritoYSesion()
    renderApp('/checkout')
    expect(screen.getByLabelText('Nombre')).toHaveValue('Camila')
    expect(screen.getByLabelText('Correo')).toHaveValue('camila.rojas@gmail.com')
    expect(screen.getByLabelText('Comuna')).toHaveValue('Providencia')
  })

  it('pago exitoso: muestra PagoCorrecto con el número de compra, crea la orden y descuenta stock', async () => {
    prepararCarritoYSesion()
    const stockAntes = obtener('productos', 'GA001').stock
    renderApp('/checkout')
    await userEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }))

    expect(await screen.findByText(/Se ha realizado la compra nro #1001/)).toBeInTheDocument()
    expect(listar('ordenes')).toHaveLength(1)
    expect(obtener('productos', 'GA001').stock).toBe(stockAntes - 2)
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))).toEqual([]) // carrito vacío tras pagar
  })

  it('pago con error: muestra PagoError y conserva el carrito', async () => {
    prepararCarritoYSesion()
    renderApp('/checkout')
    await userEvent.click(screen.getByLabelText(/Simular error de pago/))
    await userEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }))

    expect(await screen.findByText('No se pudo realizar el pago')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver a realizar el pago' })).toHaveAttribute('href', '/checkout')
    expect(listar('ordenes')).toHaveLength(0)
    expect(JSON.parse(localStorage.getItem(CLAVE_CARRITO))).toHaveLength(1)
  })

  it('checkout con datos inválidos no avanza y muestra errores', async () => {
    prepararCarritoYSesion()
    renderApp('/checkout')
    await userEvent.clear(screen.getByLabelText('Nombre'))
    await userEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }))
    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()
    expect(listar('ordenes')).toHaveLength(0)
  })

  it('PagoCorrecto: "Imprimir boleta" llama a window.print y "Enviar por email" confirma', async () => {
    prepararCarritoYSesion()
    renderApp('/checkout')
    await userEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }))
    const imprimir = vi.spyOn(window, 'print').mockImplementation(() => {})

    await userEvent.click(await screen.findByRole('button', { name: 'Imprimir boleta' }))
    expect(imprimir).toHaveBeenCalledTimes(1)

    await userEvent.click(screen.getByRole('button', { name: 'Enviar por email' }))
    expect(screen.getByText(/Boleta enviada a camila.rojas@gmail.com/)).toBeInTheDocument()
  })

  it('PagoCorrecto con una orden inexistente avisa que no se encontró', () => {
    renderApp('/pago-correcto?orden=9999')
    expect(screen.getByText('No se encontró la orden indicada.')).toBeInTheDocument()
  })
})
