/* =========================================================
   SONIDO VIVO — Validaciones de formularios
   Funciones puras de validación (reutilizables en login,
   registro y contacto) + helpers para mostrar/ocultar
   mensajes de error en la interfaz.
   ========================================================= */

const DOMINIOS_CORREO_PERMITIDOS = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];

/* ---------- Validaciones puras (reciben un valor, devuelven true/false) ---------- */

function esRequerido(valor) {
  return valor !== null && valor !== undefined && valor.trim().length > 0;
}

function cumpleLargoMaximo(valor, maximo) {
  return valor.trim().length <= maximo;
}

function cumpleLargoMinimo(valor, minimo) {
  return valor.trim().length >= minimo;
}

function tieneFormatoCorreo(valor) {
  const patron = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return patron.test(valor.trim());
}

function tieneDominioPermitido(valor) {
  const correo = valor.trim().toLowerCase();
  return DOMINIOS_CORREO_PERMITIDOS.some(function (dominio) {
    return correo.endsWith(dominio);
  });
}

function esSoloNumeros(valor) {
  return /^[0-9]+$/.test(valor.trim());
}

function esDecimalValido(valor) {
  return /^[0-9]+(\.[0-9]+)?$/.test(valor.trim());
}

function normalizarRun(valor) {
  return valor.trim().replace("-", "").toUpperCase();
}

/**
 * Valida un RUN chileno sin puntos y con guion (ej: "12345678-5").
 * Verifica largo (8 a 10 caracteres) y dígito verificador.
 */
function validarRun(valor) {
  const texto = valor.trim().toUpperCase();
  if (!/^[0-9]{6,8}-[0-9K]$/.test(texto)) return false;

  const run = normalizarRun(texto);

  if (run.length < 7 || run.length > 9) return false;

  const cuerpo = run.slice(0, -1);
  const dv = run.slice(-1);

  let suma = 0;
  let multiplicador = 2;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador;
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
  }

  const resto = 11 - (suma % 11);
  let dvEsperado;
  if (resto === 11) dvEsperado = "0";
  else if (resto === 10) dvEsperado = "K";
  else dvEsperado = String(resto);

  return dv === dvEsperado;
}

/* ---------- Helpers de interfaz ---------- */

/**
 * Marca un .form-group como inválido y muestra el mensaje de error.
 * Espera que el campo esté envuelto en: <div class="form-group"><input><span class="form-error"></span></div>
 */
function marcarInvalido(input, mensaje) {
  const grupo = input.closest(".form-group");
  if (!grupo) return;

  grupo.classList.add("invalid");
  grupo.classList.remove("valid");

  const errorEl = grupo.querySelector(".form-error");
  if (errorEl) errorEl.textContent = mensaje;
}

/**
 * Marca un .form-group como válido y limpia el mensaje de error.
 */
function marcarValido(input) {
  const grupo = input.closest(".form-group");
  if (!grupo) return;

  grupo.classList.remove("invalid");
  grupo.classList.add("valid");

  const errorEl = grupo.querySelector(".form-error");
  if (errorEl) errorEl.textContent = "";
}

/**
 * Ejecuta una lista de reglas sobre un input y actualiza la UI.
 * "reglas" es un arreglo de objetos { test: fn(valor) => bool, mensaje: string }.
 * Se detiene en la primera regla que falle (para mostrar un solo mensaje a la vez).
 * Devuelve true si el campo pasó todas las reglas.
 */
function validarCampo(input, reglas) {
  const valor = input.value;

  for (let i = 0; i < reglas.length; i++) {
    if (!reglas[i].test(valor)) {
      marcarInvalido(input, reglas[i].mensaje);
      return false;
    }
  }

  marcarValido(input);
  return true;
}
