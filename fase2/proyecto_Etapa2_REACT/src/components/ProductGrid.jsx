import ProductCard from './ProductCard'

/*
  ProductGrid: SOLO ordena tarjetas en una grilla responsiva de Bootstrap
  (1 columna en móvil, 2 en sm, 4 en lg). Si el arreglo viene vacío muestra un mensaje.
  Props: productos, onAgregar (se reenvía a cada ProductCard), mensajeVacio.
*/
export default function ProductGrid({ productos, onAgregar, mensajeVacio = 'No hay productos' }) {
  if (productos.length === 0) {
    return <p className="text-muted text-center py-5">{mensajeVacio}</p>
  }
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4">
      {productos.map((p) => (
        <div className="col" key={p.codigo}>
          <ProductCard producto={p} onAgregar={onAgregar} />
        </div>
      ))}
    </div>
  )
}
