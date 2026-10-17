import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ProductoForm from '../../components/ProductoForm'
import { crear, listar } from '../../data/db'
import { valoresAProducto } from '../../utils/productos'

/* ProductoNuevo: la página solo decide qué hacer al guardar (crear en db.js); el formulario valida. */
export default function ProductoNuevo() {
  const categorias = listar('categorias').map((c) => c.nombre)
  const [error, setError] = useState('')
  const navegar = useNavigate()

  const guardar = (valores) => {
    try {
      crear('productos', valoresAProducto(valores))
      navegar('/admin/productos')
    } catch {
      setError('Ya existe un producto con ese código.') // único error posible de crear()
    }
  }

  return (
    <>
      <h1 className="h3 mb-4">Nuevo producto</h1>
      <ProductoForm categorias={categorias} onGuardar={guardar} errorGeneral={error} />
    </>
  )
}
