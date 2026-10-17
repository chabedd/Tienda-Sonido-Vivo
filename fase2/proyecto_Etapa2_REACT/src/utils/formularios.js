import { validarFormulario } from './validaciones'

/*
  Ayuda PURA para los formularios.
  Cada formulario guarda su propio estado con useState:
    const [valores, setValores] = useState(INICIAL)
    const [enviado, setEnviado] = useState(false)
    const { campo, hayErrores } = prepararFormulario(valores, setValores, ESQUEMA, enviado)

  - campo('correo') devuelve las props de <FormField>: id, value, onChange y error.
  - Un error se ve cuando el campo ya tiene algo escrito o cuando se intentó enviar.
  - hayErrores es true si algún campo (visible o no) no cumple sus reglas.
*/
export function prepararFormulario(valores, setValores, esquema, enviado) {
  const errores = validarFormulario(valores, esquema)

  const campo = (nombre) => ({
    id: nombre,
    value: valores[nombre] ?? '',
    onChange: (e) => setValores((v) => ({ ...v, [nombre]: e.target.value })),
    error: enviado || valores[nombre] ? errores[nombre] ?? '' : '',
  })

  return { campo, hayErrores: Object.keys(errores).length > 0 }
}
