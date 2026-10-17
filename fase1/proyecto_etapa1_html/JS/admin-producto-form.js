/* 
  Reglas de validación:
  - Código: requerido, texto, mínimo 3 caracteres, sin límite máximo.
  - Nombre: requerido, máximo 100 caracteres.
  - Descripción: opcional, máximo 500 caracteres.
  - Precio: requerido, mínimo 0 (permite productos FREE), decimales permitidos.
  - Stock: requerido, mínimo 0, solo números enteros.
  - Stock crítico: opcional, mínimo 0, solo números enteros.
  - Categoría: requerido.
 */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form-producto");
  if (!form) return;

  const parametros = new URLSearchParams(window.location.search);
  const codigoEdicion = parametros.get("codigo");
  const modoEdicion = Boolean(codigoEdicion);

  const inputCodigo = document.querySelector("#prod-codigo");
  const inputNombre = document.querySelector("#prod-nombre");
  const inputDescripcion = document.querySelector("#prod-descripcion");
  const inputPrecio = document.querySelector("#prod-precio");
  const inputStock = document.querySelector("#prod-stock");
  const inputStockCritico = document.querySelector("#prod-stock-critico");
  const selectCategoria = document.querySelector("#prod-categoria");
  const inputImagen = document.querySelector("#prod-imagen");
  const mensajeExito = document.querySelector("#producto-exito");
  const tituloForm = document.querySelector("#titulo-form-producto");

  poblarSelectCategorias(selectCategoria);

  if (modoEdicion) {
    tituloForm.textContent = "Editar producto";
    const producto = obtenerProductoAdminPorCodigo(codigoEdicion);

    if (!producto) {
      form.innerHTML = "<p>No se encontró el producto solicitado. <a href=\"productos-listado.html\">Volver al listado</a>.</p>";
      return;
    }

    inputCodigo.value = producto.codigo;
    inputCodigo.readOnly = true; // el código identifica al producto, no se edita
    inputNombre.value = producto.nombre;
    inputDescripcion.value = producto.descripcion || "";
    inputPrecio.value = producto.precio;
    inputStock.value = producto.stock;
    inputStockCritico.value = producto.stockCritico !== undefined ? producto.stockCritico : "";
    selectCategoria.value = producto.categoria;
  }

  const reglasCodigo = [
    { test: esRequerido, mensaje: "El código es obligatorio." },
    { test: function (v) { return cumpleLargoMinimo(v, 3); }, mensaje: "Mínimo 3 caracteres." }
  ];

  const reglasNombre = [
    { test: esRequerido, mensaje: "El nombre es obligatorio." },
    { test: function (v) { return cumpleLargoMaximo(v, 100); }, mensaje: "Máximo 100 caracteres." }
  ];

  const reglasDescripcion = [
    { test: function (v) { return cumpleLargoMaximo(v, 500); }, mensaje: "Máximo 500 caracteres." }
  ];

  const reglasPrecio = [
    { test: esRequerido, mensaje: "El precio es obligatorio." },
    { test: esDecimalValido, mensaje: "Ingresa un número válido (puede tener decimales)." },
    { test: function (v) { return parseFloat(v) >= 0; }, mensaje: "El precio no puede ser negativo." }
  ];

  const reglasStock = [
    { test: esRequerido, mensaje: "El stock es obligatorio." },
    { test: esSoloNumeros, mensaje: "Solo se permiten números enteros." },
    { test: function (v) { return parseInt(v, 10) >= 0; }, mensaje: "El stock no puede ser negativo." }
  ];

  const reglasStockCritico = [
    { test: function (v) { return !esRequerido(v) || esSoloNumeros(v); }, mensaje: "Solo se permiten números enteros." },
    { test: function (v) { return !esRequerido(v) || parseInt(v, 10) >= 0; }, mensaje: "No puede ser negativo." }
  ];

  const reglasCategoria = [
    { test: esRequerido, mensaje: "Selecciona una categoría." }
  ];

  inputCodigo.addEventListener("input", function () { validarCampo(inputCodigo, reglasCodigo); });
  inputNombre.addEventListener("input", function () { validarCampo(inputNombre, reglasNombre); });
  inputDescripcion.addEventListener("input", function () { validarCampo(inputDescripcion, reglasDescripcion); });
  inputPrecio.addEventListener("input", function () { validarCampo(inputPrecio, reglasPrecio); });
  inputStock.addEventListener("input", function () { validarCampo(inputStock, reglasStock); });
  inputStockCritico.addEventListener("input", function () { validarCampo(inputStockCritico, reglasStockCritico); });
  selectCategoria.addEventListener("change", function () { validarCampo(selectCategoria, reglasCategoria); });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const resultados = [
      validarCampo(inputCodigo, reglasCodigo),
      validarCampo(inputNombre, reglasNombre),
      validarCampo(inputDescripcion, reglasDescripcion),
      validarCampo(inputPrecio, reglasPrecio),
      validarCampo(inputStock, reglasStock),
      validarCampo(inputStockCritico, reglasStockCritico),
      validarCampo(selectCategoria, reglasCategoria)
    ];

    // Si es un producto nuevo, el código no debe repetir uno existente
    if (!modoEdicion && obtenerProductoAdminPorCodigo(inputCodigo.value.trim())) {
      marcarInvalido(inputCodigo, "Ya existe un producto con ese código.");
      resultados.push(false);
    }

    const formularioValido = resultados.every(function (esValido) { return esValido; });
    if (!formularioValido) {
      mensajeExito.classList.remove("visible");
      return;
    }

    const producto = {
      codigo: inputCodigo.value.trim(),
      nombre: inputNombre.value.trim(),
      categoria: selectCategoria.value,
      marca: modoEdicion ? (obtenerProductoAdminPorCodigo(codigoEdicion).marca || "") : "",
      modelo: modoEdicion ? (obtenerProductoAdminPorCodigo(codigoEdicion).modelo || "") : "",
      descripcion: inputDescripcion.value.trim(),
      precio: parseFloat(inputPrecio.value),
      stock: parseInt(inputStock.value, 10),
      stockCritico: esRequerido(inputStockCritico.value) ? parseInt(inputStockCritico.value, 10) : undefined,
      imagen: inputImagen.files.length > 0 ? inputImagen.files[0].name : (modoEdicion ? obtenerProductoAdminPorCodigo(codigoEdicion).imagen : undefined)
    };

    guardarProductoAdmin(producto);

    mensajeExito.classList.add("visible");
    mensajeExito.textContent = modoEdicion ? "Producto actualizado correctamente." : "Producto creado correctamente.";

    setTimeout(function () {
      window.location.href = "productos-listado.html";
    }, 900);
  });
});

function poblarSelectCategorias(select) {
  const opciones = ['<option value="">-- Seleccione la categoría --</option>'];
  CATEGORIAS_PRODUCTO.forEach(function (categoria) {
    opciones.push(`<option value="${categoria}">${categoria}</option>`);
  });
  select.innerHTML = opciones.join("");
}
