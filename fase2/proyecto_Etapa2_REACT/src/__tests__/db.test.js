import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  actualizar,
  autenticar,
  crear,
  eliminar,
  listar,
  obtener,
  ordenesDeUsuario,
  PREFIJO_DB,
  reiniciar,
} from '../data/db'
import { PRODUCTOS_SEMILLA } from '../data/seed'

/*
  Pruebas de db.js con un MOCK de localStorage:
  Storage.prototype.getItem/setItem se reemplazan con vi.spyOn por funciones que leen y
  escriben en un Map en memoria. Así comprobamos QUÉ se guarda y CUÁNTAS veces,
  sin tocar el almacenamiento real del navegador.
*/
let almacen
let getItem
let setItem

beforeEach(() => {
  almacen = new Map()
  getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation((k) => (almacen.has(k) ? almacen.get(k) : null))
  setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation((k, v) => almacen.set(k, String(v)))
})

afterEach(() => {
  vi.restoreAllMocks()
})

const producto = { codigo: 'ZZ001', categoria: 'Accesorios', nombre: 'Cable', stock: 10, precio: 5000 }

describe('db.js — siembra', () => {
  it('la primera lectura siembra la colección y la persiste en localStorage', () => {
    const lista = listar('productos')
    expect(lista).toHaveLength(PRODUCTOS_SEMILLA.length)
    expect(setItem).toHaveBeenCalledWith(PREFIJO_DB + 'productos', expect.any(String))
  })

  it('con JSON corrupto vuelve a sembrar en lugar de fallar', () => {
    almacen.set(PREFIJO_DB + 'productos', '{esto no es json')
    expect(listar('productos')).toHaveLength(PRODUCTOS_SEMILLA.length)
  })

  it('si el dato guardado no es un arreglo, también se re-siembra', () => {
    almacen.set(PREFIJO_DB + 'productos', JSON.stringify({ a: 1 }))
    expect(Array.isArray(listar('productos'))).toBe(true)
  })

  it('una colección inexistente lanza error', () => {
    expect(() => listar('inventada')).toThrow(/no existe/)
  })
})

describe('db.js — CRUD', () => {
  it('crear agrega el registro y obtener lo devuelve', () => {
    crear('productos', producto)
    expect(obtener('productos', 'ZZ001')).toMatchObject({ nombre: 'Cable', precio: 5000 })
    expect(listar('productos')).toHaveLength(PRODUCTOS_SEMILLA.length + 1)
  })

  it('crear con código duplicado lanza error y no guarda nada', () => {
    crear('productos', producto)
    setItem.mockClear()
    expect(() => crear('productos', producto)).toThrow(/Ya existe/)
    expect(setItem).not.toHaveBeenCalled()
  })

  it('obtener de un producto inexistente devuelve null', () => {
    expect(obtener('productos', 'NOEXISTE')).toBeNull()
  })

  it('actualizar mezcla los cambios y conserva la clave primaria', () => {
    crear('productos', producto)
    const actualizado = actualizar('productos', 'ZZ001', { precio: 4500, codigo: 'OTRO' })
    expect(actualizado.precio).toBe(4500)
    expect(actualizado.codigo).toBe('ZZ001')
    expect(obtener('productos', 'ZZ001').precio).toBe(4500)
  })

  it('actualizar un producto inexistente lanza error', () => {
    expect(() => actualizar('productos', 'NOEXISTE', { precio: 1 })).toThrow(/No existe/)
  })

  it('eliminar quita el registro; eliminar uno inexistente lanza error', () => {
    crear('productos', producto)
    eliminar('productos', 'ZZ001')
    expect(obtener('productos', 'ZZ001')).toBeNull()
    expect(() => eliminar('productos', 'ZZ001')).toThrow(/No existe/)
  })

  it('las órdenes reciben un id automático desde 1001', () => {
    const primera = crear('ordenes', { fecha: '2026-01-01T10:00:00.000Z', total: 100 })
    const segunda = crear('ordenes', { fecha: '2026-01-02T10:00:00.000Z', total: 200 })
    expect(primera.id).toBe('1001')
    expect(segunda.id).toBe('1002')
  })

  it('lo devuelto es una copia: modificarlo no altera lo almacenado', () => {
    const copia = obtener('productos', 'GA001')
    copia.nombre = 'Cambiado'
    expect(obtener('productos', 'GA001').nombre).not.toBe('Cambiado')
  })

  it('reiniciar restaura los datos iniciales', () => {
    crear('productos', producto)
    reiniciar('productos')
    expect(obtener('productos', 'ZZ001')).toBeNull()
  })
})

describe('db.js — consultas de negocio', () => {
  it('autenticar acepta credenciales correctas (sin distinguir mayúsculas en el correo)', () => {
    expect(autenticar('MARIA.PEREZ@gmail.com', 'admin123')).toMatchObject({ tipoUsuario: 'Administrador' })
  })

  it('autenticar rechaza una contraseña incorrecta', () => {
    expect(autenticar('maria.perez@gmail.com', 'mala')).toBeNull()
  })

  it('ordenesDeUsuario devuelve solo las del RUN indicado, más recientes primero', () => {
    crear('ordenes', { fecha: '2026-01-01T10:00:00.000Z', cliente: { run: '33333333-3' } })
    crear('ordenes', { fecha: '2026-02-01T10:00:00.000Z', cliente: { run: '33333333-3' } })
    crear('ordenes', { fecha: '2026-03-01T10:00:00.000Z', cliente: { run: '11111111-1' } })
    const historial = ordenesDeUsuario('33333333-3')
    expect(historial).toHaveLength(2)
    expect(historial[0].fecha).toBe('2026-02-01T10:00:00.000Z')
  })

  it('getItem se usa para leer (el mock intercepta el almacenamiento)', () => {
    listar('blogs')
    expect(getItem).toHaveBeenCalledWith(PREFIJO_DB + 'blogs')
  })
})
