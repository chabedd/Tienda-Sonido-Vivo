import { useState } from 'react'
import { Link } from 'react-router-dom'
import AlertMessage from './AlertMessage'
import FormField from './FormField'
import RegionComunaFields from './RegionComunaFields'
import { prepararFormulario } from '../utils/formularios'
import { ESQUEMA_USUARIO_ADMIN, REGLAS_PASSWORD } from '../utils/validaciones'

const VACIO = {
  run: '', nombre: '', apellidos: '', correo: '', tipoUsuario: '', region: '', comuna: '', direccion: '', fechaNacimiento: '', password: '',
}
const TIPOS = ['Administrador', 'Vendedor', 'Cliente']

/*
  UsuarioForm: formulario de usuario para nuevo / editar / perfil.
  Props: inicial, modoEdicion (contraseña opcional y RUN bloqueado), bloqueados (campos
  de solo lectura, p. ej. el perfil no deja cambiar el tipo de usuario), onGuardar, errorGeneral.
*/
export default function UsuarioForm({ inicial = VACIO, modoEdicion = false, bloqueados = [], onGuardar, errorGeneral = '', rutaCancelar = '/admin/usuarios' }) {
  // al crear, la contraseña es obligatoria; al editar solo se valida si se escribe una
  const esquema = modoEdicion ? ESQUEMA_USUARIO_ADMIN : { ...ESQUEMA_USUARIO_ADMIN, password: REGLAS_PASSWORD }
  const soloLectura = modoEdicion ? ['run', ...bloqueados] : bloqueados
  const [valores, setValores] = useState({ ...VACIO, ...inicial, password: '' })
  const [enviado, setEnviado] = useState(false)
  const { campo, hayErrores } = prepararFormulario(valores, setValores, esquema, enviado)

  const enviar = (e) => {
    e.preventDefault()
    setEnviado(true)
    if (!hayErrores) onGuardar(valores)
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div className="row">
        <div className="col-md-4"><FormField {...campo('run')} label="RUN (12345678-5)" readOnly={soloLectura.includes('run')} /></div>
        <div className="col-md-4"><FormField {...campo('nombre')} label="Nombre" /></div>
        <div className="col-md-4"><FormField {...campo('apellidos')} label="Apellidos" /></div>
        <div className="col-md-6"><FormField {...campo('correo')} label="Correo" type="email" readOnly={soloLectura.includes('correo')} /></div>
        <div className="col-md-3">
          <FormField {...campo('tipoUsuario')} label="Tipo de usuario" as="select" opciones={TIPOS} disabled={soloLectura.includes('tipoUsuario')} />
        </div>
        <div className="col-md-3"><FormField {...campo('fechaNacimiento')} label="Fecha de nacimiento" type="date" /></div>
        <RegionComunaFields
          campo={campo}
          region={valores.region}
          onCambiarRegion={(region) => setValores({ ...valores, region, comuna: '' })}
        />
        <div className="col-md-8"><FormField {...campo('direccion')} label="Dirección" /></div>
        <div className="col-md-4">
          <FormField {...campo('password')} label={modoEdicion ? 'Nueva contraseña (opcional)' : 'Contraseña (4 a 10 caracteres)'} type="password" autoComplete="new-password" />
        </div>
      </div>
      <AlertMessage tipo="danger" mensaje={errorGeneral} />
      <button type="submit" className="btn btn-primary me-2">{modoEdicion ? 'Guardar cambios' : 'Crear usuario'}</button>
      <Link to={rutaCancelar} className="btn btn-outline-secondary">Cancelar</Link>
    </form>
  )
}
