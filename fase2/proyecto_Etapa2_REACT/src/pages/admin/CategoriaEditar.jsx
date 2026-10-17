import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import AlertMessage from '../../components/AlertMessage'
import CategoriaForm from '../../components/CategoriaForm'
import { actualizar, listar, obtener } from '../../data/db'

/* CategoriaEditar: si cambia el nombre, también se actualiza la categoría de sus productos (coherencia de datos).
   No permite dejar a dos categorías con el mismo nombre. */
export default function CategoriaEditar() {
  const { id } = useParams()
  const navegar = useNavigate()
  const [error, setError] = useState('')
  const categoria = obtener('categorias', id)

  if (!categoria) {
    return (
      <>
        <AlertMessage tipo="warning" mensaje="No se encontró la categoría." />
        <Link to="/admin/categorias">Volver al listado</Link>
      </>
    )
  }

  const guardar = ({ nombre, descripcion }) => {
    const nuevoNombre = nombre.trim()
    const repetida = listar('categorias').some((c) => c.id !== id && c.nombre.toLowerCase() === nuevoNombre.toLowerCase())
    if (repetida) {
      setError('Ya existe una categoría con ese nombre.')
      return
    }
    if (nuevoNombre !== categoria.nombre) {
      listar('productos')
        .filter((p) => p.categoria === categoria.nombre)
        .forEach((p) => actualizar('productos', p.codigo, { categoria: nuevoNombre }))
    }
    actualizar('categorias', id, { nombre: nuevoNombre, descripcion: descripcion.trim() })
    navegar('/admin/categorias')
  }

  return (
    <>
      <h1 className="h3 mb-4">Editar categoría</h1>
      <CategoriaForm inicial={{ nombre: categoria.nombre, descripcion: categoria.descripcion ?? '' }} modoEdicion onGuardar={guardar} errorGeneral={error} />
    </>
  )
}
