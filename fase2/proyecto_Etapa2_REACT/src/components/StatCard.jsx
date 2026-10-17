import { Link } from 'react-router-dom'

/*
  StatCard: tarjeta de métrica del dashboard (Bootstrap `card`).
  Props: titulo, valor (lo que se destaca), detalle (texto pequeño) y enlace opcional.
*/
export default function StatCard({ titulo, valor, detalle, enlace, textoEnlace = 'Ver detalle' }) {
  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <p className="text-muted small text-uppercase mb-1">{titulo}</p>
        <p className="display-6 sv-display mb-1" data-testid={`stat-${titulo}`}>{valor}</p>
        {detalle && <p className="small text-muted mb-2">{detalle}</p>}
        {enlace && <Link to={enlace} className="small">{textoEnlace} →</Link>}
      </div>
    </div>
  )
}
