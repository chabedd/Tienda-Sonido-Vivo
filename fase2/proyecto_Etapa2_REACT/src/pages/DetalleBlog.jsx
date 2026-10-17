import { Link, useParams } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import { obtener } from '../data/db'
import { slug } from '../utils/formato'

/* DetalleBlog: una sola página sirve a los blogs 1 y 2 (y cualquiera nuevo); el id viene de la URL. */
export default function DetalleBlog() {
  const { id } = useParams()
  const blog = obtener('blogs', id)

  if (!blog) {
    return (
      <>
        <AlertMessage tipo="warning" mensaje="No se encontró el artículo." />
        <Link to="/blogs">Volver a blogs</Link>
      </>
    )
  }

  return (
    <article className="mx-auto" style={{ maxWidth: 760 }}>
      <h1 className="h2">{blog.titulo}</h1>
      <p className="lead text-muted">{blog.resumen}</p>
      {blog.parrafos.map((p, i) => <p key={i}>{p}</p>)}
      <Link to={`/categorias/${slug(blog.categoria)}`} className="btn btn-primary me-2">
        Ver {blog.categoria.toLowerCase()}
      </Link>
      <Link to="/blogs" className="btn btn-outline-secondary">← Volver a blogs</Link>
    </article>
  )
}
