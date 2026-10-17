/* 
  listado completo del catálogo y permite
  filtrar por categoría.*/

document.addEventListener("DOMContentLoaded", function () {
  const contenedor = document.querySelector("#lista-productos");
  const filtrosContenedor = document.querySelector("#filtros-categoria");
  if (!contenedor) return;

  const categorias = ["Todas"].concat(
    Array.from(new Set(PRODUCTOS.map(function (p) { return p.categoria; })))
  );

  // Genera los botones de filtro
  filtrosContenedor.innerHTML = categorias.map(function (categoria, index) {
    return `<button type="button" data-categoria="${categoria}" class="${index === 0 ? "activo" : ""}">${categoria}</button>`;
  }).join("");

  renderizarProductos(PRODUCTOS);

  filtrosContenedor.querySelectorAll("button").forEach(function (boton) {
    boton.addEventListener("click", function () {
      filtrosContenedor.querySelectorAll("button").forEach(function (b) { b.classList.remove("activo"); });
      boton.classList.add("activo");

      const categoriaSeleccionada = boton.dataset.categoria;
      const filtrados = categoriaSeleccionada === "Todas"
        ? PRODUCTOS
        : PRODUCTOS.filter(function (p) { return p.categoria === categoriaSeleccionada; });

      renderizarProductos(filtrados);
    });
  });

  // Eventos para los botones "Añadir".
  contenedor.addEventListener("click", function (evento) {
    const boton = evento.target.closest(".btn-anadir");
    if (!boton) return;

    evento.preventDefault();
    agregarAlCarrito(boton.dataset.codigo, 1);

    const textoOriginal = boton.textContent;
    boton.textContent = "Añadido ✓";
    setTimeout(function () { boton.textContent = textoOriginal; }, 1200);
  });
});

function renderizarProductos(lista) {
  const contenedor = document.querySelector("#lista-productos");

  if (lista.length === 0) {
    contenedor.innerHTML = "<p>No hay productos en esta categoría.</p>";
    return;
  }

  contenedor.innerHTML = lista.map(function (producto) {
    const stockBajo = producto.stock <= STOCK_CRITICO_DEFAULT;

    return `
      <article class="product-card">
        <a href="detalle-producto.html?codigo=${producto.codigo}">
          <div class="product-img-placeholder${producto.imagen ? " con-imagen" : ""}" style="background:${colorPorCategoria(producto.categoria)}">
            ${producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.remove()">` : ""}
          </div>
          <div class="product-info">
            <span class="product-category">${producto.categoria}</span>
            <span class="product-name">${producto.nombre}</span>
            <span class="product-price">${formatearCLP(producto.precio)}</span>
            ${stockBajo ? '<span class="stock-critico">¡Últimas unidades!</span>' : ""}
          </div>
        </a>
        <div class="product-info" style="padding-top:0;">
          <button type="button" class="btn-primary btn-anadir" data-codigo="${producto.codigo}">Añadir</button>
        </div>
      </article>
    `;
  }).join("");
}

