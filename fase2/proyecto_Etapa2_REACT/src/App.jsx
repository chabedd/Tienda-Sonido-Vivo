import { Route, Routes } from 'react-router-dom'
import StoreLayout from './layouts/StoreLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import Productos from './pages/Productos'
import DetalleProducto from './pages/DetalleProducto'
import Categorias from './pages/Categorias'
import Ofertas from './pages/Ofertas'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import PagoCorrecto from './pages/PagoCorrecto'
import PagoError from './pages/PagoError'
import Login from './pages/Login'
import Registro from './pages/Registro'
import Nosotros from './pages/Nosotros'
import Blogs from './pages/Blogs'
import DetalleBlog from './pages/DetalleBlog'
import Contacto from './pages/Contacto'
import NotFound from './pages/NotFound'
import Dashboard from './pages/admin/Dashboard'
import Ordenes from './pages/admin/Ordenes'
import DetalleOrden from './pages/admin/DetalleOrden'
import ProductosAdmin from './pages/admin/ProductosAdmin'
import ProductoNuevo from './pages/admin/ProductoNuevo'
import ProductoEditar from './pages/admin/ProductoEditar'
import ProductosCriticos from './pages/admin/ProductosCriticos'
import CategoriasAdmin from './pages/admin/CategoriasAdmin'
import CategoriaNueva from './pages/admin/CategoriaNueva'
import CategoriaEditar from './pages/admin/CategoriaEditar'
import UsuariosAdmin from './pages/admin/UsuariosAdmin'
import UsuarioNuevo from './pages/admin/UsuarioNuevo'
import UsuarioEditar from './pages/admin/UsuarioEditar'
import HistorialCompras from './pages/admin/HistorialCompras'
import Reportes from './pages/admin/Reportes'
import Perfil from './pages/admin/Perfil'

/*
  Mapa de rutas. Dos layouts anidados: la tienda (StoreLayout) y el panel (AdminLayout).
  Cada <Route> hija se dibuja dentro del <Outlet/> de su layout.
*/
export default function App() {
  return (
    <Routes>
      <Route element={<StoreLayout />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:codigo" element={<DetalleProducto />} />
        <Route path="categorias" element={<Categorias />} />
        <Route path="categorias/:id" element={<Categorias />} />
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="pago-correcto" element={<PagoCorrecto />} />
        <Route path="pago-error" element={<PagoError />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<DetalleBlog />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="ordenes" element={<Ordenes />} />
        <Route path="ordenes/:id" element={<DetalleOrden />} />
        <Route path="productos" element={<ProductosAdmin />} />
        <Route path="productos/nuevo" element={<ProductoNuevo />} />
        <Route path="productos/criticos" element={<ProductosCriticos />} />
        <Route path="productos/:codigo/editar" element={<ProductoEditar />} />
        <Route path="categorias" element={<CategoriasAdmin />} />
        <Route path="categorias/nueva" element={<CategoriaNueva />} />
        <Route path="categorias/:id/editar" element={<CategoriaEditar />} />
        <Route path="usuarios" element={<UsuariosAdmin />} />
        <Route path="usuarios/nuevo" element={<UsuarioNuevo />} />
        <Route path="usuarios/:run/editar" element={<UsuarioEditar />} />
        <Route path="usuarios/:run/historial" element={<HistorialCompras />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="perfil" element={<Perfil />} />
      </Route>
    </Routes>
  )
}
