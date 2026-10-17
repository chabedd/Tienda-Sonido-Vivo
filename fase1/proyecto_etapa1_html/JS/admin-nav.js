/* 
  Colapso del menú lateral en vista móvil.
   */

document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.querySelector(".admin-topbar .nav-toggle");
  const sidebar = document.querySelector(".admin-sidebar");

  if (!toggle || !sidebar) return;

  toggle.addEventListener("click", function () {
    sidebar.classList.toggle("is-open");
  });
});
