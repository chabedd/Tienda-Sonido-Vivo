import { Link } from 'react-router-dom'

/* NotFound: se muestra cuando la URL no coincide con ninguna ruta. */
export default function NotFound() {
  return (
    <div className="text-center py-5">
      <h1 className="display-4 sv-display">404</h1>
      <p>La página que buscas no existe.</p>
      <Link to="/" className="btn btn-primary">Volver al inicio</Link>
    </div>
  )
}
