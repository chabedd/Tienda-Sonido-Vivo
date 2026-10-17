import ProductosTabla from '../../components/ProductosTabla'
import { listar } from '../../data/db'
import { esStockCritico } from '../../utils/productos'

/* ProductosCriticos: solo los productos con stock <= stock crítico (regla en utils/productos.js). */
export default function ProductosCriticos() {
  const criticos = listar('productos').filter(esStockCritico)
  return (
    <>
      <h1 className="h3 mb-3">Productos críticos</h1>
      <p className="text-muted">Productos cuyo stock es menor o igual a su stock crítico.</p>
      <ProductosTabla productos={criticos} />
    </>
  )
}
