import { Link, useNavigate, useParams } from 'react-router-dom'
import AlertMessage from '../../components/AlertMessage'
import ProductoForm from '../../components/ProductoForm'
import { actualizar, listar, obtener } from '../../data/db'
import { productoAValores, valoresAProducto } from '../../utils/productos'

/* ProductoEditar: carga el producto por código (URL), rellena el formulario y actualiza en db.js. */
export default function ProductoEditar() {
  const { codigo } = useParams()
  const categorias = listar('categorias').map((c) => c.nombre)
  const navegar = useNavigate()
  const producto = obtener('productos', codigo)

  if (!producto) {
    return (
      <>
        <AlertMessage tipo="warning" mensaje="No se encontró el producto solicitado." />
        <Link to="/admin/productos">Volver al listado</Link>
      </>
    )
  }

  const guardar = (valores) => {
    actualizar('productos', codigo, valoresAProducto(valores))
    navegar('/admin/productos')
  }

  return (
    <>
      <h1 className="h3 mb-4">Editar producto</h1>
      <ProductoForm inicial={productoAValores(producto)} modoEdicion categorias={categorias} onGuardar={guardar} />
    </>
  )
}
