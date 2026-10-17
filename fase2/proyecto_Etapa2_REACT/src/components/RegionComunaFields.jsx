import FormField from './FormField'
import { obtenerComunasPorRegion, obtenerListaRegiones } from '../utils/regiones-comunas'

/*
  RegionComunaFields: par de selects dependientes (la comuna depende de la región).
  Props: campo (la función de prepararFormulario), region (valor actual) y
  onCambiarRegion(nuevaRegion), donde el formulario debe también limpiar la comuna.
  Se dibuja como dos columnas (col-md-6) dentro de un `row`.
*/
export default function RegionComunaFields({ campo, region, onCambiarRegion }) {
  return (
    <>
      <div className="col-md-6">
        <FormField
          {...campo('region')}
          label="Región"
          as="select"
          opciones={obtenerListaRegiones()}
          onChange={(e) => onCambiarRegion(e.target.value)}
        />
      </div>
      <div className="col-md-6">
        <FormField {...campo('comuna')} label="Comuna" as="select" opciones={obtenerComunasPorRegion(region)} disabled={!region} />
      </div>
    </>
  )
}
