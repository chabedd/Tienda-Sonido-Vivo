/* =========================================================
   SONIDO VIVO — Validación del formulario de Registro
   El anexo indica que el registro de usuario usa las mismas
   reglas que "crear usuario" en el administrador:
   - RUN: requerido, sin puntos ni guion, 7 a 9 caracteres, válido.
   - Nombre: requerido, máx 50 caracteres.
   - Apellidos: requerido, máx 100 caracteres.
   - Correo: requerido, máx 100 caracteres, dominios permitidos.
   - Fecha nacimiento: opcional.
   - Región / Comuna: selects dependientes.
   - Dirección: requerida, máx 300 caracteres.
   Se agregan además Contraseña / Confirmar contraseña
   (no exigidas explícitamente por la pauta, pero necesarias
   para un registro real; se valida con el mismo criterio que
   el login: 4 a 10 caracteres).
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form-registro");
  if (!form) return;

  const inputRun = document.querySelector("#reg-run");
  const inputNombre = document.querySelector("#reg-nombre");
  const inputApellidos = document.querySelector("#reg-apellidos");
  const inputCorreo = document.querySelector("#reg-correo");
  const selectRegion = document.querySelector("#reg-region");
  const selectComuna = document.querySelector("#reg-comuna");
  const inputDireccion = document.querySelector("#reg-direccion");
  const inputPassword = document.querySelector("#reg-password");
  const inputPasswordConfirm = document.querySelector("#reg-password-confirm");
  const mensajeExito = document.querySelector("#registro-exito");

  poblarSelectRegiones(selectRegion);

  selectRegion.addEventListener("change", function () {
    poblarSelectComunas(selectComuna, selectRegion.value);
    validarCampo(selectComuna, reglasComuna);
  });

  const reglasRun = [
    { test: esRequerido, mensaje: "El RUN es obligatorio." },
    { test: function (v) { return cumpleLargoMinimo(v.trim(), 8) && cumpleLargoMaximo(v.trim(), 10); }, mensaje: "Usa el formato sin puntos y con guion: 12345678-5." },
    { test: validarRun, mensaje: "El RUN ingresado no es válido. Usa el formato 12345678-5." }
  ];

  const reglasNombre = [
    { test: esRequerido, mensaje: "El nombre es obligatorio." },
    { test: function (v) { return cumpleLargoMaximo(v, 50); }, mensaje: "Máximo 50 caracteres." }
  ];

  const reglasApellidos = [
    { test: esRequerido, mensaje: "Los apellidos son obligatorios." },
    { test: function (v) { return cumpleLargoMaximo(v, 100); }, mensaje: "Máximo 100 caracteres." }
  ];

  const reglasCorreo = [
    { test: esRequerido, mensaje: "El correo es obligatorio." },
    { test: function (v) { return cumpleLargoMaximo(v, 100); }, mensaje: "Máximo 100 caracteres." },
    { test: tieneFormatoCorreo, mensaje: "Ingresa un correo con formato válido." },
    { test: tieneDominioPermitido, mensaje: "Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com." }
  ];

  const reglasComuna = [
    { test: esRequerido, mensaje: "Selecciona una comuna." }
  ];

  const reglasDireccion = [
    { test: esRequerido, mensaje: "La dirección es obligatoria." },
    { test: function (v) { return cumpleLargoMaximo(v, 300); }, mensaje: "Máximo 300 caracteres." }
  ];

  const reglasPassword = [
    { test: esRequerido, mensaje: "La contraseña es obligatoria." },
    { test: function (v) { return cumpleLargoMinimo(v, 4) && cumpleLargoMaximo(v, 10); }, mensaje: "Debe tener entre 4 y 10 caracteres." }
  ];

  const reglasPasswordConfirm = [
    { test: esRequerido, mensaje: "Confirma tu contraseña." },
    { test: function (v) { return v === inputPassword.value; }, mensaje: "Las contraseñas no coinciden." }
  ];

  inputRun.addEventListener("input", function () { validarCampo(inputRun, reglasRun); });
  inputNombre.addEventListener("input", function () { validarCampo(inputNombre, reglasNombre); });
  inputApellidos.addEventListener("input", function () { validarCampo(inputApellidos, reglasApellidos); });
  inputCorreo.addEventListener("input", function () { validarCampo(inputCorreo, reglasCorreo); });
  inputDireccion.addEventListener("input", function () { validarCampo(inputDireccion, reglasDireccion); });
  inputPassword.addEventListener("input", function () { validarCampo(inputPassword, reglasPassword); });
  inputPasswordConfirm.addEventListener("input", function () { validarCampo(inputPasswordConfirm, reglasPasswordConfirm); });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const resultados = [
      validarCampo(inputRun, reglasRun),
      validarCampo(inputNombre, reglasNombre),
      validarCampo(inputApellidos, reglasApellidos),
      validarCampo(inputCorreo, reglasCorreo),
      validarCampo(selectComuna, reglasComuna),
      validarCampo(inputDireccion, reglasDireccion),
      validarCampo(inputPassword, reglasPassword),
      validarCampo(inputPasswordConfirm, reglasPasswordConfirm)
    ];

    const formularioValido = resultados.every(function (esValido) { return esValido; });

    if (formularioValido) {
      mensajeExito.classList.add("visible");
      form.reset();
      poblarSelectComunas(selectComuna, "");
      document.querySelectorAll(".form-group").forEach(function (grupo) {
        grupo.classList.remove("valid");
      });
    } else {
      mensajeExito.classList.remove("visible");
    }
  });
});

function poblarSelectRegiones(select) {
  const opciones = ['<option value="">-- Seleccione la región --</option>'];
  obtenerListaRegiones().forEach(function (region) {
    opciones.push(`<option value="${region}">${region}</option>`);
  });
  select.innerHTML = opciones.join("");
}

function poblarSelectComunas(select, region) {
  const comunas = obtenerComunasPorRegion(region);
  const opciones = ['<option value="">-- Seleccione la comuna --</option>'];
  comunas.forEach(function (comuna) {
    opciones.push(`<option value="${comuna}">${comuna}</option>`);
  });
  select.innerHTML = opciones.join("");
}
