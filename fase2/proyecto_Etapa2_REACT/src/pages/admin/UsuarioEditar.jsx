import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AlertMessage from '../../components/AlertMessage'
import UsuarioForm from '../../components/UsuarioForm'
import { actualizar, listar, obtener } from '../../data/db'

/* UsuarioEditar: si la contraseña viene vacía se conserva la anterior; el correo no puede repetirse. */
export default function UsuarioEditar() {
  const { run } = useParams()
  const navegar = useNavigate()
  const [error, setError] = useState('')
  const usuario = obtener('usuarios', run)

  if (!usuario) {
    return (
      <>
        <AlertMessage tipo="warning" mensaje="No se encontró el usuario." />
        <Link to="/admin/usuarios">Volver al listado</Link>
      </>
    )
  }

  const guardar = ({ password, ...resto }) => {
    const correo = resto.correo.trim().toLowerCase()
    if (listar('usuarios').some((u) => u.run !== run && u.correo.toLowerCase() === correo)) {
      setError('Ya existe un usuario con ese correo.')
      return
    }
    actualizar('usuarios', run, password ? { ...resto, password } : resto)
    navegar('/admin/usuarios')
  }

  return (
    <>
      <h1 className="h3 mb-4">Editar usuario</h1>
      <UsuarioForm inicial={usuario} modoEdicion onGuardar={guardar} errorGeneral={error} />
    </>
  )
}
