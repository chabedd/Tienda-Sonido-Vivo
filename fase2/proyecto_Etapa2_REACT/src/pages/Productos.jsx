import { useState } from 'react'
import ProductGrid from '../components/ProductGrid'
import SearchBar from '../components/SearchBar'
import { listar } from '../data/db'
import { useCart } from '../context/CartContext'
import { filtrarProductos } from '../utils/productos'

/*
  Productos: catálogo con búsqueda y filtro por categoría.
  Estado local (useState): `texto` y `categoria` (lo que el usuario eligió).
  La lista filtrada NO es estado: se calcula en cada dibujo a partir de los datos + filtros,
  así nunca queda desincronizada.
*/
export default function Productos() {
  const productos = listar('productos')
  const categorias = listar('categorias')
  const { agregar } = useCart()
  const [texto, setTexto] = useState('')
  const [categoria, setCategoria] = useState('')

  const visibles = filtrarProductos(productos, { texto, categoria })

  return (
    <>
      <h1 className="h3 mb-4">Productos</h1>
      <div className="row g-2 mb-4">
        <div className="col-12 col-md-8">
          <SearchBar value={texto} onCambio={setTexto} />
        </div>
        <div className="col-12 col-md-4">
          <select className="form-select" aria-label="Filtrar por categoría" value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Todas las categorías</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.nombre}>{c.nombre}</option>
            ))}
          </select>
        </div>
      </div>
      <p className="text-muted small" aria-live="polite">{visibles.length} producto(s)</p>
      <ProductGrid productos={visibles} onAgregar={agregar} />
    </>
  )
}
