/*
  AlertMessage: muestra un aviso solo si hay mensaje (renderizado condicional).
  Props: tipo ('success' | 'danger' | 'warning' | 'info' -> color de Bootstrap) y mensaje.
*/
export default function AlertMessage({ tipo = 'info', mensaje }) {
  if (!mensaje) return null
  return (
    <div className={`alert alert-${tipo}`} role="alert">
      {mensaje}
    </div>
  )
}
