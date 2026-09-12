/* =========================================================
   SONIDO VIVO — Validación del formulario de Contacto
   Reglas (definidas en el anexo de instrucciones):
   - Nombre: requerido, máx 100 caracteres.
   - Correo: máx 100 caracteres, dominios permitidos (no
     marcado como requerido en el anexo, pero se valida el
     formato si el usuario escribe algo).
   - Comentario: requerido, máx 500 caracteres.
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form-contacto");
  if (!form) return;

  const inputNombre = document.querySelector("#contacto-nombre");
  const inputCorreo = document.querySelector("#contacto-correo");
  const inputComentario = document.querySelector("#contacto-comentario");
  const contadorComentario = document.querySelector("#contador-comentario");
  const mensajeExito = document.querySelector("#contacto-exito");

  const reglasNombre = [
    { test: esRequerido, mensaje: "El nombre es obligatorio." },
    { test: function (v) { return cumpleLargoMaximo(v, 100); }, mensaje: "Máximo 100 caracteres." }
  ];

  const reglasCorreo = [
    { test: function (v) { return cumpleLargoMaximo(v, 100); }, mensaje: "Máximo 100 caracteres." },
    { test: function (v) { return !esRequerido(v) || (tieneFormatoCorreo(v) && tieneDominioPermitido(v)); }, mensaje: "Usa un correo válido: @duoc.cl, @profesor.duoc.cl o @gmail.com." }
  ];

  const reglasComentario = [
    { test: esRequerido, mensaje: "Cuéntanos en qué te podemos ayudar." },
    { test: function (v) { return cumpleLargoMaximo(v, 500); }, mensaje: "Máximo 500 caracteres." }
  ];

  inputNombre.addEventListener("input", function () { validarCampo(inputNombre, reglasNombre); });
  inputCorreo.addEventListener("input", function () { validarCampo(inputCorreo, reglasCorreo); });

  inputComentario.addEventListener("input", function () {
    validarCampo(inputComentario, reglasComentario);
    contadorComentario.textContent = inputComentario.value.length + " / 500";
  });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const resultados = [
      validarCampo(inputNombre, reglasNombre),
      validarCampo(inputCorreo, reglasCorreo),
      validarCampo(inputComentario, reglasComentario)
    ];

    const formularioValido = resultados.every(function (esValido) { return esValido; });

    if (formularioValido) {
      mensajeExito.classList.add("visible");
      form.reset();
      contadorComentario.textContent = "0 / 500";
      document.querySelectorAll(".form-group").forEach(function (grupo) {
        grupo.classList.remove("valid");
      });
    } else {
      mensajeExito.classList.remove("visible");
    }
  });
});
