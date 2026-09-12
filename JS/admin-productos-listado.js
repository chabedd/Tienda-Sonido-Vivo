
document.addEventListener("DOMContentLoaded", function () {
  const cuerpoTabla = document.querySelector("#tabla-productos-body");
  renderizarTabla();

  cuerpoTabla.addEventListener("click", function (evento) {
    const boton = evento.target.closest("button.btn-eliminar");
    if (!boton) return;

    const codigo = boton.dataset.codigo;
    const confirmar = confirm("¿Eliminar el producto " + codigo + "? Esta acción no se puede deshacer.");
    if (confirmar) {
      eliminarProductoAdmin(codigo);
      renderizarTabla();
    }
  });

  function renderizarTabla() {
    const productos = obtenerProductosAdmin();

    if (productos.length === 0) {
      cuerpoTabla.innerHTML = '<tr><td colspan="7">No hay productos registrados.</td></tr>';
      return;
    }

    cuerpoTabla.innerHTML = productos.map(function (producto) {
      const stockCritico = producto.stockCritico !== undefined ? producto.stockCritico : STOCK_CRITICO_DEFAULT;
      const enStockCritico = producto.stock <= stockCritico;

      return `
        <tr>
          <td>${producto.codigo}</td>
          <td class="admin-producto-miniatura">
            ${producto.imagen
              ? `<img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.remove()">`
              : "Sin imagen"}
          </td>
          <td>${producto.nombre}</td>
          <td>${producto.categoria}</td>
          <td>${formatearCLP(producto.precio)}</td>
          <td>${producto.stock} ${enStockCritico ? '<span class="stock-critico">¡Crítico!</span>' : ""}</td>
          <td class="acciones-tabla">
            <a href="producto-editar.html?codigo=${producto.codigo}">Editar</a>
            <button type="button" class="btn-eliminar" data-codigo="${producto.codigo}">Eliminar</button>
          </td>
        </tr>
      `;
    }).join("");
  }
});
