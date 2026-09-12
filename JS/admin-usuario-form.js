
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#form-usuario");
  if (!form) return;

  const parametros = new URLSearchParams(window.location.search);
  const runEdicion = parametros.get("run");
  const modoEdicion = Boolean(runEdicion);

  const inputRun = document.querySelector("#usr-run");
  const inputNombre = document.querySelector("#usr-nombre");
  const inputApellidos = document.querySelector("#usr-apellidos");
  const inputCorreo = document.querySelector("#usr-correo");
  const inputNacimiento = document.querySelector("#usr-nacimiento");
  const selectTipo = document.querySelector("#usr-tipo");
  const selectRegion = document.querySelector("#usr-region");
  const selectComuna = document.querySelector("#usr-comuna");
  const inputDireccion = document.querySelector("#usr-direccion");
  const mensajeExito = document.querySelector("#usuario-exito");
  const tituloForm = document.querySelector("#titulo-form-usuario");

  poblarSelectRegiones(selectRegion);

  selectRegion.addEventListener("change", function () {
    poblarSelectComunas(selectComuna, selectRegion.value);
    validarCampo(selectComuna, reglasComuna);
  });

  if (modoEdicion) {
    tituloForm.textContent = "Editar usuario";
    const usuario = obtenerUsuarioAdminPorRun(runEdicion);

    if (!usuario) {
      form.innerHTML = "<p>No se encontró el usuario solicitado. <a href=\"usuarios-listado.html\">Volver al listado</a>.</p>";
      return;
    }

    inputRun.value = usuario.run;
    inputRun.readOnly = true; // el RUN identifica al usuario, no se edita
    inputNombre.value = usuario.nombre;
    inputApellidos.value = usuario.apellidos;
    inputCorreo.value = usuario.correo;
    inputNacimiento.value = usuario.fechaNacimiento || "";
    selectTipo.value = usuario.tipoUsuario;
    selectRegion.value = usuario.region || "";
    poblarSelectComunas(selectComuna, usuario.region || "");
    selectComuna.value = usuario.comuna || "";
    inputDireccion.value = usuario.direccion || "";
  }

  const reglasRun = [
    { test: esRequerido, mensaje: "El RUN es obligatorio." },
    { test: function (v) { return cumpleLargoMinimo(v, 7) && cumpleLargoMaximo(v, 9); }, mensaje: "Debe tener entre 7 y 9 caracteres." },
    { test: validarRun, mensaje: "El RUN ingresado no es válido. Sin puntos ni guion." }
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

  const reglasTipo = [
    { test: esRequerido, mensaje: "Selecciona un tipo de usuario." }
  ];

  const reglasComuna = [
    { test: esRequerido, mensaje: "Selecciona una comuna." }
  ];

  const reglasDireccion = [
    { test: esRequerido, mensaje: "La dirección es obligatoria." },
    { test: function (v) { return cumpleLargoMaximo(v, 300); }, mensaje: "Máximo 300 caracteres." }
  ];

  inputRun.addEventListener("input", function () { validarCampo(inputRun, reglasRun); });
  inputNombre.addEventListener("input", function () { validarCampo(inputNombre, reglasNombre); });
  inputApellidos.addEventListener("input", function () { validarCampo(inputApellidos, reglasApellidos); });
  inputCorreo.addEventListener("input", function () { validarCampo(inputCorreo, reglasCorreo); });
  selectTipo.addEventListener("change", function () { validarCampo(selectTipo, reglasTipo); });
  inputDireccion.addEventListener("input", function () { validarCampo(inputDireccion, reglasDireccion); });

  form.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const resultados = [
      validarCampo(inputRun, reglasRun),
      validarCampo(inputNombre, reglasNombre),
      validarCampo(inputApellidos, reglasApellidos),
      validarCampo(inputCorreo, reglasCorreo),
      validarCampo(selectTipo, reglasTipo),
      validarCampo(selectComuna, reglasComuna),
      validarCampo(inputDireccion, reglasDireccion)
    ];

    if (!modoEdicion && obtenerUsuarioAdminPorRun(inputRun.value.trim())) {
      marcarInvalido(inputRun, "Ya existe un usuario con ese RUN.");
      resultados.push(false);
    }

    const formularioValido = resultados.every(function (esValido) { return esValido; });
    if (!formularioValido) {
      mensajeExito.classList.remove("visible");
      return;
    }

    const usuario = {
      run: inputRun.value.trim().toUpperCase(),
      nombre: inputNombre.value.trim(),
      apellidos: inputApellidos.value.trim(),
      correo: inputCorreo.value.trim(),
      fechaNacimiento: inputNacimiento.value || undefined,
      tipoUsuario: selectTipo.value,
      region: selectRegion.value,
      comuna: selectComuna.value,
      direccion: inputDireccion.value.trim()
    };

    guardarUsuarioAdmin(usuario);

    mensajeExito.classList.add("visible");
    mensajeExito.textContent = modoEdicion ? "Usuario actualizado correctamente." : "Usuario creado correctamente.";

    setTimeout(function () {
      window.location.href = "usuarios-listado.html";
    }, 900);
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
