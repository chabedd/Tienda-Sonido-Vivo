import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UsuarioForm from '../../components/UsuarioForm'
import { crear, listar } from '../../data/db'

/* UsuarioNuevo: valida duplicados de RUN y de correo antes de crear. */
export default function UsuarioNuevo() {
  const [error, setError] = useState('')
  const navegar = useNavigate()

  const guardar = (valores) => {
    const run = valores.run.trim().toUpperCase()
    const correo = valores.correo.trim()
    if (listar('usuarios').some((u) => u.correo.toLowerCase() === correo.toLowerCase())) {
      setError('Ya existe un usuario con ese correo.')
      return
    }
    try {
      crear('usuarios', { ...valores, run, correo })
      navegar('/admin/usuarios')
    } catch {
      setError('Ya existe un usuario con ese RUN.')
    }
  }

  return (
    <>
      <h1 className="h3 mb-4">Nuevo usuario</h1>
      <UsuarioForm onGuardar={guardar} errorGeneral={error} />
    </>
  )
}
