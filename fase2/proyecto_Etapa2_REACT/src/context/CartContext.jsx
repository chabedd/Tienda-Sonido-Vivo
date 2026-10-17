import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { precioVigente } from '../utils/productos'
import { buscarCupon, calcularDescuento } from '../utils/cupones'

/*
  Carrito global (Context). Decisión: el carrito lo necesitan el Navbar (contador),
  ProductCard (añadir), Carrito y Checkout, que están en ramas distintas del árbol;
  Context evita pasar props por muchos niveles. La lógica vive en un reducer puro
  (carritoReducer) para poder probarla sin React.
*/
export const CLAVE_CARRITO = 'sonidoVivoCarrito'
export const CLAVE_CUPON = 'sonidoVivoCupon'

export function carritoReducer(items, accion) {
  switch (accion.tipo) {
    case 'agregar': {
      const { producto, cantidad } = accion
      const existente = items.find((i) => i.codigo === producto.codigo)
      if (existente) {
        return items.map((i) =>
          i.codigo === producto.codigo ? { ...i, cantidad: i.cantidad + cantidad } : i,
        )
      }
      return [
        ...items,
        {
          codigo: producto.codigo,
          nombre: producto.nombre,
          precio: precioVigente(producto), // si está en oferta se cobra el precio de oferta
          imagen: producto.imagen,
          cantidad,
        },
      ]
    }
    case 'cambiarCantidad':
      // cantidad <= 0 elimina el ítem (igual que en la Etapa 1)
      if (accion.cantidad <= 0) return items.filter((i) => i.codigo !== accion.codigo)
      return items.map((i) => (i.codigo === accion.codigo ? { ...i, cantidad: accion.cantidad } : i))
    case 'quitar':
      return items.filter((i) => i.codigo !== accion.codigo)
    case 'vaciar':
      return []
    default:
      return items
  }
}

export function calcularTotal(items) {
  return items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)
}

function leerCarrito() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE_CARRITO))
    return Array.isArray(datos) ? datos : []
  } catch {
    return []
  }
}

function leerCupon() {
  try {
    return buscarCupon(localStorage.getItem(CLAVE_CUPON))
  } catch {
    return null
  }
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(carritoReducer, undefined, leerCarrito)

  // useEffect: sincroniza el carrito con localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items))
  }, [items])

  const [cupon, setCupon] = useState(leerCupon)
  useEffect(() => {
    if (cupon) localStorage.setItem(CLAVE_CUPON, cupon)
    else localStorage.removeItem(CLAVE_CUPON)
  }, [cupon])

  const valor = useMemo(() => {
    const subtotal = calcularTotal(items)
    const descuento = calcularDescuento(subtotal, cupon)
    return {
      items,
      subtotal,
      cupon,
      descuento,
      total: subtotal - descuento, // lo que realmente se paga
      cantidadTotal: items.reduce((acc, i) => acc + i.cantidad, 0),
      agregar: (producto, cantidad = 1) => dispatch({ tipo: 'agregar', producto, cantidad }),
      cambiarCantidad: (codigo, cantidad) => dispatch({ tipo: 'cambiarCantidad', codigo, cantidad }),
      quitar: (codigo) => dispatch({ tipo: 'quitar', codigo }),
      // devuelve true si el cupón es válido (y lo aplica), false si no
      aplicarCupon: (texto) => {
        const codigo = buscarCupon(texto)
        if (codigo) setCupon(codigo)
        return Boolean(codigo)
      },
      quitarCupon: () => setCupon(null),
      vaciar: () => {
        dispatch({ tipo: 'vaciar' })
        setCupon(null)
      },
    }
  }, [items, cupon])

  return <CartContext.Provider value={valor}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
