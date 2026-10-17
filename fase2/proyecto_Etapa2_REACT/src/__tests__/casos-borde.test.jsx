import { act, renderHook, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import ProductosTabla from '../components/ProductosTabla'
import { CartProvider, useCart } from '../context/CartContext'
import { SessionProvider, useSession } from '../context/SessionContext'
import { actualizar, crear } from '../data/db'
import { resumenVentas } from '../utils/reportes'
import { ADMIN, cargarCarrito, iniciarSesionComo, renderApp, renderConRouter } from './helpers'

/* Casos borde y rutas de error que las otras pruebas no recorren. */

describe('Casos borde', () => {
  it('SessionProvider ignora una sesión corrupta en localStorage', () => {
    localStorage.setItem('sonidoVivoSesion', '{roto')
    const { result } = renderHook(() => useSession(), { wrapper: SessionProvider })
    expect(result.current.usuario).toBeNull()
  })

  it('useCart.quitar elimina un producto del carrito', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    act(() => result.current.agregar({ codigo: 'A', nombre: 'A', precio: 1, imagen: '' }, 1))
    act(() => result.current.quitar('A'))
    expect(result.current.items).toEqual([])
  })

  it('ProductosTabla sin productos muestra "No hay productos"', () => {
    renderConRouter(<ProductosTabla productos={[]} />)
    expect(screen.getByText('No hay productos')).toBeInTheDocument()
  })

  it('resumenVentas ordena varios productos por unidades vendidas', () => {
    const orden = (codigo, cantidad) => ({
      total: 100 * cantidad,
      items: [{ codigo, nombre: codigo, precio: 100, cantidad }],
    })
    const r = resumenVentas([orden('A', 1), orden('B', 5), orden('C', 3)], [])
    expect(r.topProductos.map((p) => p.codigo)).toEqual(['B', 'C', 'A'])
    expect(r.porCategoria[0].categoria).toBe('Sin categoría') // productos que ya no están en el catálogo
  })

  it('las órdenes se listan de la más reciente a la más antigua', () => {
    const base = { estado: 'Pagada', total: 1, items: [], direccion: {}, cliente: { nombre: 'Ana', apellidos: 'S', correo: 'a@gmail.com' } }
    crear('ordenes', { ...base, fecha: '2026-01-01T10:00:00.000Z' })
    crear('ordenes', { ...base, fecha: '2026-06-01T10:00:00.000Z' })
    iniciarSesionComo(ADMIN)
    renderApp('/admin/ordenes')
    const filas = screen.getAllByRole('row').slice(1)
    expect(filas[0]).toHaveTextContent('#1002')
    expect(filas[1]).toHaveTextContent('#1001')
  })

  it('la boleta del admin se puede imprimir', async () => {
    crear('ordenes', {
      fecha: '2026-01-01T10:00:00.000Z', estado: 'Pagada', total: 100, items: [{ codigo: 'A', nombre: 'A', precio: 100, cantidad: 1 }],
      cliente: { nombre: 'Ana', apellidos: 'S', correo: 'a@gmail.com' },
      direccion: { calle: 'C', departamento: '12', region: 'R', comuna: 'X', indicaciones: 'Tocar timbre' },
    })
    iniciarSesionComo(ADMIN)
    const imprimir = vi.spyOn(window, 'print').mockImplementation(() => {})
    renderApp('/admin/ordenes/1001')
    expect(screen.getByText(/Tocar timbre/)).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'Imprimir boleta' }))
    expect(imprimir).toHaveBeenCalledTimes(1)
  })

  it('el checkout no deja pagar si el stock actual es menor que la cantidad pedida', async () => {
    actualizar('productos', 'GA001', { stock: 1 })
    cargarCarrito([{ codigo: 'GA001', nombre: 'Guitarra Acústica Folk', precio: 129990, imagen: '', cantidad: 2 }])
    iniciarSesionComo({ ...ADMIN, tipoUsuario: 'Cliente' })
    renderApp('/checkout')
    await userEvent.click(screen.getByRole('button', { name: 'Pagar ahora' }))
    expect(screen.getByText(/No hay stock suficiente/)).toBeInTheDocument()
  })

  it('en el checkout, cambiar la región limpia la comuna', async () => {
    cargarCarrito([{ codigo: 'GA001', nombre: 'Guitarra', precio: 1, imagen: '', cantidad: 1 }])
    renderApp('/checkout')
    await userEvent.selectOptions(screen.getByLabelText('Región'), 'Región de Los Lagos')
    await userEvent.selectOptions(screen.getByLabelText('Comuna'), 'Osorno')
    await userEvent.selectOptions(screen.getByLabelText('Región'), 'Región del Biobío')
    expect(screen.getByLabelText('Comuna')).toHaveValue('')
  })
})
