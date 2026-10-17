import { useState } from 'react'
import { Link } from 'react-router-dom'
import AlertMessage from '../../components/AlertMessage'
import ConfirmButton from '../../components/ConfirmButton'
import { eliminar, listar } from '../../data/db'
import { useSession } from '../../context/SessionContext'

/* UsuariosAdmin: listado; no deja eliminar a la persona con la sesión activa. */
export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState(() => listar('usuarios'))
  const { usuario: actual } = useSession()
  const [error, setError] = useState('')

  const borrar = (u) => {
    if (u.run === actual?.run) {
      setError('No puedes eliminar tu propio usuario mientras tienes la sesión iniciada.')
      return
    }
    setError('')
    eliminar('usuarios', u.run)
    setUsuarios(listar('usuarios'))
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Usuarios</h1>
        <Link to="/admin/usuarios/nuevo" className="btn btn-primary">Nuevo usuario</Link>
      </div>
      <AlertMessage tipo="danger" mensaje={error} />
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>RUN</th><th>Nombre</th><th>Correo</th><th>Tipo</th><th /></tr></thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.run}>
                <td>{u.run}</td>
                <td>{u.nombre} {u.apellidos}</td>
                <td>{u.correo}</td>
                <td><span className="badge text-bg-secondary">{u.tipoUsuario}</span></td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/usuarios/${u.run}/historial`} className="btn btn-sm btn-outline-secondary me-1">Historial</Link>
                  <Link to={`/admin/usuarios/${u.run}/editar`} className="btn btn-sm btn-outline-primary me-1">Editar</Link>
                  <ConfirmButton mensaje="¿Eliminar?" onConfirm={() => borrar(u)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
