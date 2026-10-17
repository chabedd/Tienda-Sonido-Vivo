import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AlertMessage from '../components/AlertMessage'
import FormField from '../components/FormField'
import { autenticar } from '../data/db'
import { useSession } from '../context/SessionContext'
import { prepararFormulario } from '../utils/formularios'
import { tieneAccesoAlPanel } from '../utils/roles'
import { ESQUEMA_LOGIN } from '../utils/validaciones'

/*
  Login: formulario con validación en vivo (prepararFormulario + reglas de utils).
  Estado: `valores`, `enviado` y `falloLogin` (credenciales incorrectas).
  Al validar OK se consulta db.js (autenticar) y se guarda la sesión en el contexto.
*/
export default function Login() {
  const [valores, setValores] = useState({ correo: '', password: '' })
  const [enviado, setEnviado] = useState(false)
  const { campo, hayErrores } = prepararFormulario(valores, setValores, ESQUEMA_LOGIN, enviado)
  const [falloLogin, setFalloLogin] = useState('')
  const { iniciarSesion } = useSession()
  const navegar = useNavigate()
  const { state } = useLocation()

  const enviar = (e) => {
    e.preventDefault()
    setEnviado(true)
    if (hayErrores) return
    const usuario = autenticar(valores.correo, valores.password)
    if (!usuario) {
      setFalloLogin('Correo o contraseña incorrectos.')
      return
    }
    iniciarSesion(usuario)
    navegar(state?.desde || (tieneAccesoAlPanel(usuario) ? '/admin' : '/'))
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-6 col-lg-4">
        <h1 className="h3 mb-4">Iniciar sesión</h1>
        <form onSubmit={enviar} noValidate>
          <FormField {...campo('correo')} label="Correo" type="email" autoComplete="email" />
          <FormField {...campo('password')} label="Contraseña" type="password" autoComplete="current-password" />
          <AlertMessage tipo="danger" mensaje={falloLogin} />
          <button type="submit" className="btn btn-primary w-100">Ingresar</button>
        </form>
        <p className="mt-3 small">¿No tienes cuenta? <Link to="/registro">Regístrate</Link></p>
        <p className="small text-muted">
          Cuentas de prueba: <code>maria.perez@gmail.com</code> / <code>admin123</code> (administradora) ·{' '}
          <code>camila.rojas@gmail.com</code> / <code>cli123</code> (cliente).
        </p>
      </div>
    </div>
  )
}
