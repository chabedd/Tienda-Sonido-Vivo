/* =========================================================
   SONIDO VIVO — Navegación
   Controla el menú hamburguesa en vista móvil (< 768px).
   Se incluye en todas las páginas del sitio, después de
   carrito.js (para poder llamar a actualizarContadorCarrito).
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector(".nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      const abierto = menu.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", abierto ? "true" : "false");
    });

    // Cierra el menú al navegar (útil en móvil)
    menu.querySelectorAll("a").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        menu.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (typeof actualizarContadorCarrito === "function") {
    actualizarContadorCarrito();
  }
});
