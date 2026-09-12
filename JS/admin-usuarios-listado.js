
document.addEventListener("DOMContentLoaded", function () {
  const cuerpoTabla = document.querySelector("#tabla-usuarios-body");
  renderizarTabla();

  cuerpoTabla.addEventListener("click", function (evento) {
    const boton = evento.target.closest("button.btn-eliminar");
    if (!boton) return;

    const run = boton.dataset.run;
    const confirmar = confirm("¿Eliminar al usuario con RUN " + run + "? Esta acción no se puede deshacer.");
    if (confirmar) {
      eliminarUsuarioAdmin(run);
      renderizarTabla();
    }
  });

  function renderizarTabla() {
    const usuarios = obtenerUsuariosAdmin();

    if (usuarios.length === 0) {
      cuerpoTabla.innerHTML = '<tr><td colspan="6">No hay usuarios registrados.</td></tr>';
      return;
    }

    cuerpoTabla.innerHTML = usuarios.map(function (usuario) {
      return `
        <tr>
          <td>${usuario.run}</td>
          <td>${usuario.nombre} ${usuario.apellidos}</td>
          <td>${usuario.correo}</td>
          <td><span class="badge ${claseBadgeTipoUsuario(usuario.tipoUsuario)}">${usuario.tipoUsuario}</span></td>
          <td>${usuario.comuna || "—"}</td>
          <td class="acciones-tabla">
            <a href="usuario-editar.html?run=${usuario.run}">Editar</a>
            <button type="button" class="btn-eliminar" data-run="${usuario.run}">Eliminar</button>
          </td>
        </tr>
      `;
    }).join("");
  }
});

function claseBadgeTipoUsuario(tipo) {
  if (tipo === "Administrador") return "badge-admin";
  if (tipo === "Vendedor") return "badge-vendedor";
  return "badge-cliente";
}
