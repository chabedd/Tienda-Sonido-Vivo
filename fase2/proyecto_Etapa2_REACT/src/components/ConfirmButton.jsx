import { useState } from 'react'

/*
  ConfirmButton: botón de acción destructiva con confirmación en dos pasos.
  Estado local `pidiendoConfirmacion`: el primer clic solo pregunta; recién el segundo
  ("Sí") ejecuta onConfirm. Evita borrar por un clic accidental sin usar window.confirm.
*/
export default function ConfirmButton({ label = 'Eliminar', mensaje = '¿Seguro?', onConfirm, variant = 'outline-danger' }) {
  const [pidiendoConfirmacion, setPidiendoConfirmacion] = useState(false)

  if (!pidiendoConfirmacion) {
    return (
      <button type="button" className={`btn btn-sm btn-${variant}`} onClick={() => setPidiendoConfirmacion(true)}>
        {label}
      </button>
    )
  }
  return (
    <span className="d-inline-flex align-items-center gap-1">
      <small>{mensaje}</small>
      <button
        type="button"
        className="btn btn-sm btn-danger"
        onClick={() => {
          setPidiendoConfirmacion(false)
          onConfirm()
        }}
      >
        Sí
      </button>
      <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => setPidiendoConfirmacion(false)}>
        No
      </button>
    </span>
  )
}
