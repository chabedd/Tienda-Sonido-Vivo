import { useState } from 'react'
import AlertMessage from '../components/AlertMessage'
import FormField from '../components/FormField'
import { prepararFormulario } from '../utils/formularios'
import { ESQUEMA_CONTACTO } from '../utils/validaciones'

const INICIAL = { nombre: '', correo: '', comentario: '' }

/* Contacto: formulario con validación en vivo y contador de caracteres. No hay servidor: el envío se simula. */
export default function Contacto() {
  const [valores, setValores] = useState(INICIAL)
  const [enviado, setEnviado] = useState(false)
  const [mensajeOk, setMensajeOk] = useState(false)
  const { campo, hayErrores } = prepararFormulario(valores, setValores, ESQUEMA_CONTACTO, enviado)

  const enviar = (e) => {
    e.preventDefault()
    setEnviado(true)
    setMensajeOk(false)
    if (hayErrores) return
    setValores(INICIAL)
    setEnviado(false)
    setMensajeOk(true)
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <h1 className="h3">Escríbenos</h1>
        <p className="text-muted">¿Tienes una consulta sobre algún producto? Cuéntanos y te respondemos a la brevedad.</p>
        <form onSubmit={enviar} noValidate>
          <FormField {...campo('nombre')} label="Nombre completo" />
          <FormField {...campo('correo')} label="Correo (opcional)" type="email" />
          <FormField {...campo('comentario')} label="Comentario" as="textarea" />
          <p className="small text-muted text-end" data-testid="contador-comentario">{valores.comentario.length} / 500</p>
          <AlertMessage tipo="success" mensaje={mensajeOk ? 'Mensaje enviado. En una versión posterior este formulario se conectará con el servidor de la tienda.' : ''} />
          <button type="submit" className="btn btn-primary">Enviar</button>
        </form>
      </div>
    </div>
  )
}
