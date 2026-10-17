/*
  Validaciones PURAS (sin DOM ni React), portadas de JS/validaciones.js de la Etapa 1
  y de las reglas que cada formulario definía por su cuenta.
  Decisión: al ser funciones puras las usan tanto los formularios como las pruebas.
  Los helpers que manipulaban el DOM (marcarInvalido/marcarValido) ya no existen:
  ahora el componente FormField recibe el mensaje de error por props.
*/

export const DOMINIOS_CORREO_PERMITIDOS = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com']

const texto = (valor) => String(valor ?? '').trim()

/* ---------- Validaciones básicas (devuelven true/false) ---------- */

export function esRequerido(valor) {
  return texto(valor).length > 0
}

export function cumpleLargoMaximo(valor, maximo) {
  return texto(valor).length <= maximo
}

export function cumpleLargoMinimo(valor, minimo) {
  return texto(valor).length >= minimo
}

export function tieneFormatoCorreo(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(texto(valor))
}

export function tieneDominioPermitido(valor) {
  const correo = texto(valor).toLowerCase()
  return DOMINIOS_CORREO_PERMITIDOS.some((dominio) => correo.endsWith(dominio))
}

export function esSoloNumeros(valor) {
  return /^[0-9]+$/.test(texto(valor))
}

export function esDecimalValido(valor) {
  return /^[0-9]+(\.[0-9]+)?$/.test(texto(valor))
}

/**
 * true si el número está dentro de [min, max] (ambos incluidos). max es opcional.
 * Se usa para precio (>= 0) y stock (>= 0, entero).
 */
export function validarRango(valor, min, max = Infinity) {
  if (!esDecimalValido(valor)) return false
  const numero = parseFloat(texto(valor))
  return numero >= min && numero <= max
}

/**
 * Valida un RUN chileno sin puntos y con guion (ej: "12345678-5").
 * Verifica formato y dígito verificador (módulo 11).
 */
export function validarRun(valor) {
  const run = texto(valor).toUpperCase()
  if (!/^[0-9]{6,8}-[0-9K]$/.test(run)) return false

  const cuerpo = run.slice(0, -2)
  const dv = run.slice(-1)

  let suma = 0
  let multiplicador = 2
  for (let i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i], 10) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resto = 11 - (suma % 11)
  const dvEsperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return dv === dvEsperado
}

/* ---------- Motor de reglas ---------- */

/**
 * Ejecuta una lista de reglas { test, mensaje } y devuelve el mensaje de la PRIMERA
 * que falla ('' si todas pasan). `valores` (opcional) permite reglas que dependen de
 * otros campos, por ejemplo "confirmar contraseña".
 */
export function validarCampo(valor, reglas, valores = {}) {
  for (const regla of reglas) {
    if (!regla.test(valor, valores)) return regla.mensaje
  }
  return ''
}

/**
 * Valida un formulario completo: devuelve un objeto { campo: mensaje } solo con los
 * campos inválidos. Si está vacío, el formulario es válido.
 */
export function validarFormulario(valores, esquema) {
  const errores = {}
  for (const [campo, reglas] of Object.entries(esquema)) {
    const mensaje = validarCampo(valores[campo], reglas, valores)
    if (mensaje) errores[campo] = mensaje
  }
  return errores
}

/* ---------- Reglas reutilizables ---------- */

const MSJ_DOMINIOS = 'Solo se aceptan correos @duoc.cl, @profesor.duoc.cl o @gmail.com.'

const requerido = (mensaje) => ({ test: esRequerido, mensaje })
const maximo = (n) => ({ test: (v) => cumpleLargoMaximo(v, n), mensaje: `Máximo ${n} caracteres.` })
// regla "opcional": solo se evalúa si el usuario escribió algo
const siHayTexto = (test, mensaje) => ({ test: (v) => !esRequerido(v) || test(v), mensaje })

export const REGLAS_CORREO = [
  requerido('El correo es obligatorio.'),
  maximo(100),
  { test: tieneFormatoCorreo, mensaje: 'Ingresa un correo con formato válido.' },
  { test: tieneDominioPermitido, mensaje: MSJ_DOMINIOS },
]

export const REGLAS_PASSWORD = [
  requerido('La contraseña es obligatoria.'),
  {
    test: (v) => cumpleLargoMinimo(v, 4) && cumpleLargoMaximo(v, 10),
    mensaje: 'Debe tener entre 4 y 10 caracteres.',
  },
]

export const REGLAS_RUN = [
  requerido('El RUN es obligatorio.'),
  {
    test: (v) => cumpleLargoMinimo(v, 8) && cumpleLargoMaximo(v, 10),
    mensaje: 'Usa el formato sin puntos y con guion: 12345678-5.',
  },
  { test: validarRun, mensaje: 'El RUN ingresado no es válido. Usa el formato 12345678-5.' },
]

const REGLAS_NOMBRE = [requerido('El nombre es obligatorio.'), maximo(50)]
const REGLAS_APELLIDOS = [requerido('Los apellidos son obligatorios.'), maximo(100)]
const REGLAS_REGION = [requerido('Selecciona una región.')]
const REGLAS_COMUNA = [requerido('Selecciona una comuna.')]

/* ---------- Esquemas por formulario ---------- */

export const ESQUEMA_LOGIN = { correo: REGLAS_CORREO, password: REGLAS_PASSWORD }

export const ESQUEMA_REGISTRO = {
  run: REGLAS_RUN,
  nombre: REGLAS_NOMBRE,
  apellidos: REGLAS_APELLIDOS,
  correo: REGLAS_CORREO,
  region: REGLAS_REGION,
  comuna: REGLAS_COMUNA,
  direccion: [requerido('La dirección es obligatoria.'), maximo(300)],
  password: REGLAS_PASSWORD,
  confirmacion: [
    requerido('Confirma tu contraseña.'),
    { test: (v, valores) => v === valores.password, mensaje: 'Las contraseñas no coinciden.' },
  ],
}

export const ESQUEMA_CONTACTO = {
  nombre: [requerido('El nombre es obligatorio.'), maximo(100)],
  correo: [
    maximo(100),
    siHayTexto((v) => tieneFormatoCorreo(v) && tieneDominioPermitido(v), 'Usa un correo válido: @duoc.cl, @profesor.duoc.cl o @gmail.com.'),
  ],
  comentario: [requerido('Cuéntanos en qué te podemos ayudar.'), maximo(500)],
}

export const ESQUEMA_PRODUCTO = {
  codigo: [
    requerido('El código es obligatorio.'),
    { test: (v) => cumpleLargoMinimo(v, 3), mensaje: 'Mínimo 3 caracteres.' },
  ],
  nombre: [requerido('El nombre es obligatorio.'), maximo(100)],
  descripcion: [maximo(500)],
  precio: [
    requerido('El precio es obligatorio.'),
    { test: esDecimalValido, mensaje: 'Ingresa un número válido (puede tener decimales).' },
    { test: (v) => validarRango(v, 0), mensaje: 'El precio no puede ser negativo.' },
  ],
  stock: [
    requerido('El stock es obligatorio.'),
    { test: esSoloNumeros, mensaje: 'Solo se permiten números enteros.' },
    { test: (v) => validarRango(v, 0), mensaje: 'El stock no puede ser negativo.' },
  ],
  stockCritico: [siHayTexto(esSoloNumeros, 'Solo se permiten números enteros.')],
  categoria: [requerido('Selecciona una categoría.')],
  // Solo obligatorio si el producto está en oferta, y no puede superar el precio normal
  precioOferta: [
    {
      test: (v, valores) => !valores.oferta || (esDecimalValido(v) && parseFloat(v) <= parseFloat(valores.precio || 0)),
      mensaje: 'Ingresa un precio de oferta válido (no mayor al precio normal).',
    },
  ],
}

export const ESQUEMA_CATEGORIA = {
  nombre: [requerido('El nombre es obligatorio.'), maximo(50)],
  descripcion: [maximo(200)],
}

export const ESQUEMA_USUARIO_ADMIN = {
  run: REGLAS_RUN,
  nombre: REGLAS_NOMBRE,
  apellidos: REGLAS_APELLIDOS,
  correo: REGLAS_CORREO,
  tipoUsuario: [requerido('Selecciona el tipo de usuario.')],
  region: REGLAS_REGION,
  comuna: REGLAS_COMUNA,
  direccion: [requerido('La dirección es obligatoria.'), maximo(300)],
  // En edición la contraseña es opcional; si se escribe, debe cumplir el largo
  password: [siHayTexto((v) => cumpleLargoMinimo(v, 4) && cumpleLargoMaximo(v, 10), 'Debe tener entre 4 y 10 caracteres.')],
}

export const ESQUEMA_CHECKOUT = {
  nombre: REGLAS_NOMBRE,
  apellidos: REGLAS_APELLIDOS,
  correo: REGLAS_CORREO,
  calle: [requerido('La calle es obligatoria.'), maximo(150)],
  departamento: [maximo(20)], // opcional
  region: REGLAS_REGION,
  comuna: REGLAS_COMUNA,
  indicaciones: [maximo(300)], // opcional
}
