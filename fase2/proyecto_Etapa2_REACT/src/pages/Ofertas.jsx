import ProductGrid from '../components/ProductGrid'
import { listar } from '../data/db'
import { useCart } from '../context/CartContext'

/* Ofertas: todos los productos con oferta=true. Reutiliza ProductGrid. */
export default function Ofertas() {
  const productos = listar('productos')
  const { agregar } = useCart()
  return (
    <>
      <h1 className="h3 mb-4">Ofertas</h1>
      <ProductGrid productos={productos.filter((p) => p.oferta)} onAgregar={agregar} mensajeVacio="No hay productos en oferta" />
    </>
  )
}
