import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { buscarCupon, calcularDescuento } from '../utils/cupones'
import { cargarCarrito, renderApp } from './helpers'

const item = [{ codigo: 'AC001', nombre: 'Cuerdas', precio: 10000, imagen: '', cantidad: 1 }]

describe('Cupones (lógica pura)', () => {
  it('reconoce los cupones válidos sin importar mayúsculas ni espacios', () => {
    expect(buscarCupon(' sonidovivo10 ')).toBe('SONIDOVIVO10')
    expect(buscarCupon('BIENVENIDO5')).toBe('BIENVENIDO5')
  })

  it('rechaza cupones desconocidos o vacíos', () => {
    expect(buscarCupon('XYZ')).toBeNull()
    expect(buscarCupon('')).toBeNull()
    expect(buscarCupon(undefined)).toBeNull()
    expect(buscarCupon('toString')).toBeNull()
  })

  it('calcula 10 % y 5 % redondeado, y 0 sin cupón', () => {
    expect(calcularDescuento(10000, 'SONIDOVIVO10')).toBe(1000)
    expect(calcularDescuento(10000, 'BIENVENIDO5')).toBe(500)
    expect(calcularDescuento(10000, null)).toBe(0)
  })
})

describe('Cupones en el carrito', () => {
  it('aplicar SONIDOVIVO10 muestra descuento y rebaja el total', async () => {
    cargarCarrito(item)
    renderApp('/carrito')
    await userEvent.type(screen.getByLabelText('¿Tienes un cupón?'), 'sonidovivo10')
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar cupón' }))
    expect(screen.getByText('Cupón aplicado correctamente.')).toBeInTheDocument()
    expect(screen.getByTestId('subtotal-carrito')).toHaveTextContent('$10.000')
    expect(screen.getByTestId('descuento-carrito')).toHaveTextContent('$1.000')
    expect(screen.getByTestId('total-carrito')).toHaveTextContent('$9.000')
  })

  it('un cupón inválido avisa y no cambia el total', async () => {
    cargarCarrito(item)
    renderApp('/carrito')
    await userEvent.type(screen.getByLabelText('¿Tienes un cupón?'), 'FALSO')
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar cupón' }))
    expect(screen.getByText('El cupón ingresado no es válido.')).toBeInTheDocument()
    expect(screen.getByTestId('total-carrito')).toHaveTextContent('$10.000')
  })

  it('Quitar elimina el descuento', async () => {
    cargarCarrito(item)
    renderApp('/carrito')
    await userEvent.type(screen.getByLabelText('¿Tienes un cupón?'), 'BIENVENIDO5')
    await userEvent.click(screen.getByRole('button', { name: 'Aplicar cupón' }))
    expect(screen.getByTestId('total-carrito')).toHaveTextContent('$9.500')
    await userEvent.click(screen.getByRole('button', { name: 'Quitar' }))
    expect(screen.getByTestId('total-carrito')).toHaveTextContent('$10.000')
  })

  it('el cupón se conserva al recargar y limpiar el carrito lo borra', async () => {
    cargarCarrito(item)
    localStorage.setItem('sonidoVivoCupon', 'SONIDOVIVO10')
    renderApp('/carrito')
    expect(screen.getByTestId('total-carrito')).toHaveTextContent('$9.000')
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar carrito' }))
    expect(localStorage.getItem('sonidoVivoCupon')).toBeNull()
  })

  it('un cupón corrupto en localStorage se ignora', () => {
    cargarCarrito(item)
    localStorage.setItem('sonidoVivoCupon', 'BASURA')
    renderApp('/carrito')
    expect(screen.getByTestId('total-carrito')).toHaveTextContent('$10.000')
  })

  it('el resumen del checkout muestra el descuento y el total rebajado', async () => {
    cargarCarrito(item)
    localStorage.setItem('sonidoVivoCupon', 'SONIDOVIVO10')
    renderApp('/checkout')
    expect(screen.getByTestId('descuento-resumen')).toHaveTextContent('$1.000')
    expect(screen.getByTestId('total-resumen')).toHaveTextContent('$9.000')
  })
})

describe('Cupones: localStorage no disponible', () => {
  it('si leer el almacenamiento falla, el carrito arranca sin cupón', () => {
    const espia = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('bloqueado') })
    renderApp('/carrito')
    espia.mockRestore()
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })
})
