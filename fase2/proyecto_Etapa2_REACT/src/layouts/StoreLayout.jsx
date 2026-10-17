import { Outlet, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useCart } from '../context/CartContext'
import { useSession } from '../context/SessionContext'

/*
  StoreLayout: "conecta" los contextos con el Navbar (que es presentacional)
  y define el marco común (Navbar + contenido + Footer). <Outlet/> muestra la página activa.
*/
export default function StoreLayout() {
  const { cantidadTotal } = useCart()
  const { usuario, cerrarSesion } = useSession()
  const navegar = useNavigate()

  const salir = () => {
    cerrarSesion()
    navegar('/')
  }

  return (
    <>
      <Navbar usuario={usuario} cantidadCarrito={cantidadTotal} onCerrarSesion={salir} />
      <main className="container py-4">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
