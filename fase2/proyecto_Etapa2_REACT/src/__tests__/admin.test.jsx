import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it } from 'vitest'
import { crear, listar, obtener } from '../data/db'
import { PRODUCTOS_SEMILLA } from '../data/seed'
import { resumenVentas } from '../utils/reportes'
import { valoresAProducto, productoAValores } from '../utils/productos'
import { ADMIN, iniciarSesionComo, renderApp } from './helpers'

beforeEach(() => iniciarSesionComo(ADMIN))

const orden = (extra = {}) => ({
  fecha: '2026-05-01T10:00:00.000Z', estado: 'Pagada', total: 20000,
  cliente: { run: '33333333-3', nombre: 'Camila', apellidos: 'Rojas', correo: 'camila.rojas@gmail.com' },
  direccion: { calle: 'Calle 1', departamento: '', region: 'Región de Valparaíso', comuna: 'Quilpué', indicaciones: '' },
  items: [{ codigo: 'GA001', nombre: 'Guitarra Acústica Folk', precio: 10000, cantidad: 2 }],
  ...extra,
})

describe('Acceso al panel', () => {
  it('un cliente no puede entrar al panel', () => {
    iniciarSesionComo({ nombre: 'Camila', tipoUsuario: 'Cliente' })
    renderApp('/admin')
    expect(screen.getByText(/solo para administradores y vendedores/)).toBeInTheDocument()
  })
})

describe('Dashboard y reportes', () => {
  it('el dashboard muestra las métricas desde db.js', () => {
    crear('ordenes', orden())
    renderApp('/admin')
    expect(screen.getByTestId('stat-Compras')).toHaveTextContent('1')
    expect(screen.getByTestId('stat-Productos')).toHaveTextContent(String(PRODUCTOS_SEMILLA.length))
    expect(screen.getByTestId('stat-Usuarios')).toHaveTextContent('3')
  })

  it('resumenVentas calcula totales, ticket promedio y top de productos', () => {
    const r = resumenVentas([orden(), orden({ total: 10000, items: [{ codigo: 'GA001', nombre: 'Guitarra Acústica Folk', precio: 10000, cantidad: 1 }] })], PRODUCTOS_SEMILLA)
    expect(r.cantidadOrdenes).toBe(2)
    expect(r.totalVendido).toBe(30000)
    expect(r.ticketPromedio).toBe(15000)
    expect(r.topProductos[0]).toMatchObject({ codigo: 'GA001', unidades: 3 })
    expect(r.porCategoria[0].categoria).toBe('Guitarras Acústicas')
  })

  it('resumenVentas sin órdenes devuelve ceros', () => {
    expect(resumenVentas([], [])).toMatchObject({ cantidadOrdenes: 0, totalVendido: 0, ticketPromedio: 0, topProductos: [] })
  })

  it('la página de reportes muestra ventas y productos más vendidos', () => {
    crear('ordenes', orden())
    renderApp('/admin/reportes')
    expect(screen.getByTestId('stat-Ventas')).toHaveTextContent('$20.000')
    expect(screen.getAllByText('Guitarra Acústica Folk').length).toBeGreaterThan(0)
  })

  it('los reportes sin ventas lo indican', () => {
    renderApp('/admin/reportes')
    expect(screen.getAllByText('Sin ventas todavía.')).toHaveLength(2)
  })
})

describe('Órdenes e historial', () => {
  it('lista las órdenes y abre la boleta', async () => {
    crear('ordenes', orden())
    renderApp('/admin/ordenes')
    await userEvent.click(screen.getByRole('link', { name: 'Ver boleta' }))
    expect(screen.getByRole('heading', { name: 'Boleta #1001' })).toBeInTheDocument()
    expect(screen.getByTestId('total-resumen')).toHaveTextContent('$20.000')
  })

  it('sin órdenes muestra el mensaje vacío; boleta inexistente avisa', () => {
    const { unmount } = renderApp('/admin/ordenes')
    expect(screen.getByText('Aún no hay compras registradas.')).toBeInTheDocument()
    unmount()
    renderApp('/admin/ordenes/9999')
    expect(screen.getByText('No se encontró la orden.')).toBeInTheDocument()
  })

  it('el historial de un usuario solo incluye sus compras', () => {
    crear('ordenes', orden())
    crear('ordenes', orden({ cliente: { run: '22222222-2', nombre: 'Carlos', apellidos: 'M', correo: 'carlos.munoz@duoc.cl' } }))
    renderApp('/admin/usuarios/33333333-3/historial')
    expect(screen.getAllByRole('link', { name: 'Ver boleta' })).toHaveLength(1)
  })

  it('historial vacío y usuario inexistente', () => {
    const { unmount } = renderApp('/admin/usuarios/33333333-3/historial')
    expect(screen.getByText('Este usuario aún no tiene compras.')).toBeInTheDocument()
    unmount()
    renderApp('/admin/usuarios/0-0/historial')
    expect(screen.getByText('No se encontró el usuario.')).toBeInTheDocument()
  })
})

describe('Productos (CRUD en la interfaz)', () => {
  async function llenar({ codigo, nombre = 'Cable', precio = '1000', stock = '5' }) {
    await userEvent.type(screen.getByLabelText('Código'), codigo)
    await userEvent.type(screen.getByLabelText('Nombre'), nombre)
    await userEvent.selectOptions(screen.getByLabelText('Categoría'), 'Accesorios')
    await userEvent.type(screen.getByLabelText('Precio (CLP)'), precio)
    await userEvent.type(screen.getByLabelText('Stock'), stock)
  }

  it('crear un producto válido lo guarda en db.js y vuelve al listado', async () => {
    renderApp('/admin/productos/nuevo')
    await llenar({ codigo: 'ZZ001' })
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }))
    expect(obtener('productos', 'ZZ001')).toMatchObject({ nombre: 'Cable', precio: 1000, stock: 5, stockCritico: 3 })
    expect(await screen.findByRole('heading', { name: 'Productos' })).toBeInTheDocument()
  })

  it('crear con un código existente muestra el error', async () => {
    renderApp('/admin/productos/nuevo')
    await llenar({ codigo: 'GA001' })
    await userEvent.click(screen.getByRole('button', { name: 'Crear producto' }))
    expect(screen.getByText('Ya existe un producto con ese código.')).toBeInTheDocument()
  })

  it('el formulario muestra errores de precio y stock inválidos', async () => {
    renderApp('/admin/productos/nuevo')
    await llenar({ codigo: 'ZZ002', precio: '-5', stock: '1.5' })
    expect(screen.getByText('Ingresa un número válido (puede tener decimales).')).toBeInTheDocument()
    expect(screen.getByText('Solo se permiten números enteros.')).toBeInTheDocument()
  })

  it('al marcar "en oferta" pide el precio de oferta y lo valida', async () => {
    renderApp('/admin/productos/nuevo')
    await llenar({ codigo: 'ZZ003' })
    await userEvent.click(screen.getByLabelText('Producto en oferta'))
    await userEvent.type(screen.getByLabelText('Precio de oferta (CLP)'), '5000')
    expect(screen.getByText(/no mayor al precio normal/)).toBeInTheDocument()
  })

  it('editar actualiza el producto y bloquea el código', async () => {
    renderApp('/admin/productos/GA001/editar')
    expect(screen.getByLabelText('Código')).toHaveAttribute('readonly')
    const nombre = screen.getByLabelText('Nombre')
    await userEvent.clear(nombre)
    await userEvent.type(nombre, 'Guitarra Renovada')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(obtener('productos', 'GA001').nombre).toBe('Guitarra Renovada')
  })

  it('editar un producto inexistente avisa', () => {
    renderApp('/admin/productos/NOPE/editar')
    expect(screen.getByText('No se encontró el producto solicitado.')).toBeInTheDocument()
  })

  it('eliminar pide confirmación y borra el producto', async () => {
    renderApp('/admin/productos')
    const fila = screen.getByText('GA001').closest('tr')
    await userEvent.click(within(fila).getByRole('button', { name: 'Eliminar' }))
    await userEvent.click(within(fila).getByRole('button', { name: 'Sí' }))
    expect(obtener('productos', 'GA001')).toBeNull()
  })

  it('el listado se puede buscar', async () => {
    renderApp('/admin/productos')
    await userEvent.type(screen.getByRole('searchbox'), 'GA001')
    expect(screen.getAllByRole('row')).toHaveLength(2) // encabezado + 1
  })

  it('la lista de críticos incluye solo productos con stock <= stock crítico', () => {
    renderApp('/admin/productos/criticos')
    const esperados = PRODUCTOS_SEMILLA.filter((p) => p.stock <= p.stockCritico).length
    expect(screen.getAllByRole('row')).toHaveLength(esperados + 1)
    expect(screen.getAllByText('Stock crítico').length).toBe(esperados)
  })

  it('valoresAProducto y productoAValores son operaciones inversas', () => {
    const p = obtener('productos', 'GA001')
    expect(valoresAProducto(productoAValores(p))).toMatchObject({ codigo: 'GA001', precio: p.precio, stock: p.stock, oferta: p.oferta })
  })
})

describe('Categorías', () => {
  it('crear una categoría nueva la agrega con id derivado del nombre', async () => {
    renderApp('/admin/categorias/nueva')
    await userEvent.type(screen.getByLabelText('Nombre'), 'Vientos y Metales')
    await userEvent.click(screen.getByRole('button', { name: 'Crear categoría' }))
    expect(obtener('categorias', 'vientos-y-metales')).toMatchObject({ nombre: 'Vientos y Metales' })
  })

  it('crear una categoría repetida muestra el error', async () => {
    renderApp('/admin/categorias/nueva')
    await userEvent.type(screen.getByLabelText('Nombre'), 'Baterías')
    await userEvent.click(screen.getByRole('button', { name: 'Crear categoría' }))
    expect(screen.getByText('Ya existe una categoría con ese nombre.')).toBeInTheDocument()
  })

  it('no permite eliminar una categoría con productos', async () => {
    renderApp('/admin/categorias')
    const fila = screen.getByText('Baterías').closest('tr')
    await userEvent.click(within(fila).getByRole('button', { name: 'Eliminar' }))
    await userEvent.click(within(fila).getByRole('button', { name: 'Sí' }))
    expect(screen.getByText(/tiene productos asociados/)).toBeInTheDocument()
    expect(obtener('categorias', 'baterias')).not.toBeNull()
  })

  it('permite eliminar una categoría sin productos', async () => {
    crear('categorias', { id: 'vacia', nombre: 'Vacía', descripcion: '' })
    renderApp('/admin/categorias')
    const fila = screen.getByText('Vacía').closest('tr')
    await userEvent.click(within(fila).getByRole('button', { name: 'Eliminar' }))
    await userEvent.click(within(fila).getByRole('button', { name: 'Sí' }))
    expect(obtener('categorias', 'vacia')).toBeNull()
  })

  it('renombrar una categoría actualiza la categoría de sus productos', async () => {
    renderApp('/admin/categorias/baterias/editar')
    const nombre = screen.getByLabelText('Nombre')
    await userEvent.clear(nombre)
    await userEvent.type(nombre, 'Percusión')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(obtener('productos', 'BT001').categoria).toBe('Percusión')
  })

  it('renombrar una categoría con el nombre de otra muestra el error', async () => {
    renderApp('/admin/categorias/baterias/editar')
    const nombre = screen.getByLabelText('Nombre')
    await userEvent.clear(nombre)
    await userEvent.type(nombre, 'Micrófonos')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getByText('Ya existe una categoría con ese nombre.')).toBeInTheDocument()
    expect(obtener('categorias', 'baterias').nombre).toBe('Baterías')
  })

  it('editar una categoría inexistente avisa', () => {
    renderApp('/admin/categorias/nada/editar')
    expect(screen.getByText('No se encontró la categoría.')).toBeInTheDocument()
  })
})

describe('Usuarios y perfil', () => {
  async function llenarUsuario(run, correo) {
    await userEvent.type(screen.getByLabelText(/RUN/), run)
    await userEvent.type(screen.getByLabelText('Nombre'), 'Pedro')
    await userEvent.type(screen.getByLabelText('Apellidos'), 'Díaz')
    await userEvent.type(screen.getByLabelText('Correo'), correo)
    await userEvent.selectOptions(screen.getByLabelText('Tipo de usuario'), 'Vendedor')
    await userEvent.selectOptions(screen.getByLabelText('Región'), 'Región de Los Lagos')
    await userEvent.selectOptions(screen.getByLabelText('Comuna'), 'Osorno')
    await userEvent.type(screen.getByLabelText('Dirección'), 'Calle 5')
    await userEvent.type(screen.getByLabelText(/^Contraseña/), 'abcd')
  }

  it('crea un usuario válido', async () => {
    renderApp('/admin/usuarios/nuevo')
    await llenarUsuario('12345678-5', 'pedro@gmail.com')
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))
    expect(obtener('usuarios', '12345678-5')).toMatchObject({ tipoUsuario: 'Vendedor', comuna: 'Osorno' })
  })

  it('rechaza RUN duplicado y correo duplicado', async () => {
    const { unmount } = renderApp('/admin/usuarios/nuevo')
    await llenarUsuario('11111111-1', 'pedro@gmail.com')
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))
    expect(screen.getByText('Ya existe un usuario con ese RUN.')).toBeInTheDocument()
    unmount()
    renderApp('/admin/usuarios/nuevo')
    await llenarUsuario('12345678-5', 'camila.rojas@gmail.com')
    await userEvent.click(screen.getByRole('button', { name: 'Crear usuario' }))
    expect(screen.getByText('Ya existe un usuario con ese correo.')).toBeInTheDocument()
  })

  it('editar conserva la contraseña si se deja vacía y cambia los demás datos', async () => {
    renderApp('/admin/usuarios/33333333-3/editar')
    const nombre = screen.getByLabelText('Nombre')
    await userEvent.clear(nombre)
    await userEvent.type(nombre, 'Camilita')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(obtener('usuarios', '33333333-3')).toMatchObject({ nombre: 'Camilita', password: 'cli123' })
  })

  it('editar con una contraseña nueva la reemplaza', async () => {
    renderApp('/admin/usuarios/33333333-3/editar')
    await userEvent.type(screen.getByLabelText(/Nueva contraseña/), 'nueva1')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(obtener('usuarios', '33333333-3').password).toBe('nueva1')
  })

  it('editar no deja usar el correo de otro usuario', async () => {
    renderApp('/admin/usuarios/22222222-2/editar')
    const correo = screen.getByLabelText('Correo')
    await userEvent.clear(correo)
    await userEvent.type(correo, 'maria.perez@gmail.com')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getByText('Ya existe un usuario con ese correo.')).toBeInTheDocument()
    expect(obtener('usuarios', '22222222-2').correo).toBe('carlos.munoz@duoc.cl')
  })

  it('editar un usuario inexistente avisa', () => {
    renderApp('/admin/usuarios/0-0/editar')
    expect(screen.getByText('No se encontró el usuario.')).toBeInTheDocument()
  })

  it('no deja eliminar al usuario con la sesión activa, pero sí a otro', async () => {
    renderApp('/admin/usuarios')
    const propia = screen.getByText('maria.perez@gmail.com').closest('tr')
    await userEvent.click(within(propia).getByRole('button', { name: 'Eliminar' }))
    await userEvent.click(within(propia).getByRole('button', { name: 'Sí' }))
    expect(screen.getByText(/No puedes eliminar tu propio usuario/)).toBeInTheDocument()

    const otra = screen.getByText('camila.rojas@gmail.com').closest('tr')
    await userEvent.click(within(otra).getByRole('button', { name: 'Eliminar' }))
    await userEvent.click(within(otra).getByRole('button', { name: 'Sí' }))
    expect(obtener('usuarios', '33333333-3')).toBeNull()
    expect(listar('usuarios')).toHaveLength(2)
  })

  it('el perfil actualiza los datos propios y bloquea el tipo de usuario', async () => {
    renderApp('/admin/perfil')
    expect(screen.getByLabelText('Tipo de usuario')).toBeDisabled()
    const nombre = screen.getByLabelText('Nombre')
    await userEvent.clear(nombre)
    await userEvent.type(nombre, 'María José')
    await userEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getByText('Perfil actualizado correctamente.')).toBeInTheDocument()
    expect(obtener('usuarios', '11111111-1').nombre).toBe('María José')
  })

  it('el perfil sin un usuario real en la base pide iniciar sesión', () => {
    iniciarSesionComo({ ...ADMIN, run: '99999999-9' })
    renderApp('/admin/perfil')
    expect(screen.getByText('Inicia sesión para ver tu perfil.')).toBeInTheDocument()
  })
})
