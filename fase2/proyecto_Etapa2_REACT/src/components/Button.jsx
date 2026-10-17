/*
  Button genérico. Props: label (texto), onClick (callback del padre), variant (color
  de Bootstrap: primary, outline-primary, danger...), type, disabled.
  No tiene estado: solo avisa al padre que lo hicieron clic (patrón "componente tonto").
*/
export default function Button({ label, onClick, variant = 'primary', type = 'button', disabled = false, className = '' }) {
  return (
    <button type={type} className={`btn btn-${variant} ${className}`.trim()} onClick={onClick} disabled={disabled}>
      {label}
    </button>
  )
}
