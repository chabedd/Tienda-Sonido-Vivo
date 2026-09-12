
const ADMIN_USUARIOS_KEY = "sonidoVivoAdminUsuarios";

// Usuarios de ejemplo, solo para que el listado no se vea vacío
// la primera vez que se abre el panel de administración.
const USUARIOS_SEMILLA = [
  { run: "111111111", nombre: "María", apellidos: "Pérez Soto", correo: "maria.perez@gmail.com", fechaNacimiento: "1985-04-12", tipoUsuario: "Administrador", region: "Región de Valparaíso", comuna: "Viña del Mar", direccion: "Av. Libertad 1234" },
  { run: "222222222", nombre: "Carlos", apellidos: "Muñoz Rojas", correo: "carlos.munoz@duoc.cl", fechaNacimiento: "1990-09-01", tipoUsuario: "Vendedor", region: "Región de Valparaíso", comuna: "Valparaíso", direccion: "Calle Condell 456" }
];

function obtenerUsuariosAdmin() {
  let datos;
  try {
    datos = JSON.parse(localStorage.getItem(ADMIN_USUARIOS_KEY));
  } catch (error) {
    datos = null;
  }

  if (!datos) {
    datos = JSON.parse(JSON.stringify(USUARIOS_SEMILLA));
    guardarUsuariosAdmin(datos);
  }

  return datos;
}

function guardarUsuariosAdmin(lista) {
  localStorage.setItem(ADMIN_USUARIOS_KEY, JSON.stringify(lista));
}

function obtenerUsuarioAdminPorRun(run) {
  return obtenerUsuariosAdmin().find(function (u) { return u.run === run; });
}

/**
 * Crea o actualiza un usuario (según si ya existe un RUN igual).
 */
function guardarUsuarioAdmin(usuario) {
  const lista = obtenerUsuariosAdmin();
  const indice = lista.findIndex(function (u) { return u.run === usuario.run; });

  if (indice >= 0) {
    lista[indice] = usuario;
  } else {
    lista.push(usuario);
  }

  guardarUsuariosAdmin(lista);
}

function eliminarUsuarioAdmin(run) {
  const lista = obtenerUsuariosAdmin().filter(function (u) { return u.run !== run; });
  guardarUsuariosAdmin(lista);
}
