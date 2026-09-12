/* =========================================================
   SONIDO VIVO — Carrito de compras (almacenamiento)
   Funciones base para leer/escribir el carrito en localStorage.
   Se usa desde: productos.js, detalle-producto.js, carrito.html
   y nav.js (para el contador del navbar).
   ========================================================= */

const CARRITO_STORAGE_KEY = "sonidoVivoCarrito";

/**
 * Devuelve el carrito guardado en localStorage.
 * Estructura de cada ítem: { codigo, nombre, precio, cantidad }
 */
function obtenerCarrito() {
  try {
    return JSON.parse(localStorage.getItem(CARRITO_STORAGE_KEY)) || [];
  } catch (error) {
    return [];
  }
}

/**
 * Guarda el carrito completo en localStorage.
 */
function guardarCarrito(carrito) {
  localStorage.setItem(CARRITO_STORAGE_KEY, JSON.stringify(carrito));
  actualizarContadorCarrito();
}

/**
 * Agrega un producto al carrito. Si ya existe, suma la cantidad.
 */
function agregarAlCarrito(codigoProducto, cantidad) {
  const producto = buscarProductoPorCodigo(codigoProducto);
  if (!producto) return;

  const carrito = obtenerCarrito();
  const existente = carrito.find(function (item) { return item.codigo === codigoProducto; });

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      codigo: producto.codigo,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad
    });
  }

  guardarCarrito(carrito);
}

/**
 * Actualiza la cantidad de un ítem del carrito. Si la cantidad
 * llega a 0 o menos, elimina el ítem.
 */
function actualizarCantidadItem(codigoProducto, nuevaCantidad) {
  let carrito = obtenerCarrito();

  if (nuevaCantidad <= 0) {
    carrito = carrito.filter(function (item) { return item.codigo !== codigoProducto; });
  } else {
    const item = carrito.find(function (i) { return i.codigo === codigoProducto; });
    if (item) item.cantidad = nuevaCantidad;
  }

  guardarCarrito(carrito);
}

/**
 * Elimina un producto del carrito por completo.
 */
function removerDelCarrito(codigoProducto) {
  const carrito = obtenerCarrito().filter(function (item) { return item.codigo !== codigoProducto; });
  guardarCarrito(carrito);
}

/**
 * Calcula el subtotal (suma de precio * cantidad) del carrito.
 */
function calcularSubtotalCarrito(carrito) {
  return carrito.reduce(function (acumulado, item) {
    return acumulado + (item.precio * item.cantidad);
  }, 0);
}

/**
 * Actualiza el número que se muestra junto al ícono del carrito
 * en el navbar, en todas las páginas donde exista ese elemento.
 */
function actualizarContadorCarrito() {
  const contadorEl = document.querySelector(".cart-count");
  if (!contadorEl) return;

  const totalItems = obtenerCarrito().reduce(function (acumulado, item) {
    return acumulado + (item.cantidad || 0);
  }, 0);

  contadorEl.textContent = totalItems;
}
