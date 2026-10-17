import { useState } from 'react'
import { Link } from 'react-router-dom'
import AlertMessage from './AlertMessage'
import FormField from './FormField'
import { prepararFormulario } from '../utils/formularios'
import { ESQUEMA_PRODUCTO } from '../utils/validaciones'

const VACIO = {
  codigo: '', nombre: '', categoria: '', marca: '', modelo: '', descripcion: '', imagen: '',
  precio: '', stock: '', stockCritico: '', oferta: false, precioOferta: '',
}

/*
  ProductoForm: formulario compartido por "nuevo" y "editar" (una responsabilidad:
  capturar y validar los datos de un producto). Props:
   - inicial: valores de partida (vacío o el producto a editar)
   - modoEdicion: el código identifica al producto, por eso se bloquea al editar
   - categorias: nombres para el <select>
   - onGuardar(valores): lo que pasa al enviar lo decide la página
   - errorGeneral: error que viene de fuera (p. ej. código duplicado)
*/
export default function ProductoForm({ inicial = VACIO, modoEdicion = false, categorias, onGuardar, errorGeneral = '' }) {
  const [valores, setValores] = useState(inicial)
  const [enviado, setEnviado] = useState(false)
  const { campo, hayErrores } = prepararFormulario(valores, setValores, ESQUEMA_PRODUCTO, enviado)

  const enviar = (e) => {
    e.preventDefault()
    setEnviado(true)
    if (!hayErrores) onGuardar(valores)
  }

  return (
    <form onSubmit={enviar} noValidate>
      <div className="row">
        <div className="col-md-4"><FormField {...campo('codigo')} label="Código" readOnly={modoEdicion} /></div>
        <div className="col-md-8"><FormField {...campo('nombre')} label="Nombre" /></div>
        <div className="col-md-4"><FormField {...campo('categoria')} label="Categoría" as="select" opciones={categorias} /></div>
        <div className="col-md-4"><FormField {...campo('marca')} label="Marca (opcional)" /></div>
        <div className="col-md-4"><FormField {...campo('modelo')} label="Modelo (opcional)" /></div>
        <div className="col-12"><FormField {...campo('descripcion')} label="Descripción (opcional)" as="textarea" /></div>
        <div className="col-md-4"><FormField {...campo('precio')} label="Precio (CLP)" inputMode="decimal" /></div>
        <div className="col-md-4"><FormField {...campo('stock')} label="Stock" inputMode="numeric" /></div>
        <div className="col-md-4"><FormField {...campo('stockCritico')} label="Stock crítico (opcional)" inputMode="numeric" /></div>
        <div className="col-12"><FormField {...campo('imagen')} label="URL de la imagen (opcional)" /></div>
        <div className="col-md-4">
          <div className="form-check mb-3">
            <input id="oferta" type="checkbox" className="form-check-input" checked={valores.oferta}
              onChange={(e) => setValores({ ...valores, oferta: e.target.checked })} />
            <label htmlFor="oferta" className="form-check-label">Producto en oferta</label>
          </div>
        </div>
        {valores.oferta && (
          <div className="col-md-4"><FormField {...campo('precioOferta')} label="Precio de oferta (CLP)" inputMode="decimal" /></div>
        )}
      </div>
      <AlertMessage tipo="danger" mensaje={errorGeneral} />
      <button type="submit" className="btn btn-primary me-2">{modoEdicion ? 'Guardar cambios' : 'Crear producto'}</button>
      <Link to="/admin/productos" className="btn btn-outline-secondary">Cancelar</Link>
    </form>
  )
}
