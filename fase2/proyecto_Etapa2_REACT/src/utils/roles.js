/* Quién puede entrar al panel de administración (regla única para Navbar, Login y AdminLayout). */

export const ROLES_PANEL = ['Administrador', 'Vendedor']

export function tieneAccesoAlPanel(usuario) {
  return ROLES_PANEL.includes(usuario?.tipoUsuario)
}
