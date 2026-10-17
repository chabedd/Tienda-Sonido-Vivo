import { useState } from 'react'
import AlertMessage from '../../components/AlertMessage'
import UsuarioForm from '../../components/UsuarioForm'
import { actualizar, obtener } from '../../data/db'
import { useSession } from '../../context/SessionContext'

/*
  Perfil: el usuario con sesión edita sus propios datos. Reutiliza UsuarioForm bloqueando
  RUN, correo y tipo de usuario (no debe poder auto-asignarse otro rol).
*/
export default function Perfil() {
  const { usuario, iniciarSesion } = useSession()
  const [guardado, setGuardado] = useState(false)
  const registro = usuario ? obtener('usuarios', usuario.run) : null

  if (!registro) return <AlertMessage tipo="warning" mensaje="Inicia sesión para ver tu perfil." />

  const guardar = ({ password, ...resto }) => {
    const actualizado = actualizar('usuarios', registro.run, password ? { ...resto, password } : resto)
    iniciarSesion(actualizado) // refresca el nombre mostrado en navbar y sidebar
    setGuardado(true)
  }

  return (
    <>
      <h1 className="h3 mb-4">Mi perfil</h1>
      <AlertMessage tipo="success" mensaje={guardado ? 'Perfil actualizado correctamente.' : ''} />
      <UsuarioForm inicial={registro} modoEdicion bloqueados={['run', 'correo', 'tipoUsuario']} onGuardar={guardar} rutaCancelar="/admin" />
    </>
  )
}
