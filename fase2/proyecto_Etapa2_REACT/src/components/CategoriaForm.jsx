import { useState } from 'react'
import { Link } from 'react-router-dom'
import AlertMessage from './AlertMessage'
import FormField from './FormField'
import { prepararFormulario } from '../utils/formularios'
import { ESQUEMA_CATEGORIA } from '../utils/validaciones'

/* CategoriaForm: nombre y descripción de una categoría (compartido por nueva/editar). */
export default function CategoriaForm({ inicial = { nombre: '', descripcion: '' }, modoEdicion = false, onGuardar, errorGeneral = '' }) {
  const [valores, setValores] = useState(inicial)
  const [enviado, setEnviado] = useState(false)
  const { campo, hayErrores } = prepararFormulario(valores, setValores, ESQUEMA_CATEGORIA, enviado)

  const enviar = (e) => {
    e.preventDefault()
    setEnviado(true)
    if (!hayErrores) onGuardar(valores)
  }

  return (
    <form onSubmit={enviar} noValidate style={{ maxWidth: 520 }}>
      <FormField {...campo('nombre')} label="Nombre" />
      <FormField {...campo('descripcion')} label="Descripción (opcional)" as="textarea" />
      <AlertMessage tipo="danger" mensaje={errorGeneral} />
      <button type="submit" className="btn btn-primary me-2">{modoEdicion ? 'Guardar cambios' : 'Crear categoría'}</button>
      <Link to="/admin/categorias" className="btn btn-outline-secondary">Cancelar</Link>
    </form>
  )
}
