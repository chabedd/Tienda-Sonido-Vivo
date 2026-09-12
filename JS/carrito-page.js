/* =========================================================
   SONIDO VIVO — Página del Carrito
   Renderiza los ítems guardados en localStorage, permite
   cambiar cantidades, quitar productos, aplicar un cupón
   simple y muestra el total a pagar.
   ========================================================= */

const CUPONES_VALIDOS = {
  "SONIDOVIVO10": 0.10,
  "BIENVENIDO5": 0.05
};

document.addEventListener("DOMContentLoaded", function () {
  const contenedorItems = document.querySelector("#carrito-items");
  const contenedorVacio = document.querySelector("#carrito-vacio");
  const resumen = document.querySelector("#resumen-carrito");
  if (!contenedorItems) return;

  let descuentoAplicado = 0;

  renderizarCarrito();

  document.querySelector("#form-cupon").addEventListener("submit", function (evento) {
    evento.preventDefault();
    const input = document.querySelector("#cupon-input");
    const mensaje = document.querySelector("#cupon-mensaje");
    const codigo = input.value.trim().toUpperCase();

    if (CUPONES_VALIDOS[codigo] !== undefined) {
      descuentoAplicado = CUPONES_VALIDOS[codigo];
      mensaje.textContent = "Cupón aplicado: " + (descuentoAplicado * 100) + "% de descuento.";
      mensaje.className = "cupon-mensaje exito";
    } else {
      descuentoAplicado = 0;
      mensaje.textContent = "Cupón no válido.";
      mensaje.className = "cupon-mensaje error";
    }

    actualizarResumen();
  });

  function renderizarCarrito() {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
      contenedorItems.innerHTML = "";
      contenedorVacio.style.display = "block";
      resumen.style.display = "none";
      return;
    }

    contenedorVacio.style.display = "none";
    resumen.style.display = "block";

    contenedorItems.innerHTML = carrito.map(function (item) {
      const producto = buscarProductoPorCodigo(item.codigo);
      const iniciales = obtenerIniciales(item.nombre);
      const colorFondo = producto ? colorPorCategoria(producto.categoria) : "#2A241C";
      const stockMaximo = producto ? producto.stock : 99;

      return `
        <article class="carrito-item" data-codigo="${item.codigo}">
          <div class="item-imagen" style="background:${colorFondo}">${iniciales}</div>

          <div class="item-info">
            <span class="item-nombre">${item.nombre}</span>
            <span class="item-precio-unitario">${formatearCLP(item.precio)} c/u</span>
            <div class="selector-cantidad" style="margin-top:0.4rem;">
              <button type="button" class="btn-restar" aria-label="Disminuir cantidad">−</button>
              <input type="number" class="input-cantidad" value="${item.cantidad}" min="1" max="${stockMaximo}" aria-label="Cantidad">
              <button type="button" class="btn-sumar" aria-label="Aumentar cantidad">+</button>
            </div>
          </div>

          <div class="item-acciones">
            <span class="item-subtotal">${formatearCLP(item.precio * item.cantidad)}</span>
            <button type="button" class="btn-quitar">Quitar</button>
          </div>
        </article>
      `;
    }).join("");

    actualizarResumen();
  }

  contenedorItems.addEventListener("click", function (evento) {
    const fila = evento.target.closest(".carrito-item");
    if (!fila) return;

    const codigo = fila.dataset.codigo;
    const input = fila.querySelector(".input-cantidad");

    if (evento.target.classList.contains("btn-sumar")) {
      const nuevaCantidad = parseInt(input.value, 10) + 1;
      actualizarCantidadItem(codigo, nuevaCantidad);
      renderizarCarrito();
    }

    if (evento.target.classList.contains("btn-restar")) {
      const nuevaCantidad = parseInt(input.value, 10) - 1;
      actualizarCantidadItem(codigo, nuevaCantidad);
      renderizarCarrito();
    }

    if (evento.target.classList.contains("btn-quitar")) {
      removerDelCarrito(codigo);
      renderizarCarrito();
    }
  });

  contenedorItems.addEventListener("change", function (evento) {
    if (!evento.target.classList.contains("input-cantidad")) return;

    const fila = evento.target.closest(".carrito-item");
    const codigo = fila.dataset.codigo;
    const nuevaCantidad = Math.max(1, parseInt(evento.target.value, 10) || 1);

    actualizarCantidadItem(codigo, nuevaCantidad);
    renderizarCarrito();
  });

  function actualizarResumen() {
    const carrito = obtenerCarrito();
    const subtotal = calcularSubtotalCarrito(carrito);
    const descuento = subtotal * descuentoAplicado;
    const total = subtotal - descuento;

    document.querySelector("#resumen-subtotal").textContent = formatearCLP(subtotal);
    document.querySelector("#resumen-descuento").textContent = "− " + formatearCLP(descuento);
    document.querySelector("#resumen-total").textContent = formatearCLP(total);
  }
});
