/* Nosotros: contenido estático migrado de nosotros.html. Bootstrap: grilla de tarjetas. */
const PERSONAL = [
  ['Dueño de la tienda', 'Compras a proveedores, control de inventario y revisión de ventas.'],
  ['Vendedor', 'Atención en tienda y seguimiento de pedidos de clientes remotos.'],
  ['Vendedor', 'Atención en tienda y respuesta de consultas por catálogo.'],
]

function TarjetasPersonas({ personas }) {
  return (
    <div className="row row-cols-1 row-cols-md-3 g-3 mb-5">
      {personas.map(([titulo, texto], i) => (
        <div className="col" key={i}>
          <div className="card h-100"><div className="card-body">
            <h3 className="h6">{titulo}</h3>
            <p className="mb-0 small">{texto}</p>
          </div></div>
        </div>
      ))}
    </div>
  )
}

export default function Nosotros() {
  return (
    <>
      <h1 className="h2 mb-3">Once años acompañando a los músicos de la región</h1>
      <p>
        Sonido Vivo nació en Viña del Mar como una tienda de barrio para guitarristas, bajistas, bateristas y
        tecladistas. Hoy seguimos siendo atendidos por el mismo equipo que partió hace 11 años, solo que ahora
        también llegamos a clientes de otras ciudades que antes solo podían escribirnos por WhatsApp o Instagram.
      </p>
      <p className="mb-5">
        Este sitio es el primer paso para que cualquier persona, viva donde viva, pueda ver nuestro catálogo
        actualizado, hacer un pedido formal y hacerle seguimiento sin depender de mensajes que a veces se demoran
        horas en responderse.
      </p>
      <h2 className="h4 mb-3">Quiénes te atienden</h2>
      <TarjetasPersonas personas={PERSONAL} />
      <p className="text-muted small mb-0">Equipo de Desarrollo Front</p>
    </>
  )
}
