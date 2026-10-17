/* Cupones de descuento (reglas puras; la tienda y las pruebas las reutilizan). */

export const CUPONES = {
  SONIDOVIVO10: 0.1,
  BIENVENIDO5: 0.05,
}

/** Devuelve el código normalizado si el cupón es válido; si no, null. */
export function buscarCupon(texto) {
  const codigo = String(texto ?? '').trim().toUpperCase()
  return Object.prototype.hasOwnProperty.call(CUPONES, codigo) ? codigo : null
}

/** Monto (CLP, entero) que descuenta el cupón sobre un subtotal. Sin cupón válido, 0. */
export function calcularDescuento(subtotal, codigo) {
  const porcentaje = CUPONES[codigo]
  return porcentaje ? Math.round(subtotal * porcentaje) : 0
}
