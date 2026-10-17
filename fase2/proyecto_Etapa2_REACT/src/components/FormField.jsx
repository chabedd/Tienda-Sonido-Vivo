/*
  FormField: un campo de formulario con etiqueta y mensaje de error.
  Es "controlado": el valor vive en el padre (value + onChange por props), este
  componente no guarda estado. El error solo se dibuja cuando llega por props
  (renderizado condicional); Bootstrap lo estiliza con `is-invalid` + `invalid-feedback`.
  as: 'input' (por defecto) | 'textarea' | 'select' (con `opciones`: arreglo de textos).
*/
export default function FormField({
  id,
  label,
  value,
  onChange,
  error = '',
  as = 'input',
  type = 'text',
  opciones = [],
  placeholderOpcion = '-- Seleccione --',
  ...resto
}) {
  const claseControl = `${as === 'select' ? 'form-select' : 'form-control'}${error ? ' is-invalid' : ''}`
  const comunes = {
    id,
    name: id,
    value,
    onChange,
    className: claseControl,
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': error ? `${id}-error` : undefined,
    ...resto,
  }

  let control
  if (as === 'select') {
    control = (
      <select {...comunes}>
        <option value="">{placeholderOpcion}</option>
        {opciones.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    )
  } else if (as === 'textarea') {
    control = <textarea rows={4} {...comunes} />
  } else {
    control = <input type={type} {...comunes} />
  }

  return (
    <div className="mb-3">
      <label htmlFor={id} className="form-label">{label}</label>
      {control}
      {error && (
        <div id={`${id}-error`} className="invalid-feedback d-block" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}
