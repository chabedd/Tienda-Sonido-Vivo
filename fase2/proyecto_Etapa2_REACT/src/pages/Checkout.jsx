import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import FormField from '../components/FormField'
import OrderSummary from '../components/OrderSummary'
import RegionComunaFields from '../components/RegionComunaFields'
import { actualizar, crear, obtener } from '../data/db'
import { useCart } from '../context/CartContext'
import { useSession } from '../context/SessionContext'
import { prepararFormulario } from '../utils/formularios'
import { ESQUEMA_CHECKOUT } from '../utils/validaciones'

/*
  Checkout: datos del cliente + dirección de entrega.
  - Si hay sesión, el formulario se AUTOCOMPLETA: los valores iniciales se calculan una
    sola vez con los datos del usuario (useState(valoresIniciales(usuario))).
  - El pago es SIMULADO: la casilla "Simular error de pago" decide el resultado, para
    poder demostrar PagoCorrecto y PagoError sin pasarela real.
  Estado local: `valores`, `enviado`, `simularError` y `errorGeneral`.
*/
function valoresIniciales(usuario) {
  return {
    nombre: usuario?.nombre ?? '',
    apellidos: usuario?.apellidos ?? '',
    correo: usuario?.correo ?? '',
    calle: usuario?.direccion ?? '',
    departamento: '',
    region: usuario?.region ?? '',
    comuna: usuario?.comuna ?? '',
    indicaciones: '',
  }
}

export default function Checkout() {
  const { items, total, descuento, cupon, vaciar } = useCart()
  const { usuario } = useSession()
  const navegar = useNavigate()
  const [valores, setValores] = useState(() => valoresIniciales(usuario))
  const [enviado, setEnviado] = useState(false)
  const { campo, hayErrores } = prepararFormulario(valores, setValores, ESQUEMA_CHECKOUT, enviado)
  const [simularError, setSimularError] = useState(false)
  const [errorGeneral, setErrorGeneral] = useState('')

  if (items.length === 0) {
    return (
      <>
        <AlertMessage tipo="info" mensaje="Tu carrito está vacío, no hay nada que pagar." />
        <Link to="/productos" className="btn btn-primary">Ver productos</Link>
      </>
    )
  }

  const pagar = (e) => {
    e.preventDefault()
    setErrorGeneral('')
    setEnviado(true)
    if (hayErrores) return

    if (simularError) {
      navegar('/pago-error')
      return
    }

    const sinStock = items.find((i) => (obtener('productos', i.codigo)?.stock ?? 0) < i.cantidad)
    if (sinStock) {
      setErrorGeneral(`No hay stock suficiente de "${sinStock.nombre}".`)
      return
    }

    const orden = crear('ordenes', {
      fecha: new Date().toISOString(),
      estado: 'Pagada',
      cliente: {
        run: usuario?.run ?? null,
        nombre: valores.nombre.trim(),
        apellidos: valores.apellidos.trim(),
        correo: valores.correo.trim(),
      },
      direccion: {
        calle: valores.calle.trim(),
        departamento: valores.departamento.trim(),
        region: valores.region,
        comuna: valores.comuna,
        indicaciones: valores.indicaciones.trim(),
      },
      items,
      cupon,
      descuento,
      total,
    })
    // descontar el stock vendido (así el panel de productos críticos refleja las ventas)
    items.forEach((i) => actualizar('productos', i.codigo, { stock: obtener('productos', i.codigo).stock - i.cantidad }))
    vaciar()
    navegar(`/pago-correcto?orden=${orden.id}`)
  }

  return (
    <>
      <h1 className="h3 mb-4">Checkout</h1>
      <form onSubmit={pagar} noValidate>
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <h2 className="h5">Datos del cliente</h2>
            <div className="row">
              <div className="col-md-6"><FormField {...campo('nombre')} label="Nombre" /></div>
              <div className="col-md-6"><FormField {...campo('apellidos')} label="Apellidos" /></div>
              <div className="col-12"><FormField {...campo('correo')} label="Correo" type="email" /></div>
            </div>
            <h2 className="h5 mt-3">Dirección de entrega</h2>
            <div className="row">
              <div className="col-md-8"><FormField {...campo('calle')} label="Calle y número" /></div>
              <div className="col-md-4"><FormField {...campo('departamento')} label="Departamento (opcional)" /></div>
              <RegionComunaFields
                campo={campo}
                region={valores.region}
                onCambiarRegion={(region) => setValores({ ...valores, region, comuna: '' })}
              />
              <div className="col-12"><FormField {...campo('indicaciones')} label="Indicaciones para la entrega (opcional)" as="textarea" /></div>
            </div>
          </div>
          <div className="col-12 col-lg-4">
            <OrderSummary items={items} total={total} descuento={descuento} cupon={cupon} />
            <div className="form-check my-3">
              <input id="simular-error" type="checkbox" className="form-check-input" checked={simularError} onChange={(e) => setSimularError(e.target.checked)} />
              <label htmlFor="simular-error" className="form-check-label small">Simular error de pago (solo demostración)</label>
            </div>
            <AlertMessage tipo="danger" mensaje={errorGeneral} />
            <button type="submit" className="btn btn-primary w-100">Pagar ahora</button>
          </div>
        </div>
      </form>
    </>
  )
}
