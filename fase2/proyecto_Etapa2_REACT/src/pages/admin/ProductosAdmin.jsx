import { useState } from 'react'
import { Link } from 'react-router-dom'
import ProductosTabla from '../../components/ProductosTabla'
import SearchBar from '../../components/SearchBar'
import { eliminar, listar } from '../../data/db'
import { filtrarProductos } from '../../utils/productos'

/* ProductosAdmin: listado con búsqueda (estado `texto`) y borrado confirmado; tras borrar se vuelve a leer la lista. */
export default function ProductosAdmin() {
  const [productos, setProductos] = useState(() => listar('productos'))
  const [texto, setTexto] = useState('')
  const visibles = filtrarProductos(productos, { texto })

  const borrar = (codigo) => {
    eliminar('productos', codigo)
    setProductos(listar('productos'))
  }

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Productos</h1>
        <Link to="/admin/productos/nuevo" className="btn btn-primary">Nuevo producto</Link>
      </div>
      <div className="mb-3" style={{ maxWidth: 420 }}><SearchBar value={texto} onCambio={setTexto} /></div>
      <ProductosTabla productos={visibles} onEliminar={borrar} />
    </>
  )
}
