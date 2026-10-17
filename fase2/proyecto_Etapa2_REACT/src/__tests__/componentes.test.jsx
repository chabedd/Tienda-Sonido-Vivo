import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import AdminSidebar from '../components/AdminSidebar'
import AlertMessage from '../components/AlertMessage'
import Button from '../components/Button'
import CartTable from '../components/CartTable'
import CategoryCard from '../components/CategoryCard'
import ConfirmButton from '../components/ConfirmButton'
import CriticalBadge from '../components/CriticalBadge'
import Footer from '../components/Footer'
import FormField from '../components/FormField'
import Navbar from '../components/Navbar'
import OrderSummary from '../components/OrderSummary'
import ProductCard from '../components/ProductCard'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import StatCard from '../components/StatCard'
import { render } from '@testing-library/react'
import { renderConRouter } from './helpers'

const guitarra = {
  codigo: 'GA001', categoria: 'Guitarras Acústicas', nombre: 'Guitarra Folk', stock: 8, stockCritico: 3,
  precio: 129990, imagen: 'https://img.test/guitarra.jpg', oferta: false, precioOferta: null,
}
const bajo = { ...guitarra, codigo: 'BA001', nombre: 'Bajo PJ', precio: 299990, stock: 2 } // crítico
const tres = [guitarra, bajo, { ...guitarra, codigo: 'BT001', nombre: 'Batería', stock: 5 }]

describe('Renderizado', () => {
  it('ProductGrid renderiza una tarjeta por cada producto del arreglo', () => {
    renderConRouter(<ProductGrid productos={tres} onAgregar={() => {}} />)
    expect(screen.getAllByRole('button', { name: 'Añadir al carrito' })).toHaveLength(3)
    expect(screen.getByText('Bajo PJ')).toBeInTheDocument()
  })

  it('ProductGrid muestra "No hay productos" cuando el arreglo está vacío', () => {
    renderConRouter(<ProductGrid productos={[]} onAgregar={() => {}} />)
    expect(screen.getByText('No hay productos')).toBeInTheDocument()
  })

  it('CartTable muestra una fila por ítem y el total correcto', () => {
    const items = [
      { codigo: 'A', nombre: 'Cuerdas', precio: 5000, cantidad: 2 },
      { codigo: 'B', nombre: 'Correa', precio: 10000, cantidad: 1 },
    ]
    render(<CartTable items={items} total={20000} onCambiarCantidad={() => {}} onQuitar={() => {}} />)
    expect(screen.getAllByRole('row')).toHaveLength(1 + 2 + 1) // encabezado + ítems + pie
    expect(screen.getByTestId('total-carrito')).toHaveTextContent('$20.000')
  })

  it('CartTable vacío muestra el mensaje de carrito vacío', () => {
    render(<CartTable items={[]} total={0} onCambiarCantidad={() => {}} onQuitar={() => {}} />)
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })

  it('OrderSummary lista los ítems y el total', () => {
    render(<OrderSummary items={[{ codigo: 'A', nombre: 'Cuerdas', precio: 5000, cantidad: 2 }]} total={10000} />)
    expect(screen.getByText('Cuerdas')).toBeInTheDocument()
    expect(screen.getByTestId('total-resumen')).toHaveTextContent('$10.000')
  })

  it('Footer y AdminSidebar se renderizan con su contenido', () => {
    render(<Footer />)
    expect(screen.getByText(/Todos los derechos reservados/)).toBeInTheDocument()
    renderConRouter(<AdminSidebar usuario={{ nombre: 'María', tipoUsuario: 'Administrador' }} />)
    expect(screen.getByText(/María · Administrador/)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Productos críticos' })).toBeInTheDocument()
  })

  it('StatCard muestra título, valor, detalle y enlace', () => {
    renderConRouter(<StatCard titulo="Compras" valor={7} detalle="detalle X" enlace="/admin/ordenes" />)
    expect(screen.getByTestId('stat-Compras')).toHaveTextContent('7')
    expect(screen.getByText('detalle X')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Ver detalle/ })).toHaveAttribute('href', '/admin/ordenes')
  })
})

describe('Renderizado condicional', () => {
  it('AlertMessage solo se muestra cuando hay mensaje', () => {
    const { rerender } = render(<AlertMessage tipo="danger" mensaje="" />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    rerender(<AlertMessage tipo="danger" mensaje="Algo falló" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Algo falló')
  })

  it('FormField muestra el error solo cuando hay error', () => {
    const { rerender } = render(<FormField id="x" label="Campo" value="" onChange={() => {}} />)
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    rerender(<FormField id="x" label="Campo" value="" onChange={() => {}} error="Es obligatorio" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Es obligatorio')
    expect(screen.getByLabelText('Campo')).toHaveAttribute('aria-invalid', 'true')
  })

  it('FormField soporta select y textarea', () => {
    render(
      <>
        <FormField id="s" label="Elige" as="select" opciones={['uno', 'dos']} value="" onChange={() => {}} />
        <FormField id="t" label="Texto" as="textarea" value="hola" onChange={() => {}} />
      </>,
    )
    expect(screen.getAllByRole('option')).toHaveLength(3) // placeholder + 2
    expect(screen.getByLabelText('Texto')).toHaveValue('hola')
  })

  it('un producto en stock crítico muestra la etiqueta; uno con stock normal no', () => {
    const { rerender } = render(<CriticalBadge producto={bajo} />)
    expect(screen.getByText('Stock crítico')).toBeInTheDocument()
    rerender(<CriticalBadge producto={guitarra} />)
    expect(screen.queryByText('Stock crítico')).not.toBeInTheDocument()
  })

  it('Navbar muestra el logo como enlace al inicio, con texto alternativo', () => {
    renderConRouter(<Navbar usuario={null} />)
    const logo = screen.getByRole('img', { name: 'Sonido Vivo' })
    expect(logo).toHaveAttribute('src', '/img/logo-sonido-vivo.png')
    expect(screen.getByRole('link', { name: 'Sonido Vivo' })).toHaveAttribute('href', '/')
  })

  it('Navbar muestra "Iniciar sesión" sin sesión', () => {
    renderConRouter(<Navbar usuario={null} cantidadCarrito={0} />)
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
    expect(screen.queryByText('Cerrar sesión')).not.toBeInTheDocument()
  })

  it('Navbar muestra el nombre del usuario y "Cerrar sesión" con sesión', async () => {
    const salir = vi.fn()
    renderConRouter(<Navbar usuario={{ nombre: 'Camila', tipoUsuario: 'Cliente' }} cantidadCarrito={2} onCerrarSesion={salir} />)
    expect(screen.getByText('Camila')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Iniciar sesión' })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument() // cliente: sin acceso admin
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(salir).toHaveBeenCalledTimes(1)
  })

  it('Navbar muestra el enlace Admin a administradores y vendedores, no a clientes', () => {
    const { unmount } = renderConRouter(<Navbar usuario={{ nombre: 'María', tipoUsuario: 'Administrador' }} />)
    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument()
    unmount()
    const vendedor = renderConRouter(<Navbar usuario={{ nombre: 'Carlos', tipoUsuario: 'Vendedor' }} />)
    expect(screen.getByRole('link', { name: 'Admin' })).toBeInTheDocument()
    vendedor.unmount()
    renderConRouter(<Navbar usuario={{ nombre: 'Camila', tipoUsuario: 'Cliente' }} />)
    expect(screen.queryByRole('link', { name: 'Admin' })).not.toBeInTheDocument()
  })

  it('Navbar: el botón de menú abre y cierra el menú móvil', async () => {
    renderConRouter(<Navbar usuario={null} />)
    const boton = screen.getByRole('button', { name: 'Mostrar u ocultar menú' })
    const menu = document.getElementById('menuPrincipal')
    expect(menu).not.toHaveClass('show')
    await userEvent.click(boton)
    expect(menu).toHaveClass('show')
    expect(boton).toHaveAttribute('aria-expanded', 'true')
    await userEvent.click(boton)
    expect(menu).not.toHaveClass('show')
  })

  it('Navbar: elegir una opción cierra el menú móvil', async () => {
    const salir = vi.fn()
    renderConRouter(<Navbar usuario={{ nombre: 'Camila', tipoUsuario: 'Cliente' }} onCerrarSesion={salir} />)
    const boton = screen.getByRole('button', { name: 'Mostrar u ocultar menú' })
    const menu = document.getElementById('menuPrincipal')
    for (const opcion of [screen.getByRole('link', { name: 'Productos' }), screen.getByRole('link', { name: /Carrito/ }), screen.getByRole('button', { name: 'Cerrar sesión' })]) {
      await userEvent.click(boton)
      expect(menu).toHaveClass('show')
      await userEvent.click(opcion)
      expect(menu).not.toHaveClass('show')
    }
    // un clic en una zona vacía del menú no lo cierra
    await userEvent.click(boton)
    await userEvent.click(screen.getByText('Camila'))
    expect(menu).toHaveClass('show')
  })

  it('Navbar: Carrito e Iniciar/Cerrar sesión están fuera del menú colapsable y existen una sola vez', () => {
    const { unmount } = renderConRouter(<Navbar usuario={null} cantidadCarrito={2} />)
    const menu = document.getElementById('menuPrincipal')
    const carrito = screen.getByRole('link', { name: 'Carrito, 2 unidades' })
    const login = screen.getByRole('link', { name: 'Iniciar sesión' })
    expect(menu).not.toContainElement(carrito)
    expect(menu).not.toContainElement(login)
    expect(screen.getAllByRole('link', { name: /Carrito/ })).toHaveLength(1)
    unmount()
    renderConRouter(<Navbar usuario={{ nombre: 'Camila', tipoUsuario: 'Cliente' }} cantidadCarrito={1} />)
    const salir = screen.getByRole('button', { name: 'Cerrar sesión' })
    expect(document.getElementById('menuPrincipal')).not.toContainElement(salir)
    expect(screen.getByRole('link', { name: 'Carrito, 1 unidad' })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Iniciar sesión' })).not.toBeInTheDocument()
  })

  it('ProductCard deshabilita el botón cuando no hay stock', () => {
    renderConRouter(<ProductCard producto={{ ...guitarra, stock: 0 }} onAgregar={() => {}} />)
    expect(screen.getByRole('button', { name: 'Sin stock' })).toBeDisabled()
  })
})

describe('Props', () => {
  it('ProductCard recibe nombre, precio en formato CLP e imagen', () => {
    renderConRouter(<ProductCard producto={guitarra} onAgregar={() => {}} />)
    expect(screen.getByText('Guitarra Folk')).toBeInTheDocument()
    expect(screen.getByTestId('precio')).toHaveTextContent('$129.990')
    expect(screen.getByRole('img', { name: 'Guitarra Folk' })).toHaveAttribute('src', 'https://img.test/guitarra.jpg')
  })

  it('ProductCard en oferta tacha el precio normal y cobra el de oferta', () => {
    renderConRouter(<ProductCard producto={{ ...guitarra, oferta: true, precioOferta: 100000 }} onAgregar={() => {}} />)
    expect(screen.getByText('Oferta')).toBeInTheDocument()
    expect(screen.getByTestId('precio')).toHaveTextContent('$100.000')
    expect(screen.getByText('$129.990').tagName).toBe('DEL')
  })

  it('Button genérico recibe label y onClick', async () => {
    const alClic = vi.fn()
    render(<Button label="Guardar" onClick={alClic} variant="success" />)
    const boton = screen.getByRole('button', { name: 'Guardar' })
    expect(boton).toHaveClass('btn-success')
    await userEvent.click(boton)
    expect(alClic).toHaveBeenCalledTimes(1)
  })

  it('CategoryCard recibe categoría y cantidad y enlaza a su página', () => {
    renderConRouter(<CategoryCard categoria={{ id: 'baterias', nombre: 'Baterías', color: '#4A3B5C' }} cantidad={5} activa />)
    expect(screen.getByText('5 productos')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/categorias/baterias')
    expect(screen.getByRole('link').querySelector('img')).toBeNull() // sin imagen: solo el color de marca
  })

  it('CategoryCard con imagen y lema muestra la foto y el lema en vez de la cantidad', () => {
    renderConRouter(<CategoryCard categoria={{ id: 'baterias', nombre: 'Baterías', color: '#4A3B5C' }} cantidad={5} imagen="/img/x.jpg" lema="Marca el ritmo" />)
    expect(screen.getByText('Marca el ritmo')).toBeInTheDocument()
    expect(screen.queryByText('5 productos')).not.toBeInTheDocument()
    expect(screen.getByRole('link').querySelector('img')).toHaveAttribute('src', '/img/x.jpg')
  })
})

describe('Estado', () => {
  it('un formulario controlado cambia su estado al escribir', async () => {
    function Demo() {
      const [nombre, setNombre] = useState('')
      return (
        <>
          <FormField id="nombre" label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
          <p data-testid="eco">{nombre}</p>
        </>
      )
    }
    render(<Demo />)
    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana')
    expect(screen.getByLabelText('Nombre')).toHaveValue('Ana')
    expect(screen.getByTestId('eco')).toHaveTextContent('Ana')
  })

  it('SearchBar avisa cada cambio de texto con onCambio', async () => {
    const alCambiar = vi.fn()
    render(<SearchBar value="" onCambio={alCambiar} />)
    await userEvent.type(screen.getByRole('searchbox'), 'ab')
    expect(alCambiar).toHaveBeenCalledTimes(2)
    expect(alCambiar).toHaveBeenLastCalledWith('b')
  })

  it('ConfirmButton pide confirmación antes de ejecutar la acción', async () => {
    const eliminar = vi.fn()
    render(<ConfirmButton onConfirm={eliminar} />)
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(eliminar).not.toHaveBeenCalled() // primer clic: solo pregunta
    await userEvent.click(screen.getByRole('button', { name: 'Sí' }))
    expect(eliminar).toHaveBeenCalledTimes(1)
  })

  it('ConfirmButton: "No" cancela y vuelve al botón inicial', async () => {
    const eliminar = vi.fn()
    render(<ConfirmButton onConfirm={eliminar} />)
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    await userEvent.click(screen.getByRole('button', { name: 'No' }))
    expect(eliminar).not.toHaveBeenCalled()
    expect(within(document.body).getByRole('button', { name: 'Eliminar' })).toBeInTheDocument()
  })
})

describe('Eventos', () => {
  it('clic en "Añadir al carrito" llama a onAgregar con el producto', async () => {
    const agregar = vi.fn()
    renderConRouter(<ProductCard producto={guitarra} onAgregar={agregar} />)
    await userEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }))
    expect(agregar).toHaveBeenCalledWith(guitarra)
  })

  it('CartTable: + y − llaman a onCambiarCantidad y Eliminar a onQuitar', async () => {
    const cambiar = vi.fn()
    const quitar = vi.fn()
    const items = [{ codigo: 'A', nombre: 'Cuerdas', precio: 5000, cantidad: 2 }]
    render(<CartTable items={items} total={10000} onCambiarCantidad={cambiar} onQuitar={quitar} />)
    await userEvent.click(screen.getByRole('button', { name: 'Aumentar Cuerdas' }))
    expect(cambiar).toHaveBeenLastCalledWith('A', 3)
    await userEvent.click(screen.getByRole('button', { name: 'Disminuir Cuerdas' }))
    expect(cambiar).toHaveBeenLastCalledWith('A', 1)
    await userEvent.click(screen.getByRole('button', { name: 'Eliminar' }))
    expect(quitar).toHaveBeenCalledWith('A')
  })
})
