import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CategoriaForm from '../../components/CategoriaForm'
import { crear } from '../../data/db'
import { slug } from '../../utils/formato'

/* CategoriaNueva: el id se deriva del nombre (slug), igual que en la semilla. */
export default function CategoriaNueva() {
  const [error, setError] = useState('')
  const navegar = useNavigate()

  const guardar = ({ nombre, descripcion }) => {
    try {
      crear('categorias', { id: slug(nombre), nombre: nombre.trim(), descripcion: descripcion.trim(), color: '#2A241C' })
      navegar('/admin/categorias')
    } catch {
      setError('Ya existe una categoría con ese nombre.')
    }
  }

  return (
    <>
      <h1 className="h3 mb-4">Nueva categoría</h1>
      <CategoriaForm onGuardar={guardar} errorGeneral={error} />
    </>
  )
}
