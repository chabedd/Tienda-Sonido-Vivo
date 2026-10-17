import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
// Bootstrap: solo el CSS (el menú colapsable lo controla React en Navbar). Luego nuestro
// tema, que debe ir DESPUÉS para poder sobrescribir las variables de Bootstrap.
import 'bootstrap/dist/css/bootstrap.min.css'
import './styles/theme.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { SessionProvider } from './context/SessionContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <SessionProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </SessionProvider>
    </BrowserRouter>
  </StrictMode>,
)
