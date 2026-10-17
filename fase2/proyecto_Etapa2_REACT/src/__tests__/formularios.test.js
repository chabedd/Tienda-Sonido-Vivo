import { describe, expect, it, vi } from 'vitest'
import { prepararFormulario } from '../utils/formularios'
import { ESQUEMA_LOGIN } from '../utils/validaciones'
import { ROLES_PANEL, tieneAccesoAlPanel } from '../utils/roles'

describe('prepararFormulario (ayuda pura de formularios)', () => {
  it('campo() entrega id, value, onChange y error listos para <FormField>', () => {
    const { campo } = prepararFormulario({ correo: 'x@hotmail.com', password: '' }, vi.fn(), ESQUEMA_LOGIN, false)
    expect(campo('correo')).toMatchObject({ id: 'correo', value: 'x@hotmail.com' })
    expect(campo('correo').error).toMatch(/Solo se aceptan correos/)
  })

  it('un campo vacío no muestra error hasta intentar enviar', () => {
    const valores = { correo: '', password: '' }
    expect(prepararFormulario(valores, vi.fn(), ESQUEMA_LOGIN, false).campo('correo').error).toBe('')
    expect(prepararFormulario(valores, vi.fn(), ESQUEMA_LOGIN, true).campo('correo').error).toBe('El correo es obligatorio.')
  })

  it('hayErrores es true mientras algún campo no cumple sus reglas', () => {
    expect(prepararFormulario({ correo: '', password: '' }, vi.fn(), ESQUEMA_LOGIN, false).hayErrores).toBe(true)
    expect(prepararFormulario({ correo: 'a@gmail.com', password: 'abcd' }, vi.fn(), ESQUEMA_LOGIN, false).hayErrores).toBe(false)
  })

  it('onChange actualiza solo el campo editado conservando los demás', () => {
    const setValores = vi.fn()
    const { campo } = prepararFormulario({ correo: 'a', password: 'b' }, setValores, ESQUEMA_LOGIN, false)
    campo('correo').onChange({ target: { value: 'nuevo' } })
    const actualizador = setValores.mock.calls[0][0]
    expect(actualizador({ correo: 'a', password: 'b' })).toEqual({ correo: 'nuevo', password: 'b' })
  })
})

describe('roles', () => {
  it('Administrador y Vendedor acceden al panel; Cliente y sin sesión no', () => {
    expect(ROLES_PANEL).toEqual(['Administrador', 'Vendedor'])
    expect(tieneAccesoAlPanel({ tipoUsuario: 'Administrador' })).toBe(true)
    expect(tieneAccesoAlPanel({ tipoUsuario: 'Vendedor' })).toBe(true)
    expect(tieneAccesoAlPanel({ tipoUsuario: 'Cliente' })).toBe(false)
    expect(tieneAccesoAlPanel(null)).toBe(false)
  })
})
