import { Link } from 'react-router-dom'

/*
  CategoryCard: tarjeta enlazada de una categoría.
  Props: categoria ({id, nombre, descripcion, color}), cantidad (productos que tiene),
  activa (resalta la seleccionada), imagen y lema (opcionales, ver data/portada.js).
  Con imagen: foto de fondo con degradado oscuro abajo para que el texto se lea.
  Sin imagen: fondo del color de marca de la categoría.
  Debajo del nombre va el lema si lo hay; si no, la cantidad de productos.
*/
export default function CategoryCard({ categoria, cantidad = 0, activa = false, imagen, lema }) {
  return (
    <Link
      to={`/categorias/${categoria.id}`}
      className={`card sv-cat-card h-100 text-decoration-none text-white border-0 ${activa ? 'border border-3 border-warning' : ''}`}
      style={{ backgroundColor: categoria.color }}
      aria-current={activa ? 'true' : undefined}
    >
      {imagen && <img src={imagen} alt="" className="sv-cat-img" loading="lazy" />}
      <div className="card-body sv-cat-texto">
        <h2 className="h6 card-title mb-1">{categoria.nombre}</h2>
        <p className="card-text small mb-0">
          {lema ?? `${cantidad} ${cantidad === 1 ? 'producto' : 'productos'}`}
        </p>
      </div>
    </Link>
  )
}
