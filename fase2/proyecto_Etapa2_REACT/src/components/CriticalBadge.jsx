import { esStockCritico } from '../utils/productos'

/*
  CriticalBadge: etiqueta "Stock crítico" que solo aparece si el producto está en
  stock crítico (stock <= stockCritico). La regla vive en utils/productos.js.
*/
export default function CriticalBadge({ producto }) {
  if (!esStockCritico(producto)) return null
  return <span className="badge text-bg-danger">Stock crítico</span>
}
