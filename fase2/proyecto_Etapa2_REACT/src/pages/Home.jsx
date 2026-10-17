import { Link } from 'react-router-dom'
import CategoryCard from '../components/CategoryCard'
import ProductGrid from '../components/ProductGrid'
import { listar } from '../data/db'
import { IMAGEN_HERO, PORTADA_CATEGORIAS } from '../data/portada'
import { useCart } from '../context/CartContext'

/*
  Home: portada. Estado: ninguno propio; lee productos y categorías de db.js al dibujarse
  (siempre datos frescos) y usa el carrito del contexto.
  Bootstrap: hero con foto de fondo (`.sv-hero` en theme.css), grilla row-cols-* para
  las categorías (2 columnas en móvil, 3 en tablet, 5 en escritorio).
*/
export default function Home() {
  const productos = listar('productos')
  const categorias = listar('categorias')
  const { agregar } = useCart()

  const destacados = productos.filter((p) => p.oferta).slice(0, 4)

  return (
    <>
      <section className="sv-hero rounded-4 text-light mb-5" style={{ backgroundImage: `url(${IMAGEN_HERO})` }}>
        <div className="sv-hero-contenido">
          <p className="sv-eyebrow mb-3">Donde la pasión se convierte en sonido</p>
          <h1 className="sv-hero-titulo mb-3">
            Hecho por músicos.<br />Hecho para sonar.
          </h1>
          <p className="sv-hero-texto mb-4">
            Instrumentos musicales, audio profesional y accesorios para acompañarte en cada nota.
          </p>
          <Link to="/productos" className="btn btn-primary btn-lg rounded-pill px-4 fw-semibold">
            Explorar productos
          </Link>
        </div>
        <p className="sv-hero-volumen d-none d-md-flex mb-0" aria-hidden="true">Sube el volumen</p>
      </section>

      <section className="mb-5">
        <div className="row align-items-end g-3 mb-4">
          <div className="col-md-7">
            <p className="sv-eyebrow sv-eyebrow-oscuro mb-1">Encuentra tu sonido</p>
            <h2 className="h3 mb-0">Explora las categorías</h2>
          </div>
          <div className="col-md-5">
            <p className="text-muted mb-0">Desde tu primer acorde hasta el escenario: encuentra lo que necesitas para crear.</p>
          </div>
        </div>
        <div className="row row-cols-2 row-cols-md-3 row-cols-lg-5 g-3">
          {categorias.map((c) => (
            <div className="col" key={c.id}>
              <CategoryCard
                categoria={c}
                cantidad={productos.filter((p) => p.categoria === c.nombre).length}
                imagen={PORTADA_CATEGORIAS[c.id]?.imagen}
                lema={PORTADA_CATEGORIAS[c.id]?.lema}
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="h4 mb-0">Ofertas destacadas</h2>
          <Link to="/ofertas">Ver todas las ofertas →</Link>
        </div>
        <ProductGrid productos={destacados} onAgregar={agregar} mensajeVacio="No hay productos en oferta" />
      </section>
    </>
  )
}
