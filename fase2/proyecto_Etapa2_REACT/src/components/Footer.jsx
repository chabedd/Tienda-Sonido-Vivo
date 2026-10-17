/* Footer: componente estático sin props ni estado (solo presentación). */
export default function Footer() {
  return (
    <footer className="sv-footer py-4 mt-5">
      <div className="container text-center small">
        <p className="mb-1 sv-display fs-5 text-light">Sonido Vivo</p>
        <p className="mb-0">&copy; {new Date().getFullYear()} Sonido Vivo. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
