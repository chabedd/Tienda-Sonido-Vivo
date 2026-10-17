import { describe, expect, it } from 'vitest'
import {
  cumpleLargoMaximo,
  cumpleLargoMinimo,
  ESQUEMA_CONTACTO,
  ESQUEMA_LOGIN,
  ESQUEMA_PRODUCTO,
  ESQUEMA_REGISTRO,
  esDecimalValido,
  esRequerido,
  esSoloNumeros,
  tieneDominioPermitido,
  tieneFormatoCorreo,
  validarCampo,
  validarFormulario,
  validarRango,
  validarRun,
  REGLAS_PASSWORD,
} from '../utils/validaciones'
import { formatearCLP, formatearFecha } from '../utils/formato'
import { esStockCritico, filtrarProductos, precioVigente } from '../utils/productos'
import { obtenerComunasPorRegion, obtenerListaRegiones } from '../utils/regiones-comunas'

describe('validaciones — reglas básicas', () => {
  it('esRequerido rechaza vacío, solo espacios, null y undefined', () => {
    expect(esRequerido('')).toBe(false)
    expect(esRequerido('   ')).toBe(false)
    expect(esRequerido(null)).toBe(false)
    expect(esRequerido(undefined)).toBe(false)
    expect(esRequerido('a')).toBe(true)
  })

  it('largo mínimo y máximo incluyen el valor límite (caso borde)', () => {
    expect(cumpleLargoMinimo('abcd', 4)).toBe(true)
    expect(cumpleLargoMinimo('abc', 4)).toBe(false)
    expect(cumpleLargoMaximo('abcde', 5)).toBe(true)
    expect(cumpleLargoMaximo('abcdef', 5)).toBe(false)
  })

  it('correo: formato y dominios permitidos', () => {
    expect(tieneFormatoCorreo('a@b.cl')).toBe(true)
    expect(tieneFormatoCorreo('sin-arroba.cl')).toBe(false)
    expect(tieneFormatoCorreo('a@b')).toBe(false)
    expect(tieneDominioPermitido('x@duoc.cl')).toBe(true)
    expect(tieneDominioPermitido('x@PROFESOR.DUOC.CL')).toBe(true)
    expect(tieneDominioPermitido('x@gmail.com')).toBe(true)
    expect(tieneDominioPermitido('x@hotmail.com')).toBe(false)
  })

  it('números: solo dígitos y decimales', () => {
    expect(esSoloNumeros('123')).toBe(true)
    expect(esSoloNumeros('12.5')).toBe(false)
    expect(esDecimalValido('12.5')).toBe(true)
    expect(esDecimalValido('12.')).toBe(false)
    expect(esDecimalValido('-1')).toBe(false)
  })

  it('validarRun acepta RUN con dígito verificador correcto', () => {
    expect(validarRun('11111111-1')).toBe(true)
    expect(validarRun('12345678-5')).toBe(true)
  })

  it('validarRun rechaza dígito incorrecto, sin guion o con puntos', () => {
    expect(validarRun('12345678-9')).toBe(false)
    expect(validarRun('123456785')).toBe(false)
    expect(validarRun('12.345.678-5')).toBe(false)
  })
})

describe('validaciones — rangos de precio y stock (casos borde)', () => {
  it('el cero es válido (producto gratis / sin stock)', () => {
    expect(validarRango('0', 0)).toBe(true)
  })

  it('un negativo o un texto no es válido', () => {
    expect(validarRango('-1', 0)).toBe(false)
    expect(validarRango('abc', 0)).toBe(false)
  })

  it('respeta el máximo cuando se indica (límite inclusive)', () => {
    expect(validarRango('100', 0, 100)).toBe(true)
    expect(validarRango('101', 0, 100)).toBe(false)
  })
})

describe('validaciones — motor de reglas y esquemas', () => {
  it('validarCampo devuelve el mensaje de la PRIMERA regla que falla', () => {
    expect(validarCampo('', REGLAS_PASSWORD)).toBe('La contraseña es obligatoria.')
    expect(validarCampo('abc', REGLAS_PASSWORD)).toBe('Debe tener entre 4 y 10 caracteres.')
    expect(validarCampo('abcd', REGLAS_PASSWORD)).toBe('')
  })

  it('login: devuelve errores solo de los campos inválidos', () => {
    const errores = validarFormulario({ correo: 'x@hotmail.com', password: 'abcd' }, ESQUEMA_LOGIN)
    expect(Object.keys(errores)).toEqual(['correo'])
  })

  it('registro: la confirmación debe coincidir con la contraseña', () => {
    const base = {
      run: '11111111-1', nombre: 'Ana', apellidos: 'Soto', correo: 'ana@gmail.com',
      region: 'Región de Valparaíso', comuna: 'Quilpué', direccion: 'Calle 1',
      password: 'abcd',
    }
    expect(validarFormulario({ ...base, confirmacion: 'abcd' }, ESQUEMA_REGISTRO)).toEqual({})
    expect(validarFormulario({ ...base, confirmacion: 'otra' }, ESQUEMA_REGISTRO).confirmacion).toMatch(/no coinciden/)
  })

  it('contacto: el correo es opcional pero se valida si se escribe', () => {
    const base = { nombre: 'Ana', comentario: 'Hola' }
    expect(validarFormulario({ ...base, correo: '' }, ESQUEMA_CONTACTO)).toEqual({})
    expect(validarFormulario({ ...base, correo: 'ana@hotmail.com' }, ESQUEMA_CONTACTO).correo).toBeDefined()
  })

  it('producto: valida precio, stock y código mínimo 3', () => {
    const errores = validarFormulario(
      { codigo: 'AB', nombre: 'X', precio: '-5', stock: '1.5', stockCritico: '', categoria: '' },
      ESQUEMA_PRODUCTO,
    )
    expect(Object.keys(errores).sort()).toEqual(['categoria', 'codigo', 'precio', 'stock'])
  })
})

describe('utilidades puras', () => {
  it('formatearCLP usa punto como separador de miles', () => {
    expect(formatearCLP(129990)).toBe('$129.990')
    expect(formatearCLP(0)).toBe('$0')
    expect(formatearCLP(1000000)).toBe('$1.000.000')
  })

  it('formatearFecha devuelve vacío con fecha inválida', () => {
    expect(formatearFecha('no-es-fecha')).toBe('')
    expect(formatearFecha('2026-01-02T03:04:00')).toBe('02-01-2026 03:04')
  })

  it('esStockCritico: stock <= crítico (por producto o por defecto 3)', () => {
    expect(esStockCritico({ stock: 3, stockCritico: 3 })).toBe(true)
    expect(esStockCritico({ stock: 4, stockCritico: 3 })).toBe(false)
    expect(esStockCritico({ stock: 3 })).toBe(true)
  })

  it('precioVigente usa el precio de oferta solo si está en oferta', () => {
    expect(precioVigente({ precio: 100, oferta: true, precioOferta: 80 })).toBe(80)
    expect(precioVigente({ precio: 100, oferta: false, precioOferta: 80 })).toBe(100)
  })

  it('filtrarProductos busca por texto y por categoría', () => {
    const lista = [
      { codigo: 'A1', nombre: 'Guitarra Folk', marca: 'Yamaha', categoria: 'Guitarras' },
      { codigo: 'B1', nombre: 'Bajo', marca: 'Fender', categoria: 'Bajos' },
    ]
    expect(filtrarProductos(lista, { texto: 'yamaha' })).toHaveLength(1)
    expect(filtrarProductos(lista, { categoria: 'Bajos' })).toHaveLength(1)
    expect(filtrarProductos(lista, { texto: 'zzz' })).toHaveLength(0)
    expect(filtrarProductos(lista, {})).toHaveLength(2)
  })

  it('regiones: cada región tiene comunas y una inexistente da lista vacía', () => {
    expect(obtenerListaRegiones()).toHaveLength(6)
    expect(obtenerComunasPorRegion('Región de Ñuble')).toContain('Chillán')
    expect(obtenerComunasPorRegion('Atlántida')).toEqual([])
  })
})
