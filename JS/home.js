/* 
  Renderiza una selección de productos destacados en la
  página principal a partir del catálogo (productos-data.js).
   */

document.addEventListener("DOMContentLoaded", function () {
  const contenedor = document.querySelector("#productos-destacados");
  if (!contenedor) return;

  // Tomamos 8 productos variados del catálogo como "destacados"
  const destacados = PRODUCTOS.slice(0, 8);

  contenedor.innerHTML = destacados.map(renderTarjetaProducto).join("");
});

/**
 * Genera el HTML de una tarjeta de producto.
 * Se usa un bloque de color con iniciales como reemplazo de
 * fotografía (aún no se cuenta con imágenes reales del catálogo).
 */
function renderTarjetaProducto(producto) {
  const iniciales = obtenerIniciales(producto.nombre);
  const stockBajo = producto.stock <= STOCK_CRITICO_DEFAULT;

  return `
    <article class="product-card">
      <a href="detalle-producto.html?codigo=${producto.codigo}">
        <div class="product-img-placeholder${producto.imagen ? " con-imagen" : ""}" style="background:${colorPorCategoria(producto.categoria)}">
          ${producto.imagen
            ? `<img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.remove()">`
            : iniciales}
        </div>
        <div class="product-info">
          <span class="product-category">${producto.categoria}</span>
          <span class="product-name">${producto.nombre}</span>
          <span class="product-price">${formatearCLP(producto.precio)}</span>
          ${stockBajo ? '<span class="stock-critico">¡Últimas unidades!</span>' : ""}
        </div>
      </a>
    </article>
  `;
}

