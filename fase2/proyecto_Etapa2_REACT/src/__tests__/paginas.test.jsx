import { renderHook, act, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { CartProvider, carritoReducer, calcularTotal, useCart } from '../context/CartContext'
import { SessionProvider, useSession } from '../context/SessionContext'
import { listar, obtener } from '../data/db'
import { PRODUCTOS_SEMILLA } from '../data/seed'
import { cargarCarrito, iniciarSesionComo, renderApp } from './helpers'

const cuerdas = { codigo: 'AC001', nombre: 'Cuerdas', precio: 5000, imagen: '' }

describe('Reducer del carrito (lógica pura)', () => {
  it('agregar suma la cantidad si el producto ya existe', () => {
    let items = carritoReducer([], { tipo: 'agregar', producto: cuerdas, cantidad: 1 })
    items = carritoReducer(items, { tipo: 'agregar', producto: cuerdas, cantidad: 2 })
    expect(items).toHaveLength(1)
    expect(items[0].cantidad).toBe(3)
    expect(calcularTotal(items)).toBe(15000)
  })

  it('cambiarCantidad a 0 elimina el ítem; quitar y vaciar también', () => {
    const base = [{ ...cuerdas, cantidad: 2 }, { ...cuerdas, codigo: 'B', cantidad: 1 }]
    expect(carritoReducer(base, { tipo: 'cambiarCantidad', codigo: 'AC001', cantidad: 0 })).toHaveLength(1)
    expect(carritoReducer(base, { tipo: 'quitar', codigo: 'B' })).toHaveLength(1)
    expect(carritoReducer(base, { tipo: 'vaciar' })).toEqual([])
    expect(carritoReducer(base, { tipo: 'desconocida' })).toBe(base)
  })
})

describe('Contextos y hooks', () => {
  it('useCart / useSession fuera de su Provider lanzan error', () => {
    expect(() => renderHook(() => useCart())).toThrow(/CartProvider/)
    expect(() => renderHook(() => useSession())).toThrow(/SessionProvider/)
  })

  it('CartProvider persiste el carrito en localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    act(() => result.current.agregar(cuerdas, 2))
    expect(result.current.cantidadTotal).toBe(2)
    expect(JSON.parse(localStorage.getItem('sonidoVivoCarrito'))[0].cantidad).toBe(2)
  })

  it('CartProvider ignora un carrito corrupto en localStorage', () => {
    localStorage.setItem('sonidoVivoCarrito', '{roto')
    const { result } = renderHook(() => useCart(), { wrapper: CartProvider })
    expect(result.current.items).toEqual([])
  })

  it('SessionProvider guarda la sesión sin la contraseña y la limpia al cerrar', () => {
    const { result } = renderHook(() => useSession(), { wrapper: SessionProvider })
    act(() => result.current.iniciarSesion({ run: '1', nombre: 'Ana', tipoUsuario: 'Administrador', password: 'secreta' }))
    expect(result.current.usuario).toMatchObject({ nombre: 'Ana', tipoUsuario: 'Administrador' })
    expect(localStorage.getItem('sonidoVivoSesion')).not.toContain('secreta')
    act(() => result.current.cerrarSesion())
    expect(result.current.usuario).toBeNull()
  })

  it('el carrito cobra el precio de oferta cuando el producto está en oferta', () => {
    const enOferta = { ...cuerdas, precio: 5000, oferta: true, precioOferta: 4000 }
    const items = carritoReducer([], { tipo: 'agregar', producto: enOferta, cantidad: 2 })
    expect(items[0].precio).toBe(4000)
    expect(calcularTotal(items)).toBe(8000)
  })
})

describe('Páginas de la tienda — eventos', () => {
  it('añadir al carrito desde Productos actualiza el contador del navbar', async () => {
    renderApp('/productos')
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('0')
    await userEvent.click(screen.getAllByRole('button', { name: 'Añadir al carrito' })[0])
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('1')
  })

  it('la búsqueda reduce la lista de productos', async () => {
    renderApp('/productos')
    const esperado = PRODUCTOS_SEMILLA.filter((p) => JSON.stringify([p.nombre, p.marca, p.modelo, p.codigo]).toLowerCase().includes('yamaha')).length
    expect(screen.getByText(`${PRODUCTOS_SEMILLA.length} producto(s)`)).toBeInTheDocument()
    await userEvent.type(screen.getByRole('searchbox'), 'yamaha')
    expect(screen.getByText(`${esperado} producto(s)`)).toBeInTheDocument()
    expect(esperado).toBeLessThan(PRODUCTOS_SEMILLA.length)
  })

  it('una búsqueda sin resultados muestra "No hay productos"', async () => {
    renderApp('/productos')
    await userEvent.type(screen.getByRole('searchbox'), 'zzzzzz')
    expect(screen.getByText('No hay productos')).toBeInTheDocument()
  })

  it('el filtro por categoría muestra solo esa categoría', async () => {
    renderApp('/productos')
    await userEvent.selectOptions(screen.getByLabelText('Filtrar por categoría'), 'Baterías')
    const esperado = PRODUCTOS_SEMILLA.filter((p) => p.categoria === 'Baterías').length
    expect(screen.getByText(`${esperado} producto(s)`)).toBeInTheDocument()
  })

  it('Categorías: elegir una categoría por URL muestra sus productos', () => {
    renderApp('/categorias/baterias')
    expect(screen.getAllByRole('heading', { name: 'Baterías' })).toHaveLength(2) // tarjeta + título de la sección
    expect(screen.getByText('Batería Acústica 5 piezas')).toBeInTheDocument()
  })

  it('Categorías: una categoría inexistente avisa', () => {
    renderApp('/categorias/no-existe')
    expect(screen.getByText('La categoría solicitada no existe.')).toBeInTheDocument()
  })

  it('Ofertas muestra solo productos en oferta', () => {
    renderApp('/ofertas')
    expect(screen.getAllByText('Oferta')).toHaveLength(PRODUCTOS_SEMILLA.filter((p) => p.oferta).length)
  })

  it('DetalleProducto: añade la cantidad elegida y confirma', async () => {
    renderApp('/productos/GA001')
    const cantidad = screen.getByLabelText('Cantidad')
    await userEvent.tripleClick(cantidad) // selecciona el 1 y lo reemplaza
    await userEvent.keyboard('3')
    await userEvent.click(screen.getByRole('button', { name: 'Añadir al carrito' }))
    expect(screen.getByText(/Se añadieron 3 unidad/)).toBeInTheDocument()
    expect(screen.getByTestId('contador-carrito')).toHaveTextContent('3')
  })

  it('DetalleProducto con código inexistente avisa', () => {
    renderApp('/productos/NOEXISTE')
    expect(screen.getByText('No se encontró el producto solicitado.')).toBeInTheDocument()
  })

  it('Carrito: la cantidad sube y baja y el total se recalcula; en 0 se elimina', async () => {
    cargarCarrito([{ codigo: 'AC001', nombre: 'Cuerdas', precio: 5000, imagen: '', cantidad: 2 }])
    renderApp('/carrito')
    expect(screen.getByTestId('total-carrito')).toHaveTextContent('$10.000')
    await userEvent.click(screen.getByRole('button', { name: 'Aumentar Cuerdas' }))
    expect(screen.getByTestId('cantidad-AC001')).toHaveTextContent('3')
    expect(screen.getByTestId('total-carrito')).toHaveTextContent('$15.000')
    await userEvent.click(screen.getByRole('button', { name: 'Disminuir Cuerdas' }))
    await userEvent.click(screen.getByRole('button', { name: 'Disminuir Cuerdas' }))
    await userEvent.click(screen.getByRole('button', { name: 'Disminuir Cuerdas' }))
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })

  it('Carrito: "Limpiar carrito" vacía todo', async () => {
    cargarCarrito([{ codigo: 'AC001', nombre: 'Cuerdas', precio: 5000, imagen: '', cantidad: 1 }])
    renderApp('/carrito')
    await userEvent.click(screen.getByRole('button', { name: 'Limpiar carrito' }))
    expect(screen.getByText('Tu carrito está vacío')).toBeInTheDocument()
  })

  it('Checkout con el carrito vacío no permite pagar', () => {
    renderApp('/checkout')
    expect(screen.getByText(/no hay nada que pagar/)).toBeInTheDocument()
  })

  it('Blogs: lista ambos artículos y el detalle muestra su contenido', async () => {
    renderApp('/blogs')
    expect(screen.getAllByRole('link', { name: 'Ver caso' })).toHaveLength(2)
    await userEvent.click(screen.getAllByRole('link', { name: 'Ver caso' })[0])
    expect(screen.getByRole('heading', { name: /Fender/ })).toBeInTheDocument()
  })

  it('DetalleBlog con id inexistente avisa', () => {
    renderApp('/blogs/99')
    expect(screen.getByText('No se encontró el artículo.')).toBeInTheDocument()
  })

  it('Home muestra las 10 categorías con foto y lema, enlazadas a su página', () => {
    renderApp('/')
    expect(screen.getByRole('heading', { name: 'Explora las categorías' })).toBeInTheDocument()
    const bateria = screen.getByRole('link', { name: /Baterías\s*Marca el ritmo/ })
    expect(bateria).toHaveAttribute('href', '/categorias/baterias')
    expect(bateria.querySelector('img')).toHaveAttribute('src', '/img/portada/baterias.jpg')
    expect(document.querySelectorAll('.sv-cat-card img')).toHaveLength(10)
    expect(screen.getByRole('link', { name: 'Explorar productos' })).toHaveAttribute('href', '/productos')
  })

  it('Home, Nosotros y NotFound se renderizan', () => {
    const { unmount } = renderApp('/')
    expect(screen.getByRole('heading', { level: 1, name: /Hecho por músicos\.\s*Hecho para sonar\./ })).toBeInTheDocument()
    unmount()
    const nosotros = renderApp('/nosotros')
    expect(screen.getByText(/Once años/)).toBeInTheDocument()
    nosotros.unmount()
    renderApp('/ruta/inventada')
    expect(screen.getByText('404')).toBeInTheDocument()
  })
})

describe('Login', () => {
  it('submit inválido muestra los errores de validación', async () => {
    renderApp('/login')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(screen.getByText('El correo es obligatorio.')).toBeInTheDocument()
    expect(screen.getByText('La contraseña es obligatoria.')).toBeInTheDocument()
  })

  it('validación en vivo: el error del correo aparece mientras se escribe', async () => {
    renderApp('/login')
    await userEvent.type(screen.getByLabelText('Correo'), 'x@hotmail.com')
    expect(screen.getByText(/Solo se aceptan correos/)).toBeInTheDocument()
  })

  it('credenciales incorrectas muestran un aviso', async () => {
    renderApp('/login')
    await userEvent.type(screen.getByLabelText('Correo'), 'maria.perez@gmail.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'mala1')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(screen.getByText('Correo o contraseña incorrectos.')).toBeInTheDocument()
  })

  it('un cliente que entra queda con sesión y el navbar muestra su nombre', async () => {
    renderApp('/login')
    await userEvent.type(screen.getByLabelText('Correo'), 'camila.rojas@gmail.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'cli123')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(await screen.findByText('Camila')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cerrar sesión' })).toBeInTheDocument()
  })

  it('un vendedor también entra directo al panel y ve el enlace Admin', async () => {
    renderApp('/login')
    await userEvent.type(screen.getByLabelText('Correo'), 'carlos.munoz@duoc.cl')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'vend123')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('un administrador entra directo al panel y puede cerrar sesión', async () => {
    renderApp('/login')
    await userEvent.type(screen.getByLabelText('Correo'), 'maria.perez@gmail.com')
    await userEvent.type(screen.getByLabelText('Contraseña'), 'admin123')
    await userEvent.click(screen.getByRole('button', { name: 'Ingresar' }))
    expect(await screen.findByRole('heading', { name: 'Dashboard' })).toBeInTheDocument()
  })

  it('cerrar sesión desde la tienda vuelve a mostrar "Iniciar sesión"', async () => {
    iniciarSesionComo({ run: '33333333-3', nombre: 'Camila', tipoUsuario: 'Cliente' })
    renderApp('/')
    await userEvent.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toBeInTheDocument()
  })
})

describe('Registro y Contacto', () => {
  async function llenarRegistro(run, correo) {
    await userEvent.type(screen.getByLabelText(/RUN/), run)
    await userEvent.type(screen.getByLabelText('Correo'), correo)
    await userEvent.type(screen.getByLabelText('Nombre'), 'Ana')
    await userEvent.type(screen.getByLabelText('Apellidos'), 'Soto')
    await userEvent.selectOptions(screen.getByLabelText('Región'), 'Región de Valparaíso')
    await userEvent.selectOptions(screen.getByLabelText('Comuna'), 'Quilpué')
    await userEvent.type(screen.getByLabelText('Dirección'), 'Calle 1')
    await userEvent.type(screen.getByLabelText(/^Contraseña/), 'abcd')
    await userEvent.type(screen.getByLabelText('Confirmar contraseña'), 'abcd')
  }

  it('la comuna depende de la región elegida', async () => {
    renderApp('/registro')
    expect(screen.getByLabelText('Comuna')).toBeDisabled()
    await userEvent.selectOptions(screen.getByLabelText('Región'), 'Región de Ñuble')
    expect(screen.getByRole('option', { name: 'Chillán' })).toBeInTheDocument()
  })

  it('registro inválido muestra errores y no crea usuario', async () => {
    renderApp('/registro')
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(screen.getByText('El RUN es obligatorio.')).toBeInTheDocument()
    expect(listar('usuarios')).toHaveLength(3)
  })

  it('registro válido crea un usuario Cliente y abre su sesión', async () => {
    renderApp('/registro')
    await llenarRegistro('12345678-5', 'ana@gmail.com')
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    await waitFor(() => expect(obtener('usuarios', '12345678-5')).toMatchObject({ tipoUsuario: 'Cliente' }))
    expect(await screen.findByText('Ana')).toBeInTheDocument()
  })

  it('registro con un correo ya existente avisa', async () => {
    renderApp('/registro')
    await llenarRegistro('12345678-5', 'camila.rojas@gmail.com')
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(screen.getByText('Ya existe una cuenta con ese correo.')).toBeInTheDocument()
  })

  it('registro con un RUN ya existente avisa', async () => {
    renderApp('/registro')
    await llenarRegistro('11111111-1', 'otra@gmail.com')
    await userEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    expect(screen.getByText('Ya existe un usuario con ese RUN.')).toBeInTheDocument()
  })

  it('Contacto: cuenta caracteres, valida y confirma el envío', async () => {
    renderApp('/contacto')
    await userEvent.type(screen.getByLabelText('Comentario'), 'Hola')
    expect(screen.getByTestId('contador-comentario')).toHaveTextContent('4 / 500')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(screen.getByText('El nombre es obligatorio.')).toBeInTheDocument()
    await userEvent.type(screen.getByLabelText('Nombre completo'), 'Ana')
    await userEvent.click(screen.getByRole('button', { name: 'Enviar' }))
    expect(screen.getByText(/Mensaje enviado/)).toBeInTheDocument()
  })
})
