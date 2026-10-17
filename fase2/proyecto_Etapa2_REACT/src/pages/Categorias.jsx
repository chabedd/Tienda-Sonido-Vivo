import { useParams } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import ProductGrid from '../components/ProductGrid'
import { listar } from '../data/db'
import { useCart } from '../context/CartContext'

/*
  Categorias: tarjetas de categorías + productos de la seleccionada.
  La categoría seleccionada vive en la URL (/categorias/:id), no en un useState:
  así se puede compartir el enlace y funciona el botón "atrás".
*/
export default function Categorias() {
  const { id } = useParams()
  const categorias = listar('categorias')
  const productos = listar('productos')
  const { agregar } = useCart()

  const seleccionada = categorias.find((c) => c.id === id)
  const productosDeCategoria = seleccionada ? productos.filter((p) => p.categoria === seleccionada.nombre) : []

  return (
    <>
      <h1 className="h3 mb-4">Categorías</h1>
      <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3 mb-5">
        {categorias.map((c) => (
          <div className="col" key={c.id}>
            <CategoryCard
              categoria={c}
              activa={c.id === id}
              cantidad={productos.filter((p) => p.categoria === c.nombre).length}
            />
          </div>
        ))}
      </div>

      {seleccionada ? (
        <>
          <h2 className="h4 mb-3">{seleccionada.nombre}</h2>
          <ProductGrid productos={productosDeCategoria} onAgregar={agregar} />
        </>
      ) : (
        <p className="text-muted">{id ? 'La categoría solicitada no existe.' : 'Elige una categoría para ver sus productos.'}</p>
      )}
    </>
  )
}
