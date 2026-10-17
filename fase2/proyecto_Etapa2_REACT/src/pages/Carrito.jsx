import { useState } from 'react'
import { Link } from 'react-router-dom'
import CartTable from '../components/CartTable'
import { useCart } from '../context/CartContext'

/*
  Carrito: conecta CartTable (presentacional) con el CartContext.
  Cantidades, eliminar y limpiar se resuelven en el contexto; esta página solo
  pasa las funciones por props.
*/
export default function Carrito() {
  const { items, total, subtotal, descuento, cupon, cambiarCantidad, quitar, vaciar, aplicarCupon, quitarCupon } = useCart()
  const [texto, setTexto] = useState('')
  const [mensaje, setMensaje] = useState(null)

  const aplicar = (e) => {
    e.preventDefault()
    const valido = aplicarCupon(texto)
    setMensaje(valido
      ? { tipo: 'success', texto: 'Cupón aplicado correctamente.' }
      : { tipo: 'danger', texto: 'El cupón ingresado no es válido.' })
    if (valido) setTexto('')
  }
  const quitarElCupon = () => {
    quitarCupon()
    setMensaje(null)
  }
  return (
    <>
      <h1 className="h3 mb-4">Carrito de compras</h1>
      <CartTable items={items} total={total} subtotal={subtotal} descuento={descuento} cupon={cupon} onCambiarCantidad={cambiarCantidad} onQuitar={quitar} />
      {items.length > 0 && (
        <form className="mb-4" onSubmit={aplicar} noValidate>
          <label htmlFor="cupon-input" className="form-label">¿Tienes un cupón?</label>
          <div className="input-group" style={{ maxWidth: 420 }}>
            <input id="cupon-input" className="form-control" value={texto} placeholder="Ej: SONIDOVIVO10"
              onChange={(e) => setTexto(e.target.value)} />
            <button type="submit" className="btn btn-outline-primary">Aplicar cupón</button>
            {cupon && <button type="button" className="btn btn-outline-secondary" onClick={quitarElCupon}>Quitar</button>}
          </div>
          {mensaje && <div role="status" className={`small mt-2 text-${mensaje.tipo}`}>{mensaje.texto}</div>}
        </form>
      )}
      {items.length > 0 ? (
        <div className="d-flex flex-wrap gap-2 justify-content-between">
          <button type="button" className="btn btn-outline-danger" onClick={vaciar}>Limpiar carrito</button>
          <div className="d-flex gap-2">
            <Link to="/productos" className="btn btn-outline-primary">Seguir comprando</Link>
            <Link to="/checkout" className="btn btn-primary">Ir a pagar</Link>
          </div>
        </div>
      ) : (
        <div className="text-center"><Link to="/productos" className="btn btn-primary">Ver productos</Link></div>
      )}
    </>
  )
}
