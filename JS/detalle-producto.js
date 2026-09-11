/* 
  Lee el parámetro "codigo" de la URL (?codigo=GA001),
  busca el producto en el catálogo y renderiza su información.
  Permite elegir cantidad y añadirlo al carrito.
    */

document.addEventListener("DOMContentLoaded", function () {
  const parametros = new URLSearchParams(window.location.search);
  const codigo = parametros.get("codigo");
  const producto = codigo ? buscarProductoPorCodigo(codigo) : null;

  const contenedor = document.querySelector("#detalle-contenido");

  if (!producto) {
    contenedor.innerHTML = `
      <p>No encontramos ese producto. <a href="productos.html">Volver al catálogo</a>.</p>
    `;
    return;
  }

  document.title = producto.nombre + " | Sonido Vivo";

  const iniciales = obtenerIniciales(producto.nombre);
  const stockBajo = producto.stock <= STOCK_CRITICO_DEFAULT;

  contenedor.innerHTML = `
    <nav class="breadcrumb" aria-label="Ruta de navegación">
      <a href="index.html">Home</a> &gt;
      <a href="productos.html">${producto.categoria}</a> &gt;
      ${producto.nombre}
    </nav>

    <div class="detalle-producto">
      <div class="detalle-imagen${producto.imagen ? " con-imagen" : ""}" style="background:${colorPorCategoria(producto.categoria)}">
        ${producto.imagen
          ? `<img src="${producto.imagen}" alt="${producto.nombre}" onerror="this.remove()">`
          : iniciales}
      </div>

      <div class="detalle-info">
        <span class="marca-modelo">${producto.marca} · ${producto.modelo}</span>
        <h1>${producto.nombre}</h1>
        <p>${producto.descripcion}</p>
        <p class="precio-grande">${formatearCLP(producto.precio)}</p>

        ${stockBajo
          ? `<p class="stock-critico">¡Últimas ${producto.stock} unidades disponibles!</p>`
          : `<p style="font-size:0.85rem;color:var(--text);">Stock disponible: ${producto.stock}</p>`
        }

        <label for="cantidad" style="font-size:0.85rem;font-weight:600;">Cantidad</label>
        <div class="selector-cantidad">
          <button type="button" id="restar-cantidad" aria-label="Disminuir cantidad">−</button>
          <input type="number" id="cantidad" value="1" min="1" max="${producto.stock}" aria-label="Cantidad a comprar">
          <button type="button" id="sumar-cantidad" aria-label="Aumentar cantidad">+</button>
        </div>

        <button type="button" class="btn-primary" id="btn-agregar-carrito">Añadir al carrito</button>
        <p class="mensaje-confirmacion" id="mensaje-confirmacion">Producto añadido al carrito ✓</p>
      </div>
    </div>
  `;

  configurarInteraccion(producto);
});

function configurarInteraccion(producto) {
  const inputCantidad = document.querySelector("#cantidad");
  const botonRestar = document.querySelector("#restar-cantidad");
  const botonSumar = document.querySelector("#sumar-cantidad");
  const botonAgregar = document.querySelector("#btn-agregar-carrito");
  const mensaje = document.querySelector("#mensaje-confirmacion");

  botonRestar.addEventListener("click", function () {
    const valorActual = parseInt(inputCantidad.value, 10) || 1;
    inputCantidad.value = Math.max(1, valorActual - 1);
  });

  botonSumar.addEventListener("click", function () {
    const valorActual = parseInt(inputCantidad.value, 10) || 1;
    inputCantidad.value = Math.min(producto.stock, valorActual + 1);
  });

  botonAgregar.addEventListener("click", function () {
    const cantidad = parseInt(inputCantidad.value, 10) || 1;
    agregarAlCarrito(producto.codigo, cantidad);

    mensaje.classList.add("visible");
    setTimeout(function () { mensaje.classList.remove("visible"); }, 2000);
  });
}
