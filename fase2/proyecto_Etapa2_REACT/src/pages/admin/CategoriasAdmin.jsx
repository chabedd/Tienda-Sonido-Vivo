import { useState } from 'react'
import { Link } from 'react-router-dom'
import AlertMessage from '../../components/AlertMessage'
import ConfirmButton from '../../components/ConfirmButton'
import { eliminar, listar } from '../../data/db'

/* CategoriasAdmin: listado. Regla de negocio: no se puede borrar una categoría que aún tiene productos. */
export default function CategoriasAdmin() {
  const [categorias, setCategorias] = useState(() => listar('categorias'))
  const productos = listar('productos')
  const [error, setError] = useState('')

  const cantidad = (c) => productos.filter((p) => p.categoria === c.nombre).length
  const borrar = (c) => {
    if (cantidad(c) > 0) {
      setError(`No se puede eliminar "${c.nombre}" porque tiene productos asociados.`)
      return
    }
    setError('')
    eliminar('categorias', c.id)
    setCategorias(listar('categorias'))
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Categorías</h1>
        <Link to="/admin/categorias/nueva" className="btn btn-primary">Nueva categoría</Link>
      </div>
      <AlertMessage tipo="danger" mensaje={error} />
      <div className="table-responsive">
        <table className="table table-hover align-middle">
          <thead><tr><th>Nombre</th><th>Descripción</th><th className="text-end">Productos</th><th /></tr></thead>
          <tbody>
            {categorias.map((c) => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td className="small text-muted">{c.descripcion}</td>
                <td className="text-end">{cantidad(c)}</td>
                <td className="text-end text-nowrap">
                  <Link to={`/admin/categorias/${c.id}/editar`} className="btn btn-sm btn-outline-primary me-1">Editar</Link>
                  <ConfirmButton mensaje="¿Eliminar?" onConfirm={() => borrar(c)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
