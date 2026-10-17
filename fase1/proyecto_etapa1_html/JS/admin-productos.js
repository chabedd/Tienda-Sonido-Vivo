/* 
  El mantenedor trabaja sobre su propia copia en localStorage
  (independiente del catálogo público en productos-data.js),
  ya que en esta entrega no existe backend todavía. Se siembra
  con el catálogo real la primera vez que se visita el admin.
*/

const ADMIN_PRODUCTOS_KEY = "sonidoVivoAdminProductos";

const CATEGORIAS_PRODUCTO = [
  "Guitarras Acústicas", "Guitarras Eléctricas", "Bajos Eléctricos", "Baterías",
  "Teclados y Pianos", "Amplificadores", "Micrófonos", "Pedales de Efectos",
  "Accesorios", "Estudio y Grabación"
];

function obtenerProductosAdmin() {
  let datos;
  try {
    datos = JSON.parse(localStorage.getItem(ADMIN_PRODUCTOS_KEY));
  } catch (error) {
    datos = null;
  }

  if (!datos) {
    datos = JSON.parse(JSON.stringify(PRODUCTOS)); // copia del catálogo base
    guardarProductosAdmin(datos);
  } else {
    datos.forEach(function (producto) {
      const productoBase = buscarProductoPorCodigo(producto.codigo);
      const imagenObsoleta = producto.imagen && (
        producto.imagen.indexOf("pinterest.com/pin/") >= 0 ||
        /\.(jpg|jpeg|png|webp)\/$/i.test(producto.imagen)
      );
      if (productoBase && productoBase.imagen && (!producto.imagen || imagenObsoleta)) {
        producto.imagen = productoBase.imagen;
      }
    });
    guardarProductosAdmin(datos);
  }

  return datos;
}

function guardarProductosAdmin(lista) {
  localStorage.setItem(ADMIN_PRODUCTOS_KEY, JSON.stringify(lista));
}

function obtenerProductoAdminPorCodigo(codigo) {
  return obtenerProductosAdmin().find(function (p) { return p.codigo === codigo; });
}

/**
 * Crea o actualiza un producto (según si ya existe un código igual).
 */
function guardarProductoAdmin(producto) {
  const lista = obtenerProductosAdmin();
  const indice = lista.findIndex(function (p) { return p.codigo === producto.codigo; });

  if (indice >= 0) {
    lista[indice] = producto;
  } else {
    lista.push(producto);
  }

  guardarProductosAdmin(lista);
}

function eliminarProductoAdmin(codigo) {
  const lista = obtenerProductosAdmin().filter(function (p) { return p.codigo !== codigo; });
  guardarProductosAdmin(lista);
}
