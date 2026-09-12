/* =========================================================
   SONIDO VIVO — Validación del formulario de Login
   Reglas (definidas en el anexo de instrucciones):
   - Correo: requerido, máx 100 caracteres, dominios permitidos.
   - Contraseña: requerida, entre 4 y 10 caracteres.
   No implementa autenticación real (esta entrega es solo frontend).
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form-login");
  if (!form) return;

  const inputCorreo = document.querySelector("#login-correo");
  const inputPassword = document.querySelector("#login-password");
  const mensajeExito = document.querySelector("#login-exito");

  const reglasCorreo = [
    { test: esRequerido, mensaje: "El correo es obligatorio." },
    { test: function (v) { return cumpleLargoMaximo(v, 100); }, mensaje: "Máximo 100 caracteres." },
    { test: tieneFormatoCorreo, mensaje: "Ingresa un correo con formato válido." },
    { test: tieneDominioPermitido, mensaje: "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com." }
  ];

  const reglasPassword = [
    { test: esRequerido, mensaje: "La contraseña es obligatoria." },
    { test: function (v) { return cumpleLargoMinimo(v, 4) && cumpleLargoMaximo(v, 10); }, mensaje: "Debe tener entre 4 y 10 caracteres." }
  ];

  // Validación en tiempo real
  inputCorreo.addEventListener("input", function () { validarCampo(inputCorreo, reglasCorreo); });
  inputPassword.addEventListener("input", function () { validarCampo(inputPassword, reglasPassword); });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const correoValido = validarCampo(inputCorreo, reglasCorreo);
    const passwordValido = validarCampo(inputPassword, reglasPassword);

    if (correoValido && passwordValido) {
      mensajeExito.classList.add("visible");
      form.reset();
      document.querySelectorAll(".form-group").forEach(function (grupo) {
        grupo.classList.remove("valid");
      });
    } else {
      mensajeExito.classList.remove("visible");
    }
  });
});
